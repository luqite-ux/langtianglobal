import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'
import { createClient } from '@supabase/supabase-js'

const root = resolve(import.meta.dirname, '..')
const env = Object.fromEntries(readFileSync(resolve(root, '.env.local'), 'utf8').split(/\r?\n/)
  .map(line => line.match(/^([^#=]+)=(.*)$/)).filter(Boolean)
  .map(match => [match[1].trim(), match[2].trim().replace(/^['"]|['"]$/g, '')]))
const tenantId = env.NEXT_PUBLIC_TENANT_ID
if (!tenantId || !env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw Error('Missing tenant-scoped database configuration')
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const source = readFileSync(resolve(root, 'lib/data/products.ts'), 'utf8')
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
const module = { exports: {} }
vm.runInNewContext(code, { exports: module.exports, module, require: createRequire(import.meta.url) }, { filename: 'products.ts' })
const products = module.exports.products
const links = new Map(products.map(product => [product.slug, product.relatedSlugs || []]))
const { data: rows, error } = await db.from('products').select('id,slug,extra_data').eq('tenant_id', tenantId)
if (error) throw error
if (rows.length !== links.size || rows.some(row => !links.has(row.slug))) throw Error('Product inventory mismatch')
for (const row of rows) {
  if (Array.isArray(row.extra_data?.related_slugs)) continue
  const relatedSlugs = links.get(row.slug)
  if (relatedSlugs.some(slug => !links.has(slug))) throw Error(`Unknown related product: ${row.slug}`)
  const { error: updateError } = await db.from('products').update({ extra_data: { ...row.extra_data, related_slugs: relatedSlugs } })
    .eq('tenant_id', tenantId).eq('id', row.id)
  if (updateError) throw updateError
}
const { data: verified, error: verifyError } = await db.from('products').select('slug,extra_data').eq('tenant_id', tenantId)
if (verifyError) throw verifyError
if (verified.some(row => JSON.stringify(row.extra_data?.related_slugs) !== JSON.stringify(links.get(row.slug)))) throw Error('Related product readback mismatch')
console.log(JSON.stringify({ tenantId, products: verified.length, relatedLinks: verified.reduce((sum, row) => sum + row.extra_data.related_slugs.length, 0), result: 'PASS' }))
