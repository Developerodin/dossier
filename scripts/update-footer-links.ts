/**
 * One-off: update footer quick links (About/Contact) and clear Careers/Advertise.
 * Run: node --import=tsx/esm scripts/update-footer-links.ts
 */
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dirname, '..')
dotenv.config({ path: path.resolve(root, '.env.local') })
dotenv.config({ path: path.resolve(root, '.env') })

const customLink = (label: string, url: string) => ({
  link: {
    type: 'custom' as const,
    label,
    url,
  },
})

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'footer',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: {
      quickLinks: [customLink('About', '/about'), customLink('Contact', '/contact')],
    },
  })

  payload.logger.info('Updated footer quick links to About + Contact')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
