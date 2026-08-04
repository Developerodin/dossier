import type { Payload } from 'payload'

const FORM_SUBMISSIONS_PREFS_KEY = 'collection-form-submissions'

type ColumnPref = {
  active?: boolean
  accessor?: string
}

function allColumnsHidden(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false

  const columns = (value as { columns?: ColumnPref[] }).columns
  if (!Array.isArray(columns) || columns.length === 0) return false

  return columns.every((col) => col?.active === false)
}

/**
 * Removes Form Submissions list prefs that hide every column.
 * A poisoned admin URL (`?columns=["-id","-form",...]`) can re-save these
 * and leave the list looking empty even though rows exist.
 */
export async function resetHiddenFormSubmissionColumnPrefs(payload: Payload): Promise<number> {
  const prefs = await payload.find({
    collection: 'payload-preferences',
    depth: 0,
    limit: 100,
    pagination: false,
    where: {
      key: {
        equals: FORM_SUBMISSIONS_PREFS_KEY,
      },
    },
  })

  let deleted = 0

  for (const doc of prefs.docs) {
    if (!allColumnsHidden(doc.value)) continue

    await payload.delete({
      collection: 'payload-preferences',
      id: doc.id,
    })
    deleted += 1
  }

  if (deleted > 0) {
    payload.logger.info(
      `Reset ${deleted} Form Submissions list preference(s) with all columns hidden`,
    )
  }

  return deleted
}
