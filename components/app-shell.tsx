"use client"

import { 
  LoginView, 
  TherapistDashboard, 
  PatientDetail, 
  PatientGoals, 
  CreateGoal 
} from './views'
import { mockPatients, mockGoals, mockPatientGoals } from '@/lib/mock-data'

interface AppShellProps {
  view: string
  selectedPatient: string | null
  onNavigate: (view: string, data?: any) => void
}

export function AppShell({ view, selectedPatient, onNavigate }: AppShellProps) {
  // Navigation handler avec gestion du state
  const handleNavigate = (newView: string, data?: any) => {
    onNavigate(newView, data)
  }

  switch (view) {
    case 'login':
      return <LoginView onNavigate={handleNavigate} />
    
    case 'therapist-dashboard':
      return (
        <TherapistDashboard 
          patients={mockPatients} 
          onNavigate={handleNavigate} 
        />
      )
    
    case 'patient-detail':
      const patient = mockPatients.find(p => p.id === selectedPatient)
      if (!patient) return null
      return (
        <PatientDetail 
          patient={patient}
          goals={mockGoals}
          onNavigate={handleNavigate}
        />
      )
    
    case 'patient-goals':
      return (
        <PatientGoals 
          goals={mockPatientGoals}
          onNavigate={handleNavigate}
        />
      )
    
    case 'create-goal':
      return (
        <CreateGoal 
          patients={mockPatients}
          onNavigate={handleNavigate}
        />
      )
    
    default:
      return <LoginView onNavigate={handleNavigate} />
  }
}