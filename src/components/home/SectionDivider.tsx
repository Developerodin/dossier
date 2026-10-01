'use client'

import React, { useEffect, useRef, useState } from 'react'

type SectionDividerProps = {
  className?: string
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ className }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || animated) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setAnimated(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [animated])

  return (
    <div
      ref={ref}
      className={['mag-section-divider', animated ? 'is-animated' : '', className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    >
      <span className="mag-section-divider__bar mag-section-divider__bar--1" />
      <span className="mag-section-divider__bar mag-section-divider__bar--2" />
      <span className="mag-section-divider__bar mag-section-divider__bar--3" />
    </div>
  )
}
