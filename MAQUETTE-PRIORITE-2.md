# 🟠 PRIORITÉ 2 - Fonctionnalités Maquette (2-3 jours)

## 💾 Persistance Locale (sans backend)

### ✅ Implémenter localStorage pour sauvegarder l'état
```typescript
// hooks/use-local-storage.ts
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // État initial depuis localStorage ou valeur par défaut
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
      return initialValue
    }
  })
  
  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }, [key, value])
  
  return [value, setValue] as const
}

// Utilisation dans les composants
const [patients, setPatients] = useLocalStorage('ot-patients', mockPatients)
const [goals, setGoals] = useLocalStorage('ot-goals', mockGoals)
const [currentUser, setCurrentUser] = useLocalStorage('ot-user', null)
```
**Pourquoi:** Données persistent au refresh, expérience utilisateur réaliste  
**Effort:** 1h  
**Status:** [ ] À faire

---

### ✅ Système de "fake auth" avec localStorage
```typescript
// lib/fake-auth.ts
export interface User {
  id: string
  email: string
  name: string
  role: 'therapist' | 'patient'
  avatar?: string
}

export const fakeAuth = {
  // Login avec validation basique
  login: async (email: string, password: string): Promise<User | null> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Validation simple
    if (!email || !password) {
      throw new Error('Email et mot de passe requis')
    }
    
    // Déterminer le rôle selon l'email
    const role = email.includes('therapist') ? 'therapist' : 'patient'
    
    const user: User = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      role,
      avatar: `https://ui-avatars.com/api/?name=${email}`
    }
    
    localStorage.setItem('ot-user', JSON.stringify(user))
    return user
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('ot-user')
    window.location.href = '/'
  },
  
  // Récupérer l'utilisateur actuel
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('ot-user')
    return stored ? JSON.parse(stored) : null
  },
  
  // Vérifier si connecté
  isAuthenticated: (): boolean => {
    return !!fakeAuth.getUser()
  }
}
```
**Pourquoi:** Simuler un flow d'auth réaliste pour la démo  
**Effort:** 30 min  
**Status:** [ ] À faire

---

## 🎯 Fonctionnalités Interactives

### ✅ CRUD complet en mémoire/localStorage
```typescript
// hooks/use-patients.ts
import { useLocalStorage } from './use-local-storage'

export interface Patient {
  id: string
  name: string
  age: number
  totalGoals: number
  completedToday: number
  points: number
  therapistId?: string
  createdAt: string
  updatedAt: string
}

