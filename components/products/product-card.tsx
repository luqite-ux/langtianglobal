import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductVisual } from '@/components/products/product-visual'
import type { Product, ProductCategory } from '@/lib/data/types'

export function ProductCard({
  product,
  category,
  priority,
}: {
  product: Product
  category?: ProductCategory
  priority?: boolean
}) {
  return (
    <article className="group bg-card focus-within:border-primary hover:border-primary/70 relative flex h-full flex-col border transition-colors">
      <ProductVisual
        image={product.images[0]}
        priority={priority}
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
      />
      <div className="flex flex-1 flex-col p-5">
        {category && (
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {category.name}
          </p>
        )}
        <h3 className="mt-1.5 text-lg leading-snug font-bold">
          <Link
            href={`/products/${product.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-offset-[-3px]"
          >
            {product.name}
          </Link>
        </h3>
        <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
          {product.summary}
        </p>
        <span className="text-primary mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold">
          View details
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </span>
      </div>
    </article>
  )
}
