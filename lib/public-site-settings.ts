import 'server-only'
import { cache } from 'react'
import { supabase, tenantId } from '@/lib/supabase'
import { addressLine, company } from '@/lib/site'

type Localized = Record<string, string> | null
type TenantSettings = {
  logo_url: string | null
  favicon_url: string | null
  contact_email: string | null
  contact_phone: string | null
  contact_address_i18n: Localized
  site_title_i18n: Localized
  site_tagline_i18n: Localized
  site_description_i18n: Localized
  seo_title_i18n: Localized
  seo_description_i18n: Localized
}

const fallback = {
  legalName: company.legalNameEn,
  brandName: company.brandName,
  logoUrl: '/images/brand/langtian-logo.jpg',
  faviconUrl: '/brand-icon.svg',
  email: company.contact.email,
  phone: company.contact.phone,
  address: addressLine,
  title: 'Langtian | Thermoplastic Composite Sheets and Felts',
  tagline: 'Thermoplastic composites for automotive interiors',
  description: `${company.legalNameEn} makes thermoplastic composite sheets and felts for automotive interiors in Xuyi County, Huai'an, Jiangsu, China.`,
  seoTitle: 'Langtian | Thermoplastic Composite Sheets and Felts',
  seoDescription: 'Thermoplastic composite sheets and felts for automotive interiors from Jiangsu Langtian Composite Materials Co., Ltd.',
}

const en = (value: Localized, otherwise: string) => value?.en?.trim() || otherwise
const imageUrl = (value: string | null, otherwise: string) => value?.startsWith('https://') ? value : otherwise

export const getPublicSiteSettings = cache(async () => {
  if (!supabase || !tenantId) return fallback
  const { data, error } = await supabase.from('tenants')
    .select('logo_url,favicon_url,contact_email,contact_phone,contact_address_i18n,site_title_i18n,site_tagline_i18n,site_description_i18n,seo_title_i18n,seo_description_i18n')
    .eq('id', tenantId).single<TenantSettings>()
  if (error || !data) throw new Error('Public site settings unavailable')
  return {
    ...fallback,
    logoUrl: imageUrl(data.logo_url, fallback.logoUrl),
    faviconUrl: imageUrl(data.favicon_url, fallback.faviconUrl),
    email: data.contact_email?.trim() || fallback.email,
    phone: data.contact_phone?.trim() || fallback.phone,
    address: en(data.contact_address_i18n, fallback.address),
    title: en(data.site_title_i18n, fallback.title),
    tagline: en(data.site_tagline_i18n, fallback.tagline),
    description: en(data.site_description_i18n, fallback.description),
    seoTitle: en(data.seo_title_i18n, fallback.seoTitle),
    seoDescription: en(data.seo_description_i18n, fallback.seoDescription),
  }
})

export type PublicSiteSettings = Awaited<ReturnType<typeof getPublicSiteSettings>>

export function publicOrganizationSchema(settings: PublicSiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://langtianglobal.com/#organization',
    name: settings.brandName,
    legalName: settings.legalName,
    url: 'https://langtianglobal.com/',
    logo: new URL(settings.logoUrl, 'https://langtianglobal.com').toString(),
    email: settings.email,
    telephone: settings.phone,
    foundingDate: String(company.founded),
    description: settings.description,
    address: { '@type': 'PostalAddress', streetAddress: settings.address },
  }
}
