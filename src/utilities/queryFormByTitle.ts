import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import { getFormIdByTitle } from './ensureRequiredForms'

/**
 * Cached Local API lookup for a Form Builder form ID by title.
 * Tag `payload-forms` is revalidated when forms change.
 */
export const queryFormIdByTitle = (title: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      return getFormIdByTitle(payload, title)
    },
    [`form-id-by-title-${title}`],
    {
      tags: ['payload-forms'],
    },
  )
