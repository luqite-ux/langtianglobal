import type { Metadata, Viewport } from 'next'
import { Archivo, IBM_Plex_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { cookies } from 'next/headers'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { JsonLd } from '@/components/site/json-ld'
import { company, organizationSchema } from '@/lib/site'
import { getSiteContent } from '@/lib/site-content/site-content'
import { siteModule } from '@/lib/site-content/read'
import './globals.css'

export const revalidate = 60

const display = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

const body = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://langtianglobal.com'),
  title: {
    default:
      'Langtian | Thermoplastic Composite Sheets and Felts for Automotive Interiors',
    template: `%s | Langtian`,
  },
  description: `${company.legalNameEn} makes thermoplastic composite sheets and felts for automotive interiors in Xuyi County, Huai'an, Jiangsu, China. Send an inquiry for materials, specifications and samples.`,
  alternates: { canonical: '/' },
  applicationName: 'Langtian',
  openGraph: {
    type: 'website',
    siteName: 'Langtian',
    title: 'Langtian | Thermoplastic Composite Sheets and Felts',
    description:
      'Thermoplastic composite sheets and felts for automotive interiors from Xuyi County, Huai’an, Jiangsu.',
    url: 'https://langtianglobal.com/',
    images: [{ url: 'https://langtianglobal.com/images/banners/banner-production-line.jpg' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const preview = (await cookies()).has('__Host-hq-site-preview')
  const snapshot = await getSiteContent('en')
  const navigation = siteModule(snapshot, '/', 'navigation')
  const footer = siteModule(snapshot, '/', 'footer')
  if (snapshot && !navigation) throw new Error('Published navigation is missing')
  if (snapshot && !footer) throw new Error('Published footer is missing')
  const navigationItems = navigation?.values.items
  const items = Array.isArray(navigationItems) ? navigationItems.map((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error('Invalid published navigation')
    const value = item as Record<string, unknown>
    if (typeof value.label !== 'string' || !value.label || typeof value.href !== 'string' || !/^\/[a-z0-9/-]*$/.test(value.href)) throw new Error('Invalid published navigation item')
    return { label: value.label, href: value.href }
  }) : undefined
  if (navigation && (!items?.length || typeof navigation.values.cta_label !== 'string' || typeof navigation.values.cta_href !== 'string')) throw new Error('Incomplete published navigation')
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a
          href="#main"
          className="bg-primary text-primary-foreground sr-only z-[100] rounded-sm px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to main content
        </a>
        <SiteHeader items={items} quoteLabel={navigation?.values.cta_label as string | undefined} quoteHref={navigation?.values.cta_href as string | undefined} styles={navigation?.styles} />
        {preview && (
          <div className="bg-amber-50 px-4 py-3 text-sm text-amber-950" role="status">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <span>Preview — unpublished changes</span>
              <form action="/api/site-content/exit-preview" method="post">
                <button type="submit" className="font-semibold underline underline-offset-2">Exit preview</button>
              </form>
            </div>
          </div>
        )}
        <main id="main">{children}</main>
        <SiteFooter content={footer} />
        <JsonLd data={organizationSchema} />
        {process.env.NODE_ENV === 'production' && !preview && <Analytics />}
      </body>
    </html>
  )
}
