'use server'

import { dispatchInquiry } from '@/lib/inquiries/dispatch'
import type { InquiryState } from '@/lib/inquiries/types'
import { readInquiryValues, validateInquiry } from '@/lib/inquiries/validate'

const failureMessages = {
  'not-configured':
    'Online inquiries are not connected yet, so your message was not sent. Please try again later or use the contact details on this page.',
  rejected:
    'We could not verify this submission. Please check your details and try again.',
  unavailable:
    'The inquiry service is temporarily unavailable. Your message was not sent. Please try again shortly.',
} as const

export async function submitInquiry(
  _previous: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const values = readInquiryValues(formData)

  if (String(formData.get('website') ?? '') !== '') {
    return { status: 'error', message: failureMessages.rejected, values }
  }

  const result = validateInquiry(values)
  if (!result.ok) {
    return {
      status: 'error',
      message: 'Please correct the highlighted fields and send again.',
      fieldErrors: result.fieldErrors,
      values,
    }
  }

  const sourcePath = String(formData.get('sourcePath') ?? '/')
  const captchaToken = String(formData.get('captchaToken') ?? '')

  try {
    const dispatched = await dispatchInquiry({
      ...result.data,
      sourcePath: sourcePath.slice(0, 200),
      captchaToken,
      submittedAt: new Date().toISOString(),
    })

    if (!dispatched.ok) {
      return {
        status: 'error',
        message: failureMessages[dispatched.reason],
        values,
      }
    }
  } catch {
    return { status: 'error', message: failureMessages.unavailable, values }
  }

  return {
    status: 'success',
    message:
      'Thank you. Your inquiry has been received and will be answered by email.',
  }
}
