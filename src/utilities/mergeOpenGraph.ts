import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { SITE_DESCRIPTION, SITE_NAME, SITE_OG_IMAGE_PATH, SITE_TAGLINE } from './siteInfo'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: SITE_DESCRIPTION,
  images: [
    {
      url: `${getServerSideURL()}${SITE_OG_IMAGE_PATH}`,
    },
  ],
  locale: 'en_US',
  siteName: SITE_NAME,
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  } as Metadata['openGraph']
}
