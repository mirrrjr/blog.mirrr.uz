export type Locale = 'en' | 'uz'

export const SUPPORTED_LOCALES: Locale[] = ['en', 'uz']
export const DEFAULT_LOCALE: Locale = 'en'

export function isValidLocale(locale: unknown): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale)
}

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  uz: 'O\'zbek',
}
