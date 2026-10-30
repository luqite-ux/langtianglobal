import 'server-only'
import { getCertificates } from '@/lib/data'
import type { Certificate } from '@/lib/data/types'
import { getSiteContent } from './site-content'
import { siteModule } from './read'

export async function getSiteCertificates(): Promise<Certificate[]> {
  const snapshot = await getSiteContent('en')
  if (!snapshot) return getCertificates()
  const module = siteModule(snapshot, '/quality', 'certificates')
  if (!module || !Array.isArray(module.values.items)) throw new Error('Published certificates are missing')
  const slugs = new Set<string>()
  const certificates = module.values.items.map(raw => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Invalid published certificate')
    const item = raw as Record<string, unknown>
    if (typeof item.slug !== 'string' || !/^[a-z0-9-]{2,80}$/.test(item.slug) || slugs.has(item.slug)
      || typeof item.standard !== 'string' || !item.standard || typeof item.title !== 'string' || !item.title) throw new Error('Incomplete published certificate')
    slugs.add(item.slug)
    const scan = item.scan
    const image = scan && typeof scan === 'object' && !Array.isArray(scan) ? scan as Record<string, unknown> : null
    if (image && (typeof image.url !== 'string' || !image.url.startsWith('https://'))) throw new Error('Invalid published certificate image')
    const optional = (value: unknown) => typeof value === 'string' && value.trim() ? value : null
    return {
      slug: item.slug,
      standard: item.standard,
      title: item.title,
      certificateNumber: optional(item.certificate_number),
      issuingBody: optional(item.issuing_body),
      scope: optional(item.scope),
      validUntil: optional(item.valid_until),
      scanSrc: image?.url as string | undefined ?? null,
    }
  })
  if (!certificates.length) throw new Error('Published certificates are empty')
  return certificates
}
