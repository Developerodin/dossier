'use client'

import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Play, X } from 'lucide-react'

import { getVideoEmbed } from '@/utilities/getVideoEmbed'

type VideoEmbedPlayerProps = {
  url: string | null | undefined
  title: string
  className?: string
  mediaClassName?: string
  /** Poster / thumbnail shown before play. */
  poster?: React.ReactNode
  /** Auto-start embed when this becomes true (e.g. selected from list). */
  autoPlay?: boolean
  onPlay?: () => void
}

export const VideoEmbedPlayer: React.FC<VideoEmbedPlayerProps> = ({
  url,
  title,
  className,
  mediaClassName = 'mag-video-embed',
  poster,
  autoPlay = false,
  onPlay,
}) => {
  const embed = getVideoEmbed(url)
  const [playing, setPlaying] = useState(false)
  const titleId = useId()

  useEffect(() => {
    setPlaying(false)
  }, [url])

  useEffect(() => {
    if (autoPlay && embed) {
      setPlaying(true)
      onPlay?.()
    }
  }, [autoPlay, embed, onPlay, url])

  const start = useCallback(() => {
    if (!embed) return
    setPlaying(true)
    onPlay?.()
  }, [embed, onPlay])

  if (!embed) {
    return (
      <div className={[mediaClassName, className].filter(Boolean).join(' ')}>
        {poster ?? <span className={`${mediaClassName}__placeholder`} />}
      </div>
    )
  }

  return (
    <div className={[mediaClassName, className].filter(Boolean).join(' ')}>
      {playing ? (
        <iframe
          className={`${mediaClassName}__iframe`}
          src={embed.autoplayUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          className={`${mediaClassName}__trigger`}
          onClick={start}
          aria-labelledby={titleId}
        >
          <span id={titleId} className="sr-only">
            Play video: {title}
          </span>
          {poster ?? <span className={`${mediaClassName}__placeholder`} />}
          <span className={`${mediaClassName}__play`} aria-hidden="true">
            <Play size={28} fill="currentColor" />
          </span>
        </button>
      )}
    </div>
  )
}

type VideoLightboxProps = {
  url: string
  title: string
  open: boolean
  onClose: () => void
}

export const VideoLightbox: React.FC<VideoLightboxProps> = ({ url, title, open, onClose }) => {
  const embed = getVideoEmbed(url)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && embed) {
      if (!dialog.open) dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [open, embed])

  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!embed) return null

  return (
    <dialog
      ref={dialogRef}
      className="mag-video-lightbox"
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
    >
      <div className="mag-video-lightbox__panel">
        <button
          type="button"
          className="mag-video-lightbox__close"
          onClick={onClose}
          aria-label="Close video"
        >
          <X size={20} />
        </button>
        <div className="mag-video-lightbox__frame">
          {open && (
            <iframe
              className="mag-video-lightbox__iframe"
              src={embed.autoplayUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
        </div>
      </div>
    </dialog>
  )
}
