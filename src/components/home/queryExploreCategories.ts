import { cache } from 'react'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export type ExploreCategory = {
  id: number
  title: string
  slug: string
  description: string
  accentColor: string
  articleCount: number
}

/** Design order, then newly added categories. */
const EXPLORE_SLUG_ORDER = [
  'ai',
  'startups',
  'funding',
  'big-tech',
  'saas',
  'fintech',
  'cybersecurity',
  'climate-tech',
  'apple',
  'spacex',
  'cloud',
  'gadgets',
  'crypto',
] as const

function categoryIdFromRel(cat: number | { id: number } | null | undefined): number | null {
  if (typeof cat === 'number') return cat
  if (cat && typeof cat === 'object' && typeof cat.id === 'number') return cat.id
  return null
}

export const queryExploreCategories = cache(async (): Promise<ExploreCategory[]> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const publishedFilter = draft ? [] : [{ _status: { equals: 'published' as const } }]

  const [categoriesResult, postsResult] = await Promise.all([
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 50,
      overrideAccess: false,
      pagination: false,
      where: {
        and: [
          { slug: { not_equals: 'top-story' } },
          { slug: { not_equals: 'trending' } },
        ],
      },
    }),
    payload.find({
      collection: 'posts',
      depth: 0,
      draft,
      limit: 1000,
      overrideAccess: draft,
      pagination: false,
      select: {
        categories: true,
      },
      where: {
        and: [...publishedFilter],
      },
    }),
  ])

  const counts = new Map<number, number>()
  for (const post of postsResult.docs) {
    const cats = post.categories
    if (!Array.isArray(cats)) continue
    for (const cat of cats) {
      const id = categoryIdFromRel(cat as number | { id: number })
      if (id == null) continue
      counts.set(id, (counts.get(id) ?? 0) + 1)
    }
  }

  const categories: ExploreCategory[] = categoriesResult.docs.map((doc) => ({
    id: doc.id,
    title: doc.title,
    slug: doc.slug ?? '',
    description: doc.description ?? '',
    accentColor: doc.accentColor ?? '#6366F1',
    articleCount: counts.get(doc.id) ?? 0,
  }))

  const orderIndex = new Map(EXPLORE_SLUG_ORDER.map((slug, i) => [slug, i]))

  return categories
    .filter((cat) => Boolean(cat.slug))
    .sort((a, b) => {
      const ai = orderIndex.get(a.slug as (typeof EXPLORE_SLUG_ORDER)[number]) ?? 999
      const bi = orderIndex.get(b.slug as (typeof EXPLORE_SLUG_ORDER)[number]) ?? 999
      if (ai !== bi) return ai - bi
      return a.title.localeCompare(b.title)
    })
})
