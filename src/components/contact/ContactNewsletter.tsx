'use client'

import { Mail, Send, Shield } from 'lucide-react'
import React, { FormEvent } from 'react'

export const ContactNewsletter: React.FC = () => {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <section className="contact-newsletter" aria-labelledby="contact-newsletter-title">
      <div className="contact-newsletter__inner">
        <div className="contact-newsletter__copy">
          <span className="contact-newsletter__icon" aria-hidden="true">
            <Send size={20} />
          </span>
          <div>
            <h2 id="contact-newsletter-title" className="contact-newsletter__title">
              Stay in the loop
            </h2>
            <p className="contact-newsletter__subtitle">
              Get the best tech stories and insights delivered straight to your inbox.
            </p>
          </div>
        </div>

        <form className="contact-newsletter__form" onSubmit={onSubmit}>
          <label htmlFor="contact-newsletter-email" className="sr-only">
            Email
          </label>
          <div className="contact-newsletter__field">
            <Mail className="contact-newsletter__field-icon" size={16} aria-hidden="true" />
            <input
              id="contact-newsletter-email"
              className="contact-newsletter__input"
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>
          <button type="submit" className="contact-newsletter__btn">
            Subscribe
          </button>
        </form>

        <p className="contact-newsletter__note">
          <Shield size={14} aria-hidden="true" />
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
