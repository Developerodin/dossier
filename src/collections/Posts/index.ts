import type { CollectionConfig, Endpoint } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

const incrementViewEndpoint: Endpoint = {
  path: '/:id/view',
  method: 'post',
  handler: async (req) => {
    const id = req.routeParams?.id
    if (!id) {
      return Response.json({ error: 'Missing post id' }, { status: 400 })
    }

    try {
      const post = await req.payload.findByID({
        collection: 'posts',
        id: String(id),
        depth: 0,
        overrideAccess: true,
      })

      const current = typeof post.viewCount === 'number' ? post.viewCount : 0

      await req.payload.update({
        collection: 'posts',
        id: String(id),
        data: { viewCount: current + 1 },
        depth: 0,
        overrideAccess: true,
        context: { disableRevalidate: true },
      })

      return Response.json({ ok: true })
    } catch {
      return Response.json({ error: 'Post not found' }, { status: 404 })
    }
  },
}

const incrementShareEndpoint: Endpoint = {
  path: '/:id/share',
  method: 'post',
  handler: async (req) => {
    const id = req.routeParams?.id
    if (!id) {
      return Response.json({ error: 'Missing post id' }, { status: 400 })
    }

    try {
      const post = await req.payload.findByID({
        collection: 'posts',
        id: String(id),
        depth: 0,
        overrideAccess: true,
      })

      const current = typeof post.shareCount === 'number' ? post.shareCount : 0

      await req.payload.update({
        collection: 'posts',
        id: String(id),
        data: { shareCount: current + 1 },
        depth: 0,
        overrideAccess: true,
        context: { disableRevalidate: true },
      })

      return Response.json({ ok: true })
    } catch {
      return Response.json({ error: 'Post not found' }, { status: 404 })
    }
  },
}

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    excerpt: true,
    readingTime: true,
    heroImage: true,
    publishedAt: true,
    populatedAuthors: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'posts',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'posts',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: true,
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            {
              name: 'relatedPosts',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'posts',
            },
            {
              name: 'categories',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'categories',
            },
          ],
          label: 'Meta',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Short summary shown on the homepage hero and cards.',
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Estimated reading time in minutes.',
      },
      label: 'Reading time (min)',
      min: 1,
    },
    {
      name: 'viewCount',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Display view count on cards (e.g. 128000 shows as 128K).',
      },
      label: 'View count',
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'shareCount',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Share count for Most Share widgets.',
      },
      label: 'Share count',
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'YouTube or Vimeo URL for video posts.',
      },
      label: 'Video URL',
    },
    {
      name: 'videoNews',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description: 'Include this post in the homepage Video News section.',
      },
      defaultValue: false,
      label: 'Video news',
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description: 'Show this post as the homepage featured story.',
      },
      defaultValue: false,
    },
    {
      name: 'featuredOrder',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first among featured posts.',
        condition: (_, siblingData) => Boolean(siblingData?.featured),
      },
      defaultValue: 0,
    },
    {
      name: 'editorsPick',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description: "Show this post in the homepage Editor's Picks section.",
      },
      defaultValue: false,
    },
    {
      name: 'editorsPickOrder',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: "Lower numbers appear first among editor's picks. First pick is the Top Pick.",
        condition: (_, siblingData) => Boolean(siblingData?.editorsPick),
      },
      defaultValue: 0,
    },
    {
      name: 'breakingNews',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description: 'Include this post in the breaking news ticker.',
      },
      defaultValue: false,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },
    // This field is only used to populate the user data via the `populateAuthors` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  endpoints: [incrementViewEndpoint, incrementShareEndpoint],
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
