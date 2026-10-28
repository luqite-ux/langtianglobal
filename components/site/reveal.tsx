'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'article'
}

/**
 * Each instance owns its own IntersectionObserver and animates once when it
 * enters the viewport. Nothing runs on a shared timer, so sections that have
 * not been seen yet are never consumed. Without JavaScript the content stays
 * visible because the hidden state is only applied after mount.
 */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [state, setState] = useState<'initial' | 'pending' | 'shown'>('initial')

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined'
    ) {
      setState('shown')
      return
    }

    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      setState('shown')
      return
    }

    setState('pending')
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('shown')
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const Tag = as as 'div'
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      data-reveal={state === 'initial' ? undefined : state}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  )
}
