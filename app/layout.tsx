import type { Metadata, Viewport } from 'next'
import { Archivo, IBM_Plex_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { JsonLd } from '@/components/site/json-ld'
import { company, organizationSchema } from '@/lib/site'
import './globals.css'

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
  title: {
    default:
      'Langtian | Thermoplastic Composite Sheets and Felts for Automotive Interiors',
    template: `%s | Langtian`,
  },
  description: `${company.legalNameEn} makes thermoplastic composite sheets and felts for automotive interiors in Xuyi County, Huai'an, Jiangsu, China. Send an inquiry for materials, specifications and samples.`,
  applicationName: 'Langtian',
  openGraph: {
    type: 'website',
    siteName: 'Langtian',
    title: 'Langtian | Thermoplastic Composite Sheets and Felts',
    description:
      'Thermoplastic composite sheets and felts for automotive interiors from Xuyi County, Huai’an, Jiangsu.',
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a
          href="#main"
          className="bg-primary text-primary-foreground sr-only z-[100] rounded-sm px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <JsonLd data={organizationSchema} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
