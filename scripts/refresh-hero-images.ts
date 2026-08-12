/**
 * Replace solid-color / placeholder post heroes with bundled Unsplash photos.
 * Creates fresh Media docs and reassigns every post's heroImage + meta.image.
 *
 * Usage: pnpm exec tsx scripts/refresh-hero-images.ts
 */
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dirname, '..')
dotenv.config({ path: path.resolve(root, '.env.local') })
dotenv.config({ path: path.resolve(root, '.env') })

const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')

const heroImageDefs = [
  { seed: 'openai-gpt5', alt: 'Abstract AI neural network visualization' },
  { seed: 'spacex-rocket', alt: 'Earth from orbit with atmosphere glow' },
  { seed: 'apple-ios', alt: 'Smartphone held in hand outdoors' },
  { seed: 'figma-ipo', alt: 'Designer working on a colorful interface' },
  { seed: 'anthropic-claude', alt: 'Robot hand reaching toward light' },
  { seed: 'stripe-payouts', alt: 'Glass skyscrapers in a financial district' },
  { seed: 'ransomware-security', alt: 'Server racks in a dim data center' },
  { seed: 'climate-tech', alt: 'Solar panels across an open landscape' },
  { seed: 'microsoft-copilot', alt: 'Modern open office with ambient light' },
  { seed: 'yc-demo-day', alt: 'Conference audience under stage lights' },
  { seed: 'aws-cloud', alt: 'Earth from space with glowing networks' },
  { seed: 'gadget-lab', alt: 'Laptop and tech workspace on a desk' },
  { seed: 'crypto-charts', alt: 'Trading charts on a glowing monitor' },
  { seed: 'fintech-app', alt: 'Contactless mobile payment at checkout' },
  { seed: 'saas-dashboard', alt: 'Analytics dashboard on a laptop screen' },
  { seed: 'home-meta', alt: 'Newspaper and editorial desk layout' },
] as const

async function main() {
  const payload = await getPayload({ config })
  const heroImagesDir = path.resolve(root, 'src/endpoints/seed/hero-images')

  payload.logger.info('Creating real hero media...')

  const mediaDocs = []
  for (const def of heroImageDefs) {
    const filePath = path.join(heroImagesDir, `${def.seed}.jpg`)
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing hero image: ${filePath}`)
    }
    const data = fs.readFileSync(filePath)
    const doc = await payload.create({
      collection: 'media',
      data: { alt: def.alt },
      file: {
        name: `${def.seed}.jpg`,
        data,
        mimetype: 'image/jpeg',
        size: data.byteLength,
      },
      context: { disableRevalidate: true },
    })
    mediaDocs.push(doc)
    payload.logger.info(`  + ${def.seed}.jpg (${data.byteLength} bytes) → media #${doc.id}`)
  }

  const imagePool = mediaDocs.slice(0, -1)
  const imageHomeDoc = mediaDocs[mediaDocs.length - 1]

  const posts = await payload.find({
    collection: 'posts',
    limit: 500,
    depth: 0,
    pagination: false,
  })

  payload.logger.info(`Reassigning heroes on ${posts.docs.length} posts...`)

  let i = 0
  for (const post of posts.docs) {
    const hero = imagePool[i % imagePool.length]
    i += 1
    await payload.update({
      collection: 'posts',
      id: post.id,
      data: {
        heroImage: hero.id,
        meta: {
          ...(typeof post.meta === 'object' && post.meta ? post.meta : {}),
          image: hero.id,
        },
      },
      depth: 0,
      context: { disableRevalidate: true },
      overrideAccess: true,
    })
  }

  const home = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 0,
  })

  if (home.docs[0]) {
    const page = home.docs[0]
    await payload.update({
      collection: 'pages',
      id: page.id,
      data: {
        meta: {
          ...(typeof page.meta === 'object' && page.meta ? page.meta : {}),
          image: imageHomeDoc.id,
        },
      },
      depth: 0,
      context: { disableRevalidate: true },
      overrideAccess: true,
    })
    payload.logger.info(`Updated home meta image → media #${imageHomeDoc.id}`)
  }

  const sample = await payload.find({
    collection: 'posts',
    limit: 3,
    depth: 1,
  })
  for (const post of sample.docs) {
    const hero = post.heroImage
    if (hero && typeof hero === 'object') {
      payload.logger.info(
        `OK ${post.slug} → ${hero.filename} (${hero.filesize} bytes) ${hero.url}`,
      )
    }
  }

  payload.logger.info('Hero image refresh finished.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
