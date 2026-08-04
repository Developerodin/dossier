import {
  CONTACT_FORM_TITLE,
  NEWSLETTER_FORM_TITLE,
} from '@/utilities/ensureRequiredForms'
import { queryFormIdByTitle } from '@/utilities/queryFormByTitle'
import React from 'react'

import { ContactChannels } from './ContactChannels'
import { ContactFAQ } from './ContactFAQ'
import { ContactForm } from './ContactForm'
import { ContactHero } from './ContactHero'
import { ContactNewsletter } from './ContactNewsletter'
import { ContactTeam } from './ContactTeam'

import './contact.css'

export const ContactPage: React.FC = async () => {
  const [formId, newsletterFormId] = await Promise.all([
    queryFormIdByTitle(CONTACT_FORM_TITLE)(),
    queryFormIdByTitle(NEWSLETTER_FORM_TITLE)(),
  ])

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

      <ContactNewsletter formId={newsletterFormId} />
    </div>
  )
}
