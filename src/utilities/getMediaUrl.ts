/**
 * Processes media resource URL to ensure proper formatting.
 *
 * Absolute URLs (Vercel Blob, CDN, etc.) are returned unchanged aside from an
 * optional cache-busting query. Relative Payload `/api/media/file/...` paths are
 * rewritten to the Blob CDN when NEXT_PUBLIC_BLOB_BASE_URL is set.
 *
 * Optional Picsum fallback is OFF by default and only runs when
 * NEXT_PUBLIC_MEDIA_PICSUM_FALLBACK=true — never auto-enable via process.env.VERCEL
 * (that var is stripped from client bundles and would also rewrite Blob URLs).
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  const isAbsolute = /^https?:\/\//i.test(url)
  let resolved = url

  if (!isAbsolute) {
    const blobBase = (process.env.NEXT_PUBLIC_BLOB_BASE_URL || '').replace(/\/$/, '')
    const fileMatch = url.match(/\/api\/media\/file\/([^?#]+)/i)
    if (blobBase && fileMatch) {
      resolved = `${blobBase}/${fileMatch[1]}`
    } else if (process.env.NEXT_PUBLIC_MEDIA_PICSUM_FALLBACK === 'true') {
      const picsumMatch = url.match(/\/(?:api\/media\/file\/)?([^/?#]+)\.(jpe?g|png|webp|gif)/i)
      if (picsumMatch) {
        const seed = picsumMatch[1].replace(/-\d+x\d+$/i, '')
        if (seed) {
          return `https://picsum.photos/seed/${encodeURIComponent(seed)}/1600/900.jpg`
        }
      }
    }
  }

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  return cacheTag ? `${resolved}?${cacheTag}` : resolved
}
