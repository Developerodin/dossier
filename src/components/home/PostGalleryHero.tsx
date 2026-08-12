'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Play } from 'lucide-react'

import type { BreakingNewsItem, HomePostCard } from '@/components/home/types'
import { PostTabsSidebar } from '@/components/magazine/PostTabsSidebar'
import { Media } from '@/components/Media'
import { VideoLightbox } from '@/components/VideoEmbed'
import { getVideoEmbed } from '@/utilities/getVideoEmbed'

type PostGalleryHeroProps = {
  posts: HomePostCard[]
  trending: HomePostCard[]
  breaking: BreakingNewsItem[]
  latest: HomePostCard[]
}

function getCategory(post: HomePostCard) {
  const cat = post.categories?.[0]
  if (!cat || typeof cat === 'number') return null
  return cat
}

export const PostGalleryHero: React.FC<PostGalleryHeroProps> = ({
  posts,
  trending,
  breaking,
  latest,
}) => {
  const slides = posts.length > 0 ? posts : trending.slice(0, 5)
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState<{ url: string; title: string } | null>(null)

  const goTo = useCallback(
    (index: number) => {
      if (!slides.length) return
      setActive((index + slides.length) % slides.length)
    },
    [slides.length],
  )

  useEffect(() => {
    if (slides.length <= 1 || lightbox) return
    const timer = window.setInterval(() => goTo(active + 1), 7000)
    return () => window.clearInterval(timer)
  }, [active, goTo, lightbox, slides.length])

  if (!slides.length) return null

  return (
    <section className="mag-hero" aria-label="Featured stories">
      <div className="mag-hero__inner">
        <div className="mag-hero__main">
          <div className="mag-hero__slider">
            {slides.map((post, index) => {
              const slideHref = `/posts/${post.slug}`
              const cat = getCategory(post)
              const embed = getVideoEmbed(post.videoUrl)
              return (
                <article
                  key={post.id}
                  className={`mag-hero__slide${index === active ? ' mag-hero__slide--active' : ''}`}
                  aria-hidden={index !== active}
                >
                  <div className="mag-hero__media">
                    {post.heroImage && typeof post.heroImage === 'object' ? (
                      <Media resource={post.heroImage} fill imgClassName="mag-hero__image" />
                    ) : (
                      <span className="mag-hero__placeholder" />
                    )}
                    {embed && post.videoUrl ? (
                      <button
                        type="button"
                        className="mag-hero__play"
                        aria-label={`Play video: ${post.title}`}
                        onClick={() =>
                          setLightbox({ url: post.videoUrl as string, title: post.title })
                        }
                      >
                        <Play size={20} fill="currentColor" />
                      </button>
                    ) : (
                      <Link
                        href={slideHref}
                        className="mag-hero__media-link"
                        aria-label={post.title}
                      >
                        <span className="sr-only">{post.title}</span>
                      </Link>
                    )}
                  </div>
                  <div className="mag-hero__content">
                    {(cat || post.publishedAt) && (
                      <div className="mag-hero__meta">
                        {cat && (
                          <Link href={`/categories/${cat.slug}`} className="mag-hero__meta-cat">
                            {cat.title}
                          </Link>
                        )}
                        {post.publishedAt && (
                          <time className="mag-hero__meta-date" dateTime={post.publishedAt}>
                            {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                          </time>
                        )}
                      </div>
                    )}
                    <h2 className="mag-hero__title">
                      <Link href={slideHref}>{post.title}</Link>
                    </h2>
                    {post.excerpt && <p className="mag-hero__excerpt">{post.excerpt}</p>}
                  </div>
                </article>
              )
            })}
          </div>

          <div className="mag-hero__thumbs" aria-label="Featured story thumbnails">
            {slides.map((post, index) => (
              <button
                key={post.id}
                type="button"
                className={`mag-hero__thumb${index === active ? ' mag-hero__thumb--active' : ''}`}
                aria-label={`Show ${post.title}`}
                aria-current={index === active}
                onClick={() => setActive(index)}
              >
                {post.heroImage && typeof post.heroImage === 'object' ? (
                  <Media resource={post.heroImage} imgClassName="mag-hero__thumb-img" />
                ) : (
                  <span className="mag-hero__thumb-fallback" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mag-hero__sidebar">
          <PostTabsSidebar trending={trending} breaking={breaking} latest={latest} />
        </div>
      </div>

      {lightbox && (
        <VideoLightbox
          url={lightbox.url}
          title={lightbox.title}
          open
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  )
}
