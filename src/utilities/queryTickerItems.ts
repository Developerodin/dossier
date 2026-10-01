import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'

export const queryTickerItems = cache(async () => {
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
