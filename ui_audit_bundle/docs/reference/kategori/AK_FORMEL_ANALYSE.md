# AK-Formel Struktur & Treningskategorisering
> Analyse og utvikling av systematisk øktbeskrivelse
> Dato: 14. desember 2025

---

## 📐 Nåværende AK-Formel

### Grunnstruktur

```
Økt = L[fase] + CS[nivå] + S[setting] + [Underlag] + [Område]
```

### Komponenter

| Komponent | Verdier | Beskrivelse |
|-----------|---------|-------------|
| **L** | L1-L5 | Læringsfase (Eksponering → Automatisering) |
| **CS** | CS20-CS100 | Clubspeed % (20% → 100% av målhastighet) |
| **S** | S1-S10 | Setting/Miljø (Range → Turnering) |
| **Underlag** | Mat, Range, Bane, Green, etc. | Fysisk miljø |
| **Område** | Driver, Mid-Iron, Wedge, Putting, etc. | Golf-område |

---

## 🔍 Nåværende Eksempler

### Eksempel 1: Teknisk fundamentals
```
L2_CS50_S1_Mat_Driver
```
- **L2**: Fundamentals (etablere grunnleggende teknikk)
- **CS50**: 50% av målhastighet (komfortsone)
- **S1**: Range, perfekte betingelser
- **Mat**: På innendørs matte
- **Driver**: Full swing driver

**Tolkning**: Grunnleggende driver-teknikk i kontrollert miljø med moderat hastighet.

---

### Eksempel 2: Variasjonstrening
```
L3_CS60_S2_Range_Full-Swing
```
- **L3**: Variasjon (introdusere varierte betingelser)
- **CS60**: 60% av målhastighet
- **S2**: Range, varierende targets
- **Range**: Utendørs range
- **Full-Swing**: Alle full-swing klubber

**Tolkning**: Variert full-swing trening på range med økende hastighet.

---

### Eksempel 3: Spilltrening
```
L4_CS70_S5_Bane_Spill
```
- **L4**: Timing og Flow (integrere i spillflyt)
- **CS70**: 70% av målhastighet (konkurransehastighet)
- **S5**: 18-hulls treningsrunde
- **Bane**: På golfbanen
- **Spill**: Spillrunde

**Tolkning**: Treningsrunde med fokus på flow og rytme.

---

### Eksempel 4: Turneringsøkt
```
L5_CS90_S9_Turnering_Mental
```
- **L5**: Automatisering (ferdighet under press)
- **CS90**: 90% av målhastighet
- **S9**: Viktig turnering
- **Turnering**: Turneringsmiljø
- **Mental**: Fokus på mental prestasjon

**Tolkning**: Høypresset turnering med automatisert teknikk og mental fokus.

---

## 🤔 Utfordringer med Nåværende Struktur

### 1. Overlapp mellom Komponenter
**Problem**: `S[setting]` og `[Underlag]` overlapper delvis

**Eksempel**:
- `S1` = "Range, perfekte betingelser"
- Men vi har også `[Underlag]` = "Range" eller "Mat"

**Spørsmål**:
- Er `S` mer om press/kontekst enn fysisk sted?
- Er `Underlag` mer om spesifikk overflate?

---

### 2. Mangler Treningstype
**Problem**: Formelen sier ikke eksplisitt om det er Teknikk, Shortgame, Fysisk, Mental, etc.

**Forslag**: Legg til `T[type]`?

```
Økt = T[type] + L[fase] + CS[nivå] + S[setting] + [Underlag] + [Område]
```

**Eksempel**:
```
T_Teknikk_L2_CS50_S1_Mat_Driver
T_Shortgame_L3_CS60_S2_Green_Wedge
T_Mental_L5_CS90_S9_Turnering_Pressure
```

---

### 3. Mangler Fokus/Bruddpunkt
**Problem**: Ingen indikasjon på hva som er hovedfokus (5-prosess: Teknikk, Taktikk, Fysikk, Psyke, Utstyr)

**Forslag**: Legg til `F[fokus]`?

```
Økt = T[type] + L[fase] + CS[nivå] + S[setting] + F[fokus] + [Område]
```

**Eksempel**:
```
T_Teknikk_L2_CS50_S1_F_Grip_Driver
T_Golfslag_L3_CS60_S2_F_Path_Mid-Iron
T_Mental_L4_CS70_S5_F_Rutine_Spill
```

**5-Prosess Fokus**:
- `F_Teknikk`: Grip, Setup, Backswing, Downswing, Impact, Follow-through
- `F_Taktikk`: Klubbvalg, Shot-selection, Risikostyring, Banestrategi
- `F_Fysikk`: Styrke, Power, Mobilitet, Stabilitet, Kondisjon
- `F_Psyke`: Pre-shot, Fokus, Mental-Toughness, Selvtillit
- `F_Utstyr`: Fitting, Ball-valg, Utstyrskunnskap

---

### 4. Mangler Varighet
**Problem**: Ingen indikasjon på øktlengde

