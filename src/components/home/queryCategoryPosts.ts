import { cache } from 'react'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { HomePostCard } from './types'
import { homeCardSelect } from './types'

export const HOME_CATEGORY_SLUGS = ['ai', 'startups', 'big-tech'] as const
export type HomeCategorySlug = (typeof HOME_CATEGORY_SLUGS)[number]

export const queryCategoryPosts = cache(
  async (slug: HomeCategorySlug, limit = 4): Promise<HomePostCard[]> => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })
    const publishedFilter = draft ? [] : [{ _status: { equals: 'published' as const } }]

    const result = await payload.find({
      collection: 'posts',
      depth: 1,
      draft,
      limit,
      overrideAccess: draft,
      pagination: false,
      select: homeCardSelect,
      sort: '-publishedAt',
      where: {
        and: [{ 'categories.slug': { equals: slug } }, ...publishedFilter],
      },
    })

    return result.docs as HomePostCard[]
  },
)
