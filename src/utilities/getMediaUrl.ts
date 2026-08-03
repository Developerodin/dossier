/**
 * Processes media resource URL to ensure proper formatting.
 *
 * On Vercel, seeded media files are not on the local filesystem (Payload's
 * `/api/media/file/...` paths 404). Until Vercel Blob is configured and media
 * is re-uploaded, map those filenames back to the Picsum seeds used by seed.
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  const onVercel = Boolean(process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL)
  const picsumFallback =
    process.env.NEXT_PUBLIC_MEDIA_PICSUM_FALLBACK === 'true' || onVercel

  if (picsumFallback) {
    const fileMatch = url.match(/\/(?:api\/media\/file\/)?([^/?#]+)\.(jpe?g|png|webp|gif)/i)
    if (fileMatch) {
      const seed = fileMatch[1].replace(/-\d+x\d+$/i, '')
      if (seed) {
        return `https://picsum.photos/seed/${encodeURIComponent(seed)}/1600/900.jpg`
      }
    }
  }

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  return cacheTag ? `${url}?${cacheTag}` : url
}
