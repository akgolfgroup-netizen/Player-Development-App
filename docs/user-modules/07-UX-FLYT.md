# UX-flyter

> Brukerreiser og interaksjonsflyter

---

## 1. Spiller-reiser

### 1.1 Første gangs bruk

```
Mottatt invitasjon
        ↓
Klikk på link i email
        ↓
Registreringsskjema
├─ Navn (forhåndsutfylt fra invitasjon)
├─ Email (låst)
├─ Passord (nytt)
└─ Bekreft passord
        ↓
Onboarding-wizard
├─ Steg 1: Velkommen
├─ Steg 2: Personlig info
├─ Steg 3: Idrett og nivå
├─ Steg 4: Mål
└─ Steg 5: Fullført
        ↓
Dashboard (første gang)
├─ Velkomst-melding
├─ Tips for å komme i gang
└─ Rask tilgang til "Logg første økt"
```

### 1.2 Daglig bruk - Logg trening

```
Åpne app
        ↓
Dashboard (eller direkte til Logg)
        ↓
Klikk "Logg trening" (FAB eller meny)
        ↓
Treningslogg-skjema
├─ Velg dato (default: i dag)
├─ Velg treningsområde
├─ Velg miljø
├─ Angi varighet
├─ Velg intensitet
├─ (Valgfritt) Legg til øvelser
└─ (Valgfritt) Notater
        ↓
Bekreftelse
├─ "Trening lagret!"
├─ Streak-oppdatering (hvis relevant)
└─ Achievement-varsling (hvis opptjent)
        ↓
Tilbake til Dashboard (oppdatert)
```

### 1.3 Ukentlig bruk - Se fremgang

```
Åpne app
        ↓
Gå til "Utvikling"
        ↓
Statistikk-oversikt
├─ Treningsvolum (uke/måned)
├─ Treningsmiks (områder)
└─ Trend-indikator
        ↓
(Klikk for detaljer)
        ↓
Detaljert visning
├─ Graf over tid
├─ Sammenligning med mål
└─ Sammenligning med benchmarks
        ↓
(Valgfritt) Del med coach
```

### 1.4 Månedlig bruk - Registrer test

```
Varsel: "Tid for månedlig test"
        ↓
Klikk på varsel → Test-side
        ↓
Velg testprotokoll
        ↓
Les instruksjoner
        ↓
Gjennomfør test (utenfor app)
        ↓
Registrer resultater
├─ Fyll inn skjema
├─ Se umiddelbar score
└─ Se sammenligning med forrige
        ↓
Lagre
        ↓
Resultat-visning
├─ Din score
├─ Benchmark-sammenligning
├─ Historisk utvikling
└─ (Valgfritt) Del med coach
```

---

## 2. Coach-reiser

### 2.1 Daglig rutine

```
Åpne app
        ↓
Coach Dashboard
├─ Varsler som krever handling
│   ├─ Spillere uten aktivitet
│   ├─ Meldinger fra spillere
│   └─ Kommende økter
├─ Dagens program
└─ Rask statistikk
        ↓
Håndter varsler
├─ Klikk på varsel
├─ Se detalj
└─ Utfør handling (melding, plan, etc.)
        ↓
Gjennomgå planlagte økter
├─ Se hvem som har økt i dag
├─ Juster om nødvendig
└─ Send påminnelser
```

### 2.2 Følge opp spiller

```
Gå til "Spillere"
        ↓
Søk/velg spiller
        ↓
Spiller-profil
├─ Oversikt-tab (default)
│   ├─ Nøkkelmetrikker
│   ├─ Siste aktivitet
│   └─ Status-indikator
├─ Trening-tab
│   ├─ Treningshistorikk
│   ├─ Treningsmiks
│   └─ Volum-trend
├─ Tester-tab
│   ├─ Testhistorikk
│   └─ Fremgangsgrafer
└─ Mål-tab
    ├─ Aktive mål
    └─ Fullførte mål
        ↓
Utfør handling
├─ Send melding
├─ Lag treningsplan
├─ Gi feedback
└─ Juster mål
```

### 2.3 Lage treningsplan

```
Fra spiller-profil eller "Plan"-seksjonen
        ↓
"Lag ny plan" → Velg type
├─ Årsplan
├─ Periodeplan
└─ Ukesplan
        ↓
Plan-generator/editor
├─ Velg spiller(e)
├─ Sett periode
├─ Definer mål for perioden
├─ Legg til faser (årsplan)
├─ Legg til økter
└─ Legg til turneringer
        ↓
Forhåndsvisning
        ↓
Lagre / Publiser
        ↓
(Valgfritt) Send til spiller for godkjenning
```

