'use client'

import { ChevronDown, ChevronUp, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { ThemeToggle } from '@/providers/Theme/ThemeToggle'

type SidebarGroup = NonNullable<HeaderType['sidebarGroups']>[number]

type HeaderSidebarProps = {
  open: boolean
  onClose: () => void
  groups: SidebarGroup[]
}

export const HeaderSidebar: React.FC<HeaderSidebarProps> = ({ open, onClose, groups }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!open) {
      setOpenIndex(null)
      return
    }

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

        <div className="site-sidebar__groups">
          {groups.map((group, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={group.id ?? `${group.label}-${index}`}
                className={`site-sidebar__group${isOpen ? ' is-open' : ''}`}
              >
                <button
                  type="button"
                  className="site-sidebar__toggle"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span>{group.label}</span>
                  {isOpen ? (
                    <ChevronUp className="site-sidebar__chevron" aria-hidden />
                  ) : (
                    <ChevronDown className="site-sidebar__chevron" aria-hidden />
                  )}
                </button>
                <div className="site-sidebar__links">
                  {(group.links || []).map(({ link }, linkIndex) => (
                    <CMSLink
                      key={linkIndex}
                      {...link}
                      appearance="inline"
                      className="site-sidebar__link"
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="site-sidebar__theme-wrap">
          <ThemeToggle labeled />
        </div>
      </aside>
    </>
  )
}
