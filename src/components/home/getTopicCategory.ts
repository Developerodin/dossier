import type { Category } from '@/payload-types'

import type { HomePostCard } from './types'

type PopulatedCategory = Pick<Category, 'id' | 'title' | 'slug'>

function isPopulatedCategory(cat: number | Category): cat is Category {
  return typeof cat === 'object' && cat !== null && Boolean(cat.title)
}

/** Prefer the first non-trending category so cards show topic labels (AI, SpaceX, etc.). */
export function getTopicCategory(post: HomePostCard): PopulatedCategory | null {
  const categories = post.categories
  if (!categories?.length) return null

  const populated = categories.filter(isPopulatedCategory)

  const topic = populated.find((cat) => cat.slug !== 'trending') ?? populated[0]
  if (!topic) return null

  return {
    id: topic.id,
    title: topic.title,
    slug: topic.slug,
  }
}
