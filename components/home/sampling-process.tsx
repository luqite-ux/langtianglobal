import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { Section, SectionHeading } from '@/components/site/section'

const steps = [
  {
    title: 'Describe the part',
    text: 'Send the application, drawing or description, and the material family you are considering.',
  },
  {
    title: 'Define the specification',
    text: 'Agree thickness, areal weight, size, surface and expected quantity against the product fields.',
  },
  {
    title: 'Discuss a sample',
    text: 'Ask for a sample of the material. Availability is confirmed for each material and project.',
  },
  {
    title: 'Review the quotation',
    text: 'Price and minimum order quantity are confirmed for your specification and quantity.',
  },
]

export function SamplingProcess() {
  return (
    <Section labelledBy="process-title">
      <SectionHeading
        id="process-title"
        eyebrow="Customization and sampling"
        title="From your drawing to a specification"
        description="Share your part requirements and target quantity. We will discuss the specification, sample options and quotation for your project."
      >
        <Link
          href="/contact"
          className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
        >
          Request a sample
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </SectionHeading>
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <Reveal as="li" key={step.title} delay={i * 80}>
            <div className="process-step relative h-full pt-5">
              <span
                aria-hidden="true"
                className="text-primary font-display text-4xl font-bold tabular-nums"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">
                {step.text}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
