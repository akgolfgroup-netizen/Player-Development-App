# Feilfikse-plan: Spiller og Coach-sider

**Dato:** 5. januar 2026
**Estimert tid:** 3-4 timer
**Modus:** Auto-YES (ingen brukerinteraksjon)

---

## FASE 1: Kritiske Runtime-feil (30 min)

### 1.1 Null-sjekker på route params

| # | Fil | Linje | Problem | Fix |
|---|-----|-------|---------|-----|
| 1 | `features/tests/Testresultater.tsx` | ~kategori | `item.category.toLowerCase()` uten null-sjekk | `item.category?.toLowerCase() ?? 'unknown'` |
| 2 | `features/coach-athlete-list/CoachAthleteListContainer.tsx` | useParams | `playerId!` assertion | Early return + loading state |
| 3 | `features/coach-notes/CoachNotesContainer.tsx` | useParams | `playerId` ikke validert | Legg til `if (!playerId) return <NotFound />` |
| 4 | `features/coach-training-plan-editor/CoachTrainingPlanEditorContainer.tsx` | useParams | `playerId` brukt uten validering | Null guard med redirect |
| 5 | `features/coach-athlete-detail/CoachAthleteDetailContainer.tsx` | useParams | `athleteId` kan være undefined | Early return pattern |

### 1.2 Array-operasjoner validering

| # | Fil | Problem | Fix |
|---|-----|---------|-----|
| 6 | `features/messaging/ConversationView.tsx` | `messages.map()` uten null-sjekk | `(messages ?? []).map()` |
| 7 | `features/coach-athlete-list/CoachAthleteListContainer.tsx` | `athletes` state brukt i map | Legg til fallback `[]` |

### 1.3 TrainingCategoryBadge assertions

| # | Fil | Problem | Fix |
|---|-----|---------|-----|
| 8 | `features/calendar/Kalender.tsx` | `category as any` | Type guard + validering |
| 9 | `features/sessions/SessionsListView.tsx` | `category as any` | Type guard + validering |

---

## FASE 2: API Feilhåndtering (45 min)

### 2.1 Erstatt silent catches med error states

| # | Fil | Nåværende | Ny implementasjon |
|---|-----|-----------|-------------------|
| 1 | `features/coach-notes/CoachNotesContainer.tsx` | `.catch(() => ({ data: null }))` | Sett error state + vis toast |
| 2 | `features/coach-training-plan-editor/CoachTrainingPlanEditorContainer.tsx` | Silent catch | Error state + brukervarsel |
| 3 | `features/coach-athlete-detail/CoachAthleteDetailContainer.tsx` | Nested try-catch | Unified error handling |
| 4 | `features/coach-planning/CoachPlanningHub.tsx` | `.catch(() => ({ data: null }))` | Error state med retry-knapp |

### 2.2 Legg til toast-varsler for feil

| # | Fil | Endring |
|---|-----|---------|
| 5 | `features/coach-athlete-list/CoachAthleteListContainer.tsx` | Import useToast, vis varsel ved fallback |
| 6 | `features/coach-dashboard/CoachDashboard.tsx` | Legg til error toast ved API-feil |
| 7 | `features/coach-notes/CoachNotes.tsx` | Toast ved lagringsfeil |

### 2.3 Valider API-responser før bruk

| # | Fil | Validering som legges til |
|---|-----|---------------------------|
| 8 | `features/coach-dashboard/CoachDashboard.tsx` | Sjekk `statsData` struktur før bruk |
| 9 | `features/coach-intelligence/CoachAlertsPage.tsx` | Valider `responseData` før mapping |
| 10 | `features/innstillinger/VarselinnstillingerContainer.tsx` | Type-sjekk på error-objekt |

---

## FASE 3: Type-sikkerhet (60 min)

### 3.1 Erstatt `as any` med proper types

| # | Fil | Assertion | Erstattes med |
|---|-----|-----------|---------------|
| 1 | `features/coach-dashboard/CoachDashboard.tsx` | `(user as any)?.coachId` | Utvid User interface |
| 2 | `features/coach-dashboard/CoachDashboard.tsx` | `(alertsResponse as any)?.alerts` | Type guard |
| 3 | `features/coach-dashboard/CoachDashboard.tsx` | `statsRes.data as any` | StatsResponse interface |
| 4 | `features/coach-groups/CoachGroupList.tsx` | `filter.key as any` | FilterType union |
| 5 | `features/coach-groups/CoachGroupCreate.tsx` | `type.key as any` | GroupType type |
| 6 | `features/coach-groups/CoachGroupPlan.tsx` | `type as any` | SessionType |
| 7 | `features/coach-groups/CoachGroupDetail.tsx` | `tab.key as any` | TabKey union |
| 8 | `features/coach-statistics/CoachStatistics.tsx` | `e.target.value as any` | TimeRange type |
| 9 | `features/player-stats/TestResultsPage.tsx` | `e.target.value as any` | SortBy type |
| 10 | `features/coach-exercises/CoachSessionTemplateEditor.tsx` | `e.target.value as any` | Difficulty type |

