import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE } from './lib/admin-session'
import { isServiceGuardExcludedPath, isWebsiteServiceAvailable } from './lib/service-status'
import { protectPreviewResponse } from './lib/site-content/preview-protection'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const preview = request.cookies.has('__Host-hq-site-preview')
  const protect = (response: NextResponse) => {
    protectPreviewResponse(response.headers, preview)
    return response
  }
  const isPublic = pathname.startsWith('/admin/login') || pathname.startsWith('/admin/logout')
  if (!isPublic && pathname.startsWith('/admin') && !request.cookies.get(SESSION_COOKIE)?.value) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('reason', 'unauthorized')
    return protect(NextResponse.redirect(url))
  }
  if (!isServiceGuardExcludedPath(pathname) && !(await isWebsiteServiceAvailable())) {
    return protect(NextResponse.rewrite(new URL('/service-expired', request.url)))
  }
  return protect(NextResponse.next())
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
