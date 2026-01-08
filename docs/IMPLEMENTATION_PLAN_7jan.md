# Implementasjonsplan: UI/UX Forbedringer 7. Januar 2026

## Oversikt
Auto-godkjent implementasjon av alle UI/UX-endringer fra "Nye ednder 7 jan.md"

---

## 🔴 FASE 1: Login & Auth (HØYEST PRIORITET)

### 1.1 Login Page Button Colors
**Fil:** `apps/web/src/features/auth/Login.tsx`
- [ ] Fiks farge på knapp nede til høyre (reset password modal)
- **Løsning:** Endre Button variant til TIER-primary
- **Lokasjon:** Linje 258

### 1.2 Demo Login Spacing
**Fil:** `apps/web/src/features/auth/Login.tsx`
- [ ] Fix spacing mellom "Demo innlogginger" og spiller-knapp
- [ ] Sentrer "DEMO spiller" tekst
- **Løsning:** Legg til `mb-4` på Text-komponenten (linje 181), endre til "DEMO Spiller"
- **Lokasjon:** Linjer 181-213

---

## 🟠 FASE 2: Dashboard Fixes (HØY PRIORITET)

### 2.1 Gjennomføringsgrad Text Color
**Fil:** Finn dashboard-komponenten som viser "Gjennomføringsgrad"
- [ ] Fiks farge på tekst i boks: Gjennomføringsgrad
- **Løsning:** Bruk `text-tier-navy` eller `text-tier-text-primary`
- **Søk:** `Gjennomføringsgrad`

### 2.2 Dashboard Labels
**Fil:** Dashboard-komponenten
- [ ] Fjern "Kommende økt - neste 7 dager"
- [ ] Endre "Nærspill" til "Naerspill"
- **Søk:** `Kommende økt`, `Nærspill`

### 2.3 Column Layout & Icons
**Fil:** Dashboard-komponenten
- [ ] Fiks bredden på kolonne til høyre
- [ ] Fikse ikoner over fordeling per kategori
- **Løsning:** Juster grid columns, erstatt ikoner med Lucide-ikoner

---

## 🟡 FASE 3: Sessions & Calendar (MEDIUM PRIORITET)

### 3.1 Mine Økter - Formatting
**Fil:** `apps/web/src/features/sessions/**`
- [ ] Stor forbokstav på alle økt beskrivelser
- [ ] Mellomrom mellom "Her ser vi oversikten" og søk funksjon
- **Løsning:** CSS `text-transform: capitalize`, legg til `mb-4` spacing

### 3.2 Calendar Layout
**Fil:** Kalender-komponenten
- [ ] Fyll kalender på hele bredden
- [ ] Fiks vertikale linjer mellom dager
- **Løsning:** `w-full`, `border-r border-tier-border-default`
- **Søk:** Calendar-komponenter

---

## 🟢 FASE 4: Global Header Changes (MEDIUM PRIORITET)

### 4.1 Rounded Corner Headers
**Filer:** Alle page headers i spiller og coach moduler
- [ ] Legg til runde kanter på header box på ALLE sider man kan trykke på
- **Løsning:** Legg til `rounded-[14px]` eller `rounded-2xl` på PageHeader
- **Filer:**
  - `apps/web/src/components/layout/PageHeader.tsx`
  - Alle dashboard/feature-sider

---

## 🔵 FASE 5: Navigation Reordering (LAV PRIORITET)

### 5.1 Training Menu Structure
**Fil:** Navigation config (finn med Glob)
- [ ] Reorder training menu items:
  ```
  Trening:
  - Mine økter
  - Min treningsplan

  Logg:
  - Logg treningsøkt
  - Treningstatistikk

  Teknisk plan:
  - Mine teknisk plan (Bevis)
  - Mine øvelser
  - Øvelsesbank
  - Video

  (resten som det er)
  ```
- **Søk:** navigation config, menu structure

---

## 🟣 FASE 6: Test Pages Styling (MEDIUM PRIORITET)

### 6.1 Test Colors & Logo
**Filer:** `apps/web/src/features/tests/**`
- [ ] Fiks farger og logo for test (der det står "zap")
- [ ] Knapp i bunn med farger skal fikses
- [ ] Dette skal fikses på ALLE tester
- **Løsning:** Erstatt Zap-ikon med relevant ikon, bruk TIER-farger

### 6.2 Scorecard Colors
**Filer:** Scorecard-komponenter i tests
- [ ] Fiks scorekortet med farger
- [ ] Dette skal fikses på ALLE tester
- **Løsning:** Bruk TIER color tokens

---

## 🟤 FASE 7: Settings & Permissions (HØY PRIORITET - NY FEATURE)

### 7.1 Sharing Permissions Feature
**Fil:** Settings/Varsler → Deling
- [ ] Endre "Varsler" til "Deling"
- [ ] Skjema for deling tillatelse til trener og medlemmer
- [ ] Kan huke av hvilke tilganger til ulike databaser som skal deles med hvem
- **Løsning:**
  1. Endre navigation label fra "Varsler" til "Deling"
  2. Opprett ny komponent: `apps/web/src/features/settings/SharingPermissions.tsx`
  3. Checkbox-form med kategorier:
     - Treningsøkter
     - Tester
     - Målsettinger
     - Turneringer
     - Video
  4. Select: Trener / Medlemmer

---

## 🎯 IMPLEMENTASJONSREKKEFØLGE

1. ✅ **Start:** Login page fixes (FASE 1) - Raskeste wins
2. ✅ **Dashboard:** Dashboard labels og farger (FASE 2)
3. ✅ **Sessions:** Økt-liste formatting (FASE 3.1)
4. ✅ **Calendar:** Full width + borders (FASE 3.2)
5. ✅ **Headers:** Global rounded corners (FASE 4)
6. ✅ **Tests:** Farger og ikoner (FASE 6)
7. ✅ **Navigation:** Reordering (FASE 5)
8. ✅ **Sharing:** Ny feature (FASE 7) - Mest kompleks

---

## 📁 KRITISKE FILER

```
Priority 1 (Start her):
- apps/web/src/features/auth/Login.tsx
- apps/web/src/features/dashboard/AKGolfDashboard*.{jsx,tsx}

Priority 2:
- apps/web/src/components/layout/PageHeader.tsx
- apps/web/src/features/sessions/**/*.{jsx,tsx}
- apps/web/src/features/tests/**/*.{jsx,tsx}

Priority 3:
- apps/web/src/config/navigation*.{ts,tsx}
- apps/web/src/features/settings/**/*.{jsx,tsx}
```

---

## ⏱️ ESTIMERT TID
- **FASE 1:** 15 min
- **FASE 2:** 30 min
- **FASE 3:** 45 min
- **FASE 4:** 60 min (mange filer)
- **FASE 5:** 20 min
- **FASE 6:** 45 min
- **FASE 7:** 90 min (ny feature)

**TOTALT:** ~5 timer

---

## ✅ SUCCESS CRITERIA

1. Alle farger bruker TIER tokens
2. Spacing er konsistent (4px increments)
3. Alle ikoner er fra Lucide
4. Navigation structure matcher spesifikasjonen
5. Sharing permissions feature er fullstendig implementert
6. Ingen inline styles eller hardkodede farger
7. All tekst har riktig capitalization
8. Calendaren fyller full bredde
9. Alle headers har rounded corners

---

**Status:** Klar for implementasjon
**Auto-godkjent:** Ja
**Start:** Nå
