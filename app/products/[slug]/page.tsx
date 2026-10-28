import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { InquiryForm } from '@/components/inquiry/inquiry-form'
import { ProductCard } from '@/components/products/product-card'
import { ProductVisual } from '@/components/products/product-visual'
import { JsonLd } from '@/components/site/json-ld'
import { PageIntro } from '@/components/site/page-intro'
import { Reveal } from '@/components/site/reveal'
import { Eyebrow, Section } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import {
  applications,
  getCategory,
  getProduct,
  getProducts,
} from '@/lib/data'
import { company } from '@/lib/site'

type Params = Promise<{ slug: string }>

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await getProduct((await params).slug)
  if (!product) return { title: 'Product not found' }
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/products/${product.slug}` },
  }
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const [category, all] = await Promise.all([getCategory(product.categorySlug), getProducts()])
  const related = product.relatedSlugs
    .map((s) => all.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
  const linkedApplications = applications.filter((a) =>
    product.applicationSlugs.includes(a.slug),
  )
  const [primary, ...extra] = product.images

  const moqText =
    product.moq.value !== null && product.moq.unit
      ? `${product.moq.value.toLocaleString('en-US')} ${product.moq.unit}`
      : 'Confirmed on inquiry'

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.summary,
          category: category?.name,
          brand: { '@type': 'Brand', name: company.brandName },
          manufacturer: { '@type': 'Organization', name: company.legalNameEn },
          ...(primary ? { image: primary.src } : {}),
        }}
      />
      <PageIntro
        eyebrow={category?.name ?? 'Product'}
        title={product.name}
        description={product.summary}
        crumbs={[
          { label: 'Products', href: '/products' },
          ...(category
            ? [{ label: category.name, href: `/products?category=${category.slug}` }]
            : []),
          { label: product.name },
        ]}
      >
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href="#inquiry">Inquire about this product</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/products">All products</Link>
          </Button>
        </div>
      </PageIntro>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <ProductVisual
              image={primary}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="border"
            />
            {extra.length > 0 && (
              <div className="mt-4 columns-2 gap-4">
                {extra.map((img) => (
                  <ProductVisual
                    key={img.src}
                    image={img}
                    sizes="(min-width: 1024px) 22vw, 50vw"
                    className="mb-4 break-inside-avoid border"
                  />
                ))}
              </div>
            )}
            <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
              Representative photograph. Appearance, color and surface are confirmed per
              inquiry.
            </p>
          </Reveal>

          <div className="space-y-12">
            <Reveal>
              <h2 className="text-2xl font-bold">About this material</h2>
              <div className="text-muted-foreground mt-4 space-y-4 leading-relaxed">
                {product.description.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {product.highlights.map((h) => (
                  <li key={h} className="flex gap-3 border-l-2 border-primary bg-secondary px-4 py-3 text-sm font-medium">
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="text-2xl font-bold">Specification</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Fields below belong to this product only. Figures are confirmed on inquiry
                against the current technical data.
              </p>
              <dl className="mt-5 border-t">
                <div className="grid gap-1 border-b py-3.5 sm:grid-cols-[minmax(0,12rem)_1fr] sm:gap-6">
                  <dt className="text-sm font-semibold">Form</dt>
                  <dd className="text-muted-foreground text-sm">{product.form}</dd>
                </div>
                {product.specs.map((spec) => (
                  <div
                    key={spec.key}
                    className="grid gap-1 border-b py-3.5 sm:grid-cols-[minmax(0,12rem)_1fr] sm:gap-6"
                  >
                    <dt className="text-sm font-semibold">
                      {spec.label}
                      {spec.unit ? (
                        <span className="text-muted-foreground font-normal"> ({spec.unit})</span>
                      ) : null}
                    </dt>
                    <dd className="text-muted-foreground text-sm">
                      {spec.value ?? 'Confirmed on inquiry'}
                      {spec.note ? (
                        <span className="mt-1 block text-xs">{spec.note}</span>
                      ) : null}
                    </dd>
                  </div>
                ))}
                <div className="grid gap-1 border-b py-3.5 sm:grid-cols-[minmax(0,12rem)_1fr] sm:gap-6">
                  <dt className="text-sm font-semibold">Minimum order quantity</dt>
                  <dd className="text-muted-foreground text-sm">
                    {moqText}
                    {product.moq.note ? (
                      <span className="mt-1 block text-xs">{product.moq.note}</span>
                    ) : null}
                  </dd>
                </div>
              </dl>
              {product.notes?.map((note) => (
                <p key={note} className="text-muted-foreground mt-4 text-sm leading-relaxed">
                  {note}
                </p>
              ))}
            </Reveal>

            {linkedApplications.length > 0 && (
              <Reveal>
                <h2 className="text-2xl font-bold">Considered for these parts</h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {linkedApplications.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/applications#${a.slug}`}
                        className="bg-card hover:border-primary hover:text-primary inline-flex min-h-11 items-center border px-4 text-sm font-semibold transition-colors"
                      >
                        {a.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground mt-3 text-sm">
                  Suitability for a specific part is confirmed against your requirements.
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </Section>

      <Section id="inquiry" tone="muted" labelledBy="product-inquiry-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <Reveal>
            <Eyebrow>Product inquiry</Eyebrow>
            <h2 id="product-inquiry-title" className="mt-3 text-3xl font-bold tracking-tight">
              Ask about {product.name}
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Tell us the part, target thickness or weight, and expected quantity. Pricing,
              minimum order and sample availability are confirmed for each inquiry.
            </p>
          </Reveal>
          <Reveal delay={80} className="bg-card border p-6 sm:p-8">
            <InquiryForm
              idPrefix={`product-${product.slug}`}
              productNames={all.map((p) => p.name)}
              defaultContext={`Product: ${product.name}`}
              submitLabel="Send product inquiry"
            />
          </Reveal>
        </div>
      </Section>

      {related.length > 0 && (
        <Section labelledBy="related-title">
          <Reveal>
            <h2 id="related-title" className="mb-8 text-2xl font-bold">
              Related materials
            </h2>
          </Reveal>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </ul>
        </Section>
      )}
    </>
  )
}
