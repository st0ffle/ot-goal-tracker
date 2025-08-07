"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, CheckCircle, Circle, Calendar, Target } from 'lucide-react'
import { ResponsiveContainer, ResponsiveHeading, ResponsiveStack } from '@/components/responsive-patterns'

interface Goal {
  id: string
  text: string
  completed: boolean
  points: number
}

interface PatientGoalsProps {
  goals: Goal[]
  onNavigate: (view: string) => void
}

export function PatientGoals({ goals, onNavigate }: PatientGoalsProps) {
  const completedCount = goals.filter(g => g.completed).length
  const totalCount = goals.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

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
                <span className="text-lg font-bold text-gray-800">245</span>
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
              <span className="text-sm font-bold text-gray-800">{completedCount}/{totalCount} Complétés</span>
            </div>
            <Progress value={progressPercentage} className="h-3 mb-3" />
            <div className="flex justify-between text-xs text-gray-600">
              <span>Continue comme ça ! 💪</span>
              <span>+{goals.filter(g => !g.completed).reduce((sum, g) => sum + g.points, 0)} points possibles</span>
            </div>
          </CardContent>
        </Card>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id} className={`transition-all ${goal.completed ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <button 
                    aria-label={goal.completed ? "Marquer comme non complété" : "Marquer comme complété"}
                    className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      goal.completed 
                        ? 'bg-green-500 text-white' 
                        : 'border-2 border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {goal.completed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4 text-transparent" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${goal.completed ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                      {goal.text}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <Award className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600">{goal.points} points</span>
                      </div>
                      {goal.completed && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Complété ! 🎉
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
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