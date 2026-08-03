import React from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp } from 'lucide-react'

import { TrendingCarousel } from './TrendingCarousel'
import type { HomePostCard } from './types'

type TrendingStoriesProps = {
  posts: HomePostCard[]
}

const TRENDING_HREF = '/categories/trending'

export const TrendingStories: React.FC<TrendingStoriesProps> = ({ posts }) => {
  if (!posts.length) return null

  return (
    <section className="home-trending" aria-labelledby="home-trending-title">
      <div className="home-trending__inner">
        {/* Mobile header */}
        <header className="home-trending__mobile-header">
          <p className="home-trending__eyebrow">
            <span className="home-trending__eyebrow-icon" aria-hidden="true">
              <TrendingUp className="home-trending__eyebrow-svg" />
            </span>
            Trending Stories
          </p>
          <Link href={TRENDING_HREF} className="home-trending__view-all">
            View all
            <ArrowRight className="home-trending__view-all-icon" aria-hidden="true" />
          </Link>
        </header>

        <div className="home-trending__layout">
          {/* Desktop / tablet intro column */}
          <div className="home-trending__intro">
            <p className="home-trending__eyebrow home-trending__eyebrow--desktop">
              <span className="home-trending__eyebrow-icon" aria-hidden="true">
                <TrendingUp className="home-trending__eyebrow-svg" />
              </span>
              Trending Stories
            </p>
            <h2 id="home-trending-title" className="home-trending__title">
              What&apos;s trending
              <span className="home-trending__title-accent">right now</span>
            </h2>
            <p className="home-trending__subtitle">
              The stories everyone is talking about across the tech world.
            </p>
            <Link href={TRENDING_HREF} className="home-trending__cta home-trending__cta--desktop">
              Explore all trending
              <ArrowRight className="home-trending__cta-icon" aria-hidden="true" />
            </Link>
          </div>

          <div className="home-trending__cards-wrap">
            <TrendingCarousel posts={posts} />
          </div>
        </div>

        {/* Mobile footer CTA */}
        <Link href={TRENDING_HREF} className="home-trending__cta home-trending__cta--mobile">
          Explore all trending
          <ArrowRight className="home-trending__cta-icon" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
