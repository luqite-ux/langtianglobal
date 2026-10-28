import type { ReactNode } from 'react'
import { Reveal } from '@/components/site/reveal'
import { cn } from '@/lib/utils'

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        'text-primary flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="size-2.5 shrink-0 border-b-2 border-l-2 border-current"
      />
      {children}
    </p>
  )
}

type SectionProps = {
  id?: string
  labelledBy?: string
  tone?: 'plain' | 'muted' | 'ink'
  className?: string
  children: ReactNode
}

export function Section({ id, labelledBy, tone = 'plain', className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        'py-16 sm:py-20 lg:py-24',
        tone === 'muted' && 'bg-secondary',
        tone === 'ink' && 'on-dark bg-ink text-ink-foreground',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">{children}</div>
    </section>
  )
}

type HeadingProps = {
  id: string
  eyebrow: string
  title: string
  description?: string
  tone?: 'light' | 'dark'
  className?: string
  children?: ReactNode
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  tone = 'light',
  className,
  children,
}: HeadingProps) {
  const dark = tone === 'dark'
  return (
    <Reveal
      className={cn(
        'mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between',
        className,
      )}
    >
      <div className="max-w-2xl">
        <Eyebrow className={dark ? 'text-[oklch(0.78_0.15_28)]' : undefined}>
          {eyebrow}
        </Eyebrow>
        <h2
          id={id}
          className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              'mt-4 text-base leading-relaxed sm:text-lg',
              dark ? 'text-white/75' : 'text-muted-foreground',
            )}
          >
            {description}
          </p>
        )}
      </div>
      {children}
    </Reveal>
  )
}
