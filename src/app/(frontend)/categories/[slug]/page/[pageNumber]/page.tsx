import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import {
  CategoryPageHeader,
  CategoryPostList,
  CATEGORY_POSTS_PER_PAGE,
  queryCategoryBySlug,
  queryCategoryPage,
} from '@/components/category'
import { Pagination } from '@/components/Pagination'
import '@/components/category/category.css'
import PageClient from '../../page.client'

export const revalidate = 600

type Args = {
  params: Promise<{
    slug: string
    pageNumber: string
  }>
}

export default async function CategoryPaginatedPage({ params: paramsPromise }: Args) {
  const { slug, pageNumber } = await paramsPromise
  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound()

  const data = await queryCategoryPage(slug, sanitizedPageNumber)

  if (!data) notFound()

  const { category, posts, page, totalPages } = data
  const paginationBase = `/categories/${category.slug}`

  return (
    <div className="category-page">
      <PageClient />
      <div className="category-page__inner">
        <CategoryPageHeader title={category.title} description={category.description} />
        <CategoryPostList
          posts={posts}
          categoryLabel={category.title}
          categoryHref={`/categories/${category.slug}`}
        />
        {totalPages > 1 && page && (
          <Pagination page={page} totalPages={totalPages} basePath={paginationBase} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug, pageNumber } = await paramsPromise
  const category = await queryCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Category not found',
    }
  }

  return {
    title: `${category.title} — Page ${pageNumber}`,
    description: category.description || undefined,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const categories = await payload.find({
    collection: 'categories',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
      id: true,
    },
  })

  const params: { slug: string; pageNumber: string }[] = []

  for (const category of categories.docs) {
    const { totalDocs } = await payload.count({
      collection: 'posts',
      overrideAccess: false,
      where: {
        and: [
          { categories: { in: [category.id] } },
          { _status: { equals: 'published' } },
        ],
      },
    })

    const totalPages = Math.ceil(totalDocs / CATEGORY_POSTS_PER_PAGE)

    for (let i = 1; i <= totalPages; i++) {
      params.push({ slug: category.slug, pageNumber: String(i) })
    }
  }

  return params
}
