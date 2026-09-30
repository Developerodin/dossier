import { getServerSideSitemap, type ISitemapField } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { getServerSideURL } from '@/utilities/getURL'

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL()

    const [results, latestPost] = await Promise.all([
      payload.find({
        collection: 'pages',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      payload.find({
        collection: 'posts',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1,
        sort: '-updatedAt',
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          updatedAt: true,
        },
      }),
    ])

    const dateFallback = new Date().toISOString()
    const latestContent = latestPost.docs[0]?.updatedAt || dateFallback

    const entries = new Map<string, ISitemapField>([
      [`${SITE_URL}/`, { loc: `${SITE_URL}/`, lastmod: latestContent }],
      [`${SITE_URL}/posts`, { loc: `${SITE_URL}/posts`, lastmod: latestContent }],
      [`${SITE_URL}/search`, { loc: `${SITE_URL}/search`, lastmod: latestContent }],
      [`${SITE_URL}/contact`, { loc: `${SITE_URL}/contact`, lastmod: dateFallback }],
    ])

    for (const page of results.docs || []) {
      if (!page?.slug) continue
      const loc = page.slug === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${page.slug}`
      entries.set(loc, {
        loc,
        lastmod: page.slug === 'home' ? latestContent : page.updatedAt || dateFallback,
      })
    }

    return [...entries.values()]
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap', 'posts-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
