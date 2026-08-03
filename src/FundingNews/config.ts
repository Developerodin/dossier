import type { GlobalConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { revalidateFundingNews } from './hooks/revalidateFundingNews'

export const FundingNews: GlobalConfig = {
  slug: 'funding-news',
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'FUNDING NEWS',
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Latest funding rounds',
      required: true,
    },
    {
      name: 'titleAccent',
      type: 'text',
      defaultValue: 'in tech',
      admin: {
        description: 'Highlighted phrase after the title (styled in green)',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue: 'Track the capital fueling the next generation of companies and ideas.',
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'View all funding news',
    },
    {
      name: 'ctaLink',
      type: 'text',
      defaultValue: '/categories/funding',
    },
    {
      name: 'stats',
      type: 'group',
      fields: [
        {
          name: 'totalFundingThisWeek',
          type: 'text',
          defaultValue: '$8.47B',
          label: 'Total funding this week',
        },
        {
          name: 'roundsCount',
          type: 'text',
          defaultValue: '24',
          label: 'Rounds',
        },
        {
          name: 'topSector',
          type: 'text',
          defaultValue: 'AI',
          label: 'Top sector',
        },
        {
          name: 'biggestRound',
          type: 'text',
          defaultValue: '$6B',
          label: 'Biggest round',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFundingNews],
  },
}
