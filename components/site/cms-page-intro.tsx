import type { ReactNode } from 'react'
import { PageIntro } from '@/components/site/page-intro'
import { getSiteContent } from '@/lib/site-content/site-content'
import { siteModule, cmsText } from '@/lib/site-content/read'

type Crumb = { label: string; href?: string }

export async function CmsPageIntro({ path, eyebrow, title, description, crumbs, children, contentEnabled = true }: {
  path: string
  eyebrow: string
  title: string
  description: string
  crumbs: Crumb[]
  children?: ReactNode
  contentEnabled?: boolean
}) {
  const snapshot = contentEnabled ? await getSiteContent('en') : null
  const module = siteModule(snapshot, path, 'page_hero')
  if (snapshot && !module) throw new Error(`Published page intro missing: ${path}`)
  return <PageIntro
    eyebrow={cmsText(module, 'eyebrow', eyebrow)}
    title={cmsText(module, 'title', title)}
    description={cmsText(module, 'description', description)}
    crumbs={crumbs}
    styles={module?.styles}
    contentVersion={snapshot?.version}
  >{children}</PageIntro>
}
