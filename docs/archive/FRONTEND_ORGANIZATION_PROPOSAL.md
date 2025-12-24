# Frontend Organization Proposal

## Current Structure (By Kind - Flat)
```
apps/web/src/
├── components/                    ⚠️ 15+ files, hard to navigate
│   ├── AKGolfDashboard.jsx
│   ├── Login.jsx
│   ├── Målsetninger.jsx
│   ├── Testprotokoll.jsx
│   ├── ... (10+ more)
│   └── Navigation.jsx
├── contexts/
│   └── AuthContext.jsx
└── services/
    └── api.js
```

**Problems:**
- ❌ All 13 screens in one folder (hard to find)
- ❌ Can't tell which components are shared vs feature-specific
- ❌ Doesn't scale (will have 50+ files soon)
- ❌ Hard to delete a feature (files scattered)

---

## Proposed Structure (Hybrid - Feature + Kind)

```
apps/web/src/
│
├── features/                      ✅ Feature-based organization
│   │
│   ├── dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── DashboardContainer.tsx
│   │   └── useDashboard.ts
│   │
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── useAuth.ts
│   │
│   ├── profile/
│   │   ├── UserProfile.tsx
│   │   ├── ProfileEdit.tsx
│   │   └── profileService.ts
│   │
│   ├── goals/
│   │   ├── GoalsList.tsx          (Målsetninger)
│   │   ├── GoalForm.tsx
│   │   └── goalsService.ts
│   │
│   ├── annual-plan/
│   │   ├── AnnualPlan.tsx         (Årsplan)
│   │   └── planService.ts
│   │
│   ├── tests/
│   │   ├── TestProtocol.tsx       (Testprotokoll)
│   │   ├── TestResults.tsx        (Testresultater)
│   │   ├── TestForm.tsx
│   │   └── testService.ts
│   │
│   ├── training/
│   │   ├── TrainingLog.tsx        (Treningsprotokoll)
│   │   ├── TrainingStats.tsx      (Treningsstatistikk)
│   │   └── trainingService.ts
│   │
│   ├── exercises/
│   │   ├── ExerciseList.tsx       (Øvelser)
│   │   ├── ExerciseDetail.tsx
│   │   └── exerciseService.ts
│   │
│   ├── notes/
│   │   ├── NotesList.tsx          (Notater)
│   │   └── notesService.ts
│   │
│   ├── archive/
│   │   └── Archive.tsx            (Arkiv)
│   │
│   ├── calendar/
│   │   └── Calendar.tsx           (Kalender)
│   │
│   └── coaches/
│       ├── CoachList.tsx          (Trenerteam)
│       └── coachService.ts
│
├── components/                    ✅ Shared/reusable only
│   │
│   ├── ui/                       # Generic UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Table.tsx
│   │
│   ├── layout/                   # Layout components
│   │   ├── Navigation.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   │
│   └── guards/                   # Route guards
│       └── ProtectedRoute.tsx
│
├── contexts/                      ✅ Global state
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── NotificationContext.tsx
│
├── services/                      ✅ API & integrations
│   ├── api.ts                    # Main API client
│   ├── apiClient.ts              # Axios instance
│   └── analytics.ts
│
├── hooks/                         ✅ Shared React hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useAsync.ts
│
├── utils/                         ✅ Shared utilities
│   ├── dateFormat.ts
│   ├── validation.ts
│   └── constants.ts
│
├── types/                         ✅ TypeScript types (future)
│   ├── user.ts
│   ├── test.ts
│   └── index.ts
│
├── design-tokens.js              ✅ Design system tokens
├── App.tsx                        ✅ Main app
└── index.tsx                      ✅ Entry point
```

---

## Benefits of Proposed Structure

### 1. **Co-location** (Everything Related is Together)
```
features/tests/
├── TestProtocol.tsx      ← Component
├── TestResults.tsx       ← Component
├── TestForm.tsx          ← Component
├── testService.ts        ← API calls
├── useTestData.ts        ← Custom hook
└── types.ts              ← TypeScript types
```

**Before:** Find test stuff in 3 folders (components/, services/, types/)
**After:** Find everything in one folder

### 2. **Easy to Delete Features**
```bash
# Remove entire tests feature:
rm -rf features/tests/
```

### 3. **Clear Separation**
- **features/**: Domain-specific (only used in one place)
- **components/**: Truly reusable (used everywhere)

### 4. **Scales Infinitely**
```
features/
├── dashboard/
├── auth/
├── tests/
├── ... (50+ features)    ← No problem!
└── new-feature/          ← Easy to add
```

### 5. **Team Ownership**
```
Team A owns: features/tests/, features/training/
Team B owns: features/coaches/, features/players/
```

### 6. **Better Imports**
```tsx
// Before (unclear where it is)
import { TestProtocol } from '../components/Testprotokoll'

// After (self-documenting)
import { TestProtocol } from '@/features/tests/TestProtocol'
import { Button } from '@/components/ui/Button'
```

---

## Migration Strategy

### Option 1: Big Bang (1-2 hours)
```bash
# Move all files at once
1. Create features/ folders
2. Move screens to appropriate features
3. Update all imports
4. Test everything
```

### Option 2: Gradual (Over time)
```bash
# Move one feature at a time
1. Start with features/auth/
2. Move Login.tsx → features/auth/Login.tsx
3. Update imports for auth
4. Test auth flow
5. Repeat for next feature
```

### Option 3: New Code Only
```bash
# Keep existing structure, use new for new features
1. New features go in features/
2. Old files stay in components/
3. Migrate gradually as you touch files
```

---

## Industry Examples

**This structure is used by:**

### Google (Angular)
```
src/
├── features/
└── shared/
```

### Facebook/Meta (React)
```
src/
├── features/
└── components/
```

### Shopify
```
src/
├── features/
├── components/
└── hooks/
```

### Vercel/Next.js Recommendation
```
app/
├── (routes)/           ← Features (Next.js 13+)
└── components/
```

---

## Recommendation

**For a 30-year veteran:** Use **Hybrid (Feature + Kind)**

**Rationale:**
1. ✅ Scales to any project size
2. ✅ Industry standard
3. ✅ Co-locates related code
4. ✅ Clear what's shared vs specific
5. ✅ Easy to onboard new developers
6. ✅ Recognized by all senior developers

---

## Your Choice

**A) Keep current** (By Kind)
- ✅ Simple for now
- ❌ Will be messy at 30+ components
- ❌ Not scalable

**B) Reorganize to Hybrid** (Recommended)
- ✅ Professional
- ✅ Scalable
- ✅ Industry standard
- ⏰ 1-2 hours to migrate

**C) Gradual migration**
- ✅ No big change
- ✅ Learn new pattern gradually
- ⏰ Move files as you work on them

---

**What would you like to do?**
