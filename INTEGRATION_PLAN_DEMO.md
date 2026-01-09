# TIER Golf Academy - Integrasjonsplan for Full Demo

**Opprettet**: 2026-01-08
**Status**: Planlegging
**Mål**: Alle nødvendige integrasjoner for en fungerende full demo
**Estimat totalt**: 2-3 uker

---

## 📊 STATUS OVERSIKT

### ✅ FUNGERENDE INTEGRASJONER (Klar for demo)
- Backend API (Autentisering, Sessions, Tester, etc.)
- DataGolf (Golf statistikk og benchmarking)
- AI Coach (Chat og anbefalinger)
- Video upload & management
- TrackMan CSV import
- Internal calendar (Notion-style UI)
- Analytics framework (PostHog ready)

### ⚠️ DELVIS IMPLEMENTERT (Trenger fullføring)
- OAuth (Google/Apple) - Framework klar, må aktiveres
- Stripe Payments - Framework klar, må aktiveres
- Vipps - Kun UI, mangler backend
- Invoice - Kun UI, mangler fullføring

### ❌ MANGLER (Må implementeres)
- Email service (SendGrid/Resend)
- Google Calendar API sync
- Sentry error tracking
- Real-time notifications
- SMS varslinger (optional)
- Cloud storage admin (frontend)

---

## 🎯 DEMO-KRITISKE INTEGRASJONER

For en fungerende full demo må følgende være på plass:

### **TIER 1: ABSOLUTT NØDVENDIG** (Må være klar)
1. ✅ Backend API - **Ferdig**
2. ⚠️ Email Service - **Må implementeres**
3. ⚠️ OAuth (Google) - **Må aktiveres**
4. ⚠️ Stripe Payments - **Må aktiveres**
5. ✅ Video Upload - **Ferdig**
6. ✅ Calendar - **Ferdig** (intern)

### **TIER 2: VIKTIG FOR DEMO** (Sterkt anbefalt)
7. ⚠️ Sentry Error Tracking - **Bør implementeres**
8. ⚠️ Google Calendar Sync - **Bør implementeres**
9. ⚠️ Real-time Notifications - **Bør implementeres**
10. ✅ Analytics (PostHog) - **Klar, må aktiveres**

### **TIER 3: NICE TO HAVE** (Kan vente)
11. ❌ Vipps Payments - **Kan ventes**
12. ❌ SMS Notifications - **Kan ventes**
13. ❌ iCal Export - **Kan ventes**
14. ❌ Apple Sign-In - **Kan ventes**

---

## 📋 DETALJERT INTEGRASJONSPLAN

---

## INTEGRASJON 1: EMAIL SERVICE (SendGrid/Resend)

**Status**: ❌ Ikke implementert
**Prioritet**: KRITISK
**Estimat**: 1-2 dager
**Avhengigheter**: Backend API

### Hvorfor nødvendig?
- Password reset emails
- Velkomstemails ved registrering
- Email verification
- Session påminnelser
- Booking-bekreftelser
- Trener-invitasjoner
- Payment receipts

### Implementeringssteg

