# Implementasjonsplan - Endringer fra Endringer.md

Basert på `/Users/anderskristiansen/Developer/IUP_Master_V1/docs/Endringer.md`

---

## ✅ FERDIG (Allerede implementert)

### 1. Test Protokoller - SG Integrasjon ✅
- **Status:** ✅ FERDIG
- Test 8-11 endret til Approach tests (25m, 50m, 75m, 100m)
- Test 15-16 endret til Putting (3m, 6m)
- PEI til SG konvertering implementert
- Kategorikrav viser SG-data

### 2. DataGolf Sync ✅
- **Status:** ✅ FERDIG
- DataGolf API integrasjon fungerer
- Coach dashboard viser spillerstatistikk
- Pro player sammenligning implementert

### 3. Select Bug Fix ✅
- **Status:** ✅ FERDIG (nettopp fikset)
- Onboarding coach select hadde tom string value
- Endret til "none" og oppdatert submit-logikk

---

## 🔴 PRIORITET 1 - UI/UX Fikser (Kritisk for Demo)

### 1.1 Pyramide Terminologi
**Fil:** Flere komponenter som viser treningsområder
**Endring:**
- Endre alle treningsområde-navn til:
  - "Tee Total" (i stedet for "Long Game" / "Driver")
  - "Innspill 200+ m"
  - "Innspill 150-200 m"
  - "Innspill 100-150 m"
  - "Innspill 50-100 m"
  - "Nærspill"
  - "Putting"

**Filer å sjekke:**
- `apps/web/src/features/training/Treningsstatistikk.tsx`
- `apps/web/src/features/sessions/*`
- Alle komponenter som refererer til treningsområder

**Estimat:** 2-3 timer

---

### 1.2 Emoji Forbedringer
**Endring linje 17-22:**
- Endre til "riktige og relevante emojier" for treningsområder
- Legg til (?) ikon med tooltip forklaring
- Forklaring popper opp når man holder musepeker over

**Komponenter:**
- Dashboard widgets
- Treningsområde-visualisering

**Estimat:** 1-2 timer

---

### 1.3 Fjern Emojier fra Økter
**Endring linje 29-35:**
- Fjern hurtiglogg funksjon
- Gi forslag på standard økter i stedet
- Fjern emojier fra økt-visninger

**Fil:** `apps/web/src/features/sessions/SessionsListView.tsx`

**Estimat:** 1 time

---

### 1.4 Heading Konsistens
**Endring linje 195, 344, 356, 392:**
- Standardiser heading på ALLE sider
- Samme format og styling overalt
- Fikse runde kanter vs firekant

**Filer:** Alle feature-sider

**Estimat:** 3-4 timer

---

### 1.5 Kalender Visuell Forbedring
**Endring linje 62, 173-181:**
- Fiks størrelse på "Ons 7. jan" seksjon
- Fiks vertikale linjer og rammer
- Legg til uke/måned/år visning toggle

**Fil:** `apps/web/src/features/calendar/Kalender.tsx`

**Estimat:** 2-3 timer

---

### 1.6 Profil Avatar/Initialer
**Endring linje 74-82:**
- Fiks sirkel med initialer/bilde ved siden av spillernavn
- Fiks farger i card for informasjon, kontakt, golfprofil, trening

**Filer:**
- Player profile komponenter
- Coach athlete detail views

**Estimat:** 2 timer

---

### 1.7 Filter Knapp Bug
**Endring linje 187:**
- Når man trykker på filter knapp forsvinner fargen og knappen er ikke synlig
- Fiks synlighet og hover-states

**Fil:** Kalender eller annen side med filter

**Estimat:** 30 min

---

### 1.8 Dropdown Farger
**Endring linje 205:**
- Fiks farger i dropdown meny når man klikker

**Filer:** Alle Select komponenter

**Estimat:** 1 time

---

### 1.9 Test Navngiving
**Endring linje 231-265:**
Endre testnavn til:
- **Tee Total:** Driver
- **Innspill:** Golfslag basic - Gutt, Golfslag basic - Jenter, Golfslag - Bane, Wedge - Variasjon
- **Nærspill:** 8 ballstest
- **Putting:** 1-3 meter, Lengdekontroll

**Filer:**
- `apps/web/src/features/tests/config/testDefinitions.ts`
- `apps/api/prisma/seeds/tests.ts`

**Estimat:** 1-2 timer

---

### 1.10 Test Scorekort Styling
**Endring linje 268-279:**
- Fiks heading og farger på alle tester
- Fiks farger og heading for scorekort

**Filer:**
- Test result komponenter
- Test detail views

**Estimat:** 2 timer

---

### 1.11 Coach Stats Access
**Endring linje 300-322:**
- Fiks tilgangen til coach stats sider
- Spiller skal også ha "Min statistikk" i sidemeny
- Statistikk etter TRENINGSOMRÅDER med database lagring

**Dette krever ny feature - se Prioritet 2**

**Estimat:** N/A (stor feature)

---

## 🟡 PRIORITET 2 - Nye Features

### 2.1 Teknikkplan (Database Opprett)
**Endring linje 41-53:**
**Ny feature modul**

**Funksjonalitet:**
- Spillerens plan for teknisk utvikling
- Quick view av tekniske oppgaver fra trener (video + tekst)
- Import av Trackman analyse data:
  - Club path
  - Attack angle
  - Swing direction
  - Face to path
  - Dynamic loft
- Database lagring av økter
- Oversikt over snitt, forbedringspotensial

