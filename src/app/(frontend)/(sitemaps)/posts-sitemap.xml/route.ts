import { getServerSideSitemap, type ISitemapField } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import type { Media } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const toImageEntry = (image: unknown, siteURL: string, title: string) => {
  if (!image || typeof image !== 'object' || !('url' in image)) return null
  const media = image as Media
  const raw = typeof media.url === 'string' ? media.url.trim() : ''
  // A missing URL must be omitted. Emitting a string (or the literal
  // "undefined") makes next-sitemap write <image:loc>undefined</image:loc>,
  // which Google rejects for the whole sitemap.
  if (!raw || raw === 'undefined' || raw === 'null') return null

  let loc: URL
  try {
    loc = new URL(raw, siteURL)
  } catch {
    return null
  }

  if (loc.protocol !== 'http:' && loc.protocol !== 'https:') return null
  if (!loc.href) return null

  return {
    loc,
    title,
    ...(media.alt ? { caption: media.alt } : {}),
  }
}

const getPostsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL()

    const results = await payload.find({
      collection: 'posts',
      overrideAccess: false,
      draft: false,
      depth: 1,
      limit: 5000,
      pagination: false,
      sort: '-publishedAt',
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        title: true,
        heroImage: true,
        updatedAt: true,
      },
      populate: {
        media: { url: true, filename: true, alt: true },
      },
    })

    const dateFallback = new Date().toISOString()

    const sitemap: ISitemapField[] = results.docs
      ? results.docs
          .filter((post) => Boolean(post?.slug))
          .map((post) => {
            const image = toImageEntry(post.heroImage, SITE_URL, post.title)

            return {
              loc: `${SITE_URL}/posts/${post?.slug}`,
              lastmod: post.updatedAt || dateFallback,
              ...(image ? { images: [image] } : {}),
            }
          })
      : []

    return sitemap
  },
  ['posts-sitemap'],
  {
    tags: ['posts-sitemap'],
    revalidate: 3600,
  },
)

export async function GET() {
  const sitemap = await getPostsSitemap()

  return getServerSideSitemap(sitemap)
}
