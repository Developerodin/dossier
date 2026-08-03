import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'copyright',
      type: 'text',
      defaultValue: '© 2026 dossier.',
      admin: {
        description: 'Shown under the logo on desktop and at the bottom on mobile.',
      },
    },
    {
      name: 'quickLinks',
      type: 'array',
      label: 'Quick links',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#QuickLinksRowLabel',
        },
      },
    },
    {
      name: 'popularPages',
      type: 'array',
      label: 'Popular pages',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#PopularPagesRowLabel',
        },
      },
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Contact us',
        },
        {
          name: 'email',
          type: 'text',
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
          label: 'Contact page URL',
          defaultValue: '#',
        },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Newsletter',
        },
        {
          name: 'placeholder',
          type: 'text',
          defaultValue: 'Your email',
        },
        {
          name: 'buttonLabel',
          type: 'text',
          defaultValue: 'Subscribe',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social links',
      maxRows: 6,
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'X', value: 'x' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'GitHub', value: 'github' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          defaultValue: '#',
        },
      ],
      admin: {
        initCollapsed: true,
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
