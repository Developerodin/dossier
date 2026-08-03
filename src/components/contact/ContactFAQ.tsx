'use client'

import { ChevronDown, ExternalLink, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

const FAQS = [
  {
    question: 'Do you offer advertising or sponsorships?',
    answer:
      'Yes. We offer sponsored content, newsletter placements, and display partnerships. Reach out via the contact form or partnerships@techblog.example.',
  },
  {
    question: 'Can I contribute a guest post?',
    answer:
      'We welcome thoughtful guest contributions from operators and journalists. Share your pitch through the form with subject “Guest post”.',
  },
  {
    question: 'How can I submit a press release?',
    answer:
      'Send press materials to press@techblog.example. We typically review media inquiries within 48 hours.',
  },
  {
    question: 'Do you have an API?',
    answer:
      'An API for selected content feeds is in progress. Contact us if you need early access for a product or research use case.',
  },
  {
    question: 'How do I report an issue or error?',
    answer:
      'Use the contact form with subject “Report an issue” and include the page URL, what you expected, and what you saw.',
  },
] as const

export const ContactFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="contact-faq">
      <h2 className="contact-faq__title">Frequently asked questions</h2>

      <ul className="contact-faq__list">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index
          const panelId = `contact-faq-panel-${index}`
          const buttonId = `contact-faq-button-${index}`

          return (
            <li key={faq.question} className="contact-faq__item">
              <button
                id={buttonId}
                type="button"
                className="contact-faq__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`contact-faq__chevron${isOpen ? ' is-open' : ''}`}
                  size={18}
                  aria-hidden="true"
                />
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`contact-faq__panel${isOpen ? ' is-open' : ''}`}
                hidden={!isOpen}
              >
                <p>{faq.answer}</p>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="contact-faq__help">
        <span className="contact-faq__help-icon" aria-hidden="true">
          <MessageCircle size={18} strokeWidth={1.75} />
        </span>
        <p className="contact-faq__help-text">
          Still have questions? Check out our{' '}
          <Link href="/search" className="contact-faq__help-link">
            Help Center
            <ExternalLink size={14} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </div>
  )
}
