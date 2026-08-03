import { cache } from 'react'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { HomePostCard } from './types'
import { homeCardSelect } from './types'

export const queryTrendingPosts = cache(async (): Promise<HomePostCard[]> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const publishedFilter = draft ? [] : [{ _status: { equals: 'published' as const } }]

  // Single query via relationship slug filter (avoids category-then-posts waterfall).
  // Fallback: if this returns empty unexpectedly, check that a "trending" category exists
  // and posts are assigned to it — previously we looked up category id first.
  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    draft,
    limit: 10,
    overrideAccess: draft,
    pagination: false,
    select: homeCardSelect,
    sort: '-publishedAt',
    where: {
      and: [{ 'categories.slug': { equals: 'trending' } }, ...publishedFilter],
    },
  })

  return result.docs as HomePostCard[]
})
