import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FaqList } from '@/components/faq/faq-list'
import { Reveal } from '@/components/site/reveal'
import { Section, SectionHeading } from '@/components/site/section'
import { getSiteFaqs } from '@/lib/site-content/faq-content'
import { cmsItems, cmsText } from '@/lib/site-content/read'
import type { SiteModuleProps } from '@/lib/site-content/render-page'

const homeFaqIds = ['which-material', 'what-to-send', 'samples', 'moq-price']

export async function HomeFaq({ content }: { content?: SiteModuleProps }) {
  const all = await getSiteFaqs()
  const ids = content ? cmsItems(content, 'questions', homeFaqIds, item =>
    typeof item.faq_id === 'string' && /^[a-z0-9-]{2,80}$/.test(item.faq_id) ? item.faq_id : null) : homeFaqIds
  if (content && ids.length === 0) throw new Error('Published home FAQ selection is missing')
  const items = ids
    .map((id) => all.find((f) => f.id === id))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))
  return (
    <Section tone="muted" labelledBy="home-faq-title">
      <SectionHeading
        id="home-faq-title"
        eyebrow={cmsText(content, 'eyebrow', 'Buyer questions')}
        title={cmsText(content, 'title', 'Before you send an inquiry')}
      >
        <Link
          href="/faq"
          className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
        >
          {cmsText(content, 'cta_label', 'All questions')}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </SectionHeading>
      <Reveal>
        <FaqList items={items} />
      </Reveal>
    </Section>
  )
}
