# Railway Deployment Guide - IUP Golf Academy

**Platform:** Railway.app
**Estimated time:** 1-2 hours
**Difficulty:** Intermediate

Railway er en moderne cloud platform som gjør det enkelt å deploye Docker-baserte applikasjoner med zero-config.

---

## Hvorfor Railway?

- ✅ Zero-config Docker support (bruker våre eksisterende Dockerfiles)
- ✅ Gratis PostgreSQL + Redis inkludert (managed services)
- ✅ Automatisk SSL/HTTPS med custom domains
- ✅ Git-basert deployment (push to deploy)
- ✅ Environment variable management (GUI + CLI)
- ✅ $5 gratis månedlig kredit (Hobby plan)
- ✅ Auto-scaling og health checks

---

## Prerequisites

Før du starter, sørg for at du har:
- [ ] GitHub-konto (repository for IUP_Master_V1)
- [ ] Railway-konto (opprett på railway.app)
- [ ] Railway CLI installert (optional, men anbefalt)

---

## Steg 1: Opprett Railway-konto og prosjekt (10 min)

### 1.1 Opprett konto

1. Gå til [railway.app](https://railway.app)
2. Klikk "Start a New Project"
3. Sign in med GitHub
4. Godkjenn Railway's tilgang til GitHub

### 1.2 Opprett nytt prosjekt

1. Klikk "+ New Project" i Railway dashboard
2. Velg "Deploy from GitHub repo"
3. Velg repositoryet: `IUP_Master_V1`
4. Velg branch: `main` (eller `master`)
5. Gi prosjektet navn: "IUP Golf Academy Demo"

**Railway vil nå:**
- Automatisk detektere Dockerfiles
- Sette opp build pipeline
- Men vi trenger å konfigurere services manuelt

---

## Steg 2: Opprett Database Services (15 min)

Railway bruker "services" - hver service er en isolert container/database.

### 2.1 Legg til PostgreSQL

1. I Railway prosjekt dashboard, klikk "+ New Service"
2. Velg "Database" → "PostgreSQL"
3. Railway provisjonerer automatisk en PostgreSQL instance
4. **Hent connection string:**
   - Klikk på PostgreSQL service
   - Gå til "Connect" tab
   - Kopier `DATABASE_URL` (format: `postgresql://user:pass@host:port/db`)

**Eksempel DATABASE_URL:**
```
postgresql://postgres:mypassword@containers-us-west-123.railway.app:5432/railway
```

### 2.2 Legg til Redis (Optional, men anbefalt)

1. Klikk "+ New Service" igjen
2. Velg "Database" → "Redis"
3. Railway provisjonerer Redis instance
4. **Hent connection string:**
   - Klikk på Redis service
   - Gå til "Connect" tab
   - Kopier `REDIS_URL` (format: `redis://default:pass@host:port`)

**Eksempel REDIS_URL:**
```
redis://default:mypassword@containers-us-west-456.railway.app:6379
```

---

## Steg 3: Deploy API Service (20 min)

### 3.1 Opprett API service

1. Klikk "+ New Service"
2. Velg "GitHub Repo" → Velg `IUP_Master_V1`
3. Railway detekterer `apps/api/Dockerfile`

### 3.2 Konfigurer build settings

1. Klikk på den nye API servicen
2. Gå til "Settings" tab
3. Under "Build & Deploy":
   - **Root Directory:** `apps/api`
   - **Dockerfile Path:** `apps/api/Dockerfile`
   - **Build Command:** (la stå tom, Dockerfile håndterer dette)
   - **Start Command:** (la stå tom, bruker CMD fra Dockerfile)

### 3.3 Sett environment variables

1. Gå til "Variables" tab i API servicen
2. Klikk "+ New Variable"
3. Legg til følgende variabler:

**Required:**
```bash
DATABASE_URL=<hent fra PostgreSQL service>
NODE_ENV=production
PORT=3000
```

**JWT Secrets (generer nye!):**
```bash
# Generer secrets med: openssl rand -hex 32
JWT_SECRET=<generer 64-character random string>
JWT_REFRESH_SECRET=<generer 64-character random string>
```

**CORS (viktig!):**
```bash
ALLOWED_ORIGINS=https://iupgolf-demo.up.railway.app,https://iupgolf-demo-web.up.railway.app
```

**Optional (kan legges til senere):**
```bash
REDIS_URL=<hent fra Redis service hvis du opprettet den>

# Email (kan disable for demo)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<SendGrid API key>

# AWS S3 (kan disable for demo)
AWS_S3_BUCKET=iup-golf-demo-videos
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=<AWS key>
AWS_SECRET_ACCESS_KEY=<AWS secret>
```

### 3.4 Deploy API

1. Railway starter automatisk deployment når du lagrer environment variables
2. Følg med på "Deployments" tab for status
3. Første deploy tar 5-10 minutter (bygger Docker image)

**Verifiser deployment:**
- Åpne API URL (finn under "Settings" → "Domains")
- Gå til `/health` endpoint
- Du skal se: `{"status":"ok","timestamp":"..."}`

---

## Steg 4: Run Database Migrations (10 min)

Vi må kjøre Prisma migrations for å sette opp database schema.

### 4.1 Installer Railway CLI (hvis ikke allerede gjort)

```bash
# macOS
brew install railway

# Windows/Linux
npm install -g @railway/cli

# Verifiser install
railway --version
```

### 4.2 Link til prosjekt

```bash
# Login til Railway
railway login

# Link til ditt prosjekt
railway link
# Velg "IUP Golf Academy Demo" fra listen
```

### 4.3 Kjør migrations

```bash
# SSH inn i API container
railway run bash

# Inne i container:
npx prisma migrate deploy

# Output skal vise:
# ✔ Applied 0 migrations (skipped if already applied)
# ✔ Database schema in sync
```

### 4.4 Seed demo data

```bash
# Fortsatt inne i Railway container
npm run seed:demo

# Output skal vise:
# 🌟 Seeding Premium Demo Player (Andreas Holm)...
# ✅ Updated player: Andreas Holm (16 år, Mørj Golfklubb)
# ✅ Created annual training plan
# ✅ Created 120 training sessions (6 months, avg 5/week)
# ✅ Created 18 test results with progression
# ✅ Assigned 24 badges to Magnus
# ✅ Created 8 player goals (2 completed, 6 in progress)
```

### 4.5 Verifiser database

```bash
# Inne i Railway container
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
# Skal returnere: 3 (admin, coach, player)

psql $DATABASE_URL -c "SELECT COUNT(*) FROM training_sessions WHERE player_id = (SELECT id FROM players WHERE email = 'player@demo.com');"
# Skal returnere: ~120

# Exit container
exit
```

---

## Steg 5: Deploy Web Service (20 min)

### 5.1 Opprett Web service

1. Klikk "+ New Service"
2. Velg "GitHub Repo" → Velg `IUP_Master_V1`
3. Railway detekterer `apps/web/Dockerfile`

### 5.2 Konfigurer build settings

1. Klikk på den nye Web servicen
2. Gå til "Settings" tab
3. Under "Build & Deploy":
   - **Root Directory:** `apps/web`
   - **Dockerfile Path:** `apps/web/Dockerfile`
   - **Build Command:** (la stå tom)
   - **Start Command:** (la stå tom)

### 5.3 Sett environment variables

1. Gå til "Variables" tab
2. Legg til:

```bash
REACT_APP_API_URL=<din API URL>
# Eksempel: https://iupgolf-demo-api.up.railway.app

NODE_ENV=production
```

### 5.4 Deploy Web

1. Railway starter deployment automatisk
2. Første deploy tar 10-15 minutter (bygger React app)
3. **Viktig:** React build kan feile hvis det er type errors - fiks disse først!

**Verifiser deployment:**
- Åpne Web URL (finn under "Settings" → "Domains")
- Du skal se login-siden
- Test login: `player@demo.com` / `player123`

---

## Steg 6: Configure Custom Domain (Optional, 30 min)

Railway gir deg gratis domener:
- API: `iupgolf-demo-api.up.railway.app`
- Web: `iupgolf-demo-web.up.railway.app`

Men for demo, ser det mer profesjonelt ut med custom domain.

### 6.1 Kjøp domene

Kjøp domene hos:
- **Namecheap:** ~100 kr/år
- **Google Domains:** ~150 kr/år
- **GoDaddy:** ~120 kr/år

**Forslag:**
- `iupgolf.no` (hvis tilgjengelig)
- `iupgolf-demo.no`
- `iupgolfacademy.no`

### 6.2 Konfigurer DNS

1. I Railway Web service, gå til "Settings" → "Domains"
2. Klikk "+ Custom Domain"
3. Skriv inn ditt domene: `iupgolf.no`
4. Railway vil gi deg en CNAME record:

```
CNAME: iupgolf.no → railway-proxy.railway.app
```

5. Gå til din domain provider (Namecheap/GoDaddy)
6. Legg til CNAME record i DNS settings:
   - **Type:** CNAME
   - **Host:** @ (eller blank for root domain)
   - **Value:** `railway-proxy.railway.app`
   - **TTL:** 300 (5 min)

### 6.3 SSL Certificate

Railway provisjonerer automatisk SSL via Let's Encrypt.
- Venter på DNS propagation (5-30 min)
- Når DNS er oppdatert, får du automatisk HTTPS

**Verifiser:**
- Gå til `https://iupgolf.no`
- Du skal se låseikon i browser (SSL aktivert)

### 6.4 Oppdater CORS

Husk å oppdatere `ALLOWED_ORIGINS` i API service:
```bash
ALLOWED_ORIGINS=https://iupgolf.no,https://iupgolf-demo.up.railway.app
```

---

## Steg 7: Testing & Validation (20 min)

### 7.1 Smoke test checklist

Gå gjennom følgende:

**Frontend:**
- [ ] `https://iupgolf.no` eller `https://iupgolf-demo-web.up.railway.app` laster
- [ ] Login med `player@demo.com` / `player123` funker
- [ ] Dashboard viser Andreas Holm (ikke "Ole Hansen")
- [ ] Stats viser korrekte tall (120 økter, 3.9 handicap)
- [ ] Badges viser 24 earned badges
- [ ] Tester viser graf med progressjon
- [ ] Ingen console errors (åpne DevTools → Console)

**API:**
- [ ] `https://iupgolf-demo-api.up.railway.app/health` returnerer `{"status":"ok"}`
- [ ] `/api/auth/login` endpoint funker (test med Postman/Insomnia)
- [ ] Database connection er stable (ingen timeouts)

**Coach perspective:**
- [ ] Login med `coach@demo.com` / `coach123`
- [ ] Vis spilleroversikt (15+ spillere)
- [ ] Klikk på Andreas Holm - vis detaljer
- [ ] Send melding funker (hvis implementert)

**Responsiveness:**
- [ ] Mobil view ser bra ut (test med Chrome DevTools → Device toolbar)
- [ ] Tablet view ser bra ut (iPad)
- [ ] Desktop ser bra ut (1920x1080)

### 7.2 Performance testing

Test load times:
```bash
# Lighthouse audit
npm install -g lighthouse

lighthouse https://iupgolf.no --view
# Target score: > 90 for Performance
```

**Forventet:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Largest Contentful Paint: < 2.5s

### 7.3 Error monitoring (Optional)

Sett opp Sentry for error tracking:
1. Opprett gratis Sentry-konto på sentry.io
2. Opprett nytt prosjekt "IUP Golf Academy"
3. Legg til DSN i environment variables:
   ```bash
   SENTRY_DSN=https://abc123@o123.ingest.sentry.io/456
   ```

---

## Steg 8: Continuous Deployment (5 min)

Railway deployer automatisk ved git push!

### Auto-deploy setup

1. Gå til API service → Settings → "Deployments"
2. Under "Automatic Deployments", sjekk at det står:
   - ✅ **Enabled**
   - **Branch:** `main`
   - **Auto Deploy:** ON

3. Gjør det samme for Web service

**Nå kan du:**
```bash
git add .
git commit -m "Fix bug"
git push origin main

# Railway deployer automatisk innen 2-5 minutter
```

---

## Troubleshooting

### Problem: API deployment feiler

**Løsning:**
1. Sjekk "Deployments" tab for build logs
2. Vanlige årsaker:
   - `npm install` feiler → Sjekk package.json dependencies
   - TypeScript errors → Kjør `npm run type-check` lokalt
   - Missing environment variables → Double-check Variables tab

### Problem: Database connection timeout

**Løsning:**
1. Verifiser `DATABASE_URL` er korrekt
2. Sjekk at PostgreSQL service er running (grønn status)
3. Test connection fra Railway CLI:
   ```bash
   railway run bash
   psql $DATABASE_URL -c "SELECT 1;"
   ```

### Problem: CORS errors i browser console

**Løsning:**
1. Sjekk at `ALLOWED_ORIGINS` inkluderer Web URL
2. Format: `https://domain.com` (ingen trailing slash!)
3. Restart API service etter endring

### Problem: Prisma migrations feiler

**Løsning:**
1. Sjekk om migrations allerede er kjørt:
   ```bash
   railway run bash
   npx prisma migrate status
   ```
2. Hvis "Migration history not found", kjør:
   ```bash
   npx prisma migrate deploy --skip-seed
   ```

### Problem: React build feiler med "out of memory"

**Løsning:**
Railway har memory limits på Hobby plan (512MB). Hvis React build feiler:
1. Upgrade til Pro plan ($20/mnd)
2. Eller: Build lokalt og deploy pre-built:
   ```bash
   cd apps/web
   npm run build
   # Commit dist/ folder (normalt ikke anbefalt, men fungerer)
   ```

---

## Cost Estimering

**Railway Hobby Plan (Gratis):**
- $5 gratis kreditt per måned
- Nok for: < 50 brukere, lav trafikk
- Estimated monthly cost: 0 kr

**Railway Pro Plan ($20/mnd = ~240 kr/mnd):**
- Unlimited kreditt
- Better performance (512MB → 8GB RAM)
- Priority support
- Estimated for 100-500 brukere: 500-1000 kr/mnd

**Breakdown:**
- PostgreSQL: ~200 kr/mnd
- Redis: ~100 kr/mnd
- API container: ~300 kr/mnd
- Web container: ~200 kr/mnd
- **Total:** ~800 kr/mnd (Pro plan)

---

## Next Steps etter Deployment

1. **Test grundig** - Gjennomgå alle features
2. **Inviter beta-testere** - 5-10 spillere + 2 trenere
3. **Samle feedback** - Hva funker? Hva feiler?
4. **Iterér** - Fix bugs, legg til features
5. **Skalér** - Når klar, gå fra Hobby → Pro plan

---

**Gratulerer! 🎉** IUP Golf Academy er nå live på `https://iupgolf.no` (eller din Railway URL).

**Login og test:**
- Spiller: `player@demo.com` / `player123`
- Trener: `coach@demo.com` / `coach123`
- Admin: `admin@demo.com` / `admin123`

---

_For support eller spørsmål, kontakt: [din e-post]_
