import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { SITE_NAME } from '@/utilities/siteInfo'
import { CardPostData } from '@/components/Card'
import { SearchResults } from '@/components/magazine/SearchResults'

import '@/components/magazine/magazine.css'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
              {
                'categories.title': {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  return (
    <div className="mag-search">
      <PageClient />
      <div className="mag-search__inner">
        <header className="mag-search__header">
          <h1 className="mag-search__title-page">Search</h1>
          <p className="mag-search__subtitle">Find stories across dossier</p>
          <div className="mag-search__form-wrap">
            <Search />
          </div>
        </header>

        <SearchResults posts={posts.docs as CardPostData[]} query={query} />
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Search | ${SITE_NAME}`,
    description: `Search ${SITE_NAME} coverage of AI, startups, funding, big tech, and cybersecurity.`,
  }
}
