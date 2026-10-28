'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

export function CopyrightYear({ fallbackYear }: { fallbackYear: number }) {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => fallbackYear,
  )
  return <span>{year}</span>
}
