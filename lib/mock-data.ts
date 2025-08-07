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

export const mockGoals = [
  { id: "1", text: "S'exercer à boutonner sa chemise de façon autonome", completed: true, points: 10 },
  { id: "2", text: "Utiliser fourchette et couteau pendant tout le repas", completed: true, points: 15 },
  { id: "3", text: "Compléter 10 minutes d'exercices d'écriture", completed: true, points: 10 },
  { id: "4", text: "Organiser son sac à dos pour l'école", completed: false, points: 10 }
]

export const mockPatientGoals = [
  { id: "1", text: "S'exercer à lacer ses chaussures", completed: true, points: 15 },
  { id: "2", text: "Compléter la liste de routine du matin", completed: false, points: 10 },
  { id: "3", text: "Utiliser les deux mains pour l'activité de découpage", completed: false, points: 10 }
]

export const mockTherapists = [
  { id: "1", name: "Dr. Sarah Martinez", specialty: "Ergothérapie Pédiatrique" }
]