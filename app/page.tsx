import { ApplicationPaths } from '@/components/home/application-paths'
import { FinalContact } from '@/components/home/final-contact'
import { HeroCarousel } from '@/components/home/hero-carousel'
import { HomeFaq } from '@/components/home/home-faq'
import { ManufacturingEvidence } from '@/components/home/manufacturing-evidence'
import { MaterialDifferentiators } from '@/components/home/material-differentiators'
import { MaterialFamilies } from '@/components/home/material-families'
import { QualityContext } from '@/components/home/quality-context'
import { RepresentativeProducts } from '@/components/home/representative-products'
import { SamplingProcess } from '@/components/home/sampling-process'
import { getPublicSiteSettings } from '@/lib/public-site-settings'
import { heroSlides, type HeroSlide } from '@/lib/hero-slides'
import { getSiteContent, siteContentMetadata } from '@/lib/site-content/site-content'
import { siteModule } from '@/lib/site-content/read'

export async function generateMetadata() {
  const content = await siteContentMetadata('/', 'en')
  const title = content.title || 'Langtian | Thermoplastic Composite Sheets and Felts for Automotive Interiors'
  const description = content.description || 'Jiangsu Langtian Composite Materials Co., Ltd. makes thermoplastic composite sheets and felts for automotive interiors in Xuyi County, Huai’an, Jiangsu, China.'
  const image = 'https://langtianglobal.com/images/banners/banner-production-line.jpg'
  return {
    ...content,
    title: { absolute: title },
    alternates: { canonical: 'https://langtianglobal.com/' },
    openGraph: { type: 'website' as const, siteName: 'Langtian', title, description, url: 'https://langtianglobal.com/', images: [{ url: image }] },
    twitter: { card: 'summary_large_image' as const, title, description, images: [image] },
  }
}

function heroImage(value: unknown): { url: string; alt: string } | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const image = value as Record<string, unknown>
  return typeof image.url === 'string' && image.url.startsWith('https://') && typeof image.alt === 'string'
    ? { url: image.url, alt: image.alt } : null
}

function publishedSlides(value: unknown): HeroSlide[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > 3) throw new Error('Invalid published hero slides')
  return value.map((raw, index) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Invalid published hero slide')
    const item = raw as Record<string, unknown>
    const base = heroSlides.find(slide => slide.id === item.id) ?? heroSlides[index]
    const desktop = heroImage(item.desktop_image)
    const mobile = heroImage(item.mobile_image)
    const keys = ['eyebrow', 'title', 'body', 'primary_label', 'primary_href', 'secondary_label', 'secondary_href'] as const
    if (!base || !desktop || !mobile || keys.some(key => typeof item[key] !== 'string' || !item[key])) throw new Error('Incomplete published hero slide')
    return {
      ...base,
      id: typeof item.id === 'string' ? item.id : base.id,
      eyebrow: item.eyebrow as string,
      title: item.title as string,
      text: item.body as string,
      image: { ...base.image, src: desktop.url, alt: desktop.alt, mobileSrc: mobile.url, mobileAlt: mobile.alt },
      primary: { label: item.primary_label as string, href: item.primary_href as string },
      secondary: { label: item.secondary_label as string, href: item.secondary_href as string },
    }
  })
}

export default async function HomePage() {
  const [snapshot, settings] = await Promise.all([getSiteContent('en'), getPublicSiteSettings()])
  const homeModule = (key: string) => {
    const module = siteModule(snapshot, '/', key)
    if (snapshot && !module) throw new Error(`Published homepage module missing: ${key}`)
    return module
  }
  const heroCms = homeModule('hero')
  const slides = heroCms ? publishedSlides(heroCms.values.slides) : heroSlides
  return (
    <>
      <HeroCarousel slides={slides} styles={heroCms?.styles} contentVersion={snapshot?.version} />
      <MaterialFamilies content={homeModule('material_families')} />
      <RepresentativeProducts content={homeModule('representative_products')} />
      <ApplicationPaths content={homeModule('application_paths')} />
      <ManufacturingEvidence content={homeModule('manufacturing_evidence')} />
      <MaterialDifferentiators content={homeModule('material_differentiators')} />
      <QualityContext content={homeModule('quality_context')} />
      <SamplingProcess content={homeModule('sampling_process')} />
      <HomeFaq content={homeModule('home_faq')} />
      <FinalContact content={homeModule('final_contact')} settings={settings} />
    </>
  )
}
