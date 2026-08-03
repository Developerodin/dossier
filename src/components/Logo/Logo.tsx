import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="TechBlog"
      width={193}
      height={28}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('site-logo', className)}
      src="https://raw.githubusercontent.com/payloadcms/payload/3.x/packages/ui/src/assets/payload-logo-light.svg"
    />
  )
}
