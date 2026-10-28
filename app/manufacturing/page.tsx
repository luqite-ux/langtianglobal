import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageIntro } from '@/components/site/page-intro'
import { Reveal } from '@/components/site/reveal'
import { Section } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { company } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Manufacturing',
  description:
    'Langtian’s factory in Xuyi County: approximately 15,000 square meters, four workshops and five production lines, including three needling lines and two pressing lines.',
  alternates: { canonical: '/manufacturing' },
}

const f = company.facility

const stats = [
  { value: `~${f.approxAreaSqm.toLocaleString('en-US')} m²`, label: 'Approximate factory area' },
  { value: String(f.workshops), label: 'Workshops' },
  { value: String(f.productionLines), label: 'Production lines' },
  { value: String(f.needlingLines), label: 'Needling lines' },
  { value: String(f.pressingLines), label: 'Pressing lines' },
]

const photos = [
  {
    src: '/images/factory/factory-exterior.jpg',
    alt: 'Exterior of the Langtian factory building with dark corrugated cladding and tall windows',
    caption: 'Factory exterior in Xuyi County Economic Development Zone.',
  },
  {
    src: '/images/factory/fibre-processing-hall.jpg',
    alt: 'Interior of a production hall with fiber-processing machines and ducting under a steel roof',
    caption: 'Production hall with fiber-processing equipment and ducting.',
  },
]

export default function ManufacturingPage() {
  return (
    <>
      <PageIntro
        eyebrow="Manufacturing"
        title="Where the sheets and felts are made"
        description="Source materials identify an approximately 15,000-square-meter factory with four workshops and five production lines: three needling lines and two pressing lines."
        crumbs={[{ label: 'Manufacturing' }]}
      />

      <Section labelledBy="scale-title">
        <Reveal>
          <h2 id="scale-title" className="text-3xl font-bold tracking-tight">
            Facility at a glance
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            These are the figures stated in the supplied source materials. Output volumes,
            capacity and individual equipment specifications are not published here and are
            discussed per project.
          </p>
        </Reveal>
        <Reveal delay={60}>
          <dl className="mt-8 grid gap-px border bg-border sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((s) => (
              <div key={s.label} className="bg-card flex flex-col-reverse justify-end gap-1 p-6">
                <dt className="text-muted-foreground text-sm">{s.label}</dt>
                <dd className="text-primary text-3xl font-bold tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      <Section tone="muted" labelledBy="photos-title">
        <Reveal>
          <h2 id="photos-title" className="text-3xl font-bold tracking-tight">
            From the factory
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Supplied photographs of the site. More production photographs will be added as
            they are received.
          </p>
        </Reveal>
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {photos.map((p, i) => (
            <Reveal as="li" key={p.src} delay={i * 80}>
              <figure>
                <div className="bg-secondary relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="text-muted-foreground mt-3 text-sm">
                  {p.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section labelledBy="process-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <h2 id="process-title" className="text-3xl font-bold tracking-tight">
              Needling and pressing
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              The five production lines are split between two processes. Which process a
              given product passes through is confirmed per product during inquiry.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <dl className="divide-y border-y">
              <div className="py-5">
                <dt className="font-bold">Needling lines ({f.needlingLines})</dt>
                <dd className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  Needling is a general process in which barbed needles entangle fibers into
                  a coherent felt or non-woven web.
                </dd>
              </div>
              <div className="py-5">
                <dt className="font-bold">Pressing lines ({f.pressingLines})</dt>
                <dd className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  Pressing is a general process in which heat and pressure consolidate
                  material layers into a sheet or board.
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </Section>

      <Section tone="ink" labelledBy="mfg-cta-title">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <h2
            id="mfg-cta-title"
            className="max-w-xl text-2xl font-bold text-white sm:text-3xl"
          >
            Want to discuss a part, a material or a sample?
          </h2>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">Send an inquiry</Link>
          </Button>
        </Reveal>
      </Section>
    </>
  )
}
