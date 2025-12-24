# Øvelse - Mal (Struktur)
> AK Golf Academy | Nivåprinsippet
> Versjon: 1.0 | Dato: 21. desember 2025

---

## ØVELSE STRUKTUR

### Metadata

```json
{
  "id": "UUID",
  "tenantId": "UUID",
  "name": "string",
  "code": "string (unik kode)",
  "description": "string",
  "status": "draft|active|archived",
  "createdAt": "ISO-date",
  "updatedAt": "ISO-date"
}
```

---

## KATEGORISERING

```json
{
  "categorization": {
    "categories": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"],
    "periods": ["E", "G", "S", "T"],
    "learningPhases": ["L1", "L2", "L3", "L4", "L5"],
    "clubSpeedLevels": ["CS20", "CS30", "CS40", "CS50", "CS60", "CS70", "CS80", "CS90", "CS100"],
    "settings": ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10"],
    "processCategory": "technical|physical|mental|tactical"
  }
}
```

---

## GOLF-OMRÅDE

```json
{
  "golfArea": {
    "primary": "driver|fairway|hybrid|long-iron|mid-iron|short-iron|wedge|putting|bunker",
    "secondary": ["string"],
    "position": "P1.0-P10.0 (sving-posisjon)"
  }
}
```

---

## TRENINGSTYPE

```json
{
  "trainingType": {
    "category": "T|G|S|K|Fs|Fu|L1-2|Test",
    "colorCode": "#hexcode",
    "description": "string"
  }
}
```

### Treningstype-koder:
| Kode | Navn | Farge | Beskrivelse |
|------|------|-------|-------------|
| T | Teknikk | #8B6E9D | Full swing fundamentals |
| G | Golfslag | #4A8C7C | Slag-tester og øvelser |
| S | Spill | #4A7C59 | Spillrunder |
| K | Kompetanse | #C45B4E | Mental/taktisk |
| Fs | Fysisk | #D97644 | Styrke/power/mobilitet |
| Fu | Funksjonell | #5FA696 | Golf-spesifikk styrke |
| L1-2 | Hjemme | #8E8E93 | Hjemmetrening |
| Test | Test | #C9A227 | Benchmark-tester |

---

## UTFØRELSE

```json
{
  "execution": {
    "duration": "number (minutter)",
    "reps": "number",
    "sets": "number",
    "restBetweenSets": "number (sekunder)",
    "equipment": ["string"],
    "location": "range|green|course|gym|home"
  }
}
```

---

## INSTRUKSJONER

```json
{
  "instructions": {
    "setup": "string (hvordan starte)",
    "execution": "string (hvordan utføre)",
    "keyPoints": ["string"],
    "commonMistakes": ["string"],
    "cues": ["string (korte stikkord)"]
  }
}
```

---

## BREAKING POINTS

```json
{
  "breakingPoints": {
    "addresses": ["string (hvilke breaking points øvelsen adresserer)"],
    "priority": 1-5
  }
}
```

---

## PROGRESJON

```json
{
  "progression": {
    "prerequisite": "exerciseId (må mestre først)",
    "nextExercise": "exerciseId (neste i progresjon)",
    "regressionExercise": "exerciseId (enklere variant)",
    "advancementCriteria": "string"
  }
}
```

---

## VARIANTER

```json
{
  "variants": {
    "easier": {
      "exerciseId": "UUID",
      "adjustments": ["string"]
    },
    "harder": {
      "exerciseId": "UUID",
      "adjustments": ["string"]
    },
    "indoor": {
      "exerciseId": "UUID",
      "adjustments": ["string"]
    },
    "outdoor": {
      "exerciseId": "UUID",
      "adjustments": ["string"]
    }
  }
}
```

---

## SUKSESSKRITERIER

```json
{
  "successCriteria": {
    "metrics": [
      {
        "name": "string",
        "target": "number",
        "unit": "string",
        "comparison": ">=|<=|range"
      }
    ],
    "qualitativeMarkers": ["string"]
  }
}
```

