# 🟡 PRIORITÉ 3 - Polish & Démo (1-2 jours)

## ✨ Améliorations Visuelles

### ✅ Dark mode simple
```tsx
// components/theme-toggle.tsx
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Éviter l'hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return <div className="w-9 h-9" /> // Placeholder pour éviter le layout shift
  }
  
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  )
}

// app/layout.tsx - Wrapper avec ThemeProvider
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

// Styles Tailwind pour dark mode
// Exemples de classes:
// bg-white dark:bg-gray-900
// text-gray-900 dark:text-gray-100
// border-gray-200 dark:border-gray-700
```
**Pourquoi:** Feature moderne très appréciée  
**Effort:** 1h  
**Status:** [ ] À faire

---

### ✅ Loading states et skeletons
```tsx
// components/ui/loading-states.tsx
import { Skeleton } from '@/components/ui/skeleton'

// Skeleton pour une carte patient
export function PatientCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-2 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  )
}

// Liste de skeletons
export function PatientListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <PatientCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Spinner simple
export function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }
  
  return (
    <div className="flex justify-center items-center p-4">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`} />
    </div>
  )
}

// Hook pour simuler le chargement
export function useLoadingState<T>(data: T, delay = 500) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadedData, setLoadedData] = useState<T | null>(null)
  
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setLoadedData(data)
      setIsLoading(false)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [data, delay])
  
  return { isLoading, data: loadedData }
}

// Utilisation dans un composant
export function PatientsList({ patients }) {
  const { isLoading, data } = useLoadingState(patients, 300)
  
  if (isLoading) {
    return <PatientListSkeleton />
  }
  
  return (
    <div className="space-y-4">
      {data?.map(patient => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  )
}
```
**Pourquoi:** UX fluide et professionnelle  
**Effort:** 1h  
**Status:** [ ] À faire

---

### ✅ Notifications toast améliorées
```tsx
// components/toast-notifications.tsx
import { Toaster, toast } from 'sonner'

// Configuration globale du Toaster (dans layout.tsx)
export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      expand={false}
      richColors
      closeButton
      duration={4000}
      theme="light" // ou "dark" ou "system"
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #e5e7eb',
        },
        className: 'toast-notification',
      }}
    />
  )
}

// Helpers pour différents types de notifications
export const notify = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      icon: '✅',
    })
  },
  
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      icon: '❌',
    })
  },
  
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      icon: 'ℹ️',
    })
  },
  
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      icon: '⚠️',
    })
  },
  
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return toast.promise(promise, messages)
  },
  
  custom: (component: React.ReactNode) => {
    toast.custom(component)
  }
}

