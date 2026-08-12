import Link from 'next/link'
import React from 'react'

import type { CardPostData } from '@/components/Card'

type SearchResultsProps = {
  posts: CardPostData[]
  query?: string
}

export const SearchResults: React.FC<SearchResultsProps> = ({ posts, query }) => {
  if (!posts.length) {
    return (
      <div className="mag-search__empty">
        <p>{query ? `No results for “${query}”.` : 'Enter a search term to find articles.'}</p>
      </div>
    )
  }

  return (
    <ul className="mag-search__list">
      {posts.map((post) => {
        const category = post.categories?.[0]
        const categoryTitle =
          category && typeof category === 'object' ? category.title : undefined

        return (
          <li key={post.slug}>
            <article className="mag-search__item">
              <div className="mag-search__body">
                {categoryTitle && <span className="mag-search__cat">{categoryTitle}</span>}
                <h2 className="mag-search__title">
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h2>
                {post.meta?.description && (
                  <p className="mag-search__excerpt">{post.meta.description}</p>
                )}
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
