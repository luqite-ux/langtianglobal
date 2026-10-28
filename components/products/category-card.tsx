import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ProductCategory } from '@/lib/data/types'

export function CategoryCard({
  category,
  count,
}: {
  category: ProductCategory
  count: number
}) {
  return (
    <article className="group bg-card focus-within:border-primary hover:border-primary/70 relative flex h-full flex-col border transition-colors">
      <div className="bg-secondary relative aspect-[4/3] overflow-hidden">
        <Image
          src={category.image.src}
          alt={category.image.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
          className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold">
          <Link
            href={`/products?category=${category.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-offset-[-3px]"
          >
            {category.name}
          </Link>
        </h3>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          {category.summary}
        </p>
        <span className="text-primary mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold">
          {count} {count === 1 ? 'product' : 'products'}
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </span>
      </div>
    </article>
  )
}
