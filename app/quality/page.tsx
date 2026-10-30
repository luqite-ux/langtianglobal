import { cmsPageMetadata } from '@/lib/site-content/metadata'
import Image from 'next/image'
import Link from 'next/link'
import { FileCheck2 } from 'lucide-react'
import { CmsPageIntro } from '@/components/site/cms-page-intro'
import { Reveal } from '@/components/site/reveal'
import { Eyebrow, Section } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { getSiteCertificates } from '@/lib/site-content/certificate-content'
import { getSiteContent } from '@/lib/site-content/site-content'
import { cmsImage, cmsItems, cmsText, siteModule } from '@/lib/site-content/read'

export async function generateMetadata() {
  return cmsPageMetadata('/quality', 'Quality and certificates', 'Review the supplied ISO 14001, IATF 16949 and patent certificate copies, with their printed scope, titles and status caveats.')
}

const placeholder = 'See the certificate copy'
const containsChinese = (value: string) => /[\u3400-\u9fff]/u.test(value)

// Titles and numbers transcribed from the six customer-supplied patent certificate PDFs.
// These describe the supplied copies; current patent register status is not asserted.
const patentCopies = [
  { number: 'ZL 2024 1 1300826.X', title: 'Glass fiber board lifting equipment and production process', scanSrc: '/images/certificates/patents/patent-1300826x.jpg' },
  { number: 'ZL 2024 1 0152002.6', title: 'Equipment and process for glass fiber board production', scanSrc: '/images/certificates/patents/patent-01520026.jpg' },
  { number: 'ZL 2024 1 1314827.X', title: 'Flame-retardant LWRT board for new energy vehicle chassis and its processing method', scanSrc: '/images/certificates/patents/patent-1314827x.jpg' },
  { number: 'ZL 2024 2 3160183.1', title: 'Electric heating oven with rapid discharge', scanSrc: '/images/certificates/patents/patent-31601831.jpg' },
  { number: 'ZL 2024 2 3231628.0', title: 'Baking device for GMT sheet production', scanSrc: '/images/certificates/patents/patent-32316280.jpg' },
  { number: 'ZL 2024 2 3277232.X', title: 'Preheating device for glass fiber reinforced plastic production', scanSrc: '/images/certificates/patents/patent-3277232x.jpg' },
] as const

