export const company = {
  brandName: 'Langtian',
  legalNameEn: 'Jiangsu Langtian Composite Materials Co., Ltd.',
  founded: 2021,
  address: {
    street: 'Xinhai Avenue 52-8, Xuyi County Economic Development Zone',
    city: "Huai'an",
    region: 'Jiangsu',
    country: 'China',
  },
  contact: {
    email: 'info@langtianglobal.com',
    phone: '17301537592',
  },
  /** Facts taken from the supplied source materials. Do not extrapolate beyond these. */
  facility: {
    siteAreaMu: 40,
    approxAreaSqm: 15000,
    reportedAnnualBoardOutputTonnes: 8000,
    workshops: 4,
    productionLines: 5,
    needlingLines: 3,
    pressingLines: 2,
  },
} as const

export const addressLine = `${company.address.street}, ${company.address.city}, ${company.address.region}, ${company.address.country}`

export const primaryNav = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Applications', href: '/applications' },
  { label: 'Manufacturing', href: '/manufacturing' },
  { label: 'Quality', href: '/quality' },
  { label: 'About', href: '/about' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
] as const

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.brandName,
  legalName: company.legalNameEn,
  foundingDate: String(company.founded),
  description:
    'Maker of thermoplastic composite sheets and felts for automotive interiors.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: company.address.street,
    addressLocality: company.address.city,
    addressRegion: company.address.region,
    addressCountry: 'CN',
  },
}
