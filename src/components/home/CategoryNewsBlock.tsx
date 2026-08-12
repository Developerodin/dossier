import Link from 'next/link'
import React from 'react'

import type { HomePostCard } from './types'
import { Media } from '@/components/Media'

type CategoryNewsBlockProps = {
  title: string
  slug: string
  posts: HomePostCard[]
}

export const CategoryNewsBlock: React.FC<CategoryNewsBlockProps> = ({ title, slug, posts }) => {
  if (!posts.length) return null

  const [lead, ...rest] = posts

  return (
    <section className="mag-category-block" aria-labelledby={`mag-cat-${slug}`}>
      <header className="mag-category-block__header">
        <h2 id={`mag-cat-${slug}`} className="mag-category-block__title">
          {title}
        </h2>
        <Link href={`/categories/${slug}`} className="mag-category-block__link">
          All see
        </Link>
      </header>

      <div className="mag-category-block__grid">
        <article className="mag-category-block__lead">
          <Link href={`/posts/${lead.slug}`} className="mag-category-block__lead-media">
            {lead.heroImage && typeof lead.heroImage === 'object' ? (
              <Media resource={lead.heroImage} imgClassName="mag-category-block__img" />
            ) : (
              <span className="mag-category-block__placeholder" />
            )}
          </Link>
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
                    <Media resource={post.heroImage} imgClassName="mag-category-block__item-img" />
                  ) : (
                    <span className="mag-category-block__placeholder" />
                  )}
                </Link>
                <h4 className="mag-category-block__item-title">
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h4>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
