"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, User } from 'lucide-react'
import { motion } from 'framer-motion'

interface LoginViewProps {
  onNavigate: (view: string, userType?: "therapist" | "patient") => void
}

export function LoginView({ onNavigate }: LoginViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full">
          <CardHeader className="text-center">
            <motion.div 
              className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Target className="w-8 h-8 text-blue-600" />
            </motion.div>
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
                  onClick={() => onNavigate("therapist-dashboard", "therapist")}
                >
                  Login as Therapist
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate("patient-goals", "patient")}
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
      </motion.div>
    </div>
  )
}