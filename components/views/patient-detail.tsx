"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Award, Target, CheckCircle, Calendar, Settings, ChevronDown, ChevronRight } from 'lucide-react'
import { ResponsiveGrid, ResponsiveStack } from '@/components/responsive-patterns'
import { groupGoalsByPrimary, getStandalonePrimaryGoals } from '@/utils/goal-helpers'
import type { Goal } from '@/utils/goal-helpers'
import { useState } from 'react'

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

// Interface Goal déjà importée depuis utils/goal-helpers

interface PatientDetailProps {
  patient: Patient
  goals: Goal[]  // Maintenant typé avec la nouvelle structure
  onNavigate: (view: string) => void
}

export function PatientDetail({ patient, goals, onNavigate }: PatientDetailProps) {
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set())
  
  // Filtrer les objectifs du patient
  const patientGoals = goals.filter(g => g.patientId === patient.id)
  
  // Grouper les objectifs par principal/secondaire
  const groupedGoals = groupGoalsByPrimary(patientGoals)
  const standalonePrimaries = getStandalonePrimaryGoals(patientGoals)
  
  const toggleExpanded = (goalId: string) => {
    const newExpanded = new Set(expandedGoals)
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId)
    } else {
      newExpanded.add(goalId)
    }
    setExpandedGoals(newExpanded)
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center min-w-0 flex-1">
              <Button 
                variant="ghost" 
                onClick={() => onNavigate("therapist-dashboard")}
                className="mr-2 md:mr-4 flex-shrink-0"
                size="sm"
              >
                <span className="hidden sm:inline">← Retour</span>
                <span className="sm:hidden">←</span>
              </Button>
              <h1 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
                {patient.name} <span className="hidden sm:inline">- Détails</span>
              </h1>
            </div>
            <Button 
              onClick={() => onNavigate("create-goal")}
              className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
              size="sm"
            >
              <Plus className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Ajouter Objectif</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <ResponsiveStack>
              <div>
                <CardTitle className="text-2xl">{patient.name}</CardTitle>
                <CardDescription>Âge {patient.age} • ID Patient: {patient.id}</CardDescription>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mb-2">
                  <Award className="w-6 h-6 text-yellow-500 mr-2" />
                  <span className="text-2xl font-bold text-gray-800">{patient.points}</span>
                </div>
                <p className="text-sm text-gray-600">Points Totaux</p>
              </div>
            </ResponsiveStack>
          </CardHeader>
          <CardContent>
            <ResponsiveGrid>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {groupedGoals.reduce((sum, g) => sum + g.secondaries.length, 0) + standalonePrimaries.length}
                </div>
                <div className="text-sm text-gray-600">Objectifs Actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {groupedGoals.reduce((sum, g) => sum + g.completedCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Complétés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {groupedGoals.reduce((sum, g) => sum + g.totalPoints, 0)}
                </div>
                <div className="text-sm text-gray-600">Points Total</div>
              </div>
            </ResponsiveGrid>
          </CardContent>
        </Card>

        {/* Current Goals - Nouvelle version hiérarchique */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Objectifs Actuels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Objectifs avec hiérarchie */}
              {groupedGoals.map(({ primary, secondaries, totalPoints, completedCount }) => (
                <div key={primary.id} className="border rounded-lg overflow-hidden">
                  {/* Objectif principal */}
                  <div className={`p-4 ${primary.completed ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto"
                          onClick={() => toggleExpanded(primary.id)}
                        >
                          {expandedGoals.has(primary.id) ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </Button>
                        <Target className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <p className={`font-medium ${primary.completed ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                            {primary.text}
                          </p>
                          {secondaries.length > 0 && (
                            <div className="flex items-center mt-1 space-x-4">
                              <span className="text-sm text-gray-600">
                                {completedCount}/{secondaries.length} complétés
                              </span>
                              <Progress value={(completedCount / secondaries.length) * 100} className="w-24 h-2" />
                              <Badge variant="secondary">{totalPoints} pts</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Objectifs secondaires (affichés si expandé) */}
                  {secondaries.length > 0 && expandedGoals.has(primary.id) && (
                    <div className="border-t">
                      {secondaries.map(secondary => (
                        <div key={secondary.id} className="pl-12 pr-4 py-3 border-b last:border-b-0 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                secondary.completed ? 'bg-green-500 text-white' : 'border-2 border-gray-300'
                              }`}>
                                {secondary.completed && <CheckCircle className="w-3 h-3" />}
                              </div>
                              <span className={secondary.completed ? 'line-through text-gray-500' : ''}>
                                {secondary.text}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{secondary.points} pts</Badge>
                              {secondary.completed && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  Complété
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Objectifs principaux sans secondaires */}
              {standalonePrimaries.map(goal => (
                <div key={goal.id} className="p-4 rounded-lg border bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className={`font-medium ${goal.completed ? 'line-through text-gray-500' : ''}`}>
                          {goal.text}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Aucun objectif secondaire pour l'instant
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Progrès Hebdomadaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day, index) => (
                <div key={day} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 w-20">{day}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center space-x-1">
                      {Array.from({length: patient.totalGoals}).map((_, goalIndex) => (
                        <div 
                          key={goalIndex}
                          className={`w-4 h-4 rounded-full ${
                            index < 5 && goalIndex < (index === 4 ? patient.completedToday : patient.totalGoals)
                              ? 'bg-green-500' 
                              : index < 5 
                                ? 'bg-gray-300' 
                                : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {index < 5 ? (index === 4 ? `${patient.completedToday}/${patient.totalGoals}` : `${patient.totalGoals}/${patient.totalGoals}`) : `0/${patient.totalGoals}`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}