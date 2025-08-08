import type { Metadata } from 'next'
import { CreateGoal } from '@/components/views/create-goal'
import { mockPatients, mockGoals } from '@/lib/mock-data'

interface PageProps {
  searchParams?: Promise<{ patientId?: string }>
}

export const metadata: Metadata = {
  title: 'Créer un objectif - OT Goal Tracker',
  description: 'Créer un nouvel objectif pour un patient'
}

export default async function CreateGoalPage({ searchParams }: PageProps) {
  const params = await searchParams
  const patientId = params?.patientId
  
  return (
    <CreateGoal 
      patients={mockPatients}
      goals={mockGoals}
      initialPatientId={patientId}
    />
  )
}