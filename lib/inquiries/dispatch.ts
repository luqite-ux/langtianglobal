import type { DispatchResult, InquiryPayload } from './types'

/**
 * Integration point for Codex.
 *
 * Replace the body with the real pipeline:
 * 1. verify `payload.captchaToken` with the tenant-scoped CAPTCHA service,
 * 2. insert the inquiry into Supabase scoped to the tenant,
 * 3. notify through the shared admin.
 *
 * Until then it reports `not-configured`, so the form shows an honest error
 * instead of a fake success.
 */
export async function dispatchInquiry(
  payload: InquiryPayload,
): Promise<DispatchResult> {
  void payload
  return { ok: false, reason: 'not-configured' }
}
