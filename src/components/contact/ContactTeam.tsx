import React from 'react'
import { Globe } from 'lucide-react'

const AVATARS = [
  { label: 'A', position: 'tl', color: 'var(--brand)' },
  { label: 'B', position: 'tr', color: 'oklch(62% 0.14 300deg)' },
  { label: 'C', position: 'bl', color: 'oklch(55% 0.18 250deg)' },
] as const

export const ContactTeam: React.FC = () => {
  return (
    <div className="contact-team">
      <div className="contact-team__graphic" aria-hidden="true">
        <div className="contact-team__globe">
          <span className="contact-team__orbit contact-team__orbit--1" />
          <span className="contact-team__orbit contact-team__orbit--2" />
          <span className="contact-team__orbit contact-team__orbit--3" />
          <span className="contact-team__dot contact-team__dot--1" />
          <span className="contact-team__dot contact-team__dot--2" />
          <span className="contact-team__dot contact-team__dot--3" />
          <span className="contact-team__dot contact-team__dot--4" />
        </div>

        {AVATARS.map((avatar) => (
          <span
            key={avatar.position}
            className={`contact-team__avatar contact-team__avatar--${avatar.position}`}
            style={{ background: avatar.color }}
          >
            {avatar.label}
          </span>
        ))}
      </div>

      <div className="contact-team__card">
        <span className="contact-team__card-icon" aria-hidden="true">
          <Globe size={18} strokeWidth={1.75} />
        </span>
        <div>
          <p className="contact-team__card-title">We&apos;re a global team</p>
          <p className="contact-team__card-text">
            Working across time zones to bring you the latest tech insights.
          </p>
        </div>
      </div>
    </div>
  )
}
