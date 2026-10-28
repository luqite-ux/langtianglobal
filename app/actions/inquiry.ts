'use server'

import { dispatchInquiry } from '@/lib/inquiries/dispatch'
import type { InquiryState } from '@/lib/inquiries/types'
import { readInquiryValues, validateInquiry } from '@/lib/inquiries/validate'
import { createSupabaseCaptchaContextFromEnv, verifyCaptchaSubmission } from '@/lib/inquiry-captcha'

const failureMessages = {
  'not-configured':
    'Online inquiries are not connected yet, so your message was not sent. Please try again later or use the contact details on this page.',
  rejected:
    'We could not verify this submission. Please check your details and try again.',
  unavailable:
    'The inquiry service is temporarily unavailable. Your message was not sent. Please try again shortly.',
} as const

export async function submitInquiry(
  previous: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const values = readInquiryValues(formData)
  const captchaToken = String(formData.get('captchaToken') ?? '')
  const captchaScope = String(formData.get('captchaScope') ?? '')
  const captchaAnswer = String(formData.get('captchaAnswer') ?? '')
  const refresh = (previous.captchaRefreshKey ?? 0) + 1

  try {
    const context = createSupabaseCaptchaContextFromEnv()
    const captcha = await verifyCaptchaSubmission({
      secret: process.env.CAPTCHA_SECRET || '', ...context,
      scope: captchaScope, token: captchaToken, answer: captchaAnswer,
    })
    if (!captcha.ok) return { status: 'error', message: failureMessages.rejected, values, captchaRefreshKey: refresh }
  } catch {
    return { status: 'error', message: failureMessages.unavailable, values, captchaRefreshKey: refresh }
  }

  if (String(formData.get('website') ?? '') !== '') {
    return { status: 'error', message: failureMessages.rejected, values, captchaRefreshKey: refresh }
  }

  const result = validateInquiry(values)
  if (!result.ok) {
    return {
      status: 'error',
      message: 'Please correct the highlighted fields and send again.',
      fieldErrors: result.fieldErrors,
      values,
      captchaRefreshKey: refresh,
    }
  }

  const sourcePath = String(formData.get('sourcePath') ?? '/')

  try {
    const dispatched = await dispatchInquiry({
      ...result.data,
      sourcePath: sourcePath.slice(0, 200),
      captchaToken,
      captchaScope,
      captchaAnswer,
      submittedAt: new Date().toISOString(),
    })

    if (!dispatched.ok) {
      return {
        status: 'error',
        message: failureMessages[dispatched.reason],
        values,
        captchaRefreshKey: refresh,
      }
    }
  } catch {
    return { status: 'error', message: failureMessages.unavailable, values, captchaRefreshKey: refresh }
  }

  return {
    status: 'success',
    message:
      'Thank you. Your inquiry has been received and will be answered by email.',
  }
}
