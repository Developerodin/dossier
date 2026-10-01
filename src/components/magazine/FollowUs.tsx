import Link from 'next/link'
import React from 'react'
import { Users } from 'lucide-react'

import type { Footer } from '@/payload-types'
import {
  SocialPlatformIcon,
  socialPlatformLabel,
} from './SocialPlatformIcon'

type FollowUsProps = {
  socialLinks?: Footer['socialLinks']
}

export const FollowUs: React.FC<FollowUsProps> = ({ socialLinks }) => {
  const links = socialLinks ?? []
  if (!links.length) return null

  return (
    <aside className="mag-follow" aria-labelledby="mag-follow-title">
      <h3 id="mag-follow-title" className="mag-widget-title">
        <span className="mag-section-icon" aria-hidden="true">
          <Users size={16} strokeWidth={2} />
        </span>
        Follow us
      </h3>
      <ul className="mag-follow__grid">
        {links.map(({ platform, url, id }, index) => {
          if (!platform) return null
          const label = socialPlatformLabel(platform)
          return (
            <li key={id ?? `${platform}-${index}`}>
              <Link
                href={url || '#'}
                className="mag-follow__item"
                aria-label={label}
                title={label}
              >
                <SocialPlatformIcon platform={platform} className="mag-follow__icon" />
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
