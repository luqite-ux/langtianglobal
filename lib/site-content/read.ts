import type { SiteSnapshot } from './transport'
import type { SiteModuleProps } from './render-page'

export function siteModule(snapshot: SiteSnapshot | null, pagePath: string, key: string): SiteModuleProps | undefined {
  const page = snapshot?.pages.find(item => item.path === pagePath)
  const module = page?.modules.find(item => item.key === key)
  return module ? { values: module.values, styles: module.styles, locale: snapshot!.locale } : undefined
}

export function cmsText(module: SiteModuleProps | undefined, key: string, fallback: string): string {
  const value = module?.values[key]
  if (typeof value === 'string') return value
  const copy = module?.values.copy
  if (Array.isArray(copy)) {
    const row = copy.find(item => item && typeof item === 'object' && !Array.isArray(item) && (item as Record<string, unknown>).id === key)
    if (!row || typeof (row as Record<string, unknown>).value !== 'string' || !(row as Record<string, string>).value.trim()) throw new Error(`Published copy missing: ${key}`)
    return (row as Record<string, string>).value
  }
  return fallback
}

export function cmsImage(module: SiteModuleProps | undefined, key: string, fallback: { src: string; alt: string }): { src: string; alt: string } {
  const value = module?.values[key]
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback
  const image = value as Record<string, unknown>
  return typeof image.url === 'string' && image.url.startsWith('https://') && typeof image.alt === 'string'
    ? { src: image.url, alt: image.alt } : fallback
}

export function cmsItems<T>(module: SiteModuleProps | undefined, key: string,
  fallback: readonly T[], parse: (item: Record<string, unknown>) => T | null): T[] {
  const value = module?.values[key]
  if (!Array.isArray(value)) return [...fallback]
  const items = value.map(item => item && typeof item === 'object' && !Array.isArray(item)
    ? parse(item as Record<string, unknown>) : null)
  return items.every((item): item is T => item !== null) ? items : [...fallback]
}
