import Link from 'next/link'
import React from 'react'
import { formatDistanceToNow } from 'date-fns'

import { Media } from '@/components/Media'
import { CategoryBadge } from './CategoryBadge'
import type { HomePostCard } from './types'

type ArticleCardProps = {
  post: HomePostCard
  className?: string
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ post, className }) => {
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
    <article className={['home-article-card', className].filter(Boolean).join(' ')}>
      <Link href={href} className="home-article-card__media" tabIndex={-1} aria-hidden="true">
        {heroImage && typeof heroImage === 'object' ? (
          <Media resource={heroImage} fill imgClassName="home-article-card__image" size="33vw" />
        ) : (
          <div className="home-article-card__placeholder" />
        )}
      </Link>

      <div className="home-article-card__body">
        {categoryTitle && (
          <CategoryBadge label={categoryTitle} href={categoryHref} variant="text" />
        )}
        <h3 className="home-article-card__title">
          <Link href={href}>{title}</Link>
        </h3>
        <p className="home-article-card__meta">
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
