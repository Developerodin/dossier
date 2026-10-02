import Link from 'next/link'
import React from 'react'
import { Eye, Share2 } from 'lucide-react'

import type { HomePostCard } from './types'
import { CategoryBadge } from './CategoryBadge'
import { getCategoryIcon } from './categoryIcons'
import { Media } from '@/components/Media'
import { formatCount } from '@/utilities/formatCount'
import { formatRelativeTime } from '@/utilities/formatRelativeTime'

type CategoryNewsBlockProps = {
  title: string
  slug: string
  posts: HomePostCard[]
}

function PostMeta({ post }: { post: HomePostCard }) {
  const primaryCategory =
    post.categories?.find((cat) => typeof cat === 'object' && cat !== null) ?? null
  const categoryTitle = primaryCategory?.title ?? null
  const categoryHref = primaryCategory?.slug ? `/categories/${primaryCategory.slug}` : null
  const relativeTime = post.publishedAt ? formatRelativeTime(post.publishedAt) : null
  const shares = typeof post.shareCount === 'number' ? post.shareCount : 0
  const views = typeof post.viewCount === 'number' ? post.viewCount : 0

  return (
    <div className="mag-category-block__meta-wrap">
      {categoryTitle && <CategoryBadge label={categoryTitle} href={categoryHref} variant="pill" />}
      <p className="mag-category-block__meta">
        {relativeTime && <span>{relativeTime}</span>}
        {relativeTime && (
          <span className="mag-category-block__meta-dot" aria-hidden="true">
            •
          </span>
        )}
        <span className="mag-category-block__stat">
          <Share2 className="mag-category-block__stat-icon" aria-hidden="true" />
          {formatCount(shares)} shares
        </span>
        <span className="mag-category-block__meta-dot" aria-hidden="true">
          •
        </span>
        <span className="mag-category-block__stat">
          <Eye className="mag-category-block__stat-icon" aria-hidden="true" />
          {formatCount(views)} views
        </span>
      </p>
    </div>
  )
}

export const CategoryNewsBlock: React.FC<CategoryNewsBlockProps> = ({ title, slug, posts }) => {
  if (!posts.length) return null

  const [lead, ...rest] = posts
  const CategoryIcon = getCategoryIcon(slug)

  return (
    <section className="mag-category-block" aria-labelledby={`mag-cat-${slug}`}>
      <header className="mag-category-block__header">
        <h2 id={`mag-cat-${slug}`} className="mag-category-block__title">
          <span className="mag-section-icon" aria-hidden="true">
            <CategoryIcon size={18} strokeWidth={2} />
          </span>
          {title}
        </h2>
        <Link href={`/categories/${slug}`} className="mag-category-block__link">
          View all
        </Link>
      </header>

      <div className="mag-category-block__grid">
        <article className="mag-category-block__lead">
          <Link href={`/posts/${lead.slug}`} className="mag-category-block__lead-media">
            {lead.heroImage && typeof lead.heroImage === 'object' ? (
              <Media
                resource={lead.heroImage}
                fill
                imgClassName="mag-category-block__img"
                size="(max-width: 768px) 100vw, 40vw"
              />
            ) : (
              <span className="mag-category-block__placeholder" />
            )}
          </Link>
          <PostMeta post={lead} />
          <h3 className="mag-category-block__lead-title">
            <Link href={`/posts/${lead.slug}`}>{lead.title}</Link>
          </h3>
        </article>

        <ul className="mag-category-block__list">
          {rest.map((post) => (
            <li key={post.id}>
              <article className="mag-category-block__item">
                <Link href={`/posts/${post.slug}`} className="mag-category-block__item-media">
                  {post.heroImage && typeof post.heroImage === 'object' ? (
                    <Media
                      resource={post.heroImage}
                      fill
                      imgClassName="mag-category-block__item-img"
                      payloadSize="small"
                      size="128px"
                    />
                  ) : (
                    <span className="mag-category-block__placeholder" />
                  )}
                </Link>
                <div className="mag-category-block__item-body">
                  <PostMeta post={post} />
                  <h4 className="mag-category-block__item-title">
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </h4>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
