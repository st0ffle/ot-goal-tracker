"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, CheckCircle, Circle, Calendar, Target, ChevronDown, ChevronRight } from 'lucide-react'
import { ResponsiveContainer, ResponsiveHeading, ResponsiveStack } from '@/components/responsive-patterns'
import type { Goal } from '@/utils/goal-helpers'
import { groupGoalsByPrimary } from '@/utils/goal-helpers'

// Interface Goal importée depuis utils/goal-helpers

interface PatientGoalsProps {
  goals: Goal[]
  onNavigate: (view: string) => void
}

export function PatientGoals({ goals, onNavigate }: PatientGoalsProps) {
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set())
  
  // Grouper les objectifs par principal/secondaire
  const groupedGoals = groupGoalsByPrimary(goals)
  
  // Calculer les statistiques
  const completedSecondaryGoals = groupedGoals.reduce((sum, g) => sum + g.completedCount, 0)
  const totalSecondaryGoals = groupedGoals.reduce((sum, g) => sum + g.secondaries.length, 0)
  const earnedPoints = groupedGoals.reduce((sum, g) => 
    sum + g.secondaries.filter(s => s.completed).reduce((pts, s) => pts + s.points, 0), 0
  )
  const possiblePoints = groupedGoals.reduce((sum, g) => 
    sum + g.secondaries.filter(s => !s.completed).reduce((pts, s) => pts + s.points, 0), 0
  )
  const progressPercentage = totalSecondaryGoals > 0 ? (completedSecondaryGoals / totalSecondaryGoals) * 100 : 0
  
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <ResponsiveContainer>
          <ResponsiveStack>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <ResponsiveHeading>Mes Objectifs</ResponsiveHeading>
                <p className="text-sm text-gray-600">Tâches du jour</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center">
                <Award className="w-5 h-5 text-yellow-500 mr-1" />
                <span className="text-lg font-bold text-gray-800">{earnedPoints}</span>
              </div>
              <p className="text-xs text-gray-600">Points Totaux</p>
            </div>
          </ResponsiveStack>
        </ResponsiveContainer>
      </header>

      {/* Progress Summary */}
      <ResponsiveContainer>
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Progrès du jour</span>
              <span className="text-sm font-bold text-gray-800">{completedSecondaryGoals}/{totalSecondaryGoals} Complétés</span>
            </div>
            <Progress value={progressPercentage} className="h-3 mb-3" />
            <div className="flex justify-between text-xs text-gray-600">
              <span>Continue comme ça ! 💪</span>
              <span>+{possiblePoints} points possibles</span>
            </div>
          </CardContent>
        </Card>

        {/* Goals List - Version hiérarchique */}
        <div className="space-y-4">
          {groupedGoals.map(({ primary, secondaries, totalPoints, completedCount }) => (
            <Card key={primary.id} className="overflow-hidden">
              {/* Objectif principal */}
              <div className={`p-4 ${primary.completed ? 'bg-green-50' : 'bg-blue-50'}`}>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto mr-3"
                    onClick={() => toggleExpanded(primary.id)}
                  >
                    {expandedGoals.has(primary.id) ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </Button>
                  <Target className="w-5 h-5 text-blue-600 mr-3" />
                  <div className="flex-1">
                    <p className={`font-semibold ${primary.completed ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                      {primary.text}
                    </p>
                    {secondaries.length > 0 && (
                      <div className="flex items-center mt-1 space-x-3">
                        <span className="text-sm text-gray-600">
                          {completedCount}/{secondaries.length} étapes
                        </span>
                        <Progress value={(completedCount / secondaries.length) * 100} className="w-20 h-2" />
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Award className="w-3 h-3 mr-1" />
                          {totalPoints} pts
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Objectifs secondaires (affichés si expandé) */}
              {secondaries.length > 0 && expandedGoals.has(primary.id) && (
                <div className="border-t bg-white">
                  {secondaries.map(secondary => (
                    <div key={secondary.id} className="px-4 py-3 border-b last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <button 
                          aria-label={secondary.completed ? "Marquer comme non complété" : "Marquer comme complété"}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ml-8 ${
                            secondary.completed 
                              ? 'bg-green-500 text-white' 
                              : 'border-2 border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {secondary.completed ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4 text-transparent" />
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <p className={`text-sm ${secondary.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                            {secondary.text}
                          </p>
                          <div className="flex items-center mt-1">
                            <Award className="w-3 h-3 text-yellow-500 mr-1" />
                            <span className="text-xs text-gray-600">{secondary.points} points</span>
                            {secondary.completed && (
                              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                                Fait! 🎉
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 space-y-3">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onNavigate("progress-history")}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Voir l'historique des progrès
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-gray-600"
            onClick={() => onNavigate("login")}
          >
            Déconnexion
          </Button>
        </div>
      </ResponsiveContainer>
    </div>
  )
}