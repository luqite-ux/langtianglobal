import { CategoryCard } from '@/components/products/category-card'
import { Reveal } from '@/components/site/reveal'
import { Section, SectionHeading } from '@/components/site/section'
import { getCategories, getProducts } from '@/lib/data'
import { cmsText } from '@/lib/site-content/read'
import type { SiteModuleProps } from '@/lib/site-content/render-page'

export async function MaterialFamilies({ content }: { content?: SiteModuleProps }) {
  const [categories, products] = await Promise.all([getCategories(), getProducts()])
  return (
    <Section labelledBy="families-title">
      <SectionHeading
        id="families-title"
        eyebrow={cmsText(content, 'eyebrow', 'Material families')}
        title={cmsText(content, 'title', 'Which kind of material does your part need?')}
        description={cmsText(content, 'description', 'Start with the form: flat sheet, felt or non-woven, sandwich panel or natural-fiber board. Each family opens its own product list.')}
      />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, i) => (
          <Reveal as="li" key={category.slug} delay={i * 70}>
            <CategoryCard
              category={category}
              count={products.filter((p) => p.categorySlug === category.slug).length}
            />
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
