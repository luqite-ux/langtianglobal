/**
 * Locale-ready data helpers. Records are authored in English and may carry
 * `translations` overrides. A locale is only offered in the UI when it appears
 * in `enabledLocales`, so no empty languages are ever shown.
 */
export const locales = ['en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const enabledLocales: readonly Locale[] = ['en']

export type Translations<T> = Partial<Record<Locale, Partial<T>>>

export function localize<
  T extends { translations?: Translations<Omit<T, 'translations'>> },
>(record: T, locale: Locale = defaultLocale): T {
  const override = record.translations?.[locale]
  return override ? { ...record, ...override } : record
}