export function usePatients() {
  const [patients, setPatients] = useLocalStorage<Patient[]>('ot-patients', mockPatients)
  
  // CREATE
  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: `patient-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setPatients(prev => [...prev, newPatient])
    return newPatient
  }
  
  // READ
  const getPatient = (id: string) => {
    return patients.find(p => p.id === id)
  }
  
  // UPDATE
  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => 
      p.id === id 
        ? { ...p, ...updates, updatedAt: new Date().toISOString() }
        : p
    ))
  }
  
  // DELETE
  const deletePatient = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      setPatients(prev => prev.filter(p => p.id !== id))
    }
  }
  
  // BULK OPERATIONS
  const importPatients = (newPatients: Patient[]) => {
    setPatients(newPatients)
  }
  
  const clearAllPatients = () => {
    if (window.confirm('Supprimer TOUS les patients ?')) {
      setPatients([])
    }
  }
  
  return {
    patients,
    addPatient,
    getPatient,
    updatePatient,
    deletePatient,
    importPatients,
    clearAllPatients
  }
}
```
**Pourquoi:** Actions complètes sans backend, UX réaliste  
**Effort:** 2h  
**Status:** [ ] À faire

---

### ✅ Filtres et recherche côté client avancés
```typescript
// hooks/use-filtered-patients.ts
import { useMemo, useState } from 'react'

export function useFilteredPatients(patients: Patient[]) {
  const [search, setSearch] = useState('')
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 100])
  const [progressFilter, setProgressFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'points' | 'progress'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  const filteredAndSorted = useMemo(() => {
    let result = [...patients]
    
    // Recherche
    if (search) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.includes(search)
      )
    }
    
    // Filtre par âge
    result = result.filter(p => p.age >= ageRange[0] && p.age <= ageRange[1])
    
    // Filtre par progression
    if (progressFilter !== 'all') {
      result = result.filter(p => {
        const progress = (p.completedToday / p.totalGoals) * 100
        switch (progressFilter) {
          case 'high': return progress >= 80
          case 'medium': return progress >= 40 && progress < 80
          case 'low': return progress < 40
        }
      })
    }
    
    // Tri
    result.sort((a, b) => {
      let compareValue = 0
      
      switch (sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name)
          break
        case 'age':
          compareValue = a.age - b.age
          break
        case 'points':
          compareValue = a.points - b.points
          break
        case 'progress':
          const progressA = (a.completedToday / a.totalGoals) * 100
          const progressB = (b.completedToday / b.totalGoals) * 100
          compareValue = progressA - progressB
          break
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue
    })
    
    return result
  }, [patients, search, ageRange, progressFilter, sortBy, sortOrder])
  
  return {
    filteredPatients: filteredAndSorted,
    filters: {
      search,
      setSearch,
      ageRange,
      setAgeRange,
      progressFilter,
      setProgressFilter,
      sortBy,
      setSortBy,
      sortOrder,
      setSortOrder
    },
    resetFilters: () => {
      setSearch('')
      setAgeRange([0, 100])
      setProgressFilter('all')
      setSortBy('name')
      setSortOrder('asc')
    }
  }
}
```
**Pourquoi:** Interactivité instantanée, filtrage puissant  
**Effort:** 1h  
**Status:** [ ] À faire

---

### ✅ Export/Import des données (JSON)
```typescript
// utils/data-export.ts
export const dataExport = {
  // Export toutes les données
  exportAll: () => {
    const data = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      patients: JSON.parse(localStorage.getItem('ot-patients') || '[]'),
      goals: JSON.parse(localStorage.getItem('ot-goals') || '[]'),
      user: JSON.parse(localStorage.getItem('ot-user') || 'null')
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ot-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  },
  
  // Import des données
  importAll: (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          
          // Validation basique
          if (!data.version || !data.patients) {
            throw new Error('Format de fichier invalide')
          }
          
          // Restaurer les données
          localStorage.setItem('ot-patients', JSON.stringify(data.patients))
          localStorage.setItem('ot-goals', JSON.stringify(data.goals || []))
          if (data.user) {
            localStorage.setItem('ot-user', JSON.stringify(data.user))
          }
          
          // Recharger la page pour appliquer les changements
          window.location.reload()
          resolve()
        } catch (error) {
          reject(error)
        }
      }
      
      reader.readAsText(file)
    })
  },
  
  // Export CSV pour Excel
  exportPatientsCSV: (patients: Patient[]) => {
    const headers = ['ID', 'Nom', 'Âge', 'Objectifs', 'Complétés', 'Points']
    const rows = patients.map(p => [
      p.id,
      p.name,
      p.age,
      p.totalGoals,
      p.completedToday,
      p.points
    ])
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `patients-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
}

// Composant d'import
export function DataImportButton() {
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      dataExport.importAll(file)
        .then(() => toast.success('Données importées avec succès'))
        .catch(err => toast.error(`Erreur: ${err.message}`))
    }
  }
  
  return (
    <label className="cursor-pointer">
      <input 
        type="file" 
        accept=".json" 
        onChange={handleImport}
        className="hidden"
      />
      <Button variant="outline">
        <Upload className="w-4 h-4 mr-2" />
        Importer données
      </Button>
    </label>
  )
}
```
**Pourquoi:** Backup des données, partage entre collègues  
**Effort:** 1h  
**Status:** [ ] À faire

---

## 📱 Responsive Design

### ✅ Mobile-first avec Tailwind patterns
```tsx
// components/responsive-patterns.tsx

// Pattern 1: Grid responsive
export function ResponsiveGrid({ children }) {
  return (
    <div className="
      grid gap-4
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
    ">
      {children}
    </div>
  )
}

// Pattern 2: Container responsive
export function ResponsiveContainer({ children }) {
  return (
    <div className="
      w-full
      max-w-7xl
      mx-auto
      px-4 sm:px-6 lg:px-8
    ">
      {children}
    </div>
  )
}