### 2.4 Analyse på tvers av spillere

```
Gå til "Analyse"
        ↓
Velg analysetype
├─ Treningsvolum
├─ Fremgang
├─ Testresultater
└─ Sammenligning
        ↓
Sett filtre
├─ Periode
├─ Spillere / Gruppe
└─ Metrikker
        ↓
Se resultater
├─ Grafer
├─ Tabeller
└─ Innsikter
        ↓
(Valgfritt) Generer rapport
├─ Velg format (PDF/Excel)
├─ Velg innhold
└─ Last ned / Del
```

---

## 3. Kommunikasjonsflyter

### 3.1 Spiller mottar melding fra coach

```
Push-varsel: "Ny melding fra Coach [Navn]"
        ↓
Klikk → Åpner meldingsvisning
        ↓
Les melding
        ↓
(Valgfritt) Svar
├─ Skriv tekst
├─ Legg ved bilde/video
└─ Send
        ↓
Bekreftelse: "Sendt"
```

### 3.2 Coach sender gruppe-melding

```
Gå til "Meldinger" eller fra gruppe
        ↓
"Ny melding"
        ↓
Velg mottakere
├─ Enkeltspiller(e)
├─ Gruppe
└─ Alle
        ↓
Skriv melding
├─ Emne (valgfritt)
├─ Tekst
└─ Vedlegg (valgfritt)
        ↓
(Valgfritt) Planlegg sending
        ↓
Send / Planlegg
        ↓
Bekreftelse med status
```

---

## 4. Varslings-flyter

### 4.1 Automatiske varsler

```
System oppdager hendelse
├─ Spiller inaktiv i X dager
├─ Mål nærmer seg deadline
├─ Test under benchmark
└─ Ny melding mottatt
        ↓
Generer varsel
├─ Push-notifikasjon (hvis aktivert)
├─ In-app varsel
└─ (Valgfritt) Email
        ↓
Bruker ser varsel
        ↓
Bruker handler på varsel
        ↓
Varsel markeres som lest
```

### 4.2 Coach-varsler

```
Daglig oppsummering (valgfritt)
├─ Spillere som trenger oppfølging
├─ Økter i dag
└─ Ventende oppgaver
        ↓
Push eller email kl. [konfigurert tid]
        ↓
Klikk → Dashboard med filtrert visning
```

---

## 5. Mobil-spesifikke flyter

### 5.1 Hurtig logg (widget)

```
Fra hjemskjerm-widget
        ↓
Klikk "Logg"
        ↓
Forenklet loggskjema
├─ Siste brukte område (default)
├─ Varighet (slider)
└─ Intensitet (3 valg)
        ↓
"Lagre" (1-tap)
        ↓
Bekreftelse (toast)
```

### 5.2 Swipe-navigasjon

```
Dashboard
├─ Swipe venstre → Trening
├─ Swipe høyre → (ingenting / forrige)
└─ Pull-down → Refresh

Spiller-liste (coach)
├─ Swipe høyre → Quick actions
│   ├─ Melding
│   └─ Se profil
└─ Tap → Profil

Treningslogg-liste
├─ Swipe venstre → Slett
└─ Swipe høyre → Rediger
```

---

## 6. Feil og edge cases

### 6.1 Offline-modus

```
Mister nettverksforbindelse
        ↓
App viser offline-indikator
        ↓
Bruker kan fortsatt:
├─ Se cached data
├─ Logge treninger (lokalt)
└─ Navigere i appen
        ↓
Når online igjen:
├─ Synkroniser lokale endringer
├─ Hent oppdateringer
└─ Vis synk-bekreftelse
```

### 6.2 Ugyldig input

```
Bruker skriver inn ugyldig data
        ↓
Umiddelbar validering (inline)
├─ Rød ramme på felt
├─ Feilmelding under felt
└─ Submit-knapp deaktivert
        ↓
Bruker retter feil
        ↓
Validering passerer
└─ Kan submitte
```

### 6.3 Session timeout

```
Token utløper
        ↓
API-kall feiler med 401
        ↓
Forsøk refresh token
        ↓
┌─ Refresh lykkes → Fortsett
└─ Refresh feiler → Vis login
        ↓
Bruker logger inn på nytt
        ↓
Returner til forrige side (hvis mulig)
```

