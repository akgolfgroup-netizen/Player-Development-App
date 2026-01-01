# Ukeplan - Mal (Struktur)
> AK Golf Academy | Nivåprinsippet
> Versjon: 1.0 | Dato: 21. desember 2025

---

## UKEPLAN STRUKTUR

### Metadata

```json
{
  "id": "UUID",
  "playerId": "UUID",
  "planId": "UUID (årsplan)",
  "monthPlanId": "UUID (månedsplan)",
  "category": "A-K",
  "weekNumber": 1-52,
  "year": 2025,
  "period": "E|G|S|T",
  "weekType": "normal|benchmark|recovery|tournament|taper",
  "status": "draft|active|completed",
  "createdAt": "ISO-date",
  "updatedAt": "ISO-date"
}
```

---

## UKEMÅL

```json
{
  "weeklyFocus": {
    "primary": "string (hovedfokus for uken)",
    "secondary": "string",
    "breakingPoints": ["string"]
  },
  "targetMetrics": {
    "totalHours": "number",
    "sessionsPlanned": "number",
    "qualityTarget": 1-10
  }
}
```

---

## DAGSOVERSIKT

```json
{
  "days": {
    "monday": {
      "sessions": ["sessionId"],
      "totalMinutes": "number",
      "type": "technical|physical|play|rest",
      "notes": "string"
    },
    "tuesday": { },
    "wednesday": { },
    "thursday": { },
    "friday": { },
    "saturday": { },
    "sunday": { }
  }
}
```

---

## TRENINGSFORDELING

```json
{
  "distribution": {
    "technical": {
      "minutes": "number",
      "percentage": "number",
      "sessions": ["sessionId"]
    },
    "physical": {
      "minutes": "number",
      "percentage": "number",
      "sessions": ["sessionId"]
    },
    "shortgame": {
      "minutes": "number",
      "percentage": "number",
      "sessions": ["sessionId"]
    },
    "play": {
      "minutes": "number",
      "percentage": "number",
      "sessions": ["sessionId"]
    },
    "mental": {
      "minutes": "number",
      "percentage": "number",
      "sessions": ["sessionId"]
    }
  }
}
```

---

## L-FASE FORDELING

```json
{
  "lPhaseDistribution": {
    "L1": { "minutes": "number", "percentage": "number" },
    "L2": { "minutes": "number", "percentage": "number" },
    "L3": { "minutes": "number", "percentage": "number" },
    "L4": { "minutes": "number", "percentage": "number" },
    "L5": { "minutes": "number", "percentage": "number" }
  },
  "dominantPhase": "L1-L5"
}
```

---

## CS-NIVÅ FORDELING

```json
{
  "csDistribution": {
    "CS40-60": { "minutes": "number", "percentage": "number" },
    "CS60-80": { "minutes": "number", "percentage": "number" },
    "CS80-100": { "minutes": "number", "percentage": "number" }
  },
  "averageCS": "CS20-CS100"
}
```

---

## S-SETTING FORDELING

```json
{
  "settingDistribution": {
    "S1": { "minutes": "number", "sessions": "number" },
    "S2": { "minutes": "number", "sessions": "number" },
    "S3": { "minutes": "number", "sessions": "number" },
    "S4": { "minutes": "number", "sessions": "number" },
    "S5": { "minutes": "number", "sessions": "number" },
    "S6": { "minutes": "number", "sessions": "number" },
    "S7": { "minutes": "number", "sessions": "number" },
    "S8": { "minutes": "number", "sessions": "number" },
    "S9": { "minutes": "number", "sessions": "number" },
    "S10": { "minutes": "number", "sessions": "number" }
  }
}
```

---

## INTENSITET

```json
{
  "intensity": {
    "planned": {
      "monday": 1-10,
      "tuesday": 1-10,
      "wednesday": 1-10,
      "thursday": 1-10,
      "friday": 1-10,
      "saturday": 1-10,
      "sunday": 1-10
    },
    "average": 1-10,
    "peak": "dayOfWeek"
  }
}
```

---