**Forslag**: Legg til varighet i metadata?

```
Økt = T[type] + L[fase] + CS[nivå] + S[setting] + [Område] + (Varighet: [min])
```

**Eksempel**:
```
T_Teknikk_L2_CS50_S1_Driver (60 min)
T_Shortgame_L3_CS60_S2_Wedge (90 min)
```

---

## 💡 Foreslåtte Utvidelser

### Forslag 1: Minimal Utvidelse
**Legg til treningstype foran**:

```
[Type]_L[fase]_CS[nivå]_S[setting]_[Område]
```

**Eksempler**:
```
Teknikk_L2_CS50_S1_Driver
Golfslag_L3_CS60_S2_Mid-Iron
Spill_L4_CS70_S5_Bane
Mental_L5_CS90_S9_Turnering
```

**Fordel**: Enkel, klar treningstype
**Ulempe**: Mangler fortsatt fokusområde og underlag

---

### Forslag 2: Middels Utvidelse
**Legg til type og fokus**:

```
[Type]_L[fase]_CS[nivå]_S[setting]_F[fokus]_[Område]
```

**Eksempler**:
```
Teknikk_L2_CS50_S1_F_Grip_Driver
Teknikk_L2_CS50_S1_F_Path_Mid-Iron
Golfslag_L3_CS60_S2_F_Nøyaktighet_Wedge
Mental_L4_CS70_S5_F_Rutine_Spill
Fysisk_L2_CS0_S0_F_Styrke_OffCourse
```

**Fordel**: Klar type og spesifikt fokusområde
**Ulempe**: Lang, kompleks

---

### Forslag 3: Fullstendig System (Metadata-basert)
**Core formel + Metadata**:

```yaml
Økt-ID: T_L3_CS60_S2_Driver
Metadata:
  Type: Teknikk
  L-fase: L3 (Variasjon)
  CS-nivå: CS60 (60%)
  Setting: S2 (Range, varierende targets)
  Fokus: Path Control
  Område: Driver
  Underlag: Range (outdoor)
  Varighet: 90 min
  Kategori: D-E
  Periode: Grunn (G)
  Breaking-Point: Teknikk (Path ±4°)
```

**Fordel**: Komplett informasjon, lett søkbar
**Ulempe**: Krever database/system for å håndtere

---

## 🎯 Foreslått Ny Struktur

### AK-Formel v2.0

```
[Type]_L[fase]_CS[nivå]_S[setting]_[Område]_[Fokus]
```

**Komponenter**:

| Komponent | Verdier | Obligatorisk? |
|-----------|---------|---------------|
| **Type** | T, G, S, K, Fs, Fu, Test | ✅ Ja |
| **L** | L1-L5 | ✅ Ja |
| **CS** | CS0-CS100 (CS0 for fysisk off-course) | ✅ Ja |
| **S** | S1-S10 | ✅ Ja |
| **Område** | Driver, Mid-Iron, Wedge, Putting, Bunker, etc. | ✅ Ja |
| **Fokus** | Grip, Path, Impact, Rutine, etc. | ❌ Valgfri |

**Type-koder**:
- **T**: Teknikk
- **G**: Golfslag
- **S**: Spill
- **K**: Kompetanse (Mental/Strategisk)
- **Fs**: Fysisk
- **Fu**: Funksjonell
- **Test**: Testing/Benchmark

---

### Eksempler AK-Formel v2.0

#### Eksempel 1: Grunnleggende teknikk
```
T_L2_CS50_S1_Driver_Grip
```
- Teknikk-økt
- L2 fundamentals
- 50% hastighet
- Range perfekte betingelser
- Driver
- Fokus: Grip

---

#### Eksempel 2: Variasjon mid-iron
```
G_L3_CS60_S2_Mid-Iron_Nøyaktighet
```
- Golfslag-økt (Test 3: Jern 7 nøyaktighet)
- L3 variasjon
- 60% hastighet
- Range med varierende targets
- Mid-iron (6-8)
- Fokus: Nøyaktighet

---

#### Eksempel 3: Spillrunde
```
S_L4_CS70_S5_Bane_Strategi
```
- Spill-økt
- L4 timing og flow
- 70% konkurransehastighet
- 18-hulls treningsrunde
- Bane
- Fokus: Banestrategi

---

#### Eksempel 4: Mental turnering
```
K_L5_CS90_S9_Turnering_Pre-Shot
```
- Kompetanse-økt (Mental)
- L5 automatisering
- 90% hastighet
- Viktig turnering
- Turnering
- Fokus: Pre-shot rutine

---

#### Eksempel 5: Fysisk trening
```
Fs_L2_CS0_S0_OffCourse_Styrke
```
- Fysisk-økt
- L2 fundamentals
- CS0 (ikke relevant for fysisk)
- S0 (ikke på bane/range)
- Off-course
- Fokus: Styrke (Test 12-13)

---

## 📊 Sammenligning: v1.0 vs v2.0

