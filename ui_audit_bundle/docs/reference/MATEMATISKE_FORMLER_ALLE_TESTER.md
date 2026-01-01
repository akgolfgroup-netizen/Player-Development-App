# Matematiske Formler for Alle 20 Tester

> Team Norway Golf Testing Protocol - Komplett formelreferanse
> For IT-arkitekt og systemutviklere

---

## Innhold

1. [Oversikt](#1-oversikt)
2. [Distanse-tester (1-7)](#2-distanse-tester-1-7)
3. [Approach-tester med PEI (8-11)](#3-approach-tester-med-pei-8-11)
4. [Fysiske tester (12-14)](#4-fysiske-tester-12-14)
5. [Kortspill-tester (15-18)](#5-kortspill-tester-15-18)
6. [On-Course tester (19-20)](#6-on-course-tester-19-20)
7. [Kategori-krav komplett tabell](#7-kategori-krav-komplett-tabell)
8. [Hjelpefunksjoner](#8-hjelpefunksjoner)

---

## 1. Oversikt

### Teststruktur

| Kategori | Tester | Hovedformel |
|----------|--------|-------------|
| Distanse | 1-4 | Top 3 gjennomsnitt av 6 slag |
| Hastighet | 5-6 | Top 3 gjennomsnitt av 6 slag |
| Effektivitet | 7 | Smash Factor = Ball/Klubb hastighet |
| Approach | 8-11 | PEI = Avstand / Ideal-avstand |
| Fysisk | 12-14 | Direkte måling (1RM, tid) |
| Kortspill | 15-18 | Suksessrate eller gjennomsnitt |
| On-Course | 19-20 | Sammensatt score med flere metrikker |

### Kategori-system (A-K)

| Kategori | Snitt-score (18 hull) | Nivå |
|----------|----------------------|------|
| A | < 70 | Elite / Tour |
| B | 70-72 | Scratch |
| C | 73-75 | Lavt handicap |
| D | 76-78 | Singel handicap |
| E | 79-81 | Middels |
| F | 82-84 | Hobby+ |
| G | 85-87 | Hobby |
| H | 88-90 | Nybegynner+ |
| I | 91-93 | Nybegynner |
| J | 94-96 | Starter |
| K | > 96 | Helt ny |

---

## 2. Distanse-tester (1-7)

### Test 1: Driver Avstand (Carry)

**Input:** 6 slag med carry-distanse i meter

**Formel:**
```
Resultat = AVG(TOP 3 av 6 slag)
```

**Matematisk notasjon:**
```
La D = {d₁, d₂, d₃, d₄, d₅, d₆} være carry-distanser

Sortert synkende: D' = sort_desc(D)

Resultat = (D'₁ + D'₂ + D'₃) / 3
```

**Kode-implementasjon:**
```typescript
function calculateTest1(shots: number[]): number {
  const sorted = [...shots].sort((a, b) => b - a);
  const top3 = sorted.slice(0, 3);
  return top3.reduce((sum, val) => sum + val, 0) / 3;
}
```

**Kategori-krav (meter, >=):**

| Kat | Menn | Kvinner |
|-----|------|---------|
| A | 270 | 240 |
| B | 260 | 230 |
| C | 250 | 220 |
| D | 240 | 210 |
| E | 230 | 200 |
| F | 220 | 190 |
| G | 210 | 180 |
| H | 200 | 170 |
| I | 190 | 160 |
| J | 180 | 150 |
| K | 170 | 140 |

---

### Test 2: 3-Tre Avstand (Carry)

**Formel:** Identisk med Test 1

**Kategori-krav (meter, >=):**

| Kat | Menn | Kvinner |
|-----|------|---------|
| A | 250 | 210 |
| B | 240 | 200 |
| C | 230 | 190 |
| D | 220 | 180 |
| E | 210 | 170 |
| F | 200 | 160 |
| G | 190 | 150 |
| H | 180 | 140 |
| I | 170 | 130 |
| J | 160 | 120 |
| K | 150 | 110 |

---

### Test 3: 5-Jern Avstand (Carry)

**Formel:** Identisk med Test 1

**Kategori-krav (meter, >=):**

| Kat | Menn | Kvinner |
|-----|------|---------|
| A | 190 | 165 |
| B | 185 | 160 |
| C | 180 | 155 |
| D | 175 | 150 |
| E | 170 | 145 |
| F | 165 | 140 |
| G | 160 | 135 |
| H | 155 | 130 |
| I | 150 | 125 |
| J | 145 | 120 |
| K | 140 | 115 |

---

### Test 4: PW Avstand (Carry)

**Formel:** Identisk med Test 1

**Kategori-krav (meter, >=):**

| Kat | Menn | Kvinner |
|-----|------|---------|
| A | 130 | 110 |
| B | 125 | 105 |
| C | 120 | 100 |
| D | 115 | 95 |
| E | 110 | 90 |
| F | 105 | 85 |
| G | 100 | 80 |
| H | 95 | 75 |
| I | 90 | 70 |
| J | 85 | 65 |
| K | 80 | 60 |

---

### Test 5: Klubbhastighet (Driver)

**Input:** 6 slag med klubbhastighet i mph

**Formel:**
```
Resultat = AVG(TOP 3 av 6 slag)
```

**Kategori-krav (mph, >=):**

| Kat | Menn | Kvinner |
|-----|------|---------|
| A | 120 | 105 |
| B | 115 | 100 |
| C | 110 | 95 |
| D | 105 | 90 |
| E | 100 | 85 |
| F | 95 | 80 |
| G | 90 | 75 |
| H | 85 | 70 |
| I | 80 | 65 |
| J | 75 | 60 |
| K | 70 | 55 |

---

### Test 6: Ballhastighet (Driver)

**Formel:** Identisk med Test 5

**Kategori-krav (mph, >=):**

| Kat | Menn | Kvinner |
|-----|------|---------|
| A | 177 | 155 |
| B | 168 | 146 |
| C | 158 | 137 |
| D | 149 | 127 |
| E | 140 | 118 |
| F | 130 | 112 |
| G | 121 | 106 |
| H | 112 | 99 |
| I | 106 | 93 |
| J | 99 | 87 |
| K | 90 | 81 |

---

### Test 7: Smash Factor (Driver)

**Input:** 6 slag med både ball- og klubbhastighet

**Formel:**
```
For hvert slag i:
  SF_i = BallSpeed_i / ClubSpeed_i

Resultat = AVG(TOP 3 av SF₁...SF₆)
```

**Matematisk notasjon:**
```
La B = {b₁...b₆} = ballhastigheter
La C = {c₁...c₆} = klubbhastigheter

SF = {b₁/c₁, b₂/c₂, ..., b₆/c₆}

Sortert synkende: SF' = sort_desc(SF)

Resultat = (SF'₁ + SF'₂ + SF'₃) / 3
```

**Typisk verdi:** 1.45-1.50 for tour-spillere (maks teoretisk ~1.52)

**Kategori-krav (ratio, >=):**

| Kat | Menn & Kvinner |
|-----|----------------|
| A | 1.48 |
| B | 1.46 |
| C | 1.44 |
| D | 1.42 |
| E | 1.40 |
| F | 1.38 |
| G | 1.36 |
| H | 1.34 |
| I | 1.32 |
| J | 1.30 |
| K | 1.28 |

---

## 3. Approach-tester med PEI (8-11)

### PEI - Precision Efficiency Index

**Konsept:** PEI måler hvor nøyaktig spilleren treffer i forhold til ideell avstand fra hull.

**Grunnformel:**
```
PEI = Gjennomsnittlig_avstand_til_hull / Ideell_avstand
```

**Tolkning:**
- PEI = 1.0: Perfekt presisjon (treffer ideell avstand)
- PEI < 1.0: Bedre enn forventet
- PEI > 1.0: Under forventet

**Matematisk notasjon:**
```
La A = {a₁, a₂, ..., a₁₀} være avstander til hull (10 slag)
La I = ideell avstand for gitt test

AVG_A = (Σᵢ₌₁¹⁰ aᵢ) / 10

PEI = AVG_A / I
```

---

### Test 8: Approach 25m

**Input:** 10 slag, mål-avstand 25 meter

**Formel:**
```
Ideell avstand = 2.5 meter (10% av mål-avstand)

PEI = AVG(avstander til hull) / 2.5
```

**Eksempel:**
```
Slag: [2.1, 3.5, 1.8, 4.2, 2.9, 2.3, 3.1, 2.7, 1.9, 2.5] meter

AVG = (2.1+3.5+1.8+4.2+2.9+2.3+3.1+2.7+1.9+2.5) / 10 = 2.7m

PEI = 2.7 / 2.5 = 1.08
```

**Kategori-krav (PEI, <=):**

| Kat | Menn & Kvinner |
|-----|----------------|
| A | 1.0 |
| B | 1.2 |
| C | 1.4 |
| D | 1.6 |
| E | 1.8 |
| F | 2.0 |
| G | 2.2 |
| H | 2.4 |
| I | 2.6 |
| J | 2.8 |
| K | 3.0 |

---

### Test 9: Approach 50m

**Formel:**
```
Ideell avstand = 5.0 meter

PEI = AVG(avstander til hull) / 5.0
```

**Kategori-krav:** Identisk med Test 8

---

### Test 10: Approach 75m

**Formel:**
```
Ideell avstand = 7.5 meter

PEI = AVG(avstander til hull) / 7.5
```

**Kategori-krav:** Identisk med Test 8

---

### Test 11: Approach 100m

**Formel:**
```
Ideell avstand = 10.0 meter

PEI = AVG(avstander til hull) / 10.0
```

**Kategori-krav:** Identisk med Test 8

---

### PEI Oppsummeringstabell

| Test | Mål-avstand | Ideell-avstand | Formel |
|------|-------------|----------------|--------|
| 8 | 25m | 2.5m | PEI = avg/2.5 |
| 9 | 50m | 5.0m | PEI = avg/5.0 |
| 10 | 75m | 7.5m | PEI = avg/7.5 |
| 11 | 100m | 10.0m | PEI = avg/10.0 |

---

## 4. Fysiske tester (12-14)

### Test 12: Benkpress (1RM)

**Input:** Maksimal vekt løftet i ett repetisjon

**Formel:**
```
Resultat = 1RM i kg (direkte måling)
```

**Kategori-krav (kg, >=):**

| Kat | Menn | Kvinner |
|-----|------|---------|
| A | 140 | 100 |
| B | 130 | 90 |
| C | 120 | 80 |
| D | 110 | 70 |
| E | 100 | 60 |
| F | 90 | 50 |
| G | 80 | 45 |
| H | 70 | 40 |
| I | 60 | 35 |
| J | 50 | 30 |
| K | 40 | 25 |

---

### Test 13: Markløft Trapbar (1RM)

**Input:** Maksimal vekt løftet i ett repetisjon

**Formel:**
```
Resultat = 1RM i kg (direkte måling)
```

**Kategori-krav (kg, >=):**

| Kat | Menn | Kvinner |
|-----|------|---------|
| A | 200 | 140 |
| B | 185 | 130 |
| C | 170 | 120 |
| D | 155 | 110 |
| E | 140 | 100 |
| F | 125 | 90 |
| G | 110 | 80 |
| H | 95 | 70 |
| I | 80 | 60 |
| J | 65 | 50 |
| K | 50 | 40 |

---

### Test 14: 3000m Løping (Mølle)

**Input:** Total tid i sekunder

**Formel:**
```
Resultat = Tid i sekunder (lavere er bedre)
```

**Konvertering:**
```
Tid_sekunder = (minutter × 60) + sekunder
```

**Kategori-krav (sekunder, <=):**

| Kat | Menn | Menn (MM:SS) | Kvinner | Kvinner (MM:SS) |
|-----|------|--------------|---------|-----------------|
| A | 660 | 11:00 | 750 | 12:30 |
| B | 690 | 11:30 | 780 | 13:00 |
| C | 720 | 12:00 | 810 | 13:30 |
| D | 750 | 12:30 | 840 | 14:00 |
| E | 780 | 13:00 | 870 | 14:30 |
| F | 810 | 13:30 | 900 | 15:00 |
| G | 840 | 14:00 | 930 | 15:30 |
| H | 900 | 15:00 | 990 | 16:30 |
| I | 960 | 16:00 | 1050 | 17:30 |
| J | 1020 | 17:00 | 1110 | 18:30 |
| K | 1080 | 18:00 | 1200 | 20:00 |

---

## 5. Kortspill-tester (15-18)

### Test 15: Putting 3m

**Input:** 10 putts fra 3 meter, registrer om hullet eller ikke

**Formel:**
```
Suksessrate = (Antall hullet / Total antall) × 100
```

**Matematisk notasjon:**
```
La P = {p₁, p₂, ..., p₁₀} der pᵢ ∈ {0, 1}
  0 = ikke hullet
  1 = hullet

Suksessrate = (Σᵢ₌₁¹⁰ pᵢ / 10) × 100 %
```

**Eksempel:**
```
Putts: [1, 1, 0, 1, 1, 1, 0, 1, 1, 1] (8 av 10 hullet)

Suksessrate = (8/10) × 100 = 80%
```

**Kategori-krav (%, >=):**

| Kat | Menn & Kvinner |
|-----|----------------|
| A | 90 |
| B | 80 |
| C | 70 |
| D | 60 |
| E | 50 |
| F | 40 |
| G | 35 |
| H | 30 |
| I | 25 |
| J | 20 |
| K | 15 |

---

### Test 16: Putting 6m

**Formel:** Identisk med Test 15

**Kategori-krav (%, >=):**

| Kat | Menn & Kvinner |
|-----|----------------|
| A | 50 |
| B | 40 |
| C | 30 |
| D | 25 |
| E | 20 |
| F | 15 |
| G | 12 |
| H | 10 |
| I | 8 |
| J | 5 |
| K | 5 |

---

### Test 17: Chipping

**Input:** 10 chips, mål avstand fra hull i cm for hver

**Formel:**
```
Resultat = Gjennomsnitt avstand fra hull i cm
```

**Matematisk notasjon:**
```
La D = {d₁, d₂, ..., d₁₀} være avstander i cm

Resultat = (Σᵢ₌₁¹⁰ dᵢ) / 10
```

**Kategori-krav (cm, <=):**

| Kat | Menn & Kvinner |
|-----|----------------|
| A | 100 |
| B | 120 |
| C | 150 |
| D | 180 |
| E | 200 |
| F | 220 |
| G | 250 |
| H | 280 |
| I | 300 |
| J | 320 |
| K | 350 |

---

### Test 18: Bunker

**Input:** 10 bunker-slag, mål avstand fra hull i cm for hver

**Formel:** Identisk med Test 17

**Kategori-krav (cm, <=):**

| Kat | Menn & Kvinner |
|-----|----------------|
| A | 150 |
| B | 180 |
| C | 200 |
| D | 220 |
| E | 250 |
| F | 280 |
| G | 300 |
| H | 320 |
| I | 350 |
| J | 380 |
| K | 400 |

---

## 6. On-Course tester (19-20)

### Test 19: 9-Hulls Simulering

**Input:** Data for 9 hull

**Primær formel (Score to Par):**
```
Score_to_par = Total_score - Total_par
```

**Sekundære metrikker:**

**Fairway Hit % (FIR):**
```
La F = {f₁, f₂, ...} for par 4/5 hull, fᵢ ∈ {0, 1}

FIR% = (Σ fᵢ / antall_par4_og_par5_hull) × 100
```

**Green in Regulation % (GIR):**
```
La G = {g₁, g₂, ..., g₉}, gᵢ ∈ {0, 1}

GIR% = (Σ gᵢ / 9) × 100
```

**Gjennomsnitt Putts:**
```
La P = {p₁, p₂, ..., p₉} = putts per hull

AVG_putts = (Σ pᵢ) / 9
```

**Up & Down %:**
```
La U = {u₁, u₂, ...} for hull der GIR = 0, uᵢ ∈ {0, 1}

UpDown% = (Σ uᵢ / antall_miss_GIR) × 100
```

**Kategori-krav (score to par, <=):**

| Kat | Menn & Kvinner |
|-----|----------------|
| A | 0 |
| B | +2 |
| C | +4 |
| D | +6 |
| E | +8 |
| F | +10 |
| G | +12 |
| H | +14 |
| I | +16 |
| J | +18 |
| K | +20 |

---

### Test 20: On-Course Skills

**Input:** Data for 3-6 hull

**Primær formel:** Identisk med Test 19

**Ekstra metrikk - Scrambling %:**
```
La S = {s₁, s₂, ...} for hull der GIR = 0, sᵢ ∈ {0, 1}
  1 = par eller bedre
  0 = bogey eller verre

Scrambling% = (Σ sᵢ / antall_miss_GIR) × 100
```

**Total Penalties:**
```
Penalties = Σ(penalties per hull)
```

**Kategori-krav (score to par, <=):**

| Kat | Menn & Kvinner |
|-----|----------------|
| A | 0 |
| B | +1 |
| C | +2 |
| D | +3 |
| E | +4 |
| F | +5 |
| G | +6 |
| H | +7 |
| I | +8 |
| J | +10 |
| K | +12 |

---

## 7. Kategori-krav komplett tabell

### Sammenligningsttyper

| Type | Symbol | Betydning |
|------|--------|-----------|
| >= | Høyere er bedre | Distanse, hastighet, styrke |
| <= | Lavere er bedre | PEI, tid, avstand fra hull, score |

### Komplett oversikt - Menn

| Test | Navn | A | B | C | D | E | F | G | H | I | J | K | Type |
|------|------|---|---|---|---|---|---|---|---|---|---|---|------|
| 1 | Driver (m) | 270 | 260 | 250 | 240 | 230 | 220 | 210 | 200 | 190 | 180 | 170 | >= |
| 2 | 3-tre (m) | 250 | 240 | 230 | 220 | 210 | 200 | 190 | 180 | 170 | 160 | 150 | >= |
| 3 | 5-jern (m) | 190 | 185 | 180 | 175 | 170 | 165 | 160 | 155 | 150 | 145 | 140 | >= |
| 4 | PW (m) | 130 | 125 | 120 | 115 | 110 | 105 | 100 | 95 | 90 | 85 | 80 | >= |
| 5 | Klubb-fart (mph) | 120 | 115 | 110 | 105 | 100 | 95 | 90 | 85 | 80 | 75 | 70 | >= |
| 6 | Ball-fart (mph) | 177 | 168 | 158 | 149 | 140 | 130 | 121 | 112 | 106 | 99 | 90 | >= |
| 7 | Smash Factor | 1.48 | 1.46 | 1.44 | 1.42 | 1.40 | 1.38 | 1.36 | 1.34 | 1.32 | 1.30 | 1.28 | >= |
| 8-11 | PEI | 1.0 | 1.2 | 1.4 | 1.6 | 1.8 | 2.0 | 2.2 | 2.4 | 2.6 | 2.8 | 3.0 | <= |
| 12 | Benkpress (kg) | 140 | 130 | 120 | 110 | 100 | 90 | 80 | 70 | 60 | 50 | 40 | >= |
| 13 | Markløft (kg) | 200 | 185 | 170 | 155 | 140 | 125 | 110 | 95 | 80 | 65 | 50 | >= |
| 14 | 3km (sek) | 660 | 690 | 720 | 750 | 780 | 810 | 840 | 900 | 960 | 1020 | 1080 | <= |
| 15 | Putt 3m (%) | 90 | 80 | 70 | 60 | 50 | 40 | 35 | 30 | 25 | 20 | 15 | >= |
| 16 | Putt 6m (%) | 50 | 40 | 30 | 25 | 20 | 15 | 12 | 10 | 8 | 5 | 5 | >= |
| 17 | Chip (cm) | 100 | 120 | 150 | 180 | 200 | 220 | 250 | 280 | 300 | 320 | 350 | <= |
| 18 | Bunker (cm) | 150 | 180 | 200 | 220 | 250 | 280 | 300 | 320 | 350 | 380 | 400 | <= |
| 19 | 9-hull (par) | 0 | +2 | +4 | +6 | +8 | +10 | +12 | +14 | +16 | +18 | +20 | <= |
| 20 | Skills (par) | 0 | +1 | +2 | +3 | +4 | +5 | +6 | +7 | +8 | +10 | +12 | <= |

---

## 8. Hjelpefunksjoner

### Resultat-evaluering

```typescript
function evaluateResult(
  value: number,
  requirement: number,
  comparison: '>=' | '<='
): { passed: boolean; percentOfRequirement: number } {

  let passed: boolean;
  let percentOfRequirement: number;

  if (comparison === '>=') {
    passed = value >= requirement;
    percentOfRequirement = (value / requirement) * 100;
  } else {
    passed = value <= requirement;
    // For "lavere er bedre", inverterer vi beregningen
    percentOfRequirement = (requirement / value) * 100;
  }

  return {
    passed,
    percentOfRequirement: Math.round(percentOfRequirement * 10) / 10
  };
}
```

### Top-N Gjennomsnitt

```typescript
function calculateTopNAverage(values: number[], n: number): number {
  const sorted = [...values].sort((a, b) => b - a);  // Synkende
  const topN = sorted.slice(0, n);
  return topN.reduce((sum, val) => sum + val, 0) / n;
}
```

### Avrunding

```typescript
function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
```

---

## Vedlegg: Formel-notasjoner

| Symbol | Betydning |
|--------|-----------|
| Σ | Sum (summering) |
| AVG | Gjennomsnitt (average) |
| TOP N | De N høyeste verdiene |
| ∈ | Element av (tilhører) |
| {0, 1} | Binært sett (ja/nei) |
| >= | Større enn eller lik |
| <= | Mindre enn eller lik |

---

*Dokumentet er basert på Team Norway Golf Testing Protocol*
*Versjon: 1.0*
*Generert: 2024*
