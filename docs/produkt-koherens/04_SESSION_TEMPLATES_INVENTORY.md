# Session Templates Inventory

> Komplett oversikt over alle 39 session templates i systemet.

**Kilde:** `apps/api/prisma/seeds/session-templates.ts`

---

## Oversikt

| Periode | Antall | Beskrivelse |
|---------|--------|-------------|
| E (Endurance/Fundamental) | 25 | Grunnleggende teknikk, fysikk, mental |
| G (General) | 3 | Utvikling og integrering |
| S (Specific) | 3 | Spesialisering og konkurransetrening |
| T (Tournament) | 3 | Turneringsperiode |
| Multi-periode | 2 | Overgangssessions |
| Andre | 3 | Støtte-sessions |

**Totalt:** 39 templates

---

## Forklaring av kolonner

| Kolonne | Betydning |
|---------|-----------|
| **Varighet** | Minutter |
| **L-Phase** | Learning Phase (L1=Fundamental, L2=Development, L3=Integration, L4=Specific, L5=Competition) |
| **Setting** | S1-S10 (kontrollert → konkurranse) |
| **Domain** | Primært treningsdomene |
| **Type** | Technical/Physical/Mental/Tactical/Recovery |

---

## E-Periode: Grunnleggende Sessions (25)

### Tekniske Sessions (10)

| # | Navn | Varighet | L-Phase | Domain | Type |
|---|------|----------|---------|--------|------|
| 1 | Grunnleggende Grip og Setup | 60 | L1 | - | Technical |
| 2 | Sving-fundamenter Del 1 | 75 | L1 | - | Technical |
| 3 | Sving-fundamenter Del 2 | 75 | L1 | - | Technical |
| 4 | Jern Grunnkurs | 90 | L1 | INN100 | Technical |
| 5 | Driver Introduksjon | 90 | L1 | TEE | Technical |
| 6 | Putting Fundamenter | 60 | L1 | PUTT | Technical |
| 7 | Chipping Basics | 60 | L1 | ARG | Technical |
| 8 | Pitch Introduksjon | 75 | L1 | INN50 | Technical |
| 9 | Bunker Grunnkurs | 60 | L1 | ARG | Technical |
| 10 | Hybridkølle Introduksjon | 60 | L1 | INN150 | Technical |

### Fysiske Sessions (8)

| # | Navn | Varighet | L-Phase | Domain | Type |
|---|------|----------|---------|--------|------|
| 11 | Golf Mobilitet Grunnkurs | 45 | L1 | PHYS | Physical |
| 12 | Core Stabilitet Basis | 45 | L1 | PHYS | Physical |
| 13 | Balanse og Koordinasjon | 40 | L1 | PHYS | Physical |
| 14 | Styrke Grunnkurs Overkropp | 50 | L1 | PHYS | Physical |
| 15 | Styrke Grunnkurs Underkropp | 50 | L1 | PHYS | Physical |
| 16 | Rotasjonskraft Introduksjon | 45 | L1 | PHYS | Physical |
| 17 | Kondisjon Basis | 45 | L1 | PHYS | Physical |
| 18 | Restitusjon og Recovery | 40 | L1 | PHYS | Recovery |

### Mentale Sessions (7)

| # | Navn | Varighet | L-Phase | Domain | Type |
|---|------|----------|---------|--------|------|
| 19 | Mental Golf Introduksjon | 45 | L1 | - | Mental |
| 20 | Pre-shot Rutine Utvikling | 60 | L1 | - | Mental |
| 21 | Visualisering Grunnkurs | 40 | L1 | - | Mental |
| 22 | Fokus og Konsentrasjon | 45 | L1 | - | Mental |
| 23 | Målsetting for Golf | 45 | L1 | - | Mental |
| 24 | Positiv Selvsnakk | 40 | L1 | - | Mental |
| 25 | Stressmestring Introduksjon | 45 | L1 | - | Mental |

---

## G-Periode: Generelle Sessions (3)

| # | Navn | Varighet | L-Phase | Domain | Type |
|---|------|----------|---------|--------|------|
| 26 | Ball Striking Development | 120 | L2 | INN100 | Technical |
| 27 | Short Game Fundamentals | 90 | L2 | ARG | Technical |
| 28 | Golf-Specific Conditioning | 75 | L3 | PHYS | Physical |

---

## S-Periode: Spesifikke Sessions (3)

| # | Navn | Varighet | L-Phase | Domain | Type |
|---|------|----------|---------|--------|------|
| 29 | Course Management Strategy | 120 | L4 | - | Tactical |
| 30 | Pressure Performance Training | 90 | L4 | - | Mental |
| 31 | Breaking Point Focus Session | 105 | L3 | (dynamisk) | Technical |

---

## T-Periode: Turnering Sessions (3)

| # | Navn | Varighet | L-Phase | Domain | Type |
|---|------|----------|---------|--------|------|
| 32 | Tournament Preparation | 60 | L5 | - | Tactical |
| 33 | Competition Day Warmup | 45 | L5 | - | Technical |
| 34 | Recovery and Reflection | 60 | L4 | PHYS | Recovery |

---

## Multi-Periode Sessions (2)

| # | Navn | Varighet | L-Phase | Perioder | Type |
|---|------|----------|---------|----------|------|
| 35 | Transition: Skill Integration | 90 | L2 | E, G | Technical |
| 36 | Transition: Competition Preparation | 90 | L4 | S, T | Tactical |

---

## Andre Sessions (3)

| # | Navn | Varighet | L-Phase | Domain | Type |
|---|------|----------|---------|--------|------|
| 37 | Physical Foundation Building | 60 | L1 | PHYS | Physical |
| 38 | Introduction to Mental Game | 45 | L1 | - | Mental |
| 39 | (Reserve) | - | - | - | - |

---

## Domene-forklaring

| Kode | Betydning | Tester som dekker |
|------|-----------|-------------------|
| TEE | Driver/tee-slag | Test 1, 5, 6, 7 |
| INN50 | Pitch (30-50m) | Test 9 |
| INN100 | Jern (100-150m) | Test 10, 11 |
| INN150 | Lang approach (150-200m) | Test 2, 3 |
| INN200 | Fairway (200m+) | - |
| ARG | Rundt green | Test 17, 18 |
| PUTT | Putting | Test 15, 16 |
| PHYS | Fysisk trening | Test 12, 13, 14 |

---

## Kategori-observasjoner

**Problem identifisert:**

De fleste templates har `categories: [A,B,C,D,E,F,G,H,I,J,K]` - altså ingen reell filtrering.

**Foreslått forbedring:**

| Template-type | Foreslått kategori-range |
|--------------|-------------------------|
| L1 Fundamental | F-K (nybegynnere) |
| L2 Development | D-H |
| L3 Integration | C-F |
| L4 Specific | B-D |
| L5 Competition | A-C (elite) |

Dette krever beslutning i `02_CRITICAL_DECISIONS.md` punkt 4.

---

*Sist oppdatert: 2026-01-02*
