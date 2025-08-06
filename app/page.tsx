"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Users, Target, Award, CheckCircle, Circle, Calendar, User, Settings } from 'lucide-react'

// Mock data avec plus de patients
const mockPatients = [
  { id: "1", name: "Emma Johnson", age: 8, totalGoals: 4, completedToday: 3, points: 245 },
  { id: "2", name: "Michael Chen", age: 12, totalGoals: 5, completedToday: 4, points: 180 },
  { id: "3", name: "Sarah Williams", age: 16, totalGoals: 3, completedToday: 2, points: 320 },
  { id: "4", name: "Alex Rodriguez", age: 10, totalGoals: 6, completedToday: 5, points: 410 },
  { id: "5", name: "Lily Thompson", age: 7, totalGoals: 3, completedToday: 1, points: 125 },
  { id: "6", name: "David Kim", age: 14, totalGoals: 4, completedToday: 4, points: 380 },
  { id: "7", name: "Sophie Martin", age: 9, totalGoals: 5, completedToday: 3, points: 290 },
  { id: "8", name: "James Wilson", age: 11, totalGoals: 4, completedToday: 2, points: 195 },
  { id: "9", name: "Maya Patel", age: 13, totalGoals: 6, completedToday: 6, points: 450 },
  { id: "10", name: "Lucas Brown", age: 15, totalGoals: 3, completedToday: 1, points: 165 }
]

const mockGoals = [
  { id: "1", text: "Practice buttoning shirt independently", completed: true, points: 10 },
  { id: "2", text: "Use fork and knife for entire meal", completed: true, points: 15 },
  { id: "3", text: "Complete 10 minutes of handwriting practice", completed: true, points: 10 },
  { id: "4", text: "Organize backpack for school", completed: false, points: 10 }
]

const mockPatientGoals = [
  { id: "1", text: "Practice tying shoelaces", completed: true, points: 15 },
  { id: "2", text: "Complete morning routine checklist", completed: false, points: 10 },
  { id: "3", text: "Use both hands for cutting activity", completed: false, points: 10 }
]

