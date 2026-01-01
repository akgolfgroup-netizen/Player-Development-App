# 🧹 Oppryddingsplan - IUP Master Folder

**Dato**: 14. desember 2025
**Status**: Klar for opprydding
**Formål**: Strukturere prosjektet for enklere vedlikehold og utvikling

---

## 📊 Nåværende Situasjon

### Mappestruktur (23 elementer i root):
```
IUP_Master_Folder/
├── backend/                    ✅ BEHOLD (aktiv utvikling)
├── Data/                       ✅ BEHOLD (Excel-filer)
├── Design/                     ✅ BEHOLD (design-filer)
├── Docs/                       ✅ BEHOLD (dokumentasjon)
├── Notion_Databases/           ⚠️  FLYTT TIL ARKIV (ikke i bruk)
├── Pdf/                        ✅ BEHOLD (referansemateriale)
├── Screens/                    ✅ BEHOLD (React-komponenter)
├── files/                      ❓ SJEKK (ukjent innhold)
└── [diverse filer i root]      🔧 RYDD OPP
```

---

## 🎯 Oppryddingsplan (4 Faser)

### FASE 1: Identifiser Duplikater og Overflødige Filer

#### Duplikater Funnet:
1. **ak_golf_figma_wireframes.svg**
   - 📁 Root: `./ak_golf_figma_wireframes.svg` (73KB)
   - 📁 Design: `./Design/ak_golf_figma_wireframes.svg`
   - **HANDLING**: Slett fra root, behold i Design/

2. **Notion Database Filer** (19 filer)
   - Status: Ikke lenger i bruk (vi bruker code-based backend)
   - **HANDLING**: Flytt til Docs/Archive/Notion_Original/

#### Filer i Root som Bør Flyttes:
1. `design-tokens.js` → `Design/`
2. `tailwind.config.js` → `Design/`
3. `tokens.css` → `Design/`
4. `.DS_Store` → Slett (macOS metadata)

---

### FASE 2: Opprett Ny Mappestruktur

```
IUP_Master_Folder/
├── 📁 backend/                          # Backend API (Node.js + Express)
│   ├── src/
│   ├── node_modules/
│   ├── package.json
│   └── .env
│
├── 📁 frontend/                         # OPPRETT NY - React/React Native
│   ├── src/
│   │   ├── components/                  # Flytt Screens/ hit
│   │   ├── screens/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
│
├── 📁 database/                         # OPPRETT NY - Database filer
│   ├── schema/
│   │   ├── 01_base_setup.sql           # Fra database_setup.sql
│   │   └── 02_iup_extension.sql        # Fra database_iup_extension.sql
│   └── seeds/
│       └── sample_data.sql
│
├── 📁 docs/                             # Dokumentasjon
│   ├── api/
│   │   ├── API_ROUTES_IMPLEMENTATION_COMPLETE.md
│   │   └── IUP_API_Visual_Overview.html
│   ├── backend/
│   │   └── BACKEND_FOUNDATION_COMPLETE.md
│   ├── system/
│   │   ├── MASTER_PROSJEKTDOKUMENT.md
│   │   ├── KATEGORI_OG_TRENINGSSYSTEM_KOMPLETT.md
│   │   └── AK_GOLF_KATEGORI_HIERARKI_v2.0.md
│   └── archive/
│       └── notion_original/            # Notion database filer
│
├── 📁 design/                           # Design assets
│   ├── figma/
│   │   ├── ak_golf_figma_wireframes.svg
│   │   ├── ak_golf_complete_figma_kit.svg
│   │   └── ak_golf_design_system_v2.1.svg
│   ├── mockups/
│   │   ├── AK Golf IUP App - Mockup Oversikt.pdf
│   │   └── iPhone_mockups/
│   ├── design-tokens.js
│   ├── tailwind.config.js
│   └── tokens.css
│
├── 📁 data/                             # Excel og datakildær
│   ├── training/
│   │   ├── Team_Norway_IUP_2026.xlsx
│   │   └── Team_Norway_Training_Protocols.xlsx
│   ├── tests/
│   │   ├── Team Norway Tester Scorekort Spiller.xlsx
│   │   └── PEI Scoreføring.xlsx
│   └── reference/
│       └── (andre Excel-filer)
│
├── 📁 reference/                        # OPPRETT NY - PDF referanser
│   ├── team_norway/
│   │   ├── Team Norway IUP 2026.pdf
│   │   ├── Team Norway Junior Calendar 2025.pdf
│   │   └── (andre Team Norway PDFer)
│   ├── training/
│   │   ├── Science Based Golf Training Progression System.pdf
│   │   └── (andre trenings-PDFer)
│   └── coaching/
│       └── AK_Golf_Coaching_App_Branding_Guideline.pdf
│
├── 📄 README.md                         # OPPRETT NY - Prosjektoversikt
├── 📄 .gitignore                        # OPPRETT NY
└── 📄 package.json                      # OPPRETT NY - Root package.json
```

---

### FASE 3: Detaljert Oppryddingshandlinger

#### A. Slett Filer (4 filer)
```bash
# macOS metadata
rm .DS_Store
rm Design/.DS_Store

# Duplikat (behold i Design/)
rm ak_golf_figma_wireframes.svg
```

#### B. Flytt Filer til Riktig Plassering

**Design Filer:**
```bash
mv design-tokens.js Design/
mv tailwind.config.js Design/
mv tokens.css Design/
```

**Database Filer:**
```bash
mkdir -p database/schema
mv database_setup.sql database/schema/01_base_setup.sql
mv database_iup_extension.sql database/schema/02_iup_extension.sql
```

