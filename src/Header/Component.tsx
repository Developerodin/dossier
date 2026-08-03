import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import { resolveHeaderData } from './defaults'

export async function Header() {
  const headerData = await getCachedGlobal('header', 1)()

  return <HeaderClient data={resolveHeaderData(headerData)} />
}