| Aspekt | v1.0 | v2.0 |
|--------|------|------|
| **Lengde** | `L3_CS60_S2_Mat_Full-Swing` | `G_L3_CS60_S2_Full-Swing_Variasjon` |
| **Type synlig** | ❌ Nei (implisitt) | ✅ Ja (G = Golfslag) |
| **Fokusområde** | ❌ Nei | ✅ Ja (valgfri) |
| **Underlag** | ✅ Ja (Mat) | ⚠️ Kan droppes (inkludert i S) |
| **Lesbarhet** | God | God |
| **Søkbarhet** | Middels | Høy |

---

## 🔄 Migreringsstrategi

### Steg 1: Definer Type-mapping
**For alle eksisterende økter, klassifiser som**:
- T (Teknikk)
- G (Golfslag)
- S (Spill)
- K (Kompetanse)
- Fs (Fysisk)
- Fu (Funksjonell)
- Test

### Steg 2: Optimaliser S-settings
**Klargjør at S handler om press/kontekst, ikke fysisk sted**:
- S1-S4: Lav press (Range, kortbane, treningsrunde)
- S5-S7: Middels press (Treningsrunde med konkurranse)
- S8-S10: Høy press (Turneringer)

### Steg 3: Integrer i Notion Database
**Økt-database får nye felter**:
- `Økt-ID` (tekst): `T_L2_CS50_S1_Driver_Grip`
- `Type` (select): T, G, S, K, Fs, Fu, Test
- `L-fase` (select): L1-L5
- `CS-nivå` (select): CS0-CS100
- `S-setting` (select): S1-S10
- `Område` (select): Driver, Mid-Iron, Wedge, etc.
- `Fokus` (tekst): Grip, Path, Impact, etc.

---

## ❓ Spørsmål til Diskusjon

### 1. Type-komponent
**Skal vi legge til Type foran formelen?**
- ✅ **Fordel**: Umiddelbart klar om det er Teknikk, Golfslag, Spill, etc.
- ❌ **Ulempe**: Lengre formel

**Anbefaling**: JA - Type bør være tydelig i formelen

---

### 2. Fokus-komponent
**Skal Fokus være obligatorisk eller valgfri?**
- ✅ **Obligatorisk**: Tvinger spesifisitet (hva er målet med økten?)
- ❌ **Valgfri**: Kortere formel for generelle økter

**Anbefaling**: VALGFRI - Men anbefalt for tekniske økter

---

### 3. Underlag-komponent
**Trenger vi fortsatt Underlag (Mat, Range, Bane)?**
- ✅ **Ja**: Gir fysisk kontekst (innendørs vs. utendørs, matte vs. grass)
- ❌ **Nei**: Overlapper med S-setting, kan droppes

**Anbefaling**: DROPP - S-setting dekker kontekst, forenkler formelen

---

### 4. Metadata vs. Inline
**Skal all info være i formelen, eller bruke metadata?**
- ✅ **Inline (i formel)**: Alt i én streng, lett å lese
- ✅ **Metadata (database)**: Strukturert, søkbart, fleksibelt

**Anbefaling**: HYBRID - Core formel + metadata for detaljer

---

## 🎯 Anbefalt Endelig Struktur

### AK-Formel v2.0 (Anbefalt)

```
[Type]_L[fase]_CS[nivå]_S[setting]_[Område]
```

**Eksempler**:
```
T_L2_CS50_S1_Driver              (Teknikk, fundamentals, 50%, range, driver)
G_L3_CS60_S2_Mid-Iron            (Golfslag, variasjon, 60%, range, mid-iron)
S_L4_CS70_S5_Bane                (Spill, timing, 70%, 18-hull, bane)
K_L5_CS90_S9_Turnering           (Mental, auto, 90%, turnering)
Fs_L2_CS0_S0_OffCourse           (Fysisk, fundamentals, off-course)
```

**+ Metadata i database**:
```yaml
Fokus: Grip / Path / Impact / Pre-Shot / Styrke
Varighet: 60 / 90 / 120 min
Kategori: A-K (målgruppe)
Periode: E / G / S / T
Breaking-Point: Teknikk / Taktikk / Fysikk / Psyke / Utstyr
Beskrivelse: Fritekst beskrivelse av økt
Deløvelser: Relation til øvelsesdatabase
```

---

## 📝 Neste Steg

**Hva vil du gjøre med AK-formelen?**

1. **Godkjenne v2.0 struktur**: Bruk `[Type]_L[fase]_CS[nivå]_S[setting]_[Område]`
2. **Modifisere strukturen**: Endre komponenter eller rekkefølge
3. **Bygge øvelsesdatabase**: 300+ drills med AK-formel v2.0
4. **Lage ukemaler**: 88 templates med AK-formel integrert
5. **Diskutere spesifikke komponenter**: L-faser, S-settings, Type-koder, etc.

---

**Dokument Status**: ✅ Klar for diskusjon
**Versjon**: 1.0
**Dato**: 14. desember 2025
