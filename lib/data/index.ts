import { localize, type Locale } from '@/lib/i18n'
import { applications } from './applications'
import { categories } from './categories'
import { certificates } from './certificates'
import { faqs } from './faqs'
import { news } from './news'
import { products } from './products'
import type {
  Application,
  ApplicationSlug,
  CategorySlug,
  FaqItem,
  NewsArticle,
  Product,
  ProductCategory,
} from './types'

/**
 * Async accessors keep the call sites identical when the sample arrays are
 * replaced by tenant-scoped queries.
 */
export async function getCategories(locale?: Locale): Promise<ProductCategory[]> {
  return categories.map((c) => localize(c, locale))
}

export async function getCategory(slug: string, locale?: Locale) {
  const found = categories.find((c) => c.slug === slug)
  return found ? localize(found, locale) : undefined
}

export async function getProducts(
  options: { category?: CategorySlug; locale?: Locale } = {},
): Promise<Product[]> {
  return products
    .filter((p) => p.status === 'published')
    .filter((p) => !options.category || p.categorySlug === options.category)
    .map((p) => localize(p, options.locale))
}

export async function getProduct(slug: string, locale?: Locale) {
  const found = products.find((p) => p.slug === slug && p.status === 'published')
  return found ? localize(found, locale) : undefined
}

export async function getProductsForApplication(slug: ApplicationSlug) {
  return (await getProducts()).filter((p) => p.applicationSlugs.includes(slug))
}

export async function getApplications(locale?: Locale): Promise<Application[]> {
  return applications.map((a) => localize(a, locale))
}

export async function getCertificates() {
  return certificates
}

export async function getFaqs(locale?: Locale): Promise<FaqItem[]> {
  return faqs.map((f) => localize(f, locale))
}

export async function getPublishedNews(): Promise<NewsArticle[]> {
  return news
    .filter((n) => n.status === 'published')
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export async function getNewsArticle(slug: string) {
  return (await getPublishedNews()).find((n) => n.slug === slug)
}

export function isCategorySlug(value: string | undefined): value is CategorySlug {
  return categories.some((c) => c.slug === value)
}

export { categories, applications }
