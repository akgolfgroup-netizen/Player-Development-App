# OPPRYDDINGSPLAN - DOKUMENTASJON
> **Opprettet:** 15. desember 2025, 14:10
> **Formål:** Rydde, sammenslå og automatisere dokumentasjon

---

## 📋 SITUASJONSANALYSE

### Nåværende struktur (KAOS!)

```
Root/
├── README.md                        # ❌ Feil prosjekt (Coaching Platform)
├── BUILD_COMPLETE.md                # 🟡 Kan sammenslås
├── QUICKSTART.md                    # 🟡 Duplikat av QUICK_START.md
├── QUICK_START.md                   # 🟡 Duplikat
├── USER_GUIDE.md                    # 🟡 Kan sammenslås
├── OVERNIGHT_BUILD_SUMMARY.md       # ❌ Historisk, arkiver
└── OPPRYDDINGSPLAN.md               # ❌ Gammel plan, arkiver

Docs/
├── ARCHITECTURE.md                  # ✅ Behold
├── DESIGN_SYSTEM_SETUP.md           # ✅ Behold
├── HVA_SKAL_JEG_GJORE_NA.md        # ✅ PRIMÆR - Behold
├── STATUS_DASHBOARD.md              # ✅ PRIMÆR - Behold
├── UTVIKLINGSPLAN.md                # 🟡 Gammel versjon
└── UTVIKLINGSPLAN_KOMPLETT.md       # ✅ PRIMÆR - NY versjon

Docs/reference/
├── MASTER_PROSJEKTDOKUMENT.md       # ✅ PRIMÆR - Flytt til Docs/
├── APP_STATUS.md                    # 🟡 Sammenslå med STATUS_DASHBOARD
├── IUP_SKJERM_OVERSIKT.md          # ✅ Behold
├── KATEGORI_OG_TRENINGSSYSTEM...   # ✅ Behold (referanse)
├── API_ROUTES_IMPLEMENTATION...     # ✅ Behold
├── BACKEND_FOUNDATION_COMPLETE      # ✅ Behold
├── DESIGN_SYSTEM_COMPLETE           # 🟡 Duplikat, slett
├── DESIGN_SYSTEM_GUIDE              # 🟡 Duplikat, slett
├── DESIGN_SYSTEM_OPPDATERING        # ❌ Historisk, arkiver
├── DESIGN_MIGRATION_GUIDE           # ❌ Historisk, arkiver
├── [10+ andre guider]               # 🟡 Evaluer en og en

Docs/reference/notion_original/
└── [5 filer]                        # ✅ Behold (original-data)
```

---

## 🎯 MÅL MED OPPRYDDINGEN

### Oppnå denne strukturen:

```
Root/
├── README.md                        # NY - IUP prosjektoversikt
└── QUICKSTART.md                    # NY - Sammenslått

Docs/
├── 00_MASTER_PROSJEKTDOKUMENT.md   # PRIMÆR - Komplett referanse
├── 01_STATUS_DASHBOARD.md          # PRIMÆR - Live status
├── 02_UTVIKLINGSPLAN_KOMPLETT.md   # PRIMÆR - Detaljert plan
├── 03_HVA_SKAL_JEG_GJORE_NA.md    # PRIMÆR - Daglig actionplan
├── 04_ARCHITECTURE.md              # Teknisk arkitektur
├── 05_DESIGN_SYSTEM_SETUP.md       # Design system
│
├── reference/                       # Teknisk referanse
│   ├── api/
│   │   ├── API_ROUTES_COMPLETE.md
│   │   └── BACKEND_FOUNDATION.md
│   ├── design/
│   │   └── IUP_SKJERM_OVERSIKT.md
│   ├── kategori/
│   │   ├── KATEGORI_SYSTEM_KOMPLETT.md
│   │   └── AK_FORMEL_ANALYSE.md
│   └── notion_original/
│       └── [5 original filer]
│
└── archive/                         # Historiske dokumenter
    ├── 2025-12-14/
    │   ├── OVERNIGHT_BUILD_SUMMARY.md
    │   ├── OPPRYDDINGSPLAN.md
    │   ├── BUILD_COMPLETE.md
    │   └── [gamle guider]
    └── README.md                    # Forklarer arkiv
```

---

## 📅 OPPRYDDINGSPLAN (Trinn-for-trinn)

### FASE 1: RYDDE ROOT (15 min)

