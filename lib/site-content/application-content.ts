import 'server-only'
import { getApplications } from '@/lib/data'
import type { Application } from '@/lib/data/types'
import { getSiteContent } from './site-content'
import { siteModule } from './read'

export async function getSiteApplications(): Promise<Application[]> {
  const snapshot = await getSiteContent('en')
  if (!snapshot) return getApplications()
  const module = siteModule(snapshot, '/applications', 'application_entries')
  if (!module || !Array.isArray(module.values.items)) throw new Error('Published applications are missing')
  const slugs = new Set<string>()
  const items = module.values.items.map(raw => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Invalid published application')
    const item = raw as Record<string, unknown>
    if (typeof item.slug !== 'string' || !/^[a-z0-9-]{2,80}$/.test(item.slug) || slugs.has(item.slug)
      || typeof item.name !== 'string' || !item.name || typeof item.summary !== 'string' || !item.summary
      || typeof item.detail !== 'string' || !item.detail) throw new Error('Incomplete published application')
    slugs.add(item.slug)
    let image: Application['image']
    if (item.image && typeof item.image === 'object' && !Array.isArray(item.image)) {
      const value = item.image as Record<string, unknown>
      if (typeof value.url !== 'string' || !value.url.startsWith('https://') || typeof value.alt !== 'string' || typeof item.caption !== 'string') throw new Error('Invalid published application image')
      image = { src: value.url, alt: value.alt, caption: item.caption }
    }
    return { slug: item.slug as Application['slug'], name: item.name, summary: item.summary, detail: item.detail, ...(image ? { image } : {}) }
  })
  if (!items.length) throw new Error('Published applications are empty')
  return items
}
