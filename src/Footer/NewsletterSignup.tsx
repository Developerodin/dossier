'use client'

import React, { FormEvent } from 'react'

type NewsletterSignupProps = {
  heading?: string | null
  placeholder?: string | null
  buttonLabel?: string | null
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  heading,
  placeholder,
  buttonLabel,
}) => {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <div className="site-footer__newsletter">
      {heading ? <p className="site-footer__col-title">{heading}</p> : null}
      <form className="site-footer__newsletter-form" action="#" onSubmit={onSubmit}>
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
        />
        <button type="submit" className="site-footer__newsletter-btn">
          {buttonLabel || 'Subscribe'}
        </button>
      </form>
    </div>
  )
}
