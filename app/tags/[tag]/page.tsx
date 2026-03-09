import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/lib/i18n'

interface TagPageProps {
  params: Promise<{
    tag: string
  }>
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params

  // Redirect to the new localized tag URL
  redirect(`/${DEFAULT_LOCALE}/tags/${tag}`)
}
