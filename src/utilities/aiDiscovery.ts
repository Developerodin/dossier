import configPromise from '@payload-config'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import type { Category, Post } from '@/payload-types'

import { getServerSideURL } from './getURL'

export const AI_DISCOVERY_CACHE_TAGS = ['posts-sitemap', 'categories-sitemap']

export type AIPostSummary = {
  slug: string
  title: string
  url: string
  description: string
  publishedAt: string | null
  updatedAt: string
  authors: string[]
  categories: { slug: string; title: string }[]
  featured: boolean
  editorsPick: boolean
  readingTime: number | null
}

export type AIPostFullText = AIPostSummary & {
  body: string
}

export type AICategorySummary = {
  slug: string
  title: string
  description: string
  url: string
  postCount: number
  lastUpdated: string | null
}

export const cleanText = (value: string | null | undefined): string =>
  (value || '').replace(/\s+/g, ' ').trim()

const toCategoryRefs = (categories: Post['categories']): AIPostSummary['categories'] =>
  (categories || [])
    .filter((item): item is Category => typeof item === 'object' && item !== null)
    .filter((item) => Boolean(item.slug))
    .map((item) => ({ slug: item.slug as string, title: item.title }))

const toSummary = (post: Post, siteURL: string): AIPostSummary => ({
  slug: post.slug as string,
  title: cleanText(post.title),
  url: `${siteURL}/posts/${post.slug}`,
  description: cleanText(post.meta?.description || post.excerpt),
  publishedAt: post.publishedAt || null,
  updatedAt: post.updatedAt,
  authors: (post.populatedAuthors || [])
    .map((author) => cleanText(author.name))
    .filter(Boolean),
  categories: toCategoryRefs(post.categories),
  featured: Boolean(post.featured),
  editorsPick: Boolean(post.editorsPick),
  readingTime: post.readingTime ?? null,
})

const summarySelect = {
  slug: true,
  title: true,
  meta: { description: true },
  excerpt: true,
  publishedAt: true,
  updatedAt: true,
  populatedAuthors: true,
  categories: true,
  featured: true,
  editorsPick: true,
  readingTime: true,
} as const

export const getAIPostSummaries = unstable_cache(
  async (): Promise<AIPostSummary[]> => {
    const payload = await getPayload({ config: configPromise })
    const siteURL = getServerSideURL()

    const result = await payload.find({
      collection: 'posts',
      overrideAccess: false,
      draft: false,
      depth: 1,
      limit: 5000,
      pagination: false,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } },
      select: summarySelect,
      populate: { categories: { title: true, slug: true } },
    })

    return result.docs
      .filter((post) => Boolean(post.slug))
      .map((post) => toSummary(post as Post, siteURL))
  },
  ['ai-post-summaries'],
  { tags: AI_DISCOVERY_CACHE_TAGS, revalidate: 3600 },
)

export const getAIFullTextPosts = unstable_cache(
  async (limit: number): Promise<AIPostFullText[]> => {
    const payload = await getPayload({ config: configPromise })
    const siteURL = getServerSideURL()

    const result = await payload.find({
      collection: 'posts',
      overrideAccess: false,
      draft: false,
      depth: 1,
      limit,
      pagination: false,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } },
      select: { ...summarySelect, content: true },
      populate: { categories: { title: true, slug: true } },
    })

    return result.docs
      .filter((post) => Boolean(post.slug))
      .map((post) => {
        let body = ''
        try {
          body = post.content ? convertLexicalToPlaintext({ data: post.content }) : ''
        } catch {
          body = ''
        }

        return {
          ...toSummary(post as Post, siteURL),
          body: body.replace(/\n{3,}/g, '\n\n').trim(),
        }
      })
  },
  ['ai-post-full-text'],
  { tags: AI_DISCOVERY_CACHE_TAGS, revalidate: 3600 },
)

export const getAICategorySummaries = unstable_cache(
  async (): Promise<AICategorySummary[]> => {
    const payload = await getPayload({ config: configPromise })
    const siteURL = getServerSideURL()

    const [categories, posts] = await Promise.all([
      payload.find({
        collection: 'categories',
        overrideAccess: false,
        depth: 0,
        limit: 500,
        pagination: false,
        sort: 'title',
        select: { title: true, slug: true, description: true, updatedAt: true },
      }),
      getAIPostSummaries(),
    ])

    return categories.docs
      .filter((category) => Boolean(category.slug))
      .map((category) => {
        const categoryPosts = posts.filter((post) =>
          post.categories.some((ref) => ref.slug === category.slug),
        )
        const lastUpdated =
          categoryPosts
            .map((post) => post.updatedAt)
            .sort()
            .at(-1) ||
          category.updatedAt ||
          null

        return {
          slug: category.slug as string,
          title: cleanText(category.title),
          description: cleanText(category.description),
          url: `${siteURL}/categories/${category.slug}`,
          postCount: categoryPosts.length,
          lastUpdated,
        }
      })
      .sort((a, b) => b.postCount - a.postCount)
  },
  ['ai-category-summaries'],
  { tags: AI_DISCOVERY_CACHE_TAGS, revalidate: 3600 },
)
