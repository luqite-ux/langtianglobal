import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FaqList } from '@/components/faq/faq-list'
import { Reveal } from '@/components/site/reveal'
import { Section, SectionHeading } from '@/components/site/section'
import { getFaqs } from '@/lib/data'

const homeFaqIds = ['which-material', 'what-to-send', 'samples', 'moq-price']

export async function HomeFaq() {
  const all = await getFaqs()
  const items = homeFaqIds
    .map((id) => all.find((f) => f.id === id))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))
  return (
    <Section tone="muted" labelledBy="home-faq-title">
      <SectionHeading
        id="home-faq-title"
        eyebrow="Buyer questions"
        title="Before you send an inquiry"
      >
        <Link
          href="/faq"
          className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
        >
          All questions
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </SectionHeading>
      <Reveal>
        <FaqList items={items} />
      </Reveal>
    </Section>
  )
}
