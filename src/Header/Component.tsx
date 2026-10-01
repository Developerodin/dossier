import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React, { cache } from 'react'

import { resolveHeaderData } from './defaults'

const querySidebarCategories = cache(async () => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 100,
    pagination: false,
    select: { title: true, slug: true },
    sort: 'title',
  })

  return result.docs
    .filter((doc): doc is typeof doc & { slug: string } => Boolean(doc.slug))
    .map((doc) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
    }))
})

export async function Header() {
  const [headerData, categories] = await Promise.all([
    getCachedGlobal('header', 1)(),
    querySidebarCategories(),
  ])

  return <HeaderClient data={resolveHeaderData(headerData)} categories={categories} />
}
