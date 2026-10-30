import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { Section, SectionHeading } from '@/components/site/section'
import { company } from '@/lib/site'
import { cmsImage, cmsText } from '@/lib/site-content/read'
import type { SiteModuleProps } from '@/lib/site-content/render-page'

const facts = [
  { value: String(company.founded), label: 'Established' },
  { value: `~${company.facility.approxAreaSqm.toLocaleString('en-US')} m²`, label: 'Factory, approximate' },
  { value: String(company.facility.workshops), label: 'Workshops' },
  { value: String(company.facility.productionLines), label: 'Production lines' },
]

export function ManufacturingEvidence({ content }: { content?: SiteModuleProps }) {
  const factoryImage = cmsImage(content, 'factory_image', { src: '/images/factory/factory-exterior.jpg', alt: 'Exterior of the Langtian factory building with grey cladding, tall windows and the Lang Tian sign' })
  const hallImage = cmsImage(content, 'hall_image', { src: '/images/factory/fibre-processing-hall.jpg', alt: 'Interior production hall with fiber-processing machinery and metal ducting under a steel roof' })
  return (
    <Section tone="ink" labelledBy="manufacturing-title">
      <SectionHeading
        id="manufacturing-title"
        tone="dark"
        eyebrow={cmsText(content, 'eyebrow', 'Manufacturing evidence')}
        title={cmsText(content, 'title', 'A factory in Xuyi County, shown as it is')}
        description={cmsText(content, 'description', 'Four workshops house five production lines: three needling lines and two pressing lines. See the factory and production hall.')}
      >
        <Link
          href="/manufacturing"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:underline"
        >
          {cmsText(content, 'cta_label', 'Manufacturing overview')}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </SectionHeading>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <Reveal>
          <figure>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={factoryImage.src}
                alt={factoryImage.alt}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-white/70">
              {cmsText(content, 'factory_caption', 'Factory exterior, Xuyi County Economic Development Zone.')}
            </figcaption>
          </figure>
        </Reveal>
        <Reveal delay={90}>
          <figure>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={hallImage.src}
                alt={hallImage.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-white/70">
              {cmsText(content, 'hall_caption', 'Production hall with fiber-processing machinery.')}
            </figcaption>
          </figure>
        </Reveal>
      </div>

      <Reveal delay={120}>
        <dl className="mt-10 grid grid-cols-2 gap-px bg-white/15 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-ink p-5 sm:p-6">
              <dt className="text-sm text-white/70">{fact.label}</dt>
              <dd className="font-display mt-1 text-3xl font-bold text-white">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  )
}
