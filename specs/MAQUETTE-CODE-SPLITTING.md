# MAQUETTE - Optimisation Performance via Code Splitting

## 📊 Objectifs et Métriques

### Objectifs principaux
1. **Réduire le bundle initial de 164 kB à ~63 kB** (réduction de 62%)
2. **Améliorer le Time to Interactive (TTI) de 3.2s à 1.2s** sur connexion 4G
3. **Diviser l'application en chunks logiques** chargés à la demande
4. **Maintenir une expérience utilisateur fluide** avec des loading states appropriés

### Métriques de succès
- ✅ First Contentful Paint < 1 seconde
- ✅ Time to Interactive < 1.5 secondes (4G)
- ✅ Bundle initial < 70 kB
- ✅ Chaque route lazy-loaded < 50 kB
- ✅ Temps de chargement des chunks < 300ms (4G)

## 🎯 Stratégie de Code Splitting

### 1. Route-based splitting (Impact: HIGH)
- Login View : Chargement statique (nécessaire immédiatement)
- Dashboard Views : Chargement dynamique
- Patient Views : Chargement dynamique
- Create/Edit Views : Chargement dynamique

### 2. Component-based splitting (Impact: MEDIUM)
- Heavy UI components (Sidebar, Calendar, Command)
- Chart library (Recharts)
- Role-specific components (Bottom Navigation)

### 3. Library splitting (Impact: HIGH)
- Recharts (~45 kB minifié)
- Framer Motion animations (chargement conditionnel)
- Date-fns (import seulement les fonctions utilisées)

## 📝 Plan d'implémentation détaillé

### Phase 1: Préparation (30 minutes)
1. Backup du code actuel
2. Installation des dépendances si nécessaire
3. Configuration du build pour analyse

### Phase 2: Route Splitting dans app-shell.tsx (1 heure)

#### Étape 1: Modifier les imports dans app-shell.tsx

```typescript
// components/app-shell.tsx
"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { mockPatients, mockGoals } from '@/lib/mock-data'
import { ViewTransition } from './view-transition'

// Import statique pour LoginView (nécessaire immédiatement)
import { LoginView } from './views/login-view'

// Loading component réutilisable
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
)

// Dynamic imports avec loading states personnalisés
const TherapistDashboard = dynamic(
  () => import('./views/therapist-dashboard').then(mod => ({ 
    default: mod.TherapistDashboard 
  })),
  { 
    loading: () => <LoadingSpinner />,
    ssr: true // Garder SSR pour SEO
  }
)

const PatientDetail = dynamic(
  () => import('./views/patient-detail').then(mod => ({ 
    default: mod.PatientDetail 
  })),
  { 
    loading: () => <LoadingSpinner />,
    ssr: true
  }
)

const PatientGoals = dynamic(
  () => import('./views/patient-goals').then(mod => ({ 
    default: mod.PatientGoals 
  })),
  { 
    loading: () => <LoadingSpinner />,
    ssr: true
  }
)

const CreateGoal = dynamic(
  () => import('./views/create-goal').then(mod => ({ 
    default: mod.CreateGoal 
  })),
  { 
    loading: () => <LoadingSpinner />,
    ssr: true
  }
)

// Bottom navigation components (role-specific)
const TherapistBottomNavigation = dynamic(
  () => import('./therapist-bottom-navigation').then(mod => ({ 
    default: mod.TherapistBottomNavigation 
  })),
  { loading: () => null }
)

const PatientBottomNavigation = dynamic(
  () => import('./patient-bottom-navigation').then(mod => ({ 
    default: mod.PatientBottomNavigation 
  })),
  { loading: () => null }
)
```

#### Étape 2: Mettre à jour le renderView function

