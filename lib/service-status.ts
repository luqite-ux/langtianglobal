export const SERVICE_GUARD_VERSION = '1'

type PublicServiceStatus = {
  version?: number
  available?: boolean
  status?: string
}

export function isServiceGuardExcludedPath(pathname: string): boolean {
  return pathname === '/service-expired'
    || pathname.startsWith('/admin')
    || pathname.startsWith('/api')
    || pathname.startsWith('/_next')
    || pathname === '/favicon.ico'
    || pathname === '/robots.txt'
    || pathname === '/sitemap.xml'
    || /\.[a-z0-9]+$/i.test(pathname)
}

export async function isWebsiteServiceAvailable(): Promise<boolean> {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL?.trim().replace(/\/$/, '')
  if (!tenantId || !adminUrl) return true

  try {
    const response = await fetch(`${adminUrl}/api/public/service-status/${encodeURIComponent(tenantId)}`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(2000),
      cache: 'no-store',
    })
    if (!response.ok) return true
    const payload = await response.json() as PublicServiceStatus
    return !(payload.version === 1 && payload.available === false && payload.status === 'expired')
  } catch {
    return true
  }
}
