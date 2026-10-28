import Image from 'next/image'
import { LogoMark } from '@/components/site/logo'
import type { ProductImage } from '@/lib/data/types'
import { cn } from '@/lib/utils'

/**
 * Product photographs sit on one continuous neutral tile with `contain`, so
 * the whole sheet or felt stays visible and the photo background merges with
 * the tile instead of floating in a frame.
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
        'bg-secondary relative aspect-square w-full overflow-hidden',
        className,
      )}
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain mix-blend-multiply"
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
