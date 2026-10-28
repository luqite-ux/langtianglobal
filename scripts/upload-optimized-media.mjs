import { createHash } from 'node:crypto'
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { NodeHttpHandler } from '@smithy/node-http-handler'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { createClient } from '@supabase/supabase-js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const imagesRoot = path.join(root, 'public', 'images', 'products', 'optimized')
const tenantId = process.env.NEXT_PUBLIC_TENANT_ID
const expectedTenant = '317a84d7-9b80-4785-bd97-59170f7d2472'
if (tenantId !== expectedTenant) throw new Error('Unexpected customer tenant')
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
const { data: products, error: selectError } = await db.from('products').select('id,slug,extra_data').eq('tenant_id', tenantId)
if (selectError) throw selectError
if (products.length !== 8) throw new Error(`Expected 8 products; got ${products.length}`)
const names = (await readdir(imagesRoot)).filter((name) => name.endsWith('.jpg'))
if (names.length !== 23) throw new Error(`Expected 23 optimized photos; got ${names.length}`)
const receipt = []
for (const product of products) {
  const files = names.filter((name) => name.startsWith(`${product.slug}-`)).sort((a, b) => Number(a.match(/-(\d+)\.jpg$/)?.[1]) - Number(b.match(/-(\d+)\.jpg$/)?.[1]))
  if (product.slug !== 'lwrt-board' && !files.length) throw new Error(`No optimized photos for ${product.slug}`)
  const urls = []
  for (const name of files) {
    const bytes = await readFile(path.join(imagesRoot, name))
    const sha256 = createHash('sha256').update(bytes).digest('hex')
    const key = `products/${tenantId}/optimized/${sha256.slice(0, 20)}.jpg`
    await r2.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key, Body: bytes, ContentType: 'image/jpeg' }))
    const head = await r2.send(new HeadObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }))
    if (head.ContentLength !== bytes.length) throw new Error(`R2 size mismatch: ${name}`)
    const url = `${publicBase}/${key}`
    urls.push(url)
    receipt.push({ product_slug: product.slug, source_file: name, sha256, bytes: bytes.length, r2_key: key, url })
  }
  const extra = { ...(product.extra_data || {}), optimized_alternatives: urls }
  const { error } = await db.from('products').update({ extra_data: extra }).eq('id', product.id).eq('tenant_id', tenantId)
  if (error) throw error
}
const { data: verify, error: verifyError } = await db.from('products').select('slug,extra_data').eq('tenant_id', tenantId)
if (verifyError) throw verifyError
for (const product of verify) {
  const expected = receipt.filter((item) => item.product_slug === product.slug).map((item) => item.url)
  if (JSON.stringify(product.extra_data?.optimized_alternatives || []) !== JSON.stringify(expected)) throw new Error(`Backend readback mismatch: ${product.slug}`)
}
const evidenceDir = path.join(root, '.codex-delivery')
await mkdir(evidenceDir, { recursive: true })
await writeFile(path.join(evidenceDir, 'optimized-media-upload.json'), `${JSON.stringify({ tenantId, verifiedAt: new Date().toISOString(), count: receipt.length, receipt }, null, 2)}\n`)
console.log(JSON.stringify({ tenantId, uploaded: receipt.length, products: verify.length, backendReadback: true }))
