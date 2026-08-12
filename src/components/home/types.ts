import type { Post } from '@/payload-types'

export type HomePostCard = Pick<
  Post,
  | 'id'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'readingTime'
  | 'viewCount'
  | 'shareCount'
  | 'videoUrl'
  | 'videoNews'
  | 'publishedAt'
  | 'heroImage'
  | 'categories'
  | 'populatedAuthors'
>

export type BreakingNewsItem = Pick<
  Post,
  'id' | 'title' | 'slug' | 'excerpt' | 'publishedAt' | 'heroImage' | 'categories'
>

/** Fields needed for homepage / trending post cards — keep queries lean. */
export const homeCardSelect = {
  title: true,
  slug: true,
  excerpt: true,
  readingTime: true,
  viewCount: true,
  shareCount: true,
  videoUrl: true,
  videoNews: true,
  publishedAt: true,
  heroImage: true,
  categories: true,
  populatedAuthors: true,
} as const
