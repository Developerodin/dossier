import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'
import { AuthorMeta } from './AuthorMeta'
import { CategoryBadge } from './CategoryBadge'
import { ReadMoreButton } from './ReadMoreButton'
import type { HomePostCard } from './types'

type HomeHeroProps = {
  post: HomePostCard
}

export const HomeHero: React.FC<HomeHeroProps> = ({ post }) => {
  const { title, slug, excerpt, heroImage, categories, populatedAuthors, publishedAt, readingTime } =
    post
  const href = `/posts/${slug}`

  const primaryCategory =
    categories?.find((cat) => typeof cat === 'object' && cat !== null) ?? null
  const categoryTitle = primaryCategory?.title ?? null
  const categoryHref = primaryCategory?.slug ? `/categories/${primaryCategory.slug}` : null

  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__inner">
        <div className="home-hero__media">
          <Link href={href} className="home-hero__media-link" tabIndex={-1} aria-hidden="true">
            {heroImage && typeof heroImage === 'object' ? (
              <Media
                resource={heroImage}
                fill
                priority
                imgClassName="home-hero__image"
                size="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="home-hero__placeholder" />
            )}
          </Link>
        </div>

        <div className="home-hero__content">
          {categoryTitle && (
            <CategoryBadge
              label={categoryTitle}
              href={categoryHref}
              variant="pill"
              className="home-hero__badge"
            />
          )}

          <h1 id="home-hero-title" className="home-hero__title">
            <Link href={href}>{title}</Link>
          </h1>

          {excerpt && <p className="home-hero__excerpt">{excerpt}</p>}

          <AuthorMeta
            authors={populatedAuthors}
            publishedAt={publishedAt}
            readingTime={readingTime}
          />

          <div className="home-hero__actions">
            <ReadMoreButton href={href} />
          </div>
        </div>
      </div>
    </section>
  )
}
