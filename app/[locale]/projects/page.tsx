import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { isValidLocale, type Locale, SUPPORTED_LOCALES } from '@/lib/i18n'
import { t } from '@/lib/translations'
import { Metadata } from 'next'

interface ProjectsPageProps {
  params: Promise<{
    locale: string
  }>
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
  }))
}

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    return {}
  }

  return {
    title: `${t(locale, 'projects_title')} | MIRRR`,
    description: 'My projects',
  }
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-mono font-bold text-primary mb-12">
          {t(locale, 'projects_title')}
        </h1>

        <div className="text-center py-12">
          <p className="text-muted-foreground">{t(locale, 'projects_empty')}</p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
