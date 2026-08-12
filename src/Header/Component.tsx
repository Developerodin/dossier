import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React, { cache } from 'react'

import { resolveHeaderData } from './defaults'

const queryTickerItems = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const [breaking, trending] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 0,
      limit: 6,
      pagination: false,
      select: { title: true, slug: true },
      sort: '-publishedAt',
      where: {
        and: [{ breakingNews: { equals: true } }, { _status: { equals: 'published' } }],
      },
    }),
    payload.find({
      collection: 'posts',
      depth: 0,
      limit: 6,
      pagination: false,
      select: { title: true, slug: true },
      sort: '-publishedAt',
      where: {
        and: [{ 'categories.slug': { equals: 'trending' } }, { _status: { equals: 'published' } }],
      },
    }),
  ])

  const seen = new Set<number>()
  const merged = [...breaking.docs, ...trending.docs].filter((doc) => {
    if (seen.has(doc.id)) return false
    seen.add(doc.id)
    return true
  })

  return merged.slice(0, 8)
})

export async function Header() {
  const [headerData, tickerItems] = await Promise.all([
    getCachedGlobal('header', 1)(),
    queryTickerItems(),
  ])

  const now = new Date()
  const dateTime = now.toISOString().slice(0, 10)
  const dateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(now)

  return (
    <HeaderClient
      data={resolveHeaderData(headerData)}
      tickerItems={tickerItems}
      dateTime={dateTime}
      dateLabel={dateLabel}
    />
  )
}
