import Link from 'next/link'
import React from 'react'
import { Zap } from 'lucide-react'

import type { BreakingNewsItem } from './types'

type BreakingNewsStripProps = {
  items: BreakingNewsItem[]
}

function BreakingList({
  items,
  className,
}: {
  items: BreakingNewsItem[]
  className?: string
}) {
  return (
    <ul className={['home-breaking__list', className].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <li key={item.id} className="home-breaking__item">
          <Link href={`/posts/${item.slug}`} className="home-breaking__link">
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export const BreakingNewsStrip: React.FC<BreakingNewsStripProps> = ({ items }) => {
  if (!items.length) return null

  return (
    <aside className="home-breaking" aria-label="Breaking news">
      <div className="home-breaking__label">
        <Zap className="home-breaking__icon" aria-hidden="true" />
        <span>Breaking</span>
      </div>

      <div className="home-breaking__viewport">
        {/* Accessible / reduced-motion track */}
        <div className="home-breaking__static">
          <BreakingList items={items} />
        </div>

        {/* Visual marquee; hidden from AT to avoid duplicate announcements */}
        <div className="home-breaking__marquee" aria-hidden="true">
          <div className="home-breaking__track">
            <BreakingList items={items} />
            <BreakingList items={items} />
          </div>
        </div>
      </div>
    </aside>
  )
}