---

## 7. Wireframe-skisser

### 7.1 Player Dashboard (mobil)

```
┌─────────────────────────────┐
│ ≡  IUP            🔔 (3)    │
├─────────────────────────────┤
│                             │
│  God morgen, Ole!           │
│                             │
│  ┌─────────────────────┐    │
│  │ Neste økt           │    │
│  │ 🏌️ Putting drill    │    │
│  │ I dag 14:00         │    │
│  │ [ Start ] [ Endre ] │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ Denne uken          │    │
│  │ ██████████░░ 4/5    │    │
│  │ 6.5t / 8t           │    │
│  └─────────────────────┘    │
│                             │
│  ┌──────┐ ┌──────┐          │
│  │ HCP  │ │ Mål  │          │
│  │ 12.4 │ │ 80%  │          │
│  └──────┘ └──────┘          │
│                             │
│  ┌─────────────────────┐    │
│  │ Siste aktivitet     │    │
│  │ • I går: 2t trening │    │
│  │ • Mandag: Test      │    │
│  └─────────────────────┘    │
│                             │
├─────────────────────────────┤
│  🏠   📊   📈   📅   ⋯     │
└─────────────────────────────┘
```

### 7.2 Coach Spillerliste (mobil)

```
┌─────────────────────────────┐
│ ← Spillere           [ + ] │
├─────────────────────────────┤
│                             │
│  🔍 Søk spillere...         │
│                             │
│  Filter: [Alle ▼] [A-Å ▼]  │
│                             │
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │ 👤 Ole Hansen        │    │
│  │ Kategori B • HCP 12.4│    │
│  │ ✅ Aktiv i dag       │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ 👤 Lisa Andersen     │    │
│  │ Kategori A • HCP 5.2 │    │
│  │ ⚠️ 3 dager siden     │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ 👤 Per Olsen         │    │
│  │ Kategori C • HCP 24  │    │
│  │ 🔴 7 dager siden     │    │
│  └─────────────────────┘    │
│                             │
│  ... (scroll)               │
│                             │
├─────────────────────────────┤
│  🏠   👥   📊   📅   ⋯     │
└─────────────────────────────┘
```

### 7.3 Logg trening (mobil)

```
┌─────────────────────────────┐
│ ← Logg trening       [Lagre]│
├─────────────────────────────┤
│                             │
│  Dato                       │
│  [ 10. januar 2026 ▼ ]      │
│                             │
│  Treningsområde             │
│  [ Velg område ▼ ]          │
│                             │
│  Miljø                      │
│  ○ Inne  ● Ute  ○ Bane     │
│                             │
│  Varighet                   │
│  [ 1 ] t [ 30 ] min         │
│                             │
│  Intensitet                 │
│  ○───●───○───○───○          │
│  Lett      Moderat     Hard │
│                             │
│  Øvelser (valgfritt)        │
│  [ + Legg til øvelse ]      │
│                             │
│  Notater                    │
│  ┌─────────────────────┐    │
│  │                     │    │
│  │                     │    │
│  └─────────────────────┘    │
│                             │
│        [ Lagre trening ]    │
│                             │
└─────────────────────────────┘
```

---

## 8. Tilstands-diagrammer

### 8.1 Bruker-status

```
            ┌──────────────┐
            │   Invitert   │
            └──────┬───────┘
                   │ Registrerer
                   ▼
            ┌──────────────┐
            │  Onboarding  │
            └──────┬───────┘
                   │ Fullfører
                   ▼
            ┌──────────────┐
            │    Aktiv     │◄──────┐
            └──────┬───────┘       │
                   │ Inaktiv 30d   │ Logger inn
                   ▼               │
            ┌──────────────┐       │
            │   Inaktiv    │───────┘
            └──────┬───────┘
                   │ Inaktiv 90d
                   ▼
            ┌──────────────┐
            │   Dormant    │
            └──────────────┘
```

### 8.2 Treningsøkt-status

```
            ┌──────────────┐
            │   Planlagt   │
            └──────┬───────┘
                   │ Starter økt
                   ▼
            ┌──────────────┐
            │    Pågår     │
            └──────┬───────┘
                   │ Fullfører
                   ▼
            ┌──────────────┐
            │   Fullført   │
            └──────┬───────┘
                   │ Coach evaluerer
                   ▼
            ┌──────────────┐
            │   Evaluert   │
            └──────────────┘
```
