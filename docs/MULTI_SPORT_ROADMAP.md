# Multi-Sport Roadmap

> Sist oppdatert: 2026-01-10

## Oversikt

Denne planen beskriver arbeidet for å aktivere full multi-sport støtte i IUP-plattformen.

**Nåværende status:** Arkitektur 95% ferdig, men hardkodet til Golf
**Mål:** Full multi-sport støtte for 7 idretter

### Idretter
1. Golf (eksisterende, fullt fungerende)
2. Løping
3. Håndball
4. Fotball
5. Tennis
6. Svømming
7. Spydkast

---

## Fase 0: Forberedelse (Anbefalt start)

**Mål:** Forstå nåværende tilstand og planlegge arbeidet

| Oppgave | Beskrivelse | Estimat |
|---------|-------------|---------|
| Audit av golf-hardkoding | Finn alle steder der "golf" er hardkodet | 2t |
| Dokumenter avhengigheter | Kartlegg hvilke komponenter som må endres | 1t |
| Prioriter features | Bestem hvilke features som er kritiske vs nice-to-have | 1t |
| Sett opp test-miljø | Sikre at vi kan teste idrettsbytte trygt | 1t |

**Leveranse:** Komplett oversikt over arbeidet som må gjøres

---

## Fase 1: Aktiver idrettsbytte (Kritisk bane)

**Mål:** Gjøre det mulig å bytte idrett i appen

### 1.1 Backend - Idrettsbytte API
| Oppgave | Fil(er) | Estimat |
|---------|---------|---------|
| Lag endpoint for å bytte tenant sport | `sport-config/routes.ts` | 1t |
| Oppdater service med bytte-logikk | `sport-config/service.ts` | 1t |
| Legg til validering | `sport-config/service.ts` | 0.5t |

### 1.2 Frontend - Provider oppsett
| Oppgave | Fil(er) | Estimat |
|---------|---------|---------|
| Bytt fra `SportProvider` til `ApiSportProvider` | `App.jsx` | 0.5t |
| Håndter loading state | `App.jsx`, `SportContext.tsx` | 1t |
| Fallback ved feil | `SportContext.tsx` | 0.5t |

### 1.3 Frontend - Idrettsvelger UI
| Oppgave | Fil(er) | Estimat |
|---------|---------|---------|
| Lag `SportSelector` komponent | `components/sport/SportSelector.tsx` | 2t |
| Integrer i admin-innstillinger | `features/settings/` | 1t |
| Legg til sport-indikator i header | `components/layout/Header.tsx` | 1t |

**Fase 1 Total:** ~9 timer
**Leveranse:** Fungerende idrettsbytte i UI

---

## Fase 2: Data-modell utvidelse

**Mål:** Støtte lagring av data per idrett

### 2.1 Database schema endringer
| Oppgave | Fil(er) | Estimat |
|---------|---------|---------|
| Legg til `sportId` på `TrainingSession` | `schema.prisma` | 0.5t |
| Legg til `sportId` på `Event` | `schema.prisma` | 0.5t |
| Legg til `sportId` på `Test` | `schema.prisma` | 0.5t |
| Legg til `sportId` på `Goal` | `schema.prisma` | 0.5t |
| Lag migrering | `prisma/migrations/` | 1t |
| Håndter eksisterende data (sett til GOLF) | migrering | 0.5t |

### 2.2 API oppdateringer
| Oppgave | Beskrivelse | Estimat |
|---------|-------------|---------|
| Oppdater session queries | Filter på sportId | 1t |
| Oppdater event queries | Filter på sportId | 1t |
| Oppdater test queries | Filter på sportId | 1t |
| Oppdater goal queries | Filter på sportId | 1t |
| Validering ved opprettelse | Sjekk at sportId matcher tenant | 1t |

### 2.3 Frontend query oppdateringer
| Oppgave | Beskrivelse | Estimat |
|---------|-------------|---------|
| Oppdater session fetching | Inkluder sportId filter | 1t |
| Oppdater event fetching | Inkluder sportId filter | 1t |
| Oppdater test fetching | Inkluder sportId filter | 1t |
| Oppdater goal fetching | Inkluder sportId filter | 1t |

**Fase 2 Total:** ~12 timer
**Leveranse:** Data separert per idrett

---

## Fase 3: UI-integrasjon

**Mål:** Komponenter bruker sport-konfigurasjon dynamisk

### 3.1 Treningsregistrering
| Oppgave | Komponent | Estimat |
|---------|-----------|---------|
| Dynamiske treningsområder i skjema | `LoggTreningContainer.jsx` | 2t |
| Dynamiske miljøer | `LoggTreningContainer.jsx` | 1t |
| Intensitetsnivåer fra config | `LoggTreningContainer.jsx` | 1t |

### 3.2 Testregistrering
| Oppgave | Komponent | Estimat |
|---------|-----------|---------|
| Dynamiske testprotokoller | `TestDetailPage.tsx` | 2t |
| Sport-spesifikke skjemaer | `tests/` | 3t |
| Benchmark-visning per sport | `tests/` | 1t |

