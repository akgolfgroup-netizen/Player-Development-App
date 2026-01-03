# ChatGPT Brukerreise Bundle

> Dokumentasjon for å jobbe med brukerreiser og navigasjon i IUP Golf-appen.

## Formål

Gi ChatGPT nok kontekst til å:
1. Forstå hva spiller- og coach-modulene inneholder
2. Kategorisere funksjoner riktig
3. Sikre at spilleren alltid har kontroll på hvor ulike funksjoner er
4. Forstå hvordan informasjon vises

---

## Dokumenter i prioritert rekkefølge

### Høyeste prioritet (start her)

| Fil | Innhold | Linjer |
|-----|---------|--------|
| `PLAYER_MODULE_FUNCTIONS.md` | Alle funksjoner i spiller-modulen | ~500 |
| `COACH_MODULE_FUNCTIONS.md` | Alle funksjoner i coach-modulen | ~550 |
| `SCREEN_RESPONSIBILITIES.md` | Hva hver skjerm er ansvarlig for | ~300 |

### Navigasjon og struktur

| Fil | Innhold | Linjer |
|-----|---------|--------|
| `PLAYER_NAVIGATION_OVERVIEW.md` | Spillerens navigasjonsmeny | ~300 |
| `NAVIGATION_CONSOLIDATION_PLAN.md` | Plan for å forenkle navigasjon | ~200 |

### Brukerreiser (detaljert)

| Fil | Innhold | Linjer |
|-----|---------|--------|
| `02_BRUKERREISER.md` | Detaljerte brukerreiser på norsk | ~1500 |
| `user-journeys.md` | Tekniske brukerreiser med diagrammer | ~1400 |
| `FUNCTIONAL_USER_JOURNEY_MAP.md` | Funksjonell brukerreisekart + 16 gaps | ~350 |
| `COACH_ADMIN_JOURNEYS.md` | Coach og admin brukerreiser | ~400 |

### Funksjonsoversikt

| Fil | Innhold | Linjer |
|-----|---------|--------|
| `FEATURE_OVERVIEW_2025.md` | Komplett funksjonsoversikt 2025 | ~600 |
| `APP_FUNCTIONALITY.md` | Detaljert app-funksjonalitet | ~2000 |

### Treningssystem og progresjon

| Fil | Innhold | Linjer |
|-----|---------|--------|
| `KATEGORI_SYSTEM_KOMPLETT.md` | A→K progresjonssystem | ~400 |
| `TESTER_FULL_OVERSIKT.md` | De 20 golf-testene | ~180 |
| `TRENINGSPLAN_ALGORITMER.md` | Hvordan planer genereres | ~500 |
| `PLAN-Hierarkisk-Badge-System.md` | Badge/gamification-struktur | ~180 |

---

## Anbefalt tilnærming for ChatGPT

### Steg 1: Last inn kjernedokumenter
```
PLAYER_MODULE_FUNCTIONS.md
COACH_MODULE_FUNCTIONS.md
SCREEN_RESPONSIBILITIES.md
```

### Steg 2: Spør om kategorisering
"Basert på disse funksjonene, hvordan bør navigasjonen struktureres slik at spilleren alltid vet hvor ting er?"

### Steg 3: Last inn navigasjonsdokumenter
```
PLAYER_NAVIGATION_OVERVIEW.md
NAVIGATION_CONSOLIDATION_PLAN.md
```

### Steg 4: Valider mot brukerreiser
```
FUNCTIONAL_USER_JOURNEY_MAP.md (inneholder 16 identifiserte gaps)
```

---

## Nøkkelspørsmål for ChatGPT

1. **Kategorisering:**
   - Hvordan gruppere funksjoner logisk?
   - Hvilke funksjoner hører sammen?

2. **Navigasjon:**
   - Maksimalt hvor mange toppnivå-menypunkter?
   - Hvordan balansere dybde vs bredde?

3. **Konsistens:**
   - Er samme funksjon plassert likt for spiller og coach?
   - Finnes det duplikater som kan fjernes?

4. **Informasjonsarkitektur:**
   - Hvilken informasjon vises hvor?
   - Hvordan unngå at spilleren må lete?

---

## Totalt innhold

- **16 dokumenter**
- **~9700 linjer**
- **~400 KB**

---

## Anbefalt oppdeling for ChatGPT

ChatGPT har begrenset kontekst. Her er anbefalt oppdeling:

### Sesjon 1: Moduler og navigasjon (~1600 linjer)
```
PLAYER_MODULE_FUNCTIONS.md
COACH_MODULE_FUNCTIONS.md
SCREEN_RESPONSIBILITIES.md
PLAYER_NAVIGATION_OVERVIEW.md
```

### Sesjon 2: Treningssystem (~1300 linjer)
```
KATEGORI_SYSTEM_KOMPLETT.md
TESTER_FULL_OVERSIKT.md
TRENINGSPLAN_ALGORITMER.md
PLAN-Hierarkisk-Badge-System.md
```

### Sesjon 3: Brukerreiser (~2000 linjer)
```
FUNCTIONAL_USER_JOURNEY_MAP.md
02_BRUKERREISER.md (kan kuttes ned)
```

### Sesjon 4: Detaljert funksjonalitet (hvis behov)
```
APP_FUNCTIONALITY.md
FEATURE_OVERVIEW_2025.md
```
