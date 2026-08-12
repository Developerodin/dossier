import { cache } from 'react'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { HomePostCard } from './types'
import { homeCardSelect } from './types'

export const queryVideoNewsPosts = cache(async (): Promise<HomePostCard[]> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const publishedFilter = draft ? [] : [{ _status: { equals: 'published' as const } }]

  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    draft,
    limit: 6,
    overrideAccess: draft,
    pagination: false,
    select: homeCardSelect,
    sort: '-publishedAt',
    where: {
      and: [
        { videoNews: { equals: true } },
        { videoUrl: { exists: true } },
        { videoUrl: { not_equals: '' } },
        ...publishedFilter,
      ],
    },
  })

  return result.docs as HomePostCard[]
})