#### Steg 1.1: Lag ny README.md
```bash
# Backup gammel
mv README.md Docs/archive/2025-12-14/README_OLD.md

# Lag ny (se template under)
```

#### Steg 1.2: Sammenslå quickstart-filer
```bash
# QUICKSTART.md og QUICK_START.md til én fil
# Behold beste innhold fra begge
```

#### Steg 1.3: Arkiver historiske filer
```bash
mkdir -p Docs/archive/2025-12-14
mv BUILD_COMPLETE.md Docs/archive/2025-12-14/
mv OVERNIGHT_BUILD_SUMMARY.md Docs/archive/2025-12-14/
mv OPPRYDDINGSPLAN.md Docs/archive/2025-12-14/
mv USER_GUIDE.md Docs/archive/2025-12-14/
```

---

### FASE 2: RYDDE DOCS/ (20 min)

#### Steg 2.1: Nummerér primære dokumenter
```bash
cd Docs

# Gi prioritert rekkefølge
mv MASTER_PROSJEKTDOKUMENT.md 00_MASTER_PROSJEKTDOKUMENT.md
mv STATUS_DASHBOARD.md 01_STATUS_DASHBOARD.md
mv UTVIKLINGSPLAN_KOMPLETT.md 02_UTVIKLINGSPLAN_KOMPLETT.md
mv HVA_SKAL_JEG_GJORE_NA.md 03_HVA_SKAL_JEG_GJORE_NA.md
mv ARCHITECTURE.md 04_ARCHITECTURE.md
mv DESIGN_SYSTEM_SETUP.md 05_DESIGN_SYSTEM_SETUP.md
```

#### Steg 2.2: Slett gammel utviklingsplan
```bash
# Eller arkiver hvis du vil beholde
mv UTVIKLINGSPLAN.md archive/2025-12-14/UTVIKLINGSPLAN_OLD.md
```

---

### FASE 3: RYDDE DOCS/REFERENCE/ (30 min)

#### Steg 3.1: Flytt MASTER_PROSJEKTDOKUMENT
```bash
mv reference/MASTER_PROSJEKTDOKUMENT.md ./00_MASTER_PROSJEKTDOKUMENT.md
```

#### Steg 3.2: Sammenslå APP_STATUS med STATUS_DASHBOARD
```bash
# Manuelt: Se beste innhold fra begge
# Oppdater STATUS_DASHBOARD.md
# Slett APP_STATUS.md
```

#### Steg 3.3: Organiser i undermapper
```bash
cd reference

# Lag strukturerte mapper
mkdir -p api design kategori archive

# Flytt API-dokumenter
mv API_ROUTES_IMPLEMENTATION_COMPLETE.md api/API_ROUTES_COMPLETE.md
mv BACKEND_FOUNDATION_COMPLETE.md api/BACKEND_FOUNDATION.md
mv BACKEND_SETUP_GUIDE.md api/BACKEND_SETUP.md

# Flytt design-dokumenter
mv IUP_SKJERM_OVERSIKT.md design/
mv DESIGN_SYSTEM_COMPLETE.md archive/  # Duplikat
mv DESIGN_SYSTEM_GUIDE.md archive/     # Duplikat
mv DESIGN_SYSTEM_OPPDATERING.md archive/
mv DESIGN_MIGRATION_GUIDE.md archive/

# Flytt kategori-dokumenter
mv KATEGORI_OG_TRENINGSSYSTEM_KOMPLETT.md kategori/KATEGORI_SYSTEM_KOMPLETT.md
mv AK_FORMEL_STRUKTUR_ANALYSE.md kategori/AK_FORMEL_ANALYSE.md
mv KATEGORI_SYSTEM_AUDIT.md kategori/
mv KATEGORI_SYSTEM_KOMPARATIV_AUDIT.md kategori/
mv QA_RAPPORT_KATEGORI_SYSTEM.md kategori/
mv AK_GOLF_KATEGORI_HIERARKI_v2.0.md kategori/

# Arkiver historiske guider
mv APP_IMPLEMENTERING_PLAN.md archive/
mv REACT_NATIVE_CONVERSION_GUIDE.md archive/
mv ARBEIDSFLYT_GUIDE.md archive/
mv CLAUDE_PROJECT_*.md archive/
```

---

## 📝 TEMPLATES

