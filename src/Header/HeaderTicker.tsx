'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { BreakingNewsItem } from '@/components/home/types'

type HeaderTickerProps = {
  items: BreakingNewsItem[]
}

export const HeaderTicker: React.FC<HeaderTickerProps> = ({ items }) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (items.length <= 1) return
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [items.length])

  if (!items.length) return null

  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length)
  const next = () => setIndex((i) => (i + 1) % items.length)

  return (
    <div className="mag-header-ticker">
      <span className="mag-header-ticker__label">Trending :</span>
      <div className="mag-header-ticker__track">
        {items.map((item, i) => (
          <Link
            key={item.id}
            href={`/posts/${item.slug}`}
            className={`mag-header-ticker__item${i === index ? ' mag-header-ticker__item--active' : ''}`}
          >
            {item.title}
          </Link>
        ))}
      </div>
      <div className="mag-header-ticker__nav">
        <button type="button" aria-label="Previous trending headline" onClick={prev}>
          <ChevronLeft size={14} />
        </button>
        <button type="button" aria-label="Next trending headline" onClick={next}>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
