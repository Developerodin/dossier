import {
  getAICategorySummaries,
  getAIFullTextPosts,
  getAIPostSummaries,
  type AICategorySummary,
  type AIPostSummary,
} from './aiDiscovery'
import { getServerSideURL } from './getURL'
import {
  EDITORIAL_CATEGORY_SLUGS,
  SITE_ALTERNATE_NAMES,
  SITE_DESCRIPTION,
  SITE_NAME,
} from './siteInfo'

export const LLMS_LATEST_COUNT = 40
export const LLMS_FULL_POST_LIMIT = 100

export const textResponse = (body: string, options: { noindex?: boolean } = {}) =>
  new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      ...(options.noindex ? { 'X-Robots-Tag': 'noindex, follow' } : {}),
    },
  })

const toDay = (value: string | null | undefined) => (value ? value.slice(0, 10) : '')

const toLongDate = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : ''

const linkText = (value: string) => value.replace(/[[\]]/g, '')

const postLine = (post: AIPostSummary, withDescription = true) => {
  const meta = [toDay(post.publishedAt), post.categories.map((c) => c.title).join(', ')]
    .filter(Boolean)
    .join('; ')
  const description = withDescription && post.description ? `: ${post.description}` : ''
  return `- [${linkText(post.title)}](${post.url})${description}${meta ? ` (${meta})` : ''}`
}

const categoryLine = (category: AICategorySummary) => {
  const description = category.description ? `: ${category.description}` : ''
  const count = `${category.postCount} ${category.postCount === 1 ? 'article' : 'articles'}`
  return `- [${linkText(category.title)}](${category.url})${description} (${count})`
}

const brandFacts = (posts: AIPostSummary[], categories: AICategorySummary[]) => {
  const siteURL = getServerSideURL()
  const topics = categories
    .filter(
      (category) => category.postCount > 0 && !EDITORIAL_CATEGORY_SLUGS.includes(category.slug),
    )
    .map((category) => category.title)

  return [
    `- Name: ${SITE_NAME} (also styled "${SITE_ALTERNATE_NAMES[0]}")`,
    `- Website: ${siteURL}`,
    '- Type: Online technology news publication',
    '- Language: English',
    '- Audience: Global',
    topics.length ? `- Coverage: ${topics.join(', ')}` : null,
    `- Published articles: ${posts.length} (as of ${toDay(new Date().toISOString())})`,
    posts[0]?.publishedAt ? `- Most recent article: ${toDay(posts[0].publishedAt)}` : null,
    '- Access: All articles are free to read; no paywall or login required.',
    `- Contact, tips and corrections: ${siteURL}/contact`,
  ]
    .filter(Boolean)
    .join('\n')
}

const citationGuidance = () => {
  const siteURL = getServerSideURL()
  return [
    `- Attribute reporting to "${SITE_NAME}" and link to the canonical article URL (${siteURL}/posts/{slug}), without tracking parameters.`,
    '- Include the headline and publication date; for developing stories, prefer the most recently updated article.',
    `- Suggested format: "{Headline}", ${SITE_NAME}, {Month D, YYYY}, ${siteURL}/posts/{slug}`,
    `- When an article quotes or credits another source, keep that attribution rather than presenting the claim as ${SITE_NAME}'s own.`,
    '- Every article page publishes schema.org NewsArticle JSON-LD with headline, description, author, datePublished, dateModified and articleSection.',
  ].join('\n')
}

