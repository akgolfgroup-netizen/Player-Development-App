# Naming Conventions

This document standardizes naming across the IUP Golf codebase, providing a mapping from Norwegian terms to English equivalents for consistency in code, types, and exports.

## Status

- **Phase 1** (This PR): Documentation + type aliases in domain modules
- **Phase 2** (Future): Gradual migration of high-impact terms
- **Phase 3** (Future): Full standardization of enum values

## Mapping Table

### Session & Training Types

| Norwegian | English | Usage Context | Status |
|-----------|---------|---------------|--------|
| `teknikk` | `technique` | Session type, training focus | Documented |
| `golfslag` | `golfShot` | Session type | Documented |
| `spill` | `play` / `game` | Session type | Documented |
| `fysisk` | `physical` | Session/skill type | Documented |
| `mental` | `mental` | Session/skill type | Already English |
| `konkurranse` | `competition` | Session type | Documented |

### Skill Areas (UI)

| Norwegian | English | Usage Context | Status |
|-----------|---------|---------------|--------|
| `teknikk` | `technique` | UI skill area | Documented |
| `fysisk` | `physical` | UI skill area | Documented |
| `strategisk` | `strategic` | UI skill area | Documented |
| `jernspill` | `ironPlay` | UI skill area (iron shots) | Documented |
| `kortspill` | `shortGame` | UI skill area (short game) | Documented |
| `putting` | `putting` | UI skill area | Already English |
| `driving` | `driving` | UI skill area | Already English |
| `golf` | `golf` | UI skill area (general) | Already English |

### Goal Types

| Norwegian | English | Usage Context | Status |
|-----------|---------|---------------|--------|
| `mål` / `maalsetning` | `goal` | Goal entity | Type alias added |
| `kort` / `short` | `short` | Goal timeframe | Already English |
| `lang` / `long` | `long` | Goal timeframe | Already English |

### Navigation & Features

| Norwegian | English | Usage Context | Status |
|-----------|---------|---------------|--------|
| `Oversikt` | `Overview` | Page/component names | Deferred |
| `Trening` | `Training` | Feature area | Deferred |
| `Kalender` | `Calendar` | Feature area | Deferred |
| `Øvelser` | `Exercises` | Feature area | Deferred |
| `Innstillinger` | `Settings` | Feature area | Deferred |
| `Statistikk` | `Statistics` | Feature area | Deferred |
| `Resultater` | `Results` | Feature area | Deferred |
| `Varsler` | `Notifications` | Feature area | Deferred |

### Period & Phase Terms

| Norwegian | English | Usage Context | Status |
|-----------|---------|---------------|--------|
| `Evaluering` (E) | `Evaluation` | Training period (Uke 43-46) | Documented |
| `Grunnperiode` (G) | `Foundation` | Training period (Uke 47-12) | Documented |
| `Spesialisering` (S) | `Specialization` | Training period (Uke 13-25) | Documented |
| `Turnering` (T) | `Tournament` | Training period (Uke 26-42) | Documented |

### Player Categories

| Norwegian | English | Usage Context | Status |
|-----------|---------|---------------|--------|
| `Spiller` | `Player` | User role | Already English in code |
| `Trener` | `Coach` | User role | Already English in code |
| `Kategori` | `Category` | Player tier (A-K system) | Documented |

## Guidelines

### When to Use Norwegian

1. **User-facing labels** - Keep Norwegian for UI text displayed to users
2. **Route paths** - Legacy routes may keep Norwegian paths for backward compatibility
3. **Database values** - Existing enum values in DB remain unchanged

### When to Use English

1. **Type names** - All TypeScript types/interfaces should use English
2. **Function names** - All function/method names should use English
3. **Variable names** - All variable names should use English
4. **Export names** - Public API exports should use English
5. **New enum values** - New enums should use English values

### Migration Pattern

When migrating a term:

```typescript
// Step 1: Add English type alias
export type TrainingCategory = SessionType; // Alias for Norwegian enum

// Step 2: Add English constant alias
export const TRAINING_CATEGORIES = SESSION_TYPES;

// Step 3: Deprecate Norwegian name (future)
/** @deprecated Use TrainingCategory */
export type SessionType = 'teknikk' | 'golfslag' | ...;
```

## Deferred Renames

The following renames are identified but deferred to minimize risk:

| Current | Target | Files Affected | Reason for Deferral |
|---------|--------|----------------|---------------------|
| `UISkillArea` values | English values | 46+ files | High impact, needs coordinated migration |
| `SessionType` values | English values | 100+ files | Core shared type, DB migration needed |
| Feature directory names | English names | N/A | Routes depend on paths, breaking change |
| Component file names | English names | N/A | Import paths would break |

## Applied in This PR

### Files Changed

1. `docs/naming.md` - This naming convention documentation
2. `apps/web/src/domain/goals/index.ts` - Added canonical type re-exports from @iup/shared-types
3. `apps/web/src/domain/tests/index.ts` - Added canonical type re-exports from @iup/shared-types

### Changes Made

- Added re-exports for canonical types (Goal, GoalType, TestResult, TestCategory, etc.)
- Added re-exports for constant arrays (GOAL_TYPES, TEST_CATEGORIES, etc.)
- Updated module documentation to reference naming conventions

### Verification

- Purity checks: Passed (4 files)
- Unit tests: Passed (98 tests across both domain modules)
