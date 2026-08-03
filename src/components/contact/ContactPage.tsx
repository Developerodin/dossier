import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import { ContactChannels } from './ContactChannels'
import { ContactFAQ } from './ContactFAQ'
import { ContactForm } from './ContactForm'
import { ContactHero } from './ContactHero'
import { ContactNewsletter } from './ContactNewsletter'
import { ContactTeam } from './ContactTeam'

import './contact.css'

const queryContactFormId = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'forms',
    limit: 1,
    pagination: false,
    depth: 0,
    where: {
      title: {
        equals: 'Contact Form',
      },
    },
  })

  return result.docs?.[0]?.id ?? null
})

export const ContactPage: React.FC = async () => {
  const formId = await queryContactFormId()

  return (
    <div className="contact-page">
      <section className="contact-hero" aria-labelledby="contact-hero-title">
        <div className="contact-hero__inner">
          <ContactHero />
          <ContactForm formId={formId} />
        </div>
      </section>

      <section className="contact-mid" aria-label="Contact details and FAQ">
        <div className="contact-mid__inner">
          <ContactChannels />
          <ContactTeam />
          <ContactFAQ />
        </div>
      </section>

      <ContactNewsletter />
    </div>
  )
}
