# Repository Organization Plan

**Mål:** Profesjonell mappestruktur som imponerer senior utviklere fra Google, Apple, etc.

**Prinsipp:** Ingen endringer som påvirker hvordan nettsiden ser ut eller fungerer.

---

## Nåværende Problemer

### 1. Root-nivå Kaos
- Sensitive filer synlige (`.env.production`, `.env.staging`)
- Mangler standard open-source filer (LICENSE, SECURITY.md, CODE_OF_CONDUCT)
- Mangler GitHub community standards

### 2. Docs Folder (405+ filer)
- 30+ filer på rot-nivå uten kategorisering
- Blanding av norsk/engelsk
- Presentasjoner og mockups blandet med teknisk docs
- Duplikater og utdaterte filer

### 3. Manglende GitHub Features
- Ingen issue templates
- Ingen CODEOWNERS
- Ingen security policy
- Ingen discussion templates

---

## Fase 1: GitHub Community Standards

### 1.1 Legg til LICENSE
```
MIT License - Standard for open-source prosjekter
```

### 1.2 Lag SECURITY.md
```markdown
# Security Policy

## Reporting a Vulnerability
Email: security@akgolf.no
```

### 1.3 Lag CODE_OF_CONDUCT.md
```markdown
# Code of Conduct
Contributor Covenant v2.1
```

### 1.4 Lag CODEOWNERS
```
# .github/CODEOWNERS
* @anderskristiansen

# Backend
/apps/api/ @anderskristiansen

# Frontend
/apps/web/ @anderskristiansen
```

### 1.5 Issue Templates
```
.github/
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   ├── feature_request.md
│   └── config.yml
└── FUNDING.yml (optional)
```

---

## Fase 2: Dokumentasjon Reorganisering

### Ny Docs Struktur:
```
docs/
├── README.md                    # Docs index/navigation
│
├── getting-started/             # Onboarding
│   ├── README.md
│   ├── prerequisites.md
│   ├── installation.md
│   └── quick-start.md
│
├── architecture/                # Eksisterende, behold
│   └── (existing files)
│
├── api/                         # Eksisterende, behold
│   └── (existing files)
│
├── guides/                      # Eksisterende, behold
│   └── (existing files)
│
├── features/                    # Eksisterende, behold
│   └── (existing files)
│
├── deployment/                  # Eksisterende, behold
│   └── (existing files)
│
├── partner/                     # NY: Partnermateriale
│   ├── README.md
│   ├── presentasjon.md
│   ├── presentasjon-styled.html
│   ├── mockups-v2.html
│   └── feature-overview.md
│
├── player-docs/                 # NY: Norsk spillerdokumentasjon
│   ├── README.md
│   ├── brukerreiser.md
│   ├── feature-oversikt.md
│   └── hvordan-bruke.md
│
├── technical/                   # NY: Teknisk dokumentasjon
│   ├── README.md
│   ├── backend-architecture.md
│   ├── database-schema.md
│   ├── authentication.md
│   └── api-patterns.md
│
├── adr/                         # NY: Architecture Decision Records
│   ├── README.md
│   ├── 001-template.md
│   ├── 002-fastify-over-express.md
│   ├── 003-prisma-orm.md
│   └── 004-multi-tenancy.md
│
├── runbooks/                    # NY: Operations runbooks
│   ├── README.md
│   ├── deployment.md
│   ├── database-migrations.md
│   └── incident-response.md
│
└── archive/                     # Eksisterende, flytt utdaterte filer hit
    └── (deprecated docs)
```

### Filer som flyttes til `archive/`:
- Alle `*_PLAN.md` filer som er fullført
- `NATTARBEID_*.md`
- `NATT_SPRINT_*.md`
- Duplikater av eksisterende docs

### Filer som flyttes til `partner/`:
- `PRESENTASJON_PARTNERE.md`
- `PRESENTASJON_PARTNERE.html`
- `PRESENTASJON_PARTNERE_STYLED.html`
- `MOCKUPS_*.html`

### Filer som flyttes til `player-docs/`:
- `01_FEATURE_OVERSIKT.md`
- `02_BRUKERREISER.md`
- Andre norske brukerdokumenter

### Filer som flyttes til `technical/`:
- `03_TEKNISK_DOKUMENTASJON.md`
- Tekniske specs fra root

---

## Fase 3: Root Cleanup

### Fjern fra Git (men behold lokalt):
```bash
# Legg til i .gitignore:
.env.production
.env.staging
tsconfig.tsbuildinfo
.DS_Store
```

### Reorganiser Root:
```
IUP_Master_V1/
├── .github/                     # GitHub config
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   ├── CODEOWNERS
│   ├── FUNDING.yml
│   └── pull_request_template.md
│
├── apps/                        # Applikasjoner (uendret)
│   ├── api/
│   ├── web/
│   └── golfer/
│
├── packages/                    # Shared packages (uendret)
│   ├── database/
│   └── design-system/
│
├── config/                      # Konfigurasjon
│   ├── docker/                  # Flytt docker-compose hit
│   │   ├── docker-compose.yml
│   │   └── docker-compose.override.yml
│   ├── infrastructure/
│   └── .env.example
│
├── scripts/                     # Scripts (uendret)
│
├── data/                        # Data (uendret)
│
├── docs/                        # Reorganisert dokumentasjon
│
├── .husky/                      # Git hooks
│
├── LICENSE                      # NY
├── SECURITY.md                  # NY
├── CODE_OF_CONDUCT.md           # NY
├── README.md                    # Eksisterende
├── CONTRIBUTING.md              # Eksisterende
├── CHANGELOG.md                 # Eksisterende
├── Makefile                     # Eksisterende
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json
├── vitest.config.ts
├── .eslintrc.json
├── .prettierrc
└── .gitignore
```

