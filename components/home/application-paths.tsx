import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { Section, SectionHeading } from '@/components/site/section'
import { getApplications, getProducts } from '@/lib/data'

export async function ApplicationPaths() {
  const [applications, products] = await Promise.all([getApplications(), getProducts()])
  return (
    <Section labelledBy="applications-title">
      <SectionHeading
        id="applications-title"
        eyebrow="Automotive applications"
        title="Find materials by interior part"
        description="Pick the part you are developing to explore materials that may suit its structure and surface requirements."
      />
      <ol className="border-t">
        {applications.map((application, i) => {
          const linked = products.filter((p) => p.applicationSlugs.includes(application.slug))
          return (
            <Reveal as="li" key={application.slug} delay={i * 50} className="border-b">
              <Link
                href={`/applications#${application.slug}`}
                className="group hover:bg-secondary grid gap-2 px-1 py-5 transition-colors sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:gap-6 sm:px-4"
              >
                <span
                  aria-hidden="true"
                  className="text-primary font-display text-sm font-bold tabular-nums"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="font-display block text-xl font-bold">{application.name}</span>
                  <span className="text-muted-foreground mt-1 block text-sm leading-relaxed">
                    {application.summary}
                  </span>
                </span>
                <span className="text-primary flex items-center gap-1.5 text-sm font-semibold">
                  {linked.length} linked {linked.length === 1 ? 'product' : 'products'}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                  />
                </span>
              </Link>
            </Reveal>
          )
        })}
      </ol>
    </Section>
  )
}
