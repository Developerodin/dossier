/**
 * Removes Payload "dev mode" migration markers (batch = -1) that cause
 * interactive prompts and hung Vercel builds.
 *
 * Usage:
 *   pnpm dlx vercel env run -e production -- node --import=tsx/esm scripts/clear-dev-migrations.ts
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
const result = await payload.db.pool.query(
  'DELETE FROM payload_migrations WHERE batch = -1 RETURNING id, name, batch',
)

console.log(`Deleted ${result.rowCount} batch=-1 migration marker(s).`)
for (const row of result.rows) {
  console.log(` - ${row.name} (id=${row.id})`)
}

const remaining = await payload.db.pool.query(
  'SELECT id, name, batch FROM payload_migrations ORDER BY batch, id',
)
console.log(`Remaining migrations: ${remaining.rowCount}`)
for (const row of remaining.rows) {
  console.log(` - batch=${row.batch} ${row.name}`)
}

process.exit(0)
