import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const tenantId = '317a84d7-9b80-4785-bd97-59170f7d2472'
const email = 'info@langtianglobal.com'
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) throw new Error('Supabase server environment is missing')

if (process.stdin.isTTY) process.stdin.setRawMode(true)
const password = await new Promise(resolvePassword => {
  let input = ''
  process.stdin.on('data', chunk => {
    input += chunk.toString('utf8')
    if (input.includes('\n') || input.includes('\r')) {
      process.stdin.setRawMode?.(false)
      process.stdin.pause()
      resolvePassword(input.split(/[\r\n]/)[0])
    }
  })
  process.stdin.resume()
})
if (password.length < 8) throw new Error('Password input is missing')
const db = createClient(url, key, { auth: { persistSession: false } })
const { data: duplicate, error: duplicateError } = await db.from('admin_users')
  .select('id,tenant_id,email').eq('email', email).maybeSingle()
if (duplicateError) throw duplicateError
if (duplicate && duplicate.tenant_id !== tenantId) throw new Error('Email belongs to another tenant')
if (duplicate) {
  console.log(JSON.stringify({ result: 'existing', tenantId, email }))
  process.exit(0)
}
const passwordHash = await bcrypt.hash(password, 12)
const { data: created, error: createError } = await db.from('admin_users').insert({
  email, password_hash: passwordHash, name: 'Langtian Administrator', role: 'admin',
  is_active: true, tenant_id: tenantId, admin_group: 2, must_change_password: false,
  seo_access: false, ads_access: false,
}).select('id,email,tenant_id,must_change_password').single()
if (createError) throw createError
console.log(JSON.stringify({ result: 'created', ...created }))
