import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { NodeHttpHandler } from '@smithy/node-http-handler'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { createClient } from '@supabase/supabase-js'

const tenantId = '317a84d7-9b80-4785-bd97-59170f7d2472'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const counts = {
  'pp-glass-fiber-board': 5,
  'lwrtud-felt-sheet': 2,
  'pet-pp-composite-sheet': 4,
  'pet-non-woven-pile-carpet': 2,
  'phc-fiberglass-composite-panel': 5,
  'pp-bamboo-hemp-fiberboard': 3,
  'pet-foam-board': 2,
}
for (const key of ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'R2_S3_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME']) {
  if (!process.env[key]) throw new Error(`Missing ${key}`)
}
const publicBase = (process.env.R2_PUBLIC_URL || process.env.R2_PUBLIC_URL_PREFIX || '').replace(/\/$/, '')
if (!/^https:\/\//.test(publicBase)) throw new Error('Missing HTTPS R2 public URL')
const r2 = new S3Client({
  region: 'auto', endpoint: process.env.R2_S3_ENDPOINT,
  ...(process.env.HTTPS_PROXY ? { requestHandler: new NodeHttpHandler({ httpsAgent: new HttpsProxyAgent(process.env.HTTPS_PROXY), connectionTimeout: 5000, requestTimeout: 15000 }) } : {}),
  maxAttempts: 2, requestChecksumCalculation: 'WHEN_REQUIRED', responseChecksumValidation: 'WHEN_REQUIRED',
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
})
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const receipt = []
for (const [slug, count] of Object.entries(counts)) {
  const { data: row, error } = await db.from('products').select('id,slug,image_url,extra_data')
    .eq('tenant_id', tenantId).eq('slug', slug).single()
  if (error) throw error
  const existing = row.extra_data?.images
  if (!Array.isArray(existing) || !existing.length || existing.some((url) => typeof url !== 'string' || !url.startsWith('https://')) || row.image_url !== existing[0]) {
    throw new Error(`Existing gallery is invalid for ${slug}`)
  }
  const additions = []
  for (let index = 1; index <= count; index += 1) {
    const name = `${slug}-${index}.jpg`
    const bytes = await readFile(path.join(root, 'public/images/products/optimized', name))
    const sha256 = createHash('sha256').update(bytes).digest('hex')
    const key = `products/${tenantId}/optimized/${sha256.slice(0, 24)}.jpg`
    const url = `${publicBase}/${key}`
    await r2.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key, Body: bytes, ContentType: 'image/jpeg' }))
    const head = await r2.send(new HeadObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }))
    if (head.ContentLength !== bytes.length) throw new Error(`R2 size mismatch: ${name}`)
    additions.push(url)
    receipt.push({ slug, name, sha256, bytes: bytes.length, key, url })
  }
  const missing = additions.filter((url) => !existing.includes(url))
  if (missing.length) {
    const { error: updateError } = await db.from('products').update({ extra_data: { ...row.extra_data, images: [...existing, ...missing] } })
      .eq('id', row.id).eq('tenant_id', tenantId)
    if (updateError) throw updateError
  }
  const { data: verify, error: verifyError } = await db.from('products').select('image_url,extra_data')
    .eq('id', row.id).eq('tenant_id', tenantId).single()
  if (verifyError) throw verifyError
  if (verify.image_url !== row.image_url || additions.some((url) => !verify.extra_data?.images?.includes(url))) throw new Error(`Readback mismatch: ${slug}`)
}
const report = { tenantId, verifiedAt: new Date().toISOString(), uploaded: receipt.length, products: Object.keys(counts).length, receipt }
await writeFile(path.join(root, '.codex-delivery/optimized-product-views.json'), `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({ tenantId, uploaded: receipt.length, products: Object.keys(counts).length, backendReadback: true }))
