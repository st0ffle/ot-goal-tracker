"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Users, Target, Award, User, Settings, Archive, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import { ResponsiveContainer, ResponsiveGrid, ResponsiveHeading, ResponsiveTable } from '@/components/responsive-patterns'

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

interface TherapistDashboardProps {
  patients: Patient[]
  onNavigate: (view: string, patientId?: string) => void
}

// Component for mobile patient cards
function PatientCard({ 
  patient, 
  onNavigate, 
  onArchive, 
  onReactivate, 
  viewMode 
}: { 
  patient: Patient, 
  onNavigate: (view: string, patientId?: string) => void,
  onArchive: (patientId: string) => void,
  onReactivate: (patientId: string) => void,
  viewMode: 'active' | 'archived'
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center flex-1">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-800">{patient.name}</div>
            <div className="text-sm text-gray-600 mb-2">{patient.age} ans • ID: {patient.id}</div>
            
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">Progrès du jour</div>
                <Progress 
                  value={(patient.completedToday / patient.totalGoals) * 100} 
                  className="h-2"
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {patient.completedToday}/{patient.totalGoals}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {patient.points} pts
              </Badge>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onNavigate("patient-detail", patient.id)}
                >
                  Voir
                </Button>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => onNavigate("create-goal")}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                {/* Bouton Archiver/Réactiver mobile */}
                {viewMode === 'active' ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-orange-600 border-orange-600"
                    onClick={() => onArchive(patient.id)}
                  >
                    <Archive className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-green-600 border-green-600"
                    onClick={() => onReactivate(patient.id)}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export function TherapistDashboard({ patients, onNavigate }: TherapistDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [progressFilter, setProgressFilter] = useState("")
  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active')

  // Séparer les patients par statut
  const activePatients = patients.filter(p => p.status === 'active')
  const archivedPatients = patients.filter(p => p.status === 'archived')
  
  const currentPatients = viewMode === 'active' ? activePatients : archivedPatients
  
  const getFilteredPatients = () => {
    return currentPatients.filter(patient => {
      if (!patient || !patient.name) return false
      
      const matchesSearch = !searchTerm || patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      let matchesProgress = true
      if (progressFilter) {
        const completionRate = patient.totalGoals > 0 ? (patient.completedToday / patient.totalGoals) * 100 : 0
        if (progressFilter === "high") matchesProgress = completionRate >= 80
        if (progressFilter === "medium") matchesProgress = completionRate >= 50 && completionRate < 80
        if (progressFilter === "low") matchesProgress = completionRate < 50
      }
      
      return matchesSearch && matchesProgress
    })
  }

  const handleArchivePatient = (patientId: string) => {
    // Pour l'instant, juste un console.log. En vrai, sauvegarder les données.
    console.log('Patient archivé:', patientId)
  }

  const handleReactivatePatient = (patientId: string) => {
    // Pour l'instant, juste un console.log. En vrai, sauvegarder les données.
    console.log('Patient réactivé:', patientId)
  }

  const filteredPatients = getFilteredPatients()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-800">OT Goal Tracker</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => onNavigate("create-goal")}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Plus className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Nouvel Objectif</span>
              </Button>
              <Button variant="ghost" size="sm" aria-label="Paramètres">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <ResponsiveContainer>
        <div className="mb-6 sm:mb-8">
          {/* Version desktop - layout traditionnel */}
          <div className="hidden sm:flex sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <ResponsiveHeading>Tableau de bord des patients</ResponsiveHeading>
              <p className="text-gray-600">Suivez les progrès et gérez les objectifs de vos patients</p>
            </div>
            
            <div className="flex items-center justify-end">
              <Button
                variant={viewMode === 'active' ? 'secondary' : 'outline'}
                onClick={() => setViewMode(viewMode === 'active' ? 'archived' : 'active')}
                className="flex items-center space-x-2"
              >
                {viewMode === 'active' ? (
                  <>
                    <Archive className="w-4 h-4" />
                    <span>Archivés ({archivedPatients.length})</span>
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    <span>Actifs ({activePatients.length})</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Version mobile - layout compact avec stats intégrées */}
          <div className="sm:hidden">
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold text-gray-900">Tableau de bord</h1>
            </div>
            
            {/* Card compacte avec stats et toggle */}
            <Card className="p-4">
              <div className="space-y-4">
                {/* Stats compactes */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{currentPatients.length}</div>
                      <div className="text-xs text-gray-600">
                        {viewMode === 'active' ? 'Actifs' : 'Archivés'}
                      </div>
                    </div>
                    {viewMode === 'active' && (
                      <>
                        <div className="w-px h-8 bg-gray-200"></div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {activePatients.reduce((sum, p) => sum + p.totalGoals, 0)}
                          </div>
                          <div className="text-xs text-gray-600">Objectifs</div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Toggle button */}
                  <Button
                    variant={viewMode === 'active' ? 'secondary' : 'outline'}
                    onClick={() => setViewMode(viewMode === 'active' ? 'archived' : 'active')}
                    size="sm"
                    className="flex items-center space-x-1.5"
                  >
                    {viewMode === 'active' ? (
                      <>
                        <Archive className="w-4 h-4" />
                        <span>Archivés ({archivedPatients.length})</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4" />
                        <span>Actifs ({activePatients.length})</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Stats Cards - Desktop seulement */}
        <div className="mb-8 hidden sm:block">
          <ResponsiveGrid>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {viewMode === 'active' ? 'Patients Actifs' : 'Patients Archivés'}
                    </p>
                    <motion.p 
                      className="text-2xl font-bold text-gray-800"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      {currentPatients.length}
                    </motion.p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Objectifs Actifs</p>
                    <motion.p 
                      className="text-2xl font-bold text-gray-800"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                    >
                      {patients.reduce((sum, p) => sum + p.totalGoals, 0)}
                    </motion.p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Award className="w-8 h-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Complétion Moyenne</p>
                    <motion.p 
                      className="text-2xl font-bold text-gray-800"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      78%
                    </motion.p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          </ResponsiveGrid>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input 
                placeholder={`Rechercher des patients ${viewMode === 'active' ? 'actifs' : 'archivés'} par nom...`}
                className="w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={progressFilter}
                onChange={(e) => setProgressFilter(e.target.value)}
              >
                <option value="">Tous les progrès</option>
                <option value="high">Élevé (80%+)</option>
                <option value="medium">Moyen (50-79%)</option>
                <option value="low">Faible (&lt;50%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patient Table */}
        <Card>
          <CardHeader>
            <CardTitle>Patients ({filteredPatients.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-600">Patient</th>
                    <th className="text-left p-4 font-medium text-gray-600">Âge</th>
                    <th className="text-left p-4 font-medium text-gray-600">Progrès du jour</th>
                    <th className="text-left p-4 font-medium text-gray-600">Points</th>
                    <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient, index) => (
                    <tr key={patient.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{patient.name}</div>
                            <div className="text-sm text-gray-600">ID: {patient.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{patient.age}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <Progress 
                              value={(patient.completedToday / patient.totalGoals) * 100} 
                              className="h-2 w-24"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {patient.completedToday}/{patient.totalGoals}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {patient.points} pts
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onNavigate("patient-detail", patient.id)}
                          >
                            Voir
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => onNavigate("create-goal")}
                          >
                            Ajouter Objectif
                          </Button>
                          {/* Bouton Archiver/Réactiver */}
                          {viewMode === 'active' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-orange-600 border-orange-600 hover:bg-orange-50"
                              onClick={() => handleArchivePatient(patient.id)}
                            >
                              Archiver
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleReactivatePatient(patient.id)}
                            >
                              Réactiver
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-4">
              {filteredPatients.map((patient) => (
                <PatientCard 
                  key={patient.id} 
                  patient={patient} 
                  onNavigate={onNavigate}
                  onArchive={handleArchivePatient}
                  onReactivate={handleReactivatePatient}
                  viewMode={viewMode}
                />
              ))}
            </div>
            
            {/* Pagination - Responsive */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t bg-gray-50 gap-4">
              <div className="text-sm text-gray-600 order-2 sm:order-1">
                Showing 1-{filteredPatients.length} of {filteredPatients.length} patients
              </div>
              <div className="flex space-x-2 order-1 sm:order-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-blue-600 text-white">
                  1
                </Button>
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  2
                </Button>
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        </ResponsiveContainer>
      </main>
    </div>
  )
}