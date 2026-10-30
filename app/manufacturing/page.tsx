import { cmsPageMetadata } from '@/lib/site-content/metadata'
import Image from 'next/image'
import Link from 'next/link'
import { CmsPageIntro } from '@/components/site/cms-page-intro'
import { Reveal } from '@/components/site/reveal'
import { Section } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { company } from '@/lib/site'
import { getSiteContent } from '@/lib/site-content/site-content'
import { cmsItems, cmsText, siteModule } from '@/lib/site-content/read'

export async function generateMetadata() {
  return cmsPageMetadata('/manufacturing', 'Manufacturing', 'Langtian’s factory in Xuyi County: approximately 15,000 square meters, four workshops and five production lines, including three needling lines and two pressing lines.')
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

export default async function ManufacturingPage() {
  const snapshot = await getSiteContent('en')
  const content = siteModule(snapshot, '/manufacturing', 'facility_content')
  if (snapshot && !content) throw new Error('Published manufacturing content is missing')
  const visibleStats = content ? cmsItems(content, 'stats', stats, item =>
    typeof item.label === 'string' && typeof item.value === 'string' ? { label: item.label, value: item.value } : null) : stats
  if (content && visibleStats.length === 0) throw new Error('Published manufacturing statistics are missing')
  const visibleGroups = content ? (() => {
    const raw = content.values.photo_groups
    if (!Array.isArray(raw) || raw.length === 0) throw new Error('Published factory photos are missing')
    return raw.map(group => {
      if (!group || typeof group !== 'object' || Array.isArray(group)) throw new Error('Invalid factory photo group')
      const item = group as Record<string, unknown>
      if (typeof item.title !== 'string' || typeof item.description !== 'string' || !Array.isArray(item.images)) throw new Error('Invalid factory photo group')
      const images = item.images.map(entry => {
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) throw new Error('Invalid factory photo')
        const row = entry as Record<string, unknown>
        const image = row.image
        const imageValue = image && typeof image === 'object' && !Array.isArray(image) ? image as Record<string, unknown> : null
        if (!imageValue || typeof imageValue.url !== 'string'
          || !imageValue.url.startsWith('https://') || typeof imageValue.alt !== 'string'
          || typeof row.caption !== 'string') throw new Error('Invalid factory photo')
        return { src: imageValue.url, alt: imageValue.alt, caption: row.caption }
      })
      return { title: item.title, description: item.description, images }
    })
  })() : photoGroups.map(group => ({ ...group, images: group.images.map(([file, caption]) => ({ src: `/images/factory/${file}`, alt: caption, caption })) }))
  return (
    <>
      <CmsPageIntro path="/manufacturing"
        eyebrow="Manufacturing"
        title="Where the sheets and felts are made"
        description="An approximately 15,000-square-meter factory with four workshops and five production lines: three needling lines and two pressing lines."
        crumbs={[{ label: 'Manufacturing' }]}
      />

      <Section labelledBy="scale-title">
        <Reveal>
          <h2 id="scale-title" className="text-3xl font-bold tracking-tight">
            {cmsText(content, 'scale_title', 'Facility at a glance')}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            {cmsText(content, 'scale_intro', 'Share your required material, format and volume so we can discuss suitable production options for your project.')}
          </p>
        </Reveal>
        <dl className="mt-8 grid gap-px border bg-border sm:grid-cols-3 lg:grid-cols-5">
            {visibleStats.map((s, i) => (
              <Reveal as="div" key={s.label} delay={Math.min(i * 60, 240)} className="bg-card flex flex-col-reverse justify-end gap-1 p-6">
                <dt className="text-muted-foreground text-sm">{s.label}</dt>
                <dd className="text-primary text-3xl font-bold tabular-nums">{s.value}</dd>
              </Reveal>
            ))}
        </dl>
        <Reveal>
          <p className="text-muted-foreground mt-6 max-w-3xl text-sm leading-relaxed">
            {cmsText(content, 'scale_note', `The site covers ${f.siteAreaMu} mu (about 26,700 m²). Langtian reports annual board output of ${f.reportedAnnualBoardOutputTonnes.toLocaleString('en-US')} tonnes.`)}
          </p>
        </Reveal>
      </Section>

      <Section tone="muted" labelledBy="photos-title">
        <Reveal>
          <h2 id="photos-title" className="text-3xl font-bold tracking-tight">
            {cmsText(content, 'photos_title', 'From the factory')}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            {cmsText(content, 'photos_intro', 'Explore the site, equipment and material-handling areas.')}
          </p>
        </Reveal>
        <div className="mt-10 space-y-14">
          {visibleGroups.map((group) => (
            <div key={group.title}>
              <Reveal>
                <h3 className="text-xl font-bold">{group.title}</h3>
                <p className="text-muted-foreground mt-1 text-sm">{group.description}</p>
              </Reveal>
              <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.images.map((image, i) => (
                  <Reveal as="li" key={image.src} delay={(i % 3) * 60}>
                    <figure>
                      <div className="relative aspect-[4/3] overflow-hidden bg-white">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                      <figcaption className="text-muted-foreground mt-2 text-sm">{image.caption}</figcaption>
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
              {cmsText(content, 'process_title', 'Needling and pressing')}
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {cmsText(content, 'process_intro', 'The five production lines are split between two processes. Which process a given product passes through is confirmed per product during inquiry.')}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <dl className="divide-y border-y">
              <div className="py-5">
                <dt className="font-bold">{cmsText(content, 'needling_label', `Needling lines (${f.needlingLines})`)}</dt>
                <dd className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  {cmsText(content, 'needling_text', 'Needling is a general process in which barbed needles entangle fibers into a coherent felt or non-woven web.')}
                </dd>
              </div>
              <div className="py-5">
                <dt className="font-bold">{cmsText(content, 'pressing_label', `Pressing lines (${f.pressingLines})`)}</dt>
                <dd className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  {cmsText(content, 'pressing_text', 'Pressing is a general process in which heat and pressure consolidate material layers into a sheet or board.')}
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
            {cmsText(content, 'cta_title', 'Want to discuss a part, a material or a sample?')}
          </h2>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">{cmsText(content, 'cta_label', 'Send an inquiry')}</Link>
          </Button>
        </Reveal>
      </Section>
    </>
  )
}
