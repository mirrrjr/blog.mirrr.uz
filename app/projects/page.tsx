import { redirect } from 'next/navigation'

export default function ProjectsPage() {
    // Redirect to the localized projects page (English by default)
    redirect('/en/projects')
}
