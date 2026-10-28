import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, TENANT_COOKIE } from '@/lib/admin-session'

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (token && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
    await db.from('admin_user_sessions').delete().eq('token', token)
  }
  const response = NextResponse.redirect(new URL('/admin/login', request.url))
  response.cookies.delete(SESSION_COOKIE)
  response.cookies.delete(TENANT_COOKIE)
  return response
}
