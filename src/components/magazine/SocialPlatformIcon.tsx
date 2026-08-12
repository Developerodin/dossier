import React from 'react'
import { Facebook, Github, Instagram, Linkedin, Youtube } from 'lucide-react'

type SocialPlatformIconProps = {
  platform: string
  className?: string
  size?: number
}

const XIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.727-8.829L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
)

const platformNames: Record<string, string> = {
  x: 'X',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  github: 'GitHub',
  facebook: 'Facebook',
  instagram: 'Instagram',
}

export function socialPlatformLabel(platform: string): string {
  return platformNames[platform] || platform
}

export const SocialPlatformIcon: React.FC<SocialPlatformIconProps> = ({
  platform,
  className,
  size = 18,
}) => {
  const props = { size, className, 'aria-hidden': true as const }

  switch (platform) {
    case 'x':
      return <XIcon size={size} className={className} />
    case 'linkedin':
      return <Linkedin {...props} />
    case 'youtube':
      return <Youtube {...props} />
    case 'github':
      return <Github {...props} />
    case 'facebook':
      return <Facebook {...props} />
    case 'instagram':
      return <Instagram {...props} />
    default:
      return null
  }
}
