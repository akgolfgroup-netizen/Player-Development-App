# Multi-Sport Tier - Prosjektoversikt

> Offline arbeidsmappe for flytur - 4 timer

## Dokumenter i denne mappen

| Fil | Innhold |
|-----|---------|
| `00-OVERSIKT.md` | Denne filen - innholdsfortegnelse og sammendrag |
| `01-ROADMAP.md` | Komplett prosjektplan med faser og estimater |
| `02-NÅVÆRENDE-STATUS.md` | Detaljert analyse av hva som er implementert |
| `03-FASE-1-IDRETTSBYTTE.md` | Teknisk guide for Fase 1 |
| `04-FASE-2-DATAMODELL.md` | Teknisk guide for Fase 2 |
| `05-FASE-3-UI-INTEGRASJON.md` | Teknisk guide for Fase 3 |
| `06-FILREFERANSE.md` | Komplett liste over alle relevante filer |
| `07-KODEEKSEMPLER.md` | Kode-snippets og mønstre å følge |
| `08-SJEKKLISTE.md` | Praktisk sjekkliste for implementering |

---

## Rask oversikt

### Hva er ferdig (95%)
- 7 komplette sport-konfigurasjoner (5,254 linjer)
- Database schema med SportId enum
- API endpoints for sport-config
- React Context og hooks
- Service layer

### Hva mangler (5% men kritisk)
- App.jsx bruker hardkodet `SportProvider sportId="golf"`
- Data-tabeller mangler `sportId` felt
- Kun 3 komponenter bruker sport context
- Feature flags ikke implementert i UI

### Kritisk første steg
```jsx
// Fra (nåværende - hardkodet):
<SportProvider sportId="golf">

// Til (dynamisk):
<ApiSportProvider>
```

---

## Tidsestimat sammendrag

| Milepæl | Timer | Resultat |
|---------|-------|----------|
| MVP | 14t | Idrettsbytte fungerer |
| Alpha | 26t | Data separert per idrett |
| Beta | 49t | UI dynamisk |
| Release | 77t | Produksjonsklar |

---

## Anbefalt arbeidsrekkefølge på flyet

### Time 1: Lesing og planlegging
- [ ] Les `02-NÅVÆRENDE-STATUS.md` grundig
- [ ] Gå gjennom `06-FILREFERANSE.md`
- [ ] Noter spørsmål og uklarheter

### Time 2: Fase 1 planlegging
- [ ] Les `03-FASE-1-IDRETTSBYTTE.md`
- [ ] Skisser UI for SportSelector
- [ ] Planlegg API-endepunkt for bytte

### Time 3: Fase 2 planlegging
- [ ] Les `04-FASE-2-DATAMODELL.md`
- [ ] Planlegg database-migrering
- [ ] Vurder bakoverkompatibilitet

### Time 4: Prioritering og beslutninger
- [ ] Bruk `08-SJEKKLISTE.md` for å validere
- [ ] Bestem hvilke features som er MVP
- [ ] Lag personlig TODO-liste
