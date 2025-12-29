# CLAUDE PROJECT - OPPDATERINGS-GUIDE
**Enkelt system for å holde dokumenter synkronisert**

---

## 🎯 PROBLEM

Claude Projects synkroniserer **IKKE** automatisk med lokale filer.

```
Du oppdaterer lokal fil → Claude Project ser IKKE endringen
                       → Du må manuelt laste opp på nytt
```

---

## ✅ LØSNING: ENKEL RUTINE

### Velg én av disse strategiene:

---

## STRATEGI 1: "VED HVER STOR ENDRING" (Anbefalt for deg)

### Når skal du oppdatere?

Oppdater Claude Project når du har gjort **betydelige endringer**:

✅ **Oppdater når**:
- Du har oppdatert MASTER_PROSJEKTDOKUMENT.md (f.eks. ny versjon v2.0 → v2.1)
- Du har lagt til nye skjermer i APP_STATUS.md
- Du har opprettet nye Excel-filer med data
- Du har gjort audit eller analyse som er viktig

❌ **Ikke oppdater når**:
- Små typos eller formateringsfeil
- Kommentarer eller notater til deg selv
- Midlertidige testfiler

### Steg-for-steg (5 minutter)

```
1. Åpne Claude Project i nettleser
   → https://claude.ai/projects

2. Velg "App-Digital IUP"

3. Klikk Settings (tannhjul-ikon) → Knowledge

4. For hver oppdatert fil:
   a) Finn filen i listen (f.eks. MASTER_PROSJEKTDOKUMENT.md)
   b) Klikk "Remove" eller slett-ikonet
   c) Klikk "Add files" → Upload
   d) Velg oppdatert fil fra:
      /Users/anderskristiansen/Library/Mobile Documents/
      com~apple~CloudDocs/00. Inbox/IUP_Master_Folder/

5. Verifiser:
   → Gå til Chat
   → Skriv: "Les MASTER_PROSJEKTDOKUMENT.md og fortell meg versjonsnummer"
   → Skal svare: "v2.0" (eller nyeste versjon)
```

---

## STRATEGI 2: "UKENTLIG RUTINE" (For proaktive)

### Hver fredag kl 16:00 (5 minutter)

```
□ 1. Åpne terminal i IUP_Master_Folder
□ 2. Kjør: git status
     → Se hvilke filer som er endret denne uken
□ 3. Hvis endringer: Åpne Claude Project
□ 4. Oppdater endrede filer (slett + last opp)
□ 5. Test: "Les [filnavn] og oppsummer siste endringer"
□ 6. Ferdig!
```

**Fordel**: Du vet alltid at Claude Project er oppdatert.

---

## STRATEGI 3: "VERSJONSSTYRT" (For strukturerte)

### Bruk versjonsnummer i MASTER

```markdown
# MASTER_PROSJEKTDOKUMENT.md
**Versjon**: 2.0
**Sist oppdatert**: 14. desember 2025
```

### Rutine:

```
1. Når du oppdaterer MASTER lokalt:
   → Øk versjonsnummer (2.0 → 2.1)
   → Oppdater dato

2. Hver gang versjonsnummer endres:
   → Last opp til Claude Project

3. Verifiser:
   → Spør Claude: "Hvilken versjon av MASTER har du?"
   → Skal matche din lokale versjon
```

---

## 📋 SJEKKLISTE: HVILKE FILER SKAL OPPDATERES?

### Alltid oppdater disse (KRITISKE):

| Fil | Hvor ofte | Hvorfor |
|-----|-----------|---------|
| **MASTER_PROSJEKTDOKUMENT.md** | Ved hver versjon (v2.0, v2.1, etc.) | Alt metodikk og system |
| **APP_STATUS.md** | Når skjermer ferdigstilles | Rask status-oversikt |

### Vurder å oppdatere (NYTTIGE):

| Fil | Hvor ofte | Hvorfor |
|-----|-----------|---------|
| **ARBEIDSFLYT_GUIDE.md** | Sjelden (ved nye beste-praksis) | Token-optimalisering |
| **KATEGORI_SYSTEM_AUDIT.md** | Ved nye auditer | Kvalitetssikring |
| **KATEGORI_SYSTEM_KOMPARATIV_AUDIT.md** | Ved nye versjoner | Før/etter analyse |

### Ikke oppdater (UNØDVENDIG):

