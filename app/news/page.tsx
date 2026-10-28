import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Newspaper } from 'lucide-react'
import { PageIntro } from '@/components/site/page-intro'
import { Reveal } from '@/components/site/reveal'
import { Section } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { getPublishedNews } from '@/lib/data'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'News',
  description: 'Company news from Jiangsu Langtian Composite Materials.',
  alternates: { canonical: '/news' },
}

const dateFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
})

export default async function NewsPage() {
  const articles = await getPublishedNews()

  return (
    <>
      <PageIntro
        eyebrow="News"
        title="Company news"
        description="Announcements and updates from Langtian."
        crumbs={[{ label: 'News' }]}
      />
      <Section>
        {articles.length === 0 ? (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Newspaper aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No news has been published yet</EmptyTitle>
              <EmptyDescription>
                Articles will appear here once the company publishes them. In the meantime,
                you can browse the materials or send an inquiry.
              </EmptyDescription>
            </EmptyHeader>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/products">Browse products</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Contact us</Link>
              </Button>
            </div>
          </Empty>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, i) => (
              <Reveal as="li" key={a.slug} delay={(i % 3) * 70}>
                <article className="group bg-card focus-within:border-primary hover:border-primary/70 relative flex h-full flex-col border transition-colors">
                  {a.image && (
                    <div className="bg-secondary relative aspect-[16/10]">
                      <Image
                        src={a.image.src}
                        alt={a.image.alt}
                        fill
                        sizes="(min-width: 1024px) 30vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <time dateTime={a.publishedAt} className="text-muted-foreground text-xs">
                      {dateFormat.format(new Date(a.publishedAt))}
                    </time>
                    <h2 className="mt-2 text-lg font-bold">
                      <Link
                        href={`/news/${a.slug}`}
                        className="after:absolute after:inset-0 focus-visible:outline-offset-[-3px]"
                      >
                        {a.title}
                      </Link>
                    </h2>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {a.excerpt}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        )}
      </Section>
    </>
  )
}
