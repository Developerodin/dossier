/**
 * Clears Payload "dev mode" migration markers (batch = -1), then runs migrations.
 * The interactive prompt in @payloadcms/drizzle hangs non-TTY environments (Vercel).
 *
 * Usage:
 *   pnpm migrate:prod
 *   # or against production env:
 *   pnpm dlx vercel env run -e production -- pnpm migrate:prod
 */
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dirname, '..')
dotenv.config({ path: path.resolve(root, '.env.local') })
dotenv.config({ path: path.resolve(root, '.env') })

const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')

const payload = await getPayload({ config })

try {
  const cleared = await payload.db.pool.query(
    'DELETE FROM payload_migrations WHERE batch = -1 RETURNING id, name, batch',
  )
  console.log(`Cleared batch=-1 markers: ${cleared.rowCount}`)
  for (const row of cleared.rows) {
    console.log(` - ${row.name} (id=${row.id})`)
  }
} catch (err) {
  console.warn('Could not clear batch=-1 markers (non-fatal):', err)
}

console.log('Running migrations...')
await payload.db.migrate()
console.log('Migrations complete.')

process.exit(0)
