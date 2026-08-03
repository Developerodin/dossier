import Link from 'next/link'
import React from 'react'

type CategoryBadgeProps = {
  label: string
  href?: string | null
  variant?: 'pill' | 'text'
  className?: string
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  label,
  href,
  variant = 'text',
  className,
}) => {
  const classes = [
    'home-category',
    variant === 'pill' ? 'home-category--pill' : 'home-category--text',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (href) {
    return (
      <Link href={href} className={classes}>
        {label}
      </Link>
    )
  }

  return <span className={classes}>{label}</span>
}
