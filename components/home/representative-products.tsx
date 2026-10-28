import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/products/product-card'
import { Reveal } from '@/components/site/reveal'
import { Section, SectionHeading } from '@/components/site/section'
import { getCategories, getProducts } from '@/lib/data'

const featuredSlugs = [
  'lwrtud-felt-sheet',
  'pet-non-woven-pile-carpet',
  'phc-fiberglass-composite-panel',
  'pp-bamboo-hemp-fiberboard',
]

export async function RepresentativeProducts() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()])
  const featured = featuredSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <Section tone="muted" labelledBy="products-title">
      <SectionHeading
        id="products-title"
        eyebrow="Representative products"
        title="See what the materials look like"
        description="A selection of product pages. Each page lists its own specification fields and minimum order quantity, confirmed when you inquire."
      >
        <Link
          href="/products"
          className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
        >
          All products
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </SectionHeading>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((product, i) => (
          <Reveal as="li" key={product.slug} delay={i * 70}>
            <ProductCard
              product={product}
              category={categories.find((c) => c.slug === product.categorySlug)}
            />
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
