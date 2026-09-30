import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'
import type { BreakingNewsItem, HomePostCard } from '@/components/home/types'
import { FollowUs } from '@/components/magazine/FollowUs'
import { AdBanner } from '@/components/magazine/AdBanner'
import { PostTabsSidebar } from '@/components/magazine/PostTabsSidebar'
import { SidebarNewsletter } from '@/components/magazine/SidebarNewsletter'
import { MostShareList } from '@/components/home/MostShareList'
import { PostShareButtons } from './PostShareButtons'
import { PostViewTracker } from './PostViewTracker'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import { formatCount } from '@/utilities/formatCount'
import { formatDateTime } from '@/utilities/formatDateTime'

import './post.css'

type PostArticleProps = {
  post: Post
  trending: HomePostCard[]
  breaking: BreakingNewsItem[]
  latest: HomePostCard[]
  mostShared: HomePostCard[]
  prevPost?: { title: string; slug: string } | null
  nextPost?: { title: string; slug: string } | null
  relatedPosts?: Post[]
  newsletterFormId?: string | number | null
  socialLinks?: Parameters<typeof FollowUs>[0]['socialLinks']
  sidebarAd?: {
    image?: Post['heroImage']
    url?: string | null
  }
  shareUrl: string
}

export const PostArticle: React.FC<PostArticleProps> = ({
  post,
  trending,
  breaking,
  latest,
  mostShared,
  prevPost,
  nextPost,
  relatedPosts = [],
  newsletterFormId,
  socialLinks,
  sidebarAd,
  shareUrl,
}) => {
  const primaryCategory = post.categories?.find((cat) => typeof cat === 'object' && cat !== null)
  const authorName =
    post.populatedAuthors && post.populatedAuthors.length > 0
      ? formatAuthors(post.populatedAuthors)
      : null

  return (
    <article className="mag-post">
      <PostViewTracker postId={post.id} />

      <div className="mag-post__inner">
        <div className="mag-post__main">
          <nav className="mag-post__breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            {primaryCategory && typeof primaryCategory === 'object' && (
              <>
                <span aria-hidden="true">/</span>
                <Link href={`/categories/${primaryCategory.slug}`}>{primaryCategory.title}</Link>
              </>
            )}
          </nav>

          <header className="mag-post__header">
            <h1 className="mag-post__title">{post.title}</h1>
            <div className="mag-post__byline">
              {authorName && <p className="mag-post__author">{authorName}</p>}
              <div className="mag-post__meta">
                {post.viewCount != null && <span>{formatCount(post.viewCount)} views</span>}
                {post.readingTime && <span>{post.readingTime} min read</span>}
                {post.publishedAt && (
                  <time dateTime={post.publishedAt}>
                    Updated {formatDateTime(post.publishedAt)}
                  </time>
                )}
              </div>
              <PostShareButtons postId={post.id} title={post.title} url={shareUrl} />
            </div>
          </header>

          {post.heroImage && typeof post.heroImage === 'object' && (
            <figure className="mag-post__hero">
              <Media resource={post.heroImage} imgClassName="mag-post__hero-img" />
            </figure>
          )}

          <div className="mag-post__content">
            <RichText data={post.content} enableGutter={false} />
          </div>

          {post.categories && post.categories.length > 0 && (
            <div className="mag-post__tags">
              <span className="mag-post__tags-label">Tags</span>
              <ul>
                {post.categories.map((cat) => {
                  if (!cat || typeof cat === 'number') return null
                  return (
                    <li key={cat.id}>
                      <Link href={`/categories/${cat.slug}`}>{cat.title}</Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {authorName && (
            <aside className="mag-post__author-box">
              <h2>{authorName}</h2>
              <p>Contributing writer at dossier</p>
            </aside>
          )}

          {(prevPost || nextPost) && (
            <nav className="mag-post__adjacent" aria-label="Adjacent posts">
              {prevPost ? (
                <Link
                  href={`/posts/${prevPost.slug}`}
                  rel="prev"
                  className="mag-post__adjacent-item mag-post__adjacent-item--prev"
                >
                  <span className="mag-post__adjacent-icon" aria-hidden="true">
                    <ArrowLeft />
                  </span>
                  <span className="mag-post__adjacent-body">
                    <span className="mag-post__adjacent-label">Previous news</span>
                    <strong className="mag-post__adjacent-title">{prevPost.title}</strong>
                  </span>
                </Link>
              ) : (
                <span className="mag-post__adjacent-placeholder" aria-hidden="true" />
              )}
              {nextPost ? (
                <Link
                  href={`/posts/${nextPost.slug}`}
                  rel="next"
                  className="mag-post__adjacent-item mag-post__adjacent-item--next"
                >
                  <span className="mag-post__adjacent-body">
                    <span className="mag-post__adjacent-label">Next news</span>
                    <strong className="mag-post__adjacent-title">{nextPost.title}</strong>
                  </span>
                  <span className="mag-post__adjacent-icon" aria-hidden="true">
                    <ArrowRight />
                  </span>
                </Link>
              ) : null}
            </nav>
          )}

          {relatedPosts.length > 0 && (
            <section className="mag-post__related" aria-labelledby="mag-post-related-title">
              <h2 id="mag-post-related-title" className="mag-widget-title">
                Our latest news
              </h2>
              <ul className="mag-post__related-list">
                {relatedPosts.map((related) => (
                  <li key={related.id}>
                    <Link href={`/posts/${related.slug}`}>{related.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="mag-post__sidebar">
          <PostTabsSidebar trending={trending} breaking={breaking} latest={latest} />
          <FollowUs socialLinks={socialLinks} />
          <MostShareList posts={mostShared} />
          <SidebarNewsletter formId={newsletterFormId} compact />
          <AdBanner image={sidebarAd?.image} url={sidebarAd?.url} />
        </aside>
      </div>
    </article>
  )
}
