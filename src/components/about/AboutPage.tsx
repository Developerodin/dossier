import { NEWSLETTER_FORM_TITLE } from '@/utilities/ensureRequiredForms'
import { queryFormIdByTitle } from '@/utilities/queryFormByTitle'
import { BookOpen, CheckCircle2, Newspaper, Shield, Zap } from 'lucide-react'
import React from 'react'

import { ContactNewsletter } from '@/components/contact/ContactNewsletter'

import './about.css'
import '@/components/contact/contact.css'
import '@/components/magazine/magazine.css'

const VALUES = [
  {
    icon: Shield,
    title: 'Facts first',
    body: 'We lead with verified information and clear sourcing so every story stands on solid ground.',
  },
  {
    icon: Zap,
    title: 'Updated daily',
    body: 'Fresh coverage every day means you can keep pace with launches, funding, and industry shifts.',
  },
  {
    icon: BookOpen,
    title: 'Clear explanations',
    body: 'Complex tech, explained without the jargon — so you understand what matters and why.',
  },
  {
    icon: CheckCircle2,
    title: 'Independent',
    body: 'Our reporting stays focused on readers: accuracy, context, and the signal — not the noise.',
  },
] as const

export const AboutPage: React.FC = async () => {
  const newsletterFormId = await queryFormIdByTitle(NEWSLETTER_FORM_TITLE)()

  return (
    <div className="about-page">
      <section className="about-hero" aria-labelledby="about-hero-title">
        <div className="about-hero__inner">
          <p className="about-hero__eyebrow">
            <span className="about-hero__eyebrow-line" aria-hidden="true" />
            About dossier
          </p>
          <h1 id="about-hero-title" className="about-hero__title">
            Tech news you can trust
          </h1>
          <p className="about-hero__lead">
            We bring you the right information — grounded in facts — so you stay ahead in a
            fast-moving tech world without falling behind.
          </p>
        </div>
      </section>

      <section className="about-mission" aria-labelledby="about-mission-title">
        <div className="about-mission__inner">
          <div className="about-mission__icon" aria-hidden="true">
            <Newspaper size={28} strokeWidth={1.75} />
          </div>
          <h2 id="about-mission-title" className="about-mission__title">
            Our mission
          </h2>
          <p className="about-mission__body">
            dossier exists to share accurate, fact-checked technology news and analysis. From AI
            breakthroughs to startup funding and big-tech moves, we publish the latest updates daily
            so readers never miss what shapes the industry.
          </p>
          <p className="about-mission__body">
            In a world where tech moves overnight, staying informed shouldn&apos;t mean drowning in
            noise. We filter for signal — the stories that matter — and deliver them with clarity
            and context.
          </p>
        </div>
      </section>

      <section className="about-values" aria-labelledby="about-values-title">
        <div className="about-values__inner">
          <h2 id="about-values-title" className="about-values__title">
            What we stand for
          </h2>
          <ul className="about-values__grid">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="about-values__card">
                <span className="about-values__card-icon" aria-hidden="true">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <h3 className="about-values__card-title">{title}</h3>
                <p className="about-values__card-body">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactNewsletter formId={newsletterFormId} />
    </div>
  )
}
