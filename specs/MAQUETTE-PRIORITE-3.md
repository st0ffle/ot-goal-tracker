# 🟡 PRIORITÉ 3 - Gestion Actifs/Archivés (1-2 jours)

## 🎯 Objectif Principal
Remplacer le filtre par âge par un système de gestion des patients actifs/archivés pour correspondre aux pratiques réelles des ergothérapeutes.

**Contexte métier :** Les ergos suivent souvent un patient pendant plusieurs années, avec des interruptions (ex: enfant de 8 ans suivi 3 ans, puis retour à 15 ans). Le filtre par âge n'est pas pratique car l'âge change constamment.

---

## 🔄 Fonctionnalité : Patients Actifs vs Archivés

### ✅ 1. Modification de l'interface Patient
```typescript
// Mise à jour de l'interface Patient dans tous les fichiers
// components/views/therapist-dashboard.tsx
// components/views/patient-detail.tsx  
// components/views/create-goal.tsx
interface Patient {
  id: string
  name: string
  age: number
  totalGoals: number
  completedToday: number
  points: number
  status: 'active' | 'archived'  // ← NOUVEAU
  archivedAt?: string           // ← NOUVEAU (date d'archivage)
}
```
**Pourquoi :** Permettre de distinguer les patients en cours de suivi des anciens patients  
**Effort :** 10 min  
**Status :** [ ] À faire

---

### ✅ 2. Mise à jour des mock data
```typescript
// lib/mock-data.ts - Ajout de patients avec statuts
export const mockPatients = [
  // Patients actifs (comme actuellement)
  { id: "1", name: "Emma Johnson", age: 8, totalGoals: 4, completedToday: 3, points: 245, status: 'active' },
  { id: "2", name: "Michael Chen", age: 12, totalGoals: 5, completedToday: 4, points: 180, status: 'active' },
  { id: "3", name: "Sarah Williams", age: 16, totalGoals: 3, completedToday: 2, points: 320, status: 'active' },
  { id: "4", name: "Alex Rodriguez", age: 10, totalGoals: 6, completedToday: 5, points: 410, status: 'active' },
  { id: "5", name: "Lily Thompson", age: 7, totalGoals: 3, completedToday: 1, points: 125, status: 'active' },
  { id: "6", name: "David Kim", age: 14, totalGoals: 4, completedToday: 4, points: 380, status: 'active' },
  { id: "7", name: "Sophie Martin", age: 9, totalGoals: 5, completedToday: 3, points: 290, status: 'active' },
  
  // Patients archivés (nouveaux)
  { id: "11", name: "Antoine Lefebvre", age: 18, totalGoals: 0, completedToday: 0, points: 650, status: 'archived', archivedAt: '2023-06-15T10:00:00Z' },
  { id: "12", name: "Camille Dubois", age: 16, totalGoals: 0, completedToday: 0, points: 480, status: 'archived', archivedAt: '2023-09-20T14:30:00Z' },
  { id: "13", name: "Hugo Moreau", age: 20, totalGoals: 0, completedToday: 0, points: 720, status: 'archived', archivedAt: '2022-12-10T09:15:00Z' },
]
```
**Pourquoi :** Données de test avec mix actifs/archivés réaliste  
**Effort :** 5 min  
**Status :** [ ] À faire

---

