'use client'

import { submitFormSubmission } from '@/utilities/submitFormSubmission'
import React, { FormEvent, useState } from 'react'

type SidebarNewsletterProps = {
  formId?: string | number | null
  compact?: boolean
}

export const SidebarNewsletter: React.FC<SidebarNewsletterProps> = ({ formId, compact = false }) => {
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
    <aside className={`mag-sidebar-newsletter${compact ? ' mag-sidebar-newsletter--compact' : ''}`}>
      <h3 className="mag-widget-title">Newsletter</h3>
      <p className="mag-sidebar-newsletter__desc">
        Your email address will not be published. Required fields are marked.
      </p>
      {hasSubmitted ? (
        <p className="mag-sidebar-newsletter__success" role="status">
          Thanks — you&apos;re subscribed.
        </p>
      ) : (
        <form className="mag-sidebar-newsletter__form" onSubmit={onSubmit}>
          <label htmlFor="sidebar-newsletter-email" className="sr-only">
            Email
          </label>
          <input
            id="sidebar-newsletter-email"
            className="mag-sidebar-newsletter__input"
            type="email"
            name="email"
            placeholder="Your email address"
            autoComplete="email"
            required
            disabled={isLoading}
          />
          <button type="submit" className="mag-sidebar-newsletter__btn" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
      )}
      {error ? (
        <p className="mag-sidebar-newsletter__error" role="alert">
          {error}
        </p>
      ) : null}
      <p className="mag-sidebar-newsletter__fine">We hate spam as much as you do</p>
    </aside>
  )
}
