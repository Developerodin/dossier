import Link from 'next/link'
import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Bookmark } from 'lucide-react'

import { Media } from '@/components/Media'
import { CategoryBadge } from './CategoryBadge'
import type { HomePostCard } from './types'

type EditorsPickCardProps = {
  post: HomePostCard
}

export const EditorsPickCard: React.FC<EditorsPickCardProps> = ({ post }) => {
  const { title, slug, heroImage, categories, publishedAt, readingTime } = post
  const href = `/posts/${slug}`

  const primaryCategory =
    categories?.find((cat) => typeof cat === 'object' && cat !== null) ?? null
  const categoryTitle = primaryCategory?.title ?? null
  const categoryHref = primaryCategory?.slug ? `/categories/${primaryCategory.slug}` : null

  const relativeTime = publishedAt
    ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true })
    : null

  return (
    <article className="home-editors-card">
      <Link href={href} className="home-editors-card__media" tabIndex={-1} aria-hidden="true">
        {heroImage && typeof heroImage === 'object' ? (
          <Media
            resource={heroImage}
            fill
            imgClassName="home-editors-card__image"
            size="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="home-editors-card__placeholder" />
        )}
      </Link>

      <div className="home-editors-card__overlay" aria-hidden="true" />

      <span className="home-editors-card__bookmark" aria-hidden="true">
        <Bookmark className="home-editors-card__bookmark-icon" />
      </span>

      <div className="home-editors-card__content">
        {categoryTitle && (
          <CategoryBadge
            label={categoryTitle}
            href={categoryHref}
            variant="text"
            className="home-editors-card__category"
          />
        )}

        <h3 className="home-editors-card__title">
          <Link href={href}>{title}</Link>
        </h3>

        <p className="home-editors-card__meta">
          {relativeTime && <span>{relativeTime}</span>}
          {relativeTime && typeof readingTime === 'number' && readingTime > 0 && (
            <span className="home-author-meta__dot" aria-hidden="true" />
          )}
          {typeof readingTime === 'number' && readingTime > 0 && (
            <span>{readingTime} min read</span>
          )}
        </p>
      </div>
    </article>
  )
}
