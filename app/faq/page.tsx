import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/page-metadata'
import Link from 'next/link'
import { FaqList } from '@/components/faq/faq-list'
import { JsonLd } from '@/components/site/json-ld'
import { PageIntro } from '@/components/site/page-intro'
import { Reveal } from '@/components/site/reveal'
import { Section } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { getFaqs } from '@/lib/data'
import type { FaqItem } from '@/lib/data/types'

export const metadata: Metadata = pageMetadata({
  title: 'FAQ',
  description:
    'Answers about Langtian materials, inquiries, samples, minimum order quantities, certificates and location.',
  path: '/faq',
})

const topics: { key: FaqItem['topic']; title: string }[] = [
  { key: 'products', title: 'Products and materials' },
  { key: 'inquiry', title: 'Inquiries and samples' },
  { key: 'quality', title: 'Quality and certificates' },
  { key: 'company', title: 'Company' },
]

export default async function FaqPage() {
  const faqs = await getFaqs()

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />
      <PageIntro
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Short answers for buyers and engineers. Anything not covered here can go into an inquiry."
        crumbs={[{ label: 'FAQ' }]}
      />
      <Section>
        <div className="space-y-14">
          {topics.map((topic) => {
            const items = faqs.filter((f) => f.topic === topic.key)
            if (items.length === 0) return null
            return (
              <Reveal key={topic.key}>
                <section aria-labelledby={`faq-${topic.key}`}>
                  <h2 id={`faq-${topic.key}`} className="mb-4 text-2xl font-bold">
                    {topic.title}
                  </h2>
                  <FaqList items={items} />
                </section>
              </Reveal>
            )
          })}
        </div>
        <Reveal className="bg-secondary mt-14 flex flex-col items-start justify-between gap-5 border p-6 sm:flex-row sm:items-center sm:p-8">
          <p className="max-w-xl font-medium">Your question is not here?</p>
          <Button asChild size="lg">
            <Link href="/contact">Ask us directly</Link>
          </Button>
        </Reveal>
      </Section>
    </>
  )
}