#### Backend (Node.js/Express)
```javascript
// 1. Installer pakker
npm install @sendgrid/mail
// eller
npm install resend

// 2. Opprett email service
// File: backend/src/services/emailService.js

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, html, text }) => {
  const msg = {
    to,
    from: 'noreply@iup-golf.com', // Din verifiserte sender
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent:', to);
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

// 3. Email templates
export const emailTemplates = {
  welcome: (name) => ({
    subject: 'Velkommen til TIER Golf Academy',
    html: `<h1>Velkommen, ${name}!</h1>...`,
  }),

  passwordReset: (resetLink) => ({
    subject: 'Tilbakestill passordet ditt',
    html: `<p>Klikk her: <a href="${resetLink}">Reset Password</a></p>`,
  }),

  sessionReminder: (sessionDate, sessionTime) => ({
    subject: 'Påminnelse: Treningsøkt i morgen',
    html: `<p>Du har en treningsøkt ${sessionDate} kl ${sessionTime}</p>`,
  }),

  bookingConfirmation: (coachName, date, time) => ({
    subject: 'Booking bekreftet',
    html: `<p>Din booking med ${coachName} ${date} kl ${time} er bekreftet</p>`,
  }),
};

// 4. Bruk i auth routes
// File: backend/src/routes/auth.js

import { sendEmail, emailTemplates } from '../services/emailService.js';

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Generate reset token
  const resetToken = generateResetToken();
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send email
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const template = emailTemplates.passwordReset(resetLink);

  await sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html,
  });

  res.json({ message: 'Password reset email sent' });
});

router.post('/register', async (req, res) => {
  // ... user creation logic

  // Send welcome email
  const template = emailTemplates.welcome(user.firstName);
  await sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html,
  });

  res.json({ user, token });
});
```

#### Frontend (React)
```javascript
// Ingen endringer nødvendig i frontend
// ForgotPassword.tsx allerede sender request til /auth/forgot-password
```

### Environment Variables
```env
# Backend .env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@iup-golf.com
SENDGRID_FROM_NAME=TIER Golf Academy
FRONTEND_URL=http://localhost:3000

# Alternative: Resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Testing Sjekkliste
```
[ ] SendGrid API key verifisert
[ ] Sender email verifisert i SendGrid
[ ] Test "Forgot Password" - epost mottas
[ ] Test "Register" - velkomstepost mottas
[ ] Test "Booking Confirmation" - epost mottas
[ ] Test email templates rendres riktig
[ ] Test fallback hvis email feiler (ikke crash)
```

### Ressurser
- SendGrid Docs: https://docs.sendgrid.com/for-developers/sending-email/api-getting-started
- Resend Docs: https://resend.com/docs/send-with-nodejs
- Email template builder: https://maizzle.com/

---

## INTEGRASJON 2: OAUTH (Google Sign-In)

**Status**: ⚠️ Framework implementert, må aktiveres
**Prioritet**: HØY
**Estimat**: 0.5-1 dag
**Avhengigheter**: Backend API

### Hvorfor nødvendig?
- Enklere login for brukere (ingen passord)
- Raskere onboarding
- Redusert passord-support
- Standard for moderne apps

### Implementeringssteg

#### 1. Google Cloud Console Setup
```
1. Gå til https://console.cloud.google.com/
2. Opprett nytt prosjekt: "TIER Golf Academy"
3. Enable "Google+ API"
4. Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized JavaScript origins:
   - http://localhost:3000 (development)
   - https://app.iup-golf.com (production)
7. Authorized redirect URIs:
   - http://localhost:3000
   - https://app.iup-golf.com
8. Kopier Client ID
```

#### 2. Backend Implementation
```javascript
// File: backend/src/routes/auth.js

