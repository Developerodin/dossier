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

export const defaultSidebarGroups = [
  {
    label: 'Topics',
    links: [
      customLink('Artificial Intelligence', '/categories/ai'),
      customLink('Cloud', '/categories/cloud'),
      customLink('Gadgets', '/categories/gadgets'),
    ],
  },
  {
    label: 'Startups',
    links: [
      customLink('Funding', '/categories/funding'),
      customLink('Founders'),
      customLink('Exits'),
    ],
  },
  {
    label: 'Cybersecurity',
    links: [
      customLink('Breaches', '/categories/cybersecurity'),
      customLink('Privacy'),
      customLink('Policy'),
    ],
  },
  {
    label: 'Company',
    links: [customLink('About'), customLink('Careers'), customLink('Advertise')],
  },
  {
    label: 'Resources',
    links: [customLink('Newsletters'), customLink('Events'), customLink('Reports')],
  },
]

export function resolveHeaderData(data: Header | null | undefined): Header {
  const navItems = data?.navItems?.length ? data.navItems : defaultHeaderNav
  const sidebarGroups = data?.sidebarGroups?.length ? data.sidebarGroups : defaultSidebarGroups

  return {
    id: data?.id ?? 0,
    navItems,
    sidebarGroups,
    updatedAt: data?.updatedAt,
    createdAt: data?.createdAt,
  }
}
