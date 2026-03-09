import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { getPostsByLocale } from '@/lib/blog-loader'
import { isValidLocale, type Locale, SUPPORTED_LOCALES } from '@/lib/i18n'
import { t } from '@/lib/translations'

interface HomepageProps {
  params: Promise<{
    locale: string
  }>
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
  }))
}

export default async function Homepage({ params }: HomepageProps) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const allPosts = getPostsByLocale(locale)
  const featuredPost = allPosts[0]
  const otherPosts = allPosts.slice(1)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <section className="mb-12 border border-border p-6">
          <h1 className="text-2xl font-mono font-bold text-primary mb-4">
            {t(locale, 'hero_title')}
          </h1>
          <p className="text-foreground mb-3">{t(locale, 'hero_intro')}</p>
          <p className="text-foreground mb-3">{t(locale, 'hero_hobby')}</p>
          <p className="text-foreground">
            {locale === 'en' ? (
              <>
                Feel free to look around — check out my{' '}
                <Link href={`/${locale}/archive`} className="text-primary hover:text-accent underline">
                  {t(locale, 'link_blog')}
                </Link>
                , browse my{' '}
                <Link href={`/${locale}/projects`} className="text-primary hover:text-accent underline">
                  {t(locale, 'link_projects')}
                </Link>
                , or just say{' '}
                <Link href="mailto:mirrrrjr@gmail.com" className="text-primary hover:text-accent underline">
                  {t(locale, 'link_hi')}
                </Link>
                .
              </>
            ) : (
              <>
                Erkin o&apos;rtasida aylanib ko&apos;ring — mening{' '}
                <Link href={`/${locale}/archive`} className="text-primary hover:text-accent underline">
                  {t(locale, 'link_blog')}
                </Link>
                imni tekshiring, mening{' '}
                <Link href={`/${locale}/projects`} className="text-primary hover:text-accent underline">
                  {t(locale, 'link_projects')}
                </Link>
                larimni ko&apos;rib chiqing yoki shunchaki{' '}
                <Link href="mailto:mirrrrjr@gmail.com" className="text-primary hover:text-accent underline">
                  {t(locale, 'link_hi')}
                </Link>
                ayting.
              </>
            )}
          </p>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-12">
            <h2 className="text-xl font-mono font-semibold text-primary mb-6">
              {t(locale, 'latest_post')}
            </h2>
            <PostCard post={featuredPost} locale={locale} />
          </section>
        )}

        {/* Recent Posts */}
        {otherPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-mono font-semibold text-primary mb-6">
              {t(locale, 'more_posts')}
            </h2>
            <div className="space-y-6">
              {otherPosts.map((post) => (
                <PostCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          </section>
        )}

        {/* Read More Link */}
        {allPosts.length > 0 && (
          <section className="text-center border-t border-b border-border py-8">
            <Link
              href={`/${locale}/archive`}
              className="inline-block text-primary hover:text-accent font-mono font-semibold underline"
            >
              {t(locale, 'read_more')}
            </Link>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
