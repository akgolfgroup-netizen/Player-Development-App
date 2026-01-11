# DOKUMENTASJONS-OPPRYDDING
> **Generert:** 2. januar 2026, 23:30
> **Totalt:** 238 markdown-filer (114,013 linjer)

---

## SAMMENDRAG

| Kategori | Antall | Handling |
|----------|--------|----------|
| Skal SLETTES | 28 | Duplikater, tomme, utdaterte |
| Skal ARKIVERES | 15 | Historisk verdi, ikke aktiv bruk |
| Skal OPPDATERES | 12 | Utdatert informasjon |
| BEHOLDES | ~183 | Aktiv dokumentasjon |

---

## 1. DOKUMENTER SOM SKAL SLETTES

### 1.1 Tomme filer (2 filer)
```
design/UI_SCREENS_DESKTOP.md          (0 bytes)
specs/TEST_SPESIFIKASJONER_APP.md     (0 bytes)
```

### 1.2 Duplikater (3 filer)
```
spania-prep/DATABASE_FORMLER_KOMPLETT.md
  -> DUPLIKAT av architecture/DATABASE_FORMLER_KOMPLETT.md (identisk MD5)
  -> SLETT: spania-prep/ versjonen

features/datagolf/DATAGOLF_STATS_FORSLAG.md
  -> DUPLIKAT av integrations/DATAGOLF_STATS_FORSLAG.md
  -> SLETT: features/datagolf/ versjonen

KOMPLETT_PLANSYSTEM_FOR_CHATGPT.md
  -> Notion-fokusert, ikke relevant for app
  -> SLETT
```

### 1.3 Notion-relaterte dokumenter (11 filer) - IKKE RELEVANT
Disse omhandler Notion-databaser som ikke brukes i appen:
```
00_MASTER_PROSJEKTDOKUMENT.md         (Notion-referanser)
  -> OPPDATER: Fjern Notion-seksjoner

PLAYER_MODULE_FUNCTIONS.md            (Notion-spesifikk)
specs/DASHBOARD_IMPLEMENTATION.md     (Notion-referanser)
reference/kategori/KATEGORI_SYSTEM_AUDIT.md
reference/kategori/KATEGORI_SYSTEM_KOMPARATIV_AUDIT.md
reference/kategori/AK_FORMEL_ANALYSE.md
internal/OPPSUMMERING_AUTOMATISERING.md
internal/OPPRYDDINGSPLAN_DOKUMENTASJON.md
guides/AUTOMATISERING_GUIDE.md
TOTAL_OVERSIKT_DATA_TURNERINGER_TESTER.md
```

### 1.4 Gamle/utdaterte status-dokumenter (8 filer)
```
internal/TODO videreutvikling 27 des 2025.md  (foreldet)
internal/liste-for-endringer.md               (36 bytes, tom)
internal/ak-golf-merged-tokens.md             (tokens-strategi, foreldet)
FEATURE_DETAILS_2025.md                       (generisk 2025 roadmap)
FEATURE_OVERVIEW_2025.md                      (generisk 2025 roadmap)
DEVELOPMENT_ROADMAP.md                        (erstattet av 02_UTVIKLINGSPLAN)
BUTTON_STANDARDIZATION_PLAN.md                (fullført, ikke relevant)
design/DESIGN_MIGRATION_SUMMARY.md            (migrering fullført)
```

### 1.5 Demo-relaterte duplikater (4 filer)
```
demo/README_SCREENSHOTS.md           (duplikat av SCREENSHOT_GUIDE)
demo/SCREENSHOT_SETUP_COMPLETE.md    (engangs-status)
demo/PRESENTATION_COMPLETE.md        (engangs-status)
deployment/README_DEMO.md            (duplikat av START_DEMO)
```

---

## 2. DOKUMENTER SOM SKAL ARKIVERES

Flytt til `docs/archive/` for historisk referanse:

```
PRESENTASJON_PARTNERE.md              (presentasjon ferdig)
contracts/CONTRACT_COMPLETION_SUMMARY.md
contracts/CONTRACT_ENFORCEMENT_SUMMARY.md
contracts/VALIDATION_CHECKLIST.md
design/BLUE_PALETTE_COMPLETE.md       (migrering fullført)
design/UI_SCREENS_MOBILE.md           (erstattet av design-system)
design/UI_SCREENS_TABLET.md           (erstattet av design-system)
specs/EXPERIENCE_PLACEMENT.md         (ferdig implementert)
specs/TRAJECTORY_SCREEN.md            (ferdig implementert)
guides/user-journeys.md               (erstattet av PLAYER_NAVIGATION)
internal/DOM_INJECTION_ANALYSIS.md    (sikkerhet, gjennomført)
internal/IMPLEMENTATION_SUMMARY.md    (historisk)
internal/CLAUDE-SKILL-AK-Golf-Category-System.md (skill-fil, flytt)
reference/STRATEGI_AARSPLAN_OG_DATA.md (strategisk, ikke operativt)
reference/TESTDATA_BEHANDLING_KOMPLETT.md (behandling, ferdig)
```

