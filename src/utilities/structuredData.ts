import type { Category, Post } from '@/payload-types'

import { getImageURL } from './generateMeta'
import { getServerSideURL } from './getURL'
import {
  EDITORIAL_CATEGORY_SLUGS,
  SITE_ALTERNATE_NAMES,
  SITE_DESCRIPTION,
  SITE_LANGUAGE,
  SITE_LOGO_PATH,
  SITE_NAME,
} from './siteInfo'

type Schema = Record<string, unknown>

const organizationId = () => `${getServerSideURL()}/#organization`
const websiteId = () => `${getServerSideURL()}/#website`

export const organizationSchema = (): Schema => {
  const siteURL = getServerSideURL()

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    '@id': organizationId(),
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    url: `${siteURL}/`,
    description: SITE_DESCRIPTION,
    logo: {
      '@type': 'ImageObject',
      url: `${siteURL}${SITE_LOGO_PATH}`,
      width: 948,
      height: 235,
    },
    knowsAbout: [
      'Artificial intelligence',
      'Startups',
      'Venture capital',
      'Big Tech',
      'Cybersecurity',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial',
      url: `${siteURL}/contact`,
      availableLanguage: 'English',
    },
  }
}

export const websiteSchema = (): Schema => {
  const siteURL = getServerSideURL()

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId(),
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    url: `${siteURL}/`,
    description: SITE_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
    publisher: { '@id': organizationId() },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteURL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export const breadcrumbSchema = (items: { name: string; path: string }[]): Schema => {
  const siteURL = getServerSideURL()

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteURL}${item.path}`,
    })),
  }
}

export const newsArticleSchema = (post: Post): Schema => {
  const siteURL = getServerSideURL()
  const url = `${siteURL}/posts/${post.slug}`
  const allCategories = (post.categories || []).filter(
    (item): item is Category => typeof item === 'object' && item !== null,
  )
  const topicCategories = allCategories.filter(
    (category) => !EDITORIAL_CATEGORY_SLUGS.includes(category.slug as string),
  )
  const categories = topicCategories.length ? topicCategories : allCategories
  const authors = (post.populatedAuthors || [])
    .map((author) => author.name)
    .filter((name): name is string => Boolean(name))
  const image = getImageURL(post.heroImage || post.meta?.image)
  const description = (post.meta?.description || post.excerpt || '').trim()

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    headline: post.title.slice(0, 110),
    ...(description ? { description } : {}),
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: [image],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: authors.length
      ? authors.map((name) => ({ '@type': 'Person', name }))
      : [{ '@type': 'Organization', name: SITE_NAME, url: `${siteURL}/` }],
    publisher: { '@id': organizationId() },
    isPartOf: { '@id': websiteId() },
    ...(categories.length
      ? {
          articleSection: categories.map((category) => category.title),
          keywords: categories.map((category) => category.title).join(', '),
        }
      : {}),
    ...(post.readingTime ? { timeRequired: `PT${post.readingTime}M` } : {}),
    inLanguage: SITE_LANGUAGE,
    isAccessibleForFree: true,
  }
}

export const collectionPageSchema = (category: {
  title: string
  slug?: string | null
  description?: string | null
}): Schema => {
  const siteURL = getServerSideURL()
  const url = `${siteURL}/categories/${category.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    name: `${category.title} news`,
    url,
    ...(category.description ? { description: category.description } : {}),
    isPartOf: { '@id': websiteId() },
    about: { '@type': 'Thing', name: category.title },
    inLanguage: SITE_LANGUAGE,
  }
}
