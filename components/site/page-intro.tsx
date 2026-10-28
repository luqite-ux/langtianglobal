import Link from 'next/link'
import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { Eyebrow } from '@/components/site/section'

type Crumb = { label: string; href?: string }

export function PageIntro({
  eyebrow,
  title,
  description,
  crumbs = [],
  children,
}: {
  eyebrow: string
  title: string
  description?: string
  crumbs?: Crumb[]
  children?: ReactNode
}) {
  return (
    <header className="bg-secondary border-b">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <nav aria-label="Breadcrumb">
          <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm">
            <li>
              <Link href="/" className="hover:text-primary hover:underline">
                Home
              </Link>
            </li>
            {crumbs.map((crumb) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                <ChevronRight aria-hidden="true" className="size-3.5" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-primary hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-foreground">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <Eyebrow className="mt-8">{eyebrow}</Eyebrow>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">
            {description}
          </p>
        )}
        {children}
      </div>
    </header>
  )
}
