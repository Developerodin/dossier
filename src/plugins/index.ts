import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { s3Storage } from '@payloadcms/storage-s3'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { revalidateForms, revalidateFormsDelete } from '@/hooks/revalidateForms'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const s3Bucket = process.env.S3_BUCKET || ''
const s3Region = process.env.S3_REGION || ''
const s3AccessKeyId = process.env.S3_ACCESS_KEY_ID || ''
const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY || ''
const s3Enabled = Boolean(s3Bucket && s3Region && s3AccessKeyId && s3SecretAccessKey)
const s3Endpoint =
  process.env.S3_ENDPOINT || (s3Region ? `https://s3.${s3Region}.amazonaws.com` : undefined)

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | dossier` : 'dossier'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateForms],
        afterDelete: [revalidateFormsDelete],
      },
    },
    formSubmissionOverrides: {
      admin: {
        defaultColumns: ['form', 'createdAt'],
        useAsTitle: 'id',
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  // Read S3 env at plugin-apply time (after dotenv), not at module import time.
  (incomingConfig) =>
    s3Storage({
      enabled: s3Enabled,
      // Omit acl — modern S3 buckets use "Bucket owner enforced" and reject ACLs.
      // Make objects public via bucket policy instead (see .env.example).
      bucket: s3Bucket,
      // Server-side upload by default (reliable image processing + thumbnails).
      // Set S3_CLIENT_UPLOADS=true on Vercel for large files (requires bucket CORS).
      clientUploads: process.env.S3_CLIENT_UPLOADS === 'true',
      collections: {
        media: true,
      },
      config: {
        credentials: {
          accessKeyId: s3AccessKeyId,
          secretAccessKey: s3SecretAccessKey,
        },
        region: s3Region,
        ...(s3Endpoint
          ? {
              endpoint: s3Endpoint,
              forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
            }
          : {}),
      },
    })(incomingConfig),
]
