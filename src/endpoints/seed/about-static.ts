import type { RequiredDataFromCollectionSlug } from 'payload'

/** Fallback so `/about` renders before/without seed. */
export const aboutStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'about',
  _status: 'published',
  hero: {
    type: 'none',
  },
  meta: {
    description:
      'dossier brings you accurate, fact-checked tech news and daily updates so you never fall behind in a fast-moving tech world.',
    title: 'About Us',
  },
  title: 'About Us',
  layout: [],
}
