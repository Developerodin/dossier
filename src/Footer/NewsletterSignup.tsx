'use client'

import { submitFormSubmission } from '@/utilities/submitFormSubmission'
import React, { FormEvent, useState } from 'react'

type NewsletterSignupProps = {
  formId?: string | number | null
  heading?: string | null
  placeholder?: string | null
  buttonLabel?: string | null
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  formId,
  heading,
  placeholder,
  buttonLabel,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!formId) {
      setError('Newsletter signup is not configured yet.')
      return
    }

    const form = event.currentTarget
    const data = new FormData(form)
    const email = String(data.get('email') || '').trim()

    if (!email) {
      setError('Please enter your email.')
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
    <div className="site-footer__newsletter">
      {heading ? <p className="site-footer__col-title">{heading}</p> : null}

      {hasSubmitted ? (
        <p className="site-footer__link" role="status">
          Thanks — you&apos;re subscribed.
        </p>
      ) : (
        <form className="site-footer__newsletter-form" onSubmit={onSubmit}>
          <label htmlFor="footer-newsletter-email" className="sr-only">
            Email
          </label>
          <input
            id="footer-newsletter-email"
            className="site-footer__newsletter-input"
            type="email"
            name="email"
            placeholder={placeholder || 'Your email'}
            autoComplete="email"
            required
            disabled={isLoading}
          />
          <button type="submit" className="site-footer__newsletter-btn" disabled={isLoading}>
            {isLoading ? '...' : buttonLabel || 'Subscribe'}
          </button>
        </form>
      )}

      {error ? (
        <p className="site-footer__link" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
