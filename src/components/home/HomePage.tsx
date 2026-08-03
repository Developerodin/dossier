import React from 'react'

import { BreakingNewsStrip } from './BreakingNewsStrip'
import { EditorsPicks } from './EditorsPicks'
import { ExploreTopics } from './ExploreTopics'
import { FundingNews } from './FundingNews'
import { HomeHero } from './HomeHero'
import { LatestArticles } from './LatestArticles'
import { NewsletterSection } from './NewsletterSection'
import { TrendingStories } from './TrendingStories'
import { queryExploreCategories } from './queryExploreCategories'
import { queryFundingNews } from './queryFundingNews'
import { queryHomePosts } from './queryHomePosts'
import { queryTrendingPosts } from './queryTrendingPosts'

import './home.css'

export const HomePage: React.FC = async () => {
  const [{ featured, breaking, latest, editorsPicks }, categories, funding, trending] =
    await Promise.all([
      queryHomePosts(),
      queryExploreCategories(),
      queryFundingNews(),
      queryTrendingPosts(),
    ])

  return (
    <div className="home-page">
      {featured && <HomeHero post={featured} />}
      {breaking.length > 0 && <BreakingNewsStrip items={breaking} />}
      <TrendingStories posts={trending} />
      {editorsPicks.length > 0 && <EditorsPicks posts={editorsPicks} />}
      <FundingNews settings={funding.settings} rounds={funding.rounds} />
      <ExploreTopics categories={categories} />
      <NewsletterSection />
      {latest.length > 0 && <LatestArticles posts={latest} />}
    </div>
  )
}
