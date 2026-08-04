import type { CollectionSlug, Payload, PayloadRequest, File } from 'payload'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import type { Media } from '@/payload-types'

import { contactForm as contactFormData } from './contact-form'
import { newsletterForm as newsletterFormData } from './newsletter-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { createSeedPost } from './home-posts'

function placeholderMedia(alt: string) {
  return { alt }
}

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'funding-rounds',
  'forms',
  'form-submissions',
  'search',
]

const categorySeed = [
  {
    title: 'Top Story',
    description: 'The biggest tech stories shaping the industry right now.',
    accentColor: '#1A1A1A',
  },
  {
    title: 'AI',
    description: 'Artificial intelligence news and breakthroughs.',
    accentColor: '#7C3AED',
  },
  {
    title: 'Startups',
    description: 'Fresh ideas, funding and startup journeys.',
    accentColor: '#0D9488',
  },
  {
    title: 'Funding',
    description: 'Investments, rounds and market insights.',
    accentColor: '#2563EB',
  },
  {
    title: 'Big Tech',
    description: "Updates from the world's leading tech giants.",
    accentColor: '#EA580C',
  },
  {
    title: 'SaaS',
    description: 'Software, platforms and cloud innovation.',
    accentColor: '#8B5CF6',
  },
  {
    title: 'FinTech',
    description: 'Finance, payments and digital banking.',
    accentColor: '#059669',
  },
  {
    title: 'Cybersecurity',
    description: 'Threats, protection and digital safety.',
    accentColor: '#DC2626',
  },
  {
    title: 'Climate Tech',
    description: 'Sustainable solutions for a better future.',
    accentColor: '#16A34A',
  },
  {
    title: 'Apple',
    description: 'Products, updates and ecosystem news.',
    accentColor: '#171717',
  },
  {
    title: 'SpaceX',
    description: 'Space exploration and SpaceX updates.',
    accentColor: '#1D4ED8',
  },
  {
    title: 'Cloud',
    description: 'Infrastructure, platforms and cloud-native tooling.',
    accentColor: '#0284C7',
  },
  {
    title: 'Gadgets',
    description: 'Hardware launches, wearables and consumer tech.',
    accentColor: '#DB2777',
  },
  {
    title: 'Crypto',
    description: 'Digital assets, protocols and on-chain markets.',
    accentColor: '#D97706',
  },
  {
    title: 'Trending',
    description: 'The stories everyone is talking about right now.',
    accentColor: '#7C3AED',
  },
] as const

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

