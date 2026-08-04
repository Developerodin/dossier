'use client'

import { submitFormSubmission } from '@/utilities/submitFormSubmission'
import { ChevronDown, Send, User } from 'lucide-react'
import Link from 'next/link'
import React, { FormEvent, useState } from 'react'

const SUBJECTS = [
  { label: 'General inquiry', value: 'general' },
  { label: 'Press & media', value: 'press' },
  { label: 'Partnerships', value: 'partnerships' },
  { label: 'Careers', value: 'careers' },
  { label: 'Advertising / sponsorships', value: 'advertising' },
  { label: 'Guest post', value: 'guest-post' },
  { label: 'Report an issue', value: 'report' },
] as const

type ContactFormProps = {
  formId?: string | number | null
}

export const ContactForm: React.FC<ContactFormProps> = ({ formId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!formId) {
      setError('Contact form is not configured yet. Please try again later.')
      return
    }

    const form = event.currentTarget
    const data = new FormData(form)
    const privacy = data.get('privacy')

    if (!privacy) {
      setError('Please agree to the Privacy Policy and Terms of Service.')
      return
    }

    const submissionData = [
      { field: 'name', value: String(data.get('name') || '') },
      { field: 'email', value: String(data.get('email') || '') },
      { field: 'subject', value: String(data.get('subject') || '') },
      { field: 'message', value: String(data.get('message') || '') },
    ]

    setIsLoading(true)

    try {
      const result = await submitFormSubmission({ formId, submissionData })

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
    <div className="contact-form">
      <div className="contact-form__pattern" aria-hidden="true" />

      <div className="contact-form__header">
        <h2 className="contact-form__title">Send us a message</h2>
        <p className="contact-form__subtitle">
          Fill out the form below and we&apos;ll get back to you soon.
        </p>
      </div>

      {hasSubmitted ? (
        <div className="contact-form__success" role="status">
          <p className="contact-form__success-title">Message sent</p>
          <p className="contact-form__success-text">
            Thanks for reaching out. We&apos;ll get back to you soon.
          </p>
          <button
            type="button"
            className="contact-form__submit"
            onClick={() => setHasSubmitted(false)}
          >
            Send another message
          </button>
        </div>
      ) : (
        <form className="contact-form__form" onSubmit={onSubmit} noValidate>
          <div className="contact-form__row">
            <label className="contact-form__field">
              <span className="contact-form__label">Your Name</span>
              <span className="contact-form__input-wrap">
                <User className="contact-form__input-icon" size={16} aria-hidden="true" />
                <input
                  className="contact-form__input"
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  autoComplete="name"
                  required
                />
              </span>
            </label>

            <label className="contact-form__field">
              <span className="contact-form__label">Email Address</span>
              <span className="contact-form__input-wrap">
                <span className="contact-form__input-icon contact-form__input-icon--at" aria-hidden="true">
                  @
                </span>
                <input
                  className="contact-form__input"
                  type="email"
                  name="email"
                  placeholder="jane@example.com"
                  autoComplete="email"
                  required
                />
              </span>
            </label>
          </div>

          <label className="contact-form__field">
            <span className="contact-form__label">Subject</span>
            <span className="contact-form__select-wrap">
              <select className="contact-form__select" name="subject" required defaultValue="">
                <option value="" disabled>
                  Select a subject
                </option>
                {SUBJECTS.map((subject) => (
                  <option key={subject.value} value={subject.value}>
                    {subject.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="contact-form__select-icon" size={16} aria-hidden="true" />
            </span>
          </label>

          <label className="contact-form__field">
            <span className="contact-form__label">Message</span>
            <textarea
              className="contact-form__textarea"
              name="message"
              placeholder="Tell us how we can help..."
              rows={5}
              required
            />
          </label>

          <label className="contact-form__privacy">
            <input className="contact-form__checkbox" type="checkbox" name="privacy" required />
            <span>
              I agree to the{' '}
              <Link href="/privacy" className="contact-form__link">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/terms" className="contact-form__link">
                Terms of Service
              </Link>
            </span>
          </label>

          {error ? (
            <p className="contact-form__error" role="alert">
              {error}
            </p>
          ) : null}

          <button className="contact-form__submit" type="submit" disabled={isLoading}>
            <Send size={16} aria-hidden="true" />
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  )
}
