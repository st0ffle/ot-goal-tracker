"use client"

import { BottomNavigation } from '@/components/bottom-navigation'
import { usePathname } from 'next/navigation'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPatientView = pathname.startsWith('/patient/') && !pathname.includes('create-goal')
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className={isPatientView ? "" : "pb-20 md:pb-0"}>
        {children}
      </div>
      <BottomNavigation />
    </div>
  )
}