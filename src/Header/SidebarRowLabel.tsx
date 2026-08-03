'use client'
import { Header } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Header['sidebarGroups']>[number]>()

  const label = data?.data?.label
    ? `Group ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data.data.label}`
    : 'Sidebar group'

  return <div>{label}</div>
}
