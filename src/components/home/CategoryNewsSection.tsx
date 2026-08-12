import React from 'react'

import type { Media as MediaType } from '@/payload-types'
import { AdBanner } from '@/components/magazine/AdBanner'
import { SidebarNewsletter } from '@/components/magazine/SidebarNewsletter'
import { CategoryNewsBlock } from './CategoryNewsBlock'
import { CategoryTiles } from './CategoryTiles'
import { MostShareList } from './MostShareList'
import type { ExploreCategory } from './queryExploreCategories'
import { HOME_CATEGORY_SLUGS } from './queryCategoryPosts'
import type { HomePostCard } from './types'

const CATEGORY_LABELS: Record<(typeof HOME_CATEGORY_SLUGS)[number], string> = {
  ai: 'AI News',
  startups: 'Startups News',
  'big-tech': 'Big Tech News',
}

type CategoryNewsSectionProps = {
  categoryPosts: Record<(typeof HOME_CATEGORY_SLUGS)[number], HomePostCard[]>
  mostShared: HomePostCard[]
  categories: ExploreCategory[]
  newsletterFormId?: string | number | null
  sidebarAd?: {
    image?: MediaType | number | null
    url?: string | null
  }
}

export const CategoryNewsSection: React.FC<CategoryNewsSectionProps> = ({
  categoryPosts,
  mostShared,
  categories,
  newsletterFormId,
  sidebarAd,
}) => {
  return (
    <section className="mag-all-posts" aria-label="Category news">
      <div className="mag-all-posts__inner">
        <div className="mag-all-posts__main">
          {HOME_CATEGORY_SLUGS.map((slug) => (
            <CategoryNewsBlock
              key={slug}
              title={CATEGORY_LABELS[slug]}
              slug={slug}
              posts={categoryPosts[slug] || []}
            />
          ))}
        </div>

        <aside className="mag-all-posts__sidebar">
          <MostShareList posts={mostShared} />
          <SidebarNewsletter formId={newsletterFormId} />
          <CategoryTiles categories={categories} />
          <AdBanner image={sidebarAd?.image} url={sidebarAd?.url} />
        </aside>
      </div>
    </section>
  )
}
