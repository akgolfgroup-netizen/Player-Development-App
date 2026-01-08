# TIER Golf - Hierarkisk Badge System Plan

## Konsept

Badge-systemet skal følge TIER Golf sin **spillerkategori-hierarki (A-K)** der:
- **A-spillere** (elite) har høyere krav for å oppnå samme badge
- **K-spillere** (nybegynnere) har lavere krav tilpasset deres nivå
- Alle spillere kan oppnå alle badges, men kravene skaleres

---

## 1. Kategori-Nivåer

| Kategori | Beskrivelse | Multiplikator |
|----------|-------------|---------------|
| A | Elite/Tour-aspirant | 1.0 (baseline) |
| B | Høyt nivå | 0.95 |
| C | Regionalt nivå | 0.90 |
| D | Klubbnivå+ | 0.85 |
| E | Klubbnivå | 0.80 |
| F | Aktiv amatør | 0.70 |
| G | Utviklingsspiller | 0.60 |
| H | Mellomnivå | 0.50 |
| I | Nybegynner+ | 0.40 |
| J | Nybegynner | 0.35 |
| K | Helt ny | 0.30 |

**Multiplikator-prinsipp:** K-spiller når "100 treningstimer"-badge ved 30 timer.

---

## 2. Badge-Kategorier med Skalering

### 2.1 Volume Badges (Treningsmengde)

| Badge | A-krav | K-krav | Formel |
|-------|--------|--------|--------|
| Første time | 1 time | 1 time | Ikke skalert |
| Dedikert | 100 timer | 30 timer | base × mult |
| Marathoner | 500 timer | 150 timer | base × mult |
| Elite Volum | 1000 timer | 300 timer | base × mult |

### 2.2 Streak Badges (Konsistens)

| Badge | A-krav | K-krav | Formel |
|-------|--------|--------|--------|
| 3-dagers streak | 3 dager | 3 dager | Ikke skalert |
| Ukes-streak | 7 dager | 5 dager | base × mult |
| Måneds-streak | 30 dager | 15 dager | base × mult |
| Kvartals-streak | 90 dager | 30 dager | base × mult |

### 2.3 Strength Badges (Fysisk)

| Badge | A-krav | K-krav | Formel |
|-------|--------|--------|--------|
| Tonnage 1000kg | 1000 kg | 300 kg | base × mult |
| Tonnage 5000kg | 5000 kg | 1500 kg | base × mult |
| 1RM Improvement | 10% økning | 10% | Prosent (ikke skalert) |

### 2.4 Speed Badges (Clubhead Speed)

| Badge | A-krav (mph) | K-krav (mph) | Type |
|-------|--------------|--------------|------|
| Speed 100+ | 100 | 70 | Absolutt verdi |
| Speed 110+ | 110 | 77 | Absolutt verdi |
| Speed 120+ | 120 | 84 | Absolutt verdi |
| Speed PR | Ny PR | Ny PR | Relativt (ikke skalert) |

### 2.5 Scoring Badges

| Badge | A-krav | K-krav | Kommentar |
|-------|--------|--------|-----------|
| Par-runde | 72 | 100 | Kategori-baseline |
| Under par | 71 | N/A | Kun A-C |
| Birdie-runde | 5+ birdies | 1+ birdie | Skalert antall |

---

## 3. Skaleringsprinsipper

### 3.1 Absolutte vs. Relative Metrics

```
ABSOLUTTE (skaleres):
- Timer trent
- Dager i streak
- Tonnage løftet
- Clubhead speed

RELATIVE (skaleres IKKE):
- Prosentvis forbedring
- Personlig rekord
- Fullførte tester
```

### 3.2 Skaleringsformel

```typescript
function getScaledRequirement(
  baseValue: number,
  playerCategory: string
): number {
  const multipliers: Record<string, number> = {
    'A': 1.00, 'B': 0.95, 'C': 0.90, 'D': 0.85, 'E': 0.80,
    'F': 0.70, 'G': 0.60, 'H': 0.50, 'I': 0.40, 'J': 0.35, 'K': 0.30
  };

  const mult = multipliers[playerCategory] ?? 1.0;
  return Math.round(baseValue * mult);
}
```

### 3.3 Kategori-Oppgradering

Når spiller endrer kategori (f.eks. G → F):
1. **Allerede opptjente badges beholdes**
2. **Progress re-kalkuleres** mot nye krav
3. **Nye badges låses opp** basert på eksisterende data
4. **Ingen badges fjernes**

---

## 4. Implementeringsplan

### Fase 1: Database-endringer (Dag 1-2)

```prisma
// Legg til i schema.prisma

model BadgeDefinition {
  id            String   @id @db.Uuid
  name          String   @db.VarChar(100)
  category      String   @db.VarChar(50)
  icon          String   @db.VarChar(10)

  // Base-krav (for A-spiller)
  baseRequirements  Json  @db.JsonB

  // Skaleringstype
  scalingType   String   @default("multiplier") // multiplier | none | custom

  // XP (skaleres også)
  baseXP        Int
}

model PlayerBadgeProgress {
  id            String   @id @db.Uuid
  playerId      String   @db.Uuid
  badgeId       String   @db.Uuid

  // Spillerens kategori ved beregning
  playerCategory  String @db.VarChar(2)

  // Skalerte krav for denne spilleren
  scaledRequirements  Json @db.JsonB

  // Progress
  currentProgress  Decimal @db.Decimal(5,2)
  earnedAt         DateTime?
}
```

