'use client'

import { submitFormSubmission } from '@/utilities/submitFormSubmission'
import React, { FormEvent, useState } from 'react'

const AVATARS = [
  { initials: 'AK' },
  { initials: 'JM' },
  { initials: 'SR' },
  { initials: 'TL' },
] as const

type NewsletterSectionProps = {
  formId?: string | number | null
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ formId }) => {
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
    <section className="home-newsletter" aria-labelledby="home-newsletter-title">
      <div className="home-newsletter__inner">
        <div className="home-newsletter__copy">
          <div className="home-newsletter__icon-wrap" aria-hidden="true">
            <span className="home-newsletter__dots" />
            <span className="home-newsletter__icon">
              <svg
                className="home-newsletter__icon-svg"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="3.5" y="6.5" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M4 8.5L12 13.5L20 8.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 11.5V15.5H16V11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          <div className="home-newsletter__text">
            <h2 id="home-newsletter-title" className="home-newsletter__title">
              <span className="home-newsletter__title-line">Tech moves fast.</span>
              <span className="home-newsletter__title-accent">We keep you ahead.</span>
            </h2>
            <p className="home-newsletter__subtitle">
              Curated stories, deep dives, and key updates — straight to your inbox.
            </p>
          </div>
        </div>

        <div className="home-newsletter__action">
          {hasSubmitted ? (
            <p className="home-newsletter__proof-text" role="status">
              Thanks — you&apos;re subscribed.
            </p>
          ) : (
            <form className="home-newsletter__form" onSubmit={onSubmit}>
              <label htmlFor="home-newsletter-email" className="sr-only">
                Email
              </label>
              <div className="home-newsletter__field">
                <svg
                  className="home-newsletter__field-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect x="3.5" y="6.5" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M4 8.5L12 13.5L20 8.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  id="home-newsletter-email"
                  className="home-newsletter__input"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                />
              </div>
              <button type="submit" className="home-newsletter__btn" disabled={isLoading}>
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}

          {error ? (
            <p className="home-newsletter__proof-text" role="alert">
              {error}
            </p>
          ) : null}

          <div className="home-newsletter__proof">
            <ul className="home-newsletter__avatars" aria-hidden="true">
              {AVATARS.map((avatar) => (
                <li key={avatar.initials} className="home-newsletter__avatar">
                  <span className="home-newsletter__avatar-initials">{avatar.initials}</span>
                </li>
              ))}
            </ul>
            <p className="home-newsletter__proof-text">Join 25,000+ tech enthusiasts</p>
          </div>
        </div>
      </div>
    </section>
  )
}
