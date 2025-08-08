"use client"

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Award, Target, CheckCircle, Calendar, Settings, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react'
import { ResponsiveGrid, ResponsiveStack } from '@/components/responsive-patterns'
import { 
  groupGoalsByPrimary, 
  getStandalonePrimaryGoals,
  calculateWeekProgress,
  getCompletionColor,
  getCompletionEmoji,
  type DayProgress
} from '@/utils/goal-helpers'
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
}

export function PatientDetail({ patient, goals }: PatientDetailProps) {
  const router = useRouter()
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set())
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<DayProgress | null>(null)
  
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
  
  // Calculer le progrès de la semaine
  const weekProgress = calculateWeekProgress(patientGoals, selectedWeek)
  
  // Fonction pour naviguer entre semaines
  const changeWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(selectedWeek)
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7))
    setSelectedWeek(newWeek)
    setSelectedDay(null)
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center min-w-0 flex-1">
              <Button variant="ghost" className="mr-2 md:mr-4 flex-shrink-0" size="sm" asChild>
                <Link href="/therapist" prefetch={true}>
                  <span className="hidden sm:inline">← Retour</span>
                  <span className="sm:hidden">←</span>
                </Link>
              </Button>
              <h1 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
                {patient.name} <span className="hidden sm:inline">- Détails</span>
              </h1>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 flex-shrink-0" size="sm" asChild>
              <Link href={`/patient/create-goal?patientId=${patient.id}`} prefetch={true}>
                <Plus className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Ajouter Objectif</span>
              </Link>
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

        {/* Weekly Progress - Nouvelle version Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Progrès Hebdomadaire
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => changeWeek('prev')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-[140px] text-center">
                  {new Date(weekProgress.weekStart).toLocaleDateString('fr-FR', { 
                    day: 'numeric',
                    month: 'short'
                  })} - {new Date(weekProgress.weekEnd).toLocaleDateString('fr-FR', { 
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => changeWeek('next')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Heatmap des jours */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {weekProgress.days.map((day) => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDay(day)}
                  className={`
                    p-3 rounded-lg border-2 transition-all
                    ${selectedDay?.date === day.date ? 'border-blue-500 shadow-lg' : 'border-transparent'}
                    hover:shadow-md hover:scale-105
                  `}
                >
                  <div className="text-xs font-medium text-gray-600 mb-1">
                    {day.dayName.slice(0, 3)}
                  </div>
                  <div className={`
                    w-12 h-12 mx-auto rounded-lg flex items-center justify-center text-2xl
                    ${getCompletionColor(day.completionRate)}
                  `}>
                    {getCompletionEmoji(day.completionRate)}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xs font-semibold">
                      {day.totalGoals > 0 ? `${Math.round(day.completionRate * day.totalGoals / 100)}/${day.totalGoals}` : '0/0'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {day.completionRate}%
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Stats de la semaine */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {weekProgress.totalPoints}
                  </div>
                  <div className="text-xs text-gray-600">Points totaux</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {weekProgress.averageCompletion}%
                  </div>
                  <div className="text-xs text-gray-600">Moyenne</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {weekProgress.bestDay?.dayName.slice(0, 3) || '-'}
                  </div>
                  <div className="text-xs text-gray-600">Meilleur jour</div>
                </div>
              </div>
            </div>

            {/* Détail du jour sélectionné */}
            {selectedDay && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">
                  {selectedDay.dayName} {new Date(selectedDay.date).toLocaleDateString('fr-FR')}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Objectifs complétés:</span>
                    <span className="font-medium">{Math.round(selectedDay.completionRate * selectedDay.totalGoals / 100)}/{selectedDay.totalGoals}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Points gagnés:</span>
                    <span className="font-medium">{selectedDay.pointsEarned} pts</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Taux de complétion:</span>
                    <span className="font-medium">{selectedDay.completionRate}%</span>
                  </div>
                </div>
                
                {/* Liste des objectifs du jour (à implémenter plus tard) */}
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500 italic">
                    Détail des objectifs à venir dans la prochaine version
                  </p>
                </div>
              </div>
            )}

            {/* Message si pas de jour sélectionné */}
            {!selectedDay && (
              <div className="text-center text-sm text-gray-500 italic">
                Cliquez sur un jour pour voir le détail
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}