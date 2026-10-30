import Image from 'next/image'
import Link from 'next/link'
import { CmsPageIntro } from '@/components/site/cms-page-intro'
import { Reveal } from '@/components/site/reveal'
import { Section } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { company } from '@/lib/site'
import { getPublicSiteSettings } from '@/lib/public-site-settings'
import { cmsPageMetadata } from '@/lib/site-content/metadata'
import { getSiteContent } from '@/lib/site-content/site-content'
import { cmsImage, cmsItems, cmsText, siteModule } from '@/lib/site-content/read'

export async function generateMetadata() {
  return cmsPageMetadata('/about', 'About', 'Jiangsu Langtian Composite Materials Co., Ltd. was established in 2021 in Xuyi County, Huai’an, Jiangsu and makes thermoplastic composite sheets and felts for automotive interiors.')
}

const facts = [
  { label: 'Established', value: String(company.founded) },
  { label: 'Location', value: 'Xuyi County, Huai’an, Jiangsu' },
  { label: 'Factory area', value: `Approx. ${company.facility.approxAreaSqm.toLocaleString('en-US')} m²` },
  { label: 'Workshops', value: String(company.facility.workshops) },
  { label: 'Production lines', value: String(company.facility.productionLines) },
]

export default async function AboutPage() {
  const [snapshot, settings] = await Promise.all([getSiteContent('en'), getPublicSiteSettings()])
  const content = siteModule(snapshot, '/about', 'about_story')
  if (snapshot && !content) throw new Error('Published About content is missing')
  const facility = siteModule(snapshot, '/manufacturing', 'facility_content')
  if (snapshot && !facility) throw new Error('Published facility facts are missing')
  const facilityStats = facility?.values.stats
  const statistic = (id: string, fallback: string) => {
    if (!facility) return fallback
    if (!Array.isArray(facilityStats)) throw new Error('Published facility statistics are missing')
    const row = facilityStats.find(item => item && typeof item === 'object' && !Array.isArray(item) && (item as Record<string, unknown>).id === id)
    if (!row || typeof (row as Record<string, unknown>).value !== 'string') throw new Error(`Published facility statistic missing: ${id}`)
    return (row as Record<string, string>).value
  }
  const visibleFacts = [
    facts[0], facts[1],
    { label: facts[2].label, value: statistic('factory-stat-1', facts[2].value) },
    { label: facts[3].label, value: statistic('factory-stat-2', facts[3].value) },
    { label: facts[4].label, value: statistic('factory-stat-3', facts[4].value) },
  ]
  const storyParagraphs = content ? cmsItems(content, 'story_paragraphs', [], item => typeof item.text === 'string' ? item.text : null) : []
  if (content && !storyParagraphs.length) throw new Error('Published About story is missing')
  const factoryImage = cmsImage(content, 'factory_image', { src: '/images/factory/factory-exterior.jpg', alt: 'Exterior of the Langtian factory building in Xuyi County, with the Lang Tian sign on the upper corner of the facade' })
  const recognitionImages = content ? cmsItems(content, 'recognition_images', [], item => {
    const raw = item.image
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
    const image = raw as Record<string, unknown>
    return typeof image.url === 'string' && image.url.startsWith('https://') && typeof image.alt === 'string'
      ? { src: image.url, alt: image.alt } : null
  }) : []
  if (content && !recognitionImages.length) throw new Error('Published recognition images are missing')
  return (
    <>
      <CmsPageIntro path="/about"
        eyebrow="About Langtian"
        title="A materials maker for automotive interiors"
        description="Jiangsu Langtian Composite Materials Co., Ltd. makes thermoplastic composite sheets and felts, supplied for automotive interior structures."
        crumbs={[{ label: 'About' }]}
      />

      <Section labelledBy="who-title">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 id="who-title" className="text-3xl font-bold tracking-tight">
              {cmsText(content, 'story_title', 'Who we are')}
            </h2>
            <div className="text-muted-foreground mt-5 space-y-4 leading-relaxed">
              {(content ? storyParagraphs : [
                `${company.legalNameEn} was established in ${company.founded} in Xuyi County, Huai’an, Jiangsu, China.`,
                'The company produces thermoplastic composite sheets, felts, sandwich panels and natural-fiber boards. Applications include automotive headliners, door panels, luggage-compartment liners, spare-tire covers and other interior structures, depending on the product.',
                'We work with buyers and engineers on specification: you describe the part, and we propose material families, then confirm figures and quantities in writing for the project.',
              ]).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/products">{cmsText(content, 'products_cta', 'Browse products')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/manufacturing">{cmsText(content, 'manufacturing_cta', 'See manufacturing')}</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="bg-secondary relative aspect-[4/3] overflow-hidden">
              <Image
                src={factoryImage.src}
                alt={factoryImage.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="text-muted-foreground mt-3 text-xs">
              {cmsText(content, 'factory_caption', 'Langtian factory exterior in Xuyi County.')}
            </p>
          </Reveal>
        </div>
      </Section>

      <Section tone="muted" labelledBy="facts-title">
        <Reveal>
          <h2 id="facts-title" className="text-3xl font-bold tracking-tight">
            {cmsText(content, 'facts_title', 'Company facts')}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            {cmsText(content, 'facts_intro', 'An overview of the company and its production site.')}
          </p>
        </Reveal>
        <dl className="mt-8 grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-5">
            {visibleFacts.map((f, i) => (
              <Reveal as="div" key={f.label} delay={Math.min(i * 60, 240)} className="bg-card p-5">
                <dt className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  {f.label}
                </dt>
                <dd className="mt-2 text-lg font-bold">{f.value}</dd>
              </Reveal>
            ))}
        </dl>
        <Reveal delay={100}>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-semibold">Legal name</dt>
              <dd className="text-muted-foreground mt-1 text-sm">
                {settings.legalName}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold">Registered address</dt>
              <dd className="text-muted-foreground mt-1 text-sm">{settings.address}</dd>
            </div>
          </dl>
        </Reveal>
      </Section>

      <Section labelledBy="recognition-display-title">
        <Reveal>
          <h2 id="recognition-display-title" className="text-3xl font-bold tracking-tight">
            {cmsText(content, 'recognition_title', 'Recognition displayed at the factory')}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            {cmsText(content, 'recognition_intro', "Views of the recognition and certificate display at Langtian's site. Certificate details and dates are listed on the quality page.")}
          </p>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {(content ? recognitionImages : [
            { src: '/images/certificates/recognition-wall-01.jpg', alt: "Recognition display at Langtian's factory, view 1" },
            { src: '/images/certificates/recognition-wall-02.jpg', alt: "Recognition display at Langtian's factory, view 2" },
          ]).map((image, index) => (
            <Reveal key={image.src} delay={index * 80}>
              <figure>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={720}
                  height={540}
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="h-auto w-full object-cover"
                />
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section labelledBy="next-title">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <h2 id="next-title" className="text-2xl font-bold">
              {cmsText(content, 'cta_title', 'Have a part in development?')}
            </h2>
            <p className="text-muted-foreground mt-2">
              {cmsText(content, 'cta_text', 'Send the application and target specification and we will reply with material families to compare.')}
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/contact">{cmsText(content, 'cta_label', 'Contact us')}</Link>
          </Button>
        </Reveal>
      </Section>
    </>
  )
}
