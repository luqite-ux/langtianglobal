import 'server-only'
import { getFaqs } from '@/lib/data'
import type { FaqItem } from '@/lib/data/types'
import { getSiteContent } from './site-content'
import { siteModule } from './read'

const topics = new Set<FaqItem['topic']>(['products', 'inquiry', 'quality', 'company'])

export async function getSiteFaqs(): Promise<FaqItem[]> {
  const snapshot = await getSiteContent('en')
  if (!snapshot) return getFaqs()
  const module = siteModule(snapshot, '/faq', 'faq_entries')
  if (!module || !Array.isArray(module.values.items)) throw new Error('Published FAQ entries are missing')
  const entries = module.values.items.map((raw) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Invalid published FAQ')
    const item = raw as Record<string, unknown>
    if (typeof item.id !== 'string' || typeof item.topic !== 'string' || !topics.has(item.topic as FaqItem['topic'])
      || typeof item.question !== 'string' || !item.question || typeof item.answer !== 'string' || !item.answer) throw new Error('Incomplete published FAQ')
    return { id: item.id, topic: item.topic as FaqItem['topic'], question: item.question, answer: item.answer }
  })
  if (!entries.length) throw new Error('Published FAQ entries are empty')
  return entries
}
