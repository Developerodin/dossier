import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import {
  CategoryPageHeader,
  CategoryPostList,
  queryCategoryPage,
} from '@/components/category'
import { Pagination } from '@/components/Pagination'
import '@/components/category/category.css'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const data = await queryCategoryPage(slug, 1)

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
  const { slug } = await paramsPromise
  const data = await queryCategoryPage(slug, 1)

  if (!data) {
    return {
      title: 'Category not found',
    }
  }

  return {
    title: data.category.title,
    description: data.category.description || undefined,
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
    },
  })

  return categories.docs.map(({ slug }) => ({ slug }))
}
