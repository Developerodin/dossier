'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useField } from '@payloadcms/ui'

import './index.scss'

type MediaPreview = {
  id: number | string
  url?: string | null
  focalX?: number | null
  focalY?: number | null
  alt?: string | null
  updatedAt?: string | null
}

const PREVIEWS = [
  { label: '16:9 Hero', ratio: '16 / 9' },
  { label: '4:3 Card', ratio: '4 / 3' },
  { label: '1:1 Thumb', ratio: '1 / 1' },
] as const

function resolveMediaId(value: unknown): number | string | null {
  if (value == null || value === '') return null
  if (typeof value === 'number' || typeof value === 'string') return value
  if (typeof value === 'object' && value !== null && 'id' in value) {
    const id = (value as { id?: number | string | null }).id
    return id ?? null
  }
  return null
}

const HeroImageCropPreview: React.FC<{ path?: string }> = ({ path = 'heroImage' }) => {
  const { value } = useField<unknown>({ path })
  const mediaId = resolveMediaId(value)

  const [media, setMedia] = useState<MediaPreview | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMedia = useCallback(async (id: number | string, signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/media/${id}?depth=0`, {
        credentials: 'include',
        signal,
      })

      if (!response.ok) {
        throw new Error('Unable to load image preview')
      }

      const data = (await response.json()) as MediaPreview
      setMedia(data)
    } catch (err) {
      if (signal?.aborted) return
      setMedia(null)
      setError(err instanceof Error ? err.message : 'Unable to load image preview')
    } finally {
      if (!signal?.aborted) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!mediaId) return

    const controller = new AbortController()
    // Fetch media for crop previews whenever the selected hero image changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional async fetch on mediaId change
    void loadMedia(mediaId, controller.signal)
    return () => controller.abort()
  }, [loadMedia, mediaId])

  const activeMedia =
    media && mediaId != null && String(media.id) === String(mediaId) ? media : null

  const objectPosition = useMemo(() => {
    if (activeMedia?.focalX == null || activeMedia?.focalY == null) return '50% 50%'
    return `${activeMedia.focalX}% ${activeMedia.focalY}%`
  }, [activeMedia?.focalX, activeMedia?.focalY])

  if (!mediaId) return null

  return (
    <div className="hero-crop-preview">
      <div className="hero-crop-preview__header">
        <p className="hero-crop-preview__title">Crop preview</p>
        <button
          className="btn btn--size-small btn--style-secondary"
          disabled={isLoading}
          onClick={() => {
            void loadMedia(mediaId)
          }}
          type="button"
        >
          Refresh
        </button>
      </div>
      <p className="hero-crop-preview__hint">
        After changing the focal point in Edit Image, save the media, then refresh these previews.
      </p>

      {isLoading && !activeMedia ? (
        <p className="hero-crop-preview__status">Loading previews…</p>
      ) : null}
      {error ? (
        <p className="hero-crop-preview__status hero-crop-preview__status--error">{error}</p>
      ) : null}

      {activeMedia?.url ? (
        <div className="hero-crop-preview__grid">
          {PREVIEWS.map((preview) => (
            <figure key={preview.label} className="hero-crop-preview__item">
              <div className="hero-crop-preview__frame" style={{ aspectRatio: preview.ratio }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- admin crop preview */}
                <img
                  alt={activeMedia.alt || 'Hero image crop preview'}
                  className="hero-crop-preview__image"
                  src={`${activeMedia.url}${activeMedia.updatedAt ? `?${encodeURIComponent(activeMedia.updatedAt)}` : ''}`}
                  style={{ objectPosition }}
                />
              </div>
              <figcaption className="hero-crop-preview__label">{preview.label}</figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default HeroImageCropPreview
