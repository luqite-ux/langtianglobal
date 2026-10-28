import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageIntro } from '@/components/site/page-intro'
import { Reveal } from '@/components/site/reveal'
import { Section } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { addressLine, company } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Jiangsu Langtian Composite Materials Co., Ltd. was established in 2021 in Xuyi County, Huai’an, Jiangsu and makes thermoplastic composite sheets and felts for automotive interiors.',
  alternates: { canonical: '/about' },
}

const facts = [
  { label: 'Established', value: String(company.founded) },
  { label: 'Location', value: 'Xuyi County, Huai’an, Jiangsu' },
  { label: 'Factory area', value: `Approx. ${company.facility.approxAreaSqm.toLocaleString('en-US')} m²` },
  { label: 'Workshops', value: String(company.facility.workshops) },
  { label: 'Production lines', value: String(company.facility.productionLines) },
]

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="About Langtian"
        title="A materials maker for automotive interiors"
        description="Jiangsu Langtian Composite Materials Co., Ltd. makes thermoplastic composite sheets and felts, supplied for automotive interior structures."
        crumbs={[{ label: 'About' }]}
      />

      <Section labelledBy="who-title">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 id="who-title" className="text-3xl font-bold tracking-tight">
              Who we are
            </h2>
            <div className="text-muted-foreground mt-5 space-y-4 leading-relaxed">
              <p>
                {company.legalNameEn} was established in{' '}
                {company.founded} in Xuyi County, Huai’an, Jiangsu, China.
              </p>
              <p>
                The company produces thermoplastic composite sheets, felts, sandwich panels
                and natural-fiber boards. Applications include automotive headliners, door
                panels, luggage-compartment liners, spare-tire covers and other interior
                structures, depending on the product.
              </p>
              <p>
                We work with buyers and engineers on specification: you describe the part,
                and we propose material families, then confirm figures and quantities in
                writing for the project.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/products">Browse products</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/manufacturing">See manufacturing</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="bg-secondary relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/factory/factory-exterior.jpg"
                alt="Exterior of the Langtian factory building in Xuyi County, with the Lang Tian sign on the upper corner of the facade"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="text-muted-foreground mt-3 text-xs">
              Langtian factory exterior in Xuyi County.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section tone="muted" labelledBy="facts-title">
        <Reveal>
          <h2 id="facts-title" className="text-3xl font-bold tracking-tight">
            Company facts
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            An overview of the company and its production site.
          </p>
        </Reveal>
        <Reveal delay={60}>
          <dl className="mt-8 grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-5">
            {facts.map((f) => (
              <div key={f.label} className="bg-card p-5">
                <dt className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  {f.label}
                </dt>
                <dd className="mt-2 text-lg font-bold">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={100}>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-semibold">Legal name</dt>
              <dd className="text-muted-foreground mt-1 text-sm">
                {company.legalNameEn}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold">Registered address</dt>
              <dd className="text-muted-foreground mt-1 text-sm">{addressLine}</dd>
            </div>
          </dl>
        </Reveal>
      </Section>

      <Section labelledBy="recognition-display-title">
        <Reveal>
          <h2 id="recognition-display-title" className="text-3xl font-bold tracking-tight">
            Recognition displayed at the factory
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Views of the recognition and certificate display at Langtian's site. Certificate
            details and dates are listed on the quality page.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {(['recognition-wall-01.jpg', 'recognition-wall-02.jpg'] as const).map((file, index) => (
            <Reveal key={file} delay={index * 80}>
              <figure>
                <Image
                  src={`/images/certificates/${file}`}
                  alt={`Recognition display at Langtian's factory, view ${index + 1}`}
                  width={720}
                  height={540}
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="h-auto w-full object-cover"
                />
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section labelledBy="next-title">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <h2 id="next-title" className="text-2xl font-bold">
              Have a part in development?
            </h2>
            <p className="text-muted-foreground mt-2">
              Send the application and target specification and we will reply with material
              families to compare.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/contact">Contact us</Link>
          </Button>
        </Reveal>
      </Section>
    </>
  )
}
