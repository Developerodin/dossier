import { formatDistanceToNow } from 'date-fns'

export function formatRelativeTime(isoDate: string): string {
  return formatDistanceToNow(new Date(isoDate), { addSuffix: true })
}
