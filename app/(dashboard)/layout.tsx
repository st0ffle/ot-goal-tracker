import { AppShell } from '@/components/app-shell'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // En production: vérifier auth ici
  return (
    <AppShell>
      {children}
    </AppShell>
  )
}