import type { Metadata } from 'next'
import { LoginView } from '@/components/views/login-view'

export const metadata: Metadata = {
  title: 'Connexion - OT Goal Tracker',
  description: 'Connectez-vous à votre espace ergothérapeute'
}

export default function LoginPage() {
  return <LoginView />
}