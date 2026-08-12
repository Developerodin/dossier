'use client'

import { useEffect, useRef } from 'react'

type PostViewTrackerProps = {
  postId: number | string
}

export function PostViewTracker({ postId }: PostViewTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true

    void fetch(`/api/posts/${postId}/view`, {
      method: 'POST',
      keepalive: true,
    }).catch(() => undefined)
  }, [postId])

  return null
}
