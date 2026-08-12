'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import { Menu, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

import type { Header } from '@/payload-types'
import type { BreakingNewsItem } from '@/components/home/types'

import { Logo } from '@/components/Logo/Logo'
import { AdBanner } from '@/components/magazine/AdBanner'
import { resolveHeaderData } from './defaults'
import { HeaderNav } from './Nav'
import { HeaderSearch } from './Search'
import { HeaderSidebar } from './Sidebar'
import { HeaderTicker } from './HeaderTicker'

import './header.css'
import '@/components/magazine/magazine.css'

interface HeaderClientProps {
  data: Header
  tickerItems: BreakingNewsItem[]
  dateTime: string
  dateLabel: string
}

export const HeaderClient: React.FC<HeaderClientProps> = ({
  data,
  tickerItems,
  dateTime,
  dateLabel,
}) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const resolved = resolveHeaderData(data)

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  useEffect(() => {
    setHeaderTheme(null)
    setSidebarOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <>
      <div className="mag-header__top">
        <div className="mag-header__top-inner">
          <HeaderTicker items={tickerItems} />
          <time className="mag-header__date" dateTime={dateTime}>
            {dateLabel}
          </time>
        </div>
      </div>

      <div className="mag-header__center">
        <div className="mag-header__center-inner">
          <Link href="/" className="mag-header__logo site-header__logo" aria-label="dossier home">
            <Logo loading="eager" priority="high" variant="black" />
          </Link>
          <AdBanner
            image={resolved.headerAd?.image}
            url={resolved.headerAd?.url}
            className="mag-header__ad"
          />
        </div>
      </div>

      <header
        className="mag-header mag-header__menu site-header"
        {...(theme ? { 'data-theme': theme } : {})}
      >
        <div className="mag-header__menu-inner site-header__inner">
          <HeaderNav items={resolved.navItems || []} />

          <div className="site-header__actions mag-header__actions">
            <HeaderSearch variant="bar" />
            <HeaderSearch variant="icon" />
            <Link href="/admin" className="site-header__icon-btn" aria-label="Admin login">
              <User size={18} />
            </Link>
            <button
              type="button"
              className="site-header__icon-btn site-header__burger"
              aria-label="Open menu"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <HeaderSidebar
        open={sidebarOpen}
        onClose={closeSidebar}
        groups={resolved.sidebarGroups || []}
      />
    </>
  )
}