export default function OTGoalTracker() {
  const [currentView, setCurrentView] = useState("login")
  const [userType, setUserType] = useState<"therapist" | "patient" | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [ageFilter, setAgeFilter] = useState("")
  const [progressFilter, setProgressFilter] = useState("")

  // Utiliser les données mockées
  const patients = mockPatients
  const goals = mockGoals
  const patientGoals = mockPatientGoals

  // Fonction de filtrage sécurisée
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

  if (currentView === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">OT Goal Tracker</CardTitle>
            <CardDescription>Track therapeutic goals and celebrate progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" />
                </div>
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    onClick={() => {
                      setUserType("therapist")
                      setCurrentView("therapist-dashboard")
                    }}
                  >
                    Login as Therapist
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setUserType("patient")
                      setCurrentView("patient-goals")
                    }}
                  >
                    Login as Patient
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input id="reg-password" type="password" placeholder="Create a password" />
                </div>
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="h-auto p-4 flex flex-col">
                      <User className="w-6 h-6 mb-2" />
                      <span className="text-sm">Therapist</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col">
                      <Target className="w-6 h-6 mb-2" />
                      <span className="text-sm">Patient</span>
                    </Button>
                  </div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Create Account
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentView === "therapist-dashboard") {
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
                  onClick={() => setCurrentView("create-goal")}
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
                              onClick={() => {
                                setSelectedPatient(patient.id)
                                setCurrentView("patient-detail")
                              }}
                            >
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => setCurrentView("create-goal")}
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

  if (currentView === "create-goal") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentView("therapist-dashboard")}
                  className="mr-4"
                >
                  ← Back
                </Button>
                <h1 className="text-xl font-semibold text-gray-800">Create New Goal</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Goal Details</CardTitle>
              <CardDescription>Create a new therapeutic goal for your patient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="patient-select">Assign to Patient</Label>
                <select 
                  id="patient-select"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a patient...</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} (Age {patient.age})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-text">Goal Description</Label>
                <textarea
                  id="goal-text"
                  placeholder="Describe the therapeutic goal in clear, actionable terms..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="points">Points Value</Label>
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
                <Label>Goal Category</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-auto p-4 flex flex-col">
                    <span className="text-sm font-medium">Fine Motor</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col">
                    <span className="text-sm font-medium">Gross Motor</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col">
                    <span className="text-sm font-medium">Daily Living</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col">
                    <span className="text-sm font-medium">Cognitive</span>
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setCurrentView("therapist-dashboard")}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => setCurrentView("therapist-dashboard")}
                >
                  Create Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (currentView === "patient-goals") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-800">My Goals</h1>
                  <p className="text-sm text-gray-600">Today's Tasks</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-yellow-500 mr-1" />
                  <span className="text-lg font-bold text-gray-800">245</span>
                </div>
                <p className="text-xs text-gray-600">Total Points</p>
              </div>
            </div>
          </div>
        </header>

        {/* Progress Summary */}
        <div className="max-w-md mx-auto px-4 py-6">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Today's Progress</span>
                <span className="text-sm font-bold text-gray-800">1/3 Complete</span>
              </div>
              <Progress value={33} className="h-3 mb-3" />
              <div className="flex justify-between text-xs text-gray-600">
                <span>Keep going! 💪</span>
                <span>+25 points possible</span>
              </div>
            </CardContent>
          </Card>

          {/* Goals List */}
          <div className="space-y-4">
            {patientGoals.map((goal) => (
              <Card key={goal.id} className={`transition-all ${goal.completed ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <button 
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
                            Completed! 🎉
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
              onClick={() => setCurrentView("progress-history")}
            >
              <Calendar className="w-4 h-4 mr-2" />
              View Progress History
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-gray-600"
              onClick={() => setCurrentView("login")}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "progress-history") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentView("patient-goals")}
                className="mr-3 p-2"
              >
                ← Back
              </Button>
              <h1 className="text-lg font-semibold text-gray-800">Progress History</h1>
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">7</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">85%</div>
                <div className="text-sm text-gray-600">This Week</div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Progress */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{day}</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3].map((goal) => (
                          <div 
                            key={goal}
                            className={`w-3 h-3 rounded-full ${
                              index < 5 && goal <= (index === 4 ? 1 : 3) 
                                ? 'bg-green-500' 
                                : index < 5 
                                  ? 'bg-gray-300' 
                                  : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {index < 5 ? (index === 4 ? '1/3' : '3/3') : '0/3'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Week Warrior</p>
                    <p className="text-xs text-gray-600">Completed 5 days in a row</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Goal Getter</p>
                    <p className="text-xs text-gray-600">Reached 200 total points</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentView === "patient-detail") {
    const patient = patients.find(p => p.id === selectedPatient)
    if (!patient) return null
  
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentView("therapist-dashboard")}
                  className="mr-4"
                >
                  ← Back
                </Button>
                <h1 className="text-xl font-semibold text-gray-800">{patient.name} - Details</h1>
              </div>
              <Button 
                onClick={() => setCurrentView("create-goal")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </div>
          </div>
        </header>
  
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Patient Info Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{patient.name}</CardTitle>
                  <CardDescription>Age {patient.age} • Patient ID: {patient.id}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end mb-2">
                    <Award className="w-6 h-6 text-yellow-500 mr-2" />
                    <span className="text-2xl font-bold text-gray-800">{patient.points}</span>
                  </div>
                  <p className="text-sm text-gray-600">Total Points</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{patient.totalGoals}</div>
                  <div className="text-sm text-gray-600">Active Goals</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{patient.completedToday}</div>
                  <div className="text-sm text-gray-600">Completed Today</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {Math.round((patient.completedToday / patient.totalGoals) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
  
          {/* Current Goals */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Current Goals
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
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
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

  return null
}
