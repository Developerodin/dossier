import Link from 'next/link'
import React from 'react'

import type { HomePostCard } from './types'
import { Media } from '@/components/Media'
import { formatCount } from '@/utilities/formatCount'

type MostViewListProps = {
  posts: HomePostCard[]
  title?: string
}

export const MostViewList: React.FC<MostViewListProps> = ({
  posts,
  title = 'Most View',
}) => {
  if (!posts.length) return null

  return (
    <aside className="mag-most-view" aria-labelledby="mag-most-view-title">
      <h3 id="mag-most-view-title" className="mag-widget-title">
        {title}
      </h3>
      <ol className="mag-most-view__list">
        {posts.slice(0, 4).map((post) => {
          const cat = post.categories?.[0]
          const category = cat && typeof cat !== 'number' ? cat.title : undefined

          return (
            <li key={post.id}>
              <article className="mag-most-view__item">
                {post.heroImage && typeof post.heroImage === 'object' && (
                  <Link href={`/posts/${post.slug}`} className="mag-most-view__thumb">
                    <Media
                      resource={post.heroImage}
                      fill
                      imgClassName="mag-most-view__img"
                      size="2.75rem"
                    />
                  </Link>
                )}
                <div className="mag-most-view__body">
                  {category && <span className="mag-most-view__cat">{category}</span>}
                  <h4 className="mag-most-view__title">
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </h4>
                  <span className="mag-most-view__views">{formatCount(post.viewCount ?? 0)} views</span>
                </div>
              </article>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
