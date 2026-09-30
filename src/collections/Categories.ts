import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from 'payload'

import { revalidateTag } from 'next/cache'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

const revalidateCategory: CollectionAfterChangeHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) revalidateTag('categories-sitemap', 'max')
  return doc
}

const revalidateCategoryDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) revalidateTag('categories-sitemap', 'max')
  return doc
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    afterChange: [revalidateCategory],
    afterDelete: [revalidateCategoryDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'accentColor',
      type: 'text',
      defaultValue: '#1B5E3B',
      admin: {
        description: 'Hex accent for title and header bar (e.g. #1B5E3B)',
      },
    },
    slugField({
      position: undefined,
    }),
  ],
}
