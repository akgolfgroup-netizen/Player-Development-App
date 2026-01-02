# Treningsplan System - Utviklingsplan

## Oversikt

Strukturert plan for å utvikle treningsplan-generatoren med **innhold først, teknisk etterpå**.

---

## Fase 1: Definer Krav og Ønsket Output

### 1.1 Forstå Målgruppen
- [ ] Hvem er brukerne? (Spillernivå, alder, mål)
- [ ] Hva er typiske treningsscenarioer?
- [ ] Hvor mange timer/uke er realistisk per kategori?

### 1.2 Definer "God Treningsplan"
- [ ] Hvordan ser en ideell uke ut for kategori B-spiller?
- [ ] Hvordan ser en ideell uke ut for kategori F-spiller?
- [ ] Hva er forskjellen mellom E-periode og T-periode i praksis?
- [ ] Lag 3-5 eksempler på "perfekte" treningsplaner

### 1.3 Valider Domene-inndeling
- [ ] Er TEE/INN50/INN100/INN150/INN200/ARG/PUTT/PHYS riktig inndeling?
- [ ] Mangler noen domener? (Mental? Taktisk? Spill?)
- [ ] Hvordan vektes domenene mot hverandre?

**Leveranse:** Dokument med konkrete eksempler på ønsket output

---

## Fase 2: Valider Periodiseringsmodell

### 2.1 E/G/S/T Periodisering
- [ ] Er 4-periode modellen riktig for golf?
- [ ] Hva er faktisk forskjell mellom periodene?
  - E (Etablering): ?
  - G (Generell): ?
  - S (Spesifikk): ?
  - T (Turnering): ?
- [ ] Hvor lang bør hver periode være?
- [ ] Hvordan skal overganger mellom perioder fungere?

### 2.2 Læringsmodell (L1-L5)
- [ ] Er 5 læringsfaser riktig?
- [ ] Hva karakteriserer hver fase?
- [ ] Hvordan progredierer en spiller gjennom fasene?

### 2.3 Settings (S1-S10)
- [ ] Er 10 settings nødvendig?
- [ ] Hva er hvert setting? (Range, bane, simulator, etc.)
- [ ] Hvordan påvirker setting valg av øvelser?

**Leveranse:** Validert/revidert periodiseringsmodell

---

## Fase 3: Innholdsgjennomgang

### 3.1 Session Templates Audit
- [ ] Gjennomgå alle ~40 templates
- [ ] For hver template:
  - Er navnet beskrivende?
  - Er exerciseSequence realistisk?
  - Er duration fornuftig?
  - Er kategorier/perioder riktig satt?
- [ ] Identifiser manglende templates
- [ ] Identifiser overflødige templates

### 3.2 Exercise Database
- [ ] Gjennomgå øvelsesbiblioteket
- [ ] Er øvelsene koblet til riktige domener?
- [ ] Mangler kritiske øvelser?
- [ ] Er progresjonssteg definert?

### 3.3 Kategori-krav
- [ ] Gjennomgå krav for hver kategori (A-K)
- [ ] Er tersklene realistiske?
- [ ] Hvordan kobles kategori til treningsinnhold?

**Leveranse:** Reviderte templates og øvelser

---

## Fase 4: Algoritme-design

### 4.1 Ukentlig Planlegging
- [ ] Hvordan fordeles timer over uken?
- [ ] Hvilke domener prioriteres når?
- [ ] Hvordan balanseres teknikk vs fysisk vs mental?

### 4.2 Hviledag-logikk
- [ ] Når skal hviledager plasseres?
- [ ] Hva er forskjell på aktiv hvile vs full hvile?
- [ ] Hvordan påvirker intensitet hvilebehovet?

### 4.3 Periodovergang
- [ ] Hvordan trappes intensitet opp/ned?
- [ ] Hvordan endres øvelsesvalg mellom perioder?
- [ ] Finnes det overgangsøkter?

### 4.4 Breaking Point Integration
- [ ] Hvordan skal breaking points påvirke planvalg?
- [ ] Hvor mye vekt skal de ha vs generell plan?

**Leveranse:** Dokumenterte algoritmer (pseudokode/flytskjema)

---

## Fase 5: Teknisk Implementasjon

### 5.1 Schema-endringer
- [ ] Oppdater SessionTemplate med nødvendige felt
- [ ] Oppdater Exercise med domain-kobling
- [ ] Kjør migrasjoner

### 5.2 Algoritme-implementasjon
- [ ] Implementer revidert getDomainForSession()
- [ ] Implementer ny hviledag-logikk
- [ ] Implementer periodovergang-logikk
- [ ] Oppdater timer-allokering

### 5.3 Seed Data
- [ ] Oppdater session templates med nytt innhold
- [ ] Oppdater exercises
- [ ] Oppdater periodization templates

**Leveranse:** Fungerende kode

---

## Fase 6: Testing og Validering

### 6.1 Enhetstester
- [ ] Test getDomainForSession()
- [ ] Test hviledag-logikk
- [ ] Test periodovergang
- [ ] Test ukentlig fordeling

### 6.2 Integrasjonstester
- [ ] Generer plan for kategori B-spiller
- [ ] Generer plan for kategori F-spiller
- [ ] Sammenlign med "ideelle" planer fra Fase 1

### 6.3 Brukervalidering
- [ ] Få feedback fra faktiske trenere/spillere
- [ ] Iterer basert på tilbakemelding

**Leveranse:** Validert system

---

## Arbeidsrekkefølge

```
Fase 1 ──► Fase 2 ──► Fase 3 ──► Fase 4 ──► Fase 5 ──► Fase 6
 │          │          │          │          │          │
 ▼          ▼          ▼          ▼          ▼          ▼
Krav     Modell    Innhold   Algoritme   Kode      Test
```

**Viktig prinsipp:** Ikke hopp til Fase 5 før Fase 1-4 er gjennomarbeidet.

---

## Neste Steg

Start med **Fase 1.2**: Definer hva en "god treningsplan" ser ut som.

Konkret oppgave:
1. Velg en spesifikk spillerprofil (f.eks. kategori C, 8 timer/uke)
2. Skisser manuelt hvordan en ideell 4-ukers plan ser ut
3. Bruk dette som referanse for alt videre arbeid

---

## Notater

_Legg til notater og beslutninger underveis her_

