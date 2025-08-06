"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"

export default function OTGoalTracker() {
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