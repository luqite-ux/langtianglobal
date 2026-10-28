import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, FileCheck2 } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { Section, SectionHeading } from '@/components/site/section'
import { getCertificates } from '@/lib/data'

export async function QualityContext() {
  const certificates = await getCertificates()
  return (
    <Section tone="muted" labelledBy="quality-title">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <SectionHeading
          id="quality-title"
          className="mb-0 lg:flex-col lg:items-start lg:justify-start"
          eyebrow="Quality and certificates"
          title="Management-system certificates, with their scope"
          description="View the ISO 14001 and IATF 16949 certificate copies, including their stated scope and dates."
        >
          <Link
            href="/quality"
            className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
          >
            Quality and certificates
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </SectionHeading>
        <ul className="grid gap-4 sm:grid-cols-2">
          {certificates.map((certificate, i) => (
            <Reveal as="li" key={certificate.slug} delay={i * 80}>
              <Link
                href={`/quality#${certificate.slug}`}
                className="bg-card hover:border-primary/70 group flex h-full flex-col border p-6 transition-colors"
              >
                {certificate.scanSrc && (
                  <span className="mb-5 block h-40 overflow-hidden bg-white">
                    <Image
                      src={certificate.scanSrc}
                      alt={`${certificate.standard} certificate copy`}
                      width={250}
                      height={350}
                      sizes="(min-width: 640px) 220px, 45vw"
                      className="h-full w-full object-contain object-top"
                    />
                  </span>
                )}
                <FileCheck2 aria-hidden="true" className="text-primary size-7" />
                <span className="font-display mt-5 text-2xl font-bold">{certificate.standard}</span>
                <span className="text-muted-foreground mt-1 text-sm">{certificate.title}</span>
                <span className="text-primary mt-auto flex items-center gap-1.5 pt-6 text-sm font-semibold">
                  View certificate details
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}
