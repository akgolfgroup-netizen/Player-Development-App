# System Coherence Documentation

> Dokumentasjon for å sikre at IUP Golf-systemet er idrettsfaglig koherent, ikke bare teknisk imponerende.

## Dokumenter i denne mappen

| # | Dokument | Formål |
|---|----------|--------|
| 01 | [GAP_ANALYSIS.md](./01_GAP_ANALYSIS.md) | Kartlegging av hva som finnes vs mangler |
| 02 | [CRITICAL_DECISIONS.md](./02_CRITICAL_DECISIONS.md) | Beslutninger som MÅ tas før algoritmer røres |
| 03 | [IMPLEMENTATION_PLAN.md](./03_IMPLEMENTATION_PLAN.md) | Konkret implementeringsplan (fylles ut etter beslutninger) |
| 04 | [SESSION_TEMPLATES_INVENTORY.md](./04_SESSION_TEMPLATES_INVENTORY.md) | Komplett oversikt over 39 session templates |
| 05 | [MEASUREMENT_INVENTORY.md](./05_MEASUREMENT_INVENTORY.md) | Alle tester, metrics og datakilder |

## Bakgrunn

Systemet har:
- 20 golf-spesifikke tester med presis matematikk
- 39 session templates med perioder og learning phases
- Detaljert breaking point tracking
- Separasjon mellom effort og progress

Men mangler:
- Kobling mellom spillermål og planalgoritme
- Automatisk re-planlegging
- Kategori-validering av mål
- Strukturert øvelsesprogresjon

## Beslutningsprosess

1. **Les GAP_ANALYSIS** - Forstå nåsituasjonen
2. **Gjennomgå CRITICAL_DECISIONS** - Anbefalinger er fylt inn, godkjenn eller juster
3. **Følg IMPLEMENTATION_PLAN** - Implementer i riktig rekkefølge

## Anbefalte beslutninger (oppsummert)

| # | Beslutning | Anbefaling |
|---|-----------|------------|
| 1 | Plan regenerering | **D** - Foreslå, ikke tving |
| 2 | Mål-validering | **B** - Soft validation (advarsel) |
| 3 | Test → handling | **B+E** - BP-lukking + kategori-opprykk |
| 4 | Øvelsesprogresjon | **D** - Kategori-basert filter |

Se `02_CRITICAL_DECISIONS.md` for full begrunnelse og implementeringsdetaljer.

---

*Sist oppdatert: 2026-01-03*
