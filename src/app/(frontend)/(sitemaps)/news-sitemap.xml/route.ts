import { getServerSideSitemap, type ISitemapField } from 'next-sitemap'

import { getAIPostSummaries } from '@/utilities/aiDiscovery'
import { SITE_LANGUAGE, SITE_NAME } from '@/utilities/siteInfo'

// Google News only accepts articles published within the last two days.
const NEWS_WINDOW_MS = 48 * 60 * 60 * 1000

export async function GET() {
  const posts = await getAIPostSummaries()
  const cutoff = Date.now() - NEWS_WINDOW_MS

  const sitemap: ISitemapField[] = posts
    .filter((post) => post.publishedAt && new Date(post.publishedAt).getTime() >= cutoff)
    .slice(0, 1000)
    .map((post) => ({
      loc: post.url,
      lastmod: post.updatedAt,
      news: {
        title: post.title,
        publicationName: SITE_NAME,
        publicationLanguage: SITE_LANGUAGE,
        date: post.publishedAt as string,
      },
    }))

  return getServerSideSitemap(sitemap)
}
