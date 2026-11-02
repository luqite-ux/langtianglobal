import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('PP and LWRT product galleries use their confirmed image groups', async () => {
  const source = await read('lib/data/products.ts')

  assert.match(source, /images: productImages\('pp-glass-fiber-board', \[3, 4\]/)
  assert.match(source, /images: productImages\('pp-glass-fiber-board', \[1, 2, 5\]/)
})

test('every application has a relevant image and the former PHC spare-cover image is removed', async () => {
  const source = await read('lib/data/applications.ts')

  for (const slug of [
    'headliners',
    'door-panels',
    'luggage-compartment-liners',
    'spare-tire-covers',
    'other-interior-structures',
  ]) {
    const entry = source.match(new RegExp(`slug: '${slug}'[\\s\\S]*?(?=\\n  \\{\\n    slug:|\\n\\])`))?.[0]
    assert.ok(entry, `missing application ${slug}`)
    assert.match(entry, /image: \{/)
  }

  assert.doesNotMatch(source, /molded-cover-stack\.jpg/)
})

test('application images fill their frames and quality layouts match the requested alignment', async () => {
  const [applicationsPage, homeQuality, qualityPage] = await Promise.all([
    read('app/applications/page.tsx'),
    read('components/home/quality-context.tsx'),
    read('app/quality/page.tsx'),
  ])

  assert.match(applicationsPage, /className="object-cover"/)
  assert.doesNotMatch(applicationsPage, /object-contain mix-blend-multiply/)
  assert.match(homeQuality, /className="mt-8 lg:mt-10"/)
  assert.match(homeQuality, /lg:pt-12/)
  assert.match(qualityPage, /lg:self-center/)
})

test('product category artwork fills the card image stage without side gaps', async () => {
  const source = await read('components/products/category-card.tsx')

  assert.match(source, /className="object-cover transition-transform/)
  assert.doesNotMatch(source, /object-contain mix-blend-multiply/)
})
