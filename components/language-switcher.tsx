'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname()

  const getLocalizedPath = (newLocale: Locale) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(/^\/(en|uz)/, '') || '/'
    return `/${newLocale}${pathWithoutLocale}`
  }

  return (
    <div className="flex gap-2 items-center text-sm">
      {SUPPORTED_LOCALES.map(locale => (
        <Link
          key={locale}
          href={getLocalizedPath(locale)}
          className={`font-mono transition-colors ${
            currentLocale === locale
              ? 'text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}
