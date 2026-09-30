import type { Category, Post } from '@/payload-types'

import { EDITORIAL_CATEGORY_SLUGS } from './siteInfo'

export const getPrimaryCategory = (categories: Post['categories']): Category | undefined => {
  const populated = (categories || []).filter(
    (item): item is Category => typeof item === 'object' && item !== null && Boolean(item.slug),
  )

  return (
    populated.find((category) => !EDITORIAL_CATEGORY_SLUGS.includes(category.slug as string)) ||
    populated[0]
  )
}
