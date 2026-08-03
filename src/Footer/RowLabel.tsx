'use client'
import { Footer } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const QuickLinksRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Footer['quickLinks']>[number]>()

  const label = data?.data?.link?.label
    ? `Quick link ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data.data.link.label}`
    : 'Quick link'

  return <div>{label}</div>
}

export const PopularPagesRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Footer['popularPages']>[number]>()

  const label = data?.data?.link?.label
    ? `Popular page ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data.data.link.label}`
    : 'Popular page'

  return <div>{label}</div>
}
