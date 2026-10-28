import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FileCheck2 } from 'lucide-react'
import { PageIntro } from '@/components/site/page-intro'
import { Reveal } from '@/components/site/reveal'
import { Eyebrow, Section } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { getCertificates } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Quality and certificates',
  description:
    'Review the supplied ISO 14001 and IATF 16949 certificate copies, including the scope and dates printed on each copy.',
  alternates: { canonical: '/quality' },
}

const placeholder = 'See the certificate copy'

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
              A high-tech enterprise certificate names Jiangsu Langtian Composite Materials
              Co., Ltd. It was issued on 13 December 2023 and states a three-year term.
              Please check its current status when making a procurement decision.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <figure className="bg-white p-4">
              <Image
                src="/images/certificates/high-tech-enterprise.jpg"
                alt="High-tech enterprise certificate naming Jiangsu Langtian Composite Materials Co., Ltd."
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
