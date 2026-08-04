import type { Payload } from 'payload'

import type { Form } from '@/payload-types'
import { contactForm as contactFormData } from '@/endpoints/seed/contact-form'
import { newsletterForm as newsletterFormData } from '@/endpoints/seed/newsletter-form'

export const CONTACT_FORM_TITLE = 'Contact Form'
export const NEWSLETTER_FORM_TITLE = 'Newsletter Form'

async function findFormByTitle(payload: Payload, title: string): Promise<Form | null> {
  const result = await payload.find({
    collection: 'forms',
    depth: 0,
    limit: 1,
    pagination: false,
    where: {
      title: {
        equals: title,
      },
    },
  })

  return result.docs[0] ?? null
}

async function ensureForm(
  payload: Payload,
  title: string,
  data: typeof contactFormData | typeof newsletterFormData,
): Promise<Form> {
  const existing = await findFormByTitle(payload, title)
  if (existing) {
    // Keep admin storage-only: clear legacy email notification configs.
    if (existing.emails && existing.emails.length > 0) {
      payload.logger.info(`Clearing email notifications on form: ${title}`)
      return payload.update({
        collection: 'forms',
        id: existing.id,
        depth: 0,
        data: {
          emails: [],
        },
        context: {
          disableRevalidate: true,
        },
      })
    }
    return existing
  }

  payload.logger.info(`Creating missing form: ${title}`)

  return payload.create({
    collection: 'forms',
    depth: 0,
    data,
    context: {
      disableRevalidate: true,
    },
  })
}

/**
 * Idempotent bootstrap for required Form Builder documents.
 * Safe for production — never deletes submissions or existing forms.
 * Also wires Footer.newsletter.form when unset.
 */
export async function ensureRequiredForms(payload: Payload): Promise<{
  contactForm: Form
  newsletterForm: Form
}> {
  const contactForm = await ensureForm(payload, CONTACT_FORM_TITLE, contactFormData)
  const newsletterForm = await ensureForm(payload, NEWSLETTER_FORM_TITLE, newsletterFormData)

  try {
    const footer = await payload.findGlobal({
      slug: 'footer',
      depth: 0,
    })

    if (!footer.newsletter?.form) {
      payload.logger.info('Linking Newsletter Form to Footer global')
      await payload.updateGlobal({
        slug: 'footer',
        depth: 0,
        data: {
          newsletter: {
            ...footer.newsletter,
            form: newsletterForm.id,
          },
        },
        context: {
          disableRevalidate: true,
        },
      })
    }
  } catch (err) {
    payload.logger.error({ err, msg: 'Failed to link newsletter form on Footer' })
  }

  return { contactForm, newsletterForm }
}

export async function getFormIdByTitle(
  payload: Payload,
  title: string,
): Promise<Form['id'] | null> {
  const form = await findFormByTitle(payload, title)
  return form?.id ?? null
}
