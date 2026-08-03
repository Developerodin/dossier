import React from 'react'
import Link from 'next/link'
import { ArrowRight, Newspaper } from 'lucide-react'

import { ArticleCard } from './ArticleCard'
import type { HomePostCard } from './types'

type LatestArticlesProps = {
  posts: HomePostCard[]
}

export const LatestArticles: React.FC<LatestArticlesProps> = ({ posts }) => {
  if (!posts.length) return null

  return (
    <section className="home-latest" aria-labelledby="home-latest-title">
      <div className="home-latest__inner">
        <header className="home-latest__header">
          <p className="home-latest__eyebrow">
            <Newspaper className="home-latest__eyebrow-icon" aria-hidden="true" />
            Latest Articles
          </p>
          <h2 id="home-latest-title" className="home-latest__title">
            Fresh stories from across{' '}
            <span className="home-latest__title-accent">tech</span>
          </h2>
          <p className="home-latest__subtitle">
            The newest coverage on AI, startups, funding, and the ideas shaping what comes next.
          </p>
          <Link href="/posts" className="home-latest__cta">
            View all posts
            <ArrowRight className="home-latest__cta-icon" aria-hidden="true" />
          </Link>
        </header>

        <div className="home-latest__grid">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