export default async function QualityPage() {
  const [certificates, snapshot] = await Promise.all([getSiteCertificates(), getSiteContent('en')])
  const content = siteModule(snapshot, '/quality', 'quality_evidence')
  if (snapshot && !content) throw new Error('Published quality evidence is missing')
  const patents = content ? cmsItems(content, 'patents', patentCopies, item =>
    typeof item.number === 'string' && typeof item.title === 'string'
      && patentCopies.some(copy => copy.number === item.number)
      ? { number: item.number, title: containsChinese(item.title)
          ? patentCopies.find(copy => copy.number === item.number)!.title : item.title,
          scanSrc: patentCopies.find(copy => copy.number === item.number)!.scanSrc } : null) : patentCopies
  const scopeDefaults = [
    'ISO 14001 relates to an environmental management system; IATF 16949 relates to an automotive quality management system.',
    'A management-system certificate applies to the scope printed on it. It does not certify every individual product.',
    'Product properties are specified per material and confirmed against technical data for your project. No test results are published on this site.',
    'Need the certificate copies or details verified? Ask in an inquiry and we will provide them.',
  ]
  const scopePointsFromCms = content ? cmsItems(content, 'scope_points', scopeDefaults, item =>
    typeof item.text === 'string' && !containsChinese(item.text) ? item.text : null) : scopeDefaults
  const scopePoints = scopePointsFromCms.length === scopeDefaults.length ? scopePointsFromCms : scopeDefaults
  if (content && (!patents.length || !scopePoints.length)) throw new Error('Published quality evidence is incomplete')
  const recognitionImage = cmsImage(content, 'recognition_image', { src: '/images/certificates/high-tech-enterprise.jpg', alt: 'High-tech enterprise certificate naming Jiangsu Langtian Composite Materials Co., Ltd.' })
  const englishText = (key: string, fallback: string) => {
    const value = cmsText(content, key, fallback)
    return containsChinese(value) ? fallback : value
  }

  return (
    <>
      <CmsPageIntro path="/quality"
        eyebrow="Quality and certificates"
        title="Management-system certificates"
        description="View the ISO 14001 and IATF 16949 certificate copies, including their stated scope and dates."
        crumbs={[{ label: 'Quality' }]}
      />

      <Section labelledBy="certs-title">
        <Reveal>
          <h2 id="certs-title" className="text-3xl font-bold tracking-tight">
            {englishText('certs_title', 'Certificates')}
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
                        <dd className="text-muted-foreground text-sm">
                          {value && !containsChinese(value) ? value : englishText('cert_placeholder', placeholder)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="text-muted-foreground mt-4 text-sm">
                    {englishText('cert_note', 'This is a supplied copy. Confirm current registration status with the issuing body before relying on it.')}
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
              {englishText('recognition_title', 'Company recognition')}
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {englishText('recognition_text_1', 'A supplied high-tech enterprise certificate names Jiangsu Langtian Composite Materials Co., Ltd. It was issued on 13 December 2023 and states a three-year term. Please check its current status when making a procurement decision.')}
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {englishText('recognition_text_2', 'A supplied 2025 Jiangsu provincial specialist-enterprise list includes the company at entry 5640. This describes the supplied list; confirm the current designation with the issuing authority.')}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <figure className="bg-white p-4">
              <Image
                src={recognitionImage.src}
                alt="High-tech enterprise certificate naming Jiangsu Langtian Composite Materials Co., Ltd."
                width={1000}
                height={1500}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="h-auto w-full object-contain"
              />
              <figcaption className="text-muted-foreground mt-3 text-sm">
                {englishText('recognition_caption', 'High-tech enterprise certificate, issued 13 December 2023.')}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Section>

      <Section tone="muted" labelledBy="patent-copies-title">
        <Reveal>
          <Eyebrow>{englishText('patents_eyebrow', 'Customer-supplied documents')}</Eyebrow>
          <h2 id="patent-copies-title" className="mt-3 text-3xl font-bold tracking-tight">
            {englishText('patents_title', 'Patent certificate copies')}
          </h2>
          <p className="text-muted-foreground mt-4 max-w-3xl leading-relaxed">
            {englishText('patents_intro', 'These six copies name Jiangsu Langtian Composite Materials Co., Ltd. as the patent holder. Titles are provided in English for convenient review; refer to each original certificate and the current patent register before relying on its legal status.')}
          </p>
        </Reveal>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {patents.map((patent, index) => (
            <Reveal as="li" key={patent.number} delay={(index % 2) * 80}>
              <article className="bg-card grid h-full grid-cols-[96px_minmax(0,1fr)] gap-4 border p-4 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-6 sm:p-6">
                <a href={patent.scanSrc} target="_blank" rel="noopener noreferrer"
                  aria-label={`View full certificate copy for ${patent.number}`}
                  className="bg-secondary focus-visible:ring-primary relative block aspect-[0.707] overflow-hidden border focus-visible:ring-2 focus-visible:outline-none">
                  <Image src={patent.scanSrc} alt={`${patent.number} customer-supplied patent certificate copy`}
                    fill sizes="(min-width: 640px) 128px, 96px" className="object-contain" />
                </a>
                <div className="min-w-0 self-center">
                  <p className="text-primary text-xs font-semibold tracking-widest uppercase">{patent.number}</p>
                  <h3 className="mt-3 text-lg font-semibold leading-snug">{patent.title}</h3>
                  <a href={patent.scanSrc} target="_blank" rel="noopener noreferrer"
                    className="text-primary mt-4 inline-block text-sm font-semibold underline-offset-4 hover:underline focus-visible:underline">
                    View certificate copy
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section labelledBy="scope-title">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <h2 id="scope-title" className="text-3xl font-bold tracking-tight">
              {englishText('scope_title', 'How to read these certificates')}
            </h2>
            <div className="mt-7 grid max-w-md grid-cols-2 gap-4" aria-label="Certificate preview">
              {certificates.slice(0, 2).map(cert => cert.scanSrc && (
                <a key={cert.slug} href={`#${cert.slug}`}
                  className="group bg-card focus-visible:ring-primary border p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none">
                  <div className="bg-secondary relative aspect-[3/4] overflow-hidden">
                    <Image src={cert.scanSrc} alt={`${cert.standard} certificate preview`} fill
                      sizes="(min-width: 1024px) 180px, 40vw" className="object-contain mix-blend-multiply" />
                  </div>
                  <p className="mt-3 text-center text-xs font-semibold tracking-wide">{cert.standard}</p>
                </a>
              ))}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <ul className="text-muted-foreground space-y-4 leading-relaxed">
              {scopePoints.map((point, index) => <li key={index}>{point}</li>)}
            </ul>
            <Button asChild size="lg" className="mt-7">
              <Link href="/contact">{englishText('scope_cta', 'Request certificate copies')}</Link>
            </Button>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
