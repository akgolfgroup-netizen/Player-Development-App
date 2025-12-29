# AUTOMATISERING AV DOKUMENTASJON
> **Opprettet:** 15. desember 2025
> **Formål:** Guide for automatisk oppdatering og vedlikehold av dokumentasjon

---

## 🎯 OVERSIKT

Dette prosjektet har nå **3 automatiseringslag**:

1. **Opprydding** → `cleanup-docs.sh` - Rydder og organiserer dokumenter
2. **Status-oppdatering** → `update-status.js` - Oppdaterer progresjon automatisk
3. **Git hooks** → Kjører automatisk ved commit (valgfritt)

---

## 📝 SCRIPT 1: DOKUMENTASJONS-OPPRYDDING

### Formål
Rydder opp i dokumentasjonsstrukturen, arkiverer gamle filer, og gir nummererte navn til primære dokumenter.

### Bruk

```bash
# Kjør fra prosjektets root
bash scripts/cleanup-docs.sh
```

### Hva gjør scriptet?

1. **Lager backup** av all dokumentasjon
2. **Arkiverer** historiske filer (BUILD_COMPLETE.md, etc.)
3. **Nummererer** primære dokumenter (00-05)
4. **Organiserer** reference/-mapper (api/, design/, kategori/)
5. **Verifiserer** at alt er på plass

### Resultat

```
Før:
📁 39 filer spredt over 4 mapper

Etter:
📁 Docs/
  ├── 00_MASTER_PROSJEKTDOKUMENT.md      # Master-referanse
  ├── 01_STATUS_DASHBOARD.md              # Live status
  ├── 02_UTVIKLINGSPLAN_KOMPLETT.md       # Detaljert plan
  ├── 03_HVA_SKAL_JEG_GJORE_NA.md        # Daglig action
  ├── 04_ARCHITECTURE.md                  # Teknisk arkitektur
  ├── 05_DESIGN_SYSTEM_SETUP.md           # Design system
  │
  ├── reference/
  │   ├── api/
  │   ├── design/
  │   ├── kategori/
  │   └── notion_original/
  │
  └── archive/
      └── 2025-12-14/                     # Historiske filer
```

### Sikkerhet
- ✅ Lager **automatisk backup** før endringer
- ✅ Arkiverer fremfor å slette
- ✅ Stopper ved feil (`set -e`)

---

## 🔄 SCRIPT 2: STATUS-OPPDATERING

### Formål
Skanner kodebasen og oppdaterer status-dokumenter automatisk basert på fremgang.

### Bruk

```bash
# Kjør manuelt
node scripts/update-status.js

# Eller via npm
npm run update-status
```

### Hva gjør scriptet?

1. **Skanner** backend og frontend for TODO/DONE
2. **Teller** filer, linjer kode, og funksjoner
3. **Beregner** progresjon per område
4. **Oppdaterer** 3 dokumenter:
   - `01_STATUS_DASHBOARD.md`
   - `02_UTVIKLINGSPLAN_KOMPLETT.md`
   - `00_MASTER_PROSJEKTDOKUMENT.md` (timestamp)

### Output

```
🚀 Starter status-oppdatering...

✅ STATUS_DASHBOARD.md oppdatert
✅ UTVIKLINGSPLAN_KOMPLETT.md oppdatert

✅ Status-dokumenter oppdatert!
📊 Total progresjon: 55%
```

### Når kjøre?

**Manuelt:**
- Etter hver fullført oppgave
- Ved slutten av dagen
- Før commit av kode

**Automatisk (se under):**
- Ved hver git commit
- Via GitHub Actions

---

## 🪝 SCRIPT 3: GIT HOOKS (Valgfritt)

### Formål
Kjører `update-status.js` automatisk hver gang du committer kode.

### Oppsett

#### Metode 1: Manuell hook

```bash
# Lag post-commit hook
cat > .git/hooks/post-commit << 'EOF'
#!/bin/bash
echo "Oppdaterer status-dokumenter..."
node scripts/update-status.js

# Legg til oppdaterte dokumenter i commit
git add Docs/01_STATUS_DASHBOARD.md
git add Docs/02_UTVIKLINGSPLAN_KOMPLETT.md
git add Docs/00_MASTER_PROSJEKTDOKUMENT.md

# Amend commit med oppdaterte docs (hvis endringer)
if ! git diff --cached --quiet; then
  git commit --amend --no-edit --no-verify
fi
EOF

# Gjør kjørbar
chmod +x .git/hooks/post-commit
```

#### Metode 2: Husky (anbefalt for team)

```bash
# Installer Husky
npm install --save-dev husky
npx husky install

# Legg til post-commit hook
npx husky add .git/hooks/post-commit "node scripts/update-status.js"
```

### Deaktivere hook

```bash
# Midlertidig (én commit)
git commit --no-verify -m "message"

# Permanent
rm .git/hooks/post-commit
```

---

## 🤖 GITHUB ACTIONS (Valgfritt)

### Formål
Kjører status-oppdatering automatisk på GitHub ved push til main.

### Oppsett

Lag fil: `.github/workflows/update-status.yml`

