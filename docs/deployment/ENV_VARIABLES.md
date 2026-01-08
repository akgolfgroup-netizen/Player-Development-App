# Environment Variables - IUP Golf

Komplett oversikt over alle environment variables som kreves for deployment.

---

## Required Variables (Må settes)

Disse variablene er **obligatoriske** for at applikasjonen skal fungere:

### Database

```bash
DATABASE_URL=postgresql://user:password@host:port/database
```
- **Beskrivelse:** PostgreSQL connection string
- **Format:** `postgresql://[user]:[password]@[host]:[port]/[database]`
- **Eksempel:** `postgresql://postgres:mypassword@localhost:5432/iup_golf`
- **Railway:** Auto-generert når du oppretter PostgreSQL service
- **Lokal dev:** `postgresql://iup_golf:dev_password@localhost:5432/iup_golf`

### Application

```bash
NODE_ENV=production
```
- **Beskrivelse:** Node.js environment
- **Gyldige verdier:** `development`, `production`, `test`
- **Default:** `development`
- **Når sette til `production`:** Alltid i Railway/cloud deployment

```bash
PORT=3000
```
- **Beskrivelse:** Port for API server
- **Default:** 3000
- **Railway:** Kan være 3000 eller auto-assigned (Railway setter $PORT)
- **Lokal dev:** 3000

### JWT Authentication

```bash
JWT_SECRET=<64-character random string>
JWT_REFRESH_SECRET=<64-character random string>
```
- **Beskrivelse:** Secrets for signing JWT access and refresh tokens
- **Generering:** `openssl rand -hex 32` (generer 2 ganger for 2 forskjellige secrets)
- **Eksempel:**
  ```
  JWT_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
  JWT_REFRESH_SECRET=9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef
  ```
- **⚠️ VIKTIG:** Aldri commit til git! Bruk forskjellige secrets i dev vs production!

### CORS

```bash
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```
- **Beskrivelse:** Comma-separated list of allowed origins for CORS
- **Format:** `https://domain1.com,https://domain2.com`
- **Eksempel (Railway):**
  ```
  ALLOWED_ORIGINS=https://iupgolf.no,https://iupgolf-demo.up.railway.app,http://localhost:3001
  ```
- **Lokal dev:** `http://localhost:3001,http://localhost:3000`
- **⚠️ Viktig:** Ingen trailing slash! `https://domain.com` ikke `https://domain.com/`

---

## Optional Variables (Kan settes)

Disse variablene er **valgfrie** - applikasjonen fungerer uten dem, men med begrenset funksjonalitet.

### Redis (Caching & Sessions)

```bash
REDIS_URL=redis://default:password@host:port
```
- **Beskrivelse:** Redis connection string for caching og session management
- **Format:** `redis://[user]:[password]@[host]:[port]`
- **Eksempel:** `redis://default:mypassword@localhost:6379`
- **Railway:** Auto-generert når du oppretter Redis service
- **Hvis ikke satt:** Fallback til in-memory cache (ikke anbefalt for production)

