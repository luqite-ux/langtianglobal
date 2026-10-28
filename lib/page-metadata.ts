import type { Metadata } from 'next'

const siteUrl = 'https://langtianglobal.com'
const fallbackImage = '/images/banners/banner-production-line.jpg'

export function pageMetadata({
  title,
  description,
  path,
  image = fallbackImage,
  type = 'website',
}: {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
}): Metadata {
  const url = new URL(path, siteUrl).href
  const imageUrl = new URL(image, siteUrl).href
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      siteName: 'Langtian',
      title: `${title} | Langtian`,
      description,
      url,
      images: [{ url: imageUrl }],
    },
    twitter: { card: 'summary_large_image', title: `${title} | Langtian`, description, images: [imageUrl] },
  }
}
