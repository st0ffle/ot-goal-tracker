"use client"

import { 
  LoginView, 
  TherapistDashboard, 
  PatientDetail, 
  PatientGoals, 
  CreateGoal 
} from './views'
import { mockPatients, mockGoals, mockPatientGoals } from '@/lib/mock-data'
import { ViewTransition } from './view-transition'

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

  const renderView = () => {
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

  return (
    <ViewTransition viewKey={view}>
      {renderView()}
    </ViewTransition>
  )
}