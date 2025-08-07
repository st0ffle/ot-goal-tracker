"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Award, Target, CheckCircle, Calendar, Settings } from 'lucide-react'
import { ResponsiveGrid, ResponsiveStack } from '@/components/responsive-patterns'

interface Patient {
  id: string
  name: string
  age: number
  totalGoals: number
  completedToday: number
  points: number
}

interface Goal {
  id: string
  text: string
  completed: boolean
  points: number
}

interface PatientDetailProps {
  patient: Patient
  goals: Goal[]
  onNavigate: (view: string) => void
}

export function PatientDetail({ patient, goals, onNavigate }: PatientDetailProps) {
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
                <div className="text-3xl font-bold text-blue-600">{patient.totalGoals}</div>
                <div className="text-sm text-gray-600">Objectifs Actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{patient.completedToday}</div>
                <div className="text-sm text-gray-600">Complétés Aujourd'hui</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round((patient.completedToday / patient.totalGoals) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Taux de Complétion</div>
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
              {goals.map((goal) => (
                <div key={goal.id} className={`p-4 rounded-lg border-2 transition-colors ${
                  goal.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center ${
                        goal.completed 
                          ? 'bg-green-500 text-white' 
                          : 'border-2 border-gray-300'
                      }`}>
                        {goal.completed && <CheckCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className={`font-medium ${goal.completed ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                          {goal.text}
                        </p>
                        <div className="flex items-center mt-2">
                          <Award className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-gray-600">{goal.points} points</span>
                          {goal.completed && (
                            <Badge className="ml-3 bg-green-100 text-green-800">
                              Completed Today
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600" aria-label="Paramètres de l'objectif">
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