**Dokumentasjon:**
```bash
mkdir -p docs/{api,backend,system,archive/notion_original}

# API docs
mv API_ROUTES_IMPLEMENTATION_COMPLETE.md docs/api/
mv IUP_API_Visual_Overview.html docs/api/

# Backend docs
mv BACKEND_FOUNDATION_COMPLETE.md docs/backend/

# System docs
mv AK_GOLF_KATEGORI_HIERARKI_v2.0.md docs/system/
mv Docs/MASTER_PROSJEKTDOKUMENT.md docs/system/
mv Docs/KATEGORI_OG_TRENINGSSYSTEM_KOMPLETT.md docs/system/

# Arkiver Notion filer
mv Notion_Databases/* docs/archive/notion_original/
rmdir Notion_Databases
```

**PDF Referanser:**
```bash
mkdir -p reference/{team_norway,training,coaching}

# Team Norway PDFs
mv Pdf/Team\ Norway*.pdf reference/team_norway/
mv Pdf/team-norway*.pdf reference/team_norway/

# Training PDFs
mv Pdf/Science*.pdf reference/training/
mv Pdf/*-trening*.pdf reference/training/

# Coaching PDFs
mv Pdf/AK_Golf_Coaching*.pdf reference/coaching/

# Resten
mv Pdf/* reference/team_norway/
rmdir Pdf
```

**Data Filer:**
```bash
mkdir -p data/{training,tests,reference}

mv Data/Team_Norway_IUP*.xlsx data/training/
mv Data/Team_Norway_Training*.xlsx data/training/
mv Data/*Tester*.xlsx data/tests/
mv Data/PEI*.xlsx data/tests/
mv Data/* data/reference/
```

**Frontend (Screens):**
```bash
mkdir -p frontend/src/components
mv Screens/* frontend/src/components/
rmdir Screens
```

#### C. Opprett Nye Filer

**README.md:**
```markdown
# AK Golf Academy - IUP System

Individual Development Plan (IUP) system for junior golf development.

## Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Documentation
See `docs/` folder for complete documentation.

## Structure
- `backend/` - Node.js API
- `frontend/` - React app
- `database/` - PostgreSQL schemas
- `docs/` - Documentation
- `design/` - Design assets
- `data/` - Excel data sources
- `reference/` - PDF references
```

**.gitignore:**
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Misc
.DS_Store
.env
.env.local
*.log
npm-debug.log*

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db
```

**package.json (root):**
```json
{
  "name": "ak-golf-iup-system",
  "version": "1.0.0",
  "description": "Individual Development Plan System",
  "private": true,
  "scripts": {
    "backend": "cd backend && npm run dev",
    "frontend": "cd frontend && npm start",
    "install:all": "cd backend && npm install && cd ../frontend && npm install"
  }
}
```

---

### FASE 4: Verifisering og Testing

#### Sjekkliste etter opprydding:

**Backend:**
- [ ] Server starter uten feil
- [ ] Database kobler til
- [ ] Alle API ruter fungerer
- [ ] Seed data kjører

**Frontend:**
- [ ] Komponenter importeres riktig
- [ ] Ingen broken imports
- [ ] Design tokens fungerer

**Dokumentasjon:**
- [ ] Alle MD filer er lesbare
- [ ] Linker i dokumentasjon fungerer
- [ ] README er oppdatert

**Git:**
- [ ] .gitignore fungerer
- [ ] Ingen node_modules committes
- [ ] .env filer er ekskludert

---

## 📈 Før og Etter

### FØR Opprydding:
```
Root: 23 elementer (filer og mapper blandet)
- Uorganisert
- Duplikater
- Ingen klar struktur
- Vanskelig å finne filer
```

### ETTER Opprydding:
```
Root: 9 mapper + 3 filer
✅ backend/        - Backend API
✅ frontend/       - React app
✅ database/       - Database schemas
✅ docs/           - All dokumentasjon
✅ design/         - Design assets
✅ data/           - Data sources
✅ reference/      - PDF referanser
✅ README.md       - Prosjektoversikt
✅ .gitignore      - Git config
✅ package.json    - Root config
```

---

## ⏱️ Estimert Tid

| Fase | Oppgaver | Tid |
|------|----------|-----|
| Fase 1 | Identifisere duplikater | 15 min |
| Fase 2 | Opprette mappestruktur | 10 min |
| Fase 3 | Flytte filer | 30 min |
| Fase 4 | Verifisering | 15 min |
| **TOTALT** | | **70 min** |

---

## 🚨 VIKTIG: Backup Først!

**FØR du starter opprydding:**

```bash
# Opprett backup
cd "/Users/anderskristiansen/Library/Mobile Documents/com~apple~CloudDocs/01. Projects/Active/"
cp -r IUP_Master_Folder IUP_Master_Folder_BACKUP_$(date +%Y%m%d)
```

---

## 📝 Neste Steg

1. **Les gjennom hele planen**
2. **Opprett backup** (se over)
3. **Kjør Fase 1-4** systematisk
4. **Verifiser** at alt fungerer
5. **Commit til Git** (første gang)
6. **Slett backup** når alt er bekreftet OK

---

## ✅ Forventede Forbedringer

Efter opprydding vil du ha:

✅ **Klar mappestruktur** - Lett å navigere
✅ **Ingen duplikater** - Mindre forvirring
✅ **Logisk organisering** - Backend, frontend, docs adskilt
✅ **Git-klar** - Klar for versjonskontroll
✅ **Bedre oversikt** - README på rot-nivå
✅ **Profesjonell struktur** - Standard prosjektoppsett

---

**Klar til å starte opprydding?**

Kommandoer for å kjøre hele oppryddingen er i egen fil: `CLEANUP_SCRIPT.sh`
