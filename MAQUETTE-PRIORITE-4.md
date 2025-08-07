# 🔴 PRIORITÉ 4 - Objectifs Principaux et Secondaires (2 jours)

## 🎯 Objectif Principal
Remplacer les catégories d'objectifs par un système hiérarchique d'objectifs principaux et secondaires, permettant une meilleure organisation et suivi des progrès thérapeutiques.

**Contexte métier :** Les ergothérapeutes travaillent souvent sur des objectifs complexes qui se décomposent en sous-objectifs. Un objectif principal comme "Améliorer l'autonomie pour l'habillage" peut avoir plusieurs étapes secondaires.

---

## 📊 Nouvelle Structure des Données

### ✅ 1. Modification de l'interface Goal
```typescript
// Nouvelle structure pour les objectifs
interface Goal {
  id: string
  text: string
  type: 'primary' | 'secondary'  // NOUVEAU
  parentId?: string              // NOUVEAU - ID du parent si secondaire
  patientId: string              // NOUVEAU - Lien explicite au patient
  points: number                 // Pour secondaires seulement
  completed: boolean
  createdAt: string
  completedAt?: string
}

// Interface calculée pour l'affichage
interface PrimaryGoalWithSecondaries {
  primary: Goal
  secondaries: Goal[]
  totalPoints: number           // Somme des points des secondaires
  completedCount: number        // Nombre de secondaires complétés
  progress: number              // Pourcentage de progression
}
```

---

## 🗑️ Suppressions à effectuer

### ❌ Supprimer toutes les références aux catégories
1. **create-goal.tsx** : Supprimer toute la section "Catégorie d'Objectif" (lignes 94-110)
2. **Partout ailleurs** : Chercher et supprimer toute référence à "category" ou "catégorie"

---

## 🔧 Modifications du formulaire de création

