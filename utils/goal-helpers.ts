// Interfaces pour le système d'objectifs hiérarchiques

export interface Goal {
  id: string
  text: string
  type: 'primary' | 'secondary'
  parentId?: string              // ID du parent si secondaire
  patientId: string              // Lien explicite au patient
  points: number                 // Pour secondaires seulement (0 pour primaires)
  completed: boolean
  createdAt: string
  completedAt?: string
}

export interface PrimaryGoalWithSecondaries {
  primary: Goal
  secondaries: Goal[]
  totalPoints: number           // Somme des points des secondaires
  completedCount: number        // Nombre de secondaires complétés
  progress: number              // Pourcentage de progression
}

// Fonction pour grouper les objectifs par principal
export function groupGoalsByPrimary(goals: Goal[]): PrimaryGoalWithSecondaries[] {
  const primaries = goals.filter(g => g.type === 'primary')
  
  return primaries.map(primary => {
    const secondaries = goals.filter(g => g.parentId === primary.id)
    const completedCount = secondaries.filter(s => s.completed).length
    const totalPoints = secondaries.reduce((sum, s) => sum + s.points, 0)
    
    return {
      primary: {
        ...primary,
        points: totalPoints,
        completed: secondaries.length > 0 && completedCount === secondaries.length
      },
      secondaries,
      totalPoints,
      completedCount,
      progress: secondaries.length > 0 ? (completedCount / secondaries.length) * 100 : 0
    }
  })
}

// Fonction pour obtenir les objectifs principaux sans secondaires
export function getStandalonePrimaryGoals(goals: Goal[]): Goal[] {
  const primaries = goals.filter(g => g.type === 'primary')
  return primaries.filter(primary => 
    !goals.some(g => g.parentId === primary.id)
  )
}

// Fonction pour obtenir les objectifs secondaires orphelins (sans parent)
export function getOrphanSecondaryGoals(goals: Goal[]): Goal[] {
  return goals.filter(g => 
    g.type === 'secondary' && 
    !goals.some(parent => parent.id === g.parentId)
  )
}

// Fonction pour basculer l'état d'un objectif secondaire
export function toggleSecondaryGoal(goalId: string, goals: Goal[]): Goal[] {
  const updatedGoals = goals.map(goal => {
    if (goal.id === goalId) {
      // Toggle le secondaire
      return {
        ...goal,
        completed: !goal.completed,
        completedAt: !goal.completed ? new Date().toISOString() : undefined
      }
    }
    return goal
  })
  
  // Mettre à jour les objectifs principaux concernés
  return updatedGoals.map(goal => {
    if (goal.type === 'primary') {
      const secondaries = updatedGoals.filter(g => g.parentId === goal.id)
      if (secondaries.length > 0) {
        const allCompleted = secondaries.every(s => s.completed)
        return {
          ...goal,
          completed: allCompleted,
          completedAt: allCompleted ? new Date().toISOString() : undefined
        }
      }
    }
    return goal
  })
}

// Fonction pour calculer les statistiques d'un patient
export function calculatePatientGoalStats(patientId: string, goals: Goal[]) {
  const patientGoals = goals.filter(g => g.patientId === patientId)
  const grouped = groupGoalsByPrimary(patientGoals)
  
  const totalPrimaryGoals = grouped.length
  const completedPrimaryGoals = grouped.filter(g => g.primary.completed).length
  
  const totalSecondaryGoals = grouped.reduce((sum, g) => sum + g.secondaries.length, 0)
  const completedSecondaryGoals = grouped.reduce((sum, g) => sum + g.completedCount, 0)
  
  const totalPoints = grouped.reduce((sum, g) => sum + g.totalPoints, 0)
  const earnedPoints = grouped.reduce((sum, g) => 
    sum + g.secondaries.filter(s => s.completed).reduce((pts, s) => pts + s.points, 0), 0
  )
  
  return {
    totalPrimaryGoals,
    completedPrimaryGoals,
    totalSecondaryGoals,
    completedSecondaryGoals,
    totalPoints,
    earnedPoints,
    overallProgress: totalSecondaryGoals > 0 
      ? (completedSecondaryGoals / totalSecondaryGoals) * 100 
      : 0
  }
}

