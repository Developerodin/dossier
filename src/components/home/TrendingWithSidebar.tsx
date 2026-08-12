import React from 'react'

import type { Footer } from '@/payload-types'
import { FollowUs } from '@/components/magazine/FollowUs'
import { TrendingStories } from './TrendingStories'
import { MostViewList } from './MostViewList'
import type { HomePostCard } from './types'

type TrendingWithSidebarProps = {
  posts: HomePostCard[]
  popular: HomePostCard[]
  socialLinks?: Footer['socialLinks']
}

export const TrendingWithSidebar: React.FC<TrendingWithSidebarProps> = ({
  posts,
  popular,
  socialLinks,
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
  </section>
)
