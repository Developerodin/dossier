import type { LucideIcon } from 'lucide-react'
import {
  Apple,
  Building2,
  Cloud,
  Coins,
  Cpu,
  Landmark,
  Leaf,
  Lock,
  Rocket,
  Smartphone,
  Sparkles,
  CircleDollarSign,
  Layers,
} from 'lucide-react'

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  ai: Sparkles,
  startups: Rocket,
  funding: CircleDollarSign,
  'big-tech': Building2,
  saas: Layers,
  fintech: Landmark,
  cybersecurity: Lock,
  'climate-tech': Leaf,
  apple: Apple,
  spacex: Rocket,
  cloud: Cloud,
  gadgets: Smartphone,
  crypto: Coins,
}

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? Cpu
}

