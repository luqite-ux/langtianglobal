import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/site/json-ld'
import { PageIntro } from '@/components/site/page-intro'
import { Section } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { getNewsArticle } from '@/lib/data'
import { company } from '@/lib/site'

type Params = Promise<{ slug: string }>

export const revalidate = 60
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const article = await getNewsArticle((await params).slug)
  if (!article) return { title: 'Article not found' }
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/news/${article.slug}` },
  }
}

const dateFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
})

export default async function NewsArticlePage({ params }: { params: Params }) {
  const article = await getNewsArticle((await params).slug)
  if (!article) notFound()

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: article.title,
          datePublished: article.publishedAt,
          description: article.excerpt,
          author: { '@type': 'Organization', name: company.legalNameEn },
          publisher: { '@type': 'Organization', name: company.legalNameEn },
          ...(article.image ? { image: article.image.src } : {}),
        }}
      />
      <PageIntro
        eyebrow="News"
        title={article.title}
        description={article.excerpt}
        crumbs={[{ label: 'News', href: '/news' }, { label: article.title }]}
      >
        <time
          dateTime={article.publishedAt}
          className="text-muted-foreground mt-5 block text-sm"
        >
          {dateFormat.format(new Date(article.publishedAt))}
        </time>
      </PageIntro>
      <Section>
        <article className="mx-auto max-w-3xl">
          {article.image && (
            <div className="bg-secondary relative mb-10 aspect-[16/9]">
              <Image
                src={article.image.src}
                alt={article.image.alt}
                fill
                sizes="(min-width: 768px) 48rem, 100vw"
                className="object-cover"
                priority
              />
            </div>
          )}
          {article.bodyHtml ? (
            <div className="article-prose" dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />
          ) : (
            <div className="article-prose">
              {article.body.map((p) => <p key={p}>{p}</p>)}
            </div>
          )}
          <Button asChild variant="outline" className="mt-10">
            <Link href="/news">Back to news</Link>
          </Button>
        </article>
      </Section>
    </>
  )
}
