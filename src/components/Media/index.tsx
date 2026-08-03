import React, { Fragment } from 'react'

import type { Props } from './types'

import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement, fill, resource } = props

  // When fill is used, skip the default static <div> wrapper so Next Image
  // sits directly under the already-positioned parent (card/hero container).
  const resolvedHtmlElement = htmlElement !== undefined ? htmlElement : fill ? null : 'div'
  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')
  const Tag = resolvedHtmlElement ?? Fragment

  return (
    <Tag
      {...(resolvedHtmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      {isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />}
    </Tag>
  )
}
