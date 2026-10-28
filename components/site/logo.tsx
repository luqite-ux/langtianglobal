import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative block aspect-[2/1] h-10 shrink-0 overflow-hidden rounded-[3px]',
        className,
      )}
    >
      <Image
        src="/images/brand/langtian-logo.jpg"
        alt="Langtian logo"
        fill
        sizes="96px"
        className="object-contain"
        priority
      />
    </span>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M22 12H30A4 4 0 0 1 34 16V38H48A4 4 0 0 1 52 42V48A4 4 0 0 1 48 52H22A4 4 0 0 1 18 48V16A4 4 0 0 1 22 12Z" />
    </svg>
  )
}
