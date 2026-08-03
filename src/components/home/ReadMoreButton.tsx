import Link from 'next/link'
import React from 'react'
import { ArrowUpRight } from 'lucide-react'

type ReadMoreButtonProps = {
  href: string
  label?: string
  className?: string
}

export const ReadMoreButton: React.FC<ReadMoreButtonProps> = ({
  href,
  label = 'Read Full Story',
  className,
}) => {
  return (
    <Link
      href={href}
      className={['home-read-more', className].filter(Boolean).join(' ')}
    >
      <span>{label}</span>
      <ArrowUpRight className="home-read-more__icon" aria-hidden="true" />
    </Link>
  )
}