### Email (SMTP)

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<SendGrid API key>
SMTP_FROM=noreply@iupgolf.no
```
- **Beskrivelse:** SMTP settings for sending emails (password reset, notifications)
- **Provider alternativer:**
  - **SendGrid** (anbefalt): smtp.sendgrid.net, port 587
  - **Mailgun**: smtp.mailgun.org, port 587
  - **Gmail** (ikke anbefalt for production): smtp.gmail.com, port 587
- **Gratis tier:**
  - SendGrid: 100 emails/dag gratis
  - Mailgun: 300 emails/dag gratis (3 måneder)
- **Hvis ikke satt:** Email-features deaktivert (password reset vil ikke fungere)

### AWS S3 (Video Storage)

```bash
AWS_S3_BUCKET=iup-golf-videos
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=<AWS access key>
AWS_SECRET_ACCESS_KEY=<AWS secret key>
```
- **Beskrivelse:** AWS S3 for video storage and retrieval
- **Region:** `eu-north-1` (Stockholm) anbefales for norske brukere
- **Alternative:**
  - `eu-west-1` (Ireland)
  - `us-east-1` (Virginia - billigere, men høyere latency)
- **Cost estimate:**
  - 100GB storage: ~30 kr/mnd
  - 1000 video uploads/mnd: ~5 kr
- **Hvis ikke satt:** Video upload deaktivert

### DataGolf API (Optional)

```bash
DATAGOLF_API_KEY=<din DataGolf API key>
```
- **Beskrivelse:** API key for DataGolf integration (pro golf data)
- **Brukes til:** Import av turnerings-data, WAGR rankings
- **Kost:** $50/mnd (ikke nødvendig for MVP)
- **Hvis ikke satt:** DataGolf features deaktivert

---

## Frontend Environment Variables (React)

Disse settes i Web service (apps/web):

```bash
REACT_APP_API_URL=https://iupgolf-demo-api.up.railway.app
```
- **Beskrivelse:** Backend API base URL
- **Format:** `https://[api-domain]` (ingen trailing slash!)
- **Lokal dev:** `http://localhost:3000`
- **Railway:** Din API service URL (finn i "Settings" → "Domains")

```bash
NODE_ENV=production
```
- **Beskrivelse:** React environment (påvirker build optimization)
- **Gyldige verdier:** `development`, `production`

```bash
REACT_APP_SENTRY_DSN=<Sentry DSN> # Optional
```
- **Beskrivelse:** Sentry error tracking for frontend
- **Hvis ikke satt:** Error tracking deaktivert

---

## Development vs Production

### Lokal Development (.env)

```bash
# Database
DATABASE_URL=postgresql://iup_golf:dev_password@localhost:5432/iup_golf

# App
NODE_ENV=development
PORT=3000

# JWT (kan være hardcoded for dev)
JWT_SECRET=dev-secret-key-not-for-production-use-only
JWT_REFRESH_SECRET=dev-refresh-secret-key-not-for-production

# CORS (tillat localhost)
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000

# Optional - Redis
REDIS_URL=redis://localhost:6379

# Optional - Email (kan disable for dev)
# SMTP_HOST=
# SMTP_PORT=
# SMTP_USER=
# SMTP_PASS=

# Optional - AWS (kan disable for dev)
# AWS_S3_BUCKET=
# AWS_REGION=
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
```

### Production (Railway)

```bash
# Database (auto-generated by Railway PostgreSQL service)
DATABASE_URL=postgresql://postgres:abc123@containers-us-west-456.railway.app:5432/railway

# App
NODE_ENV=production
PORT=3000

# JWT (MUST BE UNIQUE - generer nye!)
JWT_SECRET=<generer med: openssl rand -hex 32>
JWT_REFRESH_SECRET=<generer med: openssl rand -hex 32>

# CORS (kun production domains!)
ALLOWED_ORIGINS=https://iupgolf.no,https://iupgolf-demo.up.railway.app

# Redis (auto-generated by Railway Redis service)
REDIS_URL=redis://default:xyz789@containers-us-west-789.railway.app:6379

# Email (anbefalt å sette for production)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<SendGrid API key>
SMTP_FROM=noreply@iupgolf.no

# AWS S3 (anbefalt for production hvis video brukes)
AWS_S3_BUCKET=iup-golf-production-videos
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=<AWS key>
AWS_SECRET_ACCESS_KEY=<AWS secret>
```

### Test Environment (.env.test)

```bash
# Test database (separate from dev!)
DATABASE_URL=postgresql://iup_golf:dev_password@localhost:5432/iup_golf_test

# App
NODE_ENV=test
PORT=3001

# JWT (kan være hardcoded for test)
JWT_SECRET=test-secret-key
JWT_REFRESH_SECRET=test-refresh-secret-key

# CORS
ALLOWED_ORIGINS=http://localhost:3001

# No Redis, SMTP, AWS for tests (mock these)
```

