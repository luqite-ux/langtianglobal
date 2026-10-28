import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { NodeHttpHandler } from '@smithy/node-http-handler'
import { createClient } from '@supabase/supabase-js'
import { HttpsProxyAgent } from 'https-proxy-agent'

const tenantId = '317a84d7-9b80-4785-bd97-59170f7d2472'
const publicRoot = resolve(import.meta.dirname, '../public')
const dry = process.argv.includes('--dry')
const bucket = process.env.R2_BUCKET_NAME
const publicBase = (process.env.R2_PUBLIC_URL || process.env.R2_PUBLIC_URL_PREFIX || '').replace(/\/$/, '')
for (const key of ['R2_S3_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) {
  if (!process.env[key]) throw new Error(`Missing ${key}`)
}
if (!bucket || !publicBase) throw new Error('Missing R2 bucket or public URL')
const r2 = new S3Client({
  region: 'auto', endpoint: process.env.R2_S3_ENDPOINT,
  ...(process.env.HTTPS_PROXY ? { requestHandler: new NodeHttpHandler({ httpsAgent: new HttpsProxyAgent(process.env.HTTPS_PROXY), connectionTimeout: 5000, requestTimeout: 15000 }) } : {}),
  maxAttempts: 1,
  requestChecksumCalculation: 'WHEN_REQUIRED', responseChecksumValidation: 'WHEN_REQUIRED',
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
})
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } })
const cache = new Map()
const localPath = value => typeof value === 'string' && value.startsWith('/images/')

function collect(value, found) {
  if (localPath(value)) found.add(value)
  else if (Array.isArray(value)) value.forEach(item => collect(item, found))
  else if (value && typeof value === 'object') Object.values(value).forEach(item => collect(item, found))
}

function replace(value) {
  if (localPath(value)) return cache.get(value) || value
  if (Array.isArray(value)) return value.map(replace)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replace(item)]))
  return value
}

async function upload(value) {
  const local = resolve(publicRoot, `.${value}`)
  if (!local.startsWith(publicRoot + sep) || !existsSync(local)) throw new Error(`Missing or invalid local image: ${value}`)
  const bytes = readFileSync(local)
  const digest = createHash('sha256').update(bytes).digest('hex').slice(0, 16)
  const ext = local.toLowerCase().endsWith('.png') ? 'png' : 'jpg'
  const key = `products/${tenantId}/seed/${digest}.${ext}`
  console.log(`${dry ? 'check' : 'upload'} ${value}`)
  if (!dry) await r2.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: bytes,
    ContentType: ext === 'png' ? 'image/png' : 'image/jpeg' }))
  const url = `${publicBase}/${key}`
  cache.set(value, url)
}

async function main() {
  const { data: products, error: productError } = await db.from('products')
    .select('id,slug,image_url,extra_data').eq('tenant_id', tenantId)
  if (productError) throw productError
  const { data: categories, error: categoryError } = await db.from('product_categories')
    .select('id,slug,icon').eq('tenant_id', tenantId)
  if (categoryError) throw categoryError
  if (products.length !== 8 || categories.length !== 4) throw new Error('Unexpected tenant data count')
  const pending = new Set()
  for (const row of products) { collect(row.image_url, pending); collect(row.extra_data, pending) }
  for (const row of categories) collect(row.icon, pending)
  for (const value of pending) await upload(value)
  if (!dry) {
    for (const row of products) {
      const patch = { image_url: replace(row.image_url), extra_data: replace(row.extra_data) }
      const { error } = await db.from('products').update(patch).eq('id', row.id).eq('tenant_id', tenantId)
      if (error) throw error
    }
    for (const row of categories) {
      const { error } = await db.from('product_categories').update({ icon: replace(row.icon) })
        .eq('id', row.id).eq('tenant_id', tenantId)
      if (error) throw error
    }
    const { data: verify, error } = await db.from('products').select('slug,image_url,extra_data').eq('tenant_id', tenantId)
    if (error) throw error
    if (verify.some(row => localPath(row.image_url) || JSON.stringify(row.extra_data).includes('"/images/'))) throw new Error('Local product URL remains')
  }
  console.log(JSON.stringify({ dry, tenantId, products: products.length, categories: categories.length, media: pending.size }))
}

main().catch(error => { console.error(JSON.stringify({ name: error.name, code: error.code, message: error.message, cause: error.cause?.code || error.cause?.message })); process.exitCode = 1 })
