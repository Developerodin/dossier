import Link from 'next/link'
import React from 'react'

import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

type AdBannerProps = {
  image?: MediaType | number | null
  url?: string | null
  className?: string
  label?: string
}

export const AdBanner: React.FC<AdBannerProps> = ({
  image,
  url,
  className = '',
  label = 'Advertisement',
}) => {
  if (!image || typeof image === 'number') return null

  const content = (
    <div className={`mag-ad ${className}`.trim()}>
      <span className="mag-ad__label">{label}</span>
      <Media resource={image} imgClassName="mag-ad__image" />
    </div>
  )

  if (url) {
    return (
      <Link href={url} className="mag-ad__link" target="_blank" rel="noopener noreferrer">
        {content}
      </Link>
    )
  }

  return content
}
