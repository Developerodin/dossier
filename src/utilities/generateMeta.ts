import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { getMediaUrl } from './getMediaUrl'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const toAbsoluteMediaUrl = (pathOrUrl: string | null | undefined, serverUrl: string) => {
  if (!pathOrUrl) return `${serverUrl}/website-template-OG.webp`
  const resolved = getMediaUrl(pathOrUrl)
  if (/^https?:\/\//i.test(resolved)) return resolved
  return `${serverUrl}${resolved.startsWith('/') ? '' : '/'}${resolved}`
}

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = toAbsoluteMediaUrl('/website-template-OG.webp', serverUrl)

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    url = toAbsoluteMediaUrl(ogUrl || image.url, serverUrl)
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | dossier'
    : 'dossier'

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