import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google/signin', async (req, res) => {
  const { credential } = req.body; // ID token from frontend

  try {
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture, sub } = payload;

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        email,
        firstName: given_name,
        lastName: family_name,
        profileImage: picture,
        googleId: sub,
        role: 'player', // Default role
        emailVerified: true, // Google already verified
      });
    } else {
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = sub;
        await user.save();
      }
    }

    // Generate JWT token
    const token = generateJWT(user);

    res.json({ user, token });
  } catch (error) {
    console.error('Google Sign-In error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});
```

#### 3. Frontend Activation
```javascript
// File: apps/web/.env
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
REACT_APP_ENABLE_OAUTH=true

// OAuthButtons.tsx already implemented - will auto-show when env vars set
```

### Environment Variables
```env
# Frontend
REACT_APP_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
REACT_APP_ENABLE_OAUTH=true

# Backend
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx (ikke nødvendig for ID token verify)
```

### Testing Sjekkliste
```
[ ] Google Cloud Console project opprettet
[ ] OAuth 2.0 Client ID opprettet
[ ] Frontend env vars satt
[ ] Backend env vars satt
[ ] Google Sign-In knapp vises på /login
[ ] Test sign in med Google-konto
[ ] Ny bruker opprettes automatisk
[ ] Eksisterende bruker logger inn
[ ] JWT token returneres og lagres
[ ] Redirect til dashboard etter login
[ ] Error handling hvis Google token ugyldig
```

### Ressurser
- Google Sign-In Guide: https://developers.google.com/identity/gsi/web/guides/overview
- @react-oauth/google docs: https://www.npmjs.com/package/@react-oauth/google

---

## INTEGRASJON 3: STRIPE PAYMENTS

**Status**: ⚠️ Framework implementert, må aktiveres
**Prioritet**: HØY
**Estimat**: 1 dag
**Avhengigheter**: Backend API

### Hvorfor nødvendig?
- Demo av betalingsfunksjonalitet
- Abonnementshåndtering
- Payment methods lagring
- Invoice payments

### Implementeringssteg

#### 1. Stripe Account Setup
```
1. Opprett Stripe-konto: https://dashboard.stripe.com/register
2. Aktiver Test Mode
3. Kopier API keys:
   - Publishable key (pk_test_...)
   - Secret key (sk_test_...)
4. Opprett Products i Stripe Dashboard:
   - "TIER Base" - $29/måned
   - "TIER Premium" - $49/måned
   - "TIER Elite" - $99/måned
5. Kopier Price IDs (price_...)
```

#### 2. Backend Implementation
```javascript
// File: backend/src/services/stripeService.js

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Setup Intent (for saving payment method)
export const createSetupIntent = async (customerId) => {
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
  });

  return setupIntent;
};

// Create Subscription
export const createSubscription = async (customerId, priceId, paymentMethodId) => {
  // Attach payment method to customer
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });

  // Set as default payment method
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  // Create subscription
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    expand: ['latest_invoice.payment_intent'],
  });

  return subscription;
};

// File: backend/src/routes/payments.js

router.post('/create-setup-intent', authenticate, async (req, res) => {
  try {
    const user = req.user;

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: { userId: user._id },
      });

      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const setupIntent = await createSetupIntent(customerId);

    res.json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    console.error('Setup Intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/create-subscription', authenticate, async (req, res) => {
  const { priceId, paymentMethodId } = req.body;
  const user = req.user;

  try {
    const subscription = await createSubscription(
      user.stripeCustomerId,
      priceId,
      paymentMethodId
    );

    // Save subscription to user
    user.subscription = {
      id: subscription.id,
      status: subscription.status,
      priceId,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    };
    await user.save();

    res.json({ subscription });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook handler for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle event
  switch (event.type) {
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log('Payment succeeded:', invoice.id);
      // Update user subscription status
      break;

    case 'invoice.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      // Notify user
      break;

    case 'customer.subscription.deleted':
      console.log('Subscription cancelled:', event.data.object.id);
      // Update user subscription status
      break;
  }

  res.json({ received: true });
});
```

#### 3. Frontend Activation
```javascript
// File: apps/web/.env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
REACT_APP_ENABLE_STRIPE=true

// StripeCheckout.tsx already implemented - will activate when env vars set
```

### Environment Variables
```env
# Frontend
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
REACT_APP_ENABLE_STRIPE=true

# Backend
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_BASE=price_xxxxx
STRIPE_PRICE_PREMIUM=price_xxxxx
STRIPE_PRICE_ELITE=price_xxxxx
```

### Testing Sjekkliste
```
[ ] Stripe account opprettet
[ ] Test mode aktivert
[ ] Products/Prices opprettet i Stripe
[ ] Frontend env vars satt
[ ] Backend env vars satt
[ ] Test checkout flow:
    [ ] Velg plan (Premium)
    [ ] Legg inn test-kort (4242 4242 4242 4242)
    [ ] Bekreft betaling
    [ ] Subscription opprettet i Stripe
    [ ] User.subscription oppdatert i database
[ ] Test 3D Secure card (4000 0027 6000 3184)
[ ] Test webhook delivery (use Stripe CLI)
[ ] Test subscription cancellation
```

### Ressurser
- Stripe Docs: https://stripe.com/docs
- Test cards: https://stripe.com/docs/testing
- Stripe CLI: https://stripe.com/docs/stripe-cli

---

## INTEGRASJON 4: SENTRY ERROR TRACKING

**Status**: ❌ Ikke implementert
**Prioritet**: MEDIUM-HØY
**Estimat**: 0.5 dag
**Avhengigheter**: Ingen

### Hvorfor viktig for demo?
- Fang opp errors i real-time
- Debug production issues
- Performance monitoring
- User feedback på crashes

### Implementeringssteg

#### 1. Sentry Account Setup
```
1. Opprett Sentry-konto: https://sentry.io/signup/
2. Create project: "TIER Golf Academy - Web"
3. Platform: React
4. Kopier DSN (Data Source Name)
```

#### 2. Frontend Implementation
```bash
# Install Sentry
npm install --save @sentry/react
```

```javascript
// File: apps/web/src/index.tsx

import * as Sentry from "@sentry/react";

// Initialize Sentry
if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],

    // Performance Monitoring
    tracesSampleRate: 0.1, // 10% of transactions

    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of errors

    // Filter sensitive data
    beforeSend(event, hint) {
      // Don't send if local development
      if (window.location.hostname === 'localhost') {
        return null;
      }

      // Scrub sensitive fields
      if (event.request) {
        delete event.request.cookies;
      }

      return event;
    },
  });
}