### ✅ 2. Nouveau formulaire create-goal.tsx
```tsx
export function CreateGoal({ patients, goals, onNavigate }: CreateGoalProps) {
  const [goalType, setGoalType] = useState<'primary' | 'secondary'>('primary')
  const [selectedParentId, setSelectedParentId] = useState<string>('')
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  
  // Filtrer les objectifs principaux du patient sélectionné
  const availableParentGoals = goals
    .filter(g => g.patientId === selectedPatientId && g.type === 'primary')
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un Objectif</CardTitle>
        <CardDescription>
          Créez un objectif principal ou secondaire pour votre patient
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sélection du patient */}
        <div className="space-y-2">
          <Label>Patient</Label>
          <select 
            value={selectedPatientId}
            onChange={(e) => {
              setSelectedPatientId(e.target.value)
              setSelectedParentId('') // Reset parent si on change de patient
            }}
            className="w-full p-3 border rounded-md"
          >
            <option value="">Sélectionnez un patient...</option>
            {patients.filter(p => p.status === 'active').map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name} ({patient.age} ans)
              </option>
            ))}
          </select>
        </div>

        {/* Type d'objectif */}
        <div className="space-y-2">
          <Label>Type d'objectif</Label>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={goalType === 'primary' ? 'default' : 'outline'}
              onClick={() => setGoalType('primary')}
              className="flex-1"
            >
              <Target className="w-4 h-4 mr-2" />
              Principal
            </Button>
            <Button
              type="button"
              variant={goalType === 'secondary' ? 'default' : 'outline'}
              onClick={() => setGoalType('secondary')}
              className="flex-1"
            >
              <ListChecks className="w-4 h-4 mr-2" />
              Secondaire
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            {goalType === 'primary' 
              ? "Un objectif principal peut contenir plusieurs objectifs secondaires"
              : "Un objectif secondaire est une étape d'un objectif principal"}
          </p>
        </div>

        {/* Si secondaire, sélectionner le parent */}
        {goalType === 'secondary' && selectedPatientId && (
          <div className="space-y-2">
            <Label>Objectif principal associé</Label>
            <select 
              value={selectedParentId}
              onChange={(e) => setSelectedParentId(e.target.value)}
              className="w-full p-3 border rounded-md"
              required
            >
              <option value="">Sélectionnez l'objectif principal...</option>
              {availableParentGoals.map(goal => (
                <option key={goal.id} value={goal.id}>
                  {goal.text}
                </option>
              ))}
            </select>
            {availableParentGoals.length === 0 && (
              <p className="text-sm text-orange-600">
                ⚠️ Aucun objectif principal pour ce patient. Créez-en un d'abord.
              </p>
            )}
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <Label>Description de l'objectif</Label>
          <textarea
            placeholder={
              goalType === 'primary'
                ? "Ex: Améliorer l'autonomie pour l'habillage"
                : "Ex: Boutonner sa chemise de façon autonome"
            }
            className="w-full p-3 border rounded-md min-h-[100px]"
          />
        </div>

        {/* Points - Seulement pour les secondaires */}
        {goalType === 'secondary' && (
          <div className="space-y-2">
            <Label>Points</Label>
            <Input 
              type="number" 
              placeholder="10" 
              min="1" 
              max="50"
              className="w-full"
            />
            <p className="text-sm text-gray-600">
              Les points de l'objectif principal seront la somme de ses objectifs secondaires
            </p>
          </div>
        )}

        {/* Note informative pour principal */}
        {goalType === 'primary' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              ℹ️ Les objectifs principaux n'ont pas de points directs. 
              Leurs points seront calculés automatiquement en fonction des objectifs secondaires ajoutés.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-4 pt-6">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onNavigate("therapist-dashboard")}
          >
            Annuler
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              // Logique de création
              console.log('Créer objectif:', { goalType, selectedParentId, selectedPatientId })
              onNavigate("therapist-dashboard")
            }}
          >
            Créer l'objectif
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## 🎨 Options d'affichage dans patient-detail.tsx

### Option A : Hiérarchie avec indentation
```tsx
// Style accordéon/arbre avec indentation visuelle
<div className="space-y-4">
  {primaryGoalsWithSecondaries.map(({ primary, secondaries, totalPoints, completedCount }) => (
    <div key={primary.id} className="border rounded-lg overflow-hidden">
      {/* Objectif principal */}
      <div className={`p-4 ${primary.completed ? 'bg-green-50' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-blue-600" />
            <div>
              <p className={`font-medium ${primary.completed ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                {primary.text}
              </p>
              <div className="flex items-center mt-1 space-x-4">
                <span className="text-sm text-gray-600">
                  {completedCount}/{secondaries.length} complétés
                </span>
                <Progress value={(completedCount / secondaries.length) * 100} className="w-24 h-2" />
                <Badge variant="secondary">{totalPoints} pts</Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Objectifs secondaires */}
      {secondaries.length > 0 && (
        <div className="border-t">
          {secondaries.map(secondary => (
            <div key={secondary.id} className="pl-12 pr-4 py-3 border-b last:border-b-0 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    secondary.completed ? 'bg-green-500 text-white' : 'border-2 border-gray-300'
                  }`}>
                    {secondary.completed && <CheckCircle className="w-3 h-3" />}
                  </div>
                  <span className={secondary.completed ? 'line-through text-gray-500' : ''}>
                    {secondary.text}
                  </span>
                </div>
                <Badge variant="outline">{secondary.points} pts</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ))}
  
  {/* Objectifs simples (sans secondaires) */}
  {simpleGoals.map(goal => (
    <div key={goal.id} className="p-4 rounded-lg border bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            goal.completed ? 'bg-green-500 text-white' : 'border-2 border-gray-300'
          }`}>
            {goal.completed && <CheckCircle className="w-4 h-4" />}
          </div>
          <span className={goal.completed ? 'line-through text-gray-500' : ''}>
            {goal.text}
          </span>
        </div>
        <Badge>{goal.points || 0} pts</Badge>
      </div>
    </div>
  ))}
</div>
```

### Option B : Cards groupées
```tsx
// Style cards avec séparation visuelle claire
<div className="space-y-6">
  {primaryGoalsWithSecondaries.map(({ primary, secondaries, totalPoints, completedCount }) => (
    <Card key={primary.id}>
      <CardHeader className={primary.completed ? 'bg-green-50' : ''}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              {primary.text}
            </CardTitle>
            <div className="flex items-center mt-2 space-x-4">
              <Progress value={(completedCount / secondaries.length) * 100} className="flex-1 h-2" />
              <span className="text-sm font-medium">{completedCount}/{secondaries.length}</span>
              <Badge className="bg-blue-100 text-blue-800">{totalPoints} pts total</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      {secondaries.length > 0 && (
        <CardContent className="pt-4">
          <div className="space-y-2">
            {secondaries.map(secondary => (
              <div key={secondary.id} className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100">
                <Checkbox 
                  checked={secondary.completed}
                  className="mr-3"
                />
                <span className={`flex-1 ${secondary.completed ? 'line-through text-gray-500' : ''}`}>
                  {secondary.text}
                </span>
                <Badge variant="secondary">{secondary.points} pts</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  ))}
</div>
```

### Option C : Liste plate avec indicateurs visuels
```tsx
// Style liste simple avec barres latérales colorées
<div className="space-y-3">
  {allGoalsFlat.map(goal => (
    <div key={goal.id} className="flex">
      {/* Barre latérale indicatrice */}
      <div className={`w-1 ${goal.type === 'primary' ? 'bg-blue-500' : 'bg-gray-300'} mr-3`} />
      
      <div className={`flex-1 p-4 rounded-lg border ${goal.completed ? 'bg-green-50' : 'bg-white'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {goal.type === 'primary' ? (
              <Target className="w-5 h-5 text-blue-600" />
            ) : (
              <div className={`ml-4 w-5 h-5 rounded-full ${
                goal.completed ? 'bg-green-500' : 'border-2 border-gray-300'
              }`} />
            )}
            <div>
              <p className={`${goal.type === 'primary' ? 'font-semibold' : ''} ${
                goal.completed ? 'line-through text-gray-500' : ''
              }`}>
                {goal.text}
              </p>
              {goal.type === 'primary' && (
                <p className="text-sm text-gray-600 mt-1">
                  {goal.secondariesCompleted}/{goal.secondariesTotal} objectifs complétés
                </p>
              )}
            </div>
          </div>
          <Badge variant={goal.type === 'primary' ? 'default' : 'secondary'}>
            {goal.points} pts
          </Badge>
        </div>
      </div>
    </div>
  ))}
</div>
```

---

## 📋 Mock Data mise à jour

### ✅ 3. Nouveau mock-data.ts
```typescript
export const mockGoals: Goal[] = [
  // Objectifs principaux
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
    createdAt: "2024-01-15T10:00:00Z"
  },
  { 
    id: "s5", 
    text: "Tracer des lignes droites", 
    type: "secondary",
    parentId: "p2",
    patientId: "1",
    points: 10,
    completed: true,
    createdAt: "2024-01-15T10:00:00Z"
  },
  
  // Objectif principal sans secondaires (pour l'instant)
  { 
    id: "p3", 
    text: "Améliorer l'équilibre et la coordination", 
    type: "primary",
    patientId: "2",
    points: 0,
    completed: false,
    createdAt: "2024-01-16T10:00:00Z"
  }
]
```

---

## 🔄 Logique de calcul et mise à jour

### ✅ 4. Fonctions utilitaires
```typescript
// utils/goal-helpers.ts

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

export function toggleSecondaryGoal(goalId: string, goals: Goal[]): Goal[] {
  return goals.map(goal => {
    if (goal.id === goalId) {
      // Toggle le secondaire
      return {
        ...goal,
        completed: !goal.completed,
        completedAt: !goal.completed ? new Date().toISOString() : undefined
      }
    }
    
    // Si c'est un principal, vérifier si tous ses secondaires sont complétés
    if (goal.type === 'primary') {
      const secondaries = goals.filter(g => g.parentId === goal.id)
      if (secondaries.length > 0) {
        const allCompleted = secondaries.every(s => 
          s.id === goalId ? !s.completed : s.completed
        )
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
```

---

## 📋 Checklist d'implémentation

### 🔧 ÉTAPE 1 : Nettoyage et préparation
- [ ] Supprimer toutes les références aux catégories dans create-goal.tsx
- [ ] Chercher et supprimer "category" dans tout le projet
- [ ] Créer utils/goal-helpers.ts avec les fonctions utilitaires
- [ ] Mettre à jour les interfaces Goal dans tous les fichiers

### 🧪 POINT DE TEST #1
```bash
npm run dev
```
**✓ Vérifier :**
- Pas d'erreurs TypeScript
- Plus aucune mention de catégorie visible
- Application démarre correctement

---

### 🔧 ÉTAPE 2 : Nouveau formulaire de création
- [ ] Refactorer create-goal.tsx avec le nouveau formulaire
- [ ] Ajouter les états goalType et selectedParentId
- [ ] Implémenter la logique de sélection principal/secondaire
- [ ] Conditionner l'affichage des points selon le type

### 🧪 POINT DE TEST #2
```bash
npm run dev
```
**✓ Vérifier :**
- Toggle Principal/Secondaire fonctionne
- Sélection du parent apparaît pour les secondaires
- Points seulement pour les secondaires
- Message informatif pour les principaux

---

### 🔧 ÉTAPE 3 : Mock data et affichage
- [ ] Mettre à jour mock-data.ts avec la nouvelle structure
- [ ] Choisir et implémenter une option d'affichage (A, B ou C)
- [ ] Tester avec des objectifs principaux avec/sans secondaires
- [ ] Implémenter le calcul automatique des points et progression

### 🧪 POINT DE TEST #3
```bash
npm run dev
```
**✓ Vérifier :**
- Hiérarchie visible dans patient-detail
- Points calculés correctement
- Progression des principaux (X/Y)
- Complétion automatique des principaux

---

### 🔧 ÉTAPE 4 : Intégration complète
- [ ] Tester création d'un objectif principal
- [ ] Tester création d'un objectif secondaire
- [ ] Vérifier les calculs de points
- [ ] Tester la complétion en cascade
- [ ] Responsive mobile

### 🧪 TEST FINAL
**Scénario complet :**
1. Créer un objectif principal "Test" ✓
2. Ajouter 3 objectifs secondaires (10, 15, 20 pts) ✓
3. Vérifier : principal affiche 45 pts total ✓
4. Compléter 2 secondaires → principal affiche 2/3 ✓
5. Compléter le 3e → principal passe en complété ✓
6. Mobile : hiérarchie reste lisible ✓

---

## 💡 Points d'attention

1. **Migration des données** : Les anciens objectifs deviennent des principaux sans secondaires
2. **Validation** : Un secondaire DOIT avoir un parent
3. **UX** : Message clair si pas d'objectif principal disponible
4. **Performance** : Calculer les totaux une seule fois, pas à chaque render
5. **Mobile** : Adapter l'affichage hiérarchique sur petits écrans

---

## 🎯 Résultat attendu

- ✅ Plus de catégories d'objectifs
- ✅ Système principal/secondaire fonctionnel
- ✅ Points sur les secondaires uniquement
- ✅ Calcul automatique pour les principaux
- ✅ Progression visuelle claire (X/Y complétés)
- ✅ Complétion automatique en cascade
- ✅ Interface de création intuitive
- ✅ Affichage hiérarchique lisible

---

## 📊 Métriques de succès

- Création d'objectifs principal → secondaires fluide
- Calculs de points corrects et instantanés
- Hiérarchie visuellement claire
- Pas de confusion sur le type d'objectif
- Mobile reste utilisable avec la hiérarchie