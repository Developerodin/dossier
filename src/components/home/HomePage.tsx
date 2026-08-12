import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { BreakingNewsStrip } from './BreakingNewsStrip'
import { CategoryNewsSection } from './CategoryNewsSection'
import { FeatureNewsCarousel } from './FeatureNewsCarousel'
import { MostViewFeed } from './MostViewFeed'
import { NewsletterSection } from './NewsletterSection'
import { PostGalleryHero } from './PostGalleryHero'
import { TrendingWithSidebar } from './TrendingWithSidebar'
import { VideoNews } from './VideoNews'
import { HOME_CATEGORY_SLUGS, queryCategoryPosts } from './queryCategoryPosts'
import { queryExploreCategories } from './queryExploreCategories'
import { queryHomePosts } from './queryHomePosts'
import { queryTrendingPosts } from './queryTrendingPosts'
import { queryVideoNewsPosts } from './queryVideoNews'
import { NEWSLETTER_FORM_TITLE } from '@/utilities/ensureRequiredForms'
import { queryFormIdByTitle } from '@/utilities/queryFormByTitle'

import './home.css'
import '@/components/magazine/magazine.css'

export const HomePage: React.FC = async () => {
  const [
    homePosts,
    categories,
    trending,
    newsletterFormId,
    videoPosts,
    footerData,
    headerData,
    ...categoryPostsList
  ] = await Promise.all([
    queryHomePosts(),
    queryExploreCategories(),
    queryTrendingPosts(),
    queryFormIdByTitle(NEWSLETTER_FORM_TITLE)(),
    queryVideoNewsPosts(),
    getCachedGlobal('footer', 1)(),
    getCachedGlobal('header', 1)(),
    ...HOME_CATEGORY_SLUGS.map((slug) => queryCategoryPosts(slug, 4)),
  ])

  const categoryPosts = Object.fromEntries(
    HOME_CATEGORY_SLUGS.map((slug, index) => [slug, categoryPostsList[index]]),
  ) as Record<(typeof HOME_CATEGORY_SLUGS)[number], typeof categoryPostsList[number]>

  const { featuredPosts, breaking, latest, editorsPicks, popular, mostShared } = homePosts
  const sidebarAd = headerData?.sidebarAd
  const socialLinks = footerData?.socialLinks

  return (
    <div className="home-page mag-page">
      <PostGalleryHero
        posts={featuredPosts}
        trending={trending}
        breaking={breaking}
        latest={latest}
      />
      {breaking.length > 0 && <BreakingNewsStrip items={breaking} />}
      {editorsPicks.length > 0 && <FeatureNewsCarousel posts={editorsPicks} />}
      <TrendingWithSidebar posts={trending} popular={popular} socialLinks={socialLinks} />
      <VideoNews posts={videoPosts} popular={popular} />
      <CategoryNewsSection
        categoryPosts={categoryPosts}
        mostShared={mostShared}
        categories={categories}
        newsletterFormId={newsletterFormId}
        sidebarAd={sidebarAd}
      />
      <NewsletterSection formId={newsletterFormId} />
      <MostViewFeed posts={popular} />
    </div>
  )
}
