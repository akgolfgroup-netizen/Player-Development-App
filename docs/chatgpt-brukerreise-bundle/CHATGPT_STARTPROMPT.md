# ChatGPT Startprompt: Brukerreise og Navigasjon

Kopier prompten under og lim inn i ChatGPT. Last deretter opp filene i anbefalt rekkefølge.

---

## Prompt

```
Du er en UX-arkitekt som skal hjelpe meg strukturere navigasjonen i en golf-treningsapp (IUP Golf).

## Om appen

IUP Golf er en treningsapp for golfspillere som:
- Har to hovedmoduler: SPILLER og COACH
- Bruker et kategori-system (A-K) for å måle spillernivå
- Genererer personlige treningsplaner basert på 20 standardiserte tester
- Tracker fremgang via "breaking points" og badges
- Støtter både individuell trening og coach-veiledet utvikling

## Mitt problem

Spillere sliter med å finne funksjoner i appen. Navigasjonen har vokst organisk og mangler konsistent struktur. Jeg trenger hjelp til å:

1. **Kategorisere alle funksjoner** logisk slik at brukeren intuitivt vet hvor ting er
2. **Definere klare ansvarsområder** for hver skjerm/seksjon
3. **Sikre konsistens** mellom spiller- og coach-visningen
4. **Redusere kognitiv belastning** - maksimalt 5-7 toppnivå-menypunkter

## Hva jeg gir deg

Jeg vil laste opp dokumentasjon i denne rekkefølgen:

**Første batch (start her):**
- PLAYER_MODULE_FUNCTIONS.md - Alle funksjoner i spiller-modulen
- COACH_MODULE_FUNCTIONS.md - Alle funksjoner i coach-modulen
- SCREEN_RESPONSIBILITIES.md - Hva hver skjerm er ansvarlig for
- PLAYER_NAVIGATION_OVERVIEW.md - Nåværende navigasjonsstruktur

**Andre batch (treningssystemet):**
- KATEGORI_SYSTEM_KOMPLETT.md - Hvordan spillere progredierer A→K
- TESTER_FULL_OVERSIKT.md - De 20 testene som måler fremgang
- TRENINGSPLAN_ALGORITMER.md - Hvordan planer genereres

**Tredje batch (hvis behov):**
- FUNCTIONAL_USER_JOURNEY_MAP.md - Brukerreisekart med 16 identifiserte gaps
- 02_BRUKERREISER.md - Detaljerte brukerreiser

## Hva jeg forventer fra deg

Etter å ha lest dokumentasjonen, gi meg:

1. **Foreslått navigasjonsstruktur** med maks 5-7 toppnivå-kategorier
2. **Mapping av funksjoner** til hver kategori
3. **Begrunnelse** for hvorfor denne strukturen gir mening for brukeren
4. **Konsistenssjekk** - er samme type funksjon plassert likt i spiller og coach?
5. **Potensielle problemer** du ser med forslaget

## Viktige prinsipper

- Spilleren skal alltid vite hvor funksjoner er
- Navigasjonen skal reflektere brukerens mentale modell, ikke systemets tekniske struktur
- Hyppig brukte funksjoner skal være lett tilgjengelige
- Relaterte funksjoner skal grupperes sammen

---

Bekreft at du forstår oppgaven, så laster jeg opp første batch med dokumenter.
```

---

## Etter første respons fra ChatGPT

Last opp disse filene:
1. `PLAYER_MODULE_FUNCTIONS.md`
2. `COACH_MODULE_FUNCTIONS.md`
3. `SCREEN_RESPONSIBILITIES.md`
4. `PLAYER_NAVIGATION_OVERVIEW.md`

---

## Oppfølgingsprompts

### Etter første analyse:
```
Basert på funksjonene du har sett, foreslå en navigasjonsstruktur med 5-7 toppnivå-kategorier. For hver kategori, list hvilke funksjoner som hører hjemme der og hvorfor.
```

### For å validere mot treningssystemet:
```
Her er dokumentasjon om treningssystemet (kategori-progresjon, tester, plan-generering). Sjekk om navigasjonsforslaget ditt støtter disse prosessene godt.
```

### For å identifisere gaps:
```
Her er brukerreisekartet med 16 identifiserte gaps. Hvilke av disse løses av navigasjonsforslaget ditt, og hvilke krever andre tiltak?
```

### For å få konkret output:
```
Lag en tabell som viser:
| Toppnivå | Undernivå | Funksjoner | Spiller | Coach |
Med X for hvem som har tilgang til hva.
```

---

## Tips

- Start med første batch, få et forslag, deretter valider med treningssystem-dokumentene
- Be om begrunnelse for kontroversielle valg
- Spør "Hva er ulempen med denne strukturen?" for å få balansert perspektiv
