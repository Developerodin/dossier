import Link from 'next/link'
import React from 'react'

import type { HomePostCard } from './types'
import { Media } from '@/components/Media'

type FeaturedPostsStripProps = {
  posts: HomePostCard[]
}

export const FeaturedPostsStrip: React.FC<FeaturedPostsStripProps> = ({ posts }) => {
  const items = posts.slice(0, 3)
  if (!items.length) return null

  return (
    <section className="mag-featured-strip" aria-label="Featured posts">
      <div className="mag-featured-strip__inner">
        <div className="mag-featured-strip__track">
          {items.map((post) => (
            <article key={post.id} className="mag-featured-strip__item">
              <Link href={`/posts/${post.slug}`} className="mag-featured-strip__thumb">
                {post.heroImage && typeof post.heroImage === 'object' ? (
                  <Media resource={post.heroImage} imgClassName="mag-featured-strip__img" />
                ) : (
                  <span className="mag-featured-strip__placeholder" />
                )}
              </Link>
              <div className="mag-featured-strip__body">
                <h3 className="mag-featured-strip__title">
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h3>
                {post.excerpt && <p className="mag-featured-strip__excerpt">{post.excerpt}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
