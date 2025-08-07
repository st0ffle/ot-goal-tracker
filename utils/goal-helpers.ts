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