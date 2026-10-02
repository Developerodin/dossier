import Link from 'next/link'
import React from 'react'
import { formatDistanceToNow } from 'date-fns'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import type { CategoryPostCardData } from './types'

type CategoryPostCardProps = {
  post: CategoryPostCardData
  /** When set, use this label instead of the post's primary category */
  categoryLabel?: string | null
  categoryHref?: string | null
  /** Hide category label (e.g. on individual category pages) */
  hideCategory?: boolean
}

function CategoryLabel({
  title,
  href,
  className,
}: {
  title: string
  href: string | null
  className?: string
}) {
  const classes = ['category-post-card__label', className].filter(Boolean).join(' ')
  if (href) {
    return (
      <Link href={href} className={classes}>
        {title}
      </Link>
    )
  }
  return <span className={classes}>{title}</span>
}

export const CategoryPostCard: React.FC<CategoryPostCardProps> = ({
  post,
  categoryLabel,
  categoryHref: categoryHrefProp,
  hideCategory = false,
}) => {
  const { title, slug, heroImage, categories, publishedAt, populatedAuthors } = post
  const href = `/posts/${slug}`

  const primaryCategory = categories?.find((cat) => typeof cat === 'object' && cat !== null) ?? null

  const categoryTitle = hideCategory ? null : categoryLabel || primaryCategory?.title || null
  const categorySlug = primaryCategory?.slug ?? null
  const categoryHref = categoryHrefProp ?? (categorySlug ? `/categories/${categorySlug}` : null)

  const hasAuthors =
    populatedAuthors &&
    populatedAuthors.length > 0 &&
    formatAuthors(populatedAuthors.filter(Boolean)) !== ''
  const authorName = hasAuthors ? formatAuthors(populatedAuthors!.filter(Boolean)) : null

  const relativeTime = publishedAt
    ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true })
    : null

  return (
    <article className="category-post-card">
      {categoryTitle && (
        <CategoryLabel
          title={categoryTitle}
          href={categoryHref}
          className="category-post-card__label--mobile"
        />
      )}
      <div className="category-post-card__main">
        <Link href={href} className="category-post-card__media" tabIndex={-1} aria-hidden="true">
          {heroImage && typeof heroImage === 'object' ? (
            <Media
              resource={heroImage}
              fill
              imgClassName="category-post-card__image"
              size="(max-width: 767px) 160px, (max-width: 1023px) 240px, 280px"
            />
          ) : (
            <div className="category-post-card__placeholder" />
          )}
        </Link>

        <div className="category-post-card__body">
          {categoryTitle && (
            <CategoryLabel
              title={categoryTitle}
              href={categoryHref}
              className="category-post-card__label--desktop"
            />
          )}
          <h2 className="category-post-card__title">
            <Link href={href}>{title}</Link>
          </h2>
          {(authorName || relativeTime) && (
            <p className="category-post-card__meta">
              {authorName && <span className="category-post-card__author">{authorName}</span>}
              {authorName && relativeTime && (
                <span className="category-post-card__meta-sep" aria-hidden="true">
                  –
                </span>
              )}
              {relativeTime && <time dateTime={publishedAt ?? undefined}>{relativeTime}</time>}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
