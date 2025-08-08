import { BottomNavigation } from '@/components/bottom-navigation'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-20 md:pb-0">
        {children}
      </div>
      <BottomNavigation />
    </div>
  )
}