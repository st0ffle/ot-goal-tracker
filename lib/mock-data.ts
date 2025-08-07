// Mock data pour la maquette
export const mockPatients = [
  // Patients actifs
  { id: "1", name: "Emma Johnson", age: 8, totalGoals: 4, completedToday: 3, points: 245, status: 'active' as const },
  { id: "2", name: "Michael Chen", age: 12, totalGoals: 5, completedToday: 4, points: 180, status: 'active' as const },
  { id: "3", name: "Sarah Williams", age: 16, totalGoals: 3, completedToday: 2, points: 320, status: 'active' as const },
  { id: "4", name: "Alex Rodriguez", age: 10, totalGoals: 6, completedToday: 5, points: 410, status: 'active' as const },
  { id: "5", name: "Lily Thompson", age: 7, totalGoals: 3, completedToday: 1, points: 125, status: 'active' as const },
  { id: "6", name: "David Kim", age: 14, totalGoals: 4, completedToday: 4, points: 380, status: 'active' as const },
  { id: "7", name: "Sophie Martin", age: 9, totalGoals: 5, completedToday: 3, points: 290, status: 'active' as const },
  
  // Patients archivés
  { id: "11", name: "Antoine Lefebvre", age: 18, totalGoals: 0, completedToday: 0, points: 650, status: 'archived' as const, archivedAt: '2023-06-15T10:00:00Z' },
  { id: "12", name: "Camille Dubois", age: 16, totalGoals: 0, completedToday: 0, points: 480, status: 'archived' as const, archivedAt: '2023-09-20T14:30:00Z' },
  { id: "13", name: "Hugo Moreau", age: 20, totalGoals: 0, completedToday: 0, points: 720, status: 'archived' as const, archivedAt: '2022-12-10T09:15:00Z' }
]

// Import du type Goal
import type { Goal } from '../utils/goal-helpers'

export const mockGoals: Goal[] = [
  // Objectifs principaux pour patient 1 (Emma Johnson)
  { 
    id: "p1", 
    text: "Améliorer l'autonomie pour l'habillage", 
    type: "primary",
    patientId: "1",
    points: 0, // Sera calculé depuis les secondaires
    completed: false,
    createdAt: "2024-01-15T10:00:00Z"
  },
  { 
    id: "p2", 
    text: "Développer la motricité fine pour l'écriture", 
    type: "primary",
    patientId: "1",
    points: 0,
    completed: false,
    createdAt: "2024-01-15T10:00:00Z"
  },
  
  // Objectifs secondaires du p1
  { 
    id: "s1", 
    text: "Boutonner sa chemise de façon autonome", 
    type: "secondary",
    parentId: "p1",
    patientId: "1",
    points: 10,
    completed: true,
    createdAt: "2024-01-15T10:00:00Z",
    completedAt: "2024-01-20T14:00:00Z"
  },
  { 
    id: "s2", 
    text: "Lacer ses chaussures", 
    type: "secondary",
    parentId: "p1",
    patientId: "1",
    points: 15,
    completed: false,
    createdAt: "2024-01-15T10:00:00Z"
  },
  { 
    id: "s3", 
    text: "Utiliser une fermeture éclair", 
    type: "secondary",
    parentId: "p1",
    patientId: "1",
    points: 10,
    completed: false,
    createdAt: "2024-01-15T10:00:00Z"
  },
  
  // Objectifs secondaires du p2
  { 
    id: "s4", 
    text: "Tenir correctement le crayon", 
    type: "secondary",
    parentId: "p2",
    patientId: "1",
    points: 5,
    completed: true,
    createdAt: "2024-01-15T10:00:00Z",
    completedAt: "2024-01-20T14:00:00Z"
  },
  { 
    id: "s5", 
    text: "Tracer des lignes droites", 
    type: "secondary",
    parentId: "p2",
    patientId: "1",
    points: 10,
    completed: true,
    createdAt: "2024-01-15T10:00:00Z",
    completedAt: "2024-01-20T14:00:00Z"
  },
  { 
    id: "s6", 
    text: "Écrire son prénom", 
    type: "secondary",
    parentId: "p2",
    patientId: "1",
    points: 10,
    completed: false,
    createdAt: "2024-01-15T10:00:00Z"
  },
  
  // Objectif principal pour patient 2 (Michael Chen) - sans secondaires pour l'instant
  { 
    id: "p3", 
    text: "Améliorer l'équilibre et la coordination", 
    type: "primary",
    patientId: "2",
    points: 0,
    completed: false,
    createdAt: "2024-01-16T10:00:00Z"
  },
  
  // Objectifs pour patient 3 (Sarah Williams)
  { 
    id: "p4", 
    text: "Gérer l'organisation du temps scolaire", 
    type: "primary",
    patientId: "3",
    points: 0,
    completed: false,
    createdAt: "2024-01-16T10:00:00Z"
  },
  { 
    id: "s7", 
    text: "Utiliser un agenda de façon autonome", 
    type: "secondary",
    parentId: "p4",
    patientId: "3",
    points: 15,
    completed: true,
    createdAt: "2024-01-16T10:00:00Z",
    completedAt: "2024-01-21T14:00:00Z"
  },
  { 
    id: "s8", 
    text: "Organiser son sac à dos pour l'école", 
    type: "secondary",
    parentId: "p4",
    patientId: "3",
    points: 10,
    completed: false,
    createdAt: "2024-01-16T10:00:00Z"
  }
]

export const mockTherapists = [
  { id: "1", name: "Dr. Sarah Martinez", specialty: "Ergothérapie Pédiatrique" }
]