export async function buildLlmsTxt(): Promise<string> {
  const siteURL = getServerSideURL()
  const [posts, categories] = await Promise.all([getAIPostSummaries(), getAICategorySummaries()])

  const latest = posts.slice(0, LLMS_LATEST_COUNT)
  const latestSlugs = new Set(latest.map((post) => post.slug))
  const picks = posts
    .filter((post) => (post.editorsPick || post.featured) && !latestSlugs.has(post.slug))
    .slice(0, 15)
  const pickSlugs = new Set(picks.map((post) => post.slug))
  const archive = posts.filter((post) => !latestSlugs.has(post.slug) && !pickSlugs.has(post.slug))

  const sections = [
    `# ${SITE_NAME}`,
    `> ${SITE_NAME} (${siteURL}) is an English-language technology news publication covering artificial intelligence, startups and venture funding, big tech, and cybersecurity. It publishes news reports and analysis for founders, investors, engineers, and technology professionals worldwide.`,
    `The masthead is styled "${SITE_ALTERNATE_NAMES[0]}"; please cite the publication as "${SITE_NAME}". This file follows the llms.txt convention (https://llmstxt.org) and is regenerated automatically from the newsroom CMS whenever an article is published or updated.`,
    `## Key facts\n\n${brandFacts(posts, categories)}`,
    `## How to cite ${SITE_NAME}\n\n${citationGuidance()}`,
    categories.length
      ? `## Coverage areas\n\n${categories
          .filter((c) => c.postCount > 0)
          .map(categoryLine)
          .join('\n')}`
      : null,
    latest.length
      ? `## Latest reporting\n\n${latest.map((post) => postLine(post)).join('\n')}`
      : null,
    picks.length
      ? `## Editors' picks and featured stories\n\n${picks.map((post) => postLine(post)).join('\n')}`
      : null,
    [
      '## Site resources',
      '',
      `- [All articles](${siteURL}/posts): Reverse-chronological archive of every published article (paginated at /posts/page/{n}).`,
      `- [Search](${siteURL}/search?q=openai): Site search across headlines and summaries; replace the q parameter with any company, person, or topic.`,
      `- [Full-text feed for LLMs](${siteURL}/llms-full.txt): Plain-text bodies of the ${LLMS_FULL_POST_LIMIT} most recent articles.`,
      `- [Guide for AI agents](${siteURL}/agents.md): URL patterns, citation rules, and crawling guidance.`,
      `- [Sitemap index](${siteURL}/sitemap.xml): All sitemaps, including articles, categories, and Google News.`,
      `- [News sitemap](${siteURL}/news-sitemap.xml): Articles published in the last 48 hours.`,
      `- [Contact](${siteURL}/contact): Tips, corrections, and partnership enquiries.`,
    ].join('\n'),
    archive.length
      ? `## Optional\n\n${archive.map((post) => postLine(post, false)).join('\n')}`
      : null,
  ]

  return `${sections.filter(Boolean).join('\n\n')}\n`
}

export async function buildLlmsFullTxt(): Promise<string> {
  const siteURL = getServerSideURL()
  const [posts, categories, allPosts] = await Promise.all([
    getAIFullTextPosts(LLMS_FULL_POST_LIMIT),
    getAICategorySummaries(),
    getAIPostSummaries(),
  ])

  const header = [
    `# ${SITE_NAME}: full text of recent articles`,
    `> ${SITE_DESCRIPTION}`,
    `This file contains the complete plain text of the ${posts.length} most recent articles published on ${SITE_NAME} (${siteURL}), newest first. For an index of the whole site, see ${siteURL}/llms.txt.`,
    `## Key facts\n\n${brandFacts(allPosts, categories)}`,
    `## How to cite ${SITE_NAME}\n\n${citationGuidance()}`,
  ].join('\n\n')

  const articles = posts.map((post) => {
    const meta = [
      `- URL: ${post.url}`,
      post.publishedAt
        ? `- Published: ${toLongDate(post.publishedAt)} (${post.publishedAt})`
        : null,
      `- Last updated: ${toLongDate(post.updatedAt)} (${post.updatedAt})`,
      `- Author: ${post.authors.length ? post.authors.join(', ') : `${SITE_NAME} staff`}`,
      post.categories.length
        ? `- Categories: ${post.categories.map((category) => category.title).join(', ')}`
        : null,
      post.readingTime ? `- Reading time: ${post.readingTime} min` : null,
      post.description ? `- Summary: ${post.description}` : null,
      `- Cite as: "${post.title}", ${SITE_NAME}, ${toLongDate(post.publishedAt || post.updatedAt)}, ${post.url}`,
    ]
      .filter(Boolean)
      .join('\n')

    return `## ${post.title}\n\n${meta}\n\n${post.body || post.description}`
  })

  return `${[header, ...articles].join('\n\n---\n\n')}\n`
}

