import React from 'react'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale, SUPPORTED_LOCALES } from '@/lib/i18n'

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
  }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}
