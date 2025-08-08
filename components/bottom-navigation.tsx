"use client" // Gardé car pathname dynamique

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Target, Award, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNavigation() {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/therapist', icon: Home, label: 'Accueil' },
    { href: '/patients', icon: Users, label: 'Patients' },
    { href: '/goals', icon: Target, label: 'Objectifs' },
    { href: '/rewards', icon: Award, label: 'Récompenses' },
    { href: '/profile', icon: User, label: 'Profil' },
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
                "flex flex-col items-center py-2 px-3",
                isActive ? "text-blue-600" : "text-gray-600"
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