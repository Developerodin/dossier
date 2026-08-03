import React from 'react'
import { format } from 'date-fns'

import { formatAuthors } from '@/utilities/formatAuthors'
import type { Post } from '@/payload-types'

type AuthorMetaProps = {
  authors?: Post['populatedAuthors']
  publishedAt?: string | null
  readingTime?: number | null
  dateFormat?: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return `${parts[0].slice(0, 1)}${parts[parts.length - 1].slice(0, 1)}`.toUpperCase()
}

export const AuthorMeta: React.FC<AuthorMetaProps> = ({
  authors,
  publishedAt,
  readingTime,
  dateFormat = 'MMM d, yyyy',
}) => {
  const hasAuthors =
    authors && authors.length > 0 && formatAuthors(authors.filter(Boolean)) !== ''
  const primaryName = hasAuthors ? formatAuthors(authors!.filter(Boolean)) : null
  const initials = primaryName ? getInitials(primaryName.split(' and ')[0] || primaryName) : null

  if (!hasAuthors && !publishedAt && !readingTime) return null

  return (
    <div className="home-author-meta">
      {initials && (
        <span className="home-author-meta__avatar" aria-hidden="true">
          {initials}
        </span>
      )}
      <div className="home-author-meta__text">
        {primaryName && <span className="home-author-meta__name">{primaryName}</span>}
        {publishedAt && (
          <>
            {primaryName && <span className="home-author-meta__dot" aria-hidden="true" />}
            <time dateTime={publishedAt}>{format(new Date(publishedAt), dateFormat)}</time>
          </>
        )}
        {typeof readingTime === 'number' && readingTime > 0 && (
          <>
            {(primaryName || publishedAt) && (
              <span className="home-author-meta__dot" aria-hidden="true" />
            )}
            <span>{readingTime} min read</span>
          </>
        )}
      </div>
    </div>
  )
}
