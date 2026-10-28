export const inquiryFields = [
  'name',
  'email',
  'phone',
  'company',
  'context',
  'quantity',
  'message',
] as const

export type InquiryField = (typeof inquiryFields)[number]
export type InquiryValues = Record<InquiryField, string>

export type InquiryState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Partial<Record<InquiryField, string>>
  values?: Partial<InquiryValues>
  captchaRefreshKey?: number
}

export const initialInquiryState: InquiryState = { status: 'idle' }

export type InquiryPayload = InquiryValues & {
  sourcePath: string
  captchaToken: string
  captchaScope: string
  captchaAnswer: string
  submittedAt: string
}

export type DispatchResult =
  | { ok: true }
  | { ok: false; reason: 'not-configured' | 'rejected' | 'unavailable' }
