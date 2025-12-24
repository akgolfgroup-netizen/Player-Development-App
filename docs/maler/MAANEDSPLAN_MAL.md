# Månedsplan - Mal (Struktur)
> AK Golf Academy | Nivåprinsippet
> Versjon: 1.0 | Dato: 21. desember 2025

---

## MÅNEDSPLAN STRUKTUR

### Metadata

```json
{
  "id": "UUID",
  "playerId": "UUID",
  "planId": "UUID (årsplan)",
  "category": "A-K",
  "month": 1-12,
  "year": 2025,
  "period": "E|G|S|T",
  "phase": "early|mid|late",
  "status": "draft|active|completed",
  "createdAt": "ISO-date",
  "updatedAt": "ISO-date"
}
```

---

## MÅNEDSMÅL

```json
{
  "primaryGoal": {
    "type": "technical|physical|mental|tactical|scoring",
    "description": "string",
    "metric": "string",
    "targetValue": "number",
    "currentValue": "number"
  },
  "secondaryGoals": [
    {
      "type": "string",
      "description": "string",
      "targetValue": "number"
    }
  ],
  "breakingPointFocus": ["string"]
}
```

---

## UKEOVERSIKT

```json
{
  "weeks": [
    {
      "weekNumber": 1-52,
      "weekType": "normal|benchmark|recovery|tournament|taper",
      "totalHours": "number",
      "distribution": {
        "technical": "percentage",
        "physical": "percentage",
        "shortgame": "percentage",
        "play": "percentage",
        "mental": "percentage"
      },
      "tournaments": ["string"],
      "notes": "string"
    }
  ]
}
```

---

## TRENINGSVOLUM

```json
{
  "plannedHours": {
    "total": "number",
    "perWeek": ["number", "number", "number", "number"],
    "byType": {
      "technical": "number",
      "physical": "number",
      "shortgame": "number",
      "play": "number",
      "mental": "number"
    }
  },
  "actualHours": {
    "total": "number",
    "completionRate": "percentage"
  }
}
```

---

## L-FASE PROGRESJON

```json
{
  "startPhase": "L1-L5",
  "targetPhase": "L1-L5",
  "focusAreas": [
    {
      "area": "driver|irons|wedges|putting|bunker",
      "currentPhase": "L1-L5",
      "targetPhase": "L1-L5"
    }
  ]
}
```

---

## CS-NIVÅ PROGRESJON

```json
{
  "averageCS": "CS20-CS100",
  "targetCS": "CS20-CS100",
  "distribution": {
    "CS40-60": "percentage (grunntrening)",
    "CS60-80": "percentage (variasjon)",
    "CS80-100": "percentage (konkurranse)"
  }
}
```

---

## S-SETTING DISTRIBUSJON

```json
{
  "settings": {
    "S1-S3": "percentage (range/øvingsgreen)",
    "S4-S6": "percentage (treningsrunder)",
    "S7-S10": "percentage (turneringer)"
  }
}
```

---

## BENCHMARK-TESTER

```json
{
  "scheduledTests": [
    {
      "weekNumber": "number",
      "tests": [1, 5, 8, 12],
      "date": "ISO-date"
    }
  ],
  "completedTests": [
    {
      "testNumber": 1-20,
      "result": "number",
      "requirement": "number",
      "passed": "boolean",
      "date": "ISO-date"
    }
  ]
}
```

---

## TURNERINGER

```json
{
  "tournaments": [
    {
      "name": "string",
      "date": "ISO-date",
      "type": "TRE|UTV|RES",
      "importance": 1-5,
      "taperDays": "number",
      "recoveryDays": "number"
    }
  ]
}
```

---

## MÅNEDSEVALUERING

```json
{
  "evaluation": {
    "goalsAchieved": "boolean",
    "hoursCompleted": "number",
    "completionRate": "percentage",
    "keyLearnings": ["string"],
    "challenges": ["string"],
    "adjustmentsNeeded": ["string"],
    "coachNotes": "string",
    "playerReflection": "string"
  }
}
```

---

## EKSEMPEL: Kategori D, Februar (Grunnperiode)

```json
{
  "metadata": {
    "category": "D",
    "month": 2,
    "year": 2025,
    "period": "G",
    "phase": "mid"
  },
  "primaryGoal": {
    "type": "technical",
    "description": "Forbedre driver konsistens",
    "metric": "fairway_hit_percentage",
    "targetValue": 55,
    "currentValue": 48
  },
  "weeks": [
    { "weekNumber": 5, "weekType": "normal", "totalHours": 12 },
    { "weekNumber": 6, "weekType": "benchmark", "totalHours": 10 },
    { "weekNumber": 7, "weekType": "normal", "totalHours": 12 },
    { "weekNumber": 8, "weekType": "normal", "totalHours": 12 }
  ],
  "plannedHours": {
    "total": 46,
    "byType": {
      "technical": 18,
      "physical": 14,
      "shortgame": 9,
      "mental": 5
    }
  },
  "lPhaseProgression": {
    "startPhase": "L2",
    "targetPhase": "L3",
    "focusAreas": [
      { "area": "driver", "currentPhase": "L2", "targetPhase": "L3" }
    ]
  }
}
```

---

**Status**: Strukturmal uten innhold
**Neste**: Fylles med kategori-spesifikke verdier
