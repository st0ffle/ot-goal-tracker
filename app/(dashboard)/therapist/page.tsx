import type { Metadata } from 'next'
import { TherapistDashboard } from '@/components/views/therapist-dashboard'
import { mockPatients, mockGoals } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Tableau de bord - OT Goal Tracker',
  description: 'Gérez vos patients et leurs objectifs'
}

export default function TherapistDashboardPage() {
  // En production: fetch depuis DB/API
  const patients = mockPatients
  const goals = mockGoals
  
  return (
    <TherapistDashboard 
      patients={patients}
      goals={goals}
    />
  )
}