### Template: Root README.md
```markdown
# TIER Golf - IUP System

**Individuell Utviklingsplan for golfspillere**

## Oversikt

Dette prosjektet er et komplett system for individualisert treningsplanlegging for golfspillere, utviklet av TIER Golf i samarbeid med Team Norway Golf.

### Prosjektstatus

- ✅ Frontend: 18 skjermer ferdigstilt
- ✅ Backend: 11 API-ruter
- ✅ Design System v2.1 komplett
- 🔴 Database: Venter på innhold (300+ øvelser)

Se [STATUS_DASHBOARD.md](Docs/01_STATUS_DASHBOARD.md) for live status.

## Hurtigstart

\`\`\`bash
# Backend
cd backend
npm install
npm run dev

# Frontend (kommer)
cd frontend
npm install
npm start
\`\`\`

## Dokumentasjon

### Primær dokumentasjon
1. [Master-prosjektdokument](Docs/00_MASTER_PROSJEKTDOKUMENT.md) - Komplett oversikt
2. [Status Dashboard](Docs/01_STATUS_DASHBOARD.md) - Live progresjon
3. [Utviklingsplan](Docs/02_UTVIKLINGSPLAN_KOMPLETT.md) - Detaljert plan
4. [Hva skal jeg gjøre nå?](Docs/03_HVA_SKAL_JEG_GJORE_NA.md) - Daglig actionplan

### Teknisk dokumentasjon
- [Arkitektur](Docs/04_ARCHITECTURE.md)
- [Design System](Docs/05_DESIGN_SYSTEM_SETUP.md)
- [API Routes](Docs/reference/api/API_ROUTES_COMPLETE.md)
- [Backend Foundation](Docs/reference/api/BACKEND_FOUNDATION.md)

## Teknologi

- **Frontend:** React Native (planlagt)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Design:** Tailwind CSS + Blue Palette 01 v2.1

## Team

- **Utvikler:** Anders Kristiansen
- **Partnere:** TIER Golf, Team Norway Golf

## Lisens

Private - TIER Golf © 2025
\`\`\`

---

### Template: QUICKSTART.md (sammenslått)
```markdown
# IUP System - Quickstart Guide

## For utviklere

### 1. Klone og installer
\`\`\`bash
git clone [repo]
cd IUP_Master_V1
npm install
\`\`\`

### 2. Start backend
\`\`\`bash
cd backend
cp .env.example .env
# Rediger .env med dine verdier
npm run dev
\`\`\`

Backend kjører på: http://localhost:3000

### 3. Test API
\`\`\`bash
curl http://localhost:3000/api/players
\`\`\`

### 4. Neste steg
- Les [Hva skal jeg gjøre nå?](Docs/03_HVA_SKAL_JEG_GJORE_NA.md)
- Følg [Utviklingsplan](Docs/02_UTVIKLINGSPLAN_KOMPLETT.md)

## For brukere

(Kommer når frontend er klar)
\`\`\`

---

## 🤖 AUTOMATISK OPPDATERING

### Oppdater update-status.js

Legg til i scriptet:

```javascript
// Oppdater 01_STATUS_DASHBOARD.md (ikke STATUS_DASHBOARD.md)
const statusFile = path.join(__dirname, '../Docs/01_STATUS_DASHBOARD.md');

// Oppdater 02_UTVIKLINGSPLAN_KOMPLETT.md
const planFile = path.join(__dirname, '../Docs/02_UTVIKLINGSPLAN_KOMPLETT.md');

