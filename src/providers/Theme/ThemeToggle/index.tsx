'use client'

import { Moon, Sun } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { useTheme } from '..'

type ThemeToggleProps = {
  className?: string
  /** When true, renders a labeled row for the sidebar menu */
  labeled?: boolean
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, labeled = false }) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Stable defaults until mounted so SSR HTML matches the first client render.
  const isDark = mounted && theme === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'
  const toggle = () => setTheme(isDark ? 'light' : 'dark')

  if (labeled) {
    return (
      <div className="site-sidebar__theme">
        <span className="site-sidebar__theme-label">Appearance</span>
        <button
          type="button"
          className="site-sidebar__theme-btn"
          aria-label={label}
          disabled={!mounted}
          onClick={toggle}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      className={`site-header__icon-btn${className ? ` ${className}` : ''}`}
      aria-label={label}
      disabled={!mounted}
      onClick={toggle}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
