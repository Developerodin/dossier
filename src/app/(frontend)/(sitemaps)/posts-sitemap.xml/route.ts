import { getServerSideSitemap, type ISitemapField } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import type { Media } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const toImageEntry = (image: unknown, siteURL: string, title: string) => {
  if (!image || typeof image !== 'object' || !('url' in image)) return null
  const media = image as Media
  if (!media.url) return null

  try {
    return {
      loc: new URL(media.url, siteURL),
      title,
      ...(media.alt ? { caption: media.alt } : {}),
    }
  } catch {
    return null
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
  },
)

export async function GET() {
  const sitemap = await getPostsSitemap()

  return getServerSideSitemap(sitemap)
}