## RESTITUSJON

```json
{
  "recovery": {
    "restDays": ["sunday"],
    "activeRecovery": ["wednesday"],
    "sleepTarget": "hours",
    "nutritionFocus": "string"
  }
}
```

---

## TURNERINGER (hvis aktuelt)

```json
{
  "tournament": {
    "name": "string",
    "dates": ["ISO-date"],
    "type": "TRE|UTV|RES",
    "preparation": {
      "taperStart": "ISO-date",
      "focusSessions": ["sessionId"]
    }
  }
}
```

---

## BENCHMARK (hvis benchmark-uke)

```json
{
  "benchmark": {
    "tests": [1, 5, 8, 12],
    "scheduledDate": "ISO-date",
    "previousResults": {
      "test1": "number",
      "test5": "number"
    },
    "targetResults": {
      "test1": "number",
      "test5": "number"
    }
  }
}
```

---

## UKEEVALUERING

```json
{
  "evaluation": {
    "completedSessions": "number",
    "totalMinutes": "number",
    "completionRate": "percentage",
    "qualityRating": 1-10,
    "energyLevel": 1-10,
    "keyWins": ["string"],
    "challenges": ["string"],
    "playerNotes": "string",
    "coachFeedback": "string"
  }
}
```

---

## EKSEMPEL: Kategori D, Uke 6 (Benchmark-uke, Grunnperiode)

```json
{
  "metadata": {
    "category": "D",
    "weekNumber": 6,
    "period": "G",
    "weekType": "benchmark"
  },
  "weeklyFocus": {
    "primary": "Testing og evaluering",
    "secondary": "Vedlikehold teknikk"
  },
  "days": {
    "monday": {
      "sessions": ["teknikk-driver-l2"],
      "totalMinutes": 90,
      "type": "technical"
    },
    "tuesday": {
      "sessions": ["fysisk-styrke"],
      "totalMinutes": 60,
      "type": "physical"
    },
    "wednesday": {
      "sessions": ["shortgame-putting-l2"],
      "totalMinutes": 60,
      "type": "shortgame"
    },
    "thursday": {
      "sessions": [],
      "totalMinutes": 0,
      "type": "rest"
    },
    "friday": {
      "sessions": ["benchmark-test"],
      "totalMinutes": 120,
      "type": "testing"
    },
    "saturday": {
      "sessions": ["spill-9hull-l3"],
      "totalMinutes": 150,
      "type": "play"
    },
    "sunday": {
      "sessions": [],
      "totalMinutes": 0,
      "type": "rest"
    }
  },
  "distribution": {
    "technical": { "minutes": 90, "percentage": 19 },
    "physical": { "minutes": 60, "percentage": 13 },
    "shortgame": { "minutes": 60, "percentage": 13 },
    "play": { "minutes": 150, "percentage": 31 },
    "testing": { "minutes": 120, "percentage": 25 }
  },
  "benchmark": {
    "tests": [2, 3, 4, 14],
    "scheduledDate": "2025-02-07"
  }
}
```

---

## UKEPLAN-VARIANTER

### Per Kategori × Periode = 44 basis-maler

| Kategori | E | G | S | T |
|----------|---|---|---|---|
| A | A-E | A-G | A-S | A-T |
| B | B-E | B-G | B-S | B-T |
| C | C-E | C-G | C-S | C-T |
| D | D-E | D-G | D-S | D-T |
| E | E-E | E-G | E-S | E-T |
| F | F-E | F-G | F-S | F-T |
| G | G-E | G-G | G-S | G-T |
| H | H-E | H-G | H-S | H-T |
| I | I-E | I-G | I-S | I-T |
| J | J-E | J-G | J-S | J-T |
| K | K-E | K-G | K-S | K-T |

### Varianter per mal:
- Normal uke
- Benchmark-uke
- Recovery-uke
- Turnerings-uke
- Taper-uke

**Totalt**: 44 × 2 hovedvarianter = 88 maler

---

**Status**: Strukturmal uten innhold
**Neste**: Fylles med kategori-spesifikke verdier
