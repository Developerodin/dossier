import React from 'react'

import { CategoryPostCard } from './CategoryPostCard'
import type { CategoryPostCardData } from './types'

type CategoryPostListProps = {
  posts: CategoryPostCardData[]
  categoryLabel?: string | null
  categoryHref?: string | null
}

export const CategoryPostList: React.FC<CategoryPostListProps> = ({
  posts,
  categoryLabel,
  categoryHref,
}) => {
  if (!posts.length) {
    return <p className="category-post-list__empty">No posts in this category yet.</p>
  }

  return (
    <ul className="category-post-list">
      {posts.map((post) => (
        <li key={post.id} className="category-post-list__item">
          <CategoryPostCard
            post={post}
            categoryLabel={categoryLabel}
            categoryHref={categoryHref}
          />
        </li>
      ))}
    </ul>
  )
}
