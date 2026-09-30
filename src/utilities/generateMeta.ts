import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { getMediaUrl } from './getMediaUrl'
import { getPrimaryCategory } from './primaryCategory'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { SITE_DESCRIPTION, SITE_NAME, SITE_OG_IMAGE_PATH, SITE_TAGLINE } from './siteInfo'

const toAbsoluteMediaUrl = (pathOrUrl: string | null | undefined, serverUrl: string) => {
  if (!pathOrUrl) return `${serverUrl}${SITE_OG_IMAGE_PATH}`
  const resolved = getMediaUrl(pathOrUrl)
  if (/^https?:\/\//i.test(resolved)) return resolved
  return `${serverUrl}${resolved.startsWith('/') ? '' : '/'}${resolved}`
}

export const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = toAbsoluteMediaUrl(SITE_OG_IMAGE_PATH, serverUrl)

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    url = toAbsoluteMediaUrl(ogUrl || image.url, serverUrl)
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  path?: string
  type?: 'website' | 'article'
}): Promise<Metadata> => {
  const { doc, path, type = 'website' } = args

  const ogImage = getImageURL(doc?.meta?.image)
  const isHome = path === '/'
  const metaTitle = (doc?.meta?.title || doc?.title)?.trim()

  const title =
    metaTitle && !(isHome && metaTitle.toLowerCase() === 'home')
      ? `${metaTitle} | ${SITE_NAME}`
      : `${SITE_NAME} | ${SITE_TAGLINE}`

  const excerpt = doc && 'excerpt' in doc ? doc.excerpt : null
  const description = (doc?.meta?.description || excerpt || SITE_DESCRIPTION).trim()

  const url = `${getServerSideURL()}${path ?? '/'}`
  const post = type === 'article' ? (doc as Partial<Post> | null) : null
  const section = post ? getPrimaryCategory(post.categories) : undefined

  return {
    description,
    alternates: path ? { canonical: url } : undefined,
    openGraph: mergeOpenGraph({
      description,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url,
      ...(post
        ? {
            type: 'article',
            publishedTime: post.publishedAt || undefined,
            modifiedTime: post.updatedAt || undefined,
            section: section?.title,
            authors: post.populatedAuthors
              ?.map((author) => author.name)
              .filter((name): name is string => Boolean(name)),
          }
        : {}),
    }),
    title,
  }
}
