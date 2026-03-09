import { redirect } from 'next/navigation'

export default function TagsPage() {
    // Redirect to the localized tags page (English by default)
    redirect('/en/tags')
}
