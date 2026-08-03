import { formatDistanceToNowStrict } from 'date-fns'

export function formatRelativeTime(date: string | Date): string {
  try {
    const distance = formatDistanceToNowStrict(new Date(date), { addSuffix: false })
    // Compact: "2 hours" → "2h", "5 minutes" → "5m", "1 day" → "1d"
    return distance
      .replace(/^(\d+)\s+seconds?$/, '$1s')
      .replace(/^(\d+)\s+minutes?$/, '$1m')
      .replace(/^(\d+)\s+hours?$/, '$1h')
      .replace(/^(\d+)\s+days?$/, '$1d')
      .replace(/^(\d+)\s+weeks?$/, '$1w')
      .replace(/^(\d+)\s+months?$/, '$1mo')
      .replace(/^(\d+)\s+years?$/, '$1y')
      .concat(' ago')
  } catch {
    return ''
  }
}

const SERIES_LABELS: Record<string, string> = {
  'pre-seed': 'Pre-Seed',
  seed: 'Seed',
  'series-a': 'Series A',
  'series-b': 'Series B',
  'series-c': 'Series C',
  'series-d': 'Series D',
  'series-e': 'Series E',
  'series-f': 'Series F',
  growth: 'Growth',
  ipo: 'IPO',
}

export function formatSeriesLabel(series: string): string {
  return SERIES_LABELS[series] ?? series
}
