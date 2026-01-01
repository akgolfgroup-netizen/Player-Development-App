# Beslutningsmotor - Skjerm-for-skjerm spesifikasjon

**Status:** Implementert
**Versjon:** 1.0
**Sist oppdatert:** 2024-12-30
**Fil:** `apps/web/src/features/dashboard/AKGolfDashboardV3.jsx`

---

## 1. Oversikt

Hjemskjermen er redesignet som en **beslutningsmotor** i stedet for et kontrollpanel. Målet er å redusere kognitiv friksjon og øke handlingsutløsning.

### Designprinsipper (ikke-forhandlingsbart)
1. **Én prioritet om gangen** - ukens fokus dominerer
2. **Én primær CTA** - alltid konkret, alltid anbefalt
3. **Statistikk er sekundær** - under handling, aldri over

---

## 2. Skjermstruktur

```
┌─────────────────────────────────────┐
│  ZONE A: Kontroll & Fokus           │
│  ┌─────────────────────────────────┐│
│  │ Velkomst (navn, kategori)       ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ FocusCard (Ukens fokus)         ││
│  │ • Fokusområde med badge         ││
│  │ • Progresjon: x av 4 økter      ││
│  │ • Konfidensnivå                 ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ ContextualCTA (Primær handling) ││
│  │ "Start anbefalt økt"            ││
│  │ 30 min · Putting · Ukens fokus  ││
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│  ZONE B: Progresjon (kompakt)       │
│  ┌─────────────────────────────────┐│
│  │ ProgressStrip                   ││
│  │ Økter: ████░░ 4/12              ││
│  │ Timer: ██░░░░ 8/20t   🔥 3 dager││
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│  ZONE C: Oppfølging & Signaler      │
│  ┌─────────────────────────────────┐│
│  │ Dagens oppgaver (maks 3)        ││
│  │ ☑ Oppgave 1                     ││
│  │ ☐ Oppgave 2                     ││
│  │ ☐ Oppgave 3        +2 mer →     ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ Varslinger (maks 2)             ││
│  │ • Varsling 1                    ││
│  │ • Varsling 2        Se alle →   ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

## 3. Komponentspesifikasjoner

### 3.1 FocusCard

**Fil:** `AKGolfDashboardV3.jsx` linje 50-164

**Formål:** Vise spillerens anbefalte fokusområde for uken.

**Datakilde:** `/api/v1/focus-engine/me/focus`

**States:**

| State | Visuell | Handling |
|-------|---------|----------|
| Loading | Pulserende placeholder | Vent |
| No data | "Start din første økt" | Oppfordre til handling |
| With focus | Fokusområde + progresjon | Vis anbefaling |

**Props:**
```javascript
{
  focus: {
    focusComponent: 'OTT' | 'APP' | 'ARG' | 'PUTT',
    approachWeakestBucket: string | null,
    reasonCodes: string[],
    confidence: 'low' | 'med' | 'high',
    sessionsCompleted: number,  // Default: 0
    sessionsTarget: number,     // Default: 4
  },
  loading: boolean,
  onStartSession: () => void
}
```

**Fargekoding:**
| Komponent | Farge |
|-----------|-------|
| OTT (Utslag) | `var(--info)` blå |
| APP (Innspill) | `var(--success)` grønn |
| ARG (Kortspill) | `var(--warning)` gul |
| PUTT (Putting) | `var(--ak-accent-purple)` lilla |

**Konfidensbadge:**
| Nivå | Tekst | Farge |
|------|-------|-------|
| high | "Sikker anbefaling" | Grønn |
| med | "Moderat sikkerhet" | Gul |
| low | "Begrenset data" | Grå |

---

### 3.2 ContextualCTA

**Fil:** `AKGolfDashboardV3.jsx` linje 175-252

**Formål:** Gi én tydelig handling som alltid er relevant.

**Prioriteringslogikk:**

```
1. Planlagt økt fra kalender?
   → "Start planlagt økt" + øktinfo

2. Fokusdata tilgjengelig?
   → "Start anbefalt økt" + fokusinfo

3. Fallback (ingen data)
   → "Start 15 min økt" + lavterskel-tekst