```typescript
const renderView = () => {
  switch (view) {
    case 'login':
      return <LoginView onNavigate={handleNavigate} />
    
    case 'therapist-dashboard':
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <TherapistDashboard 
            patients={mockPatients} 
            onNavigate={handleNavigate} 
          />
        </Suspense>
      )
    
    case 'patient-detail':
      const patient = mockPatients.find(p => p.id === selectedPatient)
      if (!patient) return null
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <PatientDetail 
            patient={patient}
            goals={mockGoals}
            onNavigate={handleNavigate}
          />
        </Suspense>
      )
    
    case 'patient-goals':
      const patientGoals = mockGoals.filter(g => g.patientId === "1")
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <PatientGoals 
            goals={patientGoals}
            onNavigate={handleNavigate}
          />
        </Suspense>
      )
    
    case 'create-goal':
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <CreateGoal 
            patients={mockPatients}
            goals={mockGoals}
            onNavigate={handleNavigate}
          />
        </Suspense>
      )
    
    default:
      return <LoginView onNavigate={handleNavigate} />
  }
}
```

### Phase 3: Component Splitting pour UI lourds (45 minutes)

#### Étape 1: Créer un fichier pour les imports dynamiques des UI components

```typescript
// components/ui/dynamic-imports.ts
import dynamic from 'next/dynamic'

// Heavy UI components loaded on demand
export const DynamicSidebar = dynamic(
  () => import('./sidebar'),
  { 
    loading: () => <div className="w-64 h-full bg-gray-100 animate-pulse" />,
    ssr: false 
  }
)

export const DynamicCalendar = dynamic(
  () => import('./calendar'),
  { 
    loading: () => <div className="w-full h-64 bg-gray-100 animate-pulse" />,
    ssr: false 
  }
)

export const DynamicCommand = dynamic(
  () => import('./command'),
  { 
    loading: () => null,
    ssr: false 
  }
)

export const DynamicCarousel = dynamic(
  () => import('./carousel'),
  { 
    loading: () => <div className="w-full h-48 bg-gray-100 animate-pulse" />,
    ssr: false 
  }
)

// Chart component avec fallback spécifique
export const DynamicChart = dynamic(
  () => import('./chart'),
  { 
    loading: () => (
      <div className="w-full h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Chargement du graphique...</span>
      </div>
    ),
    ssr: false // Les charts ont souvent des problèmes SSR
  }
)
```

#### Étape 2: Remplacer les imports dans les composants qui utilisent ces UI

```typescript
// Exemple dans therapist-dashboard.tsx
// Avant:
import { Chart } from '@/components/ui/chart'

// Après:
import { DynamicChart as Chart } from '@/components/ui/dynamic-imports'
```

### Phase 4: Optimisation des imports de librairies (30 minutes)

#### Étape 1: Optimiser les imports de date-fns

```typescript
// Avant (importe toute la librairie):
import { format, parseISO, addDays } from 'date-fns'

// Après (imports spécifiques):
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import addDays from 'date-fns/addDays'
```

#### Étape 2: Lazy load Framer Motion pour les animations non-critiques

```typescript
// components/view-transition.tsx
import dynamic from 'next/dynamic'
import { ReactNode } from 'react'

// Lazy load AnimatePresence
const AnimatePresence = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.AnimatePresence })),
  { ssr: false }
)

const motion = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion })),
  { ssr: false }
)
```

### Phase 5: Configuration Next.js optimisée (15 minutes)

```javascript
// next.config.mjs
import { withContentSecurityPolicy } from './security-config.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimisation du build
  swcMinify: true,
  
  // Optimisation des images
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Compression
  compress: true,
  
  // Optimisation du bundle
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'date-fns',
      'recharts',
      'framer-motion',
      '@radix-ui/react-icons'
    ]
  },
  
  // Webpack config pour bundle analysis
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Tree shaking agressif
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
      
      // Split chunks strategy
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test(module) {
              return module.size() > 160000
            },
            name(module) {
              const hash = crypto.createHash('sha1')
              hash.update(module.identifier())
              return hash.digest('hex').substring(0, 8)
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            priority: 20,
          },
          shared: {
            name(module, chunks) {
              return crypto
                .createHash('sha1')
                .update(chunks.reduce((acc, chunk) => acc + chunk.name, ''))
                .digest('hex')
                .substring(0, 8)
            },
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
        maxAsyncRequests: 6,
        maxInitialRequests: 4,
      }
    }
    return config
  },
}

export default withContentSecurityPolicy(nextConfig)
```

## 🧪 Tests de validation

### 1. Vérification des métriques (après implémentation)

