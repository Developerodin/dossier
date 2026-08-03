import type { RequiredDataFromCollectionSlug } from 'payload'

/** Fallback so `/contact` renders before/without seed. */
export const contactStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'contact',
  _status: 'published',
  hero: {
    type: 'none',
  },
  meta: {
    description: "We'd love to hear from you. Reach the TechBlog team with questions, feedback, or press inquiries.",
    title: 'Contact Us',
  },
  title: 'Contact Us',
  layout: [],
}
