'use client'

/**
 * Integration point for the tenant-scoped CAPTCHA.
 *
 * Render the CAPTCHA widget here and write its token into the hidden
 * `captchaToken` input. The server action forwards that value to
 * `dispatchInquiry`, which must verify it before storing the inquiry.
 * Nothing is rendered visibly until a widget is connected.
 */
export function CaptchaSlot() {
  return <input type="hidden" name="captchaToken" defaultValue="" />
}
