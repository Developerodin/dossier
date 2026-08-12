import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  variant?: 'black' | 'white'
}

export const Logo = (props: Props) => {
  const { className, loading = 'lazy', priority = 'auto', variant = 'black' } = props
  const src = variant === 'white' ? '/dossier-logo-white.png' : '/dossier-logo-black.png'

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      aria-hidden="true"
      className={clsx('site-logo', className)}
      decoding="async"
      fetchPriority={priority}
      height={235}
      loading={loading}
      src={src}
      width={948}
    />
  )
}
