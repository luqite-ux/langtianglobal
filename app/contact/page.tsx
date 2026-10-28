import type { Metadata } from 'next'
import { InquiryForm } from '@/components/inquiry/inquiry-form'
import { PageIntro } from '@/components/site/page-intro'
import { Reveal } from '@/components/site/reveal'
import { Section } from '@/components/site/section'
import { getProducts } from '@/lib/data'
import { addressLine, company } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Send an inquiry to Jiangsu Langtian Composite Materials about thermoplastic composite sheets and felts for automotive interiors.',
  alternates: { canonical: '/contact' },
}

export default async function ContactPage() {
  const products = await getProducts()
  const { email, phone } = company.contact

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Send us your inquiry"
        description="Tell us the part, the material you are considering and the quantity or specification. Pricing, minimum order and samples are confirmed per inquiry."
        crumbs={[{ label: 'Contact' }]}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <Reveal className="bg-card border p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Inquiry form</h2>
            <div className="mt-6">
              <InquiryForm
                idPrefix="contact"
                productNames={products.map((p) => p.name)}
              />
            </div>
          </Reveal>

          <Reveal delay={80} as="div">
            <aside aria-labelledby="company-details-title" className="lg:sticky lg:top-24">
              <h2 id="company-details-title" className="text-2xl font-bold">
                Company details
              </h2>
              <dl className="mt-6 divide-y border-y">
                <div className="py-4">
                  <dt className="text-sm font-semibold">Company</dt>
                  <dd className="text-muted-foreground mt-1 text-sm">
                    {company.legalNameEn}
                    <br />
                    {company.legalNameZh}
                  </dd>
                </div>
                <div className="py-4">
                  <dt className="text-sm font-semibold">Address</dt>
                  <dd className="text-muted-foreground mt-1 text-sm">
                    <address className="not-italic">{addressLine}</address>
                  </dd>
                </div>
                {email && (
                  <div className="py-4">
                    <dt className="text-sm font-semibold">Email</dt>
                    <dd className="mt-1 text-sm">
                      <a className="text-primary underline underline-offset-2" href={`mailto:${email}`}>
                        {email}
                      </a>
                    </dd>
                  </div>
                )}
                {phone && (
                  <div className="py-4">
                    <dt className="text-sm font-semibold">Phone</dt>
                    <dd className="mt-1 text-sm">
                      <a className="text-primary underline underline-offset-2" href={`tel:${phone}`}>
                        {phone}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
              <h3 className="mt-8 text-base font-bold">Useful to include</h3>
              <ul className="text-muted-foreground mt-3 list-disc space-y-1.5 pl-5 text-sm">
                <li>The part and where it is used in the vehicle</li>
                <li>Material family or product you are considering</li>
                <li>Target thickness, areal weight and sheet or roll size</li>
                <li>Expected quantity and any sample needs</li>
              </ul>
            </aside>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
