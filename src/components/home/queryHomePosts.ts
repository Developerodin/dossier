import { cache } from 'react'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { BreakingNewsItem, HomePostCard } from './types'
import { homeCardSelect } from './types'

export type HomePostsData = {
  featured: HomePostCard | null
  breaking: BreakingNewsItem[]
  latest: HomePostCard[]
  editorsPicks: HomePostCard[]
}

export const queryHomePosts = cache(async (): Promise<HomePostsData> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const publishedFilter = draft ? [] : [{ _status: { equals: 'published' as const } }]

  const [featuredResult, editorsPicksResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 1,
      draft,
      limit: 1,
      overrideAccess: draft,
      pagination: false,
      select: homeCardSelect,
      sort: 'featuredOrder',
      where: {
        and: [{ featured: { equals: true } }, ...publishedFilter],
      },
    }),
    payload.find({
      collection: 'posts',
      depth: 1,
      draft,
      limit: 5,
      overrideAccess: draft,
      pagination: false,
      select: homeCardSelect,
      sort: 'editorsPickOrder',
      where: {
        and: [{ editorsPick: { equals: true } }, ...publishedFilter],
      },
    }),
  ])

  const featured = (featuredResult.docs[0] as HomePostCard | undefined) ?? null
  const featuredId = featured?.id
  let editorsPicks = editorsPicksResult.docs as HomePostCard[]

  const [breakingResult, latestResult, editorsFallbackResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 0,
      draft,
      limit: 12,
      overrideAccess: draft,
      pagination: false,
      select: {
        title: true,
        slug: true,
      },
      sort: '-publishedAt',
      where: {
        and: [{ breakingNews: { equals: true } }, ...publishedFilter],
      },
    }),
    payload.find({
      collection: 'posts',
      depth: 1,
      draft,
      limit: 8,
      overrideAccess: draft,
      pagination: false,
      select: homeCardSelect,
      sort: '-publishedAt',
      where: {
        and: [
          ...(featuredId ? [{ id: { not_equals: featuredId } }] : []),
          ...publishedFilter,
        ],
      },
    }),
    // Fallback when no posts are flagged as editor's picks yet
    editorsPicks.length === 0
      ? payload.find({
          collection: 'posts',
          depth: 1,
          draft,
          limit: 5,
          overrideAccess: draft,
          pagination: false,
          select: homeCardSelect,
          sort: '-publishedAt',
          where: {
            and: [...publishedFilter],
          },
        })
      : Promise.resolve(null),
  ])

  if (editorsPicks.length === 0 && editorsFallbackResult) {
    editorsPicks = editorsFallbackResult.docs as HomePostCard[]
  }

  return {
    featured,
    breaking: breakingResult.docs as BreakingNewsItem[],
    latest: latestResult.docs as HomePostCard[],
    editorsPicks,
  }
})
