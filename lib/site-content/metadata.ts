import { pageMetadata } from '@/lib/page-metadata'
import { siteContentMetadata } from './site-content'

export async function cmsPageMetadata(path: string, title: string, description: string) {
  const content = await siteContentMetadata(path, 'en')
  return {
    ...pageMetadata({ title: content.title || title, description: content.description || description, path }),
    ...(content.robots ? { robots: content.robots } : {}),
  }
}
