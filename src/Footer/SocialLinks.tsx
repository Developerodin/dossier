'use client'

import { Facebook, Github, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'
import React from 'react'

import type { Footer } from '@/payload-types'

type SocialLink = NonNullable<Footer['socialLinks']>[number]

const icons: Record<NonNullable<SocialLink['platform']>, React.ReactNode> = {
  x: <Twitter size={16} />,
  linkedin: <Linkedin size={16} />,
  youtube: <Youtube size={16} />,
  github: <Github size={16} />,
  facebook: <Facebook size={16} />,
  instagram: <Instagram size={16} />,
}

const labels: Record<NonNullable<SocialLink['platform']>, string> = {
  x: 'X',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  github: 'GitHub',
  facebook: 'Facebook',
  instagram: 'Instagram',
}

export const SocialLinks: React.FC<{ links: SocialLink[] }> = ({ links }) => {
  if (!links.length) return null

  return (
    <ul className="site-footer__socials">
      {links.map((item, index) => {
        if (!item.platform) return null
        return (
          <li key={`${item.platform}-${index}`}>
            <a
              href={item.url || '#'}
              className="site-footer__social-link"
              aria-label={labels[item.platform]}
            >
              {icons[item.platform]}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
