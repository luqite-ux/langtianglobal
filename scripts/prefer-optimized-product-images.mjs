import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const tenantId = process.env.NEXT_PUBLIC_TENANT_ID
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!tenantId || !url || !key) throw new Error('Missing tenant-scoped Supabase environment')

const receipt = JSON.parse(readFileSync(new URL('../.codex-delivery/optimized-product-views.json', import.meta.url), 'utf8'))
if (receipt.tenantId !== tenantId || receipt.receipt?.length !== 23) throw new Error('Optimized image receipt mismatch')
const grouped = Map.groupBy(receipt.receipt, item => item.slug)
const db = createClient(url, key, { auth: { persistSession: false } })
const results = []

for (const [slug, items] of grouped) {
  const { data: product, error } = await db.from('products').select('id,slug,image_url,extra_data')
    .eq('tenant_id', tenantId).eq('slug', slug).single()
  if (error) throw error
  const oldImages = product.extra_data?.images
  if (!Array.isArray(oldImages) || !items.every(item => oldImages.includes(item.url))) {
    throw new Error(`Optimized image missing from current gallery: ${slug}`)
  }
  const optimized = items.map(item => item.url)
  if (new Set(optimized).size !== optimized.length) throw new Error(`Duplicate optimized image: ${slug}`)
  const updatedExtra = { ...product.extra_data, images: optimized }
  const { data: changed, error: updateError } = await db.from('products')
    .update({ image_url: optimized[0], extra_data: updatedExtra })
    .eq('tenant_id', tenantId).eq('id', product.id).eq('image_url', product.image_url)
    .select('id').single()
  if (updateError || !changed) throw updateError || new Error(`Concurrent update: ${slug}`)
  const { data: check, error: checkError } = await db.from('products').select('image_url,extra_data')
    .eq('tenant_id', tenantId).eq('id', product.id).single()
  if (checkError || check.image_url !== optimized[0] || JSON.stringify(check.extra_data.images) !== JSON.stringify(optimized)) {
    throw checkError || new Error(`Readback mismatch: ${slug}`)
  }
  results.push({ slug, optimizedImages: optimized.length, cover: optimized[0], oldImagesRetainedInSource: oldImages.length })
}

console.log(JSON.stringify({ tenantId, products: results.length, optimizedImages: results.reduce((n, row) => n + row.optimizedImages, 0), pass: true, results }))
