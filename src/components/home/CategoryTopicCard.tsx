import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { getCategoryIcon } from './categoryIcons'
import type { ExploreCategory } from './queryExploreCategories'

type CategoryTopicCardProps = {
  category: ExploreCategory
}

export const CategoryTopicCard: React.FC<CategoryTopicCardProps> = ({ category }) => {
  const Icon = getCategoryIcon(category.slug)
  const href = `/categories/${category.slug}`
  const accent = category.accentColor

  return (
    <Link
      href={href}
      className="home-explore-card"
      style={{ '--topic-accent': accent } as React.CSSProperties}
    >
      <div className="home-explore-card__top">
        <span className="home-explore-card__icon" aria-hidden="true">
          <Icon className="home-explore-card__icon-svg" />
        </span>
        <h3 className="home-explore-card__title">{category.title}</h3>
      </div>
      {category.description ? (
        <p className="home-explore-card__desc">{category.description}</p>
      ) : null}
      <div className="home-explore-card__footer">
        <span className="home-explore-card__count">
          {category.articleCount} {category.articleCount === 1 ? 'article' : 'articles'}
        </span>
        <span className="home-explore-card__arrow" aria-hidden="true">
          <ArrowRight className="home-explore-card__arrow-svg" />
        </span>
      </div>
    </Link>
  )
}
