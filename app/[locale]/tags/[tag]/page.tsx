import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { getPostsByLocale } from '@/lib/blog-loader'
import { isValidLocale, type Locale, SUPPORTED_LOCALES } from '@/lib/i18n'
import { Metadata } from 'next'

interface TagPageProps {
  params: Promise<{
    locale: string
    tag: string
  }>
}

export function generateStaticParams() {
  const params: Array<{ locale: string; tag: string }> = []
  
  SUPPORTED_LOCALES.forEach((locale) => {
    const posts = getPostsByLocale(locale)
    const tags = new Set<string>()
    
    posts.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag))
    })
    
    tags.forEach((tag) => {
      params.push({ locale, tag })
    })
  })
  
  return params
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { locale, tag } = await params

  if (!isValidLocale(locale)) {
    return {}
  }

  return {
    title: `#${tag} | MIRRR`,
    description: `Posts tagged with ${tag}`,
  }
}

export async function generateStaticParams() {
  const locales = ['en', 'uz'] as const
  const allParams: Array<{ locale: string; tag: string }> = []

  for (const locale of locales) {
    const posts = getPostsByLocale(locale)
    const tags = new Set<string>()
    posts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag))
    })

    for (const tag of tags) {
      allParams.push({ locale, tag })
    }
  }

  return allParams
}

export default async function TagPage({ params }: TagPageProps) {
  const { locale, tag } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const allPosts = getPostsByLocale(locale)
  const postsWithTag = allPosts.filter(post => post.tags.includes(tag))

  if (postsWithTag.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-mono font-bold text-primary mb-2">
          #{tag}
        </h1>
        <p className="text-muted-foreground mb-12">
          {postsWithTag.length} post{postsWithTag.length !== 1 ? 's' : ''}
        </p>

        <div className="space-y-6">
          {postsWithTag.map((post) => (
            <PostCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