---

## Fase 4: GitHub Repository Settings

### 4.1 Branch Protection (GitHub UI)
- Require PR reviews for `main`
- Require status checks to pass
- Require conversation resolution

### 4.2 Repository Topics
```
golf, coaching, typescript, react, fastify, prisma,
postgresql, redis, monorepo, pnpm, turbo
```

### 4.3 Repository Description
```
Enterprise golf coaching platform with Individual Development Plans (IUP),
gamification, and advanced analytics. Built with TypeScript, React, and Fastify.
```

### 4.4 Social Preview Image
Lag en profesjonell banner for repository preview.

---

## Fase 5: README Enhancement

### Ny README Struktur:
```markdown
# TIER Golf - IUP Platform

[Badges: Build, Coverage, License, Version]

> Enterprise-grade golf coaching platform

## Quick Links
- [Documentation](./docs)
- [API Reference](./docs/api)
- [Contributing](./CONTRIBUTING.md)
- [Security](./SECURITY.md)

## Features
[Feature list with icons]

## Tech Stack
[Tech badges grid]

## Quick Start
[3-step getting started]

## Architecture
[High-level architecture diagram]

## Project Structure
[Clean tree view]

## Documentation
[Links to key docs]

## Contributing
[Link to CONTRIBUTING.md]

## License
MIT

## Acknowledgments
[Credits]
```

---

## Implementeringsplan

### Steg 1: Forberedelse (5 min)
```bash
# Oppdater .gitignore først
echo ".env.production" >> .gitignore
echo ".env.staging" >> .gitignore
echo "tsconfig.tsbuildinfo" >> .gitignore
echo "*.DS_Store" >> .gitignore

# Fjern fra Git (men behold lokalt)
git rm --cached .env.production .env.staging tsconfig.tsbuildinfo
git rm --cached -r "**/.DS_Store"
```

### Steg 2: Lag nye filer (10 min)
```bash
# GitHub community files
touch LICENSE
touch SECURITY.md
touch CODE_OF_CONDUCT.md
touch .github/CODEOWNERS
mkdir -p .github/ISSUE_TEMPLATE
```

### Steg 3: Reorganiser docs (15 min)
```bash
# Lag nye mapper
mkdir -p docs/getting-started
mkdir -p docs/partner
mkdir -p docs/player-docs
mkdir -p docs/technical
mkdir -p docs/adr
mkdir -p docs/runbooks

# Flytt filer (eksempler)
mv docs/PRESENTASJON_* docs/partner/
mv docs/MOCKUPS_* docs/partner/
mv docs/01_FEATURE_OVERSIKT.md docs/player-docs/feature-oversikt.md
mv docs/02_BRUKERREISER.md docs/player-docs/brukerreiser.md
mv docs/03_TEKNISK_DOKUMENTASJON.md docs/technical/
```

### Steg 4: Reorganiser config (5 min)
```bash
mkdir -p config/docker
mv docker-compose.yml config/docker/
mv docker-compose.override.yml config/docker/
```

### Steg 5: Oppdater README (10 min)
```bash
# Oppdater README.md med ny struktur
```

### Steg 6: Commit og Push (2 min)
```bash
git add -A
git commit -m "chore: reorganize repository structure

- Add LICENSE, SECURITY.md, CODE_OF_CONDUCT.md
- Add GitHub issue templates and CODEOWNERS
- Reorganize docs into logical categories
- Move docker files to config/docker/
- Update .gitignore for sensitive files
- Clean up root directory

🤖 Generated with Claude Code"

git push origin main
```

---

## Forventet Resultat

### Før:
```
❌ 30+ filer i docs/ rot
❌ .env.production synlig i Git
❌ Ingen LICENSE
❌ Ingen issue templates
❌ Ingen CODEOWNERS
❌ Kaotisk root
```

### Etter:
```
✅ Organisert docs/ med klare kategorier
✅ Sensitive filer fjernet fra Git
✅ MIT License
✅ Professional issue templates
✅ CODEOWNERS for code reviews
✅ Ren root med kun essensielle filer
✅ GitHub community standards 100%
```

---

## Risiko-vurdering

| Endring | Risiko | Mitigering |
|---------|--------|------------|
| Flytte docker-compose | Lav | Oppdater README med ny path |
| Flytte docs | Ingen | Ingen kode avhenger av docs path |
| .gitignore endringer | Ingen | Filer beholdes lokalt |
| Nye community files | Ingen | Additive endringer |

**Konklusjon:** Ingen av disse endringene påvirker hvordan nettsiden ser ut eller fungerer. Alt er mappestruktur og GitHub metadata.

---

## Tidslinje

| Fase | Tid | Beskrivelse |
|------|-----|-------------|
| 1 | 10 min | GitHub community files |
| 2 | 20 min | Docs reorganisering |
| 3 | 10 min | Root cleanup |
| 4 | 5 min | GitHub settings (manuelt i UI) |
| 5 | 15 min | README enhancement |
| **Total** | **60 min** | Full reorganisering |
