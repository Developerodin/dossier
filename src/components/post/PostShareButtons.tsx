'use client'

import { Share2 } from 'lucide-react'
import React, { useState } from 'react'

type PostShareButtonsProps = {
  postId: number | string
  title: string
  url: string
}

export const PostShareButtons: React.FC<PostShareButtonsProps> = ({ postId, title, url }) => {
  const [message, setMessage] = useState<string | null>(null)

  const incrementShare = () => {
    void fetch(`/api/posts/${postId}/share`, { method: 'POST', keepalive: true }).catch(() => undefined)
  }

  const handleShare = async () => {
    incrementShare()

    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // fall through to copy
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setMessage('Link copied')
      window.setTimeout(() => setMessage(null), 2000)
    } catch {
      setMessage('Unable to share')
    }
  }

  return (
    <div className="mag-post-share">
      <button type="button" className="mag-post-share__btn" onClick={handleShare}>
        <Share2 size={16} aria-hidden="true" />
        Share
      </button>
      {message && <span className="mag-post-share__msg">{message}</span>}
    </div>
  )
}
