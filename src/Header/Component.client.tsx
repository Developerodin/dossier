'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { ThemeToggle } from '@/providers/Theme/ThemeToggle'
import { resolveHeaderData } from './defaults'
import { HeaderNav } from './Nav'
import { HeaderSearch } from './Search'
import { HeaderSidebar } from './Sidebar'

import './header.css'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
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
      <header className="site-header" {...(theme ? { 'data-theme': theme } : {})}>
        <div className="site-header__inner">
          <Link href="/" className="site-header__logo" aria-label="dossier home">
            <Logo loading="eager" priority="high" />
          </Link>

          <HeaderNav items={resolved.navItems || []} />

          <div className="site-header__actions">
            <HeaderSearch variant="bar" />
            <HeaderSearch variant="icon" />
            <ThemeToggle className="site-header__theme-toggle" />
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
