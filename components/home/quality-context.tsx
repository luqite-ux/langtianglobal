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
          <Reveal as="li" delay={160} className="sm:col-span-2">
            <Link href="/quality#recognition-title" className="bg-card hover:border-primary/70 group grid h-full gap-5 border p-6 transition-colors sm:grid-cols-[120px_1fr]">
              <Image src="/images/certificates/high-tech-enterprise.jpg" alt="High-tech enterprise certificate naming 江苏朗田复合材料有限公司" width={120} height={180} className="h-36 w-full bg-white object-contain" />
              <span className="flex flex-col justify-center">
                <span className="font-display text-xl font-bold">High-tech enterprise certificate copy</span>
                <span className="text-muted-foreground mt-2 text-sm">Issued 13 December 2023 with a three-year printed term. Confirm current status with the issuing authority.</span>
                <span className="text-primary mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">View certificate details <ArrowRight aria-hidden="true" className="size-4" /></span>
              </span>
            </Link>
          </Reveal>
        </ul>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {(['recognition-wall-01.jpg', 'recognition-wall-02.jpg'] as const).map((file, index) => (
          <Reveal key={file} delay={index * 80}>
            <Link href="/about#recognition-display-title" className="group block overflow-hidden">
              <Image src={`/images/certificates/${file}`} alt={`Langtian's onsite recognition display, view ${index + 1}`} width={850} height={640} className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-[1.02] motion-reduce:transition-none" />
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
