/**
 * Migrate Payload media files to Vercel Blob and write absolute Blob URLs into Neon.
 *
 * - Does NOT reseed or wipe content
 * - Does NOT use Picsum at runtime
 * - Clears payload_migrations batch=-1 so Vercel builds do not hang
 *
 * Run (production Neon + Blob token):
 *   pnpm dlx vercel env run -e production -- node --import=tsx/esm scripts/migrate-media-to-blob.ts
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import dotenv from 'dotenv'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dirname, '..')
const mediaDir = path.resolve(root, 'public/media')

function resolveVercelBlobPut() {
  const pnpmRoot = path.join(root, 'node_modules/.pnpm')
  if (!fs.existsSync(pnpmRoot)) {
    throw new Error('node_modules/.pnpm not found; install dependencies first')
  }
  const entries = fs.readdirSync(pnpmRoot).filter((name) => name.startsWith('@vercel+blob@'))
  if (!entries.length) {
    throw new Error('@vercel/blob not found under node_modules/.pnpm')
  }
  const pkgDir = path.join(pnpmRoot, entries[0], 'node_modules/@vercel/blob')
  return pathToFileURL(path.join(pkgDir, 'dist/index.js')).href
}

const { put } = await import(resolveVercelBlobPut())

const SIZE_KEYS = ['thumbnail', 'square', 'small', 'medium', 'large', 'xlarge', 'og'] as const

// Prefer env already injected (vercel env run). Only fill missing keys from local files.
dotenv.config({ path: path.resolve(root, '.env.local'), override: false })
dotenv.config({ path: path.resolve(root, '.env'), override: false })

function isBlobUrl(url: string | null | undefined): boolean {
  return Boolean(url && /public\.blob\.vercel-storage\.com/i.test(url))
}

function blobBaseFromEnv(): string {
  const fromEnv = (process.env.NEXT_PUBLIC_BLOB_BASE_URL || '').replace(/\/$/, '')
  if (fromEnv) return fromEnv
  const token = process.env.BLOB_READ_WRITE_TOKEN || ''
  const match = token.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)
  if (!match) return ''
  return `https://${match[1].toLowerCase()}.public.blob.vercel-storage.com`
}

/** Candidate local filenames for a DB filename (handles -N counters and Blob random suffixes). */
function localCandidates(filename: string): string[] {
  const out: string[] = [filename]

  // Strip long Vercel Blob random suffix: name-AbCdEf....jpg → name.jpg
  const noRandom = filename.replace(/-[A-Za-z0-9]{16,}(?=\.[^.]+$)/, '')
  if (noRandom !== filename) out.push(noRandom)

  // name-4-900x506.jpg → name-900x506.jpg, name-4.jpg, name.jpg
  const sized = noRandom.match(/^(.*?)-(\d+)(-\d+x\d+)(\.[^.]+)$/)
  if (sized) {
    const [, base, , size, ext] = sized
    out.push(`${base}${size}${ext}`)
    out.push(`${base}-${sized[2]}${ext}`)
    out.push(`${base}${ext}`)
  }

  // name-4.jpg → name.jpg
  const numbered = noRandom.match(/^(.*)-(\d+)(\.[^.]+)$/)
  if (numbered && !sized) {
    out.push(`${numbered[1]}${numbered[3]}`)
  }

  // name-900x506.jpg already covered when no counter
  return [...new Set(out)]
}

function resolveLocalFile(filename: string): string | null {
  for (const candidate of localCandidates(filename)) {
    const full = path.join(mediaDir, candidate)
    if (fs.existsSync(full) && fs.statSync(full).isFile()) return full
  }
  return null
}

async function blobExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}

