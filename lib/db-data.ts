import 'server-only'
import { supabase, tenantId } from './supabase'
import type { NewsArticle, Product, ProductCategory } from './data/types'
import type { Locale } from './i18n'
import sanitizeHtml from 'sanitize-html'

type I18n<T> = Record<string, T> | null
function value<T>(translations: I18n<T>, locale: Locale | undefined, fallback: T): T {
  if (!translations) return fallback
  const chosen = translations[locale || 'en'] ?? translations.en ?? Object.values(translations).find(Boolean)
  return chosen ?? fallback
}

export async function liveCategories(locale?: Locale): Promise<ProductCategory[] | null> {
  if (!supabase || !tenantId) return null
  const { data, error } = await supabase.from('product_categories')
    .select('slug,name,name_i18n,description,description_i18n,icon')
    .eq('tenant_id', tenantId).eq('is_active', true).order('sort_order')
  if (error) { console.error('Category query failed', error.code); return null }
  return data.map(row => {
    return {
      slug: row.slug as ProductCategory['slug'],
      name: value(row.name_i18n, locale, row.name || ''),
      summary: value(row.description_i18n, locale, row.description || ''),
      image: { src: row.icon || '', alt: row.name },
    }
  })
}

export async function liveProducts(locale?: Locale): Promise<Product[] | null> {
  if (!supabase || !tenantId) return null
  const { data, error } = await supabase.from('products')
    .select('slug,name,name_i18n,description,description_i18n,overview_i18n,category_slug,features_i18n,applications_i18n,advantages_i18n,specs,image_url,extra_data')
    .eq('tenant_id', tenantId).eq('is_active', true).order('sort_order')
  if (error) { console.error('Product query failed', error.code); return null }
  return data.map(row => {
    const extra = row.extra_data || {}
    const images = Array.isArray(extra.images) && extra.images.length
      ? extra.images.filter((url: unknown) => typeof url === 'string').map((src: string, index: number) => ({
          src, alt: `${row.name} product photo ${index + 1}`, kind: index === 0 ? 'full' as const : 'detail' as const,
        }))
      : row.image_url ? [{ src: row.image_url, alt: `${row.name} product photo`, kind: 'full' as const }] : []
    return {
      slug: row.slug,
      sku: typeof extra.source_sku === 'string' ? extra.source_sku : undefined,
      name: value(row.name_i18n, locale, row.name || ''),
      categorySlug: row.category_slug as Product['categorySlug'],
      form: extra.product_form || '',
      summary: value(row.description_i18n, locale, row.description || ''),
      description: String(value(row.overview_i18n, locale, '')).split(/\n\n+/).filter(Boolean),
      highlights: value(row.features_i18n, locale, []),
      applicationSlugs: value(row.applications_i18n, locale, []),
      specs: Array.isArray(row.specs) ? row.specs : [],
      moq: extra.moq || { value: null, unit: null },
      images,
      relatedSlugs: Array.isArray(extra.related_slugs) ? extra.related_slugs : [],
      status: 'published' as const,
    }
  })
}

export async function liveNews(locale?: Locale): Promise<NewsArticle[] | null> {
  if (!supabase || !tenantId) return null
  const { data, error } = await supabase.from('articles')
    .select('slug,title,title_i18n,excerpt,excerpt_i18n,content,content_i18n,featured_image,published_at')
    .eq('tenant_id', tenantId).eq('is_published', true).order('published_at', { ascending: false })
  if (error) { console.error('Article query failed', error.code); return null }
  return data.map(row => ({
    slug: row.slug,
    title: value(row.title_i18n, locale, row.title || ''),
    excerpt: value(row.excerpt_i18n, locale, row.excerpt || ''),
    body: [],
    bodyHtml: sanitizeHtml(String(value(row.content_i18n, locale, row.content || '')), {
      allowedTags: ['p', 'h2', 'h3', 'h4', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'blockquote', 'br'],
      allowedAttributes: { a: ['href', 'title'] },
      allowedSchemes: ['http', 'https', 'mailto'],
    }),
    publishedAt: row.published_at || new Date(0).toISOString(),
    image: row.featured_image ? { src: row.featured_image, alt: row.title || '' } : undefined,
    status: 'published' as const,
  }))
}
