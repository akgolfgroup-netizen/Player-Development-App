# HVA SKAL JEG GJØRE NÅ?
> **Enkel guide for hva som er neste steg**
> **Oppdatert:** 15. desember 2025

---

## 🎯 AKKURAT NÅ: FASE 1 - FYLLE DATABASE

### Hvorfor?
Appen er visuelt ferdig (18 skjermer), men mangler innhold. Nå må vi fylle databasen med:
- 300+ øvelser
- 150 treningsøkter
- 88 ukemaler

**Uten dette kan ikke appen brukes i produksjon.**

---

## 📋 DENNE UKEN (Uke 51: 16-22 desember)

### DAG 1-2: Øvelser - Teknikk (100 stk)
```
Oppgave: Lage 100 teknikk-øvelser
Format: JSON eller direkte i database
```

**Mal per øvelse:**
```json
{
  "name": "Driver Teknikk - Innside-ut Path",
  "type": "teknikk",
  "category": "driver",
  "level": "L3",
  "duration": 30,
  "setting": "S2",
  "clubspeed": "CS60",
  "description": "Fokus på innside-ut swing path...",
  "instructions": [
    "1. Plasser stikker 45° inn mot ballen",
    "2. 10 sving uten ball, fokus på path",
    "3. 20 slag med ball, sjekk path på video"
  ],
  "equipment": ["Driver", "Alignment sticks", "TrackMan"],
  "reps": "3 sett × 10 reps",
  "videoUrl": "https://...",
  "progressionVariants": ["L4: Samme på banen", "L5: Under press"]
}
```

**Hvor legge data?**
- Option 1: `Data/exercises/teknikk.json`
- Option 2: Kjør SQL insert-script
- Option 3: Bruk API endpoint (POST /api/exercises)

---

### DAG 3-4: Øvelser - Shortgame + Putting (100 stk)
```
Oppgave: Lage 100 shortgame/putting-øvelser
```

**Fordeling:**
- 50 shortgame-øvelser (pitch, chip, bunker, flop, lob)
- 50 putting-øvelser (lag, lesing, press, variasjon)

**Samme format som teknikk-øvelser.**

---

### DAG 5: Øvelser - Fysisk + Mental (100 stk)
```
Oppgave: Lage 100 fysisk/mental-øvelser
```

**Fordeling:**
- 60 fysiske øvelser (styrke, mobilitet, eksplosivitet, rotasjon)
- 40 mentale øvelser (fokus, rutiner, visualisering, press)

**Samme format som teknikk-øvelser.**

---

## 📋 NESTE UKE (Uke 52: 23-29 desember)

### DAG 1-2: Treningsøkter - Kategori A-D (50 stk)
```
Oppgave: Lage 50 treningsøkter for kategori A-D
```

**Mal per treningsøkt:**
```json
{
  "name": "Driver Teknikk - Grunnleggende",
  "categories": ["D", "E", "F"],
  "type": "teknikk",
  "period": ["grunn", "spesialisering"],
  "duration": 90,
  "level": "L2",
  "setting": "S2",
  "clubspeed": "CS60",
  "focus": ["teknisk", "driver"],
  "description": "Grunnleggende driver-teknikk med fokus på path og face control",
  "exercises": [
    {
      "exerciseId": 1,
      "order": 1,
      "sets": 3,
      "reps": 10,
      "duration": 20
    },
    {
      "exerciseId": 5,
      "order": 2,
      "sets": 2,
      "reps": 15,
      "duration": 15
    }
  ],
  "goals": "Forbedre path consistency",
  "evaluation": "Mål path på TrackMan, mål: 0-2° innside-ut"
}
```

---

### DAG 3-4: Treningsøkter - Kategori E-K (100 stk)
```
Oppgave: Lage 100 treningsøkter for kategori E-K
```

**Samme format som kategori A-D.**

**Fordeling:**
- Kategori E-F: 30 økter
- Kategori G-H: 35 økter
- Kategori I-K: 35 økter

---

### DAG 5: Ukemaler (88 stk)
```
Oppgave: Lage 88 ukemaler
```

