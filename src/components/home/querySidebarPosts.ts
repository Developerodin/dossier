import { cache } from 'react'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { HomePostCard } from './types'
import { homeCardSelect } from './types'

export const queryPopularPosts = cache(async (limit = 5): Promise<HomePostCard[]> => {
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
    sort: '-viewCount',
    where: {
      and: [...publishedFilter],
    },
  })

  return result.docs as HomePostCard[]
})

export const queryMostSharedPosts = cache(async (limit = 5): Promise<HomePostCard[]> => {
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
    sort: '-shareCount',
    where: {
      and: [...publishedFilter],
    },
  })

  return result.docs as HomePostCard[]
})

export const queryLatestPosts = cache(async (limit = 8): Promise<HomePostCard[]> => {
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
      and: [...publishedFilter],
    },
  })

  return result.docs as HomePostCard[]
})