```yaml
name: Update Status Documents

on:
  push:
    branches: [ main ]
    paths:
      - 'backend/**'
      - 'frontend/**'
      - 'database/**'

jobs:
  update-status:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run status update
        run: node scripts/update-status.js

      - name: Commit updated docs
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add Docs/01_STATUS_DASHBOARD.md
          git add Docs/02_UTVIKLINGSPLAN_KOMPLETT.md
          git add Docs/00_MASTER_PROSJEKTDOKUMENT.md
          git diff --quiet && git diff --staged --quiet || \
            git commit -m "docs: auto-update status [skip ci]"

      - name: Push changes
        uses: ad-m/github-push-action@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          branch: main
```

**Note:** `[skip ci]` forhindrer evig loop av commits.

---

## 📅 VEDLIKEHOLDSRUTINER

### Daglig (Automatisk)
```bash
# Commit kode → git hook kjører automatisk
git add .
git commit -m "feat: ny funksjon"
# → update-status.js kjører automatisk
```

### Ukentlig (Manuelt)
```bash
# Gjennomgå og oppdater neste ukes plan
open Docs/03_HVA_SKAL_JEG_GJORE_NA.md
# Oppdater "NESTE UKE"-seksjonen
```

### Månedlig (Manuelt)
```bash
# Gjennomgå arkiv
ls -lh Docs/archive/

# Fjern unødvendige backups (> 3 måneder gamle)
find Docs/archive/ -type d -mtime +90 -exec rm -rf {} \;

# Oppdater master-dokumentet
open Docs/00_MASTER_PROSJEKTDOKUMENT.md
```

---

## 🔧 FEILSØKING

### Problem: cleanup-docs.sh feiler

**Løsning 1:** Sjekk at du er i riktig directory
```bash
pwd
# Skal vise: .../IUP_Master_V1
```

**Løsning 2:** Sjekk filrettigheter
```bash
ls -l scripts/cleanup-docs.sh
# Skal vise: -rwxr-xr-x

# Hvis ikke kjørbar:
chmod +x scripts/cleanup-docs.sh
```

**Løsning 3:** Gjenopprett fra backup
```bash
# Finn nyeste backup
ls -lt Docs/archive/backup-*

# Gjenopprett
cp -r Docs/archive/backup-YYYYMMDD-HHMMSS/* Docs/
```

---

### Problem: update-status.js feiler

**Løsning 1:** Installer avhengigheter
```bash
npm install
```

**Løsning 2:** Sjekk Node-versjon
```bash
node --version
# Skal være >= 18.0.0
```

**Løsning 3:** Kjør med debug
```bash
node --trace-warnings scripts/update-status.js
```

---

### Problem: Git hook kjører ikke

**Løsning 1:** Sjekk at hook eksisterer
```bash
ls -la .git/hooks/post-commit
```

**Løsning 2:** Sjekk rettigheter
```bash
chmod +x .git/hooks/post-commit
```

**Løsning 3:** Test hook manuelt
```bash
.git/hooks/post-commit
```

---

## ✅ SJEKKLISTE - OPPSETT

### Første gang (engangsoppsett)

- [ ] Kjør `bash scripts/cleanup-docs.sh`
- [ ] Verifiser at struktur er korrekt
- [ ] Test `node scripts/update-status.js`
- [ ] (Valgfritt) Sett opp git hook
- [ ] (Valgfritt) Sett opp GitHub Actions
- [ ] Commit endringene

### Daglig bruk

- [ ] Jobb med kode
- [ ] Commit endringer
- [ ] Status oppdateres automatisk (hvis hook aktivert)
- [ ] Alternativt: Kjør `node scripts/update-status.js` manuelt

### Ukentlig

- [ ] Oppdater `03_HVA_SKAL_JEG_GJORE_NA.md`
- [ ] Gjennomgå `01_STATUS_DASHBOARD.md`
- [ ] Sjekk milepæler i `02_UTVIKLINGSPLAN_KOMPLETT.md`

---

## 📊 FORDELER MED AUTOMATISERING

### Før automatisering:
```
❌ Manuell oppdatering av status
❌ Dokumenter blir utdaterte
❌ Vanskelig å holde oversikt
❌ Tar 30+ min per oppdatering
```

### Etter automatisering:
```
✅ Status oppdateres automatisk
✅ Alltid oppdaterte dokumenter
✅ Lett å se progresjon
✅ Tar 0 min per oppdatering
```

---

## 🚀 NESTE STEG

1. **Kjør opprydding**
   ```bash
   bash scripts/cleanup-docs.sh
   ```

2. **Test status-oppdatering**
   ```bash
   node scripts/update-status.js
   ```

3. **Commit endringene**
   ```bash
   git add .
   git commit -m "docs: automatisert dokumentasjon"
   ```

4. **Aktiver git hook** (valgfritt)
   ```bash
   # Se "SCRIPT 3: GIT HOOKS" over
   ```

5. **Start arbeid!**
   - Følg `03_HVA_SKAL_JEG_GJORE_NA.md`
   - Status oppdateres automatisk 🎉

---

**Automatisering = Mer tid til koding, mindre tid til dokumentasjon!** 🚀
