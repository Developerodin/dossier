import React from 'react'
import { Bookmark, Zap } from 'lucide-react'

import { Media } from '@/components/Media'
import type { FundingRound, Media as MediaType } from '@/payload-types'

import { formatRelativeTime, formatSeriesLabel } from './fundingUtils'
import { FundingSparkline } from './FundingSparkline'

type FundingRoundCardProps = {
  round: FundingRound
}

function companyInitials(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9]/g, '')
  if (cleaned.length <= 2) return cleaned.toUpperCase()

  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return parts
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  return cleaned.slice(0, 2).toUpperCase()
}

export const FundingRoundCard: React.FC<FundingRoundCardProps> = ({ round }) => {
  const isTopDeal = Boolean(round.topDeal)
  const logo = typeof round.logo === 'object' && round.logo !== null ? (round.logo as MediaType) : null
  const relative = formatRelativeTime(round.announcedAt)
  const seriesLabel = formatSeriesLabel(round.series)

  return (
    <article
      className={`home-funding-card${isTopDeal ? ' home-funding-card--featured' : ''}`}
    >
      {isTopDeal && (
        <div className="home-funding-card__badge">
          <Zap className="home-funding-card__badge-icon" aria-hidden="true" fill="currentColor" />
          TOP DEAL
        </div>
      )}

      <button
        type="button"
        className="home-funding-card__bookmark"
        aria-label="Bookmark (coming soon)"
        tabIndex={-1}
      >
        <Bookmark className="home-funding-card__bookmark-icon" aria-hidden="true" />
      </button>

      {isTopDeal && (
        <div className="home-funding-card__sparkline" aria-hidden="true">
          <FundingSparkline className="home-funding-card__sparkline-svg" variant="card" />
        </div>
      )}

      <div className="home-funding-card__company">
        <div className="home-funding-card__logo">
          {logo ? (
            <Media resource={logo} imgClassName="home-funding-card__logo-img" />
          ) : (
            <span className="home-funding-card__logo-fallback" aria-hidden="true">
              {companyInitials(round.companyName)}
            </span>
          )}
        </div>
        <div className="home-funding-card__identity">
          <h3 className="home-funding-card__name">{round.companyName}</h3>
          <p
            className={`home-funding-card__series${
              isTopDeal ? ' home-funding-card__series--green' : ''
            }`}
          >
            {seriesLabel}
          </p>
        </div>
      </div>

      <p className="home-funding-card__amount">{round.amount}</p>

      {round.investors && round.investors.length > 0 && (
        <div className="home-funding-card__investors">
          <p className="home-funding-card__investors-label">Investors</p>
          <ul className="home-funding-card__investors-list">
            {round.investors.map((investor, index) => {
              const investorLogo =
                typeof investor.logo === 'object' && investor.logo !== null
                  ? (investor.logo as MediaType)
                  : null

              return (
                <li key={investor.id ?? `${investor.name}-${index}`} className="home-funding-card__investor">
                  {investorLogo ? (
                    <Media
                      resource={investorLogo}
                      imgClassName="home-funding-card__investor-img"
                      htmlElement={null}
                    />
                  ) : (
                    <span className="home-funding-card__investor-name">{investor.name}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <footer className="home-funding-card__meta">
        {relative && <span>{relative}</span>}
        {relative && round.sector && <span aria-hidden="true"> • </span>}
        {round.sector && <span>{round.sector}</span>}
      </footer>
    </article>
  )
}
