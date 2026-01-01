# Øktplan - Mal (Struktur)
> AK Golf Academy | Nivåprinsippet
> Versjon: 1.0 | Dato: 21. desember 2025

---

## ØKTPLAN STRUKTUR

### Metadata

```json
{
  "id": "UUID",
  "tenantId": "UUID",
  "name": "string",
  "code": "string (unik kode)",
  "category": ["A", "B", "C", ...],
  "periods": ["E", "G", "S", "T"],
  "type": "technical|physical|shortgame|play|mental|testing|recovery",
  "duration": "number (minutter)",
  "status": "draft|active|archived",
  "createdAt": "ISO-date",
  "updatedAt": "ISO-date"
}
```

---

## AK-FORMEL

```json
{
  "formula": {
    "lPhase": "L1|L2|L3|L4|L5",
    "csLevel": "CS20-CS100",
    "setting": "S1-S10",
    "area": "driver|fairway|hybrid|long-iron|mid-iron|short-iron|wedge|putting|bunker",
    "focus": "string"
  },
  "formulaCode": "L2_CS50_S1_Driver"
}
```

---

## ØKTSTRUKTUR

```json
{
  "structure": {
    "warmup": {
      "duration": "number (minutter)",
      "exercises": ["exerciseId"],
      "description": "string"
    },
    "main": {
      "duration": "number (minutter)",
      "blocks": [
        {
          "name": "string",
          "duration": "number",
          "exercises": ["exerciseId"],
          "focus": "string",
          "intensity": 1-10
        }
      ]
    },
    "closing": {
      "duration": "number (minutter, typisk 5)",
      "description": "Avsluttende slag med full pre-shot rutine"
    }
  }
}
```

---

## EVALUERING

```json
{
  "evaluation": {
    "ratings": {
      "focus": 1-10,
      "technicalExecution": 1-10,
      "energyLevel": 1-10,
      "mentalState": 1-10
    },
    "preShotRoutine": {
      "consistency": "yes|partial|no",
      "shotsWithFullRoutine": "number"
    },
    "technicalCues": {
      "selected": ["string"],
      "custom": "string"
    },
    "notes": {
      "wentWell": "string",
      "nextSessionFocus": "string",
      "mediaAttached": "boolean"
    },
    "autoComplete": {
      "enabled": "boolean",
      "timeoutMinutes": 15
    }
  }
}
```

---

## TRENINGSPARAMETERE

```json
{
  "parameters": {
    "intensity": {
      "target": 1-10,
      "type": "low|medium|high|peak"
    },
    "volume": {
      "totalReps": "number",
      "totalShots": "number",
      "sets": "number"
    },
    "rest": {
      "betweenSets": "seconds",
      "betweenExercises": "seconds"
    },
    "equipment": ["string"],
    "location": "range|green|course|gym|home"
  }
}
```

---

## BREAKING POINTS

```json
{
  "breakingPoints": {
    "addresses": ["string (hvilke breaking points økten adresserer)"],
    "priority": 1-5
  }
}
```

---

## SUKSESSKRITERIER

```json
{
  "successCriteria": {
    "technical": [
      {
        "metric": "string",
        "target": "number",
        "unit": "string"
      }
    ],
    "completion": {
      "minExercises": "number",
      "minDuration": "number (minutter)",
      "qualityThreshold": 1-10
    }
  }
}
```

---

## PROGRESJON

```json
{
  "progression": {
    "fromSession": "sessionId (forrige i sekvens)",
    "toSession": "sessionId (neste i sekvens)",
    "advancementCriteria": "string",
    "regressionCriteria": "string"
  }
}
```

---

## VARIANTER

```json
{
  "variants": {
    "easier": {
      "sessionId": "UUID",
      "adjustments": ["string"]
    },
    "harder": {
      "sessionId": "UUID",
      "adjustments": ["string"]
    },
    "shorter": {
      "sessionId": "UUID",
      "duration": "number"
    },
    "longer": {
      "sessionId": "UUID",
      "duration": "number"
    }
  }
}
```

---

## COACH-NOTATER

```json
{
  "coachNotes": {
    "keyPoints": ["string"],
    "commonMistakes": ["string"],
    "cues": ["string"],
    "videoReferences": ["url"]
  }
}
```

---

## EKSEMPEL: Teknikk-økt Driver (Kategori D, Grunnperiode)

```json
{
  "metadata": {
    "id": "d-g-teknikk-driver-01",
    "name": "Driver Fundamentals",
    "code": "D-G-TEK-DRV-01",
    "category": ["D", "E"],
    "periods": ["G"],
    "type": "technical",
    "duration": 80
  },
  "formula": {
    "lPhase": "L2",
    "csLevel": "CS50",
    "setting": "S1",
    "area": "driver",
    "focus": "setup og alignment"
  },
  "formulaCode": "L2_CS50_S1_Driver",
  "structure": {
    "warmup": {
      "duration": 15,
      "exercises": ["dynamic-stretch", "alignment-drill"],
      "description": "Dynamisk oppvarming + alignment fokus"
    },
    "main": {
      "duration": 60,
      "blocks": [
        {
          "name": "Setup fokus",
          "duration": 20,
          "exercises": ["driver-setup-check", "grip-pressure"],
          "focus": "Korrekt setup posisjon",
          "intensity": 4
        },
        {
          "name": "Sving med feedback",
          "duration": 25,
          "exercises": ["driver-slow-motion", "driver-half-swing"],
          "focus": "Kontrollert sving CS50",
          "intensity": 5
        },
        {
          "name": "Target practice",
          "duration": 15,
          "exercises": ["driver-target-zone"],
          "focus": "Retning og konsistens",
          "intensity": 6
        }
      ]
    },
    "closing": {
      "duration": 5,
      "description": "5 avsluttende slag med full pre-shot rutine"
    }
  },
  "parameters": {
    "intensity": { "target": 5, "type": "medium" },
    "volume": { "totalShots": 50, "sets": 5 },
    "equipment": ["driver", "alignment-sticks", "impact-tape"],
    "location": "range"
  },
  "breakingPoints": {
    "addresses": ["driver-consistency", "alignment"],
    "priority": 2
  },
  "successCriteria": {
    "technical": [
      { "metric": "alignment_accuracy", "target": 80, "unit": "percent" }
    ],
    "completion": {
      "minExercises": 4,
      "minDuration": 75,
      "qualityThreshold": 6
    }
  },
  "progression": {
    "fromSession": null,
    "toSession": "d-g-teknikk-driver-02",
    "advancementCriteria": "80% alignment accuracy over 3 økter"
  }
}
```

---

## ØKT-TYPER (144 økter totalt)

### Fordeling per kategori:

| Type | Antall per kat | Beskrivelse |
|------|----------------|-------------|
| Teknikk | 4 | Full swing, driver, jern, wedge |
| Fysisk | 2 | Styrke, power/mobilitet |
| Shortgame | 3 | Putting, chipping, bunker |
| Spill | 2 | 9-hull, 18-hull |
| Mental | 1 | Pre-shot, visualisering |
| Testing | 1 | Benchmark-økt |

**Per kategori**: ~13 økter
**11 kategorier × 13 økter** = 143 økter (avrundet til 144)

---

## ØVELSE-REFERANSE (Placeholder)

```json
{
  "exerciseReference": {
    "exerciseId": "UUID",
    "name": "string",
    "duration": "number",
    "reps": "number",
    "description": "string"
  }
}
```

> **Note**: Øvelser defineres separat i OVELSE_MAL.md

---

**Status**: Strukturmal uten innhold
**Neste**: Fylles med konkrete økter basert på kategori og periode
