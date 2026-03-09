import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getPostsByLocale } from '@/lib/blog-loader'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { t } from '@/lib/translations'
import { Metadata } from 'next'

interface TagsPageProps {
  params: Promise<{
    locale: string
  }>
}

export async function generateMetadata({
  params,
}: TagsPageProps): Promise<Metadata> {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    return {}
  }

  return {
    title: `${t(locale, 'tags_title')} | MIRRR`,
    description: 'Browse posts by tag',
  }
}

export default async function TagsPage({ params }: TagsPageProps) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const posts = getPostsByLocale(locale)

  // Get all unique tags with their post counts
  const tagMap = new Map<string, number>()

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })

  const sortedTags = Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-mono font-bold text-primary mb-12">
          {t(locale, 'tags_title')}
        </h1>

        <div className="flex flex-wrap gap-4">
          {sortedTags.map(([tag, count]) => (
            <Link
              key={tag}
              href={`/${locale}/tags/${tag}`}
              className="px-4 py-2 border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
            >
              <span className="font-mono font-semibold">#{tag}</span>
              <span className="ml-2 text-sm text-muted-foreground">
                ({count})
              </span>
            </Link>
          ))}
        </div>

        {sortedTags.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t(locale, 'tags_empty')}</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
