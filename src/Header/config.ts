import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: 'Center navigation',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'sidebarGroups',
      type: 'array',
      label: 'Sidebar menu groups',
      maxRows: 5,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          maxRows: 3,
          fields: [
            link({
              appearances: false,
            }),
          ],
          admin: {
            initCollapsed: true,
          },
        },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/SidebarRowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
