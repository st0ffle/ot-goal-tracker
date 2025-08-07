"use client"

import { 
  LoginView, 
  TherapistDashboard, 
  PatientDetail, 
  PatientGoals, 
  CreateGoal 
} from './views'
import { mockPatients, mockGoals } from '@/lib/mock-data'
import { ViewTransition } from './view-transition'
import { TherapistBottomNavigation } from './therapist-bottom-navigation'
import { PatientBottomNavigation } from './patient-bottom-navigation'

interface AppShellProps {
  view: string
  selectedPatient: string | null
  onNavigate: (view: string, data?: any) => void
}

export function AppShell({ view, selectedPatient, onNavigate }: AppShellProps) {
  /*
   * TODO: Replace with real authentication system
   * - Get user type from authentication context/token
   * - Implement proper session management
   * - Add role-based access control
   * - Handle user permissions and restrictions
   * - Add user switching capabilities for testing
   */
  
  // TEMPORARY: Determine user type based on current view
  // In real app, this would come from authentication context
  const getUserType = (): 'therapist' | 'patient' => {
    if (view === 'patient-goals') return 'patient'
    return 'therapist' // Default to therapist for demo
  }
  
  const userType = getUserType()

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
        // Pour la démo, on utilise les objectifs du patient 1
        const patientGoals = mockGoals.filter(g => g.patientId === "1")
        return (
          <PatientGoals 
            goals={patientGoals}
            onNavigate={handleNavigate}
          />
        )
      
      case 'create-goal':
        return (
          <CreateGoal 
            patients={mockPatients}
            goals={mockGoals}
            onNavigate={handleNavigate}
          />
        )
      
      default:
        return <LoginView onNavigate={handleNavigate} />
    }
  }

  return (
    <div className={view !== 'login' ? 'pb-20 md:pb-0' : ''}>
      <ViewTransition viewKey={view}>
        {renderView()}
      </ViewTransition>
      {view !== 'login' && (
        <>
          {userType === 'therapist' ? (
            <TherapistBottomNavigation 
              currentView={view} 
              onNavigate={handleNavigate} 
            />
          ) : (
            <PatientBottomNavigation 
              currentView={view} 
              onNavigate={handleNavigate} 
            />
          )}
        </>
      )}
    </div>
  )
}