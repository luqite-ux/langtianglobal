import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { Section, SectionHeading } from '@/components/site/section'
import { cmsItems, cmsText } from '@/lib/site-content/read'
import type { SiteModuleProps } from '@/lib/site-content/render-page'

const differentiators = [
  {
    title: 'Thermoplastic matrix',
    text: 'PP and PET based materials are thermoplastic, so sheets and felts are formed into interior parts with heat and pressure.',
    href: '/products?category=sheet',
    cta: 'Composite sheets',
  },
  {
    title: 'Fiber reinforcement',
    text: 'Glass fiber reinforces the PP and LWRT sheet rows, while bamboo or hemp fibers reinforce the natural-fiber board.',
    href: '/products/pp-glass-fiber-board',
    cta: 'PP Glass Fiber Board',
  },
  {
    title: 'Felt and surface layers',
    text: 'LWRTUD felt and PET non-woven or pile carpet are supplied as felt-type layers that can sit with a structural base.',
    href: '/products?category=felt',
    cta: 'Felts and non-wovens',
  },
  {
    title: 'Sandwich construction',
    text: 'PHC fiberglass composite panel and PET foam board place face layers around a core instead of using one solid sheet.',
    href: '/products?category=sandwich',
    cta: 'Sandwich panels',
  },
  {
    title: 'Natural-fiber option',
    text: 'PP bamboo or hemp fiberboard gives a natural-fiber alternative where the part and the surface requirement allow it.',
    href: '/products/pp-bamboo-hemp-fiberboard',
    cta: 'PP Bamboo / Hemp Fiberboard',
  },
  {
    title: 'Needling and pressing',
    text: 'Needling lines make felt-type material and pressing lines consolidate it. Langtian operates three needling lines and two pressing lines.',
    href: '/manufacturing',
    cta: 'Manufacturing',
  },
]

export function MaterialDifferentiators({ content }: { content?: SiteModuleProps }) {
  const items = content ? cmsItems(content, 'items', differentiators, item =>
    typeof item.title === 'string' && typeof item.text === 'string' && typeof item.cta === 'string'
      && typeof item.href === 'string' && /^\/[a-z0-9/?#=&-]*$/i.test(item.href)
      ? { title: item.title, text: item.text, cta: item.cta, href: item.href } : null) : differentiators
  if (content && items.length === 0) throw new Error('Published material differentiators are missing')
  return (
    <Section labelledBy="differentiators-title">
      <SectionHeading
        id="differentiators-title"
        eyebrow={cmsText(content, 'eyebrow', 'Materials and processing')}
        title={cmsText(content, 'title', 'What differs between these materials')}
        description={cmsText(content, 'description', 'Compare the material forms here, then check each product page for thickness, areal weight and minimum order quantity.')}
      />
      <ul className="grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal as="li" key={item.title} delay={(i % 3) * 70} className="bg-background">
            <div className="flex h-full flex-col p-6 sm:p-8">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
                {item.text}
              </p>
              <Link
                href={item.href}
                className="text-primary mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold hover:underline"
              >
                {item.cta}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
