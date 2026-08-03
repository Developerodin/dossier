import { cache } from 'react'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { FundingNew, FundingRound } from '@/payload-types'

export type FundingNewsData = {
  settings: FundingNew
  rounds: FundingRound[]
}

const defaultSettings: FundingNew = {
  id: 0,
  eyebrow: 'FUNDING NEWS',
  title: 'Latest funding rounds',
  titleAccent: 'in tech',
  subtitle: 'Track the capital fueling the next generation of companies and ideas.',
  ctaLabel: 'View all funding news',
  ctaLink: '/categories/funding',
  stats: {
    totalFundingThisWeek: '$8.47B',
    roundsCount: '24',
    topSector: 'AI',
    biggestRound: '$6B',
  },
}

export const queryFundingNews = cache(async (): Promise<FundingNewsData> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const publishedFilter = draft ? [] : [{ _status: { equals: 'published' as const } }]

  const [settings, roundsResult] = await Promise.all([
    payload.findGlobal({
      slug: 'funding-news',
      depth: 0,
    }),
    payload.find({
      collection: 'funding-rounds',
      depth: 1,
      draft,
      limit: 4,
      overrideAccess: draft,
      pagination: false,
      sort: '-announcedAt',
      where: {
        and: [...publishedFilter],
      },
    }),
  ])

  // Prefer top deal first, then keep remaining by announcedAt order
  const rounds = [...(roundsResult.docs as FundingRound[])].sort((a, b) => {
    if (a.topDeal && !b.topDeal) return -1
    if (!a.topDeal && b.topDeal) return 1
    return 0
  })

  return {
    settings: (settings as FundingNew) ?? defaultSettings,
    rounds,
  }
})
