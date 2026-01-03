# Tester - Full Oversikt for Gjennomgang
> Alle 20 tester med detaljer for validering
> Status: TRENGER GJENNOMGANG

---

## ⚠️ VIKTIG: Inkonsistens Funnet

Det finnes **to ulike test-definisjoner** i systemet:

1. **Seed-fil** (`tests.ts`) - Brukes i database
2. **Dokumentasjon** (`DATABASE_FORMLER_KOMPLETT.md`) - Referansedokument

**Disse MÅ harmoniseres!**

---

## SEED-FIL TESTER (Nåværende i database)

### Speed/Distance Tester (1-3)

| # | Navn | Kategori | Måleenhet | Protokoll |
|---|------|----------|-----------|-----------|
| 1 | Driver Clubhead Speed | speed | mph | 5 slag, beste teller |
| 2 | 7-Iron Clubhead Speed | speed | mph | 5 slag, beste teller |
| 3 | Driver Carry Distance | distance | meter | 5 slag, snitt av 3 beste |

### Accuracy Tester (4-6)

| # | Navn | Kategori | Måleenhet | Protokoll |
|---|------|----------|-----------|-----------|
| 4 | PEI (Proximity Efficiency Index) | accuracy | ratio | 10 slag fra 100m |
| 5 | Fairway Accuracy | accuracy | % | 10 driver, tell treff |
| 6 | GIR Simulation | accuracy | % | 9 avstander, tell green hits |

### Short Game Tester (7-8)

| # | Navn | Kategori | Måleenhet | Protokoll |
|---|------|----------|-----------|-----------|
| 7 | Short Game Up & Down | short_game | % | 10 posisjoner |
| 8 | Bunker Proximity | short_game | meter | 10 slag, snitt avstand |

### Putting Tester (9-11)

| # | Navn | Kategori | Måleenhet | Protokoll |
|---|------|----------|-----------|-----------|
| 9 | Putting 1.5m | putting | % | 20 putts |
| 10 | Putting 3m | putting | % | 20 putts |
| 11 | Lag Putting 10m | putting | cm | 10 putts, snitt avstand |

### Physical Tester (12-16)

| # | Navn | Kategori | Måleenhet | Protokoll |
|---|------|----------|-----------|-----------|
| 12 | Med Ball Throw | physical | meter | 3kg ball, 3 forsøk |
| 13 | Vertical Jump | physical | cm | 3 forsøk |
| 14 | Hip Rotation | physical | grader | Goniometer |
| 15 | Thoracic Rotation | physical | grader | Goniometer |
| 16 | Plank Hold | physical | sekunder | Maks tid |

### Scoring/Mental Tester (17-20)

| # | Navn | Kategori | Måleenhet | Protokoll |
|---|------|----------|-----------|-----------|
| 17 | On-Course Scoring 9 Hull | scoring | score | 9 hull under test |
| 18 | Mental Focus Test | mental | 1-10 | Putt-serie med press |
| 19 | Pre-Shot Routine Consistency | mental | sekunder std.avvik | 10 slag, mål tid |
| 20 | Competition Simulation | mental | score + rating | 3 hull med press |

---

## DOKUMENTASJON TESTER (Fra DATABASE_FORMLER_KOMPLETT.md)

### Golf Shots (Test 1-7)

| # | Navn | Måleenhet | Protokoll |
|---|------|-----------|-----------|
| 1 | Driver Avstand (Carry) | meter | 6 slag, snitt av 3 beste |
| 2 | Jern 7 Avstand (Carry) | meter | 6 slag, snitt av 3 beste |
| 3 | Jern 7 Nøyaktighet | meter avvik | 6 slag til target |
| 4 | Wedge PEI | PEI score | 18 slag fra 6 distanser |
| 5 | Lag-kontroll Putting | poeng 0-9 | 9 putts (3m, 6m, 9m) |
| 6 | Lesing Putting | poeng 0-6 | 6 putts med break |
| 7 | Bunker | % | 10 slag, % innenfor 3m |

### Teknikk (Test 8-11)

| # | Navn | Måleenhet | Protokoll |
|---|------|-----------|-----------|
| 8 | Klubbfart Driver | mph | 6 slag, snitt av 3 beste |
| 9 | Smash Factor Driver | ratio | 6 slag, snitt av 3 beste |
| 10 | Launch Angle Driver | grader | 6 slag |
| 11 | Spin Rate Driver | rpm | 6 slag |

### Fysisk (Test 12-14)

| # | Navn | Måleenhet | Protokoll |
|---|------|-----------|-----------|
| 12 | Benkpress | kg 1RM | Finn maks |
| 13 | Markløft Trapbar | kg 1RM | Finn maks |
| 14 | Rotasjonskast 4kg | meter | 3 kast per side |

### Mental (Test 15-18)

| # | Navn | Måleenhet | Protokoll |
|---|------|-----------|-----------|
| 15 | Pressure Putting | % | 10 putts eliminering |
| 16 | Pre-shot Rutine Konsistens | % | Video 18 hull |
| 17 | Fokus under Distraksjon | % | 20 slag med distraksjoner |
| 18 | Mental Toughness (MTQ48) | 1-5 skala | Spørreskjema |

### Strategisk (Test 19-20)

| # | Navn | Måleenhet | Protokoll |
|---|------|-----------|-----------|
| 19 | Klubbvalg og Risikovurdering | % | 20 scenarios |
| 20 | Banestrategi-planlegging | 1-5 | 18 hull planlegging |

---