**Database schema:**
```prisma
model TechnicalPlan {
  id String @id @default(uuid())
  playerId String
  tasks TechnicalTask[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model TechnicalTask {
  id String @id @default(uuid())
  planId String
  title String
  description String
  videoUrl String?
  priority Int
  status String // pending, in_progress, completed
}

model TrackmanData {
  id String @id @default(uuid())
  playerId String
  sessionDate DateTime
  clubPath Float?
  attackAngle Float?
  swingDirection Float?
  faceToPath Float?
  dynamicLoft Float?
  notes String?
}
```

**Estimat:** 20-30 timer (stor feature)

---

### 2.2 Dagens Trening - Forbedret Øktplanlegging
**Endring linje 99-137:**
**Redesign av treningsøkt-modulen**

**Ny struktur:**
1. Kalendervisning av dagens dato
2. Økt med hover/klikk detaljer:
   - Dato
   - Tidspunkt
   - Varighet
3. Spiller/coach kan legge til øvelser/drills med:
   - Reps
   - Estimert tid
   - Fase
   - Treningsområde
   - Miljø
   - CS (?)
   - Belastning
4. Vurdering av fokus ved loggføring

**Database schema:**
```prisma
model SessionExercise {
  id String @id @default(uuid())
  sessionId String
  name String
  reps Int?
  estimatedMinutes Int?
  phase String?
  trainingArea String?
  environment String?
  cs String?
  load String?
  order Int
}

model SessionEvaluation {
  id String @id @default(uuid())
  sessionId String
  focusRating Int // 1-10
  notes String?
}
```

**Estimat:** 15-20 timer

---

### 2.3 Treningsstatistikk - Ny Visualisering
**Endring linje 145-169:**
**Redesign av statistikk-visning**

**Funksjonalitet:**
1. Legg til heading seksjon
2. Alle filter synlige (fysisk, teknikk etc.) - mindre og strukturert
3. Fjern "Siste økter"
4. Default visning: Pyramiden med timer og repetisjoner
5. Filterbar visning:
   - Velg: Teknikk → Fase 4 → Innspill 100m → Vis timer/reps
   - Sammenligning: Golf slag → Fase 4 → Innspill → Vis mot hverandre
6. Visuelt viktig - må se veldig bra ut

**Estimat:** 10-15 timer

---

### 2.4 Spiller Min Statistikk
**Endring linje 292-298:**
**Ny statistikk-modul for spillere**

**Funksjonalitet:**
- Spiller skal føre inn stats etter TRENINGSOMRÅDER
- Database lagring
- Visuell visning av progresjon og utvikling
- Arbeidsområder for å nå neste nivå

**Database schema:**
```prisma
model PlayerStats {
  id String @id @default(uuid())
  playerId String
  trainingArea String
  statType String
  value Float
  date DateTime
  notes String?
}
```

**Estimat:** 8-10 timer

---

### 2.5 Bevis Integrasjon i Teknisk Plan
**Endring linje 223:**
- Bevis skal integreres i teknisk plan
- Koble sammen med Teknikkplan feature (2.1)

**Estimat:** Inkludert i 2.1

---

## 🟢 PRIORITET 3 - Minor Fixes

### 3.1 "Aktivitet" til "Status"
**Endring linje 88:**
- Endre tekst fra "Aktivitet" til "Status"

**Estimat:** 5 min

---

### 3.2 Booking Bekreftelse Knapp
**Endring linje 372:**
- Fiks knapp øverst til høyre på booking bekreftelse

**Estimat:** 15 min

---

### 3.3 PGA Tour Default Hide
**Endring linje 394:**
- PGA tour og DP world skal ikke være synlig som default
- Skjul i coach stats view

**Estimat:** 15 min

---

### 3.4 Diverse "Fiks denne" (Screenshots uten kontekst)
**Endringer linje 304, 314, 322, 334, 384, 404:**
- Krever nærmere inspeksjon av screenshots for å forstå hva som skal fikses
- Kan være duplikater av andre issues

**Estimat:** Varierer - trenger klargjøring

---

## 📊 Estimert Totalarbeid

### Prioritet 1 (UI/UX Fikser):
- **Total:** ~18-22 timer
- **Kritisk for demo:** Ja
- **Kan deles opp:** Ja (små oppgaver)

### Prioritet 2 (Nye Features):
- **Total:** ~53-75 timer
- **Kritisk for demo:** Nei
- **Kompleksitet:** Høy (krever database schema, ny arkitektur)

### Prioritet 3 (Minor Fixes):
- **Total:** ~1-2 timer
- **Kritisk for demo:** Nei
- **Kan gjøres raskt:** Ja

---

## 🎯 Anbefalt Prioritering for Demo i Morgen

### Må fikses ASAP (før demo):
1. ✅ Select bug (FERDIG)
2. Pyramide terminologi (1.1) - 2-3t
3. Heading konsistens (1.4) - 3-4t
4. Test navngiving (1.9) - 1-2t
5. PGA Tour default hide (3.3) - 15 min

**Total før demo: ~7-10 timer**

### Kan vente til etter demo:
- Alle Prioritet 2 features (nye moduler)
- Mindre UI-tweaks (emoji, farger, etc.)
- Diverse "fiks denne" uten klar kontekst

---

## 📝 Neste Steg

1. **Før demo i morgen:**
   - Fokuser på de 5 punktene over
   - Test grundig med demo-brukerne
   - Verifiser at coach/spiller flows fungerer

2. **Etter demo:**
   - Prioriter Teknikkplan (2.1) hvis kunden viser interesse
   - Bygge ut Dagens Trening (2.2)
   - Implementere Spiller Min Statistikk (2.4)

3. **Langsiktig:**
   - Trackman integrasjon
   - Avansert statistikk og visualisering
   - Video upload og analyse

---

**Sist oppdatert:** 2026-01-06
