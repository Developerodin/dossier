import type { Header } from '@/payload-types'

const customLink = (label: string, url = '#') => ({
  link: {
    type: 'custom' as const,
    label,
    url,
  },
})

export const defaultHeaderNav = [
  customLink('AI', '/categories/ai'),
  customLink('Startups', '/categories/startups'),
  customLink('Cybersecurity', '/categories/cybersecurity'),
  customLink('Latest', '/posts'),
]

export function resolveHeaderData(data: Header | null | undefined): Header {
  const navItems = data?.navItems?.length ? data.navItems : defaultHeaderNav

  return {
    id: data?.id ?? 0,
    navItems,
    sidebarGroups: data?.sidebarGroups ?? [],
    headerAd: data?.headerAd,
    sidebarAd: data?.sidebarAd,
    updatedAt: data?.updatedAt,
    createdAt: data?.createdAt,
  }
}
