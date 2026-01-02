# Terminologi Mapping - IUP Golf App
> **Formål:** Standardisere all terminologi i appen til norsk
> **Sist oppdatert:** 2. januar 2026

---

## Arbeidsflyt

1. **Fyll ut "Norsk term"** kolonnen under
2. **Send til Claude:** "Oppdater terminologi basert på TERMINOLOGI_MAPPING.md"
3. **Review endringene** i git diff
4. **Commit og deploy**

---

## Termer å standardisere

### Treningsområder (høy prioritet)

| Engelsk term | Forekomster | Norsk term | Status |
|--------------|-------------|------------|--------|
| Short Game | 18 | Nærspill | ⬜ Ikke endret |
| Long Game | 2 | Langspill | ⬜ Ikke endret |
| Putting | 420 | Putting | ✅ Behold |
| Chipping | 42 | Chipping | ⬜ Vurder: Kortspill? |
| Pitching | 8 | Pitching | ⬜ Vurder: Mellomdistanse? |
| Full Swing | 16 | Full sving | ⬜ Ikke endret |
| Approach | 235 | Innspill | ⬜ Ikke endret |
| Bunker | 87 | Bunker | ✅ Behold |

### Utstyr

| Engelsk term | Forekomster | Norsk term | Status |
|--------------|-------------|------------|--------|
| Driver | 176 | Driver | ✅ Behold |
| Iron | 41 | Jern | ⬜ Ikke endret |
| Wedge | 51 | Wedge | ✅ Behold |

### Bane-elementer

| Engelsk term | Forekomster | Norsk term | Status |
|--------------|-------------|------------|--------|
| Fairway | 36 | Fairway | ✅ Behold |
| Green | 110 | Green | ✅ Behold |
| Tee Shot | - | Utslagsslag | ⬜ Vurder |

### Treningskategorier

| Engelsk term | Forekomster | Norsk term | Status |
|--------------|-------------|------------|--------|
| Mental | 203 | Mental | ✅ Behold |
| Physical | 84 | Fysisk | ⬜ Ikke endret |
| Strategy | 4 | Strategi | ⬜ Ikke endret |

---

## Domenespesifikke termer

### Testsystem

| Engelsk | Norsk | Kontekst |
|---------|-------|----------|
| PEI (Proximity Efficiency Index) | PEI | Behold forkortelse |
| Strokes Gained | Strokes Gained | Behold (bransjestd) |
| Clubhead Speed | Klubbhodehastighet | Vurder |
| Ball Speed | Ballhastighet | Vurder |
| Launch Angle | Utskytningsvinkel | Vurder |
| Smash Factor | Smash Factor | Behold (bransjestd) |
| Carry Distance | Carry-lengde | Vurder |

### Treningsperioder

| Engelsk | Norsk | Kontekst |
|---------|-------|----------|
| Ground Period | Grunnperiode | ⬜ |
| Specialization Period | Spesialiseringsperiode | ⬜ |
| Tournament Period | Turneringsperiode | ⬜ |
| Evaluation Period | Evalueringsperiode | ⬜ |

### UI-elementer

| Engelsk | Norsk | Kontekst |
|---------|-------|----------|
| Dashboard | Dashboard | Behold |
| Profile | Profil | ⬜ |
| Settings | Innstillinger | ⬜ |
| Training Plan | Treningsplan | ⬜ |
| Test Results | Testresultater | ⬜ |

---

## Instruksjoner til Claude

Når du er ferdig med å fylle ut tabellen, kopier denne kommandoen:

```
Les docs/TERMINOLOGI_MAPPING.md og oppdater alle termer
som er markert "⬜ Ikke endret" til den norske termen.
Vis meg en oppsummering av endringer før du committer.
```

---

## Notater

- **Behold engelske termer** som er bransjestandarder (Strokes Gained, Smash Factor)
- **Putting, Bunker, Wedge, Driver** er så innarbeidet at norske alternativer blir kunstige
- **Vurder kontekst:** Noen steder kan engelsk passe bedre (tekniske rapporter)

---

_Oppdater denne filen etter hvert som du gjør endringer_