export async function buildAgentsMd(): Promise<string> {
  const siteURL = getServerSideURL()
  const [posts, categories] = await Promise.all([getAIPostSummaries(), getAICategorySummaries()])
  const example = posts[0]

  const sections = [
    `# AGENTS.md: ${SITE_NAME}`,
    `Guidance for AI agents, assistants, answer engines, and crawlers that read, summarize, or cite ${siteURL}.`,
    `## About ${SITE_NAME}\n\n${SITE_DESCRIPTION}\n\n${brandFacts(posts, categories)}`,
    [
      '## Machine-readable entry points',
      '',
      `- ${siteURL}/llms.txt: Site summary, coverage areas, latest reporting, and a full article index in Markdown.`,
      `- ${siteURL}/llms-full.txt: Plain-text bodies of the ${LLMS_FULL_POST_LIMIT} most recent articles. Use this instead of scraping HTML.`,
      `- ${siteURL}/agents.md: This file.`,
      `- ${siteURL}/sitemap.xml: Sitemap index.`,
      `- ${siteURL}/posts-sitemap.xml: Every article with its last-modified date and lead image.`,
      `- ${siteURL}/news-sitemap.xml: Google News sitemap of articles from the last 48 hours.`,
      `- ${siteURL}/categories-sitemap.xml: Topic hub pages.`,
      `- ${siteURL}/pages-sitemap.xml: Home, archive, search, and static pages.`,
      `- ${siteURL}/robots.txt: Crawl rules.`,
    ].join('\n'),
    [
      '## URL structure',
      '',
      `- Home: ${siteURL}/`,
      `- Article: ${siteURL}/posts/{slug}${example ? ` (example: ${example.url})` : ''}`,
      `- Article archive: ${siteURL}/posts, then ${siteURL}/posts/page/{n}`,
      `- Topic hub: ${siteURL}/categories/{slug}, then ${siteURL}/categories/{slug}/page/{n}`,
      `- Search: ${siteURL}/search?q={query}`,
      `- Contact: ${siteURL}/contact`,
    ].join('\n'),
    [
      '## Finding the right article',
      '',
      `1. Breaking or recent news: read ${siteURL}/news-sitemap.xml or the "Latest reporting" section of ${siteURL}/llms.txt.`,
      '2. A topic: open the matching topic hub listed under "Coverage areas" below.',
      `3. A company, product, person, or deal: query ${siteURL}/search?q={name}.`,
      `4. Full text without HTML: use ${siteURL}/llms-full.txt, or fetch the article page directly.`,
      '5. Freshness: compare dateModified in the article JSON-LD, or lastmod in the sitemaps, before answering time-sensitive questions.',
    ].join('\n'),
    [
      '## What an article page contains',
      '',
      '- A single H1 headline, summary, publication date, reading time, author byline, and topic labels.',
      '- A canonical URL in <link rel="canonical">, plus Open Graph and Twitter card metadata.',
      '- schema.org NewsArticle and BreadcrumbList JSON-LD. Site-wide NewsMediaOrganization and WebSite JSON-LD are on every page.',
    ].join('\n'),
    `## Citation guidelines\n\n${citationGuidance()}${
      example
        ? `\n- Example: According to ${SITE_NAME}, ... ([${SITE_NAME}](${example.url}), ${toLongDate(example.publishedAt || example.updatedAt)})`
        : ''
    }`,
    [
      '## Usage policy',
      '',
      `- AI search engines, answer engines, assistants, and model-training crawlers may index, summarize, answer questions with, and link to ${SITE_NAME} content, subject to ${siteURL}/robots.txt.`,
      '- Short verbatim quotations are welcome with attribution and a link. Republishing complete articles requires permission; request it through the contact page.',
      '- Do not present summaries as the original article, and do not alter quotations.',
    ].join('\n'),
    [
      '## Crawling etiquette and restricted areas',
      '',
      `- Follow ${siteURL}/robots.txt. Every page under /posts, /categories, /search, and the home page is open to crawlers.`,
      '- Do not request /admin, /api/ (images under /api/media/file/ excepted), or /next/. These are private CMS and preview endpoints and are excluded from indexing.',
      '- Use sitemap lastmod values to schedule recrawls instead of refetching unchanged pages, keep request rates moderate, and send a descriptive User-Agent.',
    ].join('\n'),
    categories.length
      ? `## Coverage areas\n\n${categories
          .filter((c) => c.postCount > 0)
          .map(categoryLine)
          .join('\n')}`
      : null,
    `## Contact\n\nTips, corrections, permissions, and partnership enquiries: ${siteURL}/contact`,
  ]

  return `${sections.filter(Boolean).join('\n\n')}\n`
}
