'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { heroSlides } from '@/lib/hero-slides'
import { cn } from '@/lib/utils'

const INTERVAL_MS = 8000

export function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [engaged, setEngaged] = useState(false)
  const [inView, setInView] = useState(true)
  const rootRef = useRef<HTMLElement>(null)
  const count = heroSlides.length

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(query.matches)
    const onChange = () => setReducedMotion(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const node = rootRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const playing = !userPaused && !reducedMotion && !engaged && inView

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL_MS)
    return () => window.clearTimeout(timer)
  }, [playing, index, count])

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  )

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="Langtian highlights"
      className="on-dark bg-ink text-ink-foreground relative overflow-hidden"
      onMouseEnter={() => setEngaged(true)}
      onMouseLeave={() => setEngaged(false)}
      onFocusCapture={() => setEngaged(true)}
      onBlurCapture={() => setEngaged(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(index + 1)
        if (event.key === 'ArrowLeft') go(index - 1)
      }}
    >
      <h1 className="sr-only">
        Langtian thermoplastic composite sheets and felts for automotive interiors
      </h1>

      <div className="grid">
        {heroSlides.map((slide, i) => {
          const active = i === index
          const right = slide.copySide === 'right'
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              className={cn(
                'relative col-start-1 row-start-1 min-h-[700px] transition-opacity duration-700 ease-out lg:min-h-[560px]',
                active ? 'visible opacity-100' : 'invisible opacity-0',
              )}
            >
              <div className="absolute inset-x-0 top-0 h-[400px] lg:inset-0 lg:h-auto">
                <Image
                  src={slide.image.src}
                  alt={slide.image.alt}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="[object-position:var(--pos-sm)] object-cover lg:[object-position:var(--pos-lg)]"
                  style={
                    {
                      '--pos-sm': slide.image.mobilePosition,
                      '--pos-lg': slide.image.desktopPosition,
                    } as React.CSSProperties
                  }
                />
              </div>

              <div
                aria-hidden="true"
                className="from-ink/0 via-ink/35 to-ink absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b lg:hidden"
              />
              <div
                aria-hidden="true"
                className={cn(
                  'absolute inset-0 hidden lg:block',
                  right
                    ? 'bg-gradient-to-l from-black/55 via-black/15 to-transparent'
                    : 'bg-gradient-to-r from-black/35 via-black/10 to-transparent',
                )}
              />

              <div className="relative mx-auto flex h-full max-w-7xl px-5 pt-[250px] pb-24 sm:px-8 lg:items-center lg:pt-0 lg:pb-16">
                <div
                  className={cn('w-full lg:w-[46%] xl:w-[42%]', right && 'lg:ml-auto')}
                >
                  <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-white uppercase">
                    <span
                      aria-hidden="true"
                      className="size-2.5 shrink-0 border-b-2 border-l-2 border-[oklch(0.7_0.2_28)]"
                    />
                    {slide.eyebrow}
                  </p>
                  <h2 className="mt-3 text-[2rem] leading-[1.08] font-bold tracking-tight text-white sm:text-5xl">
                    {slide.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
                    {slide.text}
                  </p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={slide.primary.href}
                      tabIndex={active ? 0 : -1}
                      className="text-ink inline-flex h-12 items-center justify-center bg-white px-7 text-sm font-semibold transition-colors hover:bg-[oklch(0.94_0.03_28)]"
                    >
                      {slide.primary.label}
                    </Link>
                    <Link
                      href={slide.secondary.href}
                      tabIndex={active ? 0 : -1}
                      className="inline-flex h-12 items-center justify-center border border-white/70 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      {slide.secondary.label}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 pb-5 sm:px-8">
          <div className="pointer-events-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className="grid size-11 place-items-center border border-white/40 text-white hover:bg-white/10"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next slide"
              className="grid size-11 place-items-center border border-white/40 text-white hover:bg-white/10"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
            {!reducedMotion && (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? 'Start automatic slide rotation' : 'Pause automatic slide rotation'}
                className="grid size-11 place-items-center border border-white/40 text-white hover:bg-white/10"
              >
                {userPaused ? (
                  <Play aria-hidden="true" className="size-4" />
                ) : (
                  <Pause aria-hidden="true" className="size-4" />
                )}
              </button>
            )}
          </div>
          <div className="pointer-events-auto ml-2 flex items-center">
            {heroSlides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show slide ${i + 1} of ${count}`}
                aria-current={i === index ? 'true' : undefined}
                className="group grid h-11 w-9 place-items-center"
              >
                <span
                  className={cn(
                    'block h-1 w-7 transition-colors',
                    i === index ? 'bg-white' : 'bg-white/40 group-hover:bg-white/70',
                  )}
                />
              </button>
            ))}
          </div>
          <p className="sr-only" aria-live={playing ? 'off' : 'polite'}>
            Slide {index + 1} of {count}
          </p>
        </div>
      </div>
    </section>
  )
}
