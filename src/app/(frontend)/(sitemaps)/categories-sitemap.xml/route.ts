import { getServerSideSitemap, type ISitemapField } from 'next-sitemap'

import { getAICategorySummaries } from '@/utilities/aiDiscovery'

export async function GET() {
  const categories = await getAICategorySummaries()
  const dateFallback = new Date().toISOString()

  const sitemap: ISitemapField[] = categories.map((category) => ({
    loc: category.url,
    lastmod: category.lastUpdated || dateFallback,
  }))

  return getServerSideSitemap(sitemap)
}
