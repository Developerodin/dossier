/**
 * Processes media resource URL to ensure proper formatting.
 * Absolute CDN/Blob URLs pass through unchanged (plus optional cache tag).
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  return cacheTag ? `${url}?${cacheTag}` : url
}
