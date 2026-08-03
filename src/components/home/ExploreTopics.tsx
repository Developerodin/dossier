import React from 'react'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'

import { CategoryTopicCard } from './CategoryTopicCard'
import type { ExploreCategory } from './queryExploreCategories'

type ExploreTopicsProps = {
  categories: ExploreCategory[]
}

export const ExploreTopics: React.FC<ExploreTopicsProps> = ({ categories }) => {
  if (!categories.length) return null

  return (
    <section className="home-explore" aria-labelledby="home-explore-title">
      <div className="home-explore__inner">
        <header className="home-explore__header">
          <p className="home-explore__eyebrow">Explore Topics</p>
          <h2 id="home-explore-title" className="home-explore__title">
            Explore what&apos;s happening across the{' '}
            <span className="home-explore__title-accent">tech world</span>
          </h2>
          <p className="home-explore__subtitle">
            Browse curated topics spanning AI, startups, funding, and more — pick a category to
            dive into the latest coverage.
          </p>
        </header>

        <div className="home-explore__grid">
          {categories.map((category) => (
            <CategoryTopicCard key={category.id} category={category} />
          ))}
        </div>

        <div className="home-explore__search">
          <div className="home-explore__search-icon" aria-hidden="true">
            <Search className="home-explore__search-icon-svg" />
          </div>
          <div className="home-explore__search-copy">
            <p className="home-explore__search-title">Looking for something specific?</p>
            <p className="home-explore__search-desc">
              Search across thousands of articles, topics, companies, and keywords.
            </p>
          </div>
          <Link href="/search" className="home-explore__search-btn">
            Search Articles
            <ArrowRight className="home-explore__search-btn-icon" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
