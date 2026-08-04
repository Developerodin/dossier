'use client'

import { submitFormSubmission } from '@/utilities/submitFormSubmission'
import { Mail, Send, Shield } from 'lucide-react'
import React, { FormEvent, useState } from 'react'

type ContactNewsletterProps = {
  formId?: string | number | null
}

export const ContactNewsletter: React.FC<ContactNewsletterProps> = ({ formId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!formId) {
      setError('Newsletter signup is not configured yet. Please try again later.')
      return
    }

    const form = event.currentTarget
    const data = new FormData(form)
    const email = String(data.get('email') || '').trim()

    if (!email) {
      setError('Please enter your email address.')
      return
    }

    setIsLoading(true)

    try {
      const result = await submitFormSubmission({
        formId,
        submissionData: [{ field: 'email', value: email }],
      })

      if (!result.ok) {
        setError(result.message)
        return
      }

      setHasSubmitted(true)
      form.reset()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
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

        {hasSubmitted ? (
          <p className="contact-newsletter__note" role="status">
            <Shield size={14} aria-hidden="true" />
            Thanks — you&apos;re subscribed.
          </p>
        ) : (
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
                disabled={isLoading}
              />
            </div>
            <button type="submit" className="contact-newsletter__btn" disabled={isLoading}>
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        {error ? (
          <p className="contact-newsletter__note" role="alert">
            {error}
          </p>
        ) : !hasSubmitted ? (
          <p className="contact-newsletter__note">
            <Shield size={14} aria-hidden="true" />
            No spam. Unsubscribe anytime.
          </p>
        ) : null}
      </div>
    </section>
  )
}
