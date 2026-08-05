/**
 * Upload local public/media files to S3 so existing DB filenames resolve.
 *
 * Usage:
 *   pnpm sync:media
 */
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PutObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dirname, '..')
dotenv.config({ path: path.resolve(root, '.env.local') })
dotenv.config({ path: path.resolve(root, '.env') })

const bucket = process.env.S3_BUCKET
const region = process.env.S3_REGION
const accessKeyId = process.env.S3_ACCESS_KEY_ID
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY

if (!bucket || !region || !accessKeyId || !secretAccessKey) {
  console.error('Missing S3 env vars: S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY')
  process.exit(1)
}

const endpoint = process.env.S3_ENDPOINT || `https://s3.${region}.amazonaws.com`
const mediaDir = path.resolve(root, 'public/media')

if (!fs.existsSync(mediaDir)) {
  console.error(`No local media folder at ${mediaDir}`)
  process.exit(1)
}

const client = new S3Client({
  credentials: { accessKeyId, secretAccessKey },
  region,
  endpoint,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
})

const files = fs.readdirSync(mediaDir).filter((name) => !name.startsWith('.'))

async function main() {
  let uploaded = 0
  let skipped = 0

  for (const filename of files) {
    const filePath = path.join(mediaDir, filename)
    if (!fs.statSync(filePath).isFile()) continue

    try {
      await client.send(new HeadObjectCommand({ Bucket: bucket, Key: filename }))
      skipped++
      continue
    } catch {
      // not found — upload below
    }

    const body = fs.readFileSync(filePath)
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: filename,
        Body: body,
        ContentType: guessContentType(filename),
      }),
    )
    uploaded++
    console.log(`Uploaded ${filename}`)
  }

  console.log(`Done. uploaded=${uploaded} skipped=${skipped}`)
}

function guessContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.pdf': 'application/pdf',
  }
  return map[ext] || 'application/octet-stream'
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
