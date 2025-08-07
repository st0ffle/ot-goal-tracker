"use client"

import { Target, TrendingUp, Award, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PatientBottomNavigationProps {
  currentView: string
  onNavigate: (view: string) => void
  className?: string
}

export function PatientBottomNavigation({ currentView, onNavigate, className }: PatientBottomNavigationProps) {
  /* 
   * TODO: When implementing real authentication system:
   * - Connect this to patient-specific data
   * - Add patient preferences and customization
   * - Implement patient progress tracking
   * - Add gamification elements based on achievements
   * - Consider parental controls for pediatric patients
   */
  
  const navItems = [
    {
      id: 'patient-goals',
      label: 'Objectifs',
      icon: Target,
      description: 'Mes objectifs thérapeutiques'
    },
    {
      id: 'progress', // TODO: Create progress view for patient analytics
      label: 'Progrès',
      icon: TrendingUp,
      description: 'Suivi de mes progrès'
    },
    {
      id: 'achievements', // TODO: Create achievements/rewards system
      label: 'Succès',
      icon: Award,
      description: 'Récompenses et succès'
    },
    {
      id: 'profile', // TODO: Create patient profile view
      label: 'Profil',
      icon: User,
      description: 'Mon profil et paramètres'
    },
  ]

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "bg-white border-t border-green-200", // Different accent color for patients
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
                  ? "text-green-600 bg-green-50" // Green theme for patients
                  : "text-gray-500 hover:text-gray-900"
              )}
              aria-label={item.description}
            >
              <Icon 
                className={cn(
                  "w-6 h-6 mb-1",
                  isActive ? "text-green-600" : "text-gray-400"
                )} 
              />
              <span className={cn(
                isActive ? "text-green-600" : "text-gray-500"
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