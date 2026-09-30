const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://example.com')

const PRIVATE_PATHS = ['/admin', '/api/', '/next/']
const PUBLIC_EXCEPTIONS = ['/api/media/file/']

// Named explicitly so AI search, answer, and training crawlers see a direct allow rule.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'GoogleOther',
  'Googlebot',
  'Googlebot-News',
  'Googlebot-Image',
  'Bingbot',
  'Applebot',
  'Applebot-Extended',
  'meta-externalagent',
  'meta-externalfetcher',
  'FacebookBot',
  'Amazonbot',
  'CCBot',
  'Bytespider',
  'DuckAssistBot',
  'MistralAI-User',
  'cohere-ai',
  'cohere-training-data-crawler',
  'YouBot',
  'Diffbot',
  'AI2Bot',
]

const SITEMAPS = [
  `${SITE_URL}/sitemap.xml`,
  `${SITE_URL}/pages-sitemap.xml`,
  `${SITE_URL}/posts-sitemap.xml`,
  `${SITE_URL}/categories-sitemap.xml`,
  `${SITE_URL}/news-sitemap.xml`,
]

const rules = [
  'Allow: /',
  ...PUBLIC_EXCEPTIONS.map((path) => `Allow: ${path}`),
  ...PRIVATE_PATHS.map((path) => `Disallow: ${path}`),
]

const robotsTxt = [
  '# TechDossier robots.txt',
  '# Technology news on AI, startups, funding, big tech, and cybersecurity.',
  '#',
  `# LLM-friendly site summary: ${SITE_URL}/llms.txt`,
  `# Full article text for LLMs: ${SITE_URL}/llms-full.txt`,
  `# Guide for AI agents: ${SITE_URL}/agents.md`,
  '',
  '# All crawlers',
  'User-agent: *',
  ...rules,
  'Content-Signal: search=yes, ai-input=yes, ai-train=yes',
  '',
  '# AI search, answer, and training crawlers are welcome',
  ...AI_CRAWLERS.map((agent) => `User-agent: ${agent}`),
  ...rules,
  '',
  '# Sitemaps',
  ...SITEMAPS.map((url) => `Sitemap: ${url}`),
  '',
].join('\n')

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: [
    '/posts-sitemap.xml',
    '/pages-sitemap.xml',
    '/categories-sitemap.xml',
    '/news-sitemap.xml',
    '/*',
    '/posts/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
    ],
    additionalSitemaps: SITEMAPS.slice(1),
    transformRobotsTxt: async () => robotsTxt,
  },
}
