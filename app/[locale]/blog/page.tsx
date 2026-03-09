import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n'

interface BlogPageProps {
  params: Promise<{
    locale: string
  }>
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
