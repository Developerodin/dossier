import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load env BEFORE importing Payload config so the Blob plugin sees the token.
const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dirname, '..')
dotenv.config({ path: path.resolve(root, '.env.local') })
dotenv.config({ path: path.resolve(root, '.env') })

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error(
    'BLOB_READ_WRITE_TOKEN is missing. Create a Vercel Blob store and pull env vars before seeding.',
  )
  process.exit(1)
}

const { createLocalReq, getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')
const { seed } = await import('../src/endpoints/seed')

async function main() {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)
  await seed({ payload, req })

  const sample = await payload.find({ collection: 'media', limit: 1, depth: 0 })
  const url = sample.docs[0]?.url || ''
  const filename = sample.docs[0]?.filename || ''
  const looksLikeBlobProxy =
    /blob\.vercel-storage\.com/.test(url) ||
    // Vercel Blob addRandomSuffix leaves a long alphanumeric token in the filename
    /-[A-Za-z0-9]{20,}\.(jpe?g|png|webp|gif)$/i.test(filename) ||
    /-[A-Za-z0-9]{20,}\.(jpe?g|png|webp|gif)$/i.test(url)

  if (!looksLikeBlobProxy) {
    console.error('Seed finished but media does not look Blob-backed:', { url, filename })
    process.exit(1)
  }

  payload.logger.info(`Blob media OK: ${url}`)
  payload.logger.info('Seed finished.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
