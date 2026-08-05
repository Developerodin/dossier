/**
 * Re-sync all published posts into the search index (e.g. after beforeSync changes).
 * Run: pnpm resync:search
 */
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dirname, '..')
dotenv.config({ path: path.resolve(root, '.env.local') })
dotenv.config({ path: path.resolve(root, '.env') })

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })

  const posts = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 1000,
    pagination: false,
    where: { _status: { equals: 'published' } },
    select: { id: true, title: true },
  })

  for (const post of posts.docs) {
    await payload.update({
      collection: 'posts',
      id: post.id,
      data: {},
      context: { disableRevalidate: true },
    })
    payload.logger.info(`Re-synced search index for post: ${post.title}`)
  }

  payload.logger.info(`Done. re-synced=${posts.docs.length}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
