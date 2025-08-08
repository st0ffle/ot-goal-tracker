# 🟢 PRIORITÉ 5 - Progrès Hebdomadaire Heatmap (1 jour)

## 🎯 Objectif Principal
Remplacer la vue "Progrès Hebdomadaire" actuelle (liste statique) par une heatmap interactive avec timeline détaillée, permettant de visualiser les patterns de complétion et motiver le patient.

**Contexte métier :** Les ergothérapeutes ont besoin de voir rapidement les jours productifs vs difficiles pour adapter le plan thérapeutique. Les patients sont motivés par la visualisation de leurs progrès.

---

## 🎨 Mockup Visuel

```
┌─────────────────────────────────────────────┐
│ 📅 Progrès Hebdomadaire                    │
│                                             │
│ ← Semaine du 15-21 janvier 2024 →          │
│                                             │
│ [Lun] [Mar] [Mer] [Jeu] [Ven] [Sam] [Dim]  │
│  🟩    🟨    🟩    🟩    🟥    🟨    🟧   │
│  4/5   2/4   5/5   3/3   0/2   1/3   2/5   │
│  80%   50%  100%  100%   0%   33%   40%    │
│                                             │
│ 📊 Stats de la semaine:                    │
│ • Points totaux: 165 pts                   │
│ • Moyenne: 57% de complétion               │
│ • Meilleur jour: Mercredi (100%)           │
│                                             │
│ [Cliquez sur un jour pour voir le détail]  │
└─────────────────────────────────────────────┘
```

---

## 📦 Structure de Données

### ✅ 1. Nouvelles interfaces dans goal-helpers.ts
```typescript
// utils/goal-helpers.ts - AJOUTER

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
  
  // Générer 7 jours de données mock
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + i)
    
    // Mock data réaliste
    const completed = Math.floor(Math.random() * 5) + 1
    const total = completed + Math.floor(Math.random() * 3)
    const points = completed * 10
    
    days.push({
      date: date.toISOString().split('T')[0],
      dayName: dayNames[i],
      completedGoals: [], // Pour la maquette, vide
      totalGoals: total,
      pointsEarned: points,
      pointsPossible: total * 10,
      completionRate: Math.round((completed / total) * 100)
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
    weekStart: weekStart.toISOString().split('T')[0],
    weekEnd: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
```

---

## 🔧 Implémentation dans patient-detail.tsx

### ✅ 2. Importer les nouvelles fonctions
```typescript
// components/views/patient-detail.tsx - En haut du fichier
import { 
  groupGoalsByPrimary, 
  getStandalonePrimaryGoals,
  calculateWeekProgress,
  getCompletionColor,
  getCompletionEmoji
} from '@/utils/goal-helpers'
```

### ✅ 3. Ajouter le state pour la semaine et le jour sélectionné
```typescript
// Dans la fonction PatientDetail, après les autres states
const [selectedWeek, setSelectedWeek] = useState(new Date())
const [selectedDay, setSelectedDay] = useState<DayProgress | null>(null)

// Calculer le progrès de la semaine
const weekProgress = calculateWeekProgress(patientGoals, selectedWeek)

// Fonction pour naviguer entre semaines
const changeWeek = (direction: 'prev' | 'next') => {
  const newWeek = new Date(selectedWeek)
  newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7))
  setSelectedWeek(newWeek)
  setSelectedDay(null)
}
```

