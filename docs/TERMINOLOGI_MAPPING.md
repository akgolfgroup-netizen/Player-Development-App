# Terminologi Mapping - IUP Golf App
> **Formål:** Standardisere all terminologi i appen til norsk
> **Sist oppdatert:** 2. januar 2026

---

## Arbeidsflyt

1. **Fyll ut "Norsk term"** kolonnen under
2. **Send til Claude:** "Oppdater terminologi basert på TERMINOLOGI_MAPPING.md"
3. **Review endringene** i git diff
4. **Commit og deploy**

---

## Termer å standardisere

### Treningsområder (høy prioritet)

| Engelsk term | Forekomster | Norsk term | Status |
|--------------|-------------|------------|--------|
| Short Game | 18 | Nærspill | ⬜ Ikke endret |
| Long Game | 2 | Langspill | ⬜ Ikke endret |
| Putting | 420 | Putting | ✅ Behold |
| Chipping | 42 | Chipping | ⬜ Vurder: Kortspill? |
| Pitching | 8 | Pitching | ⬜ Vurder: Mellomdistanse? |
| Full Swing | 16 | Full sving | ⬜ Ikke endret |
| Approach | 235 | Innspill | ⬜ Ikke endret |
| Bunker | 87 | Bunker | ✅ Behold |

### Utstyr

| Engelsk term | Forekomster | Norsk term | Status |
|--------------|-------------|------------|--------|
| Driver | 176 | Driver | ✅ Behold |
| Iron | 41 | Jern | ⬜ Ikke endret |
| Wedge | 51 | Wedge | ✅ Behold |

### Bane-elementer

| Engelsk term | Forekomster | Norsk term | Status |
|--------------|-------------|------------|--------|
| Fairway | 36 | Fairway | ✅ Behold |
| Green | 110 | Green | ✅ Behold |
| Tee Shot | - | Utslagsslag | ⬜ Vurder |

### Treningskategorier

| Engelsk term | Forekomster | Norsk term | Status |
|--------------|-------------|------------|--------|
| Mental | 203 | Mental | ✅ Behold |
| Physical | 84 | Fysisk | ⬜ Ikke endret |
| Strategy | 4 | Strategi | ⬜ Ikke endret |

---

## Domenespesifikke termer

### Testsystem

| Engelsk | Norsk | Kontekst |
|---------|-------|----------|
| PEI (Proximity Efficiency Index) | PEI | Behold forkortelse |
| Strokes Gained | Strokes Gained | Behold (bransjestd) |
| Clubhead Speed | Klubbhodehastighet | Vurder |
| Ball Speed | Ballhastighet | Vurder |
| Launch Angle | Utskytningsvinkel | Vurder |
| Smash Factor | Smash Factor | Behold (bransjestd) |
| Carry Distance | Carry-lengde | Vurder |

### Treningsperioder

| Engelsk | Norsk | Kontekst |
|---------|-------|----------|
| Ground Period | Grunnperiode | ⬜ |
| Specialization Period | Spesialiseringsperiode | ⬜ |
| Tournament Period | Turneringsperiode | ⬜ |
| Evaluation Period | Evalueringsperiode | ⬜ |

### UI-elementer

| Engelsk | Norsk | Kontekst |
|---------|-------|----------|
| Dashboard | Dashboard | Behold |
| Profile | Profil | ⬜ |
| Settings | Innstillinger | ⬜ |
| Training Plan | Treningsplan | ⬜ |
| Test Results | Testresultater | ⬜ |

---

## Instruksjoner til Claude

Når du er ferdig med å fylle ut tabellen, kopier denne kommandoen:

```
Les docs/TERMINOLOGI_MAPPING.md og oppdater alle termer
som er markert "⬜ Ikke endret" til den norske termen.
Vis meg en oppsummering av endringer før du committer.
```

---

---

## Årsplan & Periodisering

### Plantyper

| Engelsk term | Forekomster | Norsk term | Status |
|--------------|-------------|------------|--------|
| Annual Plan | ~10 | Årsplan | ⬜ Standardiser |
| Training Plan | 85 | Treningsplan | ⬜ Standardiser |
| Weekly Plan | ~5 | Ukeplan | ⬜ Standardiser |
| Session | 3492 | Økt | ⬜ Vurder kontekst |
| Workout | 251 | Treningsøkt | ⬜ Standardiser |

