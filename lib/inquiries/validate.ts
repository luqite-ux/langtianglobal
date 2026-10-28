import { z } from 'zod'
import { inquiryFields, type InquiryField, type InquiryValues } from './types'

const phonePattern = /^\+?[\d\s().-]{6,}$/

export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(120),
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address.')
    .email('Enter a valid email address.')
    .max(254),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v === '' || phonePattern.test(v), 'Enter a valid phone number.'),
  company: z.string().trim().min(2, 'Enter your company name.').max(160),
  context: z.string().trim().min(1, 'Select what your inquiry is about.').max(120),
  quantity: z.string().trim().max(200),
  message: z
    .string()
    .trim()
    .min(10, 'Describe your requirement in at least 10 characters.')
    .max(4000, 'Keep the message under 4,000 characters.'),
})

export function readInquiryValues(formData: FormData): InquiryValues {
  return Object.fromEntries(
    inquiryFields.map((key) => {
      const value = formData.get(key)
      return [key, typeof value === 'string' ? value : '']
    }),
  ) as InquiryValues
}

export function validateInquiry(values: InquiryValues) {
  const parsed = inquirySchema.safeParse(values)
  if (parsed.success) return { ok: true as const, data: parsed.data }

  const fieldErrors: Partial<Record<InquiryField, string>> = {}
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as InquiryField
    if (!fieldErrors[key]) fieldErrors[key] = issue.message
  }
  return { ok: false as const, fieldErrors }
}
