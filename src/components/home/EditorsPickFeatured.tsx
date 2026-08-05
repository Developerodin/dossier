import Link from 'next/link'
import React from 'react'
import { ArrowUpRight, Sparkles } from 'lucide-react'

import { Media } from '@/components/Media'
import { AuthorMeta } from './AuthorMeta'
import type { HomePostCard } from './types'

type EditorsPickFeaturedProps = {
  post: HomePostCard
}

export const EditorsPickFeatured: React.FC<EditorsPickFeaturedProps> = ({ post }) => {
  const { title, slug, excerpt, heroImage, populatedAuthors, publishedAt, readingTime } = post
  const href = `/posts/${slug}`

  return (
    <article className="home-editors-featured">
      <Link href={href} className="home-editors-featured__media" tabIndex={-1} aria-hidden="true">
        {heroImage && typeof heroImage === 'object' ? (
          <Media
            resource={heroImage}
            fill
            imgClassName="home-editors-featured__image"
            size="(max-width: 1024px) 100vw, 55vw"
          />
        ) : (
          <div className="home-editors-featured__placeholder" />
        )}
      </Link>

      <div className="home-editors-featured__overlay" aria-hidden="true" />

      <span className="home-editors-featured__badge">
        <Sparkles className="home-editors-featured__badge-icon" aria-hidden="true" />
        Top Pick
      </span>

      <div className="home-editors-featured__content">
        <h3 className="home-editors-featured__title">
          <Link href={href}>{title}</Link>
        </h3>

        {excerpt && <p className="home-editors-featured__excerpt">{excerpt}</p>}

        <div className="home-editors-featured__footer">
          <AuthorMeta
            authors={populatedAuthors}
            publishedAt={publishedAt}
            readingTime={readingTime}
          />
          <Link href={href} className="home-editors-featured__cta" aria-label={`Read ${title}`}>
            <ArrowUpRight className="home-editors-featured__cta-icon" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
