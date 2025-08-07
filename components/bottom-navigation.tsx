"use client"

import { Home, Users, Target, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavigationProps {
  currentView: string
  onNavigate: (view: string) => void
  className?: string
}

export function BottomNavigation({ currentView, onNavigate, className }: BottomNavigationProps) {
  const navItems = [
    {
      id: 'therapist-dashboard',
      label: 'Dashboard',
      icon: Home,
    },
    {
      id: 'patient-detail',
      label: 'Patients',
      icon: Users,
    },
    {
      id: 'patient-goals',
      label: 'Objectifs',
      icon: Target,
    },
    {
      id: 'create-goal',
      label: 'Créer',
      icon: Plus,
    },
  ]

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "bg-white border-t border-gray-200",
      "safe-area-inset-bottom", // iOS safe area
      "md:hidden", // Masquer sur desktop
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
                "active:bg-gray-100", // Feedback tactile
                isActive 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-500 hover:text-gray-900"
              )}
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