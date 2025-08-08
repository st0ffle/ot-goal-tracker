"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, User } from 'lucide-react'
import { motion } from 'framer-motion'

export function LoginView() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
            <CardDescription>Suivez les objectifs thérapeutiques et célébrez les progrès</CardDescription>
          </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={(e) => {
                e.preventDefault()
                // Validation simple pour maquette
                if (email && password) {
                  router.push('/therapist')
                }
              }}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Entrez votre email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Entrez votre mot de passe" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Button 
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                    >
                      Connexion Ergothérapeute
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push('/patient/1')}
                    >
                      Connexion Patient (Emma)
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" placeholder="Entrez votre nom complet" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input id="reg-email" type="email" placeholder="Entrez votre email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Mot de passe</Label>
                <Input id="reg-password" type="password" placeholder="Créez un mot de passe" />
              </div>
              <div className="space-y-2">
                <Label>Type de compte</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-auto p-4 flex flex-col">
                    <User className="w-6 h-6 mb-2" />
                    <span className="text-sm">Ergothérapeute</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col">
                    <Target className="w-6 h-6 mb-2" />
                    <span className="text-sm">Patient</span>
                  </Button>
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Créer un compte
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}