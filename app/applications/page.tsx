import { cmsPageMetadata } from '@/lib/site-content/metadata'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CmsPageIntro } from '@/components/site/cms-page-intro'
import { Reveal } from '@/components/site/reveal'
import { Section } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { getProductsForApplication } from '@/lib/data'
import { getSiteApplications } from '@/lib/site-content/application-content'
import { getSiteContent } from '@/lib/site-content/site-content'
import { cmsText, siteModule } from '@/lib/site-content/read'

export async function generateMetadata() {
  return cmsPageMetadata('/applications', 'Applications', 'Automotive interior applications for Langtian materials: headliners, door panels, luggage-compartment liners, spare-tire covers and other interior structures.')
}

export default async function ApplicationsPage() {
  const [applications, snapshot] = await Promise.all([getSiteApplications(), getSiteContent('en')])
  const content = siteModule(snapshot, '/applications', 'application_entries')
  if (snapshot && !content) throw new Error('Published applications content is missing')
  const linked = await Promise.all(
    applications.map(async (a) => ({
      application: a,
      products: await getProductsForApplication(a.slug),
    })),
  )

  return (
    <>
      <CmsPageIntro path="/applications"
        eyebrow="Applications"
        title="Materials by automotive interior part"
        description="Explore materials by interior part. Suitability for your design is confirmed against your requirements."
        crumbs={[{ label: 'Applications' }]}
      />

      <Section>
        <ul className="space-y-6">
          {linked.map(({ application, products }, i) => (
            <Reveal as="li" key={application.slug} delay={60}>
              <article
                id={application.slug}
                className="bg-card scroll-mt-24 grid gap-0 border md:grid-cols-[1.4fr_1fr]"
              >
                <div className="p-6 sm:p-8">
                  <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">{application.name}</h2>
                  <p className="text-muted-foreground mt-3 leading-relaxed">
                    {application.detail}
                  </p>
                  <h3 className="mt-6 text-sm font-semibold">{cmsText(content, 'linked_heading', 'Linked products')}</h3>
                  {products.length > 0 ? (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {products.map((p) => (
                        <li key={p.slug}>
                          <Link
                            href={`/products/${p.slug}`}
                            className="hover:border-primary hover:text-primary inline-flex min-h-11 items-center gap-1.5 border px-3.5 text-sm font-medium transition-colors"
                          >
                            {p.name}
                            <ArrowRight aria-hidden="true" className="size-3.5" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground mt-2 text-sm">
                      {cmsText(content, 'empty_products', 'Describe your part in an inquiry and we will suggest materials.')}
                    </p>
                  )}
                </div>
                {application.image ? (
                  <figure className="bg-secondary flex flex-col">
                    <div className="relative min-h-64 flex-1">
                      <Image
                        src={application.image.src}
                        alt={application.image.alt}
                        fill
                        sizes="(min-width: 768px) 35vw, 100vw"
                        className="object-contain mix-blend-multiply"
                      />
                    </div>
                    <figcaption className="text-muted-foreground px-5 pb-4 text-xs">
                      {application.image.caption}
                    </figcaption>
                  </figure>
                ) : (
                  <div className="bg-secondary hidden md:block" aria-hidden="true" />
                )}
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-12 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <p className="text-muted-foreground max-w-xl">
            {cmsText(content, 'cta_prompt', 'Working on a part that is not listed? Describe it and we will discuss the suitable material options with you.')}
          </p>
          <Button asChild size="lg">
            <Link href="/contact">{cmsText(content, 'cta_label', 'Discuss your part')}</Link>
          </Button>
        </Reveal>
      </Section>
    </>
  )
}
