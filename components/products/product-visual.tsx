import { LogoMark } from '@/components/site/logo'
import type { ProductImage } from '@/lib/data/types'
import { cn } from '@/lib/utils'

/**
 * Show each source photograph at its natural ratio so the full product and its
 * real photographic background remain visible without an inset stage or seam.
 */
export function ProductVisual({
  image,
  sizes,
  priority,
  className,
}: {
  image?: ProductImage
  sizes: string
  priority?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'bg-secondary relative w-full',
        !image && 'aspect-square',
        className,
      )}
    >
      {image ? (
        // Customer-supplied photos have varied native ratios; a natural-sized image
        // avoids contain letterboxing and cover cropping in both grids and details.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.src}
          alt={image.alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          className="block h-auto w-full"
        />
      ) : (
        <div className="text-muted-foreground absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <LogoMark className="text-primary/25 size-16" />
          <p className="text-xs font-medium tracking-wide uppercase">
            Product photograph to be added
          </p>
        </div>
      )}
    </div>
  )
}
