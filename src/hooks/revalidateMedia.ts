import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Media } from '../payload-types'

export const revalidateMedia: CollectionAfterChangeHook<Media> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating homepage after media change: ${doc.filename ?? doc.id}`)
    revalidatePath('/')
  }

  return doc
}

export const revalidateMediaDelete: CollectionAfterDeleteHook<Media> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating homepage after media delete: ${doc?.filename ?? doc?.id}`)
    revalidatePath('/')
  }

  return doc
}