---

## 3. DOKUMENTER SOM MÅ OPPDATERES

### 3.1 Kritiske status-dokumenter
| Fil | Sist oppdatert | Endringer nødvendig |
|-----|----------------|---------------------|
| `01_STATUS_DASHBOARD.md` | 15. des 2025 | Oppdater alle progresjonstall |
| `00_MASTER_PROSJEKTDOKUMENT.md` | 14. des 2025 | Fjern Notion, oppdater status |
| `02_UTVIKLINGSPLAN_KOMPLETT.md` | Ukjent | Verifiser milepæler |
| `03_HVA_SKAL_JEG_GJORE_NA.md` | Ukjent | Oppdater neste steg |

### 3.2 Teknisk dokumentasjon med feil info
```
architecture/KOMPLETT_SYSTEMDOKUMENTASJON.md
  -> Inneholder "DEPRECATED" markører, trenger opprydding

architecture/DATABASE_FORMLER_KOMPLETT.md
  -> Verifiser at formler matcher kode

deployment/RAILWAY.md
  -> Verifiser health check konfig (oppdatert i metrics.ts)
```

### 3.3 Spania-prep dokumenter (aktive, men verifiser)
```
spania-prep/SPANIA_TRENINGSSAMLING_PLAN.md     (3-10 jan, aktiv)
spania-prep/KATEGORI_SYSTEM_KOMPLETT.md        (verifiser mot kode)
spania-prep/TRENINGSPLAN_ALGORITMER.md         (verifiser implementasjon)
spania-prep/KONKRETE_OKTPLANER.md              (NYLIG OPPRETTET - OK)
spania-prep/HURTIGREFERANSE_OKTER.md           (NYLIG OPPRETTET - OK)
```

---

## 4. MAPPESTRUKTUR ETTER OPPRYDDING

```
docs/
├── 00_MASTER_PROSJEKTDOKUMENT.md     (oppdatert)
├── 01_STATUS_DASHBOARD.md            (oppdatert)
├── 02_UTVIKLINGSPLAN_KOMPLETT.md     (verifisert)
├── 03_HVA_SKAL_JEG_GJORE_NA.md       (oppdatert)
├── INDEX.md
├── README.md
│
├── spania-prep/                      (aktiv camp-dokumentasjon)
│   ├── SPANIA_TRENINGSSAMLING_PLAN.md
│   ├── KATEGORI_SYSTEM_KOMPLETT.md
│   ├── KONKRETE_OKTPLANER.md
│   ├── HURTIGREFERANSE_OKTER.md
│   └── ... (6 andre aktive filer)
│
├── architecture/                     (system-arkitektur)
├── api/                              (API-dokumentasjon)
├── deployment/                       (deployment-guider)
├── guides/                           (utvikler-guider)
├── reference/                        (referanse-materiale)
├── features/                         (feature-dokumentasjon)
├── contracts/                        (kontrakter og SLA)
├── operations/                       (drift-dokumentasjon)
│
└── archive/                          (NY - historisk materiale)
    ├── presentations/
    ├── completed-features/
    └── legacy/
```

---

## 5. ANBEFALTE HANDLINGER

### Umiddelbart (i dag):
1. [ ] Slett 2 tomme filer
2. [ ] Slett duplikat i spania-prep/DATABASE_FORMLER_KOMPLETT.md
3. [ ] Oppdater 01_STATUS_DASHBOARD.md med korrekte tall

### Denne uken:
4. [ ] Opprett archive/ mappe og flytt 15 filer
5. [ ] Slett de 8 utdaterte status-dokumentene
6. [ ] Oppdater 00_MASTER_PROSJEKTDOKUMENT.md

### Etter Spania-camp:
7. [ ] Full gjennomgang av spania-prep/ dokumenter
8. [ ] Verifiser alle tekniske dokumenter mot kode

---

## 6. SLETTINGS-KOMMANDO

For å slette tomme og duplikat-filer:
```bash
# Tomme filer
rm docs/design/UI_SCREENS_DESKTOP.md
rm docs/specs/TEST_SPESIFIKASJONER_APP.md

# Duplikater
rm docs/spania-prep/DATABASE_FORMLER_KOMPLETT.md
rm docs/features/datagolf/DATAGOLF_STATS_FORSLAG.md
rm docs/KOMPLETT_PLANSYSTEM_FOR_CHATGPT.md

# Utdaterte
rm docs/internal/liste-for-endringer.md
rm "docs/internal/TODO videreutvikling 27 des 2025.md"
rm docs/demo/README_SCREENSHOTS.md
rm docs/demo/SCREENSHOT_SETUP_COMPLETE.md
rm docs/demo/PRESENTATION_COMPLETE.md
rm docs/deployment/README_DEMO.md
```

---

**Neste steg:** Oppdater 01_STATUS_DASHBOARD.md med korrekte tall for 2. januar 2026.
