import Link from 'next/link'
import { Logo } from '@/components/site/logo'
import { CopyrightYear } from '@/components/site/copyright-year'
import { getCategories } from '@/lib/data'
import { getPublicSiteSettings } from '@/lib/public-site-settings'
import { cmsItems, cmsText } from '@/lib/site-content/read'
import type { SiteModuleProps } from '@/lib/site-content/render-page'

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Manufacturing', href: '/manufacturing' },
  { label: 'Quality and certificates', href: '/quality' },
  { label: 'Applications', href: '/applications' },
  { label: 'News', href: '/news' },
  { label: 'FAQ', href: '/faq' },
]

export async function SiteFooter({ content }: { content?: SiteModuleProps }) {
  const [categories, settings] = await Promise.all([getCategories(), getPublicSiteSettings()])
  const buildYear = new Date().getFullYear()
  const links = content ? cmsItems(content, 'company_links', companyLinks, item =>
    typeof item.label === 'string' && typeof item.href === 'string' && /^\/[a-z0-9/-]*$/.test(item.href)
      ? { label: item.label, href: item.href } : null) : companyLinks
  if (content && links.length === 0) throw new Error('Published footer company links are missing')

  return (
    <footer className="on-dark bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" aria-label="Langtian, go to Home" className="inline-block">
            <Logo className="h-12" src={settings.logoUrl} />
          </Link>
          <p className="mt-5 text-sm font-medium">{settings.legalName}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            {cmsText(content, 'description', 'Thermoplastic composite sheets and felts for automotive interiors.')}
          </p>
        </div>

        <nav aria-label="Product categories">
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
            {cmsText(content, 'products_heading', 'Products')}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="text-white/75 hover:text-white hover:underline"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/products"
                className="text-white/75 hover:text-white hover:underline"
              >
                {cmsText(content, 'all_products_label', 'All products')}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
            {cmsText(content, 'company_heading', 'Company')}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-white/75 hover:text-white hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
            {cmsText(content, 'contact_heading', 'Contact')}
          </h2>
          <address className="mt-4 text-sm leading-relaxed text-white/75 not-italic">
            {settings.address}
          </address>
          <ul className="mt-3 space-y-1 text-sm text-white/75">
            {settings.email && (
              <li>
                <a
                  className="hover:text-white hover:underline"
                  href={`mailto:${settings.email}`}
                >
                  {settings.email}
                </a>
              </li>
            )}
            {settings.phone && <li>{settings.phone}</li>}
          </ul>
          <Link
            href="/contact"
            className="mt-5 inline-flex h-10 items-center border border-white/40 px-4 text-sm font-medium hover:bg-white hover:text-ink"
          >
            {cmsText(content, 'inquiry_label', 'Send an inquiry')}
          </Link>
        </div>
      </div>

      <div className="border-t border-white/15">
        <p className="mx-auto max-w-7xl px-5 py-5 text-xs text-white/70 sm:px-8">
          © <CopyrightYear fallbackYear={buildYear} /> {settings.legalName} All
          rights reserved.
        </p>
      </div>
    </footer>
  )
}
