import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { DispatchResult, InquiryPayload } from './types'

/** Called only after submitInquiry has atomically verified and consumed CAPTCHA. */
export async function dispatchInquiry(payload: InquiryPayload): Promise<DispatchResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID
  if (!url || !key || !tenantId) return { ok: false, reason: 'not-configured' }
  const db = createClient(url, key, { auth: { persistSession: false } })
  const message = [
    payload.message,
    payload.quantity ? `Quantity / specification: ${payload.quantity}` : '',
    `Source page: ${payload.sourcePath}`,
  ].filter(Boolean).join('\n\n')
  const { error } = await db.from('inquiries').insert({
    tenant_id: tenantId,
    name: payload.name,
    email: payload.email,
    phone: payload.phone || null,
    company: payload.company || null,
    subject: payload.context,
    message,
    status: 'new',
  })
  if (error) {
    console.error('Inquiry insert failed', error.code)
    return { ok: false, reason: 'unavailable' }
  }
  return { ok: true }
}