// Wrap App in Sentry ErrorBoundary
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);

// Error Fallback Component
function ErrorFallback() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Oops! Noe gikk galt</h1>
      <p>Vi har registrert feilen og jobber med å fikse den.</p>
      <button onClick={() => window.location.reload()}>
        Last siden på nytt
      </button>
    </div>
  );
}
```

```javascript
// Optional: Capture user context
import { useEffect } from 'react';
import * as Sentry from "@sentry/react";
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } else {
      Sentry.setUser(null);
    }
  }, [user]);

  return <Router>...</Router>;
}
```

#### 3. Manual Error Capture
```javascript
// Capture custom errors
import * as Sentry from "@sentry/react";

try {
  // Some risky operation
  await uploadVideo(file);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'video-upload',
    },
    extra: {
      fileSize: file.size,
      fileName: file.name,
    },
  });

  // Still show error to user
  showNotification('Video upload failed', 'error');
}
```

### Environment Variables
```env
# Frontend .env
REACT_APP_SENTRY_DSN=https://xxxxx@oxxxxx.ingest.sentry.io/xxxxx
```

### Testing Sjekkliste
```
[ ] Sentry project opprettet
[ ] DSN kopiert
[ ] Frontend env var satt
[ ] Sentry initialiseres ved app-start
[ ] Test error capture:
    [ ] Throw test error i browser console
    [ ] Error vises i Sentry dashboard
    [ ] User context (email, role) vises
[ ] Test ErrorBoundary
[ ] Test performance traces
[ ] Test session replay
[ ] Verify sensitive data fjernet (passwords, tokens)
```

### Ressurser
- Sentry React Docs: https://docs.sentry.io/platforms/javascript/guides/react/

---

## INTEGRASJON 5: GOOGLE CALENDAR SYNC

**Status**: ❌ Ikke implementert
**Prioritet**: MEDIUM
**Estimat**: 2-3 dager
**Avhengigheter**: OAuth (Google)

### Hvorfor nice to have for demo?
- Sync treningsøkter til Google Calendar
- Vis eksterne events i app-calendar
- Two-way sync (app ↔ Google)
- Professional appearance

### Implementeringssteg

#### 1. Google Cloud Console Setup
```
1. Same project as OAuth
2. Enable "Google Calendar API"
3. OAuth consent screen → Add scope:
   - https://www.googleapis.com/auth/calendar.events
