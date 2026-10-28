import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, TENANT_COOKIE } from '@/lib/admin-session'

const tenantId = process.env.NEXT_PUBLIC_TENANT_ID
const emailAllowed = 'info@langtianglobal.com'
const days = 7

function fail(request: NextRequest, message: string) {
  const url = new URL('/admin/login', request.url)
  url.searchParams.set('error', message)
  return NextResponse.redirect(url, 303)
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (origin) {
    try {
      if (new URL(origin).host !== request.nextUrl.host) return fail(request, 'Sign-in request was rejected.')
    } catch {
      return fail(request, 'Sign-in request was rejected.')
    }
  }
  if (!tenantId || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return fail(request, 'Sign-in is unavailable.')
  const form = await request.formData()
  const email = String(form.get('email') || '').trim().toLowerCase()
  const password = String(form.get('password') || '')
  if (email !== emailAllowed || !password) return fail(request, 'Email or password is incorrect.')
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  const { data: user, error } = await db.from('admin_users')
    .select('id,password_hash,is_active,tenant_id').eq('email', email).eq('tenant_id', tenantId).maybeSingle()
  if (error || !user?.is_active || !(await bcrypt.compare(password, user.password_hash))) return fail(request, 'Email or password is incorrect.')
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + days * 86400_000)
  const { error: sessionError } = await db.from('admin_user_sessions').insert({
    admin_user_id: user.id, token, expires_at: expiresAt.toISOString(),
    ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
    user_agent: request.headers.get('user-agent') || null,
  })
  if (sessionError) return fail(request, 'Sign-in is unavailable.')
  const response = NextResponse.redirect(new URL('/admin', request.url), 303)
  for (const [name, value] of [[SESSION_COOKIE, token], [TENANT_COOKIE, tenantId]]) {
    response.cookies.set(name, value, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', expires: expiresAt, path: '/' })
  }
  return response
}
