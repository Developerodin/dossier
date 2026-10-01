import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Form } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import {
  SocialPlatformIcon,
  socialPlatformLabel,
} from '@/components/magazine/SocialPlatformIcon'
import { resolveFooterData } from './defaults'
import { NewsletterSignup } from './NewsletterSignup'

import './footer.css'
import '@/components/magazine/magazine.css'

function resolveNewsletterFormId(
  form: number | Form | null | undefined,
): number | string | null {
  if (form == null) return null
  if (typeof form === 'object') return form.id
  return form
}

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const data = resolveFooterData(footerData)

  const quickLinks = data.quickLinks || []
  const popularPages = data.popularPages || []
  const socialLinks = data.socialLinks || []
  const newsletterFormId = resolveNewsletterFormId(data.newsletter?.form)

  return (
    <footer className="site-footer mag-footer">
      <div className="mag-footer__top">
        <div className="site-footer__inner mag-footer__top-inner">
          <div className="mag-footer__brand-row">
            <Link href="/" className="site-footer__logo" aria-label="dossier home">
              <Logo variant="white" />
            </Link>
          </div>
          <NewsletterSignup
            formId={newsletterFormId}
            heading={data.newsletter?.heading}
            placeholder={data.newsletter?.placeholder}
            buttonLabel={data.newsletter?.buttonLabel}
          />
        </div>
      </div>

      <div className="site-footer__inner">
        <div className="site-footer__grid mag-footer__grid">
          <div className="site-footer__columns mag-footer__columns">
            <div>
              <p className="site-footer__col-title">Quick links</p>
              <ul className="site-footer__links">
                {quickLinks.map(({ link }, i) => (
                  <li key={i}>
                    <CMSLink {...link} appearance="inline" className="site-footer__link" />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="site-footer__col-title">Popular pages</p>
              <ul className="site-footer__links">
                {popularPages.map(({ link }, i) => (
                  <li key={i}>
                    <CMSLink {...link} appearance="inline" className="site-footer__link" />
                  </li>
                ))}
              </ul>
            </div>
            <div className="mag-footer__follow">
              <p className="site-footer__col-title">Follow us</p>
              <ul className="mag-follow__grid">
                {socialLinks.map(({ platform, url, id }, index) => {
                  if (!platform) return null
                  const label = socialPlatformLabel(platform)
                  return (
                    <li key={id ?? `${platform}-${index}`}>
                      <a
                        className="mag-follow__item"
                        href={url || '#'}
                        aria-label={label}
                        title={label}
                      >
                        <SocialPlatformIcon
                          platform={platform}
                          className="mag-follow__icon"
                        />
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        <p className="site-footer__copyright mag-footer__copyright">{data.copyright}</p>
      </div>
    </footer>
  )
}
