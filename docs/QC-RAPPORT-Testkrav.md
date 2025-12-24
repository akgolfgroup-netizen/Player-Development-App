# Kvalitetskontroll - Testkrav

> Sammenligning mellom CONFIG_KATEGORI_KRAV.md og faktiske data i kodebasen.
> Dato: 2025-12-21

---

## OPPSUMMERING

| Status | Antall |
|--------|--------|
| ✅ Matcher | 8 tester |
| ⚠️ Avvik i kode vs docs | 3 tester |
| ❌ Mangler i kildekode | 2 tester |

---

## ✅ MATCHER PERFEKT

### Golf Avstand (Test 1-4)

| Test | CONFIG | category-requirements.ts | Status |
|------|--------|--------------------------|--------|
| Driver Carry | A:270, D:240, K:170 | A:270, D:240, K:170 | ✅ |
| 3-Tre Carry | A:250, D:220, K:150 | A:250, D:220, K:150 | ✅ |
| 5-Jern Carry | A:190, D:175, K:140 | A:190, D:175, K:140 | ✅ |
| Wedge PW | A:130, D:115, K:80 | A:130, D:115, K:80 | ✅ |

### Golf Hastighet (Test 5-7)

| Test | CONFIG | category-requirements.ts | Status |
|------|--------|--------------------------|--------|
| Clubhead Speed | A:193, D:169, K:113 km/h | A:193, D:169, K:113 km/h | ✅ |
| Ball Speed | A:285, D:240, K:145 km/h | A:285, D:240, K:145 km/h | ✅ |
| Smash Factor | A:1.48, D:1.42, K:1.28 | A:1.48, D:1.42, K:1.28 | ✅ |

### Approach PEI (Test 8-11)

| Test | CONFIG | category-requirements.ts | Status |
|------|--------|--------------------------|--------|
| PEI alle distanser | A:1.0, D:1.6, K:3.0 | A:1.0, D:1.6, K:3.0 | ✅ |

---

## ⚠️ AVVIK: KODE VS DOKUMENTASJON

### Fysiske Tester - VIKTIG AVVIK!

**DATABASE_FORMLER_KOMPLETT.md sier:**
- Test 12: Benkpress (1RM kg)
- Test 13: Markløft Trapbar (1RM kg)
- Test 14: Rotasjonskast 4kg (meter)

**category-requirements.ts har:**
- Test 12: Pull-ups (reps)
- Test 13: Plank (seconds)
- Test 14: Vertical Jump (cm)

| Kilde | Test 12 | Test 13 | Test 14 |
|-------|---------|---------|---------|
| DATABASE_FORMLER_KOMPLETT.md | Benkpress | Markløft Trapbar | Rotasjonskast |
| category-requirements.ts | Pull-ups | Plank | Vertical Jump |

**ANBEFALING:** Avklar hvilke fysiske tester som er korrekte!

---

## ❌ MANGLER I KILDEKODE

### CMJ (Counter Movement Jump)
- **CONFIG har:** Ja, med krav per kategori
- **category-requirements.ts:** Ikke definert
- **Status:** Må legges til i kode

### 3000m Løping
- **CONFIG har:** Ja, med tider per kategori
- **category-requirements.ts:** Ikke definert
- **Status:** Må legges til i kode

---

## DETALJERT SAMMENLIGNING

### Driver Carry (Test 1) - ✅ OK

| Kat | CONFIG (M) | Kode (M) | CONFIG (K) | Kode (K) |
|-----|------------|----------|------------|----------|
| A | 270 | 270 | 240 | 240 |
| B | 260 | 260 | 230 | 230 |
| C | 250 | 250 | 220 | 220 |
| D | 240 | 240 | 210 | 210 |
| E | 230 | 230 | 200 | 200 |
| F | 220 | 220 | 190 | 190 |
| G | 210 | 210 | 180 | 180 |
| H | 200 | 200 | 170 | 170 |
| I | 190 | 190 | 160 | 160 |
| J | 180 | 180 | 150 | 150 |
| K | 170 | 170 | 140 | 140 |

### Clubhead Speed (Test 5) - ✅ OK

| Kat | CONFIG (M) | Kode (M) | CONFIG (K) | Kode (K) |
|-----|------------|----------|------------|----------|
| A | 193 | 193 | 169 | 169 |
| B | 185 | 185 | 161 | 161 |
| C | 177 | 177 | 153 | 153 |
| D | 169 | 169 | 145 | 145 |
| E | 161 | 161 | 137 | 137 |
| F | 153 | 153 | 129 | 129 |
| G | 145 | 145 | 121 | 121 |
| H | 137 | 137 | 113 | 113 |
| I | 129 | 129 | 105 | 105 |
| J | 121 | 121 | 97 | 97 |
| K | 113 | 113 | 89 | 89 |

### Fysiske Tester - ⚠️ AVVIK

**I category-requirements.ts (Test 12 = Pull-ups):**
| Kat | Menn | Kvinner |
|-----|------|---------|
| A | 15 | 10 |
| B | 12 | 8 |
| C | 10 | 6 |
| D | 8 | 5 |
| E | 6 | 4 |
| F | 5 | 3 |
| G | 4 | 2 |
| H | 3 | 2 |
| I | 2 | 1 |
| J | 1 | 1 |
| K | 1 | 1 |

**I DATABASE_FORMLER_KOMPLETT.md (Test 12 = Benkpress):**
| Kat | Menn | Kvinner |
|-----|------|---------|
| A | 140+ | 100+ |
| B | 130+ | 90+ |
| C | 120+ | 80+ |
| D | 110+ | 70+ |
| E | 100+ | 60+ |
| F | 90+ | 50+ |
| G | 80+ | 45+ |
| H | 70+ | 40+ |

---

## HANDLINGSPUNKTER

### 1. Fysiske tester - KRITISK
**Spørsmål til avklaring:**
- Skal Test 12-14 være: Pull-ups/Plank/VerticalJump ELLER Benkpress/Trapbar/Rotasjonskast?
- Eller skal det være flere fysiske tester (begge sett)?

### 2. CMJ-test
- Legg til i category-requirements.ts
- Foreslåtte verdier i CONFIG kan brukes

### 3. 3000m Løping
- Legg til i category-requirements.ts
- Foreslåtte verdier i CONFIG kan brukes

---

## KONKLUSJON

**Golf-testene (1-11):** ✅ Alle verdier matcher mellom CONFIG og kode.

**Fysiske tester (12-14):** ⚠️ Dokumentasjon og kode sier forskjellige ting. MÅ avklares.

**Nye tester (CMJ, 3000m):** ❌ Finnes ikke i kode ennå, men er definert i CONFIG.