---

## Security Best Practices

### ✅ DO:

- Generate nye, sterke secrets for production (min 32 characters)
- Bruk forskjellige secrets for development vs production
- Lagre production secrets i Railway (ikke i .env filer)
- Bruk environment-specific configs (`.env.development`, `.env.production`)
- Rotate JWT secrets regelmessig (quarterly)

### ❌ DON'T:

- Commit `.env` files til git (legg til `.gitignore`)
- Bruk samme secrets i dev og production
- Hardcode secrets i kode
- Share production DATABASE_URL med development team
- Bruke svake/forutsigbare secrets (e.g., "secret123")

---

## Verifying Environment Variables

### Railway

1. Gå til service i Railway dashboard
2. Klikk "Variables" tab
3. Verifiser at alle required variables er satt
4. Klikk "Restart" hvis du endret noe

### Lokalt

```bash
# Sjekk at .env filen er lastet
cd apps/api
cat .env

# Test at variables er tilgjengelig
node -e "console.log(process.env.DATABASE_URL)"
# Skal printe connection string (ikke "undefined")

# Eller kjør app og sjekk logs
npm run dev
# Hvis DATABASE_URL mangler, vil du se error:
# "Error: DATABASE_URL is not defined"
```

---

## Troubleshooting

### Problem: "DATABASE_URL is not defined"

**Løsning:**
1. Verifiser at `.env` fil eksisterer i `apps/api/`
2. Sjekk at `dotenv` er konfigurert i `src/server.ts`:
   ```typescript
   import * as dotenv from 'dotenv';
   dotenv.config();
   ```
3. Restart dev server

### Problem: CORS error i browser console

**Løsning:**
1. Sjekk at `ALLOWED_ORIGINS` inkluderer frontend URL
2. Format må være `https://domain.com` (ingen trailing slash!)
3. Restart API service etter endring

### Problem: JWT token validation feiler

**Løsning:**
1. Verifiser at `JWT_SECRET` er samme i alle API instances (hvis du har flere)
2. Sjekk at secret ikke har whitespace eller newlines
3. Generer ny secret med: `openssl rand -hex 32`

### Problem: Email sending feiler

**Løsning:**
1. Verifiser SMTP credentials med:
   ```bash
   npm install -g nodemailer
   node -e "const nodemailer = require('nodemailer'); const transporter = nodemailer.createTransport({host: process.env.SMTP_HOST, port: process.env.SMTP_PORT, auth: {user: process.env.SMTP_USER, pass: process.env.SMTP_PASS}}); transporter.verify((err, success) => {console.log(err || 'SMTP OK')});"
   ```
2. Sjekk SendGrid dashboard for blocked emails
3. Verifiser `SMTP_FROM` er et verifisert domene i SendGrid

---

## Environment Variable Checklist

### Pre-Deployment Checklist

- [ ] `DATABASE_URL` er satt (Railway eller AWS RDS)
- [ ] `JWT_SECRET` og `JWT_REFRESH_SECRET` er sterke, unike secrets
- [ ] `ALLOWED_ORIGINS` inkluderer production domain(s)
- [ ] `NODE_ENV=production` (ikke `development`!)
- [ ] `REDIS_URL` er satt (hvis Redis brukes)
- [ ] `SMTP_*` variables er satt (hvis email trengs)
- [ ] `AWS_*` variables er satt (hvis video upload trengs)
- [ ] Ingen secrets er committed til git (sjekk `.gitignore`)

### Post-Deployment Verification

- [ ] API starter uten errors (`railway logs` eller Railway dashboard)
- [ ] `/health` endpoint returnerer `{"status":"ok"}`
- [ ] Database connection er stable (ingen timeouts)
- [ ] Frontend kan koble til API (ingen CORS errors)
- [ ] Email sending funker (test password reset)
- [ ] Video upload funker (hvis AWS konfigurert)

---

_Sist oppdatert: 25. desember 2025_
