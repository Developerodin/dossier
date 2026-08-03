import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { resolveFooterData } from './defaults'
import { NewsletterSignup } from './NewsletterSignup'
import { SocialLinks } from './SocialLinks'

import './footer.css'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const data = resolveFooterData(footerData)

  const quickLinks = data.quickLinks || []
  const popularPages = data.popularPages || []
  const socialLinks = data.socialLinks || []

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Link href="/" className="site-footer__logo" aria-label="dossier home">
              <Logo />
            </Link>
            <p className="site-footer__copyright site-footer__desktop-copyright">
              {data.copyright}
            </p>
          </div>

          <div className="site-footer__columns">
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
          </div>

          <hr className="site-footer__separator" />

          <div className="site-footer__socials-mobile">
            <SocialLinks links={socialLinks} />
          </div>

          <div className="site-footer__aside">
            <div>
              <p className="site-footer__col-title">{data.contact?.heading || 'Contact us'}</p>
              <ul className="site-footer__contact-list">
                {data.contact?.email ? (
                  <li>
                    <a className="site-footer__link" href={`mailto:${data.contact.email}`}>
                      {data.contact.email}
                    </a>
                  </li>
                ) : null}
                {data.contact?.phone ? (
                  <li>
                    <a className="site-footer__link" href={`tel:${data.contact.phone}`}>
                      {data.contact.phone}
                    </a>
                  </li>
                ) : null}
                <li>
                  <a
                    className="site-footer__link"
                    href={
                      data.contact?.url && data.contact.url !== '#'
                        ? data.contact.url
                        : '/contact'
                    }
                  >
                    Contact page
                  </a>
                </li>
              </ul>
            </div>

            <NewsletterSignup
              heading={data.newsletter?.heading}
              placeholder={data.newsletter?.placeholder}
              buttonLabel={data.newsletter?.buttonLabel}
            />

            <SocialLinks links={socialLinks} />
          </div>
        </div>

        <p className="site-footer__copyright site-footer__mobile-copyright">{data.copyright}</p>
      </div>
    </footer>
  )
}
