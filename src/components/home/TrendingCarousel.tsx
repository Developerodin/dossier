'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { TrendingCard } from './TrendingCard'
import type { HomePostCard } from './types'

const MOBILE_PAGE_SIZE = 3

type TrendingCarouselProps = {
  posts: HomePostCard[]
}

function chunkPosts(posts: HomePostCard[], size: number): HomePostCard[][] {
  const pages: HomePostCard[][] = []
  for (let i = 0; i < posts.length; i += size) {
    pages.push(posts.slice(i, i + size))
  }
  return pages
}

export const TrendingCarousel: React.FC<TrendingCarouselProps> = ({ posts }) => {
  const desktopTrackRef = useRef<HTMLDivElement>(null)
  const mobileTrackRef = useRef<HTMLDivElement>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [mobilePage, setMobilePage] = useState(0)

  const mobilePages = chunkPosts(posts, MOBILE_PAGE_SIZE)
  const showMobileCarousel = posts.length > MOBILE_PAGE_SIZE

  const updateDesktopScrollState = useCallback(() => {
    const el = desktopTrackRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setCanScrollPrev(el.scrollLeft > 4)
    setCanScrollNext(el.scrollLeft < maxScroll - 4)
  }, [])

  useEffect(() => {
    const el = desktopTrackRef.current
    if (!el) return
    updateDesktopScrollState()
    el.addEventListener('scroll', updateDesktopScrollState, { passive: true })
    const ro = new ResizeObserver(updateDesktopScrollState)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateDesktopScrollState)
      ro.disconnect()
    }
  }, [posts, updateDesktopScrollState])

  const scrollDesktop = (direction: 1 | -1) => {
    const el = desktopTrackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('.home-trending-card')
    const amount = card ? card.offsetWidth + 16 : el.clientWidth * 0.7
    el.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  const goMobilePage = (index: number) => {
    const el = mobileTrackRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(index, mobilePages.length - 1))
    setMobilePage(clamped)
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' })
  }

  const onMobileScroll = () => {
    const el = mobileTrackRef.current
    if (!el) return
    const page = Math.round(el.scrollLeft / Math.max(el.clientWidth, 1))
    setMobilePage(page)
  }

  return (
    <>
      {/* Desktop / tablet horizontal carousel */}
      <div className="home-trending__desktop-carousel">
        <div ref={desktopTrackRef} className="home-trending__desktop-track">
          {posts.map((post, index) => (
            <TrendingCard key={post.id} post={post} rank={index + 1} variant="desktop" />
          ))}
        </div>
        {posts.length > 1 && (
          <div className="home-trending__desktop-nav">
            <button
              type="button"
              className="home-trending__nav-btn"
              aria-label="Previous trending stories"
              disabled={!canScrollPrev}
              onClick={() => scrollDesktop(-1)}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="home-trending__nav-btn"
              aria-label="Next trending stories"
              disabled={!canScrollNext}
              onClick={() => scrollDesktop(1)}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile: 3 cards per page */}
      <div className="home-trending__mobile-carousel">
        <div
          ref={mobileTrackRef}
          className="home-trending__mobile-track"
          onScroll={onMobileScroll}
        >
          {mobilePages.map((pagePosts, pageIndex) => (
            <div
              key={pageIndex}
              className="home-trending__mobile-page"
              aria-hidden={pageIndex !== mobilePage}
            >
              {pagePosts.map((post, cardIndex) => (
                <TrendingCard
                  key={post.id}
                  post={post}
                  rank={pageIndex * MOBILE_PAGE_SIZE + cardIndex + 1}
                  variant="mobile"
                />
              ))}
            </div>
          ))}
        </div>
        {showMobileCarousel && (
          <div className="home-trending__mobile-nav">
            <button
              type="button"
              className="home-trending__nav-btn home-trending__nav-btn--sm"
              aria-label="Previous page"
              disabled={mobilePage <= 0}
              onClick={() => goMobilePage(mobilePage - 1)}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <div className="home-trending__dots" role="tablist" aria-label="Trending pages">
              {mobilePages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === mobilePage}
                  aria-label={`Page ${i + 1}`}
                  className={[
                    'home-trending__dot',
                    i === mobilePage ? 'home-trending__dot--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => goMobilePage(i)}
                />
              ))}
            </div>
            <button
              type="button"
              className="home-trending__nav-btn home-trending__nav-btn--sm"
              aria-label="Next page"
              disabled={mobilePage >= mobilePages.length - 1}
              onClick={() => goMobilePage(mobilePage + 1)}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </>
  )
}