// Exemples d'utilisation
export function ExampleUsage() {
  const handleSave = async () => {
    // Notification simple
    notify.success('Patient enregistré!')
    
    // Notification avec description
    notify.success('Objectif créé', 'Le patient recevra une notification')
    
    // Notification avec promesse
    const savePromise = savePatient(data)
    notify.promise(savePromise, {
      loading: 'Enregistrement en cours...',
      success: (data) => `${data.name} a été enregistré`,
      error: (err) => `Erreur: ${err.message}`
    })
    
    // Notification custom avec action
    toast.custom((t) => (
      <div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-lg">
        <span>Voulez-vous annuler?</span>
        <button
          onClick={() => {
            handleUndo()
            toast.dismiss(t)
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Annuler
        </button>
      </div>
    ))
  }
}
```
**Pourquoi:** Feedback utilisateur clair et moderne  
**Effort:** 30 min  
**Status:** [ ] À faire

---

## 📊 Données de Démo

### ✅ Générateur de données réalistes
```typescript
// utils/generate-demo-data.ts
import { faker } from '@faker-js/faker/locale/fr'

// Configurer la locale française
faker.locale = 'fr'

// Générateur de patients
export function generatePatients(count: number = 10): Patient[] {
  const therapistId = 'therapist-demo'
  
  return Array.from({ length: count }, (_, index) => {
    const age = faker.number.int({ min: 5, max: 18 })
    const totalGoals = faker.number.int({ min: 3, max: 8 })
    const completedToday = faker.number.int({ min: 0, max: totalGoals })
    
    return {
      id: `patient-${index + 1}`,
      name: faker.person.fullName(),
      age,
      totalGoals,
      completedToday,
      points: faker.number.int({ min: 0, max: 500 }),
      therapistId,
      createdAt: faker.date.recent({ days: 30 }).toISOString(),
      updatedAt: faker.date.recent({ days: 7 }).toISOString(),
      // Données additionnelles pour le réalisme
      diagnosis: faker.helpers.arrayElement([
        'Trouble du spectre autistique',
        'Dyspraxie',
        'Trouble de l\'attention',
        'Retard de développement',
        'Paralysie cérébrale légère'
      ]),
      nextSession: faker.date.soon({ days: 7 }).toISOString(),
      notes: faker.lorem.sentence()
    }
  })
}

// Générateur d'objectifs thérapeutiques
export function generateGoals(patientId: string, count: number = 5): Goal[] {
  const categories = ['Motricité fine', 'Motricité globale', 'Autonomie', 'Cognitif', 'Social']
  
  const goalTemplates = {
    'Motricité fine': [
      'Boutonner sa chemise sans aide',
      'Utiliser des ciseaux pour découper',
      'Écrire son prénom lisiblement',
      'Lacer ses chaussures',
      'Manipuler de petits objets'
    ],
    'Motricité globale': [
      'Monter les escaliers en alternant',
      'Sauter à cloche-pied sur 5 mètres',
      'Lancer et attraper une balle',
      'Faire du vélo sans roulettes',
      'Maintenir l\'équilibre sur un pied'
    ],
    'Autonomie': [
      'S\'habiller seul le matin',
      'Préparer son sac d\'école',
      'Se brosser les dents correctement',
      'Ranger sa chambre',
      'Mettre la table'
    ],
    'Cognitif': [
      'Suivre des instructions à 3 étapes',
      'Compléter un puzzle de 50 pièces',
      'Reconnaître les émotions',
      'Mémoriser une liste de 5 items',
      'Résoudre des problèmes simples'
    ],
    'Social': [
      'Attendre son tour dans un jeu',
      'Partager avec les autres',
      'Exprimer ses besoins verbalement',
      'Reconnaître les émotions des autres',
      'Participer à une activité de groupe'
    ]
  }
  
  return Array.from({ length: count }, (_, index) => {
    const category = faker.helpers.arrayElement(categories)
    const goalText = faker.helpers.arrayElement(goalTemplates[category])
    const completed = faker.datatype.boolean(0.3) // 30% de chance d'être complété
    
    return {
      id: `goal-${patientId}-${index + 1}`,
      patientId,
      text: goalText,
      category,
      completed,
      points: faker.number.int({ min: 5, max: 20 }),
      createdAt: faker.date.recent({ days: 14 }).toISOString(),
      completedAt: completed ? faker.date.recent({ days: 1 }).toISOString() : null,
      notes: faker.datatype.boolean(0.5) ? faker.lorem.sentence() : null
    }
  })
}

// Générateur de sessions
export function generateSessions(patientId: string, count: number = 10): Session[] {
  return Array.from({ length: count }, (_, index) => {
    const date = faker.date.recent({ days: 30 - index })
    const goalsCompleted = faker.number.int({ min: 0, max: 5 })
    
    return {
      id: `session-${patientId}-${index + 1}`,
      patientId,
      date: date.toISOString(),
      duration: faker.number.int({ min: 30, max: 60 }),
      goalsCompleted,
      notes: faker.lorem.paragraph(),
      exercises: faker.helpers.arrayElements([
        'Exercices de préhension',
        'Activités de coordination',
        'Jeux de construction',
        'Dessin et coloriage',
        'Exercices d\'équilibre',
        'Activités sensorielles'
      ], { min: 2, max: 4 })
    }
  })
}

// Fonction pour générer un jeu de données complet
export function generateCompleteDataset() {
  const patients = generatePatients(15)
  const goals = patients.flatMap(p => generateGoals(p.id, 5))
  const sessions = patients.flatMap(p => generateSessions(p.id, 8))
  
  return {
    patients,
    goals,
    sessions,
    stats: {
      totalPatients: patients.length,
      totalGoals: goals.length,
      completedGoals: goals.filter(g => g.completed).length,
      totalSessions: sessions.length,
      avgGoalsPerPatient: Math.round(goals.length / patients.length)
    }
  }
}
```

**Installation faker:**
```bash
npm install --save-dev @faker-js/faker
```

**Pourquoi:** Démo avec données crédibles et variées  
**Effort:** 1h  
**Status:** [ ] À faire

---

### ✅ Mode démo avec données pré-remplies
```tsx
// components/demo-mode.tsx
import { useState } from 'react'
import { generateCompleteDataset } from '@/utils/generate-demo-data'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'

export function DemoModeButton() {
  const [showDialog, setShowDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const loadDemoData = async () => {
    setIsLoading(true)
    
    try {
      // Générer les données
      const demoData = generateCompleteDataset()
      
      // Sauvegarder dans localStorage
      localStorage.setItem('ot-patients', JSON.stringify(demoData.patients))
      localStorage.setItem('ot-goals', JSON.stringify(demoData.goals))
      localStorage.setItem('ot-sessions', JSON.stringify(demoData.sessions))
      
      // Créer un utilisateur démo
      const demoUser = {
        id: 'demo-therapist',
        email: 'demo@ot-tracker.com',
        name: 'Dr. Demo',
        role: 'therapist',
        avatar: 'https://ui-avatars.com/api/?name=Dr+Demo'
      }
      localStorage.setItem('ot-user', JSON.stringify(demoUser))
      
      // Ajouter un flag pour indiquer qu'on est en mode démo
      localStorage.setItem('ot-demo-mode', 'true')
      
      // Notification de succès
      notify.success(
        'Mode démo activé!',
        `${demoData.patients.length} patients et ${demoData.goals.length} objectifs chargés`
      )
      
      // Recharger la page
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      notify.error('Erreur lors du chargement des données de démo')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const clearDemoData = () => {
    // Effacer toutes les données
    const keysToRemove = [
      'ot-patients',
      'ot-goals', 
      'ot-sessions',
      'ot-user',
      'ot-demo-mode'
    ]
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    notify.info('Données de démo supprimées')
    window.location.reload()
  }
  
  const isDemoMode = localStorage.getItem('ot-demo-mode') === 'true'
  
  return (
    <>
      <Button
        variant={isDemoMode ? 'destructive' : 'outline'}
        onClick={() => setShowDialog(true)}
        className="flex items-center gap-2"
      >
        {isDemoMode ? (
          <>
            <span className="animate-pulse">●</span>
            Mode Démo Actif
          </>
        ) : (
          'Charger Démo'
        )}
      </Button>
      
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isDemoMode ? 'Désactiver le mode démo?' : 'Activer le mode démo?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isDemoMode ? (
                'Cela supprimera toutes les données de démonstration. Vos vraies données ne seront pas affectées.'
              ) : (
                <>
                  <p>Cela va charger des données de démonstration incluant:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>15 patients avec des profils variés</li>
                    <li>75 objectifs thérapeutiques</li>
                    <li>120 sessions d'historique</li>
                    <li>Un compte thérapeute de démo</li>
                  </ul>
                  <p className="mt-2 text-yellow-600">
                    ⚠️ Les données actuelles seront remplacées
                  </p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={isDemoMode ? clearDemoData : loadDemoData}
              disabled={isLoading}
            >
              {isLoading ? 'Chargement...' : isDemoMode ? 'Supprimer' : 'Charger la démo'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Badge pour indiquer le mode démo
export function DemoModeBadge() {
  const isDemoMode = localStorage.getItem('ot-demo-mode') === 'true'
  
  if (!isDemoMode) return null
  
  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-yellow-500 text-yellow-900 px-4 py-1 rounded-b-lg text-sm font-medium">
        🎭 Mode Démonstration
      </div>
    </div>
  )
}
```
**Pourquoi:** Faciliter les présentations et tests  
**Effort:** 30 min  
**Status:** [ ] À faire

---

## 🚀 Optimisations Simples

### ✅ Lazy loading des vues
```tsx
// app/page.tsx - Version optimisée
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/ui/loading-states'

// Lazy load des vues principales
const LoginView = dynamic(() => import('@/components/views/login-view'), {
  loading: () => <LoadingSpinner size="lg" />
})

const TherapistDashboard = dynamic(() => import('@/components/views/therapist-dashboard'), {
  loading: () => <LoadingSpinner size="lg" />
})

const PatientDetail = dynamic(() => import('@/components/views/patient-detail'), {
  loading: () => <LoadingSpinner size="lg" />
})

const CreateGoal = dynamic(() => import('@/components/views/create-goal'), {
  loading: () => <LoadingSpinner size="lg" />
})

// Map des vues
const viewComponents = {
  login: LoginView,
  dashboard: TherapistDashboard,
  'patient-detail': PatientDetail,
  'create-goal': CreateGoal
}

export default function App() {
  const [currentView, setCurrentView] = useState('login')
  
  const ViewComponent = viewComponents[currentView] || LoginView
  
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <ViewComponent onNavigate={setCurrentView} />
    </Suspense>
  )
}
```
**Pourquoi:** Chargement initial plus rapide  
**Effort:** 30 min  
**Status:** [ ] À faire

---

### ✅ Mémoisation des calculs lourds
```tsx
// hooks/use-statistics.ts
import { useMemo } from 'react'

export function usePatientStatistics(patients: Patient[]) {
  // Calculs lourds mémorisés
  const statistics = useMemo(() => {
    if (!patients.length) {
      return {
        total: 0,
        avgAge: 0,
        avgCompletion: 0,
        totalPoints: 0,
        byAgeGroup: {},
        byProgress: {}
      }
    }
    
    const total = patients.length
    const avgAge = Math.round(
      patients.reduce((sum, p) => sum + p.age, 0) / total
    )
    
    const avgCompletion = Math.round(
      patients.reduce((sum, p) => {
        const rate = (p.completedToday / p.totalGoals) * 100
        return sum + rate
      }, 0) / total
    )
    
    const totalPoints = patients.reduce((sum, p) => sum + p.points, 0)
    
    // Grouper par tranche d'âge
    const byAgeGroup = patients.reduce((groups, p) => {
      const group = p.age < 10 ? '5-9' : p.age < 15 ? '10-14' : '15+'
      groups[group] = (groups[group] || 0) + 1
      return groups
    }, {} as Record<string, number>)
    
    // Grouper par progression
    const byProgress = patients.reduce((groups, p) => {
      const rate = (p.completedToday / p.totalGoals) * 100
      const level = rate >= 80 ? 'high' : rate >= 40 ? 'medium' : 'low'
      groups[level] = (groups[level] || 0) + 1
      return groups
    }, {} as Record<string, number>)
    
    return {
      total,
      avgAge,
      avgCompletion,
      totalPoints,
      byAgeGroup,
      byProgress
    }
  }, [patients])
  
  // Tendances (compare avec la semaine dernière)
  const trends = useMemo(() => {
    // Simuler des tendances pour la démo
    return {
      patientsChange: '+12%',
      completionChange: '+5%',
      pointsChange: '+18%',
      isPositive: true
    }
  }, [])
  
  return { statistics, trends }
}

// Utilisation
export function StatsCards({ patients }) {
  const { statistics, trends } = usePatientStatistics(patients)
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        title="Total Patients"
        value={statistics.total}
        trend={trends.patientsChange}
        isPositive={trends.isPositive}
      />
      {/* Autres cartes... */}
    </div>
  )
}
```
**Pourquoi:** Performance fluide même avec beaucoup de données  
**Effort:** 30 min  
**Status:** [ ] À faire

---

## 📋 Checklist Priorité 3 avec Points de Test

### 🔧 ÉTAPE 1 : Dark Mode et Thème
- [ ] Créer `components/theme-toggle.tsx`
- [ ] Configurer ThemeProvider dans layout.tsx
- [ ] Ajouter le bouton toggle dans le header
- [ ] Appliquer les classes dark: sur au moins 5 composants

### 🧪 POINT DE TEST #1
```bash
npm run dev
```
**✓ Vérifier :**
- Cliquer sur le toggle dark mode
- Tout doit passer en sombre (pas de zones blanches oubliées)
- Rafraîchir → le thème persiste
- Contraste suffisant en dark mode
- Pas de flash blanc au chargement

**🛑 STOP - DEMANDER FEEDBACK UTILISATEUR**
> "Dark mode implémenté. Tous les éléments sont visibles ? Le contraste est bon ?"

---

### 🔧 ÉTAPE 2 : Loading States et Feedback
- [ ] Créer `components/ui/loading-states.tsx`
- [ ] Ajouter des skeletons pour les listes
- [ ] Créer `components/toast-notifications.tsx`
- [ ] Configurer Toaster dans layout.tsx
- [ ] Ajouter des toasts sur les actions CRUD

### 🧪 POINT DE TEST #2
```bash
npm run dev
```
**✓ Vérifier :**
- Simuler un chargement → skeletons visibles
- Ajouter un patient → toast "Patient ajouté ✅"
- Supprimer → toast "Patient supprimé"
- Erreur simulée → toast rouge d'erreur
- Position des toasts (bottom-right)
- Les toasts disparaissent après 4s

**🛑 STOP - DEMANDER FEEDBACK UTILISATEUR**
> "Loading states et notifications OK ? L'UX est fluide ? Prêt pour les données de démo ?"

---

### 🔧 ÉTAPE 3 : Générateur de Données Réalistes
- [ ] Installer @faker-js/faker
- [ ] Créer `utils/generate-demo-data.ts`
- [ ] Générer 15 patients avec données françaises
- [ ] Générer 5 objectifs par patient
- [ ] Ajouter des diagnostics réalistes

### 🧪 POINT DE TEST #3
```bash
npm run dev
# Dans la console du navigateur :
import { generateCompleteDataset } from './utils/generate-demo-data'
const data = generateCompleteDataset()
console.log(data)
```
**✓ Vérifier :**
- Noms français réalistes
- Âges cohérents (5-18 ans)
- Objectifs thérapeutiques crédibles
- Variété dans les données
- Pas de données absurdes

**🛑 STOP - DEMANDER FEEDBACK UTILISATEUR**
> "Générateur de données OK ? Les données sont crédibles pour une démo ?"

---

### 🔧 ÉTAPE 4 : Mode Démo One-Click
- [ ] Créer `components/demo-mode.tsx`
- [ ] Ajouter bouton "Charger Démo" dans le header
- [ ] Badge "Mode Démo" quand actif
- [ ] Bouton pour nettoyer les données de démo
- [ ] Confirmation avant écrasement des données

### 🧪 POINT DE TEST #4
```bash
npm run dev
```
**✓ Vérifier :**
- Cliquer "Charger Démo" → 15 patients apparaissent
- Badge jaune "Mode Démo" visible
- Données variées et réalistes
- Export JSON → fichier contient toutes les données
- "Supprimer Démo" → retour à zéro
- Re-charger démo → nouvelles données (pas les mêmes)

**🛑 STOP - DEMANDER FEEDBACK UTILISATEUR**
> "Mode démo one-click fonctionnel ? Pratique pour les présentations ?"

---

### 🔧 ÉTAPE 5 : Optimisations et Polish Final
- [ ] Implémenter lazy loading des vues
- [ ] Créer `hooks/use-statistics.ts` avec mémoisation
- [ ] Ajouter des animations subtiles (framer-motion)
- [ ] Optimiser les images avec next/image
- [ ] Vérifier les performances

### 🧪 POINT DE TEST #5 - TEST FINAL COMPLET
```bash
npm run dev
```

**⚡ Test Performance :**
- Charger 50+ patients via démo
- Filtrer → doit être instantané
- Changer de vue → transition fluide
- Dark/Light mode → pas de lag
- Export 50+ patients → rapide

**🎨 Test Visuel :**
- Animations entrée/sortie des vues
- Hover sur les boutons
- Transitions douces partout
- Pas d'éléments qui "sautent"
- Dark mode parfait

**📱 Test Cross-Platform :**
- Chrome, Firefox, Safari
- Mobile (iOS/Android si possible)
- Tablette
- Différentes résolutions

**🎯 Test Démo Complète (5 min) :**
1. Login
2. Charger données démo
3. Naviguer entre patients
4. Ajouter un patient
5. Filtrer la liste
6. Voir détails patient
7. Créer un objectif
8. Basculer dark mode
9. Export données
10. Menu mobile
11. Déconnexion

**🛑 STOP - VALIDATION FINALE DU PROJET**
> "🎉 Maquette complète terminée ! Prête pour présentation ? Bugs restants ? Satisfaction générale ?"

---

## 🎯 Résultat Attendu

Après cette priorité :
- **Dark mode** fonctionnel et élégant
- **Loading states** partout où nécessaire
- **Notifications** claires et informatives
- **Données de démo** réalistes (15+ patients)
- **Mode démo** activable en 1 clic
- **Performance** optimisée (<2s chargement initial)
- **Animations** fluides et professionnelles

---

## 💡 Tips d'Implémentation

1. **Dark mode**: Tester avec `prefers-color-scheme` du système
2. **Faker**: Utiliser la locale française pour des noms réalistes
3. **Animations**: Rester subtil, éviter l'excès
4. **Demo mode**: Ajouter un badge visible pour éviter la confusion
5. **Memoization**: Mesurer avant/après pour valider le gain

---

## 📊 Métriques de Succès

- ✅ Dark mode sans flash au chargement
- ✅ Toutes les actions ont un feedback visuel
- ✅ Données de démo générées en <1s
- ✅ Lazy loading réduit le bundle initial de 50%+
- ✅ Animations à 60 FPS
- ✅ Mode démo clairement identifiable