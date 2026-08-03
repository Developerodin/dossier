import React from 'react'
import { Clock, Mail, Shield } from 'lucide-react'

const TIPS = [
  {
    icon: Clock,
    text: 'We typically respond within 24 hours',
  },
  {
    icon: Mail,
    text: 'For press inquiries, we aim to reply within 48 hours',
  },
  {
    icon: Shield,
    text: 'Your information is safe with us. We respect your privacy.',
  },
] as const

export const ContactHero: React.FC = () => {
  return (
    <div className="contact-hero__copy">
      <p className="contact-hero__eyebrow">
        <span className="contact-hero__eyebrow-line" aria-hidden="true" />
        CONTACT US
      </p>

      <h1 id="contact-hero-title" className="contact-hero__title">
        We&apos;d love to hear from{' '}
        <span className="contact-hero__title-accent">
          you
          <span className="contact-hero__title-underline" aria-hidden="true" />
        </span>
      </h1>

      <p className="contact-hero__subtitle">
        Have a question, feedback, or just want to say hello? Our team is here and happy to help.
      </p>

      <ul className="contact-hero__tips">
        {TIPS.map(({ icon: Icon, text }) => (
          <li key={text} className="contact-hero__tip">
            <span className="contact-hero__tip-icon" aria-hidden="true">
              <Icon size={18} strokeWidth={1.75} />
            </span>
            <span className="contact-hero__tip-text">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
