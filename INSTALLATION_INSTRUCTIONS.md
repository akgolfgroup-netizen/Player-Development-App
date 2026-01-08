# Installation Instructions - OAuth & Stripe

Dette dokumentet inneholder instruksjoner for å installere dependencies og sette opp OAuth og Stripe.

## 📦 1. Installer Dependencies

### Backend (OAuth + Stripe)
```bash
cd apps/api
npm install googleapis stripe
npm install --save-dev @types/stripe
```

### Frontend (OAuth + Stripe)
```bash
cd apps/web
npm install @react-oauth/google react-apple-signin-auth
npm install @stripe/react-stripe-js @stripe/stripe-js
```

---

## 🔑 2. Setup Google OAuth

### Steg 1: Google Cloud Console
1. Gå til https://console.cloud.google.com/
2. Opprett nytt prosjekt: **"TIER Golf Production"**
3. Aktiver **Google+ API**
4. Gå til **APIs & Services → Credentials**
5. Opprett **OAuth 2.0 Client ID**:
   - Type: **Web application**
   - Name: "TIER Golf Web App"
   - Authorized JavaScript origins:
     ```
     http://localhost:3001
     http://localhost:3000
     https://tier-golf.no
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/v1/auth/google/callback
     https://api.tier-golf.no/api/v1/auth/google/callback
     ```
6. Kopier **Client ID** og **Client Secret**

### Steg 2: Oppdater Environment Variables

**Backend** (`apps/api/.env`):
```bash
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123...
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/google/callback
```

**Frontend** (`apps/web/.env`):
```bash
REACT_APP_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
REACT_APP_API_URL=http://localhost:3000/api/v1
REACT_APP_ENABLE_OAUTH=true
```

---

## 🍎 3. Setup Apple Sign-In

### Steg 1: Apple Developer Account
- **Krav**: Apple Developer Program ($99/år)
- Gå til https://developer.apple.com/account

### Steg 2: Opprett App ID
1. **Certificates, IDs & Profiles → Identifiers**
2. Klikk **+** → **App IDs** → App
3. Description: **TIER Golf**
4. Bundle ID: `com.tiergolf.app`
5. Aktiver **"Sign In with Apple"**

### Steg 3: Opprett Service ID
1. **Identifiers → +** → **Services IDs**
2. Identifier: `com.tiergolf.service`
3. Aktiver **"Sign In with Apple"** → **Configure**:
   - Domains: `localhost`, `tier-golf.no`
   - Return URLs:
     ```
     http://localhost:3000/api/v1/auth/apple/callback
     https://api.tier-golf.no/api/v1/auth/apple/callback
     ```

### Steg 4: Opprett Private Key
1. **Keys → +** → Enable "Sign In with Apple"
2. **Last ned .p8 filen** (kun én gang!)
3. Noter **Key ID** og **Team ID**
4. Lagre filen:
   ```bash
   mkdir -p apps/api/config
   mv ~/Downloads/AuthKey_KEY123ABC.p8 apps/api/config/apple-key.p8
   ```

### Steg 5: Oppdater Environment Variables

**Backend** (`apps/api/.env`):
```bash
APPLE_CLIENT_ID=com.tiergolf.service
APPLE_TEAM_ID=ABC123XYZ
APPLE_KEY_ID=KEY123ABC
APPLE_PRIVATE_KEY_PATH=./config/apple-key.p8
APPLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/apple/callback
```

**Frontend** (`apps/web/.env`):
```bash
REACT_APP_APPLE_CLIENT_ID=com.tiergolf.service
```

---

## 💳 4. Setup Stripe

### Steg 1: Stripe Account
1. Gå til https://dashboard.stripe.com/register
2. Registrer bedrift: **TIER Golf AS**
3. Aktiver **Test Mode** først

### Steg 2: Hent API Keys
1. Gå til **Developers → API keys**
2. Kopier:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

### Steg 3: Aktiver Payment Methods
1. Gå til **Settings → Payment methods**
2. Aktiver:
   - ✅ **Card** (Visa, Mastercard, Amex)
   - ✅ **Apple Pay**
   - ✅ **Google Pay**

### Steg 4: Oppdater Environment Variables

**Backend** (`apps/api/.env`):
```bash
STRIPE_SECRET_KEY=sk_test_abc123...
STRIPE_PUBLISHABLE_KEY=pk_test_abc123...
STRIPE_WEBHOOK_SECRET=whsec_abc123...
```

**Frontend** (`apps/web/.env`):
```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_abc123...
REACT_APP_ENABLE_STRIPE=true
```

---

## 🧪 5. Test Setup

### Test OAuth
```bash
# Start backend
cd apps/api
npm run dev

# Start frontend (new terminal)
cd apps/web
npm start

# Navigate to http://localhost:3001/login
# Click "Fortsett med Google" or "Fortsett med Apple"
```

### Test Stripe
```bash
# Backend
cd apps/api
npm run dev

# Frontend
cd apps/web
npm start

# Navigate to http://localhost:3001/pricing (when created)
# Use Stripe test card: 4242 4242 4242 4242
```

---

## 📝 Neste Steg

1. ✅ Installer dependencies (se seksjon 1)
2. ✅ Setup OAuth credentials (se seksjon 2 & 3)
3. ✅ Setup Stripe account (se seksjon 4)
4. 🔨 Test OAuth flow
5. 🔨 Test Stripe checkout

---

## 🆘 Troubleshooting

### OAuth ikke synlig på login-siden
- Sjekk at `REACT_APP_GOOGLE_CLIENT_ID` eller `REACT_APP_APPLE_CLIENT_ID` er satt
- OAuthButtons skjuler seg automatisk hvis ingen client IDs er konfigurert

### Stripe checkout feiler
- Bruk test card: `4242 4242 4242 4242`
- Sjekk at `STRIPE_SECRET_KEY` starter med `sk_test_`

### Apple Sign-In virker ikke lokalt
- Apple Sign-In krever HTTPS i produksjon
- For lokal testing: Bruk ngrok eller lignende

---

**Laget:** 2026-01-07
**Status:** Klar for installasjon
