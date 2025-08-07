"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"

export default function OTGoalTracker() {
  /*
   * TODO: Replace with real authentication and routing system
   * - Implement Next.js App Router with proper route protection
   * - Add authentication providers (NextAuth, Auth0, Supabase Auth, etc.)
   * - Replace useState with proper state management (Zustand, Redux, Context)
   * - Add persistent sessions and refresh tokens
   * - Implement proper user onboarding flow
   * - Add loading states and error boundaries
   */
  
  const [currentView, setCurrentView] = useState("login")
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [userType, setUserType] = useState<"therapist" | "patient" | null>(null)

  const handleNavigate = (view: string, data?: any) => {
    setCurrentView(view)
    
    // Gestion des données spécifiques à la navigation
    if (view === "patient-detail" && data) {
      setSelectedPatient(data)
    }
    
    if (view === "therapist-dashboard" && data === "therapist") {
      setUserType("therapist")
    }
    
    if (view === "patient-goals" && data === "patient") {
      setUserType("patient")
    }
  }

  return (
    <AppShell 
      view={currentView}
      selectedPatient={selectedPatient}
      onNavigate={handleNavigate}
    />
  )
}