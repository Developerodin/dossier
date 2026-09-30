import type { StaticImageData } from 'next/image'
import type { ElementType, Ref } from 'react'

import type { Media as MediaType } from '@/payload-types'

export type PayloadImageSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge'

export interface Props {
  alt?: string
  className?: string
  fill?: boolean // for NextImage only
  htmlElement?: ElementType | null
  pictureClassName?: string
  imgClassName?: string
  onClick?: () => void
  onLoad?: () => void
  loading?: 'lazy' | 'eager' // for NextImage only
  /** Override CSS object-position; defaults to media focalX/focalY when present */
  objectPosition?: string
  /** Prefer a specific Payload-generated size; defaults to large (priority) or medium */
  payloadSize?: PayloadImageSize
  priority?: boolean // for NextImage only
  ref?: Ref<HTMLImageElement | HTMLVideoElement | null>
  resource?: MediaType | string | number | null // for Payload media
  size?: string // for NextImage only
  src?: StaticImageData // for static media
  videoClassName?: string
}
