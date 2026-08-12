'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type ScrollCarouselProps = {
  children: React.ReactNode
  className?: string
  ariaLabel?: string
}

export const ScrollCarousel: React.FC<ScrollCarouselProps> = ({
  children,
  className = '',
  ariaLabel = 'Carousel',
}) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < max - 4)
  }, [])

  useEffect(() => {
    update()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update])

  const scroll = (dir: -1 | 1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  return (
    <div className={`mag-carousel ${className}`.trim()}>
      <div ref={trackRef} className="mag-carousel__track" role="region" aria-label={ariaLabel}>
        {children}
      </div>
      <div className="mag-carousel__nav">
        <button
          type="button"
          className="mag-carousel__nav-btn"
          aria-label="Previous slide"
          disabled={!canPrev}
          onClick={() => scroll(-1)}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          className="mag-carousel__nav-btn"
          aria-label="Next slide"
          disabled={!canNext}
          onClick={() => scroll(1)}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

type CarouselSlideProps = {
  children: React.ReactNode
  className?: string
}

export const CarouselSlide: React.FC<CarouselSlideProps> = ({ children, className = '' }) => (
  <div className={`mag-carousel__slide ${className}`.trim()}>{children}</div>
)

type GalleryListItemProps = {
  href: string
  title: string
  category?: string
  date?: string
  image?: React.ReactNode
  index?: number
}

export const GalleryListItem: React.FC<GalleryListItemProps> = ({
  href,
  title,
  category,
  date,
  image,
  index,
}) => (
  <article className="mag-gallery-item">
    {typeof index === 'number' && <span className="mag-gallery-item__index">{index + 1}</span>}
    <Link href={href} className="mag-gallery-item__thumb">
      {image}
    </Link>
    <div className="mag-gallery-item__body">
      {category && <span className="mag-gallery-item__cat">{category}</span>}
      {date && <time className="mag-gallery-item__date">{date}</time>}
      <h4 className="mag-gallery-item__title">
        <Link href={href}>{title}</Link>
      </h4>
    </div>
  </article>
)
