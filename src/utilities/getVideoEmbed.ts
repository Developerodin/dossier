export type VideoProvider = 'youtube' | 'vimeo'

export type VideoEmbedInfo = {
  provider: VideoProvider
  id: string
  /** Privacy-friendly embed URL (no autoplay). */
  embedUrl: string
  /** Embed URL that starts playback when loaded. */
  autoplayUrl: string
  watchUrl: string
}

function firstMatch(input: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = input.match(pattern)
    const id = match?.[1]
    if (id) return id
  }
  return null
}

function youtubeEmbed(id: string): VideoEmbedInfo {
  const base = `https://www.youtube-nocookie.com/embed/${id}`
  const params = 'rel=0&modestbranding=1&playsinline=1'
  return {
    provider: 'youtube',
    id,
    embedUrl: `${base}?${params}`,
    autoplayUrl: `${base}?${params}&autoplay=1`,
    watchUrl: `https://www.youtube.com/watch?v=${id}`,
  }
}

function vimeoEmbed(id: string): VideoEmbedInfo {
  const base = `https://player.vimeo.com/video/${id}`
  return {
    provider: 'vimeo',
    id,
    embedUrl: `${base}?dnt=1`,
    autoplayUrl: `${base}?dnt=1&autoplay=1`,
    watchUrl: `https://vimeo.com/${id}`,
  }
}

/**
 * Parse a YouTube or Vimeo URL into embed metadata.
 * Returns null for unsupported / invalid URLs.
 */
export function getVideoEmbed(url: string | null | undefined): VideoEmbedInfo | null {
  if (!url?.trim()) return null

  let parsed: URL
  try {
    parsed = new URL(url.trim())
  } catch {
    return null
  }

  const host = parsed.hostname.replace(/^www\./, '').toLowerCase()
  const path = parsed.pathname

  if (host === 'youtu.be') {
    const id = path.split('/').filter(Boolean)[0]?.split('?')[0]
    return id ? youtubeEmbed(id) : null
  }

  if (
    host === 'youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'music.youtube.com' ||
    host === 'youtube-nocookie.com'
  ) {
    const fromQuery = parsed.searchParams.get('v')
    if (fromQuery) return youtubeEmbed(fromQuery)

    const id = firstMatch(path, [
      /^\/embed\/([^/?#]+)/,
      /^\/shorts\/([^/?#]+)/,
      /^\/live\/([^/?#]+)/,
      /^\/v\/([^/?#]+)/,
    ])
    return id ? youtubeEmbed(id) : null
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = firstMatch(path, [/^\/(?:video\/)?(\d+)/])
    return id ? vimeoEmbed(id) : null
  }

  return null
}
