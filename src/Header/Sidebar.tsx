'use client'

import { X } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'

import { ThemeToggle } from '@/providers/Theme/ThemeToggle'

export type SidebarCategory = {
  id: number
  title: string
  slug: string
}

type HeaderSidebarProps = {
  open: boolean
  onClose: () => void
  categories: SidebarCategory[]
}

export const HeaderSidebar: React.FC<HeaderSidebarProps> = ({ open, onClose, categories }) => {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.classList.add('sidebar-open')

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('sidebar-open')
    }
  }, [open, onClose])

  return (
    <>
      <div
        className={`site-sidebar-backdrop${open ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`site-sidebar${open ? ' is-open' : ''}`}
        aria-hidden={!open}
        aria-label="Site menu"
      >
        <div className="site-sidebar__header">
          <span className="site-sidebar__title">Menu</span>
          <button
            type="button"
            className="site-header__icon-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="site-sidebar__nav" aria-label="Categories">
          <p className="site-sidebar__section-label">Categories</p>
          <ul className="site-sidebar__list">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="site-sidebar__link"
                  onClick={onClose}
                >
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>

          <p className="site-sidebar__section-label">More</p>
          <ul className="site-sidebar__list">
            <li>
              <Link href="/contact" className="site-sidebar__link" onClick={onClose}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="site-sidebar__theme-wrap">
          <ThemeToggle labeled />
        </div>
      </aside>
    </>
  )
}
