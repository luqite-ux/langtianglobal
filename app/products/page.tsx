import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductCard } from '@/components/products/product-card'
import { PageIntro } from '@/components/site/page-intro'
import { Reveal } from '@/components/site/reveal'
import { Section } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { getCategories, getCategory, getProducts, isCategorySlug } from '@/lib/data'
import { cn } from '@/lib/utils'

type SearchParams = Promise<{ category?: string | string[] }>

function readCategory(value: string | string[] | undefined) {
  const first = Array.isArray(value) ? value[0] : value
  return isCategorySlug(first) ? first : undefined
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  const slug = readCategory((await searchParams).category)
  const category = slug ? await getCategory(slug) : undefined
  return {
    title: category ? category.name : 'Products',
    description: category
      ? category.summary
      : 'Thermoplastic composite sheets, felts, sandwich panels and natural-fiber boards for automotive interiors.',
    alternates: { canonical: category ? `/products?category=${category.slug}` : '/products' },
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const activeSlug = readCategory((await searchParams).category)
  const [categories, allProducts] = await Promise.all([getCategories(), getProducts()])
  const products = activeSlug
    ? allProducts.filter((p) => p.categorySlug === activeSlug)
    : allProducts
  const active = categories.find((c) => c.slug === activeSlug)

  const counts = new Map(
    categories.map((c) => [c.slug, allProducts.filter((p) => p.categorySlug === c.slug).length]),
  )

  const filters = [
    { slug: undefined, label: 'All materials', href: '/products', count: allProducts.length },
    ...categories.map((c) => ({
      slug: c.slug as string | undefined,
      label: c.name,
      href: `/products?category=${c.slug}`,
      count: counts.get(c.slug) ?? 0,
    })),
  ]

  return (
    <>
      <PageIntro
        eyebrow="Products"
        title={active ? active.name : 'Thermoplastic composite sheets and felts'}
        description={
          active
            ? active.summary
            : 'Browse by material family. Specification fields and minimum order quantity are recorded per product and confirmed when you inquire.'
        }
        crumbs={[
          { label: 'Products', href: active ? '/products' : undefined },
          ...(active ? [{ label: active.name }] : []),
        ]}
      />
      <Section>
        <nav aria-label="Product categories" className="mb-10">
          <ul className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const isActive = f.slug === activeSlug
              return (
                <li key={f.label}>
                  <Link
                    href={f.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'inline-flex min-h-11 items-center gap-2 border px-4 text-sm font-semibold transition-colors',
                      isActive
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'bg-card hover:border-primary hover:text-primary',
                    )}
                  >
                    {f.label}
                    <span
                      className={cn(
                        'text-xs font-medium tabular-nums',
                        isActive ? 'text-primary-foreground/85' : 'text-muted-foreground',
                      )}
                    >
                      {f.count}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <h2 className="sr-only">
          {active ? `${active.name} products` : 'All products'}
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, i) => (
            <Reveal as="li" key={product.slug} delay={(i % 4) * 70}>
              <ProductCard
                product={product}
                category={categories.find((c) => c.slug === product.categorySlug)}
                priority={i < 4}
              />
            </Reveal>
          ))}
        </ul>

        <Reveal className="bg-secondary mt-14 flex flex-col items-start justify-between gap-5 border p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-xl">
            <h2 className="text-xl font-bold">Not sure which material fits your part?</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              The products shown are the rows currently listed on this site, not the complete
              range. Describe the part and we will point to materials to compare.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/contact">Send an inquiry</Link>
          </Button>
        </Reveal>
      </Section>
    </>
  )
}
