'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import type { BreakingNewsItem, HomePostCard } from '@/components/home/types'
import { CategoryBadge } from '@/components/home/CategoryBadge'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'

type TabKey = 'trending' | 'breaking' | 'latest'

type PostTabsSidebarProps = {
  trending: HomePostCard[]
  breaking?: BreakingNewsItem[] | HomePostCard[]
  latest: HomePostCard[]
  className?: string
}

const allTabs: { key: TabKey; label: string }[] = [
  { key: 'trending', label: 'Trending' },
  { key: 'breaking', label: 'Breaking News' },
  { key: 'latest', label: 'Latest' },
]

function getCategoryTitle(post: HomePostCard): string | undefined {
  const cat = post.categories?.[0]
  if (!cat || typeof cat === 'number') return undefined
  return cat.title
}

export const PostTabsSidebar: React.FC<PostTabsSidebarProps> = ({
  trending,
  breaking,
  latest,
  className = '',
}) => {
  const [active, setActive] = useState<TabKey>('trending')
  const tabs = allTabs.filter((tab) => tab.key !== 'breaking' || Boolean(breaking))

  const lists: Record<TabKey, (HomePostCard | BreakingNewsItem)[]> = {
    trending,
    breaking: breaking ?? [],
    latest,
  }

  const items = lists[active].slice(0, 4)

  return (
    <aside className={`mag-tabs-sidebar ${className}`.trim()}>
      <div className="mag-tabs-sidebar__tabs" role="tablist">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            className={`mag-tabs-sidebar__tab${active === key ? ' mag-tabs-sidebar__tab--active' : ''}`}
            onClick={() => setActive(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <ul className="mag-tabs-sidebar__list">
        {items.map((post) => {
          const href = `/posts/${post.slug}`
          const heroImage = 'heroImage' in post ? post.heroImage : undefined
          const category = 'categories' in post ? getCategoryTitle(post as HomePostCard) : undefined
          const publishedAt = 'publishedAt' in post ? post.publishedAt : undefined
          const categorySlug =
            'categories' in post && post.categories?.[0] && typeof post.categories[0] !== 'number'
              ? post.categories[0].slug
              : undefined

          return (
            <li key={post.id}>
              <article className="mag-tabs-sidebar__item">
                {heroImage && typeof heroImage === 'object' && (
                  <Link href={href} className="mag-tabs-sidebar__thumb">
                    <Media
                      resource={heroImage}
                      fill
                      imgClassName="mag-tabs-sidebar__img"
                      payloadSize="small"
                      size="192px"
                    />
                  </Link>
                )}
                <div className="mag-tabs-sidebar__body">
                  {category && (
                    <CategoryBadge
                      label={category}
                      href={categorySlug ? `/categories/${categorySlug}` : undefined}
                    />
                  )}
                  {publishedAt && (
                    <time className="mag-tabs-sidebar__date">{formatDateTime(publishedAt)}</time>
                  )}
                  <h4 className="mag-tabs-sidebar__title">
                    <Link href={href}>{post.title}</Link>
                  </h4>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