async function ensureOnBlob(opts: {
  filename: string
  token: string
  blobBase: string
}): Promise<string> {
  const { filename, token, blobBase } = opts
  const directUrl = `${blobBase}/${filename}`

  if (await blobExists(directUrl)) return directUrl

  const localPath = resolveLocalFile(filename)
  if (!localPath) {
    throw new Error(`No local file and not on Blob: ${filename}`)
  }

  const buffer = fs.readFileSync(localPath)
  const contentType = filename.toLowerCase().endsWith('.png')
    ? 'image/png'
    : filename.toLowerCase().endsWith('.webp')
      ? 'image/webp'
      : filename.toLowerCase().endsWith('.gif')
        ? 'image/gif'
        : 'image/jpeg'

  const result = await put(filename, buffer, {
    access: 'public',
    token,
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType,
  })

  return result.url
}

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    console.error('BLOB_READ_WRITE_TOKEN is missing')
    process.exit(1)
  }
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing')
    process.exit(1)
  }

  const blobBase = blobBaseFromEnv()
  if (!blobBase) {
    console.error('Could not determine Blob base URL (set NEXT_PUBLIC_BLOB_BASE_URL)')
    process.exit(1)
  }

  console.log('Blob base:', blobBase)
  console.log('Media dir:', mediaDir)

  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })

  // Unblock Vercel builds: remove Payload "dev mode" migration marker
  try {
    const cleared = await payload.db.pool.query(
      'DELETE FROM payload_migrations WHERE batch = -1 RETURNING id, name, batch',
    )
    console.log(`Cleared batch=-1 markers: ${cleared.rowCount}`)
  } catch (err) {
    console.warn('Could not clear batch=-1 (non-fatal):', err)
  }

  const media = await payload.find({
    collection: 'media',
    limit: 500,
    depth: 0,
    pagination: false,
  })

  let migrated = 0
  let alreadyOk = 0
  let failed = 0
  const failures: string[] = []

  for (const doc of media.docs) {
    const label = `${doc.id}:${doc.filename || 'unknown'}`

    const originalAlreadyBlob = isBlobUrl(doc.url)
    const sizes = doc.sizes || {}
    const allSizeUrlsBlob = SIZE_KEYS.every((key) => {
      const size = sizes[key]
      if (!size?.filename && !size?.url) return true
      return isBlobUrl(size.url)
    })

    if (originalAlreadyBlob && allSizeUrlsBlob) {
      alreadyOk += 1
      console.log(`OK  ${label}`)
      continue
    }

    try {
      if (!doc.filename) throw new Error('media doc has no filename')

      const newUrl = await ensureOnBlob({ filename: doc.filename, token, blobBase })
      const sizeUrlByKey: Partial<Record<(typeof SIZE_KEYS)[number], string>> = {}

      for (const key of SIZE_KEYS) {
        const size = sizes[key]
        if (!size?.filename) continue
        if (isBlobUrl(size.url)) {
          sizeUrlByKey[key] = size.url!
          continue
        }
        sizeUrlByKey[key] = await ensureOnBlob({ filename: size.filename, token, blobBase })
      }

      // Payload upload `url` fields are effectively managed by the adapter; patch via SQL.
      const sets: string[] = ['url = $1', 'updated_at = NOW()']
      const values: unknown[] = [newUrl]
      let p = 2
      for (const key of SIZE_KEYS) {
        const sizeUrl = sizeUrlByKey[key]
        if (!sizeUrl) continue
        sets.push(`sizes_${key}_url = $${p}`)
        values.push(sizeUrl)
        p += 1
      }
      values.push(doc.id)
      await payload.db.pool.query(
        `UPDATE media SET ${sets.join(', ')} WHERE id = $${p}`,
        values,
      )

      migrated += 1
      console.log(`MIG ${label} -> ${newUrl}`)
    } catch (err) {
      failed += 1
      const msg = err instanceof Error ? err.message : String(err)
      failures.push(`${label}: ${msg}`)
      console.error(`FAIL ${label}: ${msg}`)
    }
  }

  console.log('\n--- Summary ---')
  console.log(`total:     ${media.docs.length}`)
  console.log(`migrated:  ${migrated}`)
  console.log(`alreadyOk: ${alreadyOk}`)
  console.log(`failed:    ${failed}`)
  if (failures.length) {
    console.log('\nFailures:')
    for (const f of failures) console.log(` - ${f}`)
  }

  // Spot-check from SQL (source of truth after patch)
  const check = await payload.db.pool.query(
    'SELECT id, filename, url, sizes_medium_url FROM media ORDER BY id LIMIT 5',
  )
  for (const row of check.rows) {
    console.log(
      `check id=${row.id} blob=${/blob\.vercel-storage\.com/.test(row.url)} url=${row.url}`,
    )
  }

  const bad = await payload.db.pool.query(
    `SELECT count(*)::int AS n FROM media WHERE url IS NULL OR url NOT LIKE '%blob.vercel-storage.com%'`,
  )
  console.log(`rows_without_blob_url: ${bad.rows[0].n}`)

  process.exit(failed > 0 || bad.rows[0].n > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
