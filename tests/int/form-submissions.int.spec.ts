import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import {
  CONTACT_FORM_TITLE,
  NEWSLETTER_FORM_TITLE,
  ensureRequiredForms,
} from '@/utilities/ensureRequiredForms'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Form Builder submissions', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
    await ensureRequiredForms(payload)
  })

  it('ensures Contact Form and Newsletter Form exist', async () => {
    const forms = await payload.find({
      collection: 'forms',
      where: {
        title: {
          in: [CONTACT_FORM_TITLE, NEWSLETTER_FORM_TITLE],
        },
      },
      limit: 10,
      depth: 0,
    })

    const titles = forms.docs.map((doc) => doc.title)
    expect(titles).toContain(CONTACT_FORM_TITLE)
    expect(titles).toContain(NEWSLETTER_FORM_TITLE)
  })

  it('creates a contact form submission via Local API', async () => {
    const { contactForm } = await ensureRequiredForms(payload)

    const submission = await payload.create({
      collection: 'form-submissions',
      data: {
        form: contactForm.id,
        submissionData: [
          { field: 'name', value: 'Test User' },
          { field: 'email', value: 'test-contact@example.com' },
          { field: 'subject', value: 'general' },
          { field: 'message', value: 'Integration test contact message' },
        ],
      },
      depth: 0,
    })

    expect(submission.id).toBeDefined()
    expect(submission.submissionData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email', value: 'test-contact@example.com' }),
        expect.objectContaining({ field: 'message', value: 'Integration test contact message' }),
      ]),
    )

    const found = await payload.find({
      collection: 'form-submissions',
      where: {
        and: [
          { form: { equals: contactForm.id } },
          { 'submissionData.value': { equals: 'test-contact@example.com' } },
        ],
      },
      limit: 1,
      depth: 0,
    })

    expect(found.docs.length).toBeGreaterThanOrEqual(1)
  })

  it('creates a newsletter form submission via Local API', async () => {
    const { newsletterForm } = await ensureRequiredForms(payload)

    const submission = await payload.create({
      collection: 'form-submissions',
      data: {
        form: newsletterForm.id,
        submissionData: [{ field: 'email', value: 'test-newsletter@example.com' }],
      },
      depth: 0,
    })

    expect(submission.id).toBeDefined()
    expect(submission.submissionData?.[0]).toMatchObject({
      field: 'email',
      value: 'test-newsletter@example.com',
    })

    const footer = await payload.findGlobal({
      slug: 'footer',
      depth: 0,
    })

    const footerFormId =
      typeof footer.newsletter?.form === 'object'
        ? footer.newsletter?.form?.id
        : footer.newsletter?.form

    expect(footerFormId).toBe(newsletterForm.id)
  })

  it('rejects submissions for a non-existent form id', async () => {
    await expect(
      payload.create({
        collection: 'form-submissions',
        data: {
          form: 999999999,
          submissionData: [{ field: 'email', value: 'nobody@example.com' }],
        },
        depth: 0,
      }),
    ).rejects.toThrow()
  })
})
