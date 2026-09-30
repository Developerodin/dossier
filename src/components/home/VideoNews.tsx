'use client'

import Link from 'next/link'
import React, { useMemo, useState } from 'react'

import type { HomePostCard } from './types'
import { GalleryListItem } from '@/components/magazine/ScrollCarousel'
import { Media } from '@/components/Media'
import { VideoEmbedPlayer } from '@/components/VideoEmbed'
import { getVideoEmbed } from '@/utilities/getVideoEmbed'
import { CategoryBadge } from './CategoryBadge'

type VideoNewsProps = {
  posts: HomePostCard[]
  popular: HomePostCard[]
}

function getCategoryLabel(post: HomePostCard) {
  const category = post.categories?.[0]
  if (!category || typeof category === 'number') return null
  return { title: category.title, slug: category.slug }
}

export const VideoNews: React.FC<VideoNewsProps> = ({ posts, popular }) => {
  const playable = useMemo(
    () => posts.filter((post) => Boolean(getVideoEmbed(post.videoUrl))),
    [posts],
  )

  const [activeId, setActiveId] = useState<number | string | null>(playable[0]?.id ?? null)
  const [autoPlay, setAutoPlay] = useState(false)

  const lead = playable.find((post) => post.id === activeId) ?? playable[0]
  if (!lead) return null

  const cat = getCategoryLabel(lead)
  const moreVideos = playable.filter((post) => post.id !== lead.id).slice(0, 5)
  const useVideoSidebar = moreVideos.length > 0
  const sidebarPosts = useVideoSidebar ? moreVideos : popular.slice(0, 5)
  const sidebarTitle = useVideoSidebar ? 'More videos' : 'Popular'

  return (
    <section className="mag-video-news" aria-labelledby="mag-video-news-title">
      <div className="mag-video-news__inner">
        <header className="mag-section-header mag-section-header--dark">
          <h2 id="mag-video-news-title" className="mag-section-header__title">
            Video News
          </h2>
        </header>
        <div className="mag-video-news__layout">
          <article className="mag-video-news__lead">
            <VideoEmbedPlayer
              key={lead.id}
              url={lead.videoUrl}
              title={lead.title}
              mediaClassName="mag-video-embed"
              className="mag-video-news__player"
              autoPlay={autoPlay}
              poster={
                lead.heroImage && typeof lead.heroImage === 'object' ? (
                  <Media resource={lead.heroImage} fill imgClassName="mag-video-embed__img" />
                ) : (
                  <span className="mag-video-embed__placeholder" />
                )
              }
            />
            <div className="mag-video-news__body">
              {cat && (
                <CategoryBadge label={cat.title} href={`/categories/${cat.slug}`} variant="pill" />
              )}
              <h3 className="mag-video-news__title">
                <Link href={`/posts/${lead.slug}`}>{lead.title}</Link>
              </h3>
              {lead.excerpt && <p className="mag-video-news__excerpt">{lead.excerpt}</p>}
            </div>
          </article>

          <aside className="mag-video-news__sidebar">
            <h3 className="mag-widget-title">{sidebarTitle}</h3>
            <ol className="mag-video-news__list">
              {sidebarPosts.map((post, index) => {
                const label = getCategoryLabel(post)?.title
                const image =
                  post.heroImage && typeof post.heroImage === 'object' ? (
                    <Media
                      resource={post.heroImage}
                      fill
                      imgClassName="mag-gallery-item__img"
                      size="4rem"
                    />
                  ) : (
                    <span className="mag-gallery-item__placeholder" />
                  )

                if (useVideoSidebar) {
                  return (
                    <li key={post.id}>
                      <button
                        type="button"
                        className={`mag-video-news__pick${post.id === lead.id ? ' mag-video-news__pick--active' : ''}`}
                        onClick={() => {
                          setActiveId(post.id)
                          setAutoPlay(true)
                        }}
                        aria-label={`Play ${post.title}`}
                        aria-current={post.id === lead.id ? 'true' : undefined}
                      >
                        <article className="mag-gallery-item">
                          <span className="mag-gallery-item__index">{index + 1}</span>
                          <span className="mag-gallery-item__thumb">{image}</span>
                          <div className="mag-gallery-item__body">
                            {label && <span className="mag-gallery-item__cat">{label}</span>}
                            <h4 className="mag-gallery-item__title">{post.title}</h4>
                          </div>
                        </article>
                      </button>
                    </li>
                  )
                }

                return (
                  <li key={post.id}>
                    <GalleryListItem
                      href={`/posts/${post.slug}`}
                      title={post.title}
                      category={label}
                      index={index}
                      image={image}
                    />
                  </li>
                )
              })}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  )
}
