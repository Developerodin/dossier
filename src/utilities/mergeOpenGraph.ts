import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Technology news, analysis, and startup coverage from dossier.',
  images: [
    {
      url: `${getServerSideURL()}/dossier-OG.webp`,
    },
  ],
  siteName: 'dossier',
  title: 'dossier',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