---

## MEDIA

```json
{
  "media": {
    "images": ["url"],
    "videos": ["url"],
    "diagrams": ["url"]
  }
}
```

---

## EKSEMPEL: Driver Setup Check (Kategori D-F, Grunnperiode)

```json
{
  "metadata": {
    "id": "drv-setup-001",
    "name": "Driver Setup Check",
    "code": "DRV-SETUP-001",
    "description": "Grunnleggende setup-kontroll for driver"
  },
  "categorization": {
    "categories": ["D", "E", "F"],
    "periods": ["G", "S"],
    "learningPhases": ["L1", "L2"],
    "clubSpeedLevels": ["CS40", "CS50", "CS60"],
    "settings": ["S1", "S2"],
    "processCategory": "technical"
  },
  "golfArea": {
    "primary": "driver",
    "secondary": [],
    "position": "P1.0"
  },
  "trainingType": {
    "category": "T",
    "colorCode": "#8B6E9D"
  },
  "execution": {
    "duration": 10,
    "reps": 10,
    "sets": 2,
    "restBetweenSets": 60,
    "equipment": ["driver", "alignment-sticks"],
    "location": "range"
  },
  "instructions": {
    "setup": "Plasser alignment-sticks parallelt med target line. Ball posisjon: innsiden av venstre hæl.",
    "execution": "Ta setup posisjon. Hold 5 sekunder. Sjekk: feet, hips, shoulders alignment. Repeter.",
    "keyPoints": [
      "Føtter skulderbredde",
      "Ball fremme i stance",
      "Skuldre åpne mot target",
      "Vekt 55% høyre fot"
    ],
    "commonMistakes": [
      "Ball for langt bak i stance",
      "Skuldre lukket",
      "For bred stance"
    ],
    "cues": ["Bred-Fremme-Åpen", "55-45"]
  },
  "breakingPoints": {
    "addresses": ["driver-consistency", "alignment"],
    "priority": 1
  },
  "progression": {
    "prerequisite": null,
    "nextExercise": "drv-half-swing-001",
    "advancementCriteria": "Konsistent setup 9/10 reps"
  },
  "successCriteria": {
    "metrics": [
      { "name": "alignment_accuracy", "target": 90, "unit": "percent", "comparison": ">=" }
    ],
    "qualitativeMarkers": ["Naturlig, avslappet posisjon", "Balansert vektfordeling"]
  }
}
```

---

## ØVELSE-KATEGORIER (290 øvelser totalt)

### Fordeling per område:

| Område | Antall | L1-L2 | L3 | L4-L5 |
|--------|--------|-------|-----|-------|
| Driver | 35 | 12 | 12 | 11 |
| Fairway woods | 20 | 7 | 7 | 6 |
| Hybrids | 15 | 5 | 5 | 5 |
| Long irons | 20 | 7 | 7 | 6 |
| Mid irons | 30 | 10 | 10 | 10 |
| Short irons | 25 | 8 | 9 | 8 |
| Wedges | 40 | 13 | 14 | 13 |
| Putting | 50 | 17 | 17 | 16 |
| Bunker | 25 | 8 | 9 | 8 |
| Fysisk | 20 | 7 | 7 | 6 |
| Mental | 10 | 3 | 4 | 3 |

**Total**: 290 øvelser

---

## NAVNEKONVENSJON

```
[OMRÅDE]-[TYPE]-[NUMMER]

Eksempler:
- DRV-SETUP-001 (Driver setup øvelse 1)
- PUT-LAG-003 (Putting lag control øvelse 3)
- WDG-PITCH-005 (Wedge pitch øvelse 5)
- BNK-GREEN-002 (Bunker greenside øvelse 2)
- FYS-ROT-001 (Fysisk rotasjon øvelse 1)
```

---

**Status**: Strukturmal uten innhold
**Neste**: Fylles med konkrete øvelser basert på kategori og L-fase