// Legg til siste oppdatert i 00_MASTER_PROSJEKTDOKUMENT.md
const masterFile = path.join(__dirname, '../Docs/00_MASTER_PROSJEKTDOKUMENT.md');
```

---

## 🔄 VEDLIKEHOLDSRUTINER

### Daglig (automatisk via script)
- ✅ Oppdater STATUS_DASHBOARD med ny progresjon
- ✅ Oppdater UTVIKLINGSPLAN_KOMPLETT med status
- ✅ Oppdater MASTER_PROSJEKTDOKUMENT timestamp

### Ukentlig (manuelt)
- 📊 Gjennomgå HVA_SKAL_JEG_GJORE_NA og oppdater neste ukes plan
- 📁 Arkiver ferdige tasks fra UTVIKLINGSPLAN_KOMPLETT

### Månedlig (manuelt)
- 🗂️ Gjennomgå archive/ og fjern unødvendige filer
- 📚 Oppdater MASTER_PROSJEKTDOKUMENT med nye insights
- 🎯 Revidér mål og milepæler

---

## 📊 SAMMENLIGNING AV DOKUMENTER

### Dokumenter å sammenslå:

#### 1. STATUS_DASHBOARD vs APP_STATUS
**STATUS_DASHBOARD.md** (Behold)
- ✅ Auto-oppdateres
- ✅ Progresjonsbars
- ✅ Live statistikk

**APP_STATUS.md** (Slett/sammenslå)
- 🟡 Statisk liste
- 🟡 Ingen progresjon
- 🟡 Mindre detaljert

**Aksjon:** Kopier unikt innhold fra APP_STATUS → STATUS_DASHBOARD, deretter slett APP_STATUS

---

#### 2. UTVIKLINGSPLAN vs UTVIKLINGSPLAN_KOMPLETT
**UTVIKLINGSPLAN.md** (Slett)
- ❌ Gammel versjon
- ❌ Annen struktur (Fastify-fokus)
- ❌ Ikke samme prosjekt?

**UTVIKLINGSPLAN_KOMPLETT.md** (Behold)
- ✅ NY versjon (15. des)
- ✅ Detaljert funksjonsliste
- ✅ 5-fase plan
- ✅ Auto-oppdateres

**Aksjon:** Arkiver UTVIKLINGSPLAN.md, behold UTVIKLINGSPLAN_KOMPLETT.md

---

#### 3. QUICKSTART vs QUICK_START
**QUICKSTART.md** (Behold + forbedre)
- 🟡 Mer detaljert
- 🟡 Bedre struktur

**QUICK_START.md** (Slett)
- 🟡 Kortere
- 🟡 Mindre info

**Aksjon:** Sammenslå beste fra begge → QUICKSTART.md, slett QUICK_START.md

---

## ✅ SJEKKLISTE - GJENNOMFØRING

### Dag 1: Root-opprydding (30 min)
- [ ] Opprett Docs/archive/2025-12-14/
- [ ] Arkiver BUILD_COMPLETE.md
- [ ] Arkiver OVERNIGHT_BUILD_SUMMARY.md
- [ ] Arkiver OPPRYDDINGSPLAN.md
- [ ] Backup gammel README.md
- [ ] Lag ny README.md (bruk template)
- [ ] Sammenslå QUICKSTART + QUICK_START
- [ ] Slett QUICK_START.md
- [ ] Arkiver USER_GUIDE.md

### Dag 2: Docs/-opprydding (45 min)
- [ ] Flytt MASTER_PROSJEKTDOKUMENT fra reference/ til Docs/
- [ ] Gi numre til primære docs (00-05)
- [ ] Arkiver gammel UTVIKLINGSPLAN.md
- [ ] Sammenslå APP_STATUS → STATUS_DASHBOARD
- [ ] Slett APP_STATUS.md fra reference/

### Dag 3: Reference/-organisering (60 min)
- [ ] Opprett undermapper: api/, design/, kategori/, archive/
- [ ] Flytt API-dokumenter til api/
- [ ] Flytt design-dokumenter til design/
- [ ] Flytt kategori-dokumenter til kategori/
- [ ] Arkiver historiske guider
- [ ] Slett duplikater (DESIGN_SYSTEM_COMPLETE, etc.)

### Dag 4: Automatisering (30 min)
- [ ] Oppdater update-status.js med nye filnavn
- [ ] Test at script fungerer
- [ ] Legg til git hook (optional)
- [ ] Oppdater scripts/README.md

### Dag 5: Verifisering (20 min)
- [ ] Test alle lenker i README.md
- [ ] Sjekk at alle primære docs er lesbare
- [ ] Verifiser at archive/ er korrekt
- [ ] Kjør update-status.js og sjekk output
- [ ] Commit alle endringer

---

## 📈 RESULTAT

### Før opprydding:
```
📁 39 markdown-filer spredt over 4 mapper
❌ Duplikater
❌ Utdaterte dokumenter
❌ Ustrukturert
❌ Vanskelig å finne riktig info
```

### Etter opprydding:
```
📁 6 primære dokumenter (Docs/)
📁 10 referanse-dokumenter (Docs/reference/)
📁 15 arkiverte dokumenter (Docs/archive/)
✅ Nummerert rekkefølge
✅ Auto-oppdateres
✅ Strukturert
✅ Lett å navigere
```

---

**Estimert tid:** 3-4 timer totalt
**Prioritet:** HØY - Gjør nå før mer dokumentasjon legges til
**Neste steg:** Følg sjekklisten dag-for-dag
