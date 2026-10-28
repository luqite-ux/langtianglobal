'use client'

import { InquiryCaptchaField } from './inquiry-captcha-field'

export function CaptchaSlot({ refreshKey = 0 }: { refreshKey?: number }) {
  return <InquiryCaptchaField refreshKey={refreshKey} />
}
