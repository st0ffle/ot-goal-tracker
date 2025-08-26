# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Index

@PROJECT_INDEX.json - Contains the complete architectural overview with function signatures, dependencies, and project structure. This index is automatically updated when files are modified.

## Project Overview

OT Goal Tracker is a Next.js application for occupational therapy goal tracking. It helps therapists manage patients and track their therapy goals with a hierarchical goal system (primary and secondary goals).

## Development Commands

```bash
npm run dev        # Start development server on http://localhost:3000
npm run build      # Build for production
npm run lint       # Run ESLint
npm start          # Start production server
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.4.6 with App Router
- **UI Components**: Radix UI primitives with shadcn/ui pattern
- **Styling**: Tailwind CSS v4 with PostCSS
- **Animation**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Fonts**: Geist Sans & Mono
- **Language**: TypeScript

### Directory Structure

```
app/                    # Next.js App Router pages
├── (auth)/            # Auth group route
│   └── login/         # Login page
├── (dashboard)/       # Dashboard group with AppShell layout
│   ├── patient/       # Patient views
│   └── therapist/     # Therapist dashboard
components/
├── views/             # Main view components (use client)
├── ui/                # shadcn/ui components
├── client/            # Client-only interactive components
└── *.tsx              # Shared components
lib/                   # Utilities and data
├── mock-data.ts       # Mock patient/goal data
└── utils.ts           # Helper functions (cn utility)
utils/
└── goal-helpers.ts    # Goal system logic
```

### Key Architectural Patterns

1. **Goal Hierarchy System**
   - Primary goals contain secondary goals
   - Points are calculated from secondary goals
   - Progress tracking at both levels
   - See `utils/goal-helpers.ts` for implementation

2. **Patient Management**
   - Active vs Archived patient states
   - Patient cards with progress indicators
   - Responsive mobile/desktop layouts

3. **Component Organization**
   - Views in `components/views/` are client components
   - UI components follow shadcn/ui patterns
   - AppShell provides navigation wrapper
   - Bottom navigation for mobile

4. **Responsive Design**
   - Mobile-first approach
   - Responsive patterns in `components/responsive-patterns.tsx`
   - Different layouts for mobile/desktop (cards vs tables)
   - Bottom navigation on mobile only

## Testing Approach

No test framework is currently configured. When implementing tests, check package.json for test scripts or ask the user for the preferred testing setup.

## Routing Structure

- `/` - Root redirects to `/therapist`
- `/login` - Authentication page
- `/therapist` - Main therapist dashboard
- `/patient/[id]` - Patient detail view
- `/patient/create-goal` - Goal creation form

## Mock Data

The application uses mock data defined in `lib/mock-data.ts`:
- Mock patients with active/archived states
- Hierarchical goals (primary/secondary)
- Mock therapist data

## Important Implementation Notes

- All view components require `"use client"` directive
- Use `prefetch={true}` on Next.js Link components for performance
- Patient IDs and goal IDs are strings
- French language is used in the UI ("ergothérapie")
- Points system: Secondary goals have points, primary goals aggregate them