### ✅ 4. Remplacer la section Weekly Progress Chart
```tsx
{/* Weekly Progress - Nouvelle version Heatmap */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center justify-between">
      <div className="flex items-center">
        <Calendar className="w-5 h-5 mr-2" />
        Progrès Hebdomadaire
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => changeWeek('prev')}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm text-gray-600 min-w-[140px] text-center">
          {new Date(weekProgress.weekStart).toLocaleDateString('fr-FR', { 
            day: 'numeric',
            month: 'short'
          })} - {new Date(weekProgress.weekEnd).toLocaleDateString('fr-FR', { 
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => changeWeek('next')}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Heatmap des jours */}
    <div className="grid grid-cols-7 gap-2 mb-6">
      {weekProgress.days.map((day) => (
        <button
          key={day.date}
          onClick={() => setSelectedDay(day)}
          className={`
            p-3 rounded-lg border-2 transition-all
            ${selectedDay?.date === day.date ? 'border-blue-500 shadow-lg' : 'border-transparent'}
            hover:shadow-md hover:scale-105
          `}
        >
          <div className="text-xs font-medium text-gray-600 mb-1">
            {day.dayName.slice(0, 3)}
          </div>
          <div className={`
            w-12 h-12 mx-auto rounded-lg flex items-center justify-center text-2xl
            ${getCompletionColor(day.completionRate)}
          `}>
            {getCompletionEmoji(day.completionRate)}
          </div>
          <div className="mt-2 text-center">
            <div className="text-xs font-semibold">
              {day.completedGoals.length}/{day.totalGoals}
            </div>
            <div className="text-xs text-gray-500">
              {day.completionRate}%
            </div>
          </div>
        </button>
      ))}
    </div>

    {/* Stats de la semaine */}
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600">
            {weekProgress.totalPoints}
          </div>
          <div className="text-xs text-gray-600">Points totaux</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">
            {weekProgress.averageCompletion}%
          </div>
          <div className="text-xs text-gray-600">Moyenne</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">
            {weekProgress.bestDay?.dayName.slice(0, 3) || '-'}
          </div>
          <div className="text-xs text-gray-600">Meilleur jour</div>
        </div>
      </div>
    </div>

    {/* Détail du jour sélectionné */}
    {selectedDay && (
      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">
          {selectedDay.dayName} {new Date(selectedDay.date).toLocaleDateString('fr-FR')}
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Objectifs complétés:</span>
            <span className="font-medium">{selectedDay.completedGoals.length}/{selectedDay.totalGoals}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Points gagnés:</span>
            <span className="font-medium">{selectedDay.pointsEarned} pts</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Taux de complétion:</span>
            <span className="font-medium">{selectedDay.completionRate}%</span>
          </div>
        </div>
        
        {/* Liste des objectifs du jour (à implémenter plus tard) */}
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-gray-500 italic">
            Détail des objectifs à venir dans la prochaine version
          </p>
        </div>
      </div>
    )}

    {/* Message si pas de jour sélectionné */}
    {!selectedDay && (
      <div className="text-center text-sm text-gray-500 italic">
        Cliquez sur un jour pour voir le détail
      </div>
    )}
  </CardContent>
</Card>
```

### ✅ 5. Ajouter l'import ChevronLeft
```typescript
// En haut avec les autres imports lucide-react
import { Plus, Award, Target, CheckCircle, Calendar, Settings, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react'
```

---

## 📋 Checklist d'implémentation

### 🔧 ÉTAPE 1 : Préparation des données
- [ ] Ajouter les interfaces dans goal-helpers.ts
- [ ] Créer les fonctions de calcul (calculateWeekProgress, etc.)
- [ ] Ajouter les fonctions de couleur et emoji

### 🧪 POINT DE TEST #1
```bash
npm run dev
```
**✓ Vérifier :**
- Pas d'erreurs TypeScript
- Application démarre

---

### 🔧 ÉTAPE 2 : Mise à jour du composant
- [ ] Ajouter les imports nécessaires
- [ ] Ajouter les states (selectedWeek, selectedDay)
- [ ] Ajouter la fonction changeWeek
- [ ] Remplacer l'ancienne section Weekly Progress

### 🧪 POINT DE TEST #2
```bash
npm run dev
```
**✓ Vérifier :**
- Heatmap visible avec 7 jours
- Couleurs différentes selon complétion
- Navigation entre semaines fonctionne
- Clic sur un jour affiche le détail

---

### 🔧 ÉTAPE 3 : Finition et polish
- [ ] Ajuster les couleurs si nécessaire
- [ ] Vérifier le responsive mobile
- [ ] Ajouter des animations hover
- [ ] Tester avec différentes données

### 🧪 TEST FINAL
**Scénario complet :**
1. Voir la heatmap avec couleurs ✓
2. Naviguer semaine précédente/suivante ✓
3. Cliquer sur un jour → voir détails ✓
4. Stats de la semaine correctes ✓
5. Mobile responsive ✓

---

## 🚀 Améliorations futures (hors scope)

1. **Timeline détaillée** : Liste des objectifs avec heures
2. **Comparaison** : "vs semaine dernière" avec flèches
3. **Export** : Télécharger rapport PDF de la semaine
4. **Filtres** : Par type d'objectif ou par points
5. **Graphique** : Courbe de progression en plus
6. **Streaks** : Compteur de jours consécutifs
7. **Prédictions** : IA suggère meilleurs jours

---

## 💡 Tips d'implémentation

1. **Données mock** : Pour la maquette, générer des données aléatoires réalistes
2. **Couleurs** : Utiliser Tailwind classes pour cohérence
3. **Mobile** : Grid 7 colonnes peut être serré, considérer scroll horizontal
4. **Performance** : Mémoriser les calculs avec useMemo si nécessaire
5. **Accessibilité** : Ajouter aria-labels sur les boutons de jours

---

## 🎯 Résultat attendu

- ✅ Heatmap colorée de 7 jours
- ✅ Navigation entre semaines
- ✅ Stats résumées (points, moyenne, meilleur jour)
- ✅ Détail au clic sur un jour
- ✅ Responsive et moderne
- ✅ Motivant pour le patient

---

## 📊 Métriques de succès

- Vue claire des patterns hebdomadaires
- Navigation intuitive
- Chargement instantané
- Fonctionne sur mobile
- Patient motivé par la visualisation