### Fase 2: Badge Calculator (Dag 3-5)

```typescript
// badge-calculator-v2.ts

interface ScaledBadgeResult {
  badgeId: string;
  baseRequirement: number;
  scaledRequirement: number;
  currentValue: number;
  progress: number;
  earned: boolean;
}

export function calculateBadgeProgressForPlayer(
  badge: BadgeDefinition,
  player: { category: string; metrics: PlayerMetrics }
): ScaledBadgeResult {

  // 1. Hent base-krav
  const baseReq = badge.baseRequirements[0].value;

  // 2. Skaler basert på kategori
  const scaledReq = badge.scalingType === 'none'
    ? baseReq
    : getScaledRequirement(baseReq, player.category);

  // 3. Hent spillerens nåværende verdi
  const currentValue = getMetricValue(player.metrics, badge.metric);

  // 4. Beregn progress
  const progress = Math.min(100, (currentValue / scaledReq) * 100);

  return {
    badgeId: badge.id,
    baseRequirement: baseReq,
    scaledRequirement: scaledReq,
    currentValue,
    progress,
    earned: progress >= 100
  };
}
```

### Fase 3: API-endringer (Dag 6-7)

```typescript
// GET /api/v1/players/:id/badges

interface BadgeResponse {
  badge: BadgeDefinition;
  playerCategory: string;
  requirement: {
    base: number;
    scaled: number;
    label: string;
  };
  progress: number;
  earned: boolean;
  earnedAt?: Date;
}
```

### Fase 4: UI-oppdatering (Dag 8-10)

```tsx
// BadgeCard component

<BadgeCard>
  <BadgeIcon />
  <BadgeName />

  {/* Vis skalert krav */}
  <RequirementText>
    {scaledRequirement} timer
    <span className="text-muted">
      (A-krav: {baseRequirement})
    </span>
  </RequirementText>

  <ProgressBar value={progress} />
</BadgeCard>
```

---

## 5. XP-Skalering

XP for badges skaleres **omvendt** - lavere kategorier får mer XP:

| Kategori | XP Multiplikator |
|----------|------------------|
| A | 1.0x |
| B-C | 1.1x |
| D-E | 1.2x |
| F-G | 1.3x |
| H-I | 1.4x |
| J-K | 1.5x |

**Logikk:** En K-spiller som trener 30 timer har lagt ned samme relative innsats som en A-spiller med 100 timer.

---

## 6. Spesielle Badges

### 6.1 Kategori-Uavhengige (Alltid samme krav)

- **Første Trening** - 1 økt
- **Profil Komplett** - Fullfør profil
- **Test Gjennomført** - Ta første test
- **Personlig Rekord** - Slå egen PR

### 6.2 Kategori-Spesifikke (Kun tilgjengelig for visse kategorier)

- **Tour-Ready** - Kun A-B spillere (WAGR < 1000)
- **College-Level** - Kun A-C spillere
- **Junior Champion** - Kun U18 med kategori D eller bedre

### 6.3 Relative Badges (Prosent-basert)

- **10% Raskere** - Øk clubhead speed med 10%
- **Handicap Halvert** - Reduser handicap med 50%
- **Tonnage Doblet** - Doble månedlig tonnage

---

## 7. Visning i UI

### Eksempel: Badge "Marathoner"

**For A-spiller:**
```
🏃 Marathoner
500 timer trent
[████████░░] 420/500 timer (84%)
```

**For K-spiller:**
```
🏃 Marathoner
150 timer trent (A-krav: 500)
[██████████] 150/150 timer - OPPNÅDD!
```

---

## 8. Migration av Eksisterende Data

1. **Beregn alle spilleres progress** med nye skalerte krav
2. **Tildel badges retroaktivt** der krav er møtt
3. **Generer unlock-events** for nye badges
4. **Oppdater XP-totaler**

---

## 9. Testing Checklist

- [ ] K-spiller får badge med 30% av A-krav
- [ ] A-spiller må møte fulle krav
- [ ] Kategori-oppgradering beholder badges
- [ ] XP skaleres korrekt
- [ ] Progress-bar viser riktig verdi
- [ ] API returnerer skalerte verdier

---

## 10. Tidslinje

| Fase | Oppgave | Dager |
|------|---------|-------|
| 1 | Database-endringer | 2 |
| 2 | Badge Calculator v2 | 3 |
| 3 | API-oppdateringer | 2 |
| 4 | UI-komponenter | 3 |
| 5 | Testing & QA | 2 |
| 6 | Migration | 1 |
| **Total** | | **13 dager** |

---

## Neste Steg

1. **Godkjenn plan** - Er konseptet riktig?
2. **Definer alle multiplikatorer** - Er 0.30 for K riktig?
3. **Velg hvilke badges som skaleres** - Noen bør kanskje være faste
4. **Bestem XP-modell** - Skal lavere kategorier få mer XP?
