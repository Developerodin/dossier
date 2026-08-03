import Link from 'next/link'
import React from 'react'
import { Eye } from 'lucide-react'

import { Media } from '@/components/Media'

import { formatRelativeTime } from './fundingUtils'
import { formatViewCount } from './formatViewCount'
import { getTopicCategory } from './getTopicCategory'
import type { HomePostCard } from './types'

type TrendingCardProps = {
  post: HomePostCard
  rank: number
  variant?: 'desktop' | 'mobile'
}

function formatRank(rank: number): string {
  return String(rank).padStart(2, '0')
}

export const TrendingCard: React.FC<TrendingCardProps> = ({
  post,
  rank,
  variant = 'desktop',
}) => {
  const { title, slug, heroImage, publishedAt, viewCount } = post
  const href = `/posts/${slug}`
  const topic = getTopicCategory(post)
  const categoryHref = topic?.slug ? `/categories/${topic.slug}` : null
  const relativeTime = publishedAt ? formatRelativeTime(publishedAt) : null
  const viewsLabel =
    typeof viewCount === 'number' && viewCount >= 0 ? formatViewCount(viewCount) : null

  return (
    <article
      className={[
        'home-trending-card',
        variant === 'mobile' ? 'home-trending-card--mobile' : 'home-trending-card--desktop',
      ].join(' ')}
    >
      <Link href={href} className="home-trending-card__media" tabIndex={-1} aria-hidden="true">
        {heroImage && typeof heroImage === 'object' ? (
          <Media
            resource={heroImage}
            fill
            imgClassName="home-trending-card__image"
            size={variant === 'mobile' ? '120px' : '280px'}
          />
        ) : (
          <div className="home-trending-card__placeholder" />
        )}
        <span className="home-trending-card__rank" aria-hidden="true">
          {formatRank(rank)}
        </span>
      </Link>

      <div className="home-trending-card__body">
        {topic?.title && (
          <Link
            href={categoryHref ?? href}
            className="home-trending-card__category"
          >
            {topic.title}
          </Link>
        )}
        <h3 className="home-trending-card__title">
          <Link href={href}>{title}</Link>
        </h3>
        <p className="home-trending-card__meta">
          {viewsLabel && (
            <span className="home-trending-card__views">
              <Eye className="home-trending-card__eye" aria-hidden="true" />
              {viewsLabel} views
            </span>
          )}
          {viewsLabel && relativeTime && (
            <span className="home-trending-card__dot" aria-hidden="true">
              •
            </span>
          )}
          {relativeTime && <span>{relativeTime}</span>}
        </p>
      </div>
    </article>
  )
}
