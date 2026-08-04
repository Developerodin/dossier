import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { FundingRound } from '../payload-types'

export const revalidateFundingRound: CollectionAfterChangeHook<FundingRound> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating homepage after funding round change: ${doc.companyName}`)
    revalidatePath('/')
  }

  return doc
}

export const revalidateFundingRoundDelete: CollectionAfterDeleteHook<FundingRound> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating homepage after funding round delete: ${doc?.companyName}`)
    revalidatePath('/')
  }

  return doc
}
