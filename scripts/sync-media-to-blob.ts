/**
 * Upload local public/media files to Vercel Blob so filenames in the DB resolve.
 * Does NOT patch URL columns — with disablePayloadAccessControl the adapter
 * regenerates CDN URLs from filename on every read.
 *
 * Usage:
 *   pnpm sync:media
 *   # or against production env:
 *   pnpm dlx vercel env run -e production -- pnpm sync:media
 */
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { pathToFileURL, fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dirname, '..')
dotenv.config({ path: path.resolve(root, '.env.local') })
dotenv.config({ path: path.resolve(root, '.env') })

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) {
  console.error('BLOB_READ_WRITE_TOKEN is missing')
  process.exit(1)
}

const storeId = token.match(/^vercel_blob_rw_([a-z\d]+)_/i)?.[1]?.toLowerCase()
if (!storeId) {
  console.error('Could not parse store id from BLOB_READ_WRITE_TOKEN')
  process.exit(1)
}
const blobBase = `https://${storeId}.public.blob.vercel-storage.com`

const blobCandidates = [
  path.resolve(root, 'node_modules/@vercel/blob'),
  ...fs
    .readdirSync(path.resolve(root, 'node_modules/.pnpm'))
    .filter((name) => name.startsWith('@vercel+blob@'))
    .map((name) => path.resolve(root, 'node_modules/.pnpm', name, 'node_modules/@vercel/blob')),
]
const blobDir = blobCandidates.find((candidate) => fs.existsSync(path.join(candidate, 'package.json')))
if (!blobDir) {
  console.error('Could not locate @vercel/blob package')
  process.exit(1)
}
const { put, head } = await import(pathToFileURL(path.join(blobDir, 'dist/index.js')).href)

const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')

const mediaDir = path.resolve(root, 'public/media')
const SIZE_KEYS = ['thumbnail', 'square', 'small', 'medium', 'large', 'xlarge', 'og'] as const

function contentTypeFor(filename: string): string {
  const lower = filename.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.gif')) return 'image/gif'
  if (lower.endsWith('.svg')) return 'image/svg+xml'
  return 'image/jpeg'
}

async function blobExists(url: string): Promise<boolean> {
  try {
    await head(url, { token })
    return true
  } catch {
    return false
  }
}

function resolveLocal(filename: string): string | null {
  const direct = path.join(mediaDir, filename)
  if (fs.existsSync(direct)) return direct
  return null
}

async function ensureOnBlob(filename: string): Promise<'ok' | 'uploaded' | 'missing'> {
  const url = `${blobBase}/${filename}`
  if (await blobExists(url)) return 'ok'

  const localPath = resolveLocal(filename)
  if (!localPath) return 'missing'

  const buffer = fs.readFileSync(localPath)
  await put(filename, buffer, {
    access: 'public',
    token,
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: contentTypeFor(filename),
  })
  return 'uploaded'
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (true) {
        const i = next++
        if (i >= items.length) return
        results[i] = await worker(items[i]!)
      }
    }),
  )
  return results
}

console.log(`Blob base: ${blobBase}`)
console.log('Loading Payload…')
const payload = await getPayload({ config })
const media = await payload.find({
  collection: 'media',
  limit: 1000,
  depth: 0,
  pagination: false,
})

const filenames = new Set<string>()
for (const doc of media.docs) {
  if (doc.filename) filenames.add(doc.filename)
  for (const key of SIZE_KEYS) {
    const size = doc.sizes?.[key]
    if (size?.filename) filenames.add(size.filename)
  }
}

const list = [...filenames]
console.log(`Media docs: ${media.docs.length}; unique files: ${list.length}`)

let ok = 0
let uploaded = 0
let missing = 0
const missingFiles: string[] = []

await mapPool(list, 8, async (filename) => {
  try {
    const result = await ensureOnBlob(filename)
    if (result === 'ok') {
      ok += 1
      console.log(`OK  ${filename}`)
    } else if (result === 'uploaded') {
      uploaded += 1
      console.log(`UP  ${filename}`)
    } else {
      missing += 1
      missingFiles.push(filename)
      console.error(`MISS ${filename}`)
    }
  } catch (err) {
    missing += 1
    const msg = err instanceof Error ? err.message : String(err)
    missingFiles.push(`${filename} (${msg})`)
    console.error(`FAIL ${filename}: ${msg}`)
  }
})

console.log(`\nDone. ok=${ok} uploaded=${uploaded} missing=${missing}`)
if (missingFiles.length) {
  console.error('Missing local files:')
  for (const f of missingFiles.slice(0, 30)) console.error(` - ${f}`)
  process.exit(1)
}

// Spot-check: regenerated afterRead URL should hit Blob with 200
const sample = media.docs[0]
if (sample?.filename) {
  const checkUrl = `${blobBase}/${sample.filename}`
  const res = await fetch(checkUrl, { method: 'HEAD' })
  console.log(`Spot-check ${checkUrl} -> ${res.status}`)
}

process.exit(0)