**Fordeling:**
- 11 kategorier (A-K)
- 4 perioder (E, G, S, T)
- 2 varianter (standard, intensiv)
= 11 × 4 × 2 = 88 templates

**Mal per ukemal:**
```json
{
  "name": "Kategori D - Grunnperiode - Standard",
  "category": "D",
  "period": "grunn",
  "variant": "standard",
  "totalHours": 12,
  "schedule": {
    "monday": { "sessionIds": [1, 5], "totalMinutes": 120 },
    "tuesday": { "sessionIds": [12], "totalMinutes": 90 },
    "wednesday": { "sessionIds": [18, 22], "totalMinutes": 150 },
    "thursday": { "rest": true },
    "friday": { "sessionIds": [30], "totalMinutes": 60 },
    "saturday": { "sessionIds": [45, 48], "totalMinutes": 180 },
    "sunday": { "rest": true }
  },
  "distribution": {
    "teknikk": 40,
    "fysisk": 30,
    "shortgame": 20,
    "mental": 10
  },
  "notes": "Fokus på teknisk grunnlag og fysisk oppbygging"
}
```

---

## ⚙️ HVORDAN LEGGE TIL DATA?

### Metode 1: JSON-filer (enklest for nå)
```bash
# Lag filer i Data-mappen
Data/
  exercises/
    teknikk.json        # 100 øvelser
    shortgame.json      # 50 øvelser
    putting.json        # 50 øvelser
    fysisk.json         # 60 øvelser
    mental.json         # 40 øvelser
  sessions/
    kategori-a-d.json   # 50 økter
    kategori-e-k.json   # 100 økter
  week-plans/
    templates.json      # 88 ukemaler
```

### Metode 2: SQL-script
```bash
# Lag SQL-fil
database/seed-exercises.sql

# Kjør
npm run db:seed
```

### Metode 3: Bruk API (krever backend kjører)
```bash
# Start backend
cd backend
npm run dev

# POST data via script eller Postman
node scripts/seed-exercises.js
```

---

## 🚀 ETTER FASE 1 (Fra uke 1, 2026)

### Neste steg blir:
1. **Koble frontend til backend** - Alle 18 skjermer må hente data fra API
2. **Implementere test-system** - Digital registrering av alle 20 tester
3. **Smarte funksjoner** - Automatisk treningsplan-generering
4. **Testing med reelle brukere** - Beta-testing med 3-5 spillere
5. **Produksjonsdeploy** - Lansering av appen

---

## 📞 TRENGER DU HJELP?

### Spørsmål å stille:
1. "Hva er struktur for øvelsesdata?" → Se mal ovenfor
2. "Hvordan koble frontend til backend?" → Venter til Fase 2
3. "Hvor mange øvelser må jeg lage?" → 300 totalt
4. "Kan jeg bruke AI til å generere innhold?" → Ja, men valider manuelt

### Kommandoer å bruke:
```bash
# Kjør status-oppdatering
node scripts/update-status.js

# Start backend (for testing)
cd backend && npm run dev

# Start frontend (for testing)
cd frontend && npm start

# Kjør database seed
npm run db:seed
```

---

## ✅ SUKSESS-KRITERIER

### Du er ferdig med Fase 1 når:
- [ ] 300+ øvelser finnes i database/JSON
- [ ] 150+ treningsøkter finnes i database/JSON
- [ ] 88 ukemaler finnes i database/JSON
- [ ] Alle øvelser har:
  - Navn, beskrivelse, instruksjoner
  - Type, kategori, L-fase, Setting
  - Varighet, repetisjon
- [ ] Alle økter har:
  - Navn, beskrivelse, evaluering
  - Lenker til øvelser
  - Kategori, periode, varighet
- [ ] Alle ukemaler har:
  - Kategori, periode, variant
  - 7-dagers oppsett
  - Lenker til økter

---

## 🎉 MOTIVASJON

```
Progresjon:
[████████████████░░░░░░░░] 55%

Ferdigstillelse:
[░░░░░░░░░░░░░░░░░░░░░░░░] Mars 2026
    ↑
  Du er her!
```

**Du har allerede bygget 85% av frontend!**
**Nå er det bare å fylle den med innhold!**

---

**Lykke til! 🚀⛳**
