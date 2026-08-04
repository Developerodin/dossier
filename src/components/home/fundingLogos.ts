/** Static placeholder logos in /public/funding-logos */

const COMPANY_LOGOS: Record<string, string> = {
  xai: '/funding-logos/xai.png',
  wayve: '/funding-logos/wayve.png',
  harvey: '/funding-logos/harvey.png',
  decagon: '/funding-logos/decagon.png',
}

const INVESTOR_LOGOS: Record<string, string> = {
  a16z: '/funding-logos/a16z.png',
  sequoia: '/funding-logos/sequoia.png',
  'valor equity partners': '/funding-logos/valor.png',
  valor: '/funding-logos/valor.png',
  softbank: '/funding-logos/softbank.png',
  nvidia: '/funding-logos/nvidia.png',
  microsoft: '/funding-logos/microsoft.png',
  openai: '/funding-logos/openai.png',
  gv: '/funding-logos/gv.png',
  accel: '/funding-logos/accel.png',
  index: '/funding-logos/index.png',
}

export function companyPlaceholderLogo(slugOrName: string | null | undefined): string | null {
  if (!slugOrName) return null
  const key = slugOrName.trim().toLowerCase()
  return COMPANY_LOGOS[key] ?? null
}

export function investorPlaceholderLogo(name: string | null | undefined): string | null {
  if (!name) return null
  const key = name.trim().toLowerCase()
  return INVESTOR_LOGOS[key] ?? null
}
