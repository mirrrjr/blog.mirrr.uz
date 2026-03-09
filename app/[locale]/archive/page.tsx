import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { getPostsByLocale } from '@/lib/blog-loader'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { t } from '@/lib/translations'
import { Metadata } from 'next'

interface ArchivePageProps {
  params: Promise<{
    locale: string
  }>
}

export async function generateMetadata({
  params,
}: ArchivePageProps): Promise<Metadata> {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    return {}
  }

  return {
    title: `${t(locale, 'archive_title')} | MIRRR`,
    description: 'All blog posts',
  }
}

export default async function ArchivePage({ params }: ArchivePageProps) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const posts = getPostsByLocale(locale)
  const sortedPosts = [...posts].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-mono font-bold text-primary mb-12">
          {t(locale, 'archive_title')}
        </h1>

        <div className="space-y-6">
          {sortedPosts.map((post) => (
            <PostCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>

        {sortedPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t(locale, 'archive_empty')}</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
