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

const photoGroups = [
  {
    title: 'Factory site',
    description: 'Exterior views of the Xuyi County facility.',
    images: [
      ['factory-building-row.jpg', 'Factory buildings and the front yard'],
      ['factory-entrance.jpg', 'Entrance to the factory building'],
      ['factory-front.jpg', 'Front of the factory site'],
    ],
  },
  {
    title: 'Production equipment',
    description: 'Equipment and processing lines inside the workshops.',
    images: [
      ['production-hall-01.jpg', 'Production equipment in the workshop'],
      ['pressing-line-01.jpg', 'Large pressing equipment'],
      ['pressing-machine-01.jpg', 'Sheet processing machine'],
      ['needling-line-01.jpg', 'Fiber-processing line'],
      ['sheet-line-01.jpg', 'Sheet production line'],
      ['pressing-line-02.jpg', 'Pressing equipment seen from the front'],
      ['production-hall-02.jpg', 'Workshop equipment and production floor'],
      ['pressing-line-03.jpg', 'Pressing equipment in the workshop'],
      ['processing-line-01.jpg', 'Long processing line'],
      ['fiber-processing-machine.jpg', 'Fiber-processing machine and ducting'],
      ['processing-line-02.jpg', 'Processing line inside the workshop'],
    ],
  },
  {
    title: 'Workshop and materials',
    description: 'Production floor, material rolls and storage areas.',
    images: [
      ['material-rolls.jpg', 'Material rolls in a workshop'],
      ['workshop-floor-01.jpg', 'Open workshop floor'],
      ['workshop-floor-02.jpg', 'Equipment in a production hall'],
      ['workshop-wide.jpg', 'Wide view across the workshop'],
      ['materials-storage-01.jpg', 'Materials stored inside the workshop'],
      ['materials-storage-02.jpg', 'Bagged materials in storage'],
    ],
  },
] as const

export default function ManufacturingPage() {
  return (
    <>
      <PageIntro
        eyebrow="Manufacturing"
        title="Where the sheets and felts are made"
        description="An approximately 15,000-square-meter factory with four workshops and five production lines: three needling lines and two pressing lines."
        crumbs={[{ label: 'Manufacturing' }]}
      />

      <Section labelledBy="scale-title">
        <Reveal>
          <h2 id="scale-title" className="text-3xl font-bold tracking-tight">
            Facility at a glance
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Share your required material, format and volume so we can discuss suitable
            production options for your project.
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
            Explore the site, equipment and material-handling areas.
          </p>
        </Reveal>
        <div className="mt-10 space-y-14">
          {photoGroups.map((group) => (
            <div key={group.title}>
              <Reveal>
                <h3 className="text-xl font-bold">{group.title}</h3>
                <p className="text-muted-foreground mt-1 text-sm">{group.description}</p>
              </Reveal>
              <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.images.map(([file, caption], i) => (
                  <Reveal as="li" key={file} delay={(i % 3) * 60}>
                    <figure>
                      <div className="relative aspect-[4/3] overflow-hidden bg-white">
                        <Image
                          src={`/images/factory/${file}`}
                          alt={caption}
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                      <figcaption className="text-muted-foreground mt-2 text-sm">{caption}</figcaption>
                    </figure>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
