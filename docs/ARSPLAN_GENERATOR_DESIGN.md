# Årsplangenerator - Design Dokument

## Oversikt
Årsplangeneratoren er et verktøy for trenere å planlegge et helt treningsår for en spiller. Systemet støtter både mal-basert opprettelse og opprettelse fra bunnen av.

## Brukerflyt

### 1. Oppstart
```
Coach → Velger spiller → Åpner årsplangenerator
```

### 2. Valg av opprettelsesmodus
- **Fra mal**: Velg ferdig periodiseringsmal (Evaluering → Grunnperiode → Spesialisering → Turnering)
- **Fra scratch**: Start med tom årsplan og bygg selv

### 3. Hovedarbeidsflate
- **Timeline-visning**: Horisontalt årsoversikt (12 måneder)
- **Periode-blokker**: Drag-and-drop perioder på tidslinje
- **Økt-bibliotek**: Sidebar med økter, driller og øvelser
- **Detalj-panel**: Rediger valgt periode/økt

## Komponenter

### 1. AnnualPlanGenerator (Hovedside)
```
/coach/athletes/:playerId/annual-plan/create
```

**Seksjoner:**
- Header med spiller-info og lagreknapper
- Modus-velger (Template vs From Scratch)
- Template-galleriet (hvis template-modus)
- Arbeidsflate med timeline
- Sidebar med økt-bibliotek
- Detalj-panel for redigering

### 2. PeriodTimeline (Timeline-komponent)
**Funksjonalitet:**
- Viser 12 måneder horisontalt
- Drag-and-drop periode-blokker
- Zoom inn/ut (dag, uke, måned visning)
- Visuell indikator for periode-typer (E, G, S, T)

**Periode-typer:**
- **E (Evaluering)**: Lys blå - Testing og vurdering
- **G (Grunnperiode)**: Grønn - Grunnleggende ferdigheter
- **S (Spesialisering)**: Oransje - Fokusert trening
- **T (Turnering)**: Rød - Konkurranseperiode

### 3. SessionLibrary (Økt-bibliotek)
**Kategorier:**
- Fysisk (FYS) - Styrke, mobilitet, power
- Teknikk (TEK) - Sving, posisjoner, bevegelsesmønster
- Golfslag (SLAG) - Tee, innspill, kort spill, putting
- Spill (SPILL) - Bane, strategi
- Turnering (TURN) - Mental, press, konkurransetrening

**Funksjonalitet:**
- Søk og filtrer økter
- Drag økter til timeline
- Forhåndsvisning av økt-detaljer
- Favoritt-økter

### 4. PeriodDetailPanel (Detalj-panel)
**Innhold:**
- Periode-navn og beskrivelse
- Start- og sluttdato
- Mål for perioden
- Ukentlig treningsfrekvens
- Liste over økter i perioden
- Drag-and-drop omorganisering

### 5. TemplateSelectorModal (Mal-velger)
**Innhold:**
- Galleri av ferdige maler
- Forhåndsvisning av mal-struktur
- Beskrivelse av målgruppe
- "Bruk mal" knapp

## Datstrukturer

### AnnualPlan
```typescript
interface AnnualPlan {
  id: string;
  playerId: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  periods: Period[];
  createdBy: string;
  createdAt: string;
  lastModified: string;
}
```

### Period
```typescript
interface Period {
  id: string;
  type: 'E' | 'G' | 'S' | 'T';
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  weeklyFrequency: number; // Økter per uke
  goals: string[];
  sessions: PlannedSession[];
  color: string;
}
```

### PlannedSession
```typescript
interface PlannedSession {
  id: string;
  templateId?: string; // Reference til økt-mal
  name: string;
  category: 'fysisk' | 'teknikk' | 'slag' | 'spill' | 'turnering';
  akFormula?: string;
  duration: number; // minutter
  scheduledDate?: string; // Spesifikk dato (valgfritt)
  weekNumber?: number; // Eller bare ukenummer
  dayOfWeek?: number; // 0-6 (mandag-søndag)
  description?: string;
  drills: Drill[];
}
```

### Drill
```typescript
interface Drill {
  id: string;
  name: string;
  category: string;
  duration: number;
  description: string;
  equipment?: string[];
  reps?: number;
  sets?: number;
}
```

## Templates (Ferdige maler)

