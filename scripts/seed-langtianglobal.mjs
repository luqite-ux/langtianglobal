import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'
import { createClient } from '@supabase/supabase-js'

const require = createRequire(import.meta.url)
const root = resolve(import.meta.dirname, '..')
const domain = 'langtianglobal.com'
const tenantIdEnv = process.env.NEXT_PUBLIC_TENANT_ID
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) throw new Error('Supabase server environment is missing')

const db = createClient(url, serviceKey, { auth: { persistSession: false } })
const originalRows = JSON.parse(readFileSync(resolve(root, 'deliverables/source-product-rows.json'), 'utf8'))
const media = JSON.parse(readFileSync(resolve(root, 'deliverables/source-product-media.json'), 'utf8'))

function loadTsData(relative, key) {
  const source = readFileSync(resolve(root, relative), 'utf8')
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const module = { exports: {} }
  vm.runInNewContext(code, { exports: module.exports, module, require }, { filename: relative })
  return module.exports[key]
}

function sourceEnglish(row) {
  let value = row.description.split(/English\s*:?\s*/i).at(-1).trim()
  value = value.replace(/\s*wait\.?$/i, '').replace(/。$/, '.')
  if (row.row === 5) {
    // The Chinese and English source disagree (2× vs 4×); omit the figure.
    value = value.replace(/It can expand up to 4 times original thickness under heating with zero spring.back after molding\.\s*/i, '')
  }
  return value
}

