import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { PostArticle } from '@/components/post/PostArticle'
import { queryHomePosts } from '@/components/home/queryHomePosts'
import { queryMostSharedPosts } from '@/components/home/querySidebarPosts'
import { queryTrendingPosts } from '@/components/home/queryTrendingPosts'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Post } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'
import { NEWSLETTER_FORM_TITLE } from '@/utilities/ensureRequiredForms'
import { queryFormIdByTitle } from '@/utilities/queryFormByTitle'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { JsonLd } from '@/components/JsonLd'
import { getPrimaryCategory } from '@/utilities/primaryCategory'
import { breadcrumbSchema, newsArticleSchema } from '@/utilities/structuredData'

import '@/components/magazine/magazine.css'

export const dynamic = 'force-static'
export const revalidate = 600

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return posts.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const [homePosts, trending, mostShared, headerData, footerData, newsletterFormId, adjacent] =
    await Promise.all([
      queryHomePosts(),
      queryTrendingPosts(),
      queryMostSharedPosts(5),
      getCachedGlobal('header', 1)(),
      getCachedGlobal('footer', 1)(),
      queryFormIdByTitle(NEWSLETTER_FORM_TITLE)(),
      queryAdjacentPosts({ slug: decodedSlug, publishedAt: post.publishedAt }),
    ])

  const shareUrl = `${getServerSideURL()}${url}`
  const primaryCategory = getPrimaryCategory(post.categories)

  return (
    <>
      <JsonLd
        data={[
          newsArticleSchema(post),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            ...(primaryCategory
              ? [{ name: primaryCategory.title, path: `/categories/${primaryCategory.slug}` }]
              : [{ name: 'Articles', path: '/posts' }]),
            { name: post.title, path: url },
          ]),
        ]}
      />
      <PageClient />

      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostArticle
        post={post}
        trending={trending}
        breaking={homePosts.breaking}
        latest={homePosts.latest}
        mostShared={mostShared}
        prevPost={adjacent.prev}
        nextPost={adjacent.next}
        newsletterFormId={newsletterFormId}
        socialLinks={footerData?.socialLinks}
        sidebarAd={headerData?.sidebarAd}
        shareUrl={shareUrl}
      />
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post, path: `/posts/${decodedSlug}`, type: 'article' })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const queryAdjacentPosts = cache(
  async ({
    slug,
    publishedAt,
  }: {
    slug: string
    publishedAt?: string | null
  }): Promise<{
    prev: { title: string; slug: string } | null
    next: { title: string; slug: string } | null
  }> => {
    if (!publishedAt) return { prev: null, next: null }

    const payload = await getPayload({ config: configPromise })

    const [prevResult, nextResult] = await Promise.all([
      payload.find({
        collection: 'posts',
        depth: 0,
        limit: 1,
        pagination: false,
        select: { title: true, slug: true },
        sort: '-publishedAt',
        where: {
          and: [
            { _status: { equals: 'published' } },
            { publishedAt: { greater_than: publishedAt } },
            { slug: { not_equals: slug } },
          ],
        },
      }),
      payload.find({
        collection: 'posts',
        depth: 0,
        limit: 1,
        pagination: false,
        select: { title: true, slug: true },
        sort: 'publishedAt',
        where: {
          and: [
            { _status: { equals: 'published' } },
            { publishedAt: { less_than: publishedAt } },
            { slug: { not_equals: slug } },
          ],
        },
      }),
    ])

    return {
      prev: nextResult.docs[0]
        ? { title: nextResult.docs[0].title, slug: nextResult.docs[0].slug }
        : null,
      next: prevResult.docs[0]
        ? { title: prevResult.docs[0].title, slug: prevResult.docs[0].slug }
        : null,
    }
  },
)
