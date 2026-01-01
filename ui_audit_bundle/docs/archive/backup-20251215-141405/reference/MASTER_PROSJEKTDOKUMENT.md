# MASTER PROSJEKTDOKUMENT
## AK Golf Academy × Team Norway Golf - IUP System

**Versjon**: 2.1
**Sist oppdatert**: 14. desember 2025
**Eier**: Anders Knutsen - AK Golf Academy

---

## INNHOLD

1. [Hurtigstart](#1-hurtigstart)
2. [Systemstatus](#2-systemstatus)
3. [Metodikk og Rammeverk](#3-metodikk-og-rammeverk)
4. [Kategori-system A-K](#4-kategori-system-a-k)
5. [Periodisering](#5-periodisering)
6. [Treningsnivå-system](#6-treningsnivasystem)
7. [Tester og Kravprofiler](#7-tester-og-kravprofiler)
8. [Notion Database-struktur](#8-notion-database-struktur)
9. [Token-strategi](#9-token-strategi)
10. [Utviklingsplan](#10-utviklingsplan)

---

## 1. HURTIGSTART

### Komme i gang med IUP-generering

**Mål**: Token-effektiv databasebygging for Notion

**TL;DR**:
- 68,000 tokens totalt for komplett system
- 15 arbeidsøkter over 6 uker
- Start med 2,700 tokens (Spillere + Periodisering)
- Test underveis med 1 reell spiller

### Nåværende status

| Komponent | Status | Tokens igjen |
|-----------|--------|--------------|
| Fundament (Kategori, Periodisering, Tester) | ✅ 100% | 0 |
| Dokumentasjon (MASTER, Gjennomgang) | ✅ 100% | 0 |
| Notion Databaser (11 stk) | ❌ 0% | 56,700 |
| Interaktive Komponenter (7 stk) | ⚠️ 30% | 10,000 |

**DU TRENGER**: Notion-databasene (kritisk) → 56,700 tokens

### Strategi: 3 Faser

**FASE 1: KJERNE** (2 uker)
5 økter × 4,000 tokens = 20,000 tokens
1. Spillere + Periodisering (2,700 tokens)
2. Tester + Benchmarking (2,500 tokens)
3. Treningsøkter 1-20 (4,000 tokens)
4. Ukeplaner Templates 1-10 (5,000 tokens)
5. Turneringer (1,200 tokens)

**Resultat**: 1 spiller kan navigere 12-ukers plan

**FASE 2: INNHOLD** (2 uker)
6 økter × 5,000 tokens = 30,000 tokens
- Teknikk-øvelser (100 drills)
- Shortgame/Putting (100 drills)
- Fysisk/Mental (100 drills)

**Resultat**: 300 øvelser klar for bruk

**FASE 3: SKALERING** (2 uker)
4 økter × 4,500 tokens = 18,000 tokens
- Treningsøkter full pakke (150 totalt)
- Ukeplaner full pakke (88 templates)
- Support-databaser

**Resultat**: Komplett system for alle kategorier

---

## 2. SYSTEMSTATUS

### App-skjermer (18/18 produksjonsklare - 100%) ✅

**Prioritet 1 - Kjernefunksjonalitet** (9 skjermer)
| Skjerm | Fil | Status |
|--------|-----|--------|
| Dashboard | `AKGolfDashboard.jsx` | ✅ Ferdig |
| Brukerprofil/Onboarding | `ak_golf_brukerprofil_onboarding.jsx` | ✅ Ferdig |
| Utviklingsplan | `utviklingsplan_b_nivaa.jsx` | ✅ Ferdig |
| Kalender | `Kalender.jsx` | ✅ Ferdig |
| Årsplan | `Aarsplan.jsx` | ✅ Ferdig |
| Testprotokoll | `Testprotokoll.jsx` | ✅ Ferdig |
| Treningsprotokoll | `Treningsprotokoll.jsx` | ✅ Ferdig |
| Trenerteam | `Trenerteam.jsx` | ✅ Ferdig |
| Målsetninger | `Målsetninger.jsx` | ✅ Ferdig |

**Prioritet 2 - Statistikk og analyse** (2 skjermer)
| Skjerm | Fil | Status |
|--------|-----|--------|
| Treningsstatistikk | `Treningsstatistikk.jsx` | ✅ Ferdig |
| Testresultater | `Testresultater.jsx` | ✅ Ferdig |

**Prioritet 3 - Støttefunksjoner** (3 skjermer)
| Skjerm | Fil | Status |
|--------|-----|--------|
| Øvelser | `Øvelser.jsx` | ✅ Ferdig |
| Notater | `Notater.jsx` | ✅ Ferdig |
| Arkiv | `Arkiv.jsx` | ✅ Ferdig |

**Utility/Referanse** (4 skjermer)
| Skjerm | Fil | Status |
|--------|-----|--------|
| Intake Form v2 | `ak-intake-form-premium-v2.jsx` | ✅ Ferdig |
| Player Intake | `ak-player-intake-v1.jsx` | ✅ Ferdig |
| Kategori Oversikt | `kategori_system_oversikt.jsx` | ✅ Ferdig |
| Benchmark Dashboard | `ak-benchmark-dashboard.jsx` | ✅ Ferdig |

**Total**: ~12,000+ linjer React-kode

### Backend/Data

| Komponent | Status | Versjon |
|-----------|--------|---------|
| **Kategori-system (A-K)** | ✅ **v2.0 Komplett** | 2.0 |
| **Team Norway tester** | ✅ **20 tester** | 2.0 |
| Spillerprofil JSON-schema | ✅ Ferdig | 1.0 |
| PEI-formel | ✅ Korrigert | 1.0 |
| Overgangskriterier | ✅ v2.0 | 2.0 |
| Konfidensintervaller | ✅ v2.0 | 2.0 |
| Database setup | ✅ PostgreSQL | 1.0 |
| Øvelsesdatabase (300+) | ❌ Mangler | - |
| Ukemaler (88 stk) | ❌ Mangler | - |
| Notion databaser | ⚠️ Delvis | - |

### Design System v2.1 ✅ KOMPLETT

**Status**: Alle 18 produksjonsskjermer migrert til v2.1

**Fargepalett - Forest Theme**:
- Primary: Forest `#1A3D2E`, Forest Light `#2D5A45`
- Accents: Foam `#F5F7F6`, Ivory `#FDFCF8`, Gold `#C9A227`
- Semantic: Success `#4A7C59`, Warning `#D4A84B`, Error `#C45B4E`
- Neutrals: Charcoal, Steel, Mist, Cloud

**Session Types** (Nytt i v2.1):
- 8 treningstype-farger harmonisert med forest theme
- Teknikk, Golfslag, Spill, Kompetanse, Fysisk, Funksjonell, Hjemme, Test

**Typografi**:
- Font: Inter (cross-platform, Apple HIG-inspired)
- Scale: Large Title (34px) → Caption 2 (11px)
- Icons: Lucide React, 24px, 1.5px stroke

**Implementering**:
- `design-tokens.js` - JavaScript tokens
- `tokens.css` - CSS custom properties
- `tailwind.config.js` - Tailwind config med full forest fargeskala

---

## 3. METODIKK OG RAMMEVERK

### Prosjektoversikt

**Visjon**: Skape "Norges beste arena for golfspillerutvikling" gjennom evidensbaserte treningsmetoder.

**Målgruppe**:
- Junior golfspillere 8-23 år
- B-nivå spillere (snittscore 74-76) som primær målgruppe
- 11-nivå kategorisystem fra A-K (OWGR/Rolex World Top 150 til junior klubbspillere)

**Samarbeidspartnere**:
- **AK Golf Academy** - Hovedaktør og metodikkutvikler
- **Team Norway Golf** - Nasjonalt rammeverk og testprotokoller
- **WANG Toppidrett Fredrikstad** - Utdanningspartner
- **GFGK (Gamle Fredrikstad Golfklubb)** - Hjemklubb

### Nøkkelfunn fra forskning

- Kun **0.006%** av golfspillere når profesjonelt nivå
- Junior-rangeringer **forutsier dårlig** profesjonell suksess
- Tidlig spesialisering før 12 år gir **3.76x høyere** utbrenningsrisiko
- Multi-sport deltakelse før 12 år anbefales sterkt

### AK Golf Academy metodikk

**Fem-prosess pyramide**:
1. **Teknisk** - Swing, slag-produksjon, ball-striking
2. **Fysisk** - Styrke, mobilitet, eksplosivitet, utholdenhet
3. **Mental** - Fokus, rutiner, spenningsregulering, visualisering
4. **Strategisk** - Banestrategi, spillevalg, risikovurdering
5. **Sosial** - Samarbeid, coaching-relasjon, teamdynamikk

**Bruddpunkt-konseptet**:
Identifiser og adresser systematisk svakheter som hindrer progresjon til neste kategori.

---

## 4. KATEGORI-SYSTEM A-K (OPPDATERT v2.0)

**Sist oppdatert**: 13. desember 2025
**Endringer**: Utvidet F-K kategorier, kjønnsjusterte krav, overgangskriterier, mental testing

### Oversikt kategorier med snittscore og alder

| Kategori | Nivå | Snittscore | Typisk alder | WAGR-mål | Norske referanser |
|----------|------|------------|--------------|----------|-------------------|
| **A** | World Elite | <68 | 18-22 | Top 150 | Viktor Hovland (17år: 71.7, 19år: 71.3) |
| **B** | National Elite | 68-72 | 17-20 | Top 500 | Bård Skogen (17år: 72.5, 19år: 72.05) |
| **C** | National U21 | 72-74 | 16-19 | Top 1500 | Team Norway landslag |
| **D** | Regional Elite | 74-76 | 15-18 | - | VG2-VG3 spillere |
| **E** | Regional U18 | 76-78 | 14-17 | - | VG1-VG2 spillere |
| **F** | Klubbspiller Senior | 78-80 | 15-17 | - | 10.kl-VG1 spillere |
| **G** | Klubbspiller Junior | 80-85 | 14-16 | - | 9.-10.kl spillere |
| **H** | Rekrutt Senior | 85-90 | 13-15 | - | 8.-9.kl spillere |
| **I** | Rekrutt Junior | 90-95 | 12-14 | - | 7.-8.kl spillere |
| **J** | Nybegynner Senior | 95-100 | 11-13 | - | Starter golf aktivt |
| **K** | Nybegynner Junior | 100+ | 8-11 | - | Introduksjon |

---

### Detaljerte krav per kategori (Menn/Kvinner)

#### KATEGORI A - World Elite (<68)

**Strokes Gained**:
- SG Total: +4.0 | SG Tee: +1.0 | SG Approach: +1.5 | SG Short Game: +0.5 | SG Putting: +1.0

**Teknisk**:
- Driver CS: 115+ mph (M) / 98+ mph (K)
- Driver Carry: 270+ m (M) / 230+ m (K)
- Jern 7 Carry: 170+ m (M) / 145+ m (K)
- Wedge PEI: <0.04

**Fysisk**:
- Benkpress: 90+ kg (M) / 50+ kg (K)
- Markløft trapbar: 140+ kg (M) / 90+ kg (K)
- Rotasjonskast 4kg: 14+ m (M) / 11+ m (K)
- Lengdehopp: 280+ cm (M) / 220+ cm (K)
- 3000m løp: <12:00 min (M) / <14:00 min (K)

**Mental/Strategisk**: Elite-nivå (se mental testing seksjon)

---

#### KATEGORI B - National Elite (68-72)

**Strokes Gained**:
- SG Total: +2.0 | SG Tee: +0.5 | SG Approach: +0.8 | SG Short Game: +0.3 | SG Putting: +0.4

**Teknisk**:
- Driver CS: 108-115 mph (M) / 92-98 mph (K)
- Driver Carry: 250-270 m (M) / 213-230 m (K)
- Jern 7 Carry: 160-170 m (M) / 136-145 m (K)
- Wedge PEI: <0.05

**Fysisk**:
- Benkpress: 75-90 kg (M) / 42-50 kg (K)
- Markløft trapbar: 120-140 kg (M) / 75-90 kg (K)
- Rotasjonskast 4kg: 12-14 m (M) / 9.5-11 m (K)
- Lengdehopp: 260-280 cm (M) / 205-220 cm (K)
- 3000m løp: 12-13 min (M) / 14-15 min (K)

**Mental/Strategisk**: Høyt nivå

---

#### KATEGORI C - National U21 (72-74)

**Strokes Gained**:
- SG Total: 0 | SG Tee: 0 | SG Approach: 0 | SG Short Game: 0 | SG Putting: 0

**Teknisk**:
- Driver CS: 100-108 mph (M) / 85-92 mph (K)
- Driver Carry: 230-250 m (M) / 195-213 m (K)
- Jern 7 Carry: 150-160 m (M) / 127-136 m (K)
- Wedge PEI: <0.06

**Fysisk**:
- Benkpress: 60-75 kg (M) / 35-42 kg (K)
- Markløft trapbar: 100-120 kg (M) / 60-75 kg (K)
- Rotasjonskast 4kg: 10-12 m (M) / 8-9.5 m (K)
- Lengdehopp: 240-260 cm (M) / 190-205 cm (K)
- 3000m løp: 13-14 min (M) / 15-16 min (K)

**Mental/Strategisk**: Middels-høyt nivå

---

#### KATEGORI D - Regional Elite (74-76)

**Strokes Gained**:
- SG Total: -2.0 | SG Tee: -0.5 | SG Approach: -0.7 | SG Short Game: -0.4 | SG Putting: -0.4

**Teknisk**:
- Driver CS: 92-100 mph (M) / 78-85 mph (K)
- Driver Carry: 210-230 m (M) / 178-195 m (K)
- Jern 7 Carry: 140-150 m (M) / 119-127 m (K)
- Wedge PEI: <0.07

**Fysisk**:
- Benkpress: 50-60 kg (M) / 30-35 kg (K)
- Markløft trapbar: 80-100 kg (M) / 48-60 kg (K)
- Rotasjonskast 4kg: 8-10 m (M) / 6.5-8 m (K)
- Lengdehopp: 220-240 cm (M) / 175-190 cm (K)
- 3000m løp: 14-15 min (M) / 16-17 min (K)

**Mental/Strategisk**: Middels nivå

---

#### KATEGORI E - Regional U18 (76-78)

**Strokes Gained**:
- SG Total: -5.0 | SG Tee: -1.5 | SG Approach: -1.5 | SG Short Game: -1.0 | SG Putting: -1.0

**Teknisk**:
- Driver CS: 85-92 mph (M) / 72-78 mph (K)
- Driver Carry: 190-210 m (M) / 161-178 m (K)
- Jern 7 Carry: 125-140 m (M) / 106-119 m (K)
- Wedge PEI: <0.08

**Fysisk**:
- Benkpress: 40-50 kg (M) / 25-30 kg (K)
- Markløft trapbar: 60-80 kg (M) / 38-48 kg (K)
- Rotasjonskast 4kg: 6-8 m (M) / 5-6.5 m (K)
- Lengdehopp: 200-220 cm (M) / 160-175 cm (K)
- 3000m løp: 15-16 min (M) / 17-18 min (K)

**Mental/Strategisk**: Grunnleggende-middels nivå

---

#### KATEGORI F - Klubbspiller Senior (78-80) ⭐ OPPDATERT

**Strokes Gained**:
- SG Total: -6.5 | SG Tee: -1.8 | SG Approach: -2.0 | SG Short Game: -1.5 | SG Putting: -1.2

**Teknisk**:
- Driver CS: 82-88 mph (M) / 70-75 mph (K)
- Driver Carry: 175-190 m (M) / 148-161 m (K)
- Jern 7 Carry: 120-130 m (M) / 102-110 m (K)
- Wedge PEI: <0.09

**Fysisk**:
- Benkpress: 35-45 kg (M) / 22-28 kg (K)
- Markløft trapbar: 55-70 kg (M) / 35-45 kg (K)
- Rotasjonskast 4kg: 5.5-7 m (M) / 4.5-5.5 m (K)
- Lengdehopp: 180-200 cm (M) / 145-160 cm (K)
- 3000m løp: 16-17 min (M) / 18-19 min (K)

**Mental/Strategisk**: Grunnleggende nivå (se mental testing)

---

#### KATEGORI G - Klubbspiller Junior (80-85) ⭐ OPPDATERT

**Strokes Gained**:
- SG Total: -8.0 | SG Tee: -2.2 | SG Approach: -2.5 | SG Short Game: -2.0 | SG Putting: -1.3

**Teknisk**:
- Driver CS: 78-84 mph (M) / 66-71 mph (K)
- Driver Carry: 165-180 m (M) / 140-153 m (K)
- Jern 7 Carry: 110-120 m (M) / 93-102 m (K)
- Wedge PEI: <0.10

**Fysisk**:
- Benkpress: 30-40 kg (M) / 18-25 kg (K)
- Markløft trapbar: 45-60 kg (M) / 30-40 kg (K)
- Rotasjonskast 4kg: 5-6.5 m (M) / 4-5 m (K)
- Lengdehopp: 160-180 cm (M) / 130-145 cm (K)
- 3000m løp: 17-18 min (M) / 19-20 min (K)

**Mental/Strategisk**: Introduksjon til mental trening

---

#### KATEGORI H - Rekrutt Senior (85-90) ⭐ OPPDATERT

**Strokes Gained**:
- SG Total: -10.0 | SG Tee: -2.8 | SG Approach: -3.0 | SG Short Game: -2.5 | SG Putting: -1.7

**Teknisk**:
- Driver CS: 74-80 mph (M) / 63-68 mph (K)
- Driver Carry: 155-170 m (M) / 131-144 m (K)
- Jern 7 Carry: 100-110 m (M) / 85-93 m (K)
- Wedge PEI: <0.12

**Fysisk**:
- Mobility baseline: Grunnleggende bevegelighet (FMS score >12)
- Core strength: Planke 60 sek, Side-planke 45 sek/side
- Rotasjon: Basic rotasjonsøvelser med egen kroppsvekt
- Golf-spesifikk styrke: Introduksjon til kettlebell, motstands-bånd

**Mental/Strategisk**: Fokus på rutiner og konsentrasjon

---

#### KATEGORI I - Rekrutt Junior (90-95) ⭐ OPPDATERT

**Strokes Gained**:
- SG Total: -12.0 | SG Tee: -3.5 | SG Approach: -3.5 | SG Short Game: -3.0 | SG Putting: -2.0

**Teknisk**:
- Driver CS: 70-76 mph (M) / 59-64 mph (K)
- Driver Carry: 145-160 m (M) / 123-136 m (K)
- Jern 7 Carry: 90-100 m (M) / 76-85 m (K)
- Wedge PEI: <0.14

**Fysisk**:
- Mobility: Grunnleggende fleksibilitet og koordinasjon
- Multi-sport aktivitet: Anbefalt 2-3 andre idretter (fotball, svømming, etc.)
- Golf-spesifikk: Lette øvelser med fokus på bevegelsesmønster
- Generell utholdenhet: Aktiv lek/sport 5-7 dager/uke

**Mental/Strategisk**: Lek-basert læring, grunnleggende regler

---

#### KATEGORI J - Nybegynner Senior (95-100) ⭐ OPPDATERT

**Strokes Gained**:
- SG Total: -14.0 | SG Tee: -4.0 | SG Approach: -4.0 | SG Short Game: -3.5 | SG Putting: -2.5

**Teknisk**:
- Driver CS: 65-72 mph (M) / 55-61 mph (K)
- Driver Carry: 130-145 m (M) / 110-123 m (K)
- Jern 7 Carry: 80-90 m (M) / 68-76 m (K)
- Wedge PEI: <0.16

**Fysisk**:
- Generell fitness: Grunnleggende kondisjon
- Mobility: Fokus på bevegelsesområde (ROM) for golf-sving
- Styrke: Kroppsvekt-øvelser (squats, lunges, push-ups)
- Balanse: Grunnleggende balanseøvelser

**Mental/Strategisk**: Glede og motivasjon, sosial golf

---

#### KATEGORI K - Nybegynner Junior (100+) ⭐ OPPDATERT

**Strokes Gained**:
- SG Total: -16.0+ | SG Tee: -5.0 | SG Approach: -5.0 | SG Short Game: -4.0 | SG Putting: -2.0

**Teknisk**:
- Driver CS: <65 mph (M) / <55 mph (K)
- Driver Carry: <130 m (M) / <110 m (K)
- Jern 7 Carry: <80 m (M) / <68 m (K)
- Wedge PEI: Ikke relevant (fokus på treff)

**Fysisk**:
- **VIKTIG**: Multi-sport til 12 år (reduserer utbrenningsrisiko 3.76x)
- Koordinasjon og motorikk: Lek-basert utvikling
- Generell aktivitet: 60 min aktivitet per dag (WHO anbefaling)
- Golf-spesifikk: Maks 2-4 timer/uke golf

**Mental/Strategisk**: Lek, moro, sosial utvikling

---

### Overgangskriterier mellom kategorier

**VIKTIG**: For å "rykke opp" til neste kategori må ALLE disse oppfylles:

#### Generelle krav (alle kategorier):

1. **Konsistent score** (3-måneders regel)
   - Snittscore må være stabilt i mål-kategoriens område i minimum 3 måneder
   - Minimum 10 tellende runder (18-hulls)
   - Maks 2 "outlier" runder (unormalt høye/lave)

2. **Fysisk modenhet** (2 av 3 tester)
   - Minst 2 av 3 fysiske tester må være oppfylt
   - Forhindrer skader ved for tidlig opprykk
   - Ved tvil: hold tilbake 1-2 måneder

3. **Benchmark-test** (hver 3. måned)
   - Gjennomført i offisiell benchmark-uke (uke 3, 6, 9, 12, osv.)
   - Minimum 4 av 7 golf-tester oppfylt
   - Trener bekrefter teknisk modenhet

4. **Mental modenhet** (trener-vurdering)
   - Pre-shot rutine konsistens >70%
   - Håndterer press (evalueres i turnering)
   - Positiv innstilling til trening

#### Eksempel: E → D overgang

```
Spiller (16 år):
✅ Snittscore: 75.8 (3 måneder, 12 runder)
✅ Driver CS: 93 mph (krav: 92+)
✅ Benkpress: 52 kg (krav: 50+)
❌ Markløft: 75 kg (krav: 80+)
✅ Rotasjonskast: 8.2 m (krav: 8+)
✅ Benchmark: 5 av 7 tester bestått
✅ Mental: Trener godkjenner

RESULTAT: Godkjent for D (2 av 3 fysiske + alle andre krav)
→ Oppstart D-treningsplan neste måned
```

#### Hybrid-kategorier

**Når brukes**: Spiller på grensen (f.eks. score 76.2, mellom D og E)

```
Spiller kategoriseres som "D/E hybrid"

Treningsplan:
- 70% E-plan (trygg base)
- 30% D-plan (utfordring)

Evaluering:
- Hver 3. måned (benchmark-uker)
- Øk D-andel gradvis (70/30 → 50/50 → 30/70 → 100% D)
- Full D når 3 måneder konsekvent < 76
```

---

### Forventet årlig forbedring (med konfidensintervaller)

| Alder | Gjennomsnitt | 80% intervall | 95% intervall |
|-------|--------------|---------------|---------------|
| 13-15 år | **3-5 slag/år** | 2-6 slag/år | 0-8 slag/år |
| 15-17 år | **2-3 slag/år** | 1-4 slag/år | 0-6 slag/år |
| 17-19 år | **1-2 slag/år** | 0.5-3 slag/år | 0-5 slag/år |
| 19+ år | **0.5-1 slag/år** | 0-2 slag/år | -1-3 slag/år |

**Tolkning**:
- Gjennomsnitt: Forventet forbedring for "normal" utvikling
- 80% intervall: 8 av 10 spillere forbedres innenfor dette
- 95% intervall: 19 av 20 spillere forbedres innenfor dette

**Viktig observasjon**: Spillere som oppnår snittscore ~72-73 ved 17-18 års alder har best prognose for videre eliteutvikling.

---

### Mental og strategisk testing

#### Mental-tester (4 offisielle tester)

**Test 15: Pressure Putting**
- 10 putts @ 2 meter, eliminering (miss = ute)
- Måler: % suksess under press vs. baseline
- Kategori-krav: A: 90%+, B: 80%+, C: 70%+, D: 60%+, E-K: 50%+

**Test 16: Pre-shot Rutine Konsistens**
- Videoanalyse 18 hull, måler konsistens i:
  - Tid (±2 sek variasjon)
  - Bevegelser (samme sekvens)
  - Fokuspunkter
- Kategori-krav: A: 90%+, B: 80%+, C: 70%+, D-K: 60%+

**Test 17: Fokus under distraksjon**
- Øvelse med planlagte distraksjoner (lyd, bevegelse, kommentarer)
- Måler: % treff innenfor target vs. baseline
- Kategori-krav: A: <5% reduksjon, B: <10%, C: <15%, D-K: <20%

**Test 18: Mental Toughness Questionnaire**
- Standardisert spørreskjema (MTQ48 eller lignende)
- Måler: Mental styrke, resiliens, selvtillit, kontroll
- Kategori-krav: Vurderes kvalitativt av trener

#### Strategisk testing

**Test 19: Klubbvalg og Risikovurdering**
- 20 scenarios (bilder av lies, distanser, vind)
- Spiller velger klubb og strategi (safe/aggressive)
- Måler: % optimale valg (sammenlignet med ekspertpanel)
- Kategori-krav: A: 85%+, B: 75%+, C: 65%+, D-K: 50%+

**Test 20: Banestrategi-planlegging**
- Gitt bane-layout, spiller planlegger 18 hull
- Vurderes på: Risikostyring, klubbvalg, par-5 strategi, pin-posisjon respons
- Kategori-krav: A-C: Detaljert plan, D-K: Grunnleggende plan

---

## 5. PERIODISERING

### Årsplan Uke 43-42 (52 uker)

**4 Perioder**:

#### 1. EVALUERINGSPERIODE (Uke 43-46, 4 uker)
**Fokus**: Refleksjon, testing, målsetting
- **Intensitet**: E (Evaluering)
- **Innhold**: Avslutning av sesong, testing, analyse av forrige år
- **Output**: IUP for neste år, målsettinger, benchmarking-resultater

#### 2. GRUNNPERIODE (Uke 47-12, 18 uker)
**Fokus**: Bygge fundamentet
- **Intensitet**: G (Grunn)
- **Innhold**: Fysisk oppbygging, tekniske fundamentals, høy treningsmengde
- **Distribusjon**:
  - Teknikk: 40%
  - Fysisk: 30%
  - Shortgame: 20%
  - Mental: 10%

#### 3. SPESIALISERINGSPERIODE (Uke 13-25, 13 uker)
**Fokus**: Golf-spesifikk utvikling
- **Intensitet**: S (Spesialisering)
- **Innhold**: Golf-spesifikk styrke, variasjonstrening, simulert spill
- **Distribusjon**:
  - Shortgame/Putting: 35%
  - Teknikk: 30%
  - Spill/Strategi: 20%
  - Fysisk: 15%

#### 4. TURNERINGSPERIODE (Uke 26-42, 17 uker)
**Fokus**: Prestasjon og konkurransegjennomføring
- **Intensitet**: T (Turnering)
- **Innhold**: Tapering, skarpe turneringer, vedlikehold
- **Distribusjon**:
  - Spill/Turneringer: 50%
  - Shortgame/Putting: 25%
  - Teknikk (vedlikehold): 15%
  - Mental/Strategi: 10%

### Benchmark-uker (hver 3. uke)
**Uke 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42**
- Gjennomfør 4-7 av de 14 offisielle testene
- Evaluér progresjon mot kravprofil
- Justér treningsplan basert på resultater

---

## 6. TRENINGSNIVÅ-SYSTEM

### L-faser (Læringsfaser 1-5)

**L1: Eksponering**
- Introduksjon til ny ferdighet
- Bevisstgjøring og forståelse
- Lav kompleksitet, høy støtte

**L2: Fundamentals**
- Etablere grunnleggende teknikk
- Repetisjon i enkle betingelser
- Fokus på korrekt utførelse

**L3: Variasjon**
- Introdusere variasjon i utførelse
- Forskjellige lies, avstander, betingelser
- Begynne å generalisere ferdigheten

**L4: Timing og Flow**
- Integrere ferdighet i sving/spillflyt
- Arbeide med rytme og timing
- Redusere bevissthet, øke automatisering

**L5: Automatisering**
- Ferdighet under press
- Minimal kognitiv belastning
- Konkurranseoverføring

### S-settings (Trenings-settinger 1-10)

**S1**: Range, perfekte betingelser, ubegrenset med baller
**S2**: Range, varierende targets, strukturert økt
**S3**: Kortbane/øvingsgreen, simulert spill
**S4**: 9-hulls treningsrunde, fokusområde
**S5**: 18-hulls treningsrunde, prosessmål
**S6**: Treningsrunde med press (intern konkurranse)
**S7**: Treningsrunde med ekstern konkurranse (klubb)
**S8**: Lavinnsats turnering (TRENING-kategori)
**S9**: Viktig turnering (UTVIKLING-kategori)
**S10**: Høyinnsats turnering (RESULTAT-kategori)

### CS-nivåer (Clubspeed-progression)

**CS20**: 20% av målhastighet for kategorien
**CS30**: 30% av målhastighet
**CS40**: 40% av målhastighet
**CS50**: 50% av målhastighet (komfortsone)
**CS60**: 60% av målhastighet
**CS70**: 70% av målhastighet (konkurransehastighet)
**CS80**: 80% av målhastighet
**CS90**: 90% av målhastighet
**CS100**: 100% av målhastighet (maksimal hastighet)

### AK-formel for øktbeskrivelse

```
Økt = L[fase] + CS[nivå] + S[setting] + [Underlag] + [Område]
```

**Eksempel**:
`L3_CS60_S2_Mat_Full-Swing` = Variasjonstrening, 60% hastighet, range, på matte, full sving

---

## 7. TESTER OG KRAVPROFILER

### 14 Offisielle Team Norway Tester

#### Golf Shots (1-7)
1. **Driver avstand** (carry, meter)
2. **Jern 7 avstand** (carry, meter)
3. **Jern 7 nøyaktighet** (6 slag til target)
4. **Wedge PEI** (Precision Efficiency Index)
5. **Lag-kontroll putting** (9 putts, 3-6-9 meter)
6. **Lesing putting** (6 putts, 3 meter med break)
7. **Bunker** (10 slag, % innenfor 3m)

#### Teknikk (8-11)
8. **Klubbfart driver** (Clubspeed, mph)
9. **Smash factor driver** (Ball speed / Club speed)
10. **Launch angle driver** (grader)
11. **Spin rate driver** (rpm)

#### Fysisk (12-14)
12. **Benkpress** (1RM, kg)
13. **Markløft trapbar** (1RM, kg)
14. **Rotasjonskast 4kg medisinball** (distanse, meter)

### PEI-formel (Precision Efficiency Index)

```
PEI = (Gjennomsnittlig avstand fra hull i meter) / (Ideal approach-distanse for kategorien)
```

**Eksempel kategori D**:
- Ideal approach-distanse: 140m
- Gjennomsnittlig avvik: 9.5m
- PEI = 9.5 / 140 = 0.068

**Tolkning**:
- <0.05 = Utmerket
- 0.05-0.07 = Bra
- 0.07-0.10 = Gjennomsnitt
- >0.10 = Svakt område (bruddpunkt)

---

## 8. NOTION DATABASE-STRUKTUR

### 11 Notion-databaser (0% bygget, 56,700 tokens)

#### Database 1: SPILLERE (1,200 tokens)
| Felt | Type |
|------|------|
| Navn | Title |
| Kategori | Select (A-K) |
| Alder | Number |
| Snittscore 10 runder | Number |
| Snittscore 12 måneder | Number |
| Klubb | Text |
| Status | Select (Aktiv/Inaktiv/Pause) |
| Bruddpunkter | Multi-select |
| Hovedmål | Text |
| Treningsplan | Relation → Periodisering |
| Tester | Relation → Tester |

#### Database 2: PERIODISERING (1,500 tokens)
| Felt | Type |
|------|------|
| Ukenummer | Title (Uke 43-42) |
| Spiller | Relation → Spillere |
| Periode | Select (Grunn/Spes/Turnering/Overgang) |
| Intensitet | Select (E/G/S/T) |
| Hovedfokus | Multi-select (Teknikk/Fysisk/etc) |
| Timer totalt | Number |
| L-fase | Select (L1-L5) |
| Setting | Select (S1-S10) |
| CS-nivå | Select (CS20-CS100) |
| Ukemål | Text |
| Treningsøkter | Relation → Treningsøkter |
| Benchmark | Checkbox |

#### Database 3: TRENINGSØKTER (12,000 tokens for 150 økter)
| Felt | Type |
|------|------|
| Øktnavn | Title |
| Kategori | Multi-select (A-K) |
| Type | Select (Teknikk/Shortgame/Putting/Fysisk/Mental/Spill) |
| Periode | Multi-select (Grunn/Spes/Turnering) |
| Varighet | Number (minutter) |
| L-fase | Select (L1-L5) |
| Setting | Select (S1-S10) |
| CS-nivå | Select (CS20-CS100) |
| Hovedfokus | Multi-select (5-prosess) |
| Beskrivelse | Text |
| Deløvelser | Relation → Øvelser |
| Mål | Text |

#### Database 4: ØVELSER (25,000 tokens for 300+ drills)
| Felt | Type |
|------|------|
| Øvelsesnavn | Title |
| Type | Select (Teknikk/Shortgame/Putting/Fysisk/Mental) |
| L-fase | Select (L1-L5) |
| Setting | Select (S1-S10) |
| CS-nivå | Select (CS20-CS100) |
| Beskrivelse | Text |
| Reps/Tid | Text |
| Utstyr | Multi-select |
| Progresjon | Text |
| Video-lenke | URL |
| Prosess | Select (5-prosess) |

#### Database 5: TESTER (1,500 tokens)
| Felt | Type |
|------|------|
| Testnavn | Title (Test 1-14) |
| Spiller | Relation → Spillere |
| Dato | Date |
| Uke | Number |
| Resultat | Number |
| Krav for kategori | Number |
| Differanse | Formula (Resultat - Krav) |
| Kategori testet som | Select (A-K) |
| Notater | Text |
| Godkjent | Checkbox |

#### Database 6: TURNERINGER (1,200 tokens)
| Felt | Type |
|------|------|
| Turneringsnavn | Title |
| Dato | Date |
| Kategori | Select (RESULTAT/UTVIKLING/TRENING) |
| Prioritet | Select (Høy/Middels/Lav) |
| Spillere | Relation → Spillere |
| Uke | Number |
| Taperingsplan | Text |
| Mål | Text |
| Resultat | Number |
| Notater | Text |

#### Database 7: BENCHMARKING (1,000 tokens)
| Felt | Type |
|------|------|
| Spiller | Relation → Spillere |
| Uke | Number |
| Dato | Date |
| Tester gjennomført | Relation → Tester |
| Oppsummering | Text |
| Justeringer | Text |
| Neste benchmark | Date |

#### Database 8: UKEPLANER TEMPLATES (12,500 tokens for 88 templates)
| Felt | Type |
|------|------|
| Template-navn | Title |
| Kategori | Select (A-K) |
| Periode | Select (Grunn/Spes/Turnering/Overgang) |
| Variant | Select (Standard/Intensiv/Lett) |
| Timer per uke | Number |
| Mandag-Søndag | Relation → Treningsøkter (7 felt) |
| Distribusjon | Text |
| Fridag | Number (1-7) |
| Notater | Text |

#### Database 9: BRUDDPUNKTER (1,000 tokens)
| Felt | Type |
|------|------|
| Bruddpunkt | Title |
| Spiller | Relation → Spillere |
| Kategori | Select (5-prosess) |
| Alvorlighetsgrad | Select (Kritisk/Høy/Middels/Lav) |
| Identifisert dato | Date |
| Treningsplan | Text |
| Øvelser | Relation → Øvelser |
| Fremdrift | Select (Ikke startet/Pågår/Løst) |
| Evaluering | Date |

#### Database 10: PROGRESJON/LOGG (1,200 tokens)
| Felt | Type |
|------|------|
| Dato | Date |
| Spiller | Relation → Spillere |
| Økt planlagt | Relation → Treningsøkter |
| Gjennomført | Checkbox |
| Varighet faktisk | Number |
| Intensitet | Select (Lav/Middels/Høy) |
| Kvalitet | Select (1-5) |
| Notater | Text |
| Neste fokus | Text |

#### Database 11: REFERANSER (800 tokens)
| Felt | Type |
|------|------|
| Tittel | Title |
| Type | Select (Artikkel/Video/PDF/Bok) |
| Kategori | Multi-select (5-prosess) |
| URL/Fil | URL/File |
| Sammendrag | Text |
| Nøkkelord | Multi-select |
| Brukt i | Relation → Treningsøkter/Øvelser |

---

## 9. TOKEN-STRATEGI

### Modulær arbeidsprosess

**TRINN 1: Validering & Kategorisering** (500-1000 tokens)
- Ta imot JSON-data
- Kategoriser spilleren (A–K)
- Generer kort spillerprofil
- Identifiser bruddpunkter og hovedmål
- STOPP → Få bekreftelse før vi fortsetter

**TRINN 2: Makroplan** (2000-3000 tokens)
- Komplett årsplan uke 43–42 (tabell)
- Periodeinndeling
- Turneringskategorisering og plassering
- Månedlige prioriteringer
- Benchmarking-oversikt
- STOPP → Få bekreftelse før detaljering

**TRINN 3: Mikroplan** (på forespørsel)
- 3a: Ukeplaner for én periode om gangen
- 3b: Detaljerte økter for valgte uker
- 3c: Benchmarking-protokoller for spesifikke testpunkter

### Smart dokumenthåndtering

**Project Knowledge Search-strategi**:
- Kategorisering: `kategori system A-K snittscore`
- Periodisering: `periodisering uke 43-42 [kategori]`
- Økter: `treningsøkter [L-fase] [setting]`
- Tester: `test protokoll [spesifikk test]`

### Template-basert generering

**8 hovedtemplates** (Kategori C-G × 4 perioder)
Juster kun turneringsuker og benchmark-uker

### Token-besparende tips

❌ **IKKE SI**:
- "Bygg alle 11 databaser på én gang" (→ 56,700 tokens, kaotisk)
- "Lag 300 øvelser nå" (→ 25,000 tokens, overveldende)
- "Les hele Team Norway IUP 2026 og forklar alt" (→ 20,000+ tokens bortkastet)

✅ **SI HELLER**:
- "Bygg Database 1 og 2 (Spillere + Periodisering)" (→ 2,700 tokens, strukturert)
- "Lag 20 teknikk-øvelser for kategori D-G, Grunnperiode" (→ 2,000 tokens, fokusert)
- "Søk i project knowledge: kategori D periodisering grunnperiode" (→ 1,000 tokens, presis)

---

## 10. UTVIKLINGSPLAN

### Fase 1: Kjerne-databaser (20,000 tokens / 5 økter / 2 uker)

**Økt 1**: Spillere + Periodisering (2,700 tokens)
**Økt 2**: Tester + Benchmarking (2,500 tokens)
**Økt 3**: Treningsøkter 1-20 (4,000 tokens)
**Økt 4**: Ukeplaner Templates 1-10 (5,000 tokens)
**Økt 5**: Turneringer (1,200 tokens)

**Validering**: 1 spiller kan navigere 12-ukers plan

### Fase 2: Øvelsesbank (30,000 tokens / 6 økter / 2 uker)

**Økt 6-7**: Teknikk-øvelser (100 drills, 10,000 tokens)
**Økt 8-9**: Shortgame + Putting (100 drills, 10,000 tokens)
**Økt 10-11**: Fysisk + Mental (100 drills, 10,000 tokens)

**Validering**: 300+ øvelser, alle L-faser og Settings dekket

### Fase 3: Skalering (18,000 tokens / 4 økter / 2 uker)

**Økt 12**: Treningsøkter 21-150 (8,000 tokens)
**Økt 13-14**: Ukeplaner Templates 11-88 (7,500 tokens)
**Økt 15**: Support-databaser (Bruddpunkter, Progresjon, Referanser) (2,500 tokens)

**Validering**: Komplett system for alle kategorier A-K

### Progresjonstracking

| Fase | Økter | Tokens | Forventet tid |
|------|-------|--------|---------------|
| Fase 1 | 1-5 | 20,000 | 2 uker |
| Fase 2 | 6-11 | 30,000 | 2 uker |
| Fase 3 | 12-15 | 18,000 | 2 uker |
| **TOTAL** | **15** | **68,000** | **6 uker** |

### Success Metrics

**Fase 1 komplett når**:
- 1 spiller kan navigere gjennom 12 uker
- Periodisering automatisk populeres
- Ukeplaner vises korrekt
- Tester er koblet til benchmark-uker
- Turneringer ligger i riktig uke

**Fase 2 komplett når**:
- 300+ øvelser i databasen
- Alle L-faser, Settings, CS-nivåer dekket
- Øvelser koblet til økter
- Progresjon dokumentert

**Fase 3 komplett når**:
- 150+ treningsøkter
- 88 uke-templates
- Alle 11 kategorier dekket
- Alle 4 perioder dekket
- Support-databaser operasjonelle

---

## APPENDIKS

### Prosjektstruktur

```
IUP_Master_Folder/
├── Screens/                    # 22 JSX filer (18 prod + 4 eksempler)
│   ├── AKGolfDashboard.jsx
│   ├── ak_golf_brukerprofil_onboarding.jsx
│   ├── utviklingsplan_b_nivaa.jsx
│   ├── [... 15 andre produksjonsfiler]
│   └── [4 eksempel/referanse-filer]
│
├── Docs/                       # Dokumentasjon
│   ├── MASTER_PROSJEKTDOKUMENT.md (denne filen)
│   ├── APP_STATUS.md           # Konsolidert statusrapport
│   ├── DESIGN_SYSTEM_COMPLETE.md # Design system v2.1 guide
│   ├── IUP_SKJERM_OVERSIKT.md
│   └── Archive/                # 11 arkiverte guider
│       ├── APP_IMPLEMENTERING_PLAN.md
│       ├── BACKEND_SETUP_GUIDE.md
│       ├── REACT_NATIVE_CONVERSION_GUIDE.md
│       └── [8 andre arkiverte filer]
│
├── Design/                     # Design-filer
│   └── ak_golf_design_system_v2.1.svg
│
├── Data/                       # Excel-data
│   ├── Team_Norway_IUP_2026.xlsx
│   ├── Team_Norway_Training_Protocols.xlsx
│   ├── Team_Norway_Kravprofil_Oppdatert.xlsx
│   ├── Team_Norway_Tester_Scorekort_Spiller.xlsx
│   ├── Historisk_Snittscore_Total_Herrer.xlsx
│   ├── PEI_Scoreforing.xlsx
│   ├── Golf_Styrke-25.xlsx
│   └── AK_Golf_Academy_Team_Norway_Kategori_System_Oversikt.xlsx
│
├── Pdf/                        # PDF-dokumentasjon
│   ├── Treningsplan_2026.pdf
│   ├── Team_Norway_Tester.pdf
│   ├── team-norway-golf.pdf
│   ├── Science_Based_Golf_Training_Progression_System.pdf
│   └── WANG_Golf_6_Year_Plan.pdf
│
├── Reference_Materials/        # Referanse-materialer
├── files/                      # Booking system (ekstra)
│
├── design-tokens.js           # Design System v2.1 tokens
├── tokens.css                 # CSS custom properties
├── tailwind.config.js         # Tailwind configuration
└── database_setup.sql         # PostgreSQL database schema
```

### Viktige dokumenter

**Aktiv dokumentasjon** (i Docs/):
- **MASTER_PROSJEKTDOKUMENT.md** - Denne filen (komplett oversikt)
- **APP_STATUS.md** - Detaljert status for alle 18 skjermer
- **DESIGN_SYSTEM_COMPLETE.md** - Design system v2.1 guide
- **IUP_SKJERM_OVERSIKT.md** - Skjermspesifikasjoner

**Arkivert** (i Docs/Archive/):
- Implementeringsguider (ferdigstilt)
- Setup-guider (ferdigstilt)
- Konverteringsguider (referanse)
- Design-migreringsguider (historisk)

### Rask-tilgang

**For utvikling**:
- Design tokens: `design-tokens.js`
- Skjermfiler: `Screens/*.jsx`
- Database: `database_setup.sql`

**For data/testing**:
- Excel-data: `Data/*.xlsx`
- PDF-referanser: `Pdf/*.pdf`

**For dokumentasjon**:
- Status: `Docs/APP_STATUS.md`
- Design: `Docs/DESIGN_SYSTEM_COMPLETE.md`
- Komplett: `Docs/MASTER_PROSJEKTDOKUMENT.md`

---

**DOKUMENTET ER KOMPLETT**
**Versjon 2.1 - Oppdatert 14. desember 2025**
**Klar for implementering**