## SAMMENLIGNING OG KONFLIKTER

| Seed # | Seed Navn | Dok # | Dok Navn | Konflikt? |
|--------|-----------|-------|----------|-----------|
| 1 | Driver Clubhead Speed | 8 | Klubbfart Driver | ⚠️ Ulikt nummer |
| 2 | 7-Iron Clubhead Speed | - | - | ❌ Finnes ikke i dok |
| 3 | Driver Carry Distance | 1 | Driver Avstand | ⚠️ Ulikt nummer |
| 4 | PEI | 4 | Wedge PEI | ✅ Samme |
| 5 | Fairway Accuracy | - | - | ❌ Finnes ikke i dok |
| 6 | GIR Simulation | - | - | ❌ Finnes ikke i dok |
| 7 | Up & Down | - | - | ❌ Finnes ikke i dok |
| 8 | Bunker Proximity | 7 | Bunker | ⚠️ Ulikt nummer |
| 9 | Putting 1.5m | - | - | ❌ Finnes ikke i dok |
| 10 | Putting 3m | - | - | ❌ Finnes ikke i dok |
| 11 | Lag Putting | 5 | Lag-kontroll Putting | ⚠️ Ulikt nummer |
| 12 | Med Ball Throw | 14 | Rotasjonskast | ⚠️ Ulik beskrivelse |
| 13 | Vertical Jump | - | - | ❌ Finnes ikke i dok |
| 14 | Hip Rotation | - | - | ❌ Finnes ikke i dok |
| 15 | Thoracic Rotation | - | - | ❌ Finnes ikke i dok |
| 16 | Plank Hold | - | - | ❌ Finnes ikke i dok |
| 17 | 9-Hole Scoring | - | - | ❌ Finnes ikke i dok |
| 18 | Mental Focus | 18 | MTQ48 | ⚠️ Ulik test |
| 19 | Pre-Shot Consistency | 16 | Pre-shot Konsistens | ⚠️ Ulikt nummer |
| 20 | Competition Sim | 20 | Banestrategi | ⚠️ Ulik test |

---

## ANBEFALT: NY HARMONISERT TEST-LISTE

Basert på begge kilder, foreslås følgende 20 tester:

### Golf Performance (1-7)

| # | Navn (NO) | Navn (EN) | Enhet | Domene |
|---|-----------|-----------|-------|--------|
| 1 | Driver Carry Avstand | Driver Carry Distance | meter | TEE |
| 2 | 7-Jern Carry Avstand | 7-Iron Carry Distance | meter | INN150 |
| 3 | 7-Jern Nøyaktighet | 7-Iron Accuracy | meter avvik | INN150 |
| 4 | Wedge PEI | Wedge PEI | ratio | INN50/INN100 |
| 5 | Lag-kontroll Putting | Lag Putting Control | poeng 0-9 | PUTT |
| 6 | Lesing Putting | Green Reading | poeng 0-6 | PUTT |
| 7 | Bunker Save | Bunker Save | % | ARG |

### Teknikk/Speed (8-11)

| # | Navn (NO) | Navn (EN) | Enhet | Domene |
|---|-----------|-----------|-------|--------|
| 8 | Klubbfart Driver | Driver Clubspeed | mph | TEE |
| 9 | Smash Factor | Smash Factor | ratio | TEE |
| 10 | Launch Angle | Launch Angle | grader | TEE |
| 11 | Spin Rate | Spin Rate | rpm | TEE |

### Fysisk (12-14)

| # | Navn (NO) | Navn (EN) | Enhet | Domene |
|---|-----------|-----------|-------|--------|
| 12 | Benkpress 1RM | Bench Press 1RM | kg | PHYS |
| 13 | Markløft 1RM | Trap Bar Deadlift 1RM | kg | PHYS |
| 14 | Rotasjonskast 4kg | Med Ball Rotation Throw | meter | PHYS |

### Mental (15-18)

| # | Navn (NO) | Navn (EN) | Enhet | Domene |
|---|-----------|-----------|-------|--------|
| 15 | Pressure Putting | Pressure Putting | % | PUTT |
| 16 | Pre-shot Konsistens | Pre-shot Consistency | % | MENTAL |
| 17 | Fokus under Press | Focus Under Distraction | % reduksjon | MENTAL |
| 18 | Mental Styrke | Mental Toughness | 1-5 | MENTAL |

### Strategisk (19-20)

| # | Navn (NO) | Navn (EN) | Enhet | Domene |
|---|-----------|-----------|-------|--------|
| 19 | Klubbvalg Beslutning | Club Selection | % riktige | TACTICAL |
| 20 | Banestrategi | Course Management | 1-5 | TACTICAL |

---

## DINE NOTATER

_Bruk dette området til å notere endringer under gjennomgang:_

### Tester som skal BEHOLDES som de er:
```
-
-
-
```

### Tester som skal ENDRES:
```
Test #__: Fra "___" til "___"
Test #__: Fra "___" til "___"
```

### Tester som skal LEGGES TIL:
```
-
-
```

### Tester som skal FJERNES:
```
-
-
```

### PROTOKOLL-ENDRINGER:
```
Test #__: ___
```

---

## NESTE STEG

1. [ ] Gå gjennom listen over
2. [ ] Bestem autoritativ test-liste (20 tester)
3. [ ] Definer protokoll for hver test
4. [ ] Oppdater `tests.ts` seed-fil
5. [ ] Oppdater `category-requirements.ts`
6. [ ] Oppdater dokumentasjon
