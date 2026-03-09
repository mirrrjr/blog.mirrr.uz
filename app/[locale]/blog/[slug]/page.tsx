import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import {
  getPostsByLocale,
  getPostBySlugAndLocale,
  generateStaticParams as getBlogStaticParams,
} from '@/lib/blog-loader'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { t } from '@/lib/translations'
import { Metadata } from 'next'

interface PostPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { locale, slug } = await params

  if (!isValidLocale(locale)) {
    return {}
  }

  const post = getPostBySlugAndLocale(slug, locale)

  if (!post) {
    return {}
  }

  return {
    title: `${post.title} | Terminus`,
    description: post.excerpt,
  }
}

export async function generateStaticParams() {
  return getBlogStaticParams()
}

export default async function PostPage({ params }: PostPageProps) {
  const { locale, slug } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const post = getPostBySlugAndLocale(slug, locale)

  if (!post) {
    notFound()
  }

  const allPosts = getPostsByLocale(locale)
  const postIndex = allPosts.findIndex(p => p.slug === slug)
  const nextPost = postIndex > 0 ? allPosts[postIndex - 1] : null

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(post.date)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Post Header */}
        <article>
          <h1 className="text-4xl font-mono font-bold text-primary mb-2">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
            <span>{formattedDate}</span>
            <span>·</span>
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.readingTime} min read</span>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/${locale}/tags/${tag}`}
                  className="inline-block px-2 py-1 text-xs bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose-like max-w-none mb-12">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Next Post */}
          {nextPost && (
            <div className="border-t border-border pt-12">
              <h2 className="text-sm font-mono text-muted-foreground mb-4">
                {t(locale, 'next_post')}
              </h2>
              <Link
                href={`/${locale}/blog/${nextPost.slug}`}
                className="group block"
              >
                <h3 className="text-2xl font-mono font-semibold text-primary group-hover:text-accent transition-colors">
                  {nextPost.title} {'→'}
                </h3>
              </Link>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  )
}
