import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import type { FundingNew, FundingRound } from '@/payload-types'

import { FundingRoundCard } from './FundingRoundCard'
import { FundingStatsBar } from './FundingStatsBar'

type FundingNewsProps = {
  settings: FundingNew
  rounds: FundingRound[]
}

export const FundingNews: React.FC<FundingNewsProps> = ({ settings, rounds }) => {
  if (!rounds.length) return null

  const eyebrow = settings.eyebrow || 'FUNDING NEWS'
  const title = settings.title || 'Latest funding rounds'
  const titleAccent = settings.titleAccent || 'in tech'
  const subtitle =
    settings.subtitle || 'Track the capital fueling the next generation of companies and ideas.'
  const ctaLabel = settings.ctaLabel || 'View all funding news'
  const ctaLink = settings.ctaLink || '/categories/funding'
  const stats = settings.stats ?? {
    totalFundingThisWeek: '$8.47B',
    roundsCount: '24',
    topSector: 'AI',
    biggestRound: '$6B',
  }

  return (
    <section className="home-funding" aria-labelledby="home-funding-title">
      <div className="home-funding__inner">
        <div className="home-funding__top">
          <header className="home-funding__header">
            <p className="home-funding__eyebrow">
              <span className="home-funding__eyebrow-dot" aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="home-funding-title" className="home-funding__title">
              {title}{' '}
              {titleAccent && <span className="home-funding__title-accent">{titleAccent}</span>}
            </h2>
            <p className="home-funding__subtitle">{subtitle}</p>
            <Link href={ctaLink} className="home-funding__cta">
              {ctaLabel}
              <ArrowRight className="home-funding__cta-icon" aria-hidden="true" />
            </Link>
          </header>

          <div className="home-funding__cards">
            {rounds.map((round) => (
              <FundingRoundCard key={round.id} round={round} />
            ))}
          </div>
        </div>

        <FundingStatsBar stats={stats} />
      </div>
    </section>
  )
}
