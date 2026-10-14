import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // Canonical host is the non-www apex. Any www host 308s to the same path on the
  // apex so Google never sees a second copy of a post, category, or page.
  const wwwRedirect = {
    source: '/:path*',
    has: [{ type: 'host' as const, value: 'www\\.(?<host>.*)' }],
    destination: 'https://:host/:path*',
    permanent: true,
  }

  return [wwwRedirect, internetExplorerRedirect]
}