### Perioder (Periodisering)

| Engelsk term | Forekomster | Norsk term | Status |
|--------------|-------------|------------|--------|
| Period | 676 | Periode | ⬜ Standardiser |
| Phase | 444 | Fase | ⬜ Standardiser |
| Cycle | 67 | Syklus | ⬜ Standardiser |
| Block | 631 | Blokk | ⬜ Standardiser |
| Periodization | 104 | Periodisering | ⬜ Standardiser |

### Periodetype-navn

| Engelsk term | Forekomster | Norsk term | Status |
|--------------|-------------|------------|--------|
| Base / Ground | 1364 | Grunnperiode (G) | ⬜ Standardiser |
| Preparation | ~20 | Forberedelse | ⬜ Standardiser |
| Specialization | ~30 | Spesialisering (S) | ⬜ Standardiser |
| Competition / Tournament | 1223 | Turnering (T) | ⬜ Standardiser |
| Transition | 801 | Overgang | ⬜ Standardiser |
| Peak | 173 | Topp / Toppform | ⬜ Standardiser |
| Taper | 42 | Nedtrapping | ⬜ Standardiser |
| Recovery | 31 | Restitusjon | ⬜ Standardiser |
| Maintenance | ~10 | Vedlikehold | ⬜ Standardiser |
| Deload | ~5 | Avlastning | ⬜ Standardiser |

### Treningsvariabler

| Engelsk term | Forekomster | Norsk term | Status |
|--------------|-------------|------------|--------|
| Intensity | 153 | Intensitet | ⬜ Standardiser |
| Volume | 148 | Volum | ⬜ Standardiser |
| Load | 1770 | Belastning | ⬜ Vurder kontekst |
| Frequency | ~20 | Frekvens | ⬜ Standardiser |

### Konkurranser

| Engelsk term | Forekomster | Norsk term | Status |
|--------------|-------------|------------|--------|
| Tournament | 1223 | Turnering | ⬜ Standardiser |
| Competition | 40 | Konkurranse | ⬜ Standardiser |
| Match | ~15 | Kamp / Match | ⬜ Vurder |

---

## Økttyper

| Engelsk term | Norsk term | Kode | Status |
|--------------|------------|------|--------|
| Technical Session | Teknikkøkt | TEK | ⬜ |
| Physical Session | Fysisk økt | FYS | ⬜ |
| Mental Session | Mental økt | MEN | ⬜ |
| Strategy Session | Strategiøkt | STR | ⬜ |
| Full Swing Session | Langsvilløkt | LS | ⬜ |
| Short Game Session | Nærspilløkt | NS | ⬜ |
| Putting Session | Puttingøkt | PUT | ⬜ |
| Playing Session | Spilløkt | SPL | ⬜ |
| Competition Prep | Konkurranseforb. | KON | ⬜ |

---

## Notater

- **Behold engelske termer** som er bransjestandarder (Strokes Gained, Smash Factor)
- **Putting, Bunker, Wedge, Driver** er så innarbeidet at norske alternativer blir kunstige
- **Vurder kontekst:** Noen steder kan engelsk passe bedre (tekniske rapporter)
- **Session vs Økt:** "Session" brukes ofte i kode/API, "Økt" i UI - vurder å standardisere UI til norsk

---

---

## Tester & Evaluering

### Test-termer

| Engelsk term | Forekomster | Norsk term | Status |
|--------------|-------------|------------|--------|
| Test | 4418 | Test | ✅ Behold |
| Result | 1617 | Resultat | ⬜ Standardiser |
| Score | 552 | Poeng/Score | ⬜ Vurder |
| Benchmark | 242 | Benchmark | ✅ Behold (bransjeterm) |
| Evaluation | 274 | Evaluering | ⬜ Standardiser |
| Assessment | 7 | Vurdering | ⬜ Standardiser |
| Pass | 428 | Bestått | ⬜ Standardiser |
| Fail | 266 | Ikke bestått | ⬜ Standardiser |
| Threshold | 89 | Terskel/Grense | ⬜ Standardiser |
| Requirement | 660 | Krav | ⬜ Standardiser |
| Criteria | 73 | Kriterier | ⬜ Standardiser |

