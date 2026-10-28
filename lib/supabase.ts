import 'server-only'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const tenantId = process.env.NEXT_PUBLIC_TENANT_ID

export const supabase = url && anonKey && tenantId
  ? createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null
