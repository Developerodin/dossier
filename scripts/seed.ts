import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load env BEFORE importing Payload config so the S3 plugin sees credentials.
const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dirname, '..')
dotenv.config({ path: path.resolve(root, '.env.local') })
dotenv.config({ path: path.resolve(root, '.env') })

const s3Ready = Boolean(
  process.env.S3_BUCKET &&
    process.env.S3_REGION &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY,
)

if (!s3Ready) {
  console.error(
    'S3 env vars are missing. Set S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY before seeding.',
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
  const looksLikeS3 =
    /amazonaws\.com/.test(url) ||
    (process.env.S3_PUBLIC_URL && url.startsWith(process.env.S3_PUBLIC_URL)) ||
    /\.cloudfront\.net/.test(url)

  if (!looksLikeS3) {
    console.error('Seed finished but media does not look S3-backed:', { url, filename })
    process.exit(1)
  }

  payload.logger.info(`S3 media OK: ${url}`)
  payload.logger.info('Seed finished.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