| Type | Hvorfor |
|------|---------|
| Screens/*.jsx | Claude trenger ikke JSX-kode i Knowledge |
| Design/*.html | Design-assets ikke nødvendig |
| Data/*.xlsx | Claude kan ikke lese Excel (kun referanse) |
| Pdf/*.pdf | For store, token-ineffektivt |

---

## ⚡ RASK OPPDATERING (30 sekunder)

### Hvis du kun har oppdatert MASTER:

```
1. Claude Project → Settings → Knowledge
2. Søk etter "MASTER"
3. Klikk slett-ikon ved MASTER_PROSJEKTDOKUMENT.md
4. Dra-og-slipp ny MASTER_PROSJEKTDOKUMENT.md
5. Ferdig!
```

---

## 🧪 VERIFISERING (sjekk at oppdatering fungerte)

### Test 1: Versjonsnummer
```
Prompt: "Les MASTER_PROSJEKTDOKUMENT.md og fortell meg versjonsnummer"
Forventet: "v2.0" (eller nyeste)
```

### Test 2: Spesifikk endring
```
Prompt: "Hva er kravene for kategori F i MASTER?"
Forventet (v2.0): "SG Total: -6.5, Driver CS: 82-88 mph (M) / 70-75 mph (K)"
Forventet (gammel): "Snittscore 78-80" (kun dette = IKKE oppdatert!)
```

### Test 3: Dato-sjekk
```
Prompt: "Når ble MASTER sist oppdatert?"
Forventet: "14. desember 2025" (eller nyere)
```

---

## 🔄 AUTOMATISERING (Avansert - valgfritt)

### Alternativ: Bruk Git + Script

```bash
#!/bin/bash
# sync_to_claude.sh

# 1. Sjekk om filer er endret
if git diff --quiet MASTER_PROSJEKTDOKUMENT.md APP_STATUS.md; then
  echo "Ingen endringer - ingen oppdatering nødvendig"
  exit 0
fi

# 2. Vis hvilke filer som er endret
echo "🔄 Følgende filer er endret:"
git diff --name-only MASTER_PROSJEKTDOKUMENT.md APP_STATUS.md

# 3. Påminnelse
echo ""
echo "📤 Husk å oppdatere Claude Project:"
echo "1. Åpne https://claude.ai/projects"
echo "2. Gå til 'App-Digital IUP' → Settings → Knowledge"
echo "3. Slett og last opp endrede filer"
```

**Bruk**:
```bash
# Hver fredag:
cd /Users/anderskristiansen/Library/Mobile\ Documents/com\~apple\~CloudDocs/00.\ Inbox/IUP_Master_Folder/
./sync_to_claude.sh
```

---

## 📊 SAMMENLIGNING: HVILKEN STRATEGI?

| Strategi | Innsats | Synk-frekvens | Anbefalt for |
|----------|---------|---------------|--------------|
| **Ved stor endring** | Lav (5 min) | Når nødvendig | ✅ Deg (best match!) |
| **Ukentlig rutine** | Middels (5 min/uke) | Alltid oppdatert | Proaktive |
| **Versjonsstyrt** | Lav (kun ved versjon) | Ved milestones | Strukturerte |

---

## 🎯 MIN ANBEFALING FOR DEG

Basert på arbeidsflyten din:

### Bruk: "VED HVER STOR ENDRING" + Git-påminnelse

```bash
# Legg til i .bashrc eller .zshrc:
alias claude-sync="echo '📤 Husk: Oppdater Claude Project med nye filer!'"

# Etter hver stor endring:
git add MASTER_PROSJEKTDOKUMENT.md
git commit -m "Oppdater kategori-system til v2.1"
claude-sync  # Påminnelse!
```

**Fordeler**:
- ✅ Minimal innsats
- ✅ Oppdaterer kun når viktig
- ✅ Git-påminnelse så du ikke glemmer
- ✅ Ingen unødvendige oppdateringer

---

## 📝 QUICK REFERENCE (Skriv ut dette!)

### Når skal jeg oppdatere Claude Project?

```
✅ JA - Oppdater når:
□ MASTER versjonsnummer endres (v2.0 → v2.1)
□ APP_STATUS får nye ferdige skjermer
□ Ny audit eller analyse er ferdig
□ Viktige forbedringer i metodikk

❌ NEI - Ikke oppdater når:
□ Små typos eller formatering
□ Kommentarer til deg selv
□ Midlertidige testfiler
□ JSX/design-filer (ikke nødvendig i Knowledge)
```

### Hvordan oppdatere (30 sekunder):

```
1. https://claude.ai/projects → App-Digital IUP
2. Settings → Knowledge
3. Slett gammel fil → Last opp ny
4. Test: "Les [fil] og fortell versjon"
```

---

## ✅ NESTE GANG DU OPPDATERER

**Sist oppdatert lokal MASTER**: v2.0 (14. des 2025)
**Sist oppdatert Claude Project**: [Fyll inn etter oppdatering]

**Husk å oppdatere denne linjen hver gang!** 👆

---

**Lykke til med synkroniseringen! 🚀**

*Guide opprettet: 14. desember 2025*
