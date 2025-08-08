import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirection immédiate vers login
  // En production, vérifier d'abord la session
  redirect('/login')
}