### ✅ 3. Interface Toggle dans le Dashboard
```tsx
// components/views/therapist-dashboard.tsx - Modification du state et filtre
export function TherapistDashboard({ patients, onNavigate }: TherapistDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  // ❌ SUPPRIMER const [ageFilter, setAgeFilter] = useState("")
  const [progressFilter, setProgressFilter] = useState("")
  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active') // ← NOUVEAU

  // Séparer les patients par statut
  const activePatients = patients.filter(p => p.status === 'active')
  const archivedPatients = patients.filter(p => p.status === 'archived')
  
  const currentPatients = viewMode === 'active' ? activePatients : archivedPatients
  
  const getFilteredPatients = () => {
    return currentPatients.filter(patient => {
      if (!patient || !patient.name) return false
      
      const matchesSearch = !searchTerm || patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      // ❌ SUPPRIMER le filtre par âge (lignes 92-97)
      
      // Garder seulement le filtre par progression
      let matchesProgress = true
      if (progressFilter) {
        const completionRate = (patient.completedToday / patient.totalGoals) * 100 || 0
        if (progressFilter === "high") matchesProgress = completionRate >= 80
        if (progressFilter === "medium") matchesProgress = completionRate >= 50 && completionRate < 80
        if (progressFilter === "low") matchesProgress = completionRate < 50
      }
      
      return matchesSearch && matchesProgress
    })
  }

  const handleArchivePatient = (patientId: string) => {
    // Logique d'archivage simple
    const updatedPatients = patients.map(p => 
      p.id === patientId 
        ? { ...p, status: 'archived' as const, archivedAt: new Date().toISOString() }
        : p
    )
    // Pour l'instant, juste un console.log. En vrai, sauvegarder les données.
    console.log('Patient archivé:', patientId, updatedPatients)
  }

  const handleReactivatePatient = (patientId: string) => {
    // Logique de réactivation simple
    const updatedPatients = patients.map(p => 
      p.id === patientId 
        ? { ...p, status: 'active' as const, archivedAt: undefined }
        : p
    )
    // Pour l'instant, juste un console.log. En vrai, sauvegarder les données.
    console.log('Patient réactivé:', patientId, updatedPatients)
  }

  // ... le reste reste identique jusqu'à la partie JSX
```
**Pourquoi :** État et logique pour gérer les deux modes  
**Effort :** 15 min  
**Status :** [ ] À faire

---

### ✅ 4. Bouton Toggle dans le Header du Dashboard
```tsx
// Dans le JSX du dashboard, avant les Stats Cards
<div className="mb-8">
  <div className="flex items-center justify-between">
    <div>
      <ResponsiveHeading>Tableau de bord des patients</ResponsiveHeading>
      <p className="text-gray-600">Suivez les progrès et gérez les objectifs de vos patients</p>
    </div>
    
    {/* NOUVEAU: Toggle Actifs/Archivés */}
    <div className="flex items-center">
      <Button
        variant={viewMode === 'active' ? 'secondary' : 'outline'}
        onClick={() => setViewMode(viewMode === 'active' ? 'archived' : 'active')}
        className="flex items-center space-x-2"
      >
        {viewMode === 'active' ? (
          <>
            <Archive className="w-4 h-4" />
            <span className="hidden sm:inline">Archivés ({archivedPatients.length})</span>
            <span className="sm:hidden">Arch. ({archivedPatients.length})</span>
          </>
        ) : (
          <>
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Actifs ({activePatients.length})</span>
            <span className="sm:hidden">Act. ({activePatients.length})</span>
          </>
        )}
      </Button>
    </div>
  </div>
</div>
```
**Pourquoi :** Navigation claire entre les deux modes  
**Effort :** 10 min  
**Status :** [ ] À faire

---

### ✅ 5. Mise à jour des filtres (Supprimer âge)
```tsx
// Dans la section Search and Filter - SUPPRIMER le filtre âge (lignes 240-249)
<div className="mb-6">
  <div className="flex flex-col sm:flex-row gap-4">
    <div className="flex-1">
      <Input 
        placeholder={`Rechercher des patients ${viewMode === 'active' ? 'actifs' : 'archivés'} par nom...`}
        className="w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    <div className="flex gap-2">
      {/* ❌ SUPPRIMER le select âge complètement */}
      <select 
        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={progressFilter}
        onChange={(e) => setProgressFilter(e.target.value)}
      >
        <option value="">Tous les progrès</option>
        <option value="high">Élevé (80%+)</option>
        <option value="medium">Moyen (50-79%)</option>
        <option value="low">Faible (&lt;50%)</option>
      </select>
    </div>
  </div>
</div>
```
**Pourquoi :** Plus de filtre âge, interface plus simple  
**Effort :** 5 min  
**Status :** [ ] À faire

---

