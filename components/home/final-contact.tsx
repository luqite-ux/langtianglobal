import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { Section } from '@/components/site/section'
import { addressLine, company } from '@/lib/site'

export function FinalContact() {
  return (
    <Section tone="ink" labelledBy="final-contact-title">
      <Reveal className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <h2
            id="final-contact-title"
            className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Tell us the part, the material family and the specification you need.
          </h2>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="text-ink inline-flex h-12 items-center justify-center bg-white px-8 text-sm font-semibold transition-colors hover:bg-[oklch(0.94_0.03_28)]"
            >
              Send an inquiry
            </Link>
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center border border-white/70 px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Browse products
            </Link>
          </div>
        </div>
        <address className="flex gap-3 text-sm leading-relaxed text-white/80 not-italic">
          <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[oklch(0.78_0.15_28)]" />
          <span>
            <span className="block font-semibold text-white">{company.legalNameEn}</span>
            {addressLine}
          </span>
        </address>
      </Reveal>
    </Section>
  )
}
