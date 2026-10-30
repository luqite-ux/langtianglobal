import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, FileCheck2 } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { Section, SectionHeading } from '@/components/site/section'
import { getSiteCertificates } from '@/lib/site-content/certificate-content'
import { cmsImage, cmsText, siteModule } from '@/lib/site-content/read'
import type { SiteModuleProps } from '@/lib/site-content/render-page'
import { getSiteContent } from '@/lib/site-content/site-content'

export async function QualityContext({ content }: { content?: SiteModuleProps }) {
  const [certificates, snapshot] = await Promise.all([getSiteCertificates(), getSiteContent('en')])
  const quality = siteModule(snapshot, '/quality', 'quality_evidence')
  const about = siteModule(snapshot, '/about', 'about_story')
  if (snapshot && (!quality || !about)) throw new Error('Published recognition content is missing')
  const recognitionImage = cmsImage(quality, 'recognition_image', { src: '/images/certificates/high-tech-enterprise.jpg', alt: 'High-tech enterprise certificate naming 江苏朗田复合材料有限公司' })
  const wallImages = about ? (() => {
    const items = about.values.recognition_images
    if (!Array.isArray(items) || !items.length) throw new Error('Published recognition wall images are missing')
    return items.map(item => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error('Invalid recognition wall image')
      const image = (item as Record<string, unknown>).image
      if (!image || typeof image !== 'object' || Array.isArray(image)) throw new Error('Invalid recognition wall image')
      const value = image as Record<string, unknown>
      if (typeof value.url !== 'string' || !value.url.startsWith('https://') || typeof value.alt !== 'string') throw new Error('Invalid recognition wall image')
      return { src: value.url, alt: value.alt }
    })
  })() : [1, 2].map(index => ({ src: `/images/certificates/recognition-wall-0${index}.jpg`, alt: `Langtian's onsite recognition display, view ${index}` }))
  return (
    <Section tone="muted" labelledBy="quality-title">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <SectionHeading
          id="quality-title"
          className="mb-0 lg:flex-col lg:items-start lg:justify-start"
          eyebrow={cmsText(content, 'eyebrow', 'Quality and certificates')}
          title={cmsText(content, 'title', 'Management-system certificates, with their scope')}
          description={cmsText(content, 'description', 'View the ISO 14001 and IATF 16949 certificate copies, including their stated scope and dates.')}
        >
          <Link
            href="/quality"
            className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
          >
            {cmsText(content, 'cta_label', 'Quality and certificates')}
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
              <Image src={recognitionImage.src} alt={recognitionImage.alt} width={120} height={180} className="h-36 w-full bg-white object-contain" />
              <span className="flex flex-col justify-center">
                <span className="font-display text-xl font-bold">{cmsText(quality, 'recognition_title', 'High-tech enterprise certificate copy')}</span>
                <span className="text-muted-foreground mt-2 text-sm">{cmsText(quality, 'recognition_text_1', 'Issued 13 December 2023 with a three-year printed term. Confirm current status with the issuing authority.')}</span>
                <span className="text-primary mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">View certificate details <ArrowRight aria-hidden="true" className="size-4" /></span>
              </span>
            </Link>
          </Reveal>
        </ul>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {wallImages.map((image, index) => (
          <Reveal key={image.src} delay={index * 80}>
            <Link href="/about#recognition-display-title" className="group block overflow-hidden">
              <Image src={image.src} alt={image.alt} width={850} height={640} className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-[1.02] motion-reduce:transition-none" />
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
