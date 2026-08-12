import Link from 'next/link'
import React from 'react'

import type { HomePostCard } from './types'
import { CarouselSlide, ScrollCarousel } from '@/components/magazine/ScrollCarousel'
import { Media } from '@/components/Media'
import { CategoryBadge } from './CategoryBadge'

type FeatureNewsCarouselProps = {
  posts: HomePostCard[]
}

export const FeatureNewsCarousel: React.FC<FeatureNewsCarouselProps> = ({ posts }) => {
  if (!posts.length) return null

  return (
    <section className="mag-feature-news" aria-labelledby="mag-feature-news-title">
      <div className="mag-feature-news__inner">
        <header className="mag-section-header">
          <h2 id="mag-feature-news-title" className="mag-section-header__title">
            Feature News
          </h2>
          <Link href="/posts" className="mag-section-header__link">
            View all
          </Link>
        </header>
        <ScrollCarousel ariaLabel="Feature news">
          {posts.map((post) => {
            const cat = post.categories?.[0]
            const category =
              cat && typeof cat !== 'number' ? { title: cat.title, slug: cat.slug } : null

            return (
              <CarouselSlide key={post.id} className="mag-feature-news__slide">
                <article className="mag-feature-news__card">
                  <Link href={`/posts/${post.slug}`} className="mag-feature-news__media">
                    {post.heroImage && typeof post.heroImage === 'object' ? (
                      <Media resource={post.heroImage} imgClassName="mag-feature-news__img" />
                    ) : (
                      <span className="mag-feature-news__placeholder" />
                    )}
                  </Link>
                  <div className="mag-feature-news__body">
                    {category && (
                      <CategoryBadge
                        label={category.title}
                        href={`/categories/${category.slug}`}
                        variant="pill"
                      />
                    )}
                    <h3 className="mag-feature-news__title">
                      <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                    </h3>
                  </div>
                </article>
              </CarouselSlide>
            )
          })}
        </ScrollCarousel>
      </div>
    </section>
  )
}