4. Update OAuth client redirect URIs if needed
```

#### 2. Backend Implementation
```bash
# Install Google API client
npm install googleapis
```

```javascript
// File: backend/src/services/googleCalendarService.js

import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Exchange code for tokens
export const getTokensFromCode = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

// Create calendar event
export const createCalendarEvent = async (accessToken, event) => {
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const calendarEvent = {
    summary: event.title,
    description: event.description,
    start: {
      dateTime: event.startDateTime,
      timeZone: 'Europe/Oslo',
    },
    end: {
      dateTime: event.endDateTime,
      timeZone: 'Europe/Oslo',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 30 },
      ],
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: calendarEvent,
  });

  return response.data;
};

// List calendar events
export const listCalendarEvents = async (accessToken, timeMin, timeMax) => {
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  return response.data.items;
};

// Update event
export const updateCalendarEvent = async (accessToken, eventId, updates) => {
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const response = await calendar.events.update({
    calendarId: 'primary',
    eventId,
    resource: updates,
  });

  return response.data;
};

// Delete event
export const deleteCalendarEvent = async (accessToken, eventId) => {
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  await calendar.events.delete({
    calendarId: 'primary',
    eventId,
  });
};
```

```javascript
// File: backend/src/routes/calendar.js

import {
  createCalendarEvent,
  listCalendarEvents,
  updateCalendarEvent,
  deleteCalendarEvent,
} from '../services/googleCalendarService.js';

