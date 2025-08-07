"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResponsiveContainer, ResponsiveHeading } from '@/components/responsive-patterns'
import { Target, ListChecks } from 'lucide-react'
import type { Goal } from '@/utils/goal-helpers'

interface Patient {
  id: string
  name: string
  age: number
  totalGoals: number
  completedToday: number
  points: number
  status: 'active' | 'archived'
  archivedAt?: string
}

interface CreateGoalProps {
  patients: Patient[]
  goals: Goal[]  // Ajout pour avoir accès aux objectifs existants
  onNavigate: (view: string) => void
}

export function CreateGoal({ patients, goals, onNavigate }: CreateGoalProps) {
  const [goalType, setGoalType] = useState<'primary' | 'secondary'>('primary')
  const [selectedParentId, setSelectedParentId] = useState<string>('')
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [goalText, setGoalText] = useState<string>('')
  const [points, setPoints] = useState<string>('10')
  
  // Filtrer les objectifs principaux du patient sélectionné
  const availableParentGoals = goals.filter(g => 
    g.patientId === selectedPatientId && g.type === 'primary'
  )
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <ResponsiveContainer>
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => onNavigate("therapist-dashboard")}
                className="mr-2 md:mr-4"
                size="sm"
              >
                <span className="hidden sm:inline">← Retour</span>
                <span className="sm:hidden">←</span>
              </Button>
              <ResponsiveHeading>
                <span className="hidden sm:inline">Créer un Nouvel Objectif</span>
                <span className="sm:hidden">Nouvel Objectif</span>
              </ResponsiveHeading>
            </div>
          </div>
        </ResponsiveContainer>
      </header>

      <main className="py-8">
        <ResponsiveContainer>
        <Card>
          <CardHeader>
            <CardTitle>Détails de l'Objectif</CardTitle>
            <CardDescription>Créez un nouvel objectif thérapeutique pour votre patient</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sélection du patient */}
            <div className="space-y-2">
              <Label htmlFor="patient-select">Patient</Label>
              <select 
                id="patient-select"
                value={selectedPatientId}
                onChange={(e) => {
                  setSelectedPatientId(e.target.value)
                  setSelectedParentId('') // Reset parent si on change de patient
                }}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionnez un patient...</option>
                {patients.filter(p => p.status === 'active').map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} ({patient.age} ans)
                  </option>
                ))}
              </select>
            </div>

            {/* Type d'objectif */}
            <div className="space-y-2">
              <Label>Type d'objectif</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={goalType === 'primary' ? 'default' : 'outline'}
                  onClick={() => setGoalType('primary')}
                  className="flex-1"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Principal
                </Button>
                <Button
                  type="button"
                  variant={goalType === 'secondary' ? 'default' : 'outline'}
                  onClick={() => setGoalType('secondary')}
                  className="flex-1"
                >
                  <ListChecks className="w-4 h-4 mr-2" />
                  Secondaire
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                {goalType === 'primary' 
                  ? "Un objectif principal peut contenir plusieurs objectifs secondaires"
                  : "Un objectif secondaire est une étape d'un objectif principal"}
              </p>
            </div>

            {/* Si secondaire, sélectionner le parent */}
            {goalType === 'secondary' && selectedPatientId && (
              <div className="space-y-2">
                <Label htmlFor="parent-select">Objectif principal associé</Label>
                <select 
                  id="parent-select"
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionnez l'objectif principal...</option>
                  {availableParentGoals.map(goal => (
                    <option key={goal.id} value={goal.id}>
                      {goal.text}
                    </option>
                  ))}
                </select>
                {availableParentGoals.length === 0 && (
                  <p className="text-sm text-orange-600">
                    ⚠️ Aucun objectif principal pour ce patient. Créez-en un d'abord.
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="goal-text">Description de l'objectif</Label>
              <textarea
                id="goal-text"
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                placeholder={
                  goalType === 'primary'
                    ? "Ex: Améliorer l'autonomie pour l'habillage"
                    : "Ex: Boutonner sa chemise de façon autonome"
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
              />
            </div>

            {/* Points - Seulement pour les secondaires */}
            {goalType === 'secondary' && (
              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Input 
                  id="points" 
                  type="number" 
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  placeholder="10" 
                  min="1" 
                  max="50"
                  className="w-full"
                />
                <p className="text-sm text-gray-600">
                  Les points de l'objectif principal seront la somme de ses objectifs secondaires
                </p>
              </div>
            )}

            {/* Note informative pour principal */}
            {goalType === 'primary' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  ℹ️ Les objectifs principaux n'ont pas de points directs. 
                  Leurs points seront calculés automatiquement en fonction des objectifs secondaires ajoutés.
                </p>
              </div>
            )}

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
                onClick={() => {
                  // Logique de création
                  console.log('Créer objectif:', { 
                    goalType, 
                    selectedParentId, 
                    selectedPatientId,
                    goalText,
                    points: goalType === 'secondary' ? points : 0
                  })
                  onNavigate("therapist-dashboard")
                }}
              >
                Créer l'Objectif
              </Button>
            </div>
          </CardContent>
        </Card>
        </ResponsiveContainer>
      </main>
    </div>
  )
}