### 1. Junior Utviklingsplan (12-15 år)
**Fokus**: Grunnleggende ferdigheter og allsidig utvikling
```
E: 4 uker - Testing og kartlegging
G: 16 uker - Grunnferdigheter (teknikk, fysisk)
S: 12 uker - Spesialisering (slag, kort spill)
T: 8 uker - Turneringsforberedelse
E: 4 uker - Evaluering
G: 8 uker - Grunnperiode 2
```

### 2. Elitespiller Sesongplan
**Fokus**: Toppform til viktige turneringer
```
E: 2 uker - Preseason testing
G: 8 uker - Grunnlag (fysisk, teknikk)
S: 10 uker - Pre-competition (skarpe økter)
T: 12 uker - Competition season
G: 4 uker - Mid-season rebuild
T: 8 uker - Peak season (hovedturneringer)
E: 4 uker - Off-season evaluering
```

### 3. Rekreasjonsspiller (1-2 ganger/uke)
**Fokus**: Jevn fremgang, fleksibel struktur
```
G: 20 uker - Grunnferdigheter
S: 12 uker - Fokusområder
T: 8 uker - Sommersesongen
E: 4 uker - Evaluering
G: 8 uker - Vinter indoor-trening
```

## UI/UX Prinsipper

### Fargebruk (TIER Golf v3.0 Design System)
- **Periode E (Evaluering)**: `bg-category-tek-muted` (#8B6E9D/15)
- **Periode G (Grunnperiode)**: `bg-category-fys-muted` (#D97644/15)
- **Periode S (Spesialisering)**: `bg-category-slag-muted` (#4A8C7C/15)
- **Periode T (Turnering)**: `bg-category-turn-muted` (#C9A227/15)

### Interaksjon
- **Drag-and-drop**: @dnd-kit/core library
- **Smooth animasjoner**: Framer Motion
- **Touch-friendly**: Minimum 44px touch targets
- **Keyboard shortcuts**: Cmd/Ctrl + S (lagre), Esc (lukk panel)

### Responsivt design
- **Desktop**: Full timeline + sidebar + detalj-panel
- **Tablet**: Timeline + collapsible sidebar
- **Mobile**: Stack layout, swipe mellom visninger

## Teknisk implementering

### File struktur
```
apps/web/src/features/coach-annual-plan/
├── AnnualPlanGenerator.tsx          # Hovedside
├── components/
│   ├── TemplateSelectorModal.tsx    # Mal-velger
│   ├── PeriodTimeline.tsx            # Timeline med drag-drop
│   ├── SessionLibrary.tsx            # Økt-bibliotek sidebar
│   ├── PeriodDetailPanel.tsx         # Detalj-panel
│   ├── PeriodBlock.tsx               # Draggable periode-blokk
│   ├── SessionCard.tsx               # Draggable økt-kort
│   └── TimelineHeader.tsx            # Måned/uke navigasjon
├── hooks/
│   ├── useAnnualPlan.ts              # State management
│   ├── useDragAndDrop.ts             # Drag-drop logic
│   └── useTemplates.ts               # Template data
├── templates/
│   └── periodization-templates.ts    # Ferdige maler
└── types.ts                          # TypeScript types
```

### API Endpoints (forventet)
```
POST   /api/v1/annual-plans          # Opprett årsplan
GET    /api/v1/annual-plans/:id      # Hent årsplan
PUT    /api/v1/annual-plans/:id      # Oppdater årsplan
DELETE /api/v1/annual-plans/:id      # Slett årsplan
GET    /api/v1/templates/annual      # Hent maler
GET    /api/v1/session-templates     # Hent økt-maler
```

## Prioritet for implementering

### Fase 1 (MVP)
1. ✅ Hovedside med header og layout
2. ✅ Template-velger modal
3. ✅ Grunnleggende timeline-visning
4. ✅ Periode-blokker (statiske først)
5. ✅ Sidebar med økt-kategorier

### Fase 2 (Interaktivitet)
6. Drag-and-drop periode-blokker
7. Drag-and-drop økter fra sidebar
8. Detalj-panel for redigering
9. Lagre til database

### Fase 3 (Avansert)
10. Zoom-funksjonalitet (dag/uke/måned)
11. Export til PDF/Excel
12. Kopi fra forrige år
13. Del mal med andre trenere
14. AI-forslag basert på spillerprofil

## Neste steg
1. Implementer hovedside layout (AnnualPlanGenerator.tsx)
2. Lag template-selector modal
3. Bygg timeline-komponent med periode-visning
4. Implementer økt-bibliotek sidebar
5. Integrer drag-and-drop funksjonalitet
