import React from 'react'
import Link from 'next/link'
import { ArrowRight, Eye } from 'lucide-react'

import { ArticleCard } from './ArticleCard'
import type { HomePostCard } from './types'

type MostViewFeedProps = {
  posts: HomePostCard[]
}

export const MostViewFeed: React.FC<MostViewFeedProps> = ({ posts }) => {
  if (!posts.length) return null

  return (
    <section className="mag-most-view-feed" aria-labelledby="mag-most-view-feed-title">
      <div className="mag-most-view-feed__inner">
        <header className="mag-section-header">
          <h2 id="mag-most-view-feed-title" className="mag-section-header__title">
            <span className="mag-section-icon" aria-hidden="true">
              <Eye size={18} strokeWidth={2} />
            </span>
            Most View
          </h2>
          <Link href="/posts" className="mag-section-header__link">
            View all
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </header>
        <div className="mag-most-view-feed__grid">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
