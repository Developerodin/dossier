/**
 * One-off: ensure Trending category exists and assign sample posts + viewCounts.
 * Run: pnpm exec tsx src/scripts/ensure-trending.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const TRENDING_POSTS: { slug: string; viewCount: number }[] = [
  { slug: 'spacex-raises-1-5b', viewCount: 128000 },
  { slug: 'openai-launches-gpt-5', viewCount: 96000 },
  { slug: 'apple-previews-ios-19', viewCount: 64000 },
  { slug: 'figma-files-for-ipo', viewCount: 52000 },
  { slug: 'anthropic-launches-claude-4', viewCount: 45000 },
]

async function main() {
  const payload = await getPayload({ config })

  let trending = (
    await payload.find({
      collection: 'categories',
      where: { slug: { equals: 'trending' } },
      limit: 1,
      pagination: false,
    })
  ).docs[0]

  if (!trending) {
    trending = await payload.create({
      collection: 'categories',
      data: {
        title: 'Trending',
        slug: 'trending',
        description: 'The stories everyone is talking about right now.',
        accentColor: '#7C3AED',
      },
      context: { disableRevalidate: true },
    })
    payload.logger.info(`Created Trending category id=${trending.id}`)
  } else {
    payload.logger.info(`Trending category already exists id=${trending.id}`)
  }

  for (const { slug, viewCount } of TRENDING_POSTS) {
    const existing = (
      await payload.find({
        collection: 'posts',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
        pagination: false,
      })
    ).docs[0]

    if (!existing) {
      payload.logger.warn(`Post not found: ${slug}`)
      continue
    }

    const categoryIds = (existing.categories ?? [])
      .map((c) => (typeof c === 'object' && c !== null ? c.id : c))
      .filter((id): id is number => typeof id === 'number')

    if (!categoryIds.includes(trending.id)) {
      categoryIds.push(trending.id)
    }

    await payload.update({
      collection: 'posts',
      id: existing.id,
      data: {
        categories: categoryIds,
        viewCount,
      },
      context: { disableRevalidate: true },
    })

    payload.logger.info(`Updated ${slug} → categories=${categoryIds.join(',')} views=${viewCount}`)
  }

  payload.logger.info('Done ensuring trending data.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