### 3.2 Opprett manglende type definitions

```typescript
// Nye types som opprettes i src/types/api.ts:
- CoachStatsResponse
- AlertsResponse
- FilterType
- TabKey unions
- TimeRange
- SortBy
```

---

## FASE 4: Fjern @ts-nocheck fra kritiske filer (60 min)

### Prioritert rekkefølge (mest brukte først):

| # | Fil | Kompleksitet | Strategi |
|---|-----|--------------|----------|
| 1 | `features/coach-dashboard/CoachDashboard.tsx` | HØY | Legg til types gradvis |
| 2 | `features/sessions/SessionsListView.tsx` | MIDDELS | Fix imports + props |
| 3 | `features/tests/Testresultater.tsx` | MIDDELS | TestResult interface |
| 4 | `features/calendar/Kalender.tsx` | HØY | CalendarEvent types |
| 5 | `features/coach-athlete-detail/CoachAthleteDetailContainer.tsx` | MIDDELS | Athlete interface |
| 6 | `features/innstillinger/VarselinnstillingerContainer.tsx` | LAV | Allerede typet |
| 7 | `features/coach-settings/CoachSettings.tsx` | LAV | Settings interface |
| 8 | `features/goals/Maalsetninger.tsx` | MIDDELS | Goal types |
| 9 | `features/training/Treningsstatistikk.tsx` | MIDDELS | TrainingStats types |
| 10 | `features/bevis/BevisContainer.tsx` | LAV | Proof types |

---

## FASE 5: Props-validering og State Management (30 min)

### 5.1 Props-validering

| # | Fil | Prop | Fix |
|---|-----|------|-----|
| 1 | `features/coach-notes/CoachNotes.tsx` | `onAddNote` | Optional chaining `onAddNote?.()` |
| 2 | `features/coach-athlete-detail/CoachAthleteDetail.tsx` | `onViewProof` | Default noop function |
| 3 | `features/coach-athlete-detail/CoachAthleteDetail.tsx` | `onSendMessage` | Default noop function |

### 5.2 State Management fixes

| # | Fil | Problem | Fix |
|---|-----|---------|-----|
| 4 | `features/coach-athlete-list/CoachAthleteListContainer.tsx` | Error state settes til 'idle' | Ny 'fallback' state |
| 5 | `features/messaging/ConversationView.tsx` | Empty catch block | Error state handling |

---

## Oppsummering

| Fase | Antall filer | Estimert tid | Risiko |
|------|--------------|--------------|--------|
| 1 - Kritiske runtime-feil | 9 | 30 min | HØY |
| 2 - API feilhåndtering | 10 | 45 min | HØY |
| 3 - Type-sikkerhet | 10+ | 60 min | MIDDELS |
| 4 - @ts-nocheck | 10 | 60 min | LAV |
| 5 - Props/State | 5 | 30 min | MIDDELS |
| **TOTALT** | **44+ filer** | **~3.5 timer** | - |

---

## Rekkefølge for utførelse

```
1. Fase 1.1 → Null-sjekker (forhindrer crashes)
2. Fase 1.2 → Array-validering
3. Fase 1.3 → Category assertions
4. Fase 2.1 → Silent catches → error states
5. Fase 2.2 → Toast-varsler
6. Fase 2.3 → API-respons validering
7. Fase 3.1 → Erstatt as any
8. Fase 3.2 → Nye type definitions
9. Fase 4 → @ts-nocheck (prioritert liste)
10. Fase 5 → Props og state
```

---

## Validering etter hver fase

Etter hver fase kjøres:
1. `npm run build` - Sjekk kompilering
2. `npx tsc --noEmit` - TypeScript-sjekk
3. Manuell test av berørte sider

---

## Rollback-strategi

Hvis noe går galt:
- Git commit etter hver fase
- Kan rulle tilbake til forrige fase

---

**GODKJENN DENNE PLANEN FOR AUTO-YES MODUS**
