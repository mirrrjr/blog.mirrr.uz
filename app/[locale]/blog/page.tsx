import { notFound } from 'next/navigation'
import { isValidLocale, SUPPORTED_LOCALES } from '@/lib/i18n'

interface BlogPageProps {
  params: Promise<{
    locale: string
  }>
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
  }))
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  // This page renders the archive page content
  // Users should navigate to /[locale]/archive for the full blog listing
  notFound()
}
