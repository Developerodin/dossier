import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type HomeArgs = {
  heroImage: Media
  metaImage: Media
}

export const home: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  metaImage,
}) => {
  return {
    slug: 'home',
    _status: 'published',
    // Homepage is rendered from Posts via HomePage; keep Pages hero empty.
    hero: {
      type: 'none',
    },
    // Required by Pages schema; homepage sections come from Posts, not these blocks.
    layout: [
      {
        blockType: 'content',
        columns: [],
      },
    ],
    meta: {
      description: 'Tech news, analysis, and breaking stories from around the industry.',
      image: metaImage.id,
      title: 'Home',
    },
    title: 'Home',
  }
}