### ✅ 6. Boutons Archiver/Réactiver sur les cartes patients
```tsx
// Dans le tableau desktop (ligne 315+), remplacer les actions:
<td className="p-4">
  <div className="flex space-x-2">
    <Button 
      variant="outline" 
      size="sm"
      onClick={() => onNavigate("patient-detail", patient.id)}
    >
      Voir
    </Button>
    <Button 
      size="sm" 
      className="bg-green-600 hover:bg-green-700"
      onClick={() => onNavigate("create-goal")}
    >
      Ajouter Objectif
    </Button>
    {/* NOUVEAU: Bouton Archiver/Réactiver */}
    {viewMode === 'active' ? (
      <Button 
        variant="outline" 
        size="sm"
        className="text-orange-600 border-orange-600 hover:bg-orange-50"
        onClick={() => handleArchivePatient(patient.id)}
      >
        Archiver
      </Button>
    ) : (
      <Button 
        variant="outline" 
        size="sm"
        className="text-green-600 border-green-600 hover:bg-green-50"
        onClick={() => handleReactivatePatient(patient.id)}
      >
        Réactiver
      </Button>
    )}
  </div>
</td>

// Mise à jour de PatientCard pour mobile (ligne 57+):
function PatientCard({ patient, onNavigate, onArchive, onReactivate, viewMode }: PatientCardProps) {
  // ... contenu existant identique jusqu'aux boutons...
  
  <div className="flex items-center justify-between">
    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
      {patient.points} pts
    </Badge>
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onNavigate("patient-detail", patient.id)}
      >
        Voir
      </Button>
      <Button 
        size="sm" 
        className="bg-green-600 hover:bg-green-700"
        onClick={() => onNavigate("create-goal")}
      >
        <Plus className="w-4 h-4" />
      </Button>
      {/* NOUVEAU: Bouton Archiver/Réactiver mobile */}
      {viewMode === 'active' ? (
        <Button 
          variant="outline" 
          size="sm"
          className="text-orange-600 border-orange-600"
          onClick={() => onArchive(patient.id)}
        >
          <Archive className="w-4 h-4" />
        </Button>
      ) : (
        <Button 
          variant="outline" 
          size="sm"
          className="text-green-600 border-green-600"
          onClick={() => onReactivate(patient.id)}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      )}
    </div>
  </div>
}
```
**Pourquoi :** Action directe sur chaque patient, pas de confirmation nécessaire  
**Effort :** 20 min  
**Status :** [ ] À faire

---

### ✅ 7. Imports des nouvelles icônes
```tsx
// En haut de therapist-dashboard.tsx, ajouter aux imports existants:
import { Plus, Users, Target, Award, User, Settings, Archive, RotateCcw } from 'lucide-react'
```
**Pourquoi :** Icônes pour archiver et réactiver  
**Effort :** 1 min  
**Status :** [ ] À faire

---

### ✅ 8. Notification toast (optionnel - système déjà disponible)
```tsx
// Si on veut ajouter des notifications (le projet a déjà sonner installé):
import { toast } from "sonner"

const handleArchivePatient = (patientId: string) => {
  // ... logique d'archivage ...
  
  // Notification optionnelle (simple)
  toast.success("Patient archivé")
}

const handleReactivatePatient = (patientId: string) => {
  // ... logique de réactivation ...
  
  // Notification optionnelle (simple)
  toast.success("Patient réactivé")
}

// Et dans le JSX principal, ajouter le Toaster (si pas déjà fait):
// import { Toaster } from "sonner"
// <Toaster />
```
**Pourquoi :** Feedback utilisateur simple (optionnel car système toast déjà installé)  
**Effort :** 5 min  
**Status :** [ ] Optionnel

---

## 📋 Checklist Priorité 3 - Version Actifs/Archivés

### 🔧 ÉTAPE 1 : Préparation des données et types
- [ ] Ajouter `status` et `archivedAt` à l'interface Patient (3 fichiers)
- [ ] Mettre à jour `lib/mock-data.ts` avec patients archivés
- [ ] Ajouter les imports d'icônes `Archive` et `RotateCcw`

### 🧪 POINT DE TEST #1
```bash
npm run dev
```
**✓ Vérifier :**
- Pas d'erreurs TypeScript au démarrage
- Page se charge normalement
- Mock data contient des patients avec `status`

**🛑 STOP - DEMANDER FEEDBACK UTILISATEUR**
> "Types et données de base OK ? Pas d'erreurs au démarrage ?"

---

### 🔧 ÉTAPE 2 : Supprimer le filtre âge et ajouter le toggle
- [ ] Supprimer `const [ageFilter, setAgeFilter] = useState("")` (ligne 83)
- [ ] Supprimer la logique de filtre âge dans `getFilteredPatients` (lignes 92-97)
- [ ] Supprimer le select âge dans l'interface (lignes 240-249)
- [ ] Ajouter l'état `viewMode` et la logique de séparation des patients
- [ ] Ajouter le bouton toggle dans le header