// Interfaces pour le progrès hebdomadaire
export interface DayProgress {
  date: string                    // '2024-01-15'
  dayName: string                 // 'Lundi'
  completedGoals: string[]        // IDs des objectifs complétés
  totalGoals: number              // Nombre total d'objectifs ce jour
  pointsEarned: number            // Points gagnés
  pointsPossible: number          // Points possibles
  completionRate: number          // Pourcentage 0-100
}

export interface WeekProgress {
  weekStart: string               // '2024-01-15'
  weekEnd: string                 // '2024-01-21'
  days: DayProgress[]             // 7 jours
  totalPoints: number             // Somme semaine
  averageCompletion: number       // Moyenne %
  bestDay: DayProgress | null     // Meilleur jour
}

// Fonction pour calculer le progrès d'une semaine
export function calculateWeekProgress(
  goals: Goal[], 
  weekStart: Date = new Date()
): WeekProgress {
  // Pour la maquette, on génère des données mock
  // En vrai, on filtrerait par completedAt dans la semaine
  
  const days: DayProgress[] = []
  const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  
  // Obtenir le lundi de la semaine
  const monday = new Date(weekStart)
  const day = monday.getDay()
  const diff = monday.getDate() - day + (day === 0 ? -6 : 1)
  monday.setDate(diff)
  
  // Générer 7 jours de données mock
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(date.getDate() + i)
    
    // Mock data réaliste avec variation
    const scenarios = [
      { completed: 4, total: 5 }, // Très bon jour
      { completed: 2, total: 4 }, // Jour moyen
      { completed: 5, total: 5 }, // Jour parfait
      { completed: 3, total: 3 }, // Petit jour parfait
      { completed: 0, total: 2 }, // Mauvais jour
      { completed: 1, total: 3 }, // Jour difficile
      { completed: 2, total: 5 }, // Jour partiel
    ]
    
    const scenario = scenarios[i % scenarios.length]
    const points = scenario.completed * 10
    
    days.push({
      date: date.toISOString().split('T')[0],
      dayName: dayNames[i],
      completedGoals: [], // Pour la maquette, vide
      totalGoals: scenario.total,
      pointsEarned: points,
      pointsPossible: scenario.total * 10,
      completionRate: scenario.total > 0 
        ? Math.round((scenario.completed / scenario.total) * 100) 
        : 0
    })
  }
  
  const totalPoints = days.reduce((sum, d) => sum + d.pointsEarned, 0)
  const averageCompletion = Math.round(
    days.reduce((sum, d) => sum + d.completionRate, 0) / 7
  )
  const bestDay = days.reduce((best, day) => 
    day.completionRate > (best?.completionRate || 0) ? day : best
  , days[0])
  
  return {
    weekStart: monday.toISOString().split('T')[0],
    weekEnd: new Date(monday.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    days,
    totalPoints,
    averageCompletion,
    bestDay
  }
}

// Fonction pour obtenir la couleur selon le taux
export function getCompletionColor(rate: number): string {
  if (rate === 100) return 'bg-green-500'      // 🟩 Parfait
  if (rate >= 75) return 'bg-green-400'        // 🟢 Très bien
  if (rate >= 50) return 'bg-yellow-400'       // 🟨 Bien
  if (rate >= 25) return 'bg-orange-400'       // 🟧 Moyen
  if (rate > 0) return 'bg-orange-500'         // 🟠 Faible
  return 'bg-red-500'                          // 🟥 Aucun
}

// Fonction pour l'emoji selon le taux
export function getCompletionEmoji(rate: number): string {
  if (rate === 100) return '🎉'
  if (rate >= 75) return '✅'
  if (rate >= 50) return '👍'
  if (rate >= 25) return '⚠️'
  if (rate > 0) return '🔻'
  return '❌'
}

// Interface simple pour les commentaires
export interface Comment {
  id: string
  patientId: string
  text: string
  type: 'absence' | 'note' | 'progress'
  createdAt: string
  weekDate?: string  // pour lier à une semaine spécifique
}