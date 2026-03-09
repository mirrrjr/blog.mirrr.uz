import { redirect } from 'next/navigation'

export default function ArchivePage() {
    // Redirect to the localized archive page (English by default)
    redirect('/en/archive')
}
