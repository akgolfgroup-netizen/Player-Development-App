# ARBEIDSFLYT-GUIDE
**Unngå duplikater & Minimer token-bruk**

---

## 1. FILORGANISERING (Unngå duplikater)

### ✅ GJØR DETTE

#### A. Én fil, én sannhet
```
❌ IKKE:
Data/Team_Norway_IUP_2026.xlsx
Data/Team_Norway_IUP_2026_backup.xlsx
Data/Team_Norway_IUP_2026_old.xlsx
Data/Team_Norway_IUP_2026_v2.xlsx

✅ GJØR:
Data/Team_Norway_IUP_2026.xlsx  (kun én fil)
```

**Regel**: Aldri lag kopier i samme mappe. Bruk Git for versjonshistorikk.

#### B. Konsekvent navngivning
```
✅ Bruk alltid samme format:
- Store forbokstaver: Data/, Screens/, Pdf/
- Underscore for mellomrom: Team_Norway_IUP_2026.xlsx
- Ingen versjonsnummer i filnavn: IUP_v2.xlsx ❌
- Beskrivende navn: Team_Norway_Training_Protocols.xlsx ✅
```

#### C. Organisering etter type, ikke innhold
```
✅ RIKTIG struktur:
Data/           ← Alle Excel-filer
Pdf/            ← Alle PDF-filer
Screens/        ← Alle JSX-komponenter
Design/         ← Alle design-assets

❌ UNNGÅ:
Team_Norway/
  ├── excel/
  ├── pdf/
  └── docs/
IUP_System/
  ├── data.xlsx
  └── data.pdf
```

### ❌ UNNGÅ DETTE

1. **Ikke lag "_backup", "_old", "_v2" filer**
   - Bruk Git for versjonshistorikk
   - Bruk iCloud versjonskontroll (høyreklikk → "Browse All Versions")

2. **Ikke dupliser innhold mellom formater**
   ```
   ❌ IKKE ha samme info i:
   - Data/Training_Plan.xlsx
   - Pdf/Training_Plan.pdf
   - MASTER_PROSJEKTDOKUMENT.md

   ✅ GJØR:
   - Data/Training_Plan.xlsx (kildefil)
   - MASTER_PROSJEKTDOKUMENT.md (kun referanse til Excel-fil)
   ```

3. **Ikke spre dokumentasjon**
   ```
   ❌ IKKE:
   - README.md
   - DOCUMENTATION.md
   - QUICK_START.md
   - GUIDE.md

   ✅ GJØR:
   - MASTER_PROSJEKTDOKUMENT.md (ALT i én fil)
   - APP_STATUS.md (kun rask status)
   ```

---

## 2. CLAUDE CODE ARBEIDSFLYT (Minimer tokens)

### A. Start alltid med MASTER_PROSJEKTDOKUMENT.md

```
🎯 EFFEKTIV SESSION-START:

1. Åpne Claude Code i IUP_Master_Folder
2. Si: "Les MASTER_PROSJEKTDOKUMENT.md og APP_STATUS.md"
3. Start arbeidet

💰 Token-kostnad: ~2,000 tokens (i stedet for 20,000+)
```

**Hvorfor?**
- MASTER inneholder ALL metodikk, systemer, planer
- APP_STATUS gir rask oversikt over hva som er ferdig
- Unngår å lese 20+ separate filer

### B. Spesifikke forespørsler

```
❌ IKKE SI:
"Les alle filer og forklar systemet"
→ 50,000+ tokens

✅ SI:
"Søk i MASTER_PROSJEKTDOKUMENT.md etter kategori D periodisering"
→ 1,000 tokens
```

**Eksempler:**

```
✅ "Jeg trenger å bygge Database 1 (SPILLERE).
    Se MASTER_PROSJEKTDOKUMENT.md seksjon 8"

✅ "Hva er kravene for kategori D?
    Søk i MASTER etter kategori-system"

✅ "Lag 10 teknikk-øvelser for L2-fase.
    Bruk treningsnivå-systemet fra MASTER seksjon 6"
```

### C. Modulær utvikling

```
🎯 BYGG I SMÅ STEG:

ØKT 1 (45 min):
- "Bygg Database 1: SPILLERE"
- Test med 1 eksempelspiller
- STOPP → Valider

ØKT 2 (45 min):
- "Bygg Database 2: PERIODISERING"
- Koble til Database 1
- STOPP → Valider

❌ IKKE: "Bygg alle 11 databaser nå"
→ 56,700 tokens, kaotisk, umulig å debugge
```

### D. Bruk Project Knowledge smartere

**I Claude Projects:**

```
✅ OPPRETT PROJECT MED:
1. MASTER_PROSJEKTDOKUMENT.md (custom instructions)
2. Data/ Excel-filer (kun de du trenger)
3. IKKE hele mappen!

💡 TIP: Lag egne prosjekter per fase:
- "IUP - Database Fase 1"
- "IUP - Øvelsesbank Fase 2"
- "IUP - App Development"
```

