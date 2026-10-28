import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/page-metadata'
import Image from 'next/image'
import Link from 'next/link'
import { FileCheck2 } from 'lucide-react'
import { PageIntro } from '@/components/site/page-intro'
import { Reveal } from '@/components/site/reveal'
import { Eyebrow, Section } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { getCertificates } from '@/lib/data'

export const metadata: Metadata = pageMetadata({
  title: 'Quality and certificates',
  description:
    'Review the supplied ISO 14001, IATF 16949 and patent certificate copies, with their printed scope, titles and status caveats.',
  path: '/quality',
})

const placeholder = 'See the certificate copy'

// Titles and numbers transcribed from the six customer-supplied patent certificate PDFs.
// These describe the supplied copies; current patent register status is not asserted.
const patentCopies = [
  { number: 'ZL 2024 1 1300826.X', title: 'Glass fiber board lifting equipment and production process', original: '玻纤板生产用提升设备及玻纤板生产工艺' },
  { number: 'ZL 2024 1 0152002.6', title: 'Equipment and process for glass fiber board production', original: '一种玻纤板生产用的设备及其生产工艺' },
  { number: 'ZL 2024 1 1314827.X', title: 'Flame-retardant LWRT board for new energy vehicle chassis and its processing method', original: '一种具阻燃效果的新能源汽车底盘LWRT板及加工工艺' },
  { number: 'ZL 2024 2 3160183.1', title: 'Electric heating oven with rapid discharge', original: '一种便于快速出料的电热烘箱' },
  { number: 'ZL 2024 2 3231628.0', title: 'Baking device for GMT sheet production', original: '一种GMT片材生产用烘烤装置' },
  { number: 'ZL 2024 2 3277232.X', title: 'Preheating device for glass fiber reinforced plastic production', original: '一种玻璃纤维增强塑料生产用预热装置' },
] as const

export default async function QualityPage() {
  const certificates = await getCertificates()

  return (
    <>
      <PageIntro
        eyebrow="Quality and certificates"
        title="Management-system certificates"
        description="View the ISO 14001 and IATF 16949 certificate copies, including their stated scope and dates."
        crumbs={[{ label: 'Quality' }]}
      />

      <Section labelledBy="certs-title">
        <Reveal>
          <h2 id="certs-title" className="text-3xl font-bold tracking-tight">
            Certificates
          </h2>
        </Reveal>
        <ul className="mt-8 grid gap-6 lg:grid-cols-2">
          {certificates.map((cert, i) => {
            const rows = [
              ['Certificate number', cert.certificateNumber],
              ['Issuing body', cert.issuingBody],
              ['Scope', cert.scope],
              ['Expiry printed on copy', cert.validUntil],
            ] as const
            return (
              <Reveal as="li" key={cert.slug} delay={i * 80}>
                <article id={cert.slug} className="bg-card scroll-mt-24 border p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <FileCheck2 aria-hidden="true" className="text-primary mt-1 size-7 shrink-0" />
                    <div>
                      <Eyebrow>{cert.standard}</Eyebrow>
                      <h3 className="mt-2 text-xl font-bold">{cert.title}</h3>
                    </div>
                  </div>
                  <dl className="mt-6 border-t">
                    {rows.map(([label, value]) => (
                      <div
                        key={label}
                        className="grid gap-1 border-b py-3 sm:grid-cols-[10rem_1fr] sm:gap-4"
                      >
                        <dt className="text-sm font-semibold">{label}</dt>
                        <dd className="text-muted-foreground text-sm">{value ?? placeholder}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="text-muted-foreground mt-4 text-sm">
                    This is a supplied copy. Confirm current registration status with the issuing body before relying on it.
                  </p>
                  {cert.scanSrc && (
                    <div className="bg-secondary relative mt-6 aspect-[3/4] overflow-hidden">
                      <Image
                        src={cert.scanSrc}
                        alt={`${cert.standard} certificate scan`}
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="object-contain mix-blend-multiply"
                      />
                    </div>
                  )}
                </article>
              </Reveal>
            )
          })}
        </ul>
      </Section>

      <Section tone="muted" labelledBy="recognition-title">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <Reveal>
            <h2 id="recognition-title" className="text-3xl font-bold tracking-tight">
              Company recognition
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              A supplied high-tech enterprise certificate names 江苏朗田复合材料有限公司.
              It was issued on 13 December 2023 and states a three-year term.
              Please check its current status when making a procurement decision.
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              A supplied 2025 Jiangsu provincial specialist-enterprise list includes the
              company at entry 5640. This describes the supplied list; confirm the current
              designation with the issuing authority.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <figure className="bg-white p-4">
              <Image
                src="/images/certificates/high-tech-enterprise.jpg"
                alt="High-tech enterprise certificate naming 江苏朗田复合材料有限公司"
                width={1000}
                height={1500}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="h-auto w-full object-contain"
              />
              <figcaption className="text-muted-foreground mt-3 text-sm">
                High-tech enterprise certificate, issued 13 December 2023.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Section>

      <Section tone="muted" labelledBy="patent-copies-title">
        <Reveal>
          <Eyebrow>Customer-supplied documents</Eyebrow>
          <h2 id="patent-copies-title" className="mt-3 text-3xl font-bold tracking-tight">
            Patent certificate copies
          </h2>
          <p className="text-muted-foreground mt-4 max-w-3xl leading-relaxed">
            These six copies name 江苏朗田复合材料有限公司 as the patent holder.
            Titles below are translated for reading; refer to each original certificate and the current patent register before relying on its legal status.
          </p>
        </Reveal>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {patentCopies.map((patent, index) => (
            <Reveal as="li" key={patent.number} delay={(index % 2) * 80}>
              <article className="bg-card h-full border p-5 sm:p-6">
                <p className="text-primary text-xs font-semibold tracking-widest uppercase">{patent.number}</p>
                <h3 className="mt-3 text-lg font-semibold leading-snug">{patent.title}</h3>
                <p lang="zh-CN" className="text-muted-foreground mt-2 text-sm leading-relaxed">{patent.original}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section labelledBy="scope-title">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <h2 id="scope-title" className="text-3xl font-bold tracking-tight">
              How to read these certificates
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <ul className="text-muted-foreground space-y-4 leading-relaxed">
              <li>
                ISO 14001 relates to an environmental management system; IATF 16949 relates
                to an automotive quality management system.
              </li>
              <li>
                A management-system certificate applies to the scope printed on it. It does
                not certify every individual product.
              </li>
              <li>
                Product properties are specified per material and confirmed against
                technical data for your project. No test results are published on this
                site.
              </li>
              <li>
                Need the certificate copies or details verified? Ask in an inquiry and we
                will provide them.
              </li>
            </ul>
            <Button asChild size="lg" className="mt-7">
              <Link href="/contact">Request certificate copies</Link>
            </Button>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
