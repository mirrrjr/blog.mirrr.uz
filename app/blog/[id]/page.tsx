import { redirect, notFound } from 'next/navigation'
import { getPostBySlugAndLocale, getAllPostSlugs } from '@/lib/blog-loader'
import { DEFAULT_LOCALE } from '@/lib/i18n'

interface PostPageProps {
    params: Promise<{
        id: string
    }>
}

export async function generateStaticParams() {
    // Return empty array - old routes will redirect
    return []
}

export default async function PostPage({ params }: PostPageProps) {
    const { id } = await params

    // Try to find the post using the old id format
    // First check if it exists as a slug in the new system
    const post = getPostBySlugAndLocale(id, DEFAULT_LOCALE)

    if (!post) {
        notFound()
    }

    // Redirect to the new localized URL
    redirect(`/${DEFAULT_LOCALE}/blog/${post.slug}`)
}
