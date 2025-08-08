"use client"

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, Target, CheckCircle, Calendar, Settings, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react'
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

interface PatientDetailProps {
  patient: Patient
  goals: Goal[]
}

export function PatientDetail({ patient, goals }: PatientDetailProps) {
  const router = useRouter()
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set())
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<DayProgress | null>(null)
  
  const patientGoals = goals.filter(g => g.patientId === patient.id)
  const groupedGoals = groupGoalsByPrimary(patientGoals)
  const standalonePrimaries = getStandalonePrimaryGoals(patientGoals)
  const weekProgress = calculateWeekProgress(patientGoals, selectedWeek)
  
  const toggleExpanded = (goalId: string) => {
    const newExpanded = new Set(expandedGoals)
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId)
    } else {
      newExpanded.add(goalId)
    }
    setExpandedGoals(newExpanded)
  }
  
  const changeWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(selectedWeek)
    newWeek.setDate(newWeek.getDate() + (direction === 'prev' ? -7 : 7))
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

        {/* Current Goals */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Objectifs Actuels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupedGoals.map(({ primary, secondaries, totalPoints, completedCount }) => (
                <div key={primary.id} className="border rounded-lg overflow-hidden">
                  {/* Primary Goal */}
                  <div className={`p-3 sm:p-4 ${primary.completed ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <div className="flex items-start sm:items-center justify-between gap-2">
                      <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto flex-shrink-0"
                          onClick={() => toggleExpanded(primary.id)}
                        >
                          {expandedGoals.has(primary.id) ? (
                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </Button>
                        <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm sm:text-base font-medium ${primary.completed ? 'text-green-800 line-through' : 'text-gray-800'} break-words`}>
                            {primary.text}
                          </p>
                          {secondaries.length > 0 && (
                            <div className="flex flex-wrap items-center mt-2 gap-2">
                              <span className="text-xs sm:text-sm text-gray-600">
                                {completedCount}/{secondaries.length}
                              </span>
                              <Progress value={(completedCount / secondaries.length) * 100} className="w-16 sm:w-24 h-2" />
                              <Badge variant="secondary" className="text-xs">{totalPoints} pts</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1">
                        <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Secondary Goals */}
                  {secondaries.length > 0 && expandedGoals.has(primary.id) && (
                    <div className="border-t">
                      {secondaries.map(secondary => (
                        <div key={secondary.id} className="pl-8 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border-b last:border-b-0 hover:bg-gray-50">
                          <div className="flex items-start sm:items-center justify-between gap-2">
                            <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0 ${
                                secondary.completed ? 'bg-green-500 text-white' : 'border-2 border-gray-300'
                              }`}>
                                {secondary.completed && <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                              </div>
                              <span className={`text-xs sm:text-sm break-words ${secondary.completed ? 'line-through text-gray-500' : ''}`}>
                                {secondary.text}
                              </span>
                            </div>
                            <Badge className="text-[10px] sm:text-xs flex-shrink-0" variant={secondary.completed ? "success" : "default"}>
                              {secondary.points} pts
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Standalone Primary Goals */}
              {standalonePrimaries.map(goal => (
                <div key={goal.id} className="border rounded-lg p-3 sm:p-4 bg-gray-50 hover:bg-gray-100">
                  <div className="flex items-start sm:items-center justify-between gap-2">
                    <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <p className={`text-sm sm:text-base font-medium ${goal.completed ? 'text-green-800 line-through' : 'text-gray-800'} break-words`}>
                        {goal.text}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1">
                      <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center mb-3">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="text-base sm:text-lg">Progrès Hebdomadaire</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => changeWeek('prev')}
                  className="p-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-xs sm:text-sm text-gray-600 text-center flex-1">
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
                  className="p-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Days Heatmap - Scrollable on mobile */}
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6 min-w-[320px]">
                {weekProgress.days.map((day) => (
                  <button
                    key={day.date}
                    onClick={() => setSelectedDay(day)}
                    className={`
                      p-1 sm:p-3 rounded-lg border-2 transition-all
                      ${selectedDay?.date === day.date ? 'border-blue-500 shadow-lg' : 'border-transparent'}
                      hover:shadow-md hover:scale-105
                    `}
                  >
                    <div className="text-[10px] sm:text-xs font-medium text-gray-600 mb-1">
                      {day.dayName.slice(0, 3)}
                    </div>
                    <div className={`
                      w-8 h-8 sm:w-12 sm:h-12 mx-auto rounded-lg flex items-center justify-center text-lg sm:text-2xl
                      ${getCompletionColor(day.completionRate)}
                    `}>
                      {getCompletionEmoji(day.completionRate)}
                    </div>
                    <div className="mt-1 sm:mt-2 text-center">
                      <div className="text-[10px] sm:text-xs font-semibold">
                        {day.totalGoals > 0 ? `${Math.round(day.completionRate * day.totalGoals / 100)}/${day.totalGoals}` : '0/0'}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500">
                        {day.completionRate}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Week Stats */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">
                    {weekProgress.totalPoints}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-600">Points totaux</div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-green-600">
                    {weekProgress.averageCompletion}%
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-600">Moyenne</div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-purple-600">
                    {weekProgress.bestDay?.dayName.slice(0, 3) || '-'}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-600">Meilleur jour</div>
                </div>
              </div>
            </div>

            {/* Selected Day Detail */}
            {selectedDay && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3 text-sm sm:text-base">
                  {selectedDay.dayName} {new Date(selectedDay.date).toLocaleDateString('fr-FR')}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Objectifs complétés:</span>
                    <span className="font-medium">{Math.round(selectedDay.completionRate * selectedDay.totalGoals / 100)}/{selectedDay.totalGoals}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Points gagnés:</span>
                    <span className="font-medium">{selectedDay.pointsEarned} pts</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Taux de complétion:</span>
                    <span className="font-medium">{selectedDay.completionRate}%</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Les détails des objectifs seront disponibles prochainement
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}