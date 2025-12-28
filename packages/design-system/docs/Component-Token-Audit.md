# Component Token Audit Plan

> **Versjon:** 1.0
> **Sist oppdatert:** 2025-12-26
> **Formål:** Kartlegge token-bruk i de 15 viktigste komponentene

---

## Prioritet 1 - Kritiske Komponenter (6)

### 1. Button

**Filer:**
- `src/ui/primitives/Button.primitive.tsx`
- `packages/design-system/components/Button.tsx`

**Tillatte tokens:**

| Element | Token |
|---------|-------|
| Primary bg | `--accent` |
| Primary hover | `--accent-hover` |
| Primary text | `--text-inverse` |
| Secondary bg | transparent |
| Secondary text | `--text-accent` |
| Secondary border | `--border-accent` |
| Disabled bg | `--bg` |
| Disabled text | `--text-tertiary` |
| Focus ring | `--accent` |

**Forbudte tokens:**
- `--ak-primary`, `--ak-gold`, any hex

**Required states:**
- [x] Default
- [x] Hover
- [x] Focus
- [x] Active
- [x] Disabled
- [ ] Loading

---

### 2. Badge

**Filer:**
- `src/ui/primitives/Badge.primitive.tsx`
- `src/components/primitives/Badge.jsx`
- `packages/design-system/components/Badge.tsx`

**Tillatte tokens:**

| Variant | Background | Text |
|---------|------------|------|
| Default | `--accent` (10%) | `--text-accent` |
| Achievement | `--achievement` (10%) | `--text-achievement` |
| Success | `--success` (10%) | `--success` |
| Warning | `--warning` (10%) | `--warning` |
| Error | `--error` (10%) | `--error` |
| Info | `--info` (10%) | `--info` |
| Muted | `--bg` | `--text-tertiary` |

**Forbudte tokens:**
- `--ak-gold` for non-achievement badges
- Any hex colors

**Required states:**
- [x] Default
- [ ] Hover (if interactive)

---

### 3. Card

**Filer:**
- `src/ui/primitives/Card.primitive.tsx` (hvis eksisterer)
- `packages/design-system/components/Card.tsx`

**Tillatte tokens:**

| Element | Token |
|---------|-------|
| Background | `--card` |
| Border | `--border` |
| Shadow | `--shadow-card` |
| Hover border | `--border-accent` |
| Title text | `--text-primary` |
| Body text | `--text-secondary` |

**Forbudte tokens:**
- Hardkodede hex for bakgrunn/kant
- `--ak-*` tokens

**Required states:**
- [x] Default
- [ ] Hover (if interactive)
- [ ] Selected
- [ ] Loading

---

### 4. Input

**Filer:**
- `src/ui/primitives/Input.primitive.tsx`

**Tillatte tokens:**

| State | Background | Border | Text |
|-------|------------|--------|------|
| Default | `--background-white` | `--border` | `--text-primary` |
| Focus | `--background-white` | `--border-accent` | `--text-primary` |
| Error | `--background-white` | `--error` | `--text-primary` |
| Disabled | `--bg` | `--border` | `--text-tertiary` |
| Placeholder | - | - | `--text-tertiary` |

**Forbudte tokens:**
- `--gray-*` for borders
- Hex colors

**Required states:**
- [x] Default
- [x] Focus
- [x] Error
- [x] Disabled
- [x] Placeholder

---

### 5. Toast/Alert

**Filer:**
- `src/ui/composites/Toast.composite.tsx`

**Tillatte tokens:**

| Type | Background | Icon | Text |
|------|------------|------|------|
| Success | `--success` (10%) | `.tone-success` | `--text-primary` |
| Warning | `--warning` (10%) | `.tone-warning` | `--text-primary` |
| Error | `--error` (10%) | `.tone-error` | `--text-primary` |
| Info | `--info` (10%) | `.tone-info` | `--text-primary` |

**Forbudte tokens:**
- `--ak-success`, `--ak-warning`, `--ak-error`
- Hex colors

**Required states:**
- [x] Default
- [ ] Dismissing (animation)

---

### 6. Modal

**Filer:**
- `src/ui/composites/Modal.composite.tsx` (hvis eksisterer)

**Tillatte tokens:**

| Element | Token |
|---------|-------|
| Backdrop | rgba(0,0,0,0.5) eller `--background-inverse` (50%) |
| Container | `--card` |
| Border | `--border` |
| Header text | `--text-primary` |
| Close button | `--text-tertiary` -> `--text-primary` on hover |

**Required states:**
- [x] Default
- [ ] Entering (animation)
- [ ] Exiting (animation)

---

## Prioritet 2 - Sekundære Komponenter (5)

### 7. Tabs

**Filer:**
- `src/ui/composites/Tabs.composite.tsx`

**Tillatte tokens:**

| State | Text | Border/Indicator |
|-------|------|-----------------|
| Default | `--text-secondary` | `--border` |
| Hover | `--text-primary` | `--border-accent` |
| Active | `--text-accent` | `--accent` |
| Disabled | `--text-tertiary` | `--border` |

---

### 8. Progress

**Filer:**
- `packages/design-system/components/Progress.tsx`

