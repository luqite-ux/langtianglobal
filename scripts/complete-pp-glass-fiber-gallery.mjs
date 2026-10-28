import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { NodeHttpHandler } from '@smithy/node-http-handler'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { createClient } from '@supabase/supabase-js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const tenantId = '317a84d7-9b80-4785-bd97-59170f7d2472'
if (process.env.NEXT_PUBLIC_TENANT_ID !== tenantId) throw new Error('Unexpected tenant')
for (const key of ['R2_S3_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) {
  if (!process.env[key]) throw new Error(`Missing ${key}`)
}
const publicBase = (process.env.R2_PUBLIC_URL || process.env.R2_PUBLIC_URL_PREFIX || '').replace(/\/$/, '')
if (!/^https:\/\//.test(publicBase)) throw new Error('Missing HTTPS R2 public URL')
const r2 = new S3Client({
  region: 'auto', endpoint: process.env.R2_S3_ENDPOINT,
  ...(process.env.HTTPS_PROXY ? { requestHandler: new NodeHttpHandler({ httpsAgent: new HttpsProxyAgent(process.env.HTTPS_PROXY), connectionTimeout: 5000, requestTimeout: 15000 }) } : {}),
  maxAttempts: 2,
  requestChecksumCalculation: 'WHEN_REQUIRED', responseChecksumValidation: 'WHEN_REQUIRED',
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
})
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const { data: row, error: selectError } = await db.from('products').select('id,slug,image_url,extra_data').eq('tenant_id', tenantId).eq('slug', 'pp-glass-fiber-board').single()
if (selectError) throw selectError
const existing = row.extra_data?.images
if (!Array.isArray(existing) || existing.length < 5 || existing.some((url) => typeof url !== 'string' || !url.startsWith('https://'))) {
  throw new Error('Existing gallery is incomplete or not hosted on HTTPS')
}
const receipt = []
for (const index of [6, 7]) {
  const name = `pp-glass-fiber-board-${index}.jpeg`
  const bytes = await readFile(path.join(root, 'public/images/products/source', name))
  const sha256 = createHash('sha256').update(bytes).digest('hex')
  const key = `products/${tenantId}/seed/${sha256.slice(0, 16)}.jpg`
  const url = `${publicBase}/${key}`
  await r2.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key, Body: bytes, ContentType: 'image/jpeg' }))
  const head = await r2.send(new HeadObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }))
  if (head.ContentLength !== bytes.length) throw new Error(`R2 size mismatch: ${name}`)
  receipt.push({ name, sha256, bytes: bytes.length, key, url })
}
const missing = receipt.map((item) => item.url).filter((url) => !existing.includes(url))
if (missing.length) {
  const extra = { ...row.extra_data, images: [...existing, ...missing] }
  const { error: updateError } = await db.from('products').update({ extra_data: extra }).eq('id', row.id).eq('tenant_id', tenantId)
  if (updateError) throw updateError
}
const { data: verify, error: verifyError } = await db.from('products').select('image_url,extra_data').eq('id', row.id).eq('tenant_id', tenantId).single()
if (verifyError) throw verifyError
if (verify.image_url !== row.image_url || receipt.some((item) => !verify.extra_data?.images?.includes(item.url))) throw new Error('Gallery readback mismatch')
await writeFile(path.join(root, '.codex-delivery/pp-glass-fiber-gallery-completion.json'), JSON.stringify({ tenantId, slug: row.slug, verifiedAt: new Date().toISOString(), imageCount: verify.extra_data.images.length, receipt }, null, 2) + '\n')
console.log(JSON.stringify({ tenantId, product: row.slug, uploaded: receipt.length, galleryCount: verify.extra_data.images.length, backendReadback: true }))
