import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'

export const FundingRounds: CollectionConfig = {
  slug: 'funding-rounds',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'companyName',
    defaultColumns: ['companyName', 'series', 'amount', 'topDeal', 'announcedAt', '_status'],
  },
  defaultPopulate: {
    companyName: true,
    slug: true,
    logo: true,
    series: true,
    amount: true,
    sector: true,
    announcedAt: true,
    topDeal: true,
    investors: true,
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'series',
      type: 'select',
      required: true,
      options: [
        { label: 'Pre-Seed', value: 'pre-seed' },
        { label: 'Seed', value: 'seed' },
        { label: 'Series A', value: 'series-a' },
        { label: 'Series B', value: 'series-b' },
        { label: 'Series C', value: 'series-c' },
        { label: 'Series D', value: 'series-d' },
        { label: 'Series E', value: 'series-e' },
        { label: 'Series F', value: 'series-f' },
        { label: 'Growth', value: 'growth' },
        { label: 'IPO', value: 'ipo' },
      ],
    },
    {
      name: 'amount',
      type: 'text',
      required: true,
      admin: {
        description: 'Display string, e.g. $6B or $300M',
      },
    },
    {
      name: 'amountValue',
      type: 'number',
      admin: {
        description: 'Numeric value in billions for sorting (e.g. 6 for $6B, 0.3 for $300M)',
      },
    },
    {
      name: 'sector',
      type: 'text',
    },
    {
      name: 'announcedAt',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'topDeal',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Shows TOP DEAL badge and featured card treatment',
        position: 'sidebar',
      },
    },
    {
      name: 'investors',
      type: 'array',
      labels: {
        singular: 'Investor',
        plural: 'Investors',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
      admin: {
        initCollapsed: true,
      },
    },
    slugField({
      useAsSlug: 'companyName',
    }),
  ],
  timestamps: true,
  versions: {
    drafts: true,
    maxPerDoc: 25,
  },
}
