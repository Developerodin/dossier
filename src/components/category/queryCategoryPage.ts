import { cache } from 'react'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Category } from '@/payload-types'
import { CATEGORY_POSTS_PER_PAGE, type CategoryPostCardData } from './types'

export type CategoryPageData = {
  category: Category
  posts: CategoryPostCardData[]
  page: number
  totalPages: number
  totalDocs: number
}

const categoryPostSelect = {
  title: true,
  slug: true,
  heroImage: true,
  categories: true,
  publishedAt: true,
  authors: true,
  populatedAuthors: true,
} as const

export const queryCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs[0] ?? null
})

export const queryCategoryPosts = cache(
  async (categoryId: number, page = 1): Promise<Omit<CategoryPageData, 'category'>> => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'posts',
      depth: 1,
      draft,
      limit: CATEGORY_POSTS_PER_PAGE,
      overrideAccess: draft,
      page,
      sort: '-publishedAt',
      where: {
        and: [
          {
            categories: {
              in: [categoryId],
            },
          },
          ...(draft ? [] : [{ _status: { equals: 'published' as const } }]),
        ],
      },
      select: categoryPostSelect,
    })

    return {
      posts: result.docs as CategoryPostCardData[],
      page: result.page ?? page,
      totalPages: result.totalPages ?? 1,
      totalDocs: result.totalDocs,
    }
  },
)

export const queryCategoryPage = cache(
  async (slug: string, page = 1): Promise<CategoryPageData | null> => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const publishedFilter = draft ? [] : [{ _status: { equals: 'published' as const } }]

    // Fetch category and posts in parallel (posts filtered by category slug).
    const [category, postsResult] = await Promise.all([
      queryCategoryBySlug(slug),
      payload.find({
        collection: 'posts',
        depth: 1,
        draft,
        limit: CATEGORY_POSTS_PER_PAGE,
        overrideAccess: draft,
        page,
        sort: '-publishedAt',
        where: {
          and: [{ 'categories.slug': { equals: slug } }, ...publishedFilter],
        },
        select: categoryPostSelect,
      }),
    ])

    if (!category) return null

    return {
      category,
      posts: postsResult.docs as CategoryPostCardData[],
      page: postsResult.page ?? page,
      totalPages: postsResult.totalPages ?? 1,
      totalDocs: postsResult.totalDocs,
    }
  },
)