async function run() {
  const { data: existing, error: lookupError } = await db.from('tenants')
    .select('id,domain,display_name,admin_group').eq('domain', domain).maybeSingle()
  if (lookupError) throw lookupError
  if (existing && tenantIdEnv && existing.id !== tenantIdEnv) throw new Error('Tenant ID mismatch')
  let tenantId = existing?.id
  if (!tenantId) {
    const logoUrl = process.env.LANGTIAN_LOGO_R2_URL
    const settings = {
      domain, name: 'langtianglobal', display_name: '江苏朗田复合材料有限公司',
      email: 'info@langtianglobal.com', password_hash: 'placeholder-not-used',
      admin_group: 2, default_language: 'en', supported_languages: ['en'],
      brand_color: '#c41223', logo_url: logoUrl || null, favicon_url: logoUrl || null,
      site_title_i18n: { en: 'Langtian | Thermoplastic Composite Sheets and Felts' },
      site_tagline_i18n: { en: 'Thermoplastic composites for automotive interiors' },
      site_description_i18n: { en: 'Jiangsu Langtian Composite Materials Co., Ltd. makes thermoplastic composite sheets and felts for automotive interiors in Xuyi County, Huai’an, Jiangsu.' },
      contact_email: 'info@langtianglobal.com', contact_phone: '17301537592',
      contact_address_short: 'Xinhai Avenue 52-8, Xuyi County Economic Development Zone, Huai’an, Jiangsu, China',
      contact_address_i18n: { en: 'Xinhai Avenue 52-8, Xuyi County Economic Development Zone, Huai’an, Jiangsu, China' },
      social_links: {},
      seo_title_i18n: { en: 'Langtian | Thermoplastic Composite Sheets and Felts' },
      seo_description_i18n: { en: 'Thermoplastic composite sheets and felts for automotive interiors from Jiangsu Langtian Composite Materials Co., Ltd.' },
      seo_keywords_i18n: { en: 'thermoplastic composite sheet, automotive interior felt, LWRT, fiberglass composite panel' },
      extra_settings: {
        translation_profile: {
          industry: 'Automotive interior thermoplastic composites',
          company_summary: 'Jiangsu Langtian Composite Materials Co., Ltd. manufactures composite sheets and felts for automotive interior parts.',
          main_products: ['PP glass fiber board', 'LWRT board', 'LWRTUD felt/sheet', 'PET/PP composite sheet', 'PET non-woven/pile carpet', 'PHC fiberglass composite panel', 'PP bamboo/hemp fiberboard', 'PET foam board'],
          target_markets: [], glossary: {},
        },
        site_settings_source: 'Customer workbook 企业资料 C3/C9/C4; owner-confirmed domain and email; supplied logo',
        site_settings_initialized_at: new Date().toISOString(),
      },
    }
    const created = await db.from('tenants').insert(settings).select('id').single()
    if (created.error) throw created.error
    tenantId = created.data.id
  }
  const categories = loadTsData('lib/data/categories.ts', 'categories')
  for (const [index, category] of categories.entries()) {
    const { data: previousCategory, error: previousCategoryError } = await db.from('product_categories')
      .select('icon').eq('tenant_id', tenantId).eq('slug', category.slug).maybeSingle()
    if (previousCategoryError) throw previousCategoryError
    const result = await db.from('product_categories').upsert({
      tenant_id: tenantId, slug: category.slug, name: category.name,
      name_en: category.name, name_i18n: { en: category.name },
      description: category.summary, description_en: category.summary,
      description_i18n: { en: category.summary },
      icon: previousCategory?.icon?.startsWith('https://') ? previousCategory.icon : category.image.src,
      sort_order: index + 1, is_active: true,
    }, { onConflict: 'tenant_id,slug' })
    if (result.error) throw result.error
  }
  const products = loadTsData('lib/data/products.ts', 'products')
  if (products.length !== 8 || originalRows.length !== 8) throw new Error('Expected exactly eight products')
  for (const [index, product] of products.entries()) {
    const source = originalRows[index]
    const gallery = media.filter(item => item.slug === product.slug).map(item => item.public_path)
    const { data: previous, error: previousError } = await db.from('products')
      .select('image_url,extra_data').eq('tenant_id', tenantId).eq('slug', product.slug).maybeSingle()
    if (previousError) throw previousError
    const publishedGallery = Array.isArray(previous?.extra_data?.images) && previous.extra_data.images.every(url => typeof url === 'string' && url.startsWith('https://'))
      ? previous.extra_data.images : gallery
    const description = product.description.join('\n\n')
    const overview = sourceEnglish(source)
    const result = await db.from('products').upsert({
      tenant_id: tenantId, slug: product.slug, name: product.name, name_en: product.name,
      name_i18n: { en: product.name }, category: categories.find(c => c.slug === product.categorySlug)?.name,
      category_slug: product.categorySlug, description: product.summary,
      description_en: product.summary, description_i18n: { en: product.summary },
      overview: overview, overview_en: overview, overview_i18n: { en: overview },
      features: product.highlights, features_i18n: { en: product.highlights },
      applications: product.applicationSlugs, applications_i18n: { en: product.applicationSlugs },
      advantages: [], advantages_i18n: { en: [] }, specs: product.specs,
      image_url: previous?.image_url?.startsWith('https://') ? previous.image_url : (gallery[0] || null), sort_order: index + 1, is_active: true,
      extra_data: { ...previous?.extra_data, images: publishedGallery, moq: product.moq, source_workbook_row: source.row,
        source_sku: source.sku || null, source_category_zh: source.category_zh,
        source_category_en: source.category_en, source_name_zh: source.name_zh,
        source_name_en: source.name_en, source_description_raw: source.description,
        source_specifications_raw: source.specifications, source_moq_raw: source.moq,
        source_description_zh: source.description.split(/English/i)[0].trim(),
        product_form: product.form, visual_description: description },
    }, { onConflict: 'tenant_id,slug' })
    if (result.error) throw result.error
  }
  const { data: tenant, error: readError } = await db.from('tenants')
    .select('id,domain,display_name,admin_group,default_language,supported_languages,logo_url')
    .eq('id', tenantId).single()
  if (readError) throw readError
  const { count, error: countError } = await db.from('products')
    .select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId)
  if (countError) throw countError
  if (count !== 8 || tenant.admin_group !== 2) throw new Error('Seed readback failed')
  console.log(JSON.stringify({ tenant, products: count, categories: categories.length }))
}

run().catch(error => { console.error(error.message); process.exitCode = 1 })
