"use client" // Gardé car pathname dynamique

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNavigation() {
  const pathname = usePathname()
  
  // Ne pas afficher la navigation sur les pages patient
  const isPatientView = pathname.startsWith('/patient/') && !pathname.includes('create-goal')
  if (isPatientView) {
    return null
  }
  
  // Navigation pour ergothérapeute uniquement
  const navItems = [
    { href: '/therapist', icon: Users, label: 'Patients' },
    { href: '/patient/create-goal', icon: Plus, label: 'Créer' },
  ]
  
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-2 px-3 flex-1",
                isActive || (item.href.includes('#') && pathname.includes(item.href.split('#')[0]))
                  ? "text-blue-600" 
                  : "text-gray-600"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}