**Søkestrategi:**

```
✅ SPESIFIKKE SØK:
"kategori D grunnperiode"
"test protokoll PEI"
"L-fase beskrivelser"

❌ BREDE SØK:
"vis meg alt om systemet"
"forklar hele IUP-modellen"
```

---

## 3. TOKEN-BESPARENDE TEKNIKKER

### A. Template-basert generering

```
✅ I stedet for å generere 52 unike ukeplaner:

1. Lag 1 template for kategori D, Grunnperiode
2. Lag 1 template for kategori D, Spesialiseringsperiode
3. Bruk templates + juster kun turneringsuker

💰 Sparer: 80% tokens
```

### B. Inkrementell bygging

```
✅ SMART TILNÆRMING:

Fase 1: Bygg 20 treningsøkter
→ Test med 1 spiller
→ Valider at det fungerer

Fase 2: Bygg 130 økter til
→ Bruk samme struktur som Fase 1
→ Kun variér innhold

💰 Hver fase: 4,000 tokens
❌ Alt på én gang: 12,000 tokens + feil
```

### C. Gjenbruk outputs

```
✅ ETTER Økt 1 (Spillere-database):

1. Lagre Claude's output i Notion
2. Bruk den som template for neste spiller
3. Ingen ny generering nødvendig

💰 Sparer: 2,000 tokens per spiller
```

---

## 4. VERSJONSKONROLL MED GIT

### Sett opp Git (engangsoppsett)

```bash
# I IUP_Master_Folder:
git init
git add .
git commit -m "Initial: Ren struktur uten duplikater"

# Lag .gitignore
echo ".DS_Store" > .gitignore
echo "Reference_Materials/" >> .gitignore
git add .gitignore
git commit -m "Add gitignore"
```

### Daglig arbeidsflyt

```bash
# FØR du starter arbeid:
git status
git add .
git commit -m "Status før arbeidsøkt: [beskrivelse]"

# ETTER hver milepæl:
git add Screens/NewComponent.jsx
git commit -m "Legg til Dashboard-komponent for kategori-oversikt"

# Hvis noe går galt:
git log                    # Se historikk
git checkout [commit-id]   # Gå tilbake
```

**Fordeler:**
- ✅ Ingen behov for "_backup" filer
- ✅ Full historikk
- ✅ Kan alltid gå tilbake
- ✅ Se hva som endret seg når

---

## 5. DOKUMENTASJONSSTRUKTUR

### Oppdater kun 2 filer

```
📄 MASTER_PROSJEKTDOKUMENT.md
→ Oppdater når metodikk/system endres
→ Sjelden (kanskje 1 gang/måned)

📄 APP_STATUS.md
→ Oppdater når skjermer ferdigstilles
→ Oftere (hver uke)

❌ IKKE lag nye dokumenter for hver endring!
```

### Eksempel på riktig oppdatering

```markdown
# APP_STATUS.md

## Ferdige skjermer
| Skjerm | Fil | Status | Dato |
|--------|-----|--------|------|
| Dashboard | Screens/Dashboard.jsx | ✅ | 13.12.25 |
| Årsplan | Screens/Aarsplan.jsx | ✅ | 15.12.25 | ← NY

## Ikke startet
~~Årsplan~~ | P1 |  ← FJERNET
```

---

## 6. CLAUDE CODE KOMMANDOER (Eksempler)

### Effektive kommandoer

```
✅ SESSION START:
"Les MASTER_PROSJEKTDOKUMENT.md seksjon 8 om Notion-databaser"

✅ SPESIFIKK OPPGAVE:
"Bygg Database 1 (SPILLERE) basert på MASTER seksjon 8.
Bruk 11 felt som spesifisert.
Gi meg Notion properties i JSON-format."

✅ TESTING:
"Legg til 1 test-spiller i Screens/Dashboard.jsx:
Navn: Test Spiller, Kategori: D, Alder: 16, Snittscore: 78"

✅ DEBUGGING:
"Sjekk Screens/Dashboard.jsx linje 45-60.
Fiks feil med kategori-visning."

✅ ITERATIV BYGGING:
"Bygg 5 teknikk-øvelser for L2-fase (Fundamentals).
Bruk treningsnivå-system fra MASTER seksjon 6."
→ Valider → "Bygg 5 til med samme struktur"
```

### Ineffektive kommandoer (UNNGÅ)

```
❌ "Les alle filer og bygg hele systemet"
❌ "Generer komplett IUP for kategori A-K"
❌ "Lag alle 300 øvelser nå"
❌ "Vis meg alt du vet om dette prosjektet"
```

---

## 7. MAPPEVEDLIKEHOLD (Ukentlig rutine)

### Hver fredag (5 minutter):