```

**States:**

| Prioritet | Tittel | Subtekst |
|-----------|--------|----------|
| 1: Planlagt | "Start planlagt økt" | "{duration} min · {title}" |
| 2: Fokus | "Start anbefalt økt" | "{duration} min · {fokusområde} · Del av ukens fokus" |
| 3: Fallback | "Start 15 min økt" | "Lavterskel · Kom i gang med trening i dag" |

**Navigasjon ved klikk:**
```javascript
if (session.id)           → /session/{id}/active
else if (session.type === 'focus') → /session/new (med fokus-state)
else                      → /session/new (quickStart: true, duration: 15)
```

**Visuell design:**
- Blå bakgrunn (`var(--ak-primary)`)
- Hvit tekst
- Play-ikon til venstre
- Chevron-pil til høyre
- Box-shadow for dybde

---

### 3.3 ProgressStrip

**Fil:** `AKGolfDashboardV3.jsx` linje 254-327

**Formål:** Vise progresjon kompakt, uten å dominere skjermen.

**"Ingen 0-shaming" regel:**
```javascript
if (sessions.completed === 0 && hours.current === 0) {
  return "Start uken med din første økt"  // Motiverende, ikke tallbasert
}
```

**Normal visning:**
```
┌──────────────────────────────────────────┐
│ Økter  4/12 ████████░░░░  │ Timer 8/20t ████░░░░░░  │ 🔥 3 dager │
└──────────────────────────────────────────┘
```

**Visuell vekt:**
- Økter og timer: Normal vekt
- Streak: Lav visuell vekt, kun vist når > 0

---

### 3.4 TasksList (Dagens oppgaver)

**Fil:** `AKGolfDashboardV3.jsx` linje 429-494

**Formål:** Vise maks 3 oppgaver med direkte avhuking.

**Begrensninger:**
- Maks 3 oppgaver vises
- "+X mer" knapp vises hvis flere enn 3

**Interaksjon:**
- Klikk på oppgave → Toggle fullført-status
- Visuell feedback: Grønn bakgrunn + gjennomstreking

**Footer:**
- Viser "{completed} av {min(total, 3)} fullført"

---

### 3.5 NotificationsList

**Fil:** `AKGolfDashboardV3.jsx` linje 497-541

**Formål:** Vise topp 2 varslinger med lav prioritet.

**Begrensninger:**
- Maks 2 varslinger vises
- "Se alle" knapp kun hvis flere enn 2

---

## 4. Business Rules

### 4.1 Fokusvalg (Focus Engine)

**API:** `GET /api/v1/focus-engine/me/focus`

**Prioritering:**
1. Trener har satt fokus → Bruk det
2. Ingen trenerfokus → Beregn basert på testresultater
3. Ingen testdata → Fallback til "Start din første økt"

**Beregningslogikk (forenklet):**
```
1. Hent spillerens testresultater
2. Beregn persentiler per komponent (OTT, APP, ARG, PUTT)
3. Vekt mot pro-data komponentvekter
4. Laveste vektede score = fokusområde
```

### 4.2 Øktanbefaling

**Prioritering:**
1. Planlagt økt i kalender (neste 24 timer)
2. Anbefalt økt basert på fokus (30 min default)
3. Lavterskel økt (15 min)

### 4.3 Ingen 0-shaming

**Regel:** Før første aktivitet i uken, vis motiverende tekst i stedet for "0/12".

**Implementasjon:**
```javascript
if (sessions.completed === 0 && hours.current === 0) {
  return <EncouragementMessage />
}
```

---

## 5. Kill List (Fjernet fra hjemskjermen)

| Element | Status | Flyttet til |
|---------|--------|-------------|
| Store KPI-blokker (0/20t, 0/12) | ❌ Fjernet | Erstattet av ProgressStrip |
| NextMilestone (Neste test om X dager) | ❌ Fjernet | /testing |
| QuickStats (store tall) | ❌ Fjernet | Erstattet av ProgressStrip |
| "Se alle" som standard-CTA | ❌ Nedprioritert | Kun vist ved behov |

---

## 6. Edge Cases

### 6.1 Ny bruker (ingen data)
- FocusCard: "Start din første økt"
- ContextualCTA: "Start 15 min økt"
- ProgressStrip: "Start uken med din første økt"
- TasksList: "Ingen oppgaver i dag"
- Notifications: "Ingen nye varslinger"

### 6.2 API-feil
- FocusCard: Viser ikke (graceful degradation)
- ContextualCTA: Fallback til 15 min økt
- ProgressStrip: Viser 0-verdier (ikke 0-shaming tekst ved feil)

### 6.3 Fullført uke
- FocusCard: Status "Fullført" badge
- ContextualCTA: Fortsatt vis anbefaling (neste fokus)
- ProgressStrip: Fulle progress bars

---

## 7. Tekniske avhengigheter

### Frontend
- `useFocus` hook (`apps/web/src/hooks/useFocus.js`)
- `useDashboard` hook (eksisterende)

### Backend
- Focus Engine: `/api/v1/focus-engine/me/focus`
- Dashboard API: `/api/v1/dashboard`

### CSS Variables brukt
```css
--card, --border-subtle, --bg-tertiary
--text-primary, --text-secondary, --text-tertiary
--accent, --info, --success, --warning
--ak-primary, --ak-accent-purple
```

---

## 8. Metrikker for suksess

| Metrikk | Baseline | Mål |
|---------|----------|-----|
| Øktstart per app-åpning | TBD | +20% |
| Tid til første handling | TBD | -30% |
| Oppgavefullføring per uke | TBD | +15% |
| 7-dagers retention | TBD | +10% |

---

## 9. Fremtidige forbedringer

1. **Mikroøkt fra oppgave** - Start oppgave som egen økt
2. **Kalenderintegrasjon** - Hent planlagte økter
3. **A/B-testing** - Toggle mellom gammelt og nytt dashboard
4. **Event tracking** - Instrumentere alle handlinger
