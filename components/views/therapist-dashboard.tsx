"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Users, Target, Award, User, Settings } from 'lucide-react'

interface Patient {
  id: string
  name: string
  age: number
  totalGoals: number
  completedToday: number
  points: number
}

interface TherapistDashboardProps {
  patients: Patient[]
  onNavigate: (view: string, patientId?: string) => void
}

export function TherapistDashboard({ patients, onNavigate }: TherapistDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [ageFilter, setAgeFilter] = useState("")
  const [progressFilter, setProgressFilter] = useState("")

  const getFilteredPatients = () => {
    return patients.filter(patient => {
      if (!patient || !patient.name) return false
      
      const matchesSearch = !searchTerm || patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      let matchesAge = true
      if (ageFilter) {
        if (ageFilter === "5-10") matchesAge = patient.age >= 5 && patient.age <= 10
        if (ageFilter === "11-15") matchesAge = patient.age >= 11 && patient.age <= 15
        if (ageFilter === "16-20") matchesAge = patient.age >= 16 && patient.age <= 20
      }
      
      let matchesProgress = true
      if (progressFilter) {
        const completionRate = (patient.completedToday / patient.totalGoals) * 100
        if (progressFilter === "high") matchesProgress = completionRate >= 80
        if (progressFilter === "medium") matchesProgress = completionRate >= 50 && completionRate < 80
        if (progressFilter === "low") matchesProgress = completionRate < 50
      }
      
      return matchesSearch && matchesAge && matchesProgress
    })
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
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => onNavigate("create-goal")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Goal
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Patient Dashboard</h2>
          <p className="text-gray-600">Monitor progress and manage goals for your patients</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-800">{patients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Goals</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {patients.reduce((sum, p) => sum + p.totalGoals, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Completion</p>
                  <p className="text-2xl font-bold text-gray-800">78%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Search patients by name..." 
                className="w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
              >
                <option value="">All Ages</option>
                <option value="5-10">5-10 years</option>
                <option value="11-15">11-15 years</option>
                <option value="16-20">16-20 years</option>
              </select>
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={progressFilter}
                onChange={(e) => setProgressFilter(e.target.value)}
              >
                <option value="">All Progress</option>
                <option value="high">High (80%+)</option>
                <option value="medium">Medium (50-79%)</option>
                <option value="low">Low (&lt;50%)</option>
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-600">Patient</th>
                    <th className="text-left p-4 font-medium text-gray-600">Age</th>
                    <th className="text-left p-4 font-medium text-gray-600">Today's Progress</th>
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
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => onNavigate("create-goal")}
                          >
                            Add Goal
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t bg-gray-50">
              <div className="text-sm text-gray-600">
                Showing 1-{filteredPatients.length} of {filteredPatients.length} patients
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-blue-600 text-white">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}