```bash
# 1. Sjekk for duplikater
find . -name "*_backup*" -o -name "*_old*" -o -name "*_v2*"
# → Slett hvis funnet

# 2. Sjekk for filer utenfor mapper
ls -la | grep "^-" | grep -v ".md" | grep -v ".toml"
# → Flytt til riktig mappe

# 3. Git commit
git add .
git commit -m "Ukentlig opprydding - uke [nummer]"

# 4. Tell filer
echo "Data: $(ls Data | wc -l)"
echo "Pdf: $(ls Pdf | wc -l)"
echo "Screens: $(ls Screens | wc -l)"
# → Sammenlign med forrige uke
```

---

## 8. NOTION-WORKFLOW (Token-besparende)

### Når du bygger databaser

```
✅ SMART TILNÆRMING:

ØKT 1: Få Claude til å generere Notion properties (JSON)
→ 1,000 tokens
→ Kopier JSON

ØKT 2: Bygg database manuelt i Notion
→ Lim inn properties
→ INGEN tokens brukt!

ØKT 3: Få Claude til å generere 1 eksempelrad
→ 500 tokens
→ Bruk som template

ØKT 4+: Dupliser eksempelrad og endre manuelt
→ INGEN tokens brukt!

💰 Total: 1,500 tokens
❌ La Claude generere alle rader: 10,000+ tokens
```

---

## 9. QUICK REFERENCE (Print dette ut!)

### GYLDEN REGEL #1: Én fil, én sannhet
→ Aldri lag kopier. Bruk Git for historikk.

### GYLDEN REGEL #2: Les MASTER først
→ Start hver session med å lese MASTER_PROSJEKTDOKUMENT.md

### GYLDEN REGEL #3: Små steg
→ Bygg inkrementelt. Test ofte. Valider før du fortsetter.

### GYLDEN REGEL #4: Spesifikke spørsmål
→ "Søk i MASTER etter X" i stedet for "Forklar alt"

### GYLDEN REGEL #5: Ukentlig opprydding
→ Hver fredag: Sjekk duplikater, commit til Git

---

## 10. TROUBLESHOOTING

### Problem: Tokens går tomme midt i arbeid
**Løsning**: Del oppgaven i mindre deler
```
I stedet for: "Bygg 50 øvelser"
Gjør: "Bygg 10 øvelser" × 5 økter
```

### Problem: Finner ikke riktig info i MASTER
**Løsning**: Bruk søk i filen
```
CMD+F i VS Code
Søk etter nøkkelord: "kategori", "periodisering", "L-fase"
```

### Problem: Usikker på om fil er duplikat
**Løsning**: Sjekk filstørrelse og dato
```bash
ls -lh Data/ | grep "Team_Norway"
# Samme størrelse + navn = duplikat
```

### Problem: For mange filer i Screens/
**Løsning**: Lag undermapper
```
Screens/
├── Dashboard/
├── Testing/
└── Training/
```

---

## 11. EKSEMPEL-SESSION (Perfekt workflow)

```
🎯 MÅL: Bygge Årsplan-skjerm

ØKT 1 (10 min):
Anders: "Les MASTER_PROSJEKTDOKUMENT.md seksjon 5 (Periodisering)"
Claude: [Leser og oppsummerer]
Anders: "Lag en JSX-komponent Aarsplan.jsx basert på dette"
Claude: [Genererer komponent]
→ 2,000 tokens brukt

ØKT 2 (15 min):
Anders: "Test Aarsplan.jsx med 1 eksempelspiller fra Data/"
Claude: [Implementerer test-data]
→ 1,000 tokens brukt

ØKT 3 (10 min):
Anders: "Oppdater APP_STATUS.md: Legg til Årsplan som ferdig"
Claude: [Oppdaterer fil]
→ 300 tokens brukt

Git commit:
git add Screens/Aarsplan.jsx APP_STATUS.md
git commit -m "Legg til Årsplan-skjerm med periodisering"

💰 TOTAL: 3,300 tokens
✅ RESULTAT: Ferdig skjerm, testet, dokumentert, versjonert
```

---

## OPPSUMMERING

### Token-besparelse (vs. kaotisk tilnærming)

| Oppgave | Kaotisk | Smart | Besparelse |
|---------|---------|-------|------------|
| Start session | 20,000 | 2,000 | 90% |
| Bygg database | 12,000 | 3,000 | 75% |
| Lag øvelser | 25,000 | 5,000 | 80% |
| Debug feil | 5,000 | 1,000 | 80% |
| **TOTAL** | **62,000** | **11,000** | **82%** |

### Duplikat-unngåelse

✅ **FØLG DISSE 5 REGLENE:**
1. Aldri lag filer med "_backup", "_old", "_v2"
2. Bruk Git for versjonshistorikk
3. Én fil per type data (ikke duplikér mellom formater)
4. Konsekvent navngivning (Store forbokstaver, underscore)
5. Ukentlig opprydding (fredag 5 min)

---

**Lykke til med utviklingen! 🚀**

*Lagret: 13. desember 2025*