// Sync session to Google Calendar
router.post('/sync-to-google', authenticate, async (req, res) => {
  const { sessionId } = req.body;
  const user = req.user;

  if (!user.googleAccessToken) {
    return res.status(400).json({ error: 'Google Calendar not connected' });
  }

  try {
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const googleEvent = await createCalendarEvent(
      user.googleAccessToken,
      {
        title: session.title,
        description: session.notes,
        startDateTime: session.startTime,
        endDateTime: session.endTime,
      }
    );

    // Save Google event ID to session
    session.googleEventId = googleEvent.id;
    await session.save();

    res.json({ googleEvent });
  } catch (error) {
    console.error('Google Calendar sync error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Import Google Calendar events
router.get('/import-from-google', authenticate, async (req, res) => {
  const { startDate, endDate } = req.query;
  const user = req.user;

  if (!user.googleAccessToken) {
    return res.status(400).json({ error: 'Google Calendar not connected' });
  }

  try {
    const events = await listCalendarEvents(
      user.googleAccessToken,
      new Date(startDate),
      new Date(endDate)
    );

    res.json({ events });
  } catch (error) {
    console.error('Google Calendar import error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

#### 3. Frontend Implementation
```javascript
// File: apps/web/src/features/calendar/GoogleCalendarSync.tsx

import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { calendarAPI } from '../../services/api';

export function GoogleCalendarSync() {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // Send to backend to exchange for full tokens
      await calendarAPI.connectGoogle(tokenResponse.access_token);
      setIsConnected(true);
    },
    scope: 'https://www.googleapis.com/auth/calendar.events',
  });

  const handleSyncSession = async (sessionId) => {
    try {
      await calendarAPI.syncToGoogle(sessionId);
      showNotification('Session synced to Google Calendar', 'success');
    } catch (error) {
      showNotification('Failed to sync to Google Calendar', 'error');
    }
  };

  return (
    <div>
      {isConnected ? (
        <button onClick={() => handleSyncSession(session.id)}>
          Sync to Google Calendar
        </button>
      ) : (
        <button onClick={handleConnect}>
          Connect Google Calendar
        </button>
      )}
    </div>
  );
}
```

### Environment Variables
```env
# Backend
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### Testing Sjekkliste
```
[ ] Google Calendar API enabled
[ ] OAuth scope added (calendar.events)
[ ] Backend service implementert
[ ] Frontend connect-knapp fungerer
[ ] Test create event i Google Calendar
[ ] Event vises i Google Calendar app
[ ] Test import events fra Google
[ ] Eksterne events vises i app-calendar
[ ] Test update event (two-way sync)
[ ] Test delete event
[ ] Refresh token håndtering
```

### Ressurser
- Google Calendar API: https://developers.google.com/calendar/api/v3/reference
- googleapis npm: https://www.npmjs.com/package/googleapis

---

## INTEGRASJON 6: REAL-TIME NOTIFICATIONS

**Status**: ❌ Ikke implementert
**Prioritet**: MEDIUM
**Estimat**: 2 dager
**Avhengigheter**: Backend API

### Hvorfor viktig for demo?
- Live updates (nye meldinger, bookings)
- Better UX (no page refresh)
- Modern app feel

### Implementeringssteg

#### Option A: Socket.IO (Recommended)

```bash
# Backend
npm install socket.io

# Frontend
npm install socket.io-client
```

```javascript
// File: backend/src/socket.js

import { Server } from 'socket.io';

export function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = verifyJWT(token);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });
  });

  return io;
}

// Emit notification to specific user
export function emitToUser(io, userId, event, data) {
  io.to(`user:${userId}`).emit(event, data);
}
```

```javascript
// File: backend/src/server.js

import express from 'express';
import http from 'http';
import { initializeSocket, emitToUser } from './socket.js';

const app = express();
const httpServer = http.createServer(app);
const io = initializeSocket(httpServer);

// Make io available in routes
app.set('io', io);

// Example: Emit notification when new message
router.post('/messages', authenticate, async (req, res) => {
  const message = await Message.create({
    from: req.user._id,
    to: req.body.recipientId,
    content: req.body.content,
  });

  // Emit to recipient
  const io = req.app.get('io');
  emitToUser(io, req.body.recipientId, 'new-message', {
    message,
    sender: {
      name: req.user.firstName,
      avatar: req.user.profileImage,
    },
  });

  res.json({ message });
});

httpServer.listen(4000);
```

```javascript
// File: apps/web/src/contexts/SocketContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:4000', {
      auth: { token },
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
```

```javascript
// File: apps/web/src/hooks/useNotifications.ts

import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useNotification } from '../contexts/NotificationContext';

export function useRealTimeNotifications() {
  const socket = useSocket();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    socket.on('new-message', (data) => {
      showNotification(`New message from ${data.sender.name}`, 'info');
    });

    // Listen for new bookings
    socket.on('new-booking', (data) => {
      showNotification(`New booking: ${data.booking.date}`, 'success');
    });

    // Listen for session reminders
    socket.on('session-reminder', (data) => {
      showNotification(`Reminder: Session in 1 hour`, 'warning');
    });

    return () => {
      socket.off('new-message');
      socket.off('new-booking');
      socket.off('session-reminder');
    };
  }, [socket, showNotification]);
}
```

#### Option B: Server-Sent Events (Simpler)

```javascript
// Backend
router.get('/notifications/stream', authenticate, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const userId = req.user._id;

  // Store connection
  connections.set(userId, res);

  // Send keepalive every 30 seconds
  const keepAlive = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 30000);

  req.on('close', () => {
    clearInterval(keepAlive);
    connections.delete(userId);
  });
});

// Send notification
export function sendNotification(userId, notification) {
  const connection = connections.get(userId);
  if (connection) {
    connection.write(`data: ${JSON.stringify(notification)}\n\n`);
  }
}
```

### Testing Sjekkliste
```
[ ] Socket.IO server startet
[ ] Frontend kobler til socket ved login
[ ] Test new message notification
[ ] Test new booking notification
[ ] Test session reminder
[ ] Connection håndtering (reconnect)
[ ] Multiple tabs support
[ ] Disconnect ved logout
```

### Ressurser
- Socket.IO Docs: https://socket.io/docs/v4/

---

## 📊 IMPLEMENTERINGSREKKEFØLGE

### **UKE 1: Kritiske Integrasjoner**
```
Dag 1-2: Email Service (SendGrid/Resend)
  - Setup SendGrid account
  - Implementer backend email service
  - Lag email templates
  - Test forgot password, welcome email

Dag 3: OAuth (Google Sign-In)
  - Setup Google Cloud Console
  - Implementer backend verification
  - Aktivere frontend
  - Test login flow

Dag 4-5: Stripe Payments
  - Setup Stripe account
  - Opprett products/prices
  - Implementer backend
  - Test checkout flow
```

### **UKE 2: Viktige Integrasjoner**
```
Dag 1: Sentry Error Tracking
  - Setup Sentry account
  - Implementer frontend
  - Test error capture

Dag 2-3: Google Calendar Sync
  - Enable Calendar API
  - Implementer backend service
  - Implementer frontend sync
  - Test two-way sync

Dag 4-5: Real-time Notifications
  - Setup Socket.IO
  - Implementer backend events
  - Implementer frontend listeners
  - Test notifications
```

### **UKE 3: Polish & Testing**
```
Dag 1: Analytics (PostHog)
  - Setup PostHog
  - Aktivere tracking
  - Test events

Dag 2-3: Integration Testing
  - End-to-end tests
  - Performance testing
  - Security audit

Dag 4-5: Documentation & Deployment
  - Environment setup docs
  - Deployment guides
  - User guides
```

---

## 🎯 MINIMUM VIABLE DEMO (MVD)

For en fungerende demo MÅ disse være på plass:

### ✅ MUST HAVE (Absolutt nødvendig)
1. ✅ Backend API - **Ferdig**
2. ⚠️ Email Service - **Implementer Uke 1**
3. ⚠️ OAuth (Google) - **Implementer Uke 1**
4. ⚠️ Stripe Payments - **Implementer Uke 1**
5. ✅ Video Upload - **Ferdig**

**Estimat**: 1 uke

### ⚠️ SHOULD HAVE (Sterkt anbefalt)
6. ⚠️ Sentry - **Implementer Uke 2**
7. ⚠️ Google Calendar - **Implementer Uke 2**
8. ⚠️ Real-time Notifications - **Implementer Uke 2**

**Estimat**: +1 uke

### 📦 NICE TO HAVE (Kan vente)
9. Analytics (PostHog)
10. Vipps Payments
11. SMS Notifications
12. iCal Export

**Estimat**: +1-2 uker

---

## 🚀 NESTE STEG

1. **Prioriter**: Velg hvilke integrasjoner som er kritiske
2. **Setup accounts**: Opprett kontoer (SendGrid, Stripe, Sentry, Google)
3. **Environment variables**: Samle alle API keys
4. **Implementer**: Følg plan, én integrering om gangen
5. **Test**: Valider hver integrering før neste
6. **Deploy**: Produksjon når alt fungerer

---

## ✅ SJEKKLISTE FØR DEMO

```
KRITISK:
[ ] Email service fungerer (password reset, welcome)
[ ] Google Sign-In fungerer
[ ] Stripe payments fungerer (test mode)
[ ] Video upload fungerer
[ ] Backend API er stabilt

VIKTIG:
[ ] Sentry fanger errors
[ ] Google Calendar sync fungerer
[ ] Real-time notifications fungerer
[ ] Analytics tracking aktivert

TESTING:
[ ] End-to-end user flows testet
[ ] Payment flows testet (test cards)
[ ] Error scenarios håndtert
[ ] Performance er akseptabelt (< 2s load)

DOKUMENTASJON:
[ ] Environment variables dokumentert
[ ] Setup guide skrevet
[ ] Known issues dokumentert
[ ] Backup plan for demo
```

---

**Lykke til med integreringene! Dette blir bra! 🚀**

**Neste**: Velg prioritering og start med Uke 1 tasks!
