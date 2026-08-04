import type { Footer } from '@/payload-types'

const customLink = (label: string, url = '#') => ({
  link: {
    type: 'custom' as const,
    label,
    url,
  },
})

export const defaultFooterData: Omit<Footer, 'id' | 'updatedAt' | 'createdAt'> = {
  copyright: '© 2026 dossier.',
  quickLinks: [
    customLink('About'),
    customLink('Contact', '/contact'),
    customLink('Advertise'),
    customLink('Careers'),
  ],
  popularPages: [
    customLink('AI'),
    customLink('Startups'),
    customLink('Cybersecurity', '/categories/cybersecurity'),
    customLink('Latest', '/posts'),
  ],
  contact: {
    heading: 'Contact us',
    email: 'hello@dossier.example',
    phone: '',
    url: '/contact',
  },
  newsletter: {
    heading: 'Newsletter',
    placeholder: 'Your email',
    buttonLabel: 'Subscribe',
  },
  socialLinks: [
    { platform: 'x', url: '#' },
    { platform: 'linkedin', url: '#' },
    { platform: 'youtube', url: '#' },
    { platform: 'github', url: '#' },
  ],
}

export function resolveFooterData(data: Footer | null | undefined): Footer {
  const resolveContactUrl = (url?: string | null) =>
    url && url !== '#' ? url : defaultFooterData.contact?.url

  const normalizeLinks = <T extends { link?: { label?: string | null; url?: string | null; type?: string | null } }>(
    links: T[] | null | undefined,
    fallback: T[],
  ): T[] => {
    const source = links?.length ? links : fallback
    return source.map((item) => {
      const label = item.link?.label?.toLowerCase()
      if (label === 'contact' && (!item.link?.url || item.link.url === '#')) {
        return {
          ...item,
          link: {
            ...item.link,
            type: 'custom' as const,
            url: '/contact',
          },
        }
      }
      return item
    })
  }

  return {
    id: data?.id ?? 0,
    copyright: data?.copyright || defaultFooterData.copyright,
    quickLinks: normalizeLinks(data?.quickLinks, defaultFooterData.quickLinks || []),
    popularPages: data?.popularPages?.length ? data.popularPages : defaultFooterData.popularPages,
    contact: {
      heading: data?.contact?.heading || defaultFooterData.contact?.heading,
      email: data?.contact?.email || defaultFooterData.contact?.email,
      phone: data?.contact?.phone || defaultFooterData.contact?.phone,
      url: resolveContactUrl(data?.contact?.url),
    },
    newsletter: {
      heading: data?.newsletter?.heading || defaultFooterData.newsletter?.heading,
      placeholder: data?.newsletter?.placeholder || defaultFooterData.newsletter?.placeholder,
      buttonLabel: data?.newsletter?.buttonLabel || defaultFooterData.newsletter?.buttonLabel,
      form: data?.newsletter?.form ?? defaultFooterData.newsletter?.form ?? null,
    },
    socialLinks: data?.socialLinks?.length ? data.socialLinks : defaultFooterData.socialLinks,
    updatedAt: data?.updatedAt,
    createdAt: data?.createdAt,
  }
}
