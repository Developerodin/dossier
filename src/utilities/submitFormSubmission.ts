export type FormSubmissionField = {
  field: string
  value: string
}

export type SubmitFormSubmissionResult =
  | { ok: true }
  | { ok: false; message: string }

/**
 * Client-side submit matching Payload FormBlock → POST /api/form-submissions.
 */
export async function submitFormSubmission(args: {
  formId: string | number
  submissionData: FormSubmissionField[]
}): Promise<SubmitFormSubmissionResult> {
  const { formId, submissionData } = args

  try {
    const req = await fetch('/api/form-submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        form: formId,
        submissionData,
      }),
    })

    const res = (await req.json().catch(() => ({}))) as {
      errors?: { message?: string }[]
    }

    if (req.status >= 400) {
      return {
        ok: false,
        message: res.errors?.[0]?.message || 'Something went wrong. Please try again.',
      }
    }

    return { ok: true }
  } catch {
    return {
      ok: false,
      message: 'Something went wrong. Please try again.',
    }
  }
}
