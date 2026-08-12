import Link from 'next/link'
import React from 'react'

import type { HomePostCard } from './types'
import { Media } from '@/components/Media'
import { formatCount } from '@/utilities/formatCount'

type MostShareListProps = {
  posts: HomePostCard[]
  title?: string
}

export const MostShareList: React.FC<MostShareListProps> = ({
  posts,
  title = 'Most Share',
}) => {
  if (!posts.length) return null

  return (
    <aside className="mag-most-share" aria-labelledby="mag-most-share-title">
      <h3 id="mag-most-share-title" className="mag-widget-title">
        {title}
      </h3>
      <ol className="mag-most-share__list">
        {posts.slice(0, 5).map((post, index) => {
          const cat = post.categories?.[0]
          const category = cat && typeof cat !== 'number' ? cat.title : undefined

          return (
            <li key={post.id}>
              <article className="mag-most-share__item">
                <span className="mag-most-share__rank">{index + 1}</span>
                <div className="mag-most-share__body">
                  {category && <span className="mag-most-share__cat">{category}</span>}
                  <h4 className="mag-most-share__title">
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </h4>
                  <div className="mag-most-share__stats">
                    <span>{formatCount(post.shareCount ?? 0)} shares</span>
                    <span>{formatCount(post.viewCount ?? 0)} views</span>
                  </div>
                </div>
                {post.heroImage && typeof post.heroImage === 'object' && (
                  <Link href={`/posts/${post.slug}`} className="mag-most-share__thumb">
                    <Media
                      resource={post.heroImage}
                      fill
                      imgClassName="mag-most-share__img"
                      size="2.75rem"
                    />
                  </Link>
                )}
              </article>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
