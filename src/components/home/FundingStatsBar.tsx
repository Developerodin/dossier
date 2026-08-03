import React from 'react'
import { ArrowUp } from 'lucide-react'

import type { FundingNew } from '@/payload-types'

import { FundingSparkline } from './FundingSparkline'

type FundingStatsBarProps = {
  stats: NonNullable<FundingNew['stats']>
}

export const FundingStatsBar: React.FC<FundingStatsBarProps> = ({ stats }) => {
  const items = [
    {
      key: 'total',
      label: 'Total funding this week',
      value: stats.totalFundingThisWeek ?? '—',
      emphasize: true,
    },
    {
      key: 'rounds',
      label: 'Rounds',
      value: stats.roundsCount ?? '—',
    },
    {
      key: 'sector',
      label: 'Top sector',
      value: stats.topSector ?? '—',
    },
    {
      key: 'biggest',
      label: 'Biggest round',
      value: stats.biggestRound ?? '—',
    },
  ]

  return (
    <div className="home-funding-stats">
      <div className="home-funding-stats__icon" aria-hidden="true">
        <ArrowUp className="home-funding-stats__icon-svg" />
      </div>

      <dl className="home-funding-stats__grid">
        {items.map((item) => (
          <div key={item.key} className="home-funding-stats__item">
            <dt className="home-funding-stats__label">{item.label}</dt>
            <dd
              className={`home-funding-stats__value${
                item.emphasize ? ' home-funding-stats__value--green' : ''
              }`}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="home-funding-stats__sparkline" aria-hidden="true">
        <FundingSparkline className="home-funding-stats__sparkline-svg" variant="stats" />
      </div>
    </div>
  )
}
