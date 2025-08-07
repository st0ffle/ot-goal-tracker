"use client"

import { Users, Plus, FileText, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TherapistBottomNavigationProps {
  currentView: string
  onNavigate: (view: string) => void
  className?: string
}

export function TherapistBottomNavigation({ currentView, onNavigate, className }: TherapistBottomNavigationProps) {
  /* 
   * TODO: When implementing real authentication system:
   * - Connect this to actual user permissions
   * - Add role-based access control (RBAC)
   * - Implement user session management
   * - Add logout functionality
   * - Consider user preferences for navigation customization
   */
  
  const navItems = [
    {
      id: 'therapist-dashboard',
      label: 'Patients',
      icon: Users,
      description: 'Gérer mes patients'
    },
    {
      id: 'calendar', // TODO: Create calendar view when implementing scheduling
      label: 'Agenda',
      icon: Calendar,
      description: 'Planning et rendez-vous'
    },
    {
      id: 'create-goal',
      label: 'Créer',
      icon: Plus,
      description: 'Nouvel objectif thérapeutique'
    },
    {
      id: 'reports', // TODO: Create reports view for therapist analytics
      label: 'Rapports',
      icon: FileText,
      description: 'Statistiques et rapports'
    },
  ]

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "bg-white border-t border-gray-200",
      "safe-area-inset-bottom", // iOS safe area
      "md:hidden", // Hide on desktop
      className
    )}>
      <div className="flex">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center",
                "py-3 px-1 min-h-[60px]", // Touch target minimum 60px
                "text-xs font-medium transition-colors",
                "active:bg-gray-100", // Touch feedback
                isActive 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-500 hover:text-gray-900"
              )}
              aria-label={item.description}
            >
              <Icon 
                className={cn(
                  "w-6 h-6 mb-1",
                  isActive ? "text-blue-600" : "text-gray-400"
                )} 
              />
              <span className={cn(
                isActive ? "text-blue-600" : "text-gray-500"
              )}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}