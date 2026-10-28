import { localize, type Locale } from '@/lib/i18n'
import { applications } from './applications'
import { categories } from './categories'
import { certificates } from './certificates'
import { faqs } from './faqs'
import { news } from './news'
import { products } from './products'
import { liveCategories, liveNews, liveProducts } from '@/lib/db-data'
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
  return (await liveCategories(categories, locale)) ?? categories.map((c) => localize(c, locale))
}

export async function getCategory(slug: string, locale?: Locale) {
  return (await getCategories(locale)).find((c) => c.slug === slug)
}

export async function getProducts(
  options: { category?: CategorySlug; locale?: Locale } = {},
): Promise<Product[]> {
  const source = (await liveProducts(products, options.locale)) ?? products
  return source
    .filter((p) => p.status === 'published')
    .filter((p) => !options.category || p.categorySlug === options.category)
    .map((p) => localize(p, options.locale))
}

export async function getProduct(slug: string, locale?: Locale) {
  return (await getProducts({ locale })).find((p) => p.slug === slug)
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
  return ((await liveNews()) ?? news)
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
