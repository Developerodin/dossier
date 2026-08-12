import Link from 'next/link'
import React from 'react'

import { getCategoryIcon } from './categoryIcons'
import type { ExploreCategory } from './queryExploreCategories'

type CategoryTilesProps = {
  categories: ExploreCategory[]
}

export const CategoryTiles: React.FC<CategoryTilesProps> = ({ categories }) => {
  if (!categories.length) return null

  return (
    <aside className="mag-category-tiles" aria-labelledby="mag-category-tiles-title">
      <h3 id="mag-category-tiles-title" className="mag-widget-title">
        Categories
      </h3>
      <ul className="mag-category-tiles__grid">
        {categories.slice(0, 8).map((category) => {
          const Icon = getCategoryIcon(category.slug)

          return (
            <li key={category.id}>
              <Link
                href={`/categories/${category.slug}`}
                className="mag-category-tiles__item"
                style={{ '--topic-accent': category.accentColor } as React.CSSProperties}
              >
                <span className="mag-category-tiles__icon" aria-hidden="true">
                  <Icon className="mag-category-tiles__icon-svg" />
                </span>
                <span className="mag-category-tiles__label">{category.title}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
