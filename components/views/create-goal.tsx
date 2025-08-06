"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Patient {
  id: string
  name: string
  age: number
}

interface CreateGoalProps {
  patients: Patient[]
  onNavigate: (view: string) => void
}

export function CreateGoal({ patients, onNavigate }: CreateGoalProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => onNavigate("therapist-dashboard")}
                className="mr-4"
              >
                ← Retour
              </Button>
              <h1 className="text-xl font-semibold text-gray-800">Créer un Nouvel Objectif</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Détails de l'Objectif</CardTitle>
            <CardDescription>Créez un nouvel objectif thérapeutique pour votre patient</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="patient-select">Assigner au Patient</Label>
              <select 
                id="patient-select"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionnez un patient...</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} (Âge {patient.age})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-text">Description de l'Objectif</Label>
              <textarea
                id="goal-text"
                placeholder="Décrivez l'objectif thérapeutique en termes clairs et réalisables..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Valeur en Points</Label>
              <Input 
                id="points" 
                type="number" 
                placeholder="10" 
                min="1" 
                max="50"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Catégorie d'Objectif</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto p-4 flex flex-col">
                  <span className="text-sm font-medium">Motricité Fine</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col">
                  <span className="text-sm font-medium">Motricité Globale</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col">
                  <span className="text-sm font-medium">Vie Quotidienne</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col">
                  <span className="text-sm font-medium">Cognitif</span>
                </Button>
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onNavigate("therapist-dashboard")}
              >
                Annuler
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => onNavigate("therapist-dashboard")}
              >
                Créer l'Objectif
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}