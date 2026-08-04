import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateFundingNews: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating funding news`)
    revalidateTag('global_funding-news', 'max')
    // Homepage reads funding-news via queryFundingNews (force-static page).
    revalidatePath('/')
  }

  return doc
}
