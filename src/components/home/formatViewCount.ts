/** Formats a raw view count for display (e.g. 128000 → "128K"). */
export function formatViewCount(count: number): string {
  if (!Number.isFinite(count) || count < 0) return '0'

  if (count < 1000) return String(Math.round(count))

  if (count < 1_000_000) {
    const thousands = count / 1000
    const rounded = thousands >= 10 ? Math.round(thousands) : Math.round(thousands * 10) / 10
    return `${rounded}K`
  }

  const millions = count / 1_000_000
  const rounded = millions >= 10 ? Math.round(millions) : Math.round(millions * 10) / 10
  return `${rounded}M`
}
