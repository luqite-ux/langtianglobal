import type { MetadataRoute } from 'next'
import { getPublishedNews, getProducts } from '@/lib/data'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

const staticRoutes = [
  '',
  '/products',
  '/about',
  '/manufacturing',
  '/quality',
  '/applications',
  '/faq',
  '/news',
  '/contact',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, news] = await Promise.all([getProducts(), getPublishedNews()])
  return [
    ...staticRoutes.map((path) => ({ url: `${baseUrl}${path}` })),
    ...products.map((p) => ({ url: `${baseUrl}/products/${p.slug}` })),
    ...news.map((n) => ({ url: `${baseUrl}/news/${n.slug}` })),
  ]
}