// Next.js revalidation errors are normal when seeding the database without a server running
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  payload.logger.info(`— Clearing collections and globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [],
        sidebarGroups: [],
      },
      depth: 0,
      context: {
        disableRevalidate: true,
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        copyright: '© 2026 dossier.',
        quickLinks: [],
        popularPages: [],
        contact: {},
        newsletter: {},
        socialLinks: [],
      },
      depth: 0,
      context: {
        disableRevalidate: true,
      },
    }),
    payload.updateGlobal({
      slug: 'funding-news',
      data: {
        eyebrow: 'FUNDING NEWS',
        title: 'Latest funding rounds',
        titleAccent: 'in tech',
        subtitle: 'Track the capital fueling the next generation of companies and ideas.',
        ctaLabel: 'View all funding news',
        ctaLink: '/categories/funding',
        stats: {
          totalFundingThisWeek: '$8.47B',
          roundsCount: '24',
          topSector: 'AI',
          biggestRound: '$6B',
        },
      },
      depth: 0,
      context: {
        disableRevalidate: true,
      },
    }),
  ])

  // Delete sequentially to avoid Postgres deadlocks with concurrent app traffic
  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
  }

  for (const collection of collections) {
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  // Unique Lorem Picsum placeholders — reused across posts (+ one for home page meta)
  const placeholderImageDefs = [
    { seed: 'openai-gpt5', alt: 'Abstract technology lights and circuitry' },
    { seed: 'spacex-rocket', alt: 'Rocket launch trail against a dark sky' },
    { seed: 'apple-ios', alt: 'Minimal smartphone on a desk surface' },
    { seed: 'figma-ipo', alt: 'Colorful design workspace desk setup' },
    { seed: 'anthropic-claude', alt: 'Soft gradient light through glass panels' },
    { seed: 'stripe-payouts', alt: 'City skyline reflected in glass windows' },
    { seed: 'ransomware-security', alt: 'Server racks in a dim data center' },
    { seed: 'climate-tech', alt: 'Solar panels across an open landscape' },
    { seed: 'microsoft-copilot', alt: 'Modern office with screens and ambient light' },
    { seed: 'yc-demo-day', alt: 'Startup pitch stage with audience seating' },
    { seed: 'aws-cloud', alt: 'Data center corridor with blue lights' },
    { seed: 'gadget-lab', alt: 'Consumer electronics on a white table' },
    { seed: 'crypto-charts', alt: 'Trading charts on a glowing monitor' },
    { seed: 'fintech-app', alt: 'Mobile payment interface on a phone' },
    { seed: 'saas-dashboard', alt: 'Analytics dashboard on a laptop screen' },
    { seed: 'home-meta', alt: 'Editorial tech blog hero placeholder' },
  ] as const

  const imageBuffers = await Promise.all(
    placeholderImageDefs.map(({ seed }) =>
      fetchFileByURL(`https://picsum.photos/seed/${seed}/1600/900.jpg`),
    ),
  )

  const demoAuthor = await payload.create({
    collection: 'users',
    data: {
      name: 'Arjun K.',
      email: 'demo-author@example.com',
      password: 'password',
    },
  })

  const mediaDocs = await Promise.all(
    placeholderImageDefs.map((def, index) =>
      payload.create({
        collection: 'media',
        data: placeholderMedia(def.alt),
        file: {
          ...imageBuffers[index],
          name: `${def.seed}.jpg`,
        },
      }),
    ),
  )

  const imagePool = mediaDocs.slice(0, -1)
  const imageHomeDoc = mediaDocs[mediaDocs.length - 1]
  const imageOpenAI = mediaDocs[0]

  payload.logger.info(`— Seeding categories...`)

  const categoryDocs = await Promise.all(
    categorySeed.map((category) =>
      payload.create({
        collection: 'categories',
        data: {
          title: category.title,
          slug: slugify(category.title),
          description: category.description,
          accentColor: category.accentColor,
        },
      }),
    ),
  )

  const cat = Object.fromEntries(categoryDocs.map((doc) => [doc.title, doc.id])) as Record<
    string,
    number
  >

  payload.logger.info(`— Seeding posts...`)

  type SeedPostDef = {
    title: string
    slug: string
    excerpt: string
    readingTime: number
    categories: string[]
    publishedAt: string
    featured?: boolean
    featuredOrder?: number
    breakingNews?: boolean
    editorsPick?: boolean
    editorsPickOrder?: number
    viewCount?: number
  }

  const postDefs: SeedPostDef[] = [
    // Top Story + AI / Big Tech
    {
      title: 'OpenAI launches GPT-5 with major leaps in reasoning and efficiency',
      slug: 'openai-launches-gpt-5',
      excerpt:
        'The new model sets a new benchmark in coding, multimodal understanding, and complex problem solving.',
      readingTime: 5,
      categories: ['Top Story', 'AI', 'Trending'],
      publishedAt: hoursAgo(6),
      featured: true,
      featuredOrder: 1,
      breakingNews: true,
      editorsPick: true,
      editorsPickOrder: 1,
      viewCount: 96000,
    },
    {
      title: 'Google DeepMind unveils next-gen robotics foundation model',
      slug: 'deepmind-robotics-foundation-model',
      excerpt: 'A new multimodal model aims to generalize robot skills across warehouses and homes.',
      readingTime: 4,
      categories: ['Top Story', 'AI', 'Big Tech'],
      publishedAt: hoursAgo(20),
      breakingNews: true,
    },
    {
      title: 'Meta open-sources Llama 4 weights for research and startups',
      slug: 'meta-llama-4-open-source',
      excerpt: 'The release widens access to frontier-class models for builders and labs.',
      readingTime: 4,
      categories: ['Top Story', 'AI', 'Big Tech'],
      publishedAt: hoursAgo(30),
    },
    {
      title: 'Chipmakers race to ship AI accelerators for edge devices',
      slug: 'ai-accelerators-edge-devices',
      excerpt: 'On-device inference is reshaping laptop, phone, and IoT silicon roadmaps.',
      readingTime: 5,
      categories: ['Top Story', 'AI', 'Gadgets'],
      publishedAt: hoursAgo(48),
    },
    // AI extras
    {
      title: 'Anthropic launches Claude 4 with improved long-context',
      slug: 'anthropic-launches-claude-4',
      excerpt: 'Claude 4 pushes longer context windows and stronger agentic coding workflows.',
      readingTime: 5,
      categories: ['AI', 'Trending'],
      publishedAt: hoursAgo(10),
      breakingNews: true,
      editorsPick: true,
      editorsPickOrder: 5,
      viewCount: 45000,
    },
    {
      title: 'Microsoft ships enterprise Copilot agents for SharePoint',
      slug: 'microsoft-copilot-agents-sharepoint',
      excerpt: 'Big Tech keeps pushing AI assistants deeper into workplace workflows.',
      readingTime: 3,
      categories: ['Big Tech', 'AI', 'SaaS'],
      publishedAt: hoursAgo(28),
    },
    // Startups + Funding
    {
      title: 'YC demo day highlights 12 AI infrastructure startups',
      slug: 'yc-demo-day-ai-infrastructure',
      excerpt: 'Founders pitch eval tooling, inference routing, and agent observability stacks.',
      readingTime: 5,
      categories: ['Startups', 'AI'],
      publishedAt: hoursAgo(36),
    },
    {
      title: 'Climate tech startups raise $900M across Q2 deals',
      slug: 'climate-tech-startups-raise-900m',
      excerpt: 'Battery storage and grid software lead a rebound in climate venture funding.',
      readingTime: 4,
      categories: ['Climate Tech', 'Startups', 'Funding'],
      publishedAt: hoursAgo(22),
    },
    {
      title: 'Figma files for IPO, targets $12B valuation',
      slug: 'figma-files-for-ipo',
      excerpt: 'The design platform moves toward public markets after years of private growth.',
      readingTime: 4,
      categories: ['Funding', 'SaaS', 'Trending'],
      publishedAt: hoursAgo(8),
      breakingNews: true,
      editorsPick: true,
      editorsPickOrder: 4,
      viewCount: 52000,
    },
    {
      title: 'Series B boom continues for vertical SaaS founders',
      slug: 'series-b-vertical-saas',
      excerpt: 'Investors favor niche workflow software with sticky enterprise contracts.',
      readingTime: 4,
      categories: ['Startups', 'Funding', 'SaaS'],
      publishedAt: hoursAgo(40),
    },
    {
      title: 'European seed funds back more deep-tech founders',
      slug: 'european-seed-deep-tech',
      excerpt: 'Capital is shifting toward hardware-software hybrids and scientific startups.',
      readingTime: 3,
      categories: ['Startups', 'Funding'],
      publishedAt: hoursAgo(55),
    },
    {
      title: 'Angel syndicates reshape early-stage dealmaking online',
      slug: 'angel-syndicates-online',
      excerpt: 'Platforms are compressing diligence cycles for first checks.',
      readingTime: 3,
      categories: ['Startups', 'Funding'],
      publishedAt: hoursAgo(70),
    },
    // Big Tech
    {
      title: 'Amazon expands same-day fulfillment with warehouse robots',
      slug: 'amazon-warehouse-robots',
      excerpt: 'Automation investments aim to cut delivery times in major metros.',
      readingTime: 4,
      categories: ['Big Tech'],
      publishedAt: hoursAgo(42),
    },
    {
      title: 'Netflix tests interactive ads across more markets',
      slug: 'netflix-interactive-ads',
      excerpt: 'The streaming giant iterates on ad formats without interrupting playback.',
      readingTime: 3,
      categories: ['Big Tech'],
      publishedAt: hoursAgo(60),
    },
    // SaaS
    {
      title: 'Notion ships AI workspace agents for teams',
      slug: 'notion-ai-workspace-agents',
      excerpt: 'Knowledge bases get automated summaries, tasks, and meeting follow-ups.',
      readingTime: 4,
      categories: ['SaaS', 'AI'],
      publishedAt: hoursAgo(33),
    },
    {
      title: 'Salesforce rolls out industry clouds for healthcare ops',
      slug: 'salesforce-healthcare-clouds',
      excerpt: 'Verticalized CRM packs target compliance-heavy care workflows.',
      readingTime: 4,
      categories: ['SaaS', 'Big Tech'],
      publishedAt: hoursAgo(75),
    },
    {
      title: 'Atlassian pricing shift sparks debate among startups',
      slug: 'atlassian-pricing-shift',
      excerpt: 'Usage-based seats change how growing teams budget collaboration tools.',
      readingTime: 3,
      categories: ['SaaS', 'Startups'],
      publishedAt: hoursAgo(85),
    },
    // FinTech
    {
      title: 'Stripe expands global payouts for SaaS platforms',
      slug: 'stripe-expands-global-payouts',
      excerpt: 'Marketplace builders get faster settlement options across more corridors.',
      readingTime: 3,
      categories: ['FinTech', 'SaaS'],
      publishedAt: hoursAgo(14),
    },
    {
      title: 'Neobanks push into small-business lending APIs',
      slug: 'neobanks-smb-lending-apis',
      excerpt: 'Embedded credit products are becoming a default fintech growth lever.',
      readingTime: 4,
      categories: ['FinTech'],
      publishedAt: hoursAgo(45),
    },
    {
      title: 'Real-time payments networks expand across Southeast Asia',
      slug: 'realtime-payments-sea',
      excerpt: 'Cross-border settlement times drop as QR and account-to-account rails mature.',
      readingTime: 4,
      categories: ['FinTech'],
      publishedAt: hoursAgo(66),
    },
    {
      title: 'BNPL firms tighten underwriting after consumer debt spike',
      slug: 'bnpl-underwriting-tightens',
      excerpt: 'Regulators and rising defaults force a more conservative credit stance.',
      readingTime: 3,
      categories: ['FinTech', 'Funding'],
      publishedAt: hoursAgo(90),
    },
    // Cybersecurity
    {
      title: 'Major ransomware campaign targets cloud identity providers',
      slug: 'ransomware-targets-cloud-identity',
      excerpt: 'Security teams scramble as attackers abuse federation tokens at scale.',
      readingTime: 6,
      categories: ['Cybersecurity', 'Cloud'],
      publishedAt: hoursAgo(18),
      breakingNews: true,
    },
    {
      title: 'Zero-trust adoption accelerates in mid-market enterprises',
      slug: 'zero-trust-mid-market',
      excerpt: 'Identity-first architectures replace VPN-centric network designs.',
      readingTime: 5,
      categories: ['Cybersecurity'],
      publishedAt: hoursAgo(50),
    },
    {
      title: 'Critical flaw found in popular open-source auth library',
      slug: 'opensource-auth-library-flaw',
      excerpt: 'Maintainers rush patches as scanners light up across SaaS estates.',
      readingTime: 4,
      categories: ['Cybersecurity', 'SaaS'],
      publishedAt: hoursAgo(78),
    },
    {
      title: 'Governments mandate stronger software bill-of-materials rules',
      slug: 'sbom-mandate-rules',
      excerpt: 'Vendors must disclose dependencies for critical infrastructure software.',
      readingTime: 4,
      categories: ['Cybersecurity'],
      publishedAt: hoursAgo(100),
    },
    // Climate Tech
    {
      title: 'Grid software startups win utility modernization contracts',
      slug: 'grid-software-utility-contracts',
      excerpt: 'Digital twins and demand response tools help operators balance renewables.',
      readingTime: 4,
      categories: ['Climate Tech', 'Startups'],
      publishedAt: hoursAgo(52),
    },
    {
      title: 'Solid-state battery pilots move closer to mass production',
      slug: 'solid-state-battery-pilots',
      excerpt: 'Automakers and suppliers race to commercialize denser, safer cells.',
      readingTime: 5,
      categories: ['Climate Tech'],
      publishedAt: hoursAgo(88),
    },
    {
      title: 'Carbon accounting platforms integrate with ERP suites',
      slug: 'carbon-accounting-erp',
      excerpt: 'Enterprises want emissions data next to finance and supply-chain systems.',
      readingTime: 3,
      categories: ['Climate Tech', 'SaaS'],
      publishedAt: hoursAgo(110),
    },
    {
      title: 'Green hydrogen projects secure blended public-private capital',
      slug: 'green-hydrogen-blended-capital',
      excerpt: 'Policy incentives unlock multi-gigawatt pipelines in Europe and Asia.',
      readingTime: 4,
      categories: ['Climate Tech', 'Funding'],
      publishedAt: hoursAgo(120),
    },
    // Apple
    {
      title: 'Apple previews iOS 19 with smarter Siri and UI overhaul',
      slug: 'apple-previews-ios-19',
      excerpt: 'Cupertino leans into on-device intelligence with a refreshed design language.',
      readingTime: 4,
      categories: ['Apple', 'Big Tech', 'Trending'],
      publishedAt: hoursAgo(5),
      editorsPick: true,
      editorsPickOrder: 3,
      viewCount: 64000,
    },
    {
      title: 'Vision Pro 2 rumors point to lighter design and lower price',
      slug: 'vision-pro-2-rumors',
      excerpt: 'Analysts expect a thinner headset aimed at broader consumer adoption.',
      readingTime: 3,
      categories: ['Apple', 'Gadgets'],
      publishedAt: hoursAgo(38),
    },
    {
      title: 'Apple Pay expands tap-to-transfer across more banks',
      slug: 'apple-pay-tap-to-transfer',
      excerpt: 'Peer payments deepen Apple’s push into everyday financial services.',
      readingTime: 3,
      categories: ['Apple', 'FinTech'],
      publishedAt: hoursAgo(72),
    },
    {
      title: 'MacBook lineup gains new silicon focused on local AI',
      slug: 'macbook-local-ai-silicon',
      excerpt: 'Neural engines and memory bandwidth take center stage in the refresh.',
      readingTime: 4,
      categories: ['Apple', 'AI', 'Gadgets'],
      publishedAt: hoursAgo(95),
    },
    // SpaceX
    {
      title: 'SpaceX raises $1.5B in new funding round at $200B valuation',
      slug: 'spacex-raises-1-5b',
      excerpt: 'Investors double down on Starship and Starlink as SpaceX closes another mega-round.',
      readingTime: 3,
      categories: ['SpaceX', 'Funding', 'Trending'],
      publishedAt: hoursAgo(2),
      breakingNews: true,
      editorsPick: true,
      editorsPickOrder: 2,
      viewCount: 128000,
    },
    {
      title: 'Starship completes successful orbital catch attempt',
      slug: 'starship-orbital-catch',
      excerpt: 'The booster return marks another milestone toward rapid reuse.',
      readingTime: 4,
      categories: ['SpaceX'],
      publishedAt: hoursAgo(26),
      breakingNews: true,
    },
    {
      title: 'Starlink adds maritime coverage for commercial fleets',
      slug: 'starlink-maritime-coverage',
      excerpt: 'Shipping and offshore operators gain higher-bandwidth connectivity at sea.',
      readingTime: 3,
      categories: ['SpaceX'],
      publishedAt: hoursAgo(58),
    },
    {
      title: 'NASA extends Crew Dragon missions through next decade',
      slug: 'nasa-crew-dragon-extension',
      excerpt: 'The agency locks in more flights as ISS succession plans firm up.',
      readingTime: 4,
      categories: ['SpaceX'],
      publishedAt: hoursAgo(105),
    },
    // Cloud
    {
      title: 'AWS launches new regional GPU clusters for inference',
      slug: 'aws-gpu-clusters-inference',
      excerpt: 'Cloud providers compete on capacity for production AI workloads.',
      readingTime: 4,
      categories: ['Cloud', 'AI', 'Big Tech'],
      publishedAt: hoursAgo(24),
    },
    {
      title: 'Kubernetes cost tools become table stakes for platform teams',
      slug: 'kubernetes-cost-tools',
      excerpt: 'FinOps practices move from dashboards into automated rightsizing.',
      readingTime: 4,
      categories: ['Cloud', 'SaaS'],
      publishedAt: hoursAgo(62),
    },
    {
      title: 'Multi-cloud networking startups raise fresh growth rounds',
      slug: 'multicloud-networking-funding',
      excerpt: 'Enterprises want simpler overlays across AWS, Azure, and GCP.',
      readingTime: 3,
      categories: ['Cloud', 'Funding', 'Startups'],
      publishedAt: hoursAgo(80),
    },
    {
      title: 'Serverless databases add vector search for AI apps',
      slug: 'serverless-db-vector-search',
      excerpt: 'Managed data planes absorb RAG patterns without ops heavy lifting.',
      readingTime: 4,
      categories: ['Cloud', 'AI'],
      publishedAt: hoursAgo(115),
    },
    // Gadgets
    {
      title: 'Foldable phones push thinner designs into mainstream retail',
      slug: 'foldable-phones-mainstream',
      excerpt: 'Durability improvements and lower prices widen the buyer pool.',
      readingTime: 3,
      categories: ['Gadgets'],
      publishedAt: hoursAgo(34),
    },
    {
      title: 'Smart glasses startups demo always-on translation',
      slug: 'smart-glasses-translation',
      excerpt: 'Wearables chase practical AI features beyond novelty demos.',
      readingTime: 4,
      categories: ['Gadgets', 'AI', 'Startups'],
      publishedAt: hoursAgo(68),
    },
    {
      title: 'Earbuds race adds health sensors and longer battery life',
      slug: 'earbuds-health-sensors',
      excerpt: 'Audio brands compete on wellness metrics as much as sound quality.',
      readingTime: 3,
      categories: ['Gadgets'],
      publishedAt: hoursAgo(98),
    },
    {
      title: 'Gaming handhelds get cloud streaming partnerships',
      slug: 'gaming-handhelds-cloud-streaming',
      excerpt: 'Portable consoles lean on remote render farms for AAA titles.',
      readingTime: 3,
      categories: ['Gadgets', 'Cloud'],
      publishedAt: hoursAgo(125),
    },
    // Crypto
    {
      title: 'Stablecoin settlement volume hits new monthly highs',
      slug: 'stablecoin-settlement-highs',
      excerpt: 'On-chain dollars keep gaining share in remittances and trading pairs.',
      readingTime: 4,
      categories: ['Crypto', 'FinTech'],
      publishedAt: hoursAgo(16),
    },
    {
      title: 'Ethereum L2 fees drop as new data availability layer ships',
      slug: 'ethereum-l2-fees-drop',
      excerpt: 'Cheaper rollups reignite consumer app and NFT experiments.',
      readingTime: 4,
      categories: ['Crypto'],
      publishedAt: hoursAgo(44),
    },
    {
      title: 'Regulators clarify custody rules for crypto exchanges',
      slug: 'crypto-custody-rules',
      excerpt: 'Clearer guidance reduces uncertainty for institutional desks.',
      readingTime: 5,
      categories: ['Crypto'],
      publishedAt: hoursAgo(76),
    },
    {
      title: 'Tokenized treasuries attract more traditional asset managers',
      slug: 'tokenized-treasuries-managers',
      excerpt: 'On-chain funds promise faster settlement and programmable compliance.',
      readingTime: 4,
      categories: ['Crypto', 'FinTech', 'Funding'],
      publishedAt: hoursAgo(108),
    },
  ]

  const createdPosts = []

  for (let i = 0; i < postDefs.length; i++) {
    const def = postDefs[i]
    const categoryIds = def.categories.map((name) => cat[name]).filter(Boolean)
    const doc = await payload.create({
      collection: 'posts',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: createSeedPost({
        title: def.title,
        slug: def.slug,
        excerpt: def.excerpt,
        readingTime: def.readingTime,
        categoryIds,
        heroImage: imagePool[i % imagePool.length],
        author: demoAuthor,
        publishedAt: def.publishedAt,
        featured: def.featured,
        featuredOrder: def.featuredOrder,
        breakingNews: def.breakingNews,
        editorsPick: def.editorsPick,
        editorsPickOrder: def.editorsPickOrder,
        viewCount: def.viewCount,
      }),
    })
    createdPosts.push(doc)
  }

  // Link a few related posts for archive/detail pages
  if (createdPosts.length >= 3) {
    await payload.update({
      id: createdPosts[0].id,
      collection: 'posts',
      data: {
        relatedPosts: [createdPosts[1].id, createdPosts[2].id],
      },
      context: { disableRevalidate: true },
    })
  }

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
    context: {
      disableRevalidate: true,
    },
  })

  payload.logger.info(`— Seeding newsletter form...`)

  const newsletterForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: newsletterFormData,
    context: {
      disableRevalidate: true,
    },
  })

  payload.logger.info(`— Seeding pages...`)

  await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: home({ heroImage: imageHomeDoc, metaImage: imageOpenAI }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: contactPageData({ contactForm: contactForm }),
    }),
  ])

  payload.logger.info(`— Seeding funding rounds...`)

  const logosDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../public/funding-logos')

  const readLocalLogo = (filename: string): File => {
    const filePath = path.join(logosDir, filename)
    const data = fs.readFileSync(filePath)
    return {
      name: filename,
      data,
      mimetype: 'image/png',
      size: data.byteLength,
    }
  }

  const fundingLogoFiles = [
    { key: 'xai', file: 'xai.png', alt: 'xAI logo' },
    { key: 'wayve', file: 'wayve.png', alt: 'Wayve logo' },
    { key: 'harvey', file: 'harvey.png', alt: 'Harvey logo' },
    { key: 'decagon', file: 'decagon.png', alt: 'Decagon logo' },
    { key: 'a16z', file: 'a16z.png', alt: 'a16z logo' },
    { key: 'sequoia', file: 'sequoia.png', alt: 'Sequoia logo' },
    { key: 'valor', file: 'valor.png', alt: 'Valor Equity Partners logo' },
    { key: 'softbank', file: 'softbank.png', alt: 'SoftBank logo' },
    { key: 'nvidia', file: 'nvidia.png', alt: 'NVIDIA logo' },
    { key: 'microsoft', file: 'microsoft.png', alt: 'Microsoft logo' },
    { key: 'openai', file: 'openai.png', alt: 'OpenAI logo' },
    { key: 'gv', file: 'gv.png', alt: 'GV logo' },
    { key: 'accel', file: 'accel.png', alt: 'Accel logo' },
    { key: 'index', file: 'index.png', alt: 'Index Ventures logo' },
  ] as const

  const fundingLogoDocs = Object.fromEntries(
    await Promise.all(
      fundingLogoFiles.map(async ({ key, file, alt }) => {
        const doc = await payload.create({
          collection: 'media',
          data: placeholderMedia(alt),
          file: readLocalLogo(file),
        })
        return [key, doc.id] as const
      }),
    ),
  ) as Record<(typeof fundingLogoFiles)[number]['key'], Media['id']>

  const fundingRoundsSeed = [
    {
      companyName: 'xAI',
      slug: 'xai',
      logo: fundingLogoDocs.xai,
      series: 'series-b' as const,
      amount: '$6B',
      amountValue: 6,
      sector: 'Artificial Intelligence',
      announcedAt: hoursAgo(2),
      topDeal: true,
      investors: [
        { name: 'a16z', logo: fundingLogoDocs.a16z },
        { name: 'SEQUOIA', logo: fundingLogoDocs.sequoia },
        { name: 'VALOR EQUITY PARTNERS', logo: fundingLogoDocs.valor },
      ],
    },
    {
      companyName: 'Wayve',
      slug: 'wayve',
      logo: fundingLogoDocs.wayve,
      series: 'series-c' as const,
      amount: '$1.05B',
      amountValue: 1.05,
      sector: 'Autonomous Driving',
      announcedAt: hoursAgo(5),
      topDeal: false,
      investors: [
        { name: 'SOFTBANK', logo: fundingLogoDocs.softbank },
        { name: 'NVIDIA', logo: fundingLogoDocs.nvidia },
        { name: 'MICROSOFT', logo: fundingLogoDocs.microsoft },
      ],
    },
    {
      companyName: 'Harvey',
      slug: 'harvey',
      logo: fundingLogoDocs.harvey,
      series: 'series-d' as const,
      amount: '$300M',
      amountValue: 0.3,
      sector: 'Legal Tech',
      announcedAt: hoursAgo(8),
      topDeal: false,
      investors: [
        { name: 'OPENAI', logo: fundingLogoDocs.openai },
        { name: 'GV', logo: fundingLogoDocs.gv },
        { name: 'SEQUOIA', logo: fundingLogoDocs.sequoia },
      ],
    },
    {
      companyName: 'Decagon',
      slug: 'decagon',
      logo: fundingLogoDocs.decagon,
      series: 'series-c' as const,
      amount: '$131M',
      amountValue: 0.131,
      sector: 'Customer Support AI',
      announcedAt: hoursAgo(12),
      topDeal: false,
      investors: [
        { name: 'ACCEL', logo: fundingLogoDocs.accel },
        { name: 'A16Z', logo: fundingLogoDocs.a16z },
        { name: 'INDEX', logo: fundingLogoDocs.index },
      ],
    },
  ]

  for (const round of fundingRoundsSeed) {
    await payload.create({
      collection: 'funding-rounds',
      depth: 0,
      context: { disableRevalidate: true },
      data: {
        ...round,
        generateSlug: false,
        _status: 'published',
      },
    })
  }

  payload.logger.info(`— Seeding globals...`)

  const customLink = (label: string, url = '#') => ({
    link: {
      type: 'custom' as const,
      label,
      url,
    },
  })

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: {
        navItems: [
          customLink('AI', '/categories/ai'),
          customLink('Startups', '/categories/startups'),
          customLink('Cybersecurity', '/categories/cybersecurity'),
          customLink('Latest', '/posts'),
        ],
        sidebarGroups: [
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
            links: [
              customLink('Newsletters'),
              customLink('Events'),
              customLink('Reports'),
            ],
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: {
        copyright: '© 2026 dossier.',
        quickLinks: [
          customLink('About'),
          customLink('Contact', '/contact'),
          customLink('Advertise'),
          customLink('Careers'),
        ],
        popularPages: [
          customLink('AI', '/categories/ai'),
          customLink('Startups', '/categories/startups'),
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
          form: newsletterForm.id,
        },
        socialLinks: [
          { platform: 'x', url: '#' },
          { platform: 'linkedin', url: '#' },
          { platform: 'youtube', url: '#' },
          { platform: 'github', url: '#' },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'funding-news',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: {
        eyebrow: 'FUNDING NEWS',
        title: 'Latest funding rounds',
        titleAccent: 'in tech',
        subtitle: 'Track the capital fueling the next generation of companies and ideas.',
        ctaLabel: 'View all funding news',
        ctaLink: '/categories/funding',
        stats: {
          totalFundingThisWeek: '$8.47B',
          roundsCount: '24',
          topSector: 'AI',
          biggestRound: '$6B',
        },
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
    redirect: 'follow',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()
  const contentType = res.headers.get('content-type') || 'image/jpeg'
  const extension = contentType.includes('png')
    ? 'png'
    : contentType.includes('webp')
      ? 'webp'
      : 'jpg'

  return {
    name: url.split('/').pop()?.replace(/\?.*$/, '') || `file-${Date.now()}.${extension}`,
    data: Buffer.from(data),
    mimetype: contentType.split(';')[0].trim() || `image/${extension === 'jpg' ? 'jpeg' : extension}`,
    size: data.byteLength,
  }
}
