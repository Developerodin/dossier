/**
 * Create default nav/explore categories if missing (non-destructive).
 * Run: pnpm ensure:categories
 */
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dirname, '..')
dotenv.config({ path: path.resolve(root, '.env.local') })
dotenv.config({ path: path.resolve(root, '.env') })

const defaultCategories = [
  { title: 'Top Story', slug: 'top-story', description: 'The biggest tech stories shaping the industry right now.', accentColor: '#1A1A1A' },
  { title: 'AI', slug: 'ai', description: 'Artificial intelligence news and breakthroughs.', accentColor: '#7C3AED' },
  { title: 'Startups', slug: 'startups', description: 'Fresh ideas, funding and startup journeys.', accentColor: '#0D9488' },
  { title: 'Funding', slug: 'funding', description: 'Investments, rounds and market insights.', accentColor: '#2563EB' },
  { title: 'Big Tech', slug: 'big-tech', description: "Updates from the world's leading tech giants.", accentColor: '#EA580C' },
  { title: 'SaaS', slug: 'saas', description: 'Software, platforms and cloud innovation.', accentColor: '#8B5CF6' },
  { title: 'FinTech', slug: 'fintech', description: 'Finance, payments and digital banking.', accentColor: '#059669' },
  { title: 'Cybersecurity', slug: 'cybersecurity', description: 'Threats, protection and digital safety.', accentColor: '#DC2626' },
  { title: 'Climate Tech', slug: 'climate-tech', description: 'Sustainable solutions for a better future.', accentColor: '#16A34A' },
  { title: 'Apple', slug: 'apple', description: 'Products, updates and ecosystem news.', accentColor: '#171717' },
  { title: 'SpaceX', slug: 'spacex', description: 'Space exploration and SpaceX updates.', accentColor: '#1D4ED8' },
  { title: 'Cloud', slug: 'cloud', description: 'Infrastructure, platforms and cloud-native tooling.', accentColor: '#0284C7' },
  { title: 'Gadgets', slug: 'gadgets', description: 'Hardware launches, wearables and consumer tech.', accentColor: '#DB2777' },
  { title: 'Crypto', slug: 'crypto', description: 'Digital assets, protocols and on-chain markets.', accentColor: '#D97706' },
  { title: 'Trending', slug: 'trending', description: 'The stories everyone is talking about right now.', accentColor: '#7C3AED' },
] as const

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })

  let created = 0
  let skipped = 0

  for (const category of defaultCategories) {
    const existing = (
      await payload.find({
        collection: 'categories',
        where: { slug: { equals: category.slug } },
        limit: 1,
        pagination: false,
      })
    ).docs[0]

    if (existing) {
      skipped++
      continue
    }

    await payload.create({
      collection: 'categories',
      data: category,
      context: { disableRevalidate: true },
    })
    created++
    payload.logger.info(`Created category: ${category.slug}`)
  }

  payload.logger.info(`Done. created=${created} skipped=${skipped}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
