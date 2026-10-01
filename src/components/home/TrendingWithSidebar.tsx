import React from 'react'

import type { Footer } from '@/payload-types'
import type { HomePostCard } from './types'
import { FollowUs } from '@/components/magazine/FollowUs'
import { HeaderTicker } from '@/Header/HeaderTicker'
import { TrendingStories } from './TrendingStories'
import { MostViewList } from './MostViewList'

type TickerItem = {
  id: number
  title: string
  slug?: string | null
}

type TrendingWithSidebarProps = {
  posts: HomePostCard[]
  popular: HomePostCard[]
  socialLinks?: Footer['socialLinks']
  tickerItems?: TickerItem[]
  dateTime?: string
  dateLabel?: string
}

export const TrendingWithSidebar: React.FC<TrendingWithSidebarProps> = ({
  posts,
  popular,
  socialLinks,
  tickerItems = [],
  dateTime,
  dateLabel,
}) => (
  <section className="mag-trending-area">
    <div className="mag-trending-area__inner">
      <div className="mag-trending-area__main">
        <TrendingStories posts={posts} />
      </div>
      <aside className="mag-trending-area__sidebar">
        <FollowUs socialLinks={socialLinks} />
        <MostViewList posts={popular} />
      </aside>
    </div>

    {tickerItems.length > 0 && (
      <div className="mag-header__top mag-trending-ticker">
        <div className="mag-header__top-inner">
          <HeaderTicker items={tickerItems} />
          {dateTime && dateLabel ? (
            <time className="mag-header__date" dateTime={dateTime}>
              {dateLabel}
            </time>
          ) : null}
        </div>
      </div>
    )}
  </section>
)
