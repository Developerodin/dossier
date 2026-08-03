import type { Post } from '@/payload-types'

export type CategoryPostCardData = Pick<
  Post,
  'id' | 'title' | 'slug' | 'heroImage' | 'categories' | 'publishedAt' | 'populatedAuthors'
>

export const CATEGORY_POSTS_PER_PAGE = 12