### 🧪 POINT DE TEST #2
```bash
npm run dev
```
**✓ Vérifier :**
- Plus de filtre âge visible
- Bouton "Archivés (X)" visible en haut à droite
- Clic sur le bouton → change vers "Actifs (X)"
- Liste de patients change selon le mode
- Placeholder de recherche s'adapte

**🛑 STOP - DEMANDER FEEDBACK UTILISATEUR**
> "Navigation entre actifs et archivés fonctionne ? Interface claire ?"

---

### 🔧 ÉTAPE 3 : Ajouter les boutons d'action
- [ ] Ajouter les fonctions `handleArchivePatient` et `handleReactivatePatient`
- [ ] Modifier les actions du tableau desktop
- [ ] Modifier la fonction `PatientCard` pour mobile
- [ ] Passer les props nécessaires aux composants

### 🧪 POINT DE TEST #3
```bash
npm run dev
```
**✓ Vérifier :**
- Bouton "Archiver" sur patients actifs (orange)
- Bouton "Réactiver" sur patients archivés (vert)
- Clic → patient change de liste (vérifier console.log)
- Compteurs se mettent à jour
- Version mobile fonctionne (icônes)

**🛑 STOP - DEMANDER FEEDBACK UTILISATEUR**
> "Actions d'archivage/réactivation fonctionnelles ? UX claire sur mobile et desktop ?"

---

### 🔧 ÉTAPE 4 : Finition et test complet
- [ ] Tester la recherche dans chaque mode
- [ ] Tester le filtre par progression dans les deux modes
- [ ] Vérifier la responsivité (mobile/desktop)
- [ ] Ajouter les notifications toast (optionnel)
- [ ] Nettoyer le code (supprimer les console.log en prod)

### 🧪 POINT DE TEST #4 - TEST FINAL COMPLET
```bash
npm run dev
```

**🎯 Scénario de test complet (3 min) :**
1. Dashboard s'ouvre sur les patients actifs ✓
2. Rechercher "Emma" → la trouve dans les actifs ✓
3. Cliquer "Archivés (3)" → voir les patients archivés ✓
4. Rechercher "Antoine" → le trouve dans les archivés ✓
5. Cliquer "Réactiver" sur Antoine → (voir console.log) ✓
6. Retour aux "Actifs" → (Antoine serait présent en vrai) ✓
7. Archiver un patient actif → (voir console.log) ✓
8. Filtrer par progression dans chaque mode ✓
9. Test mobile : toggle et boutons fonctionnels ✓
10. Pas d'erreurs console ✓

**🛑 STOP - VALIDATION FINALE DU PROJET**
> "🎉 Fonctionnalité Actifs/Archivés terminée ! Plus pratique que le filtre par âge pour les ergothérapeutes ?"

---

## 🎯 Résultat Attendu

Après cette priorité :
- **Filtre par âge supprimé** ❌ (plus pertinent métier)
- **Toggle Actifs/Archivés** ✅ (navigation claire un seul bouton)
- **Actions Archiver/Réactiver** ✅ (workflows ergothérapeute réels)
- **Recherche contextuelle** ✅ (dans le mode courant uniquement)
- **Interface responsive** ✅ (mobile + desktop)
- **Mock data adaptées** ✅ (patients archivés exemples)

---

## 💡 Tips d'Implémentation

1. **Suppression propre :** Bien supprimer toutes les références au filtre âge (état, logique, UI)
2. **Toggle simple :** Un seul bouton qui alterne, pas deux boutons séparés
3. **Couleurs cohérentes :** Orange pour archiver, vert pour réactiver
4. **Mobile-first :** Tester les boutons sur petits écrans (assez grands)
5. **Console.log :** Pour le moment, juste logger les actions (pas de vraie persistance)

---

## 🔄 Extensions Possibles (hors scope P3)

- **Persistance :** Sauvegarder dans localStorage ou base de données
- **Historique :** Date d'archivage visible sur les cartes
- **Bulk actions :** Archiver plusieurs patients d'un coup  
- **Filtres avancés :** Par date d'archivage, durée de suivi, etc.
- **Animation :** Transition smooth entre les listes

---

## 📊 Métriques de Succès

- ✅ Zéro référence au filtre par âge dans le code
- ✅ Toggle fonctionne sans lag sur mobile et desktop  
- ✅ Actions instantanées (pas de délai perceptible)
- ✅ Recherche fonctionne dans chaque mode séparément
- ✅ Interface intuitive pour les ergothérapeutes
- ✅ Code propre et maintenable