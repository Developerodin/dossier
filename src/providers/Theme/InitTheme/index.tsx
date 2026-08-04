'use client'

import React, { useSyncExternalStore } from 'react'

import { defaultTheme, themeLocalStorageKey } from '../shared'

const emptySubscribe = () => () => {}

const themeScript = `
  (function () {
    function themeIsValid(theme) {
      return theme === 'light' || theme === 'dark'
    }

    var themeToSet = '${defaultTheme}'
    var preference = window.localStorage.getItem('${themeLocalStorageKey}')

    if (themeIsValid(preference)) {
      themeToSet = preference
    }

    document.documentElement.setAttribute('data-theme', themeToSet)
  })();
`

/**
 * Injects a blocking theme script during SSR + hydration only.
 * After hydration, renders null so React 19 does not warn about
 * script tags created during client renders.
 */
export const InitTheme: React.FC = () => {
  const isServerOrHydrating = useSyncExternalStore(
    emptySubscribe,
    () => false,
    () => true,
  )

  if (!isServerOrHydrating) {
    return null
  }

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: themeScript,
      }}
      id="theme-script"
      suppressHydrationWarning
    />
  )
}
