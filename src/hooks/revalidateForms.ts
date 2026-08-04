import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateForms: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating forms cache (form: ${doc?.title ?? doc?.id})`)

    try {
      revalidateTag('payload-forms', 'max')
      revalidateTag('global_footer', 'max')
      revalidatePath('/contact')
      revalidatePath('/')
    } catch {
      // Outside a Next.js request (e.g. onInit, scripts) revalidate is unavailable.
    }
  }

  return doc
}

export const revalidateFormsDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating forms cache after delete (form: ${doc?.title ?? doc?.id})`)

    try {
      revalidateTag('payload-forms', 'max')
      revalidateTag('global_footer', 'max')
      revalidatePath('/contact')
      revalidatePath('/')
    } catch {
      // Outside a Next.js request (e.g. scripts) revalidate is unavailable.
    }
  }

  return doc
}
