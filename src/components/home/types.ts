import type { Post } from '@/payload-types'

export type HomePostCard = Pick<
  Post,
  | 'id'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'readingTime'
  | 'viewCount'
  | 'publishedAt'
  | 'heroImage'
  | 'categories'
  | 'populatedAuthors'
>

export type BreakingNewsItem = Pick<Post, 'id' | 'title' | 'slug'>

/** Fields needed for homepage / trending post cards — keep queries lean. */
export const homeCardSelect = {
  title: true,
  slug: true,
  excerpt: true,
  readingTime: true,
  viewCount: true,
  publishedAt: true,
  heroImage: true,
  categories: true,
  populatedAuthors: true,
} as const
