import type { Translations } from '@/lib/i18n'

export type CategorySlug = 'sheet' | 'felt' | 'sandwich' | 'natural-fiber'

export type ApplicationSlug =
  | 'headliners'
  | 'door-panels'
  | 'luggage-compartment-liners'
  | 'spare-tire-covers'
  | 'other-interior-structures'

export type ProductCategory = {
  slug: CategorySlug
  name: string
  summary: string
  image: { src: string; alt: string }
  translations?: Translations<Pick<ProductCategory, 'name' | 'summary'>>
}

/** One specification field. `value: null` means the figure is confirmed on inquiry. */
export type SpecField = {
  key: string
  label: string
  unit?: string
  value: string | null
  note?: string
}

export type ProductImage = {
  src: string
  alt: string
  kind: 'full' | 'detail'
}

export type Product = {
  slug: string
  name: string
  categorySlug: CategorySlug
  form: string
  summary: string
  description: string[]
  highlights: string[]
  applicationSlugs: ApplicationSlug[]
  specs: SpecField[]
  /** Each product carries its own MOQ. `null` means it is quoted on inquiry. */
  moq: { value: number | null; unit: string | null; note?: string }
  images: ProductImage[]
  relatedSlugs: string[]
  notes?: string[]
  status: 'published' | 'draft'
  translations?: Translations<
    Pick<Product, 'name' | 'summary' | 'description' | 'highlights' | 'notes'>
  >
}

export type Application = {
  slug: ApplicationSlug
  name: string
  summary: string
  detail: string
  image?: { src: string; alt: string; caption: string }
  translations?: Translations<Pick<Application, 'name' | 'summary' | 'detail'>>
}

export type Certificate = {
  slug: string
  standard: string
  title: string
  /** Editable fields. Leave null until each value is checked against the scan. */
  certificateNumber: string | null
  issuingBody: string | null
  scope: string | null
  validUntil: string | null
  scanSrc: string | null
}

export type FaqItem = {
  id: string
  question: string
  answer: string
  topic: 'products' | 'inquiry' | 'quality' | 'company'
  translations?: Translations<Pick<FaqItem, 'question' | 'answer'>>
}

export type NewsArticle = {
  slug: string
  title: string
  excerpt: string
  body: string[]
  publishedAt: string
  image?: { src: string; alt: string }
  status: 'published' | 'draft'
}