**Tillatte tokens:**

| Element | Token |
|---------|-------|
| Track | `--bg` eller `--border` |
| Fill (default) | `--accent` |
| Fill (success) | `--success` |
| Fill (warning) | `--warning` |
| Fill (error) | `--error` |

---

### 9. Avatar

**Filer:**
- `src/ui/primitives/Avatar.primitive.tsx`
- `packages/design-system/components/Avatar.tsx`

**Tillatte tokens:**

| Element | Token |
|---------|-------|
| Background (fallback) | `--accent` |
| Text (initials) | `--text-inverse` |
| Border | `--border` |
| Status dot (online) | `--success` |
| Status dot (away) | `--warning` |
| Status dot (offline) | `--text-tertiary` |

---

### 10. Dropdown

**Filer:**
- `src/ui/composites/Dropdown.composite.tsx`

**Tillatte tokens:**

| Element | Token |
|---------|-------|
| Trigger | Følger Button-tokens |
| Menu bg | `--card` |
| Menu border | `--border` |
| Menu shadow | `--shadow-elevated` |
| Item default | `--text-primary` |
| Item hover bg | `--accent` (10%) |
| Item active bg | `--accent` (15%) |
| Divider | `--border-subtle` |

---

### 11. Pagination

**Filer:**
- `src/ui/composites/Pagination.composite.tsx`

**Tillatte tokens:**

| State | Background | Text |
|-------|------------|------|
| Default | transparent | `--text-secondary` |
| Hover | `--accent` (10%) | `--text-accent` |
| Active/Current | `--accent` | `--text-inverse` |
| Disabled | transparent | `--text-tertiary` |

---

## Prioritet 3 - Støttekomponenter (4)

### 12. Checkbox

**Filer:**
- `src/ui/primitives/Checkbox.primitive.tsx`

**Tillatte tokens:**

| State | Border | Background | Checkmark |
|-------|--------|------------|-----------|
| Unchecked | `--border` | `--background-white` | - |
| Checked | `--accent` | `--accent` | `--text-inverse` |
| Indeterminate | `--accent` | `--accent` | `--text-inverse` |
| Disabled | `--border` | `--bg` | `--text-tertiary` |
| Error | `--error` | `--background-white` | - |

---

### 13. Switch

**Filer:**
- `src/ui/primitives/Switch.primitive.tsx`

**Tillatte tokens:**

| State | Track | Thumb |
|-------|-------|-------|
| Off | `--border` | `--card` |
| On | `--accent` | `--card` |
| Disabled Off | `--bg` | `--border` |
| Disabled On | `--accent` (50%) | `--card` |

---

### 14. Spinner

**Filer:**
- `src/ui/primitives/Spinner.primitive.tsx`

**Tillatte tokens:**

| Element | Token |
|---------|-------|
| Default | `--accent` |
| On dark bg | `--text-inverse` |
| Track | `--border` |

---

### 15. Text/Typography

**Filer:**
- `src/ui/primitives/Text.primitive.tsx`

**Tillatte tokens:**

| Variant | Token |
|---------|-------|
| Default | `--text-primary` |
| Secondary | `--text-secondary` |
| Muted | `--text-tertiary` |
| Accent | `--text-accent` |
| Success | `--success` |
| Warning | `--warning` |
| Error | `--error` |

---

## Audit Prosess

### Steg 1: Identifiser brudd
```bash
# Søk etter hardkodede hex i komponent
grep -n "#[0-9A-Fa-f]\{3,8\}" src/ui/primitives/Button.primitive.tsx

# Søk etter rå tokens
grep -n "var(--ak-\|var(--gray-" src/ui/primitives/Button.primitive.tsx
```

### Steg 2: Erstatt med semantiske tokens
- Erstatt `#10456A` med `var(--accent)`
- Erstatt `var(--ak-primary)` med `var(--accent)`
- Erstatt `var(--gray-500)` med `var(--text-tertiary)`

### Steg 3: Verifiser states
- Test alle definerte states visuelt
- Verifiser dark mode fungerer
- Kjør lint for å bekrefte ingen brudd

### Steg 4: Dokumenter
- Oppdater komponent-dokumentasjon
- Legg til i Storybook (hvis relevant)

---

## Fremdriftssjekkliste

| Komponent | Auditert | Fikset | Verifisert |
|-----------|----------|--------|------------|
| Button | [ ] | [ ] | [ ] |
| Badge | [ ] | [ ] | [ ] |
| Card | [ ] | [ ] | [ ] |
| Input | [ ] | [ ] | [ ] |
| Toast | [ ] | [ ] | [ ] |
| Modal | [ ] | [ ] | [ ] |
| Tabs | [ ] | [ ] | [ ] |
| Progress | [ ] | [ ] | [ ] |
| Avatar | [ ] | [ ] | [ ] |
| Dropdown | [ ] | [ ] | [ ] |
| Pagination | [ ] | [ ] | [ ] |
| Checkbox | [ ] | [ ] | [ ] |
| Switch | [ ] | [ ] | [ ] |
| Spinner | [ ] | [ ] | [ ] |
| Text | [ ] | [ ] | [ ] |