```bash
# Build de production avec analyse
npm run build

# Analyser la taille des bundles
npm run analyze  # Si configuré

# Ou utiliser npx pour une analyse rapide
npx @next/bundle-analyzer
```

### 2. Tests de performance

```bash
# Lighthouse CI pour métriques automatisées
npx lighthouse http://localhost:3000 --view

# Vérifier les Core Web Vitals
# - LCP < 2.5s (Largest Contentful Paint)
# - FID < 100ms (First Input Delay)
# - CLS < 0.1 (Cumulative Layout Shift)
```

### 3. Validation manuelle

#### Checklist de validation:
- [ ] La page de login se charge en < 1 seconde
- [ ] Les transitions entre vues montrent un loading state
- [ ] Pas de flash de contenu non stylé (FOUC)
- [ ] Les animations restent fluides
- [ ] Le cache navigateur fonctionne pour les chunks
- [ ] Pas d'erreurs dans la console
- [ ] Les chunks se chargent dans l'ordre attendu

## 📈 Résultats attendus

### Avant optimisation
```
Route                    Size      First Load JS
/ (page.tsx)            64.3 kB    164 kB
Shared chunks           99.6 kB    -
Total Initial Load:     164 kB
TTI (4G):              3.2s
FCP:                   1.8s
```

### Après optimisation
```
Route                    Size      First Load JS
/ (login only)          8 kB       63 kB
/dashboard (lazy)       40 kB      40 kB (loaded on demand)
/patient (lazy)         30 kB      30 kB (loaded on demand)
Charts (lazy)           25 kB      25 kB (loaded on demand)
Total Initial Load:     63 kB
TTI (4G):              1.2s
FCP:                   0.7s
```

### Amélioration de performance
- **Réduction bundle initial**: 62% (164 kB → 63 kB)
- **TTI improvement**: 63% plus rapide (3.2s → 1.2s)
- **FCP improvement**: 61% plus rapide (1.8s → 0.7s)

## 🚀 Script d'implémentation automatisé

```bash
#!/bin/bash
# setup-code-splitting.sh

echo "🚀 Début de l'optimisation Code Splitting..."

# 1. Backup
echo "📦 Création du backup..."
cp -r components components.backup
cp next.config.mjs next.config.mjs.backup

# 2. Installation des outils d'analyse (optionnel)
echo "📊 Installation des outils d'analyse..."
npm install --save-dev @next/bundle-analyzer webpack-bundle-analyzer

# 3. Application des changements
echo "✨ Application du code splitting..."
# Les modifications doivent être faites manuellement selon le guide

# 4. Build de test
echo "🔨 Build de production..."
npm run build

# 5. Affichage des résultats
echo "✅ Optimisation terminée!"
echo "📈 Vérifiez les nouvelles métriques dans le output du build"
```

## 📚 Ressources et documentation

### Documentation officielle
- [Next.js Dynamic Imports](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [React Suspense](https://react.dev/reference/react/Suspense)
- [Code Splitting Best Practices](https://web.dev/code-splitting/)

### Outils de monitoring
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Web Vitals](https://web.dev/vitals/)

## ⚠️ Points d'attention

1. **Loading States**: Toujours fournir des loading states appropriés
2. **SEO**: Garder SSR pour les pages importantes pour le SEO
3. **Prefetching**: Next.js prefetch automatiquement les liens visibles
4. **Cache**: Configurer les headers de cache appropriés
5. **Error Boundaries**: Ajouter des error boundaries pour les chunks

## 📅 Timeline d'implémentation

- **Phase 1**: 30 min - Préparation et backup
- **Phase 2**: 60 min - Route splitting
- **Phase 3**: 45 min - Component splitting  
- **Phase 4**: 30 min - Library optimization
- **Phase 5**: 15 min - Configuration
- **Tests**: 30 min - Validation
- **Total**: ~3.5 heures

## ✅ Checklist finale

- [ ] Backup créé
- [ ] Routes splitées avec dynamic imports
- [ ] Heavy UI components lazy loaded
- [ ] Charts lazy loaded
- [ ] Loading states implémentés
- [ ] Build de production réussi
- [ ] Métriques validées (< 70 kB initial bundle)
- [ ] Tests manuels passés
- [ ] Documentation mise à jour