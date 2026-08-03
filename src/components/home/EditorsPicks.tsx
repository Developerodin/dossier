import Link from 'next/link'
import React from 'react'
import { ArrowRight, PenLine, Sparkles } from 'lucide-react'

import { EditorsPickCard } from './EditorsPickCard'
import { EditorsPickFeatured } from './EditorsPickFeatured'
import type { HomePostCard } from './types'

type EditorsPicksProps = {
  posts: HomePostCard[]
}

export const EditorsPicks: React.FC<EditorsPicksProps> = ({ posts }) => {
  if (!posts.length) return null

  const [featured, ...rest] = posts
  const smallCards = rest.slice(0, 4)

  return (
    <section className="home-editors" aria-labelledby="home-editors-title">
      <div className="home-editors__inner">
        <header className="home-editors__header">
          <div className="home-editors__intro">
            <p className="home-editors__eyebrow">
              <Sparkles className="home-editors__eyebrow-icon" aria-hidden="true" />
              Editor&apos;s Picks
            </p>
            <h2 id="home-editors-title" className="home-editors__title">
              Handpicked stories worth your time
            </h2>
            <span className="home-editors__title-accent" aria-hidden="true" />
            <p className="home-editors__subtitle">
              Our editors cut through the noise to bring you the most important stories this week.
            </p>
          </div>

          <aside className="home-editors__why">
            <div className="home-editors__why-icon" aria-hidden="true">
              <Sparkles className="home-editors__why-icon-svg" />
            </div>
            <div className="home-editors__why-copy">
              <p className="home-editors__why-title">Why Editor&apos;s Picks?</p>
              <p className="home-editors__why-desc">
                Every story is carefully selected by our editorial team for quality, relevance, and
                impact.
              </p>
            </div>
            <Link href="/posts" className="home-editors__why-link">
              Learn more
              <ArrowRight className="home-editors__why-link-icon" aria-hidden="true" />
            </Link>
          </aside>
        </header>

        <div className="home-editors__grid">
          <EditorsPickFeatured post={featured} />
          {smallCards.length > 0 && (
            <div className="home-editors__cards">
              {smallCards.map((post) => (
                <EditorsPickCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        <div className="home-editors__footer">
          <div className="home-editors__footer-icon" aria-hidden="true">
            <PenLine className="home-editors__footer-icon-svg" />
          </div>
          <div className="home-editors__footer-copy">
            <p className="home-editors__footer-title">Curated by humans, not algorithms.</p>
            <p className="home-editors__footer-desc">
              Real insights from our editors with deep industry expertise.
            </p>
          </div>
          <Link href="/posts" className="home-editors__footer-link">
            See all picks
            <ArrowRight className="home-editors__footer-link-icon" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
