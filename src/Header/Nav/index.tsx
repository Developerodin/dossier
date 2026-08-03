'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

type NavItem = NonNullable<HeaderType['navItems']>[number]

export const HeaderNav: React.FC<{ items: NavItem[] }> = ({ items }) => {
  return (
    <nav className="site-header__nav" aria-label="Primary">
      {items.map(({ link }, i) => (
        <CMSLink key={i} {...link} appearance="inline" className="site-header__nav-link" />
      ))}
    </nav>
  )
}
