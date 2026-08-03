'use client'

import { SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { FormEvent } from 'react'

type HeaderSearchProps = {
  variant: 'bar' | 'icon'
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({ variant }) => {
  const router = useRouter()

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const query = String(formData.get('q') || '').trim()
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/search')
  }

  if (variant === 'icon') {
    return (
      <Link href="/search" className="site-header__icon-btn site-header__search-icon" aria-label="Search">
        <SearchIcon size={18} />
      </Link>
    )
  }

  return (
    <form className="site-header__search-form" role="search" onSubmit={onSubmit} action="/search">
      <label htmlFor="site-header-search" className="sr-only">
        Search
      </label>
      <input
        id="site-header-search"
        className="site-header__search-input"
        type="search"
        name="q"
        placeholder="Search"
        autoComplete="off"
      />
    </form>
  )
}