// Pattern 3: Text responsive
export function ResponsiveHeading({ children }) {
  return (
    <h1 className="
      text-2xl sm:text-3xl lg:text-4xl
      font-bold
      tracking-tight
    ">
      {children}
    </h1>
  )
}

// Pattern 4: Stack responsive
export function ResponsiveStack({ children }) {
  return (
    <div className="
      flex
      flex-col sm:flex-row
      gap-4
      items-start sm:items-center
    ">
      {children}
    </div>
  )
}
```
**Pourquoi:** Utilisable sur tous les appareils  
**Effort:** 2h  
**Status:** [ ] À faire

---

### ✅ Menu burger pour mobile
```tsx
// components/mobile-menu.tsx
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function MobileMenu({ user, onNavigate, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      {/* Bouton burger - Visible uniquement sur mobile */}
      <button
        className="md:hidden p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
      >
        {isOpen ? <X /> : <Menu />}
      </button>
      
      {/* Menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl z-50 md:hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <button onClick={() => setIsOpen(false)}>
                    <X />
                  </button>
                </div>
                
                <nav className="space-y-4">
                  <button
                    className="block w-full text-left py-2 px-4 hover:bg-gray-100 rounded"
                    onClick={() => {
                      onNavigate('dashboard')
                      setIsOpen(false)
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    className="block w-full text-left py-2 px-4 hover:bg-gray-100 rounded"
                    onClick={() => {
                      onNavigate('patients')
                      setIsOpen(false)
                    }}
                  >
                    Patients
                  </button>
                  <button
                    className="block w-full text-left py-2 px-4 hover:bg-gray-100 rounded"
                    onClick={() => {
                      onNavigate('goals')
                      setIsOpen(false)
                    }}
                  >
                    Objectifs
                  </button>
                  
                  <hr className="my-4" />
                  
                  <div className="px-4 py-2">
                    <p className="text-sm text-gray-600">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  
                  <button
                    className="block w-full text-left py-2 px-4 text-red-600 hover:bg-red-50 rounded"
                    onClick={() => {
                      onLogout()
                      setIsOpen(false)
                    }}
                  >
                    Déconnexion
                  </button>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
```
**Pourquoi:** Navigation mobile intuitive  
**Effort:** 1h  
**Status:** [ ] À faire

---

## 📋 Checklist Priorité 2 avec Points de Test

### 🔧 ÉTAPE 1 : Persistance Locale Basique
- [ ] Créer `hooks/use-local-storage.ts`
- [ ] Tester le hook avec une donnée simple
- [ ] Intégrer dans `app/page.tsx` pour sauver le `currentView`

### 🧪 POINT DE TEST #1
```bash
npm run dev
```
**✓ Vérifier :**
- Naviguer vers Dashboard
- Rafraîchir la page (F5)
- Vous devez rester sur Dashboard (pas retour au login)
- Ouvrir DevTools > Application > Local Storage pour voir les données

**🛑 STOP - DEMANDER FEEDBACK UTILISATEUR**
> "La navigation persiste après refresh. localStorage fonctionne ? Continuer ?"

---

### 🔧 ÉTAPE 2 : Système d'authentification fictive
- [ ] Créer `lib/fake-auth.ts`
- [ ] Intégrer le login/logout dans `LoginView`
- [ ] Ajouter un bouton déconnexion dans le header
- [ ] Protéger les vues (redirection si non connecté)

### 🧪 POINT DE TEST #2
```bash
npm run dev
```
**✓ Vérifier :**
- Login avec n'importe quel email/password
- L'utilisateur apparaît dans le header
- Déconnexion ramène au login
- Rafraîchir garde la session
- Essayer d'accéder au dashboard sans login (doit rediriger)

**🛑 STOP - DEMANDER FEEDBACK UTILISATEUR**
> "Auth fictive en place. Flow de connexion OK ? Prêt pour le CRUD ?"

---

### 🔧 ÉTAPE 3 : CRUD Patients avec localStorage
- [ ] Créer `hooks/use-patients.ts` avec CRUD complet
- [ ] Intégrer dans `TherapistDashboard`
- [ ] Ajouter boutons Edit/Delete sur chaque patient
- [ ] Implémenter le formulaire d'ajout de patient
- [ ] Sauvegarder automatiquement dans localStorage

### 🧪 POINT DE TEST #3
```bash
npm run dev
```
**✓ Vérifier :**
- Ajouter un nouveau patient
- Modifier un patient existant
- Supprimer un patient
- Rafraîchir → les changements persistent
- Ouvrir dans un nouvel onglet → mêmes données

**🛑 STOP - DEMANDER FEEDBACK UTILISATEUR**
> "CRUD complet fonctionnel. Les données persistent bien ? Continuer avec les filtres ?"

---

### 🔧 ÉTAPE 4 : Filtres et Export de données
- [ ] Créer `hooks/use-filtered-patients.ts`
- [ ] Améliorer les filtres existants (âge, progression, recherche)
- [ ] Créer `utils/data-export.ts`
- [ ] Ajouter boutons Export JSON et Import
- [ ] Ajouter Export CSV pour Excel

### 🧪 POINT DE TEST #4
```bash
npm run dev
```
**✓ Vérifier :**
- Filtrer par nom → résultats instantanés
- Filtrer par âge → fonctionne
- Combiner plusieurs filtres
- Exporter en JSON → fichier téléchargé
- Supprimer toutes les données
- Importer le JSON → données restaurées
- Export CSV → ouvre dans Excel

**🛑 STOP - DEMANDER FEEDBACK UTILISATEUR**
> "Filtres et export/import OK ? Les données sont sauvegardables ? Prêt pour le mobile ?"

---

### 🔧 ÉTAPE 5 : Responsive et Menu Mobile
- [ ] Créer `components/responsive-patterns.tsx`
- [ ] Créer `components/mobile-menu.tsx`
- [ ] Intégrer le menu burger dans le header
- [ ] Appliquer les patterns responsive aux grilles
- [ ] Tester sur différentes tailles d'écran

### 🧪 POINT DE TEST #5 - TEST FINAL PRIORITÉ 2
```bash
npm run dev
```

**📱 Tester sur mobile (ou Chrome DevTools mobile) :**
- Menu burger visible et fonctionnel
- Tableaux scrollables horizontalement
- Textes lisibles sans zoom
- Boutons assez gros pour le toucher
- Formulaires utilisables

**💻 Tester sur desktop :**
- Menu normal (pas de burger)
- Mise en page optimale
- Toutes les fonctionnalités accessibles

**✓ Test de robustesse :**
- Ajouter 50+ patients (performance ?)
- Export/Import avec beaucoup de données
- Filtrer avec 50+ patients (instantané ?)
- Session persiste après 1h d'inactivité

**🛑 STOP - VALIDATION FINALE PRIORITÉ 2**
> "Maquette interactive complète ! Persistance, CRUD, Export, Mobile OK ? Prêt pour le polish (Priorité 3) ?"

---

## 🎯 Résultat Attendu

Après cette priorité :
- **Données persistantes** : Tout est sauvé dans localStorage
- **CRUD fonctionnel** : Créer, modifier, supprimer des patients
- **Auth simulée** : Login/logout réaliste
- **Filtres puissants** : Recherche et tri avancés
- **Export/Import** : Backup et partage de données
- **100% responsive** : Fonctionne sur mobile et desktop
- **Navigation mobile** : Menu burger intuitif

---

## 💡 Tips d'Implémentation

1. **Tester localStorage** dans une fenêtre incognito pour éviter les conflits
2. **Préfixer les clés** localStorage avec 'ot-' pour éviter les collisions
3. **Gérer les erreurs** de localStorage (quota exceeded, etc.)
4. **Utiliser des hooks custom** pour réutiliser la logique
5. **Tester sur mobile réel** pas juste le responsive du navigateur

---

## 📊 Métriques de Succès

- ✅ Données survivent au F5
- ✅ CRUD sans bugs
- ✅ Export génère un fichier JSON valide
- ✅ Import restaure l'état complet
- ✅ Menu burger fonctionne sur mobile
- ✅ Filtres instantanés < 100ms