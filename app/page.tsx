import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redirect to the localized homepage (English by default)
  // The middleware will handle the actual locale routing
  redirect('/en')
}