### 3.3 Målsetting
| Oppgave | Komponent | Estimat |
|---------|-----------|---------|
| Dynamiske målkategorier | `Maalsetninger.tsx` | 1t |
| Sport-spesifikke mål-templates | `goals/` | 2t |

### 3.4 Dashboard
| Oppgave | Komponent | Estimat |
|---------|-----------|---------|
| Sport-indikator på alle kort | `dashboard/` | 2t |
| Filtrering per sport | `dashboard/` | 2t |
| Sport-spesifikke statistikker | `FocusCard.tsx`, `PlayerStatCard.tsx` | 2t |

### 3.5 Analyse
| Oppgave | Komponent | Estimat |
|---------|-----------|---------|
| Sport-spesifikke analyser | `AnalyseHub.tsx` | 2t |
| Dynamiske metriker | `AnalyseStatistikkHub.tsx` | 2t |

**Fase 3 Total:** ~23 timer
**Leveranse:** Alle hovedkomponenter bruker sport-config

---

## Fase 4: Feature flags og tilpasning

**Mål:** Skjul/vis features basert på idrett

### 4.1 Betinget visning
| Feature | Gjelder | Estimat |
|---------|---------|---------|
| Handicap | Kun golf | 1t |
| Klubbhastighet | Kun golf | 1t |
| Strokes Gained | Kun golf | 1t |
| AK-formel | Konfigurerbar | 1t |
| Benchmarks | Konfigurerbar | 1t |

### 4.2 Terminologi
| Oppgave | Beskrivelse | Estimat |
|---------|-------------|---------|
| Dynamisk "utøver/spiller" | Bruk sport.terminology | 2t |
| Dynamisk "trener/coach" | Bruk sport.terminology | 1t |
| Dynamisk "økt/trening" | Bruk sport.terminology | 1t |
| Dynamisk "kamp/konkurranse" | Bruk sport.terminology | 1t |

### 4.3 Navigasjon
| Oppgave | Beskrivelse | Estimat |
|---------|-------------|---------|
| Sport-spesifikke hurtighandlinger | Bruk sport.navigation | 2t |
| Betinget menyvisning | Skjul irrelevante seksjoner | 1t |

**Fase 4 Total:** ~13 timer
**Leveranse:** Skreddersydd opplevelse per idrett

---

## Fase 5: Kvalitetssikring

**Mål:** Sikre at alt fungerer for alle idretter

### 5.1 Testing
| Oppgave | Beskrivelse | Estimat |
|---------|-------------|---------|
| E2E tester for idrettsbytte | Playwright | 3t |
| Komponent-tester per idrett | Jest/RTL | 4t |
| API-tester for sport endpoints | Jest | 2t |
| Regresjonstesting golf | Sikre golf fortsatt fungerer | 2t |

### 5.2 Dokumentasjon
| Oppgave | Beskrivelse | Estimat |
|---------|-------------|---------|
| Oppdater README | Multi-sport instruksjoner | 1t |
| API-dokumentasjon | Sport endpoints | 1t |
| Konfigurasjonsdokumentasjon | Hvordan legge til ny idrett | 2t |

**Fase 5 Total:** ~15 timer

---

## Opsjonelle utvidelser (Fase 6+)

Disse kan implementeres etter behov:

### Multi-sport per bruker
- En utøver kan trene flere idretter
- Separate dashboards per idrett
- Kryssidrett-sammenligning

### Lag-sport features
- Lagoppstilling og roller
- Kamp-statistikk
- Spillerposisjoner

### Avansert tilpasning
- Admin kan lage egne treningsområder
- Egendefinerte tester
- Merkevarebygging (farger, logo)

---

## Sammendrag

| Fase | Beskrivelse | Timer | Avhengigheter |
|------|-------------|-------|---------------|
| 0 | Forberedelse | 5t | Ingen |
| 1 | Idrettsbytte | 9t | Fase 0 |
| 2 | Data-modell | 12t | Fase 1 |
| 3 | UI-integrasjon | 23t | Fase 2 |
| 4 | Feature flags | 13t | Fase 3 |
| 5 | Kvalitetssikring | 15t | Fase 4 |
| **Total** | | **77t** | |

### Anbefalte milepæler

1. **MVP (Fase 0-1):** Idrettsbytte fungerer - ~14 timer
2. **Alpha (Fase 0-2):** Data separert per idrett - ~26 timer
3. **Beta (Fase 0-3):** UI bruker sport-config - ~49 timer
4. **Release (Fase 0-5):** Full produksjonskvalitet - ~77 timer

---

## Neste steg

- [ ] Godkjenn denne planen
- [ ] Bestem startfase (anbefaler Fase 0)
- [ ] Sett opp task-tracking (GitHub Issues, Linear, etc.)
- [ ] Tildel ressurser og prioriter

---

## Teknisk gjeld å håndtere

Under arbeidet bør følgende ryddes opp:

1. **Golf-hardkoding:** Fjern alle "golf"-strenger i koden
2. **Test-definisjoner:** Flytt fra hardkodet til sport-config
3. **Terminologi:** Erstatt hardkodede termer med `sport.terminology`
4. **Feature-sjekker:** Legg til manglende feature flag sjekker