### Test-navn (allerede norsk ✅)

| Test # | Navn | Status |
|--------|------|--------|
| 1 | Driver Klubbhodehastighet | ✅ |
| 2 | 7-Jern Klubbhodehastighet | ✅ |
| 3 | Driver Carry-avstand | ✅ |
| 4 | PEI - Presisjon | ✅ |
| 5 | Fairway-treff | ✅ |
| 6 | GIR Simulering | ✅ |
| 7 | Up & Down | ⬜ Opp og ned? |
| 8 | Bunker Presisjon | ✅ |
| 9 | Putting 1.5m | ✅ |
| 10 | Putting 3m | ✅ |
| 11 | Lag Putting 10m | ✅ |
| 12 | Medisinball Kast | ✅ |
| 13 | Vertikalt Hopp | ✅ |
| 14 | Hofterotasjon | ✅ |
| 15 | Thorax Rotasjon | ✅ |
| 16 | Planke | ✅ |
| 17 | 9-Hull Scoring | ✅ |
| 18 | Mental Fokus | ✅ |
| 19 | Pre-Shot Rutine | ⬜ Førslag-rutine? |
| 20 | Konkurransesimulering | ✅ |

---

## Badges & Gamification

### Gamification-termer

| Engelsk term | Forekomster | Norsk term | Status |
|--------------|-------------|------------|--------|
| Badge | 1529 | Merke/Badge | ⬜ Vurder |
| Achievement | 447 | Prestasjon | ⬜ Standardiser |
| XP / Experience | 5545 | XP/Erfaring | ✅ Behold XP |
| Level | 816 | Nivå | ⬜ Standardiser |
| Tier | 325 | Tier/Grad | ⬜ Vurder |
| Rank | 191 | Rangering | ⬜ Standardiser |
| Progress | 1087 | Progresjon/Fremgang | ⬜ Standardiser |
| Points | 299 | Poeng | ⬜ Standardiser |
| Streak | 233 | Streak/Rekke | ⬜ Vurder |
| Milestone | 125 | Milepæl | ⬜ Standardiser |
| Unlock | 111 | Låse opp | ⬜ Standardiser |
| Earn | 307 | Tjene/Oppnå | ⬜ Standardiser |
| Reward | 16 | Belønning | ⬜ Standardiser |
| Trophy | 146 | Trofé | ⬜ Standardiser |
| Medal | 33 | Medalje | ⬜ Standardiser |

### Badge-kategorier (domene-koder)

| Kode | Betydning | Norsk | Status |
|------|-----------|-------|--------|
| TEE | Tee/Utslagsområde | Utslag | ⬜ Vurder |
| INN50 | Innspill 0-50m | Innspill 0-50m | ✅ |
| INN100 | Innspill 50-100m | Innspill 50-100m | ✅ |
| INN150 | Innspill 100-150m | Innspill 100-150m | ✅ |
| INN200 | Innspill 150-200m | Innspill 150-200m | ✅ |
| ARG | Around the Green | Rundt green / Nærspill | ⬜ Standardiser |
| PUTT | Putting | Putting | ✅ |
| PHYS | Physical | Fysisk | ⬜ Standardiser |
| MENTAL | Mental | Mental | ✅ |

### Badge tier-navn

| Engelsk | Norsk | Status |
|---------|-------|--------|
| Bronze | Bronse | ⬜ |
| Silver | Sølv | ⬜ |
| Gold | Gull | ⬜ |
| Platinum | Platina | ⬜ |
| Diamond | Diamant | ⬜ |
| Master | Mester | ⬜ |
| Legend | Legende | ⬜ |

---

## Prioritert rekkefølge

1. **UI-labels først** - Det brukeren ser
2. **API-responses** - Data som vises
3. **Interne variabler** - Kan beholde engelsk

---

## Oppsummering forekomster

| Kategori | Engelske termer | Norske termer |
|----------|-----------------|---------------|
| Test/Evaluering | ~7,500 | ~300 |
| Badges/Gamification | ~10,000 | ~200 |
| Periodisering | ~10,000 | ~1,000 |
| Golf-termer | ~1,500 | ~500 |

**Total jobb:** ~20,000+ engelske forekomster som potensielt kan standardiseres

---

_Oppdater denne filen etter hvert som du gjør endringer_
