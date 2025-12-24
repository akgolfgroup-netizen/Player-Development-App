# OAuth Implementation - Google & Apple Sign-In
**Dato:** 2025-12-18
**Status:** BACKEND COMPLETE, FRONTEND IN PROGRESS

---

## 🎯 Oversikt

OAuth implementation for **Google Sign-In** og **Apple Sign-In** som alternativ til traditional email/password login.

### Features Implementert:
- ✅ Prisma schema oppdatert (OAuth accounts table)
- ✅ OAuth service layer (Google + Apple authentication)
- ✅ Backend OAuth routes (6 endpoints)
- ✅ Environment variables konfigurert
- ⏸️ Frontend OAuth buttons (NEXT)
- ⏸️ E2E testing (NEXT)

---

## 📊 Arkitektur

### Database Schema

#### User Model Changes:
```prisma
model User {
  passwordHash    String?  // NOW OPTIONAL (was required)
  oauthAccounts   OAuthAccount[]  // NEW RELATION
  // ... existing fields
}
```

#### New OAuthAccount Model:
```prisma
model OAuthAccount {
  id            String   @id @default(uuid())
  userId        String   // FK to User
  provider      String   // 'google' | 'apple'
  providerId    String   // OAuth provider's user ID
  providerEmail String?
  accessToken   String?  // Encrypted in production
  refreshToken  String?
  expiresAt     DateTime?
  providerData  Json?    // Additional provider data

  @@unique([provider, providerId])
}
```

### Flow Diagram

#### Google Sign-In Flow:
```
1. User clicks "Sign in with Google" button (frontend)
2. Frontend calls Google Sign-In library
3. Google returns ID token to frontend
4. Frontend sends ID token to backend: POST /api/v1/auth/google/signin
5. Backend verifies ID token with Google
6. Backend checks if OAuth account exists:
   - YES: Return existing user + JWT tokens
   - NO: Create new user + tenant + OAuth account → Return JWT tokens
7. Frontend stores tokens in localStorage
8. User logged in ✅
```

#### Apple Sign-In Flow:
```
1. User clicks "Sign in with Apple" button (frontend)
2. Frontend calls Apple Sign-In library
3. Apple returns ID token + optional user info
4. Frontend sends ID token to backend: POST /api/v1/auth/apple/signin
5. Backend verifies ID token (JWT verification)
6. Backend checks if OAuth account exists:
   - YES: Return existing user + JWT tokens
   - NO: Create new user + tenant + OAuth account → Return JWT tokens
7. Frontend stores tokens in localStorage
8. User logged in ✅
```

---

## 🔧 Backend Implementation

### Files Created:

#### 1. OAuth Service (`/src/services/oauth.service.ts`) - 300 lines
**Methods:**
- `getGoogleAuthUrl()` - Generate Google OAuth URL
- `getGoogleProfile(code)` - Exchange authorization code for profile
- `verifyGoogleIdToken(idToken)` - Verify Google ID token (frontend-initiated)
- `getAppleAuthUrl()` - Generate Apple OAuth URL
- `verifyAppleIdToken(idToken)` - Verify Apple ID token
- `getOrCreateUserFromOAuth(profile)` - Create or link user account

**Features:**
- googleapis library integration
- JWT token verification
- User creation with tenant
- OAuth account linking

#### 2. OAuth Routes (`/src/api/v1/auth/oauth.routes.ts`) - 300 lines
**Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/google` | Redirect to Google consent screen |
| GET | `/auth/google/callback` | Google OAuth callback (server-initiated) |
| POST | `/auth/google/signin` | Google Sign-In with ID token (frontend-initiated) ✅ |
| GET | `/auth/apple` | Redirect to Apple consent screen |
| POST | `/auth/apple/callback` | Apple OAuth callback (form_post) |
| POST | `/auth/apple/signin` | Apple Sign-In with ID token (frontend-initiated) ✅ |

**Primary Endpoints (Frontend Use):**
- `POST /api/v1/auth/google/signin` - Body: `{ idToken, firstName?, lastName? }`
- `POST /api/v1/auth/apple/signin` - Body: `{ idToken, user? }`

**Response Format:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR...",
  "refreshToken": "dGciOiJIUzI1NiIsInR5cCI6...",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "player",
    "tenantId": "uuid"
  }
}
```

#### 3. Prisma Schema Update (`/prisma/schema.prisma`)
- User.passwordHash now **optional** (line 54)
- New OAuthAccount model (lines 86-106)
- Relation: User.oauthAccounts (line 67)

#### 4. Environment Variables (`/.env`)
```bash
# Frontend URL
FRONTEND_URL=http://localhost:3001

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/google/callback

# Apple Sign-In
APPLE_CLIENT_ID=com.your-app.service-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY_PATH=./config/apple-key.p8
APPLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/apple/callback
```

---

## 🎨 Frontend Implementation (TO DO)

### Files to Create:

#### 1. OAuth Buttons Component (`/apps/web/src/components/auth/OAuthButtons.jsx`)
```jsx
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import AppleSignin from 'react-apple-signin-auth';

export function OAuthButtons({ onSuccess, onError }) {
  const handleGoogleSuccess = async (credentialResponse) => {
    const response = await fetch('http://localhost:3000/api/v1/auth/google/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: credentialResponse.credential }),
    });

    const data = await response.json();
    onSuccess(data);
  };

  const handleAppleSuccess = async (response) => {
    const apiResponse = await fetch('http://localhost:3000/api/v1/auth/apple/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idToken: response.authorization.id_token,
        user: response.user,
      }),
    });

    const data = await apiResponse.json();
    onSuccess(data);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Google Sign-In */}
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={onError}
        theme="outline"
        size="large"
        text="signin_with"
      />

      {/* Apple Sign-In */}
      <AppleSignin
        authOptions={{
          clientId: process.env.REACT_APP_APPLE_CLIENT_ID,
          scope: 'email name',
          redirectURI: window.location.origin + '/auth/callback',
          state: 'state',
          nonce: 'nonce',
          usePopup: true,
        }}
        onSuccess={handleAppleSuccess}
        onError={onError}
        render={(props) => (
          <button
            onClick={props.onClick}
            style={{
              padding: '12px',
              border: '1px solid #000',
              borderRadius: '4px',
              background: '#000',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Sign in with Apple
          </button>
        )}
      />
    </div>
  );
}
```

#### 2. Update Login Page (`/apps/web/src/features/auth/Login.jsx`)
Add OAuthButtons component below traditional login form:
```jsx
import { OAuthButtons } from '../../components/auth/OAuthButtons';

// Inside Login component:
<OAuthButtons
  onSuccess={(data) => {
    // Store tokens
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    // Redirect to dashboard
    navigate('/');
  }}
  onError={(error) => {
    console.error('OAuth error:', error);
    setError('Authentication failed. Please try again.');
  }}
/>
```

#### 3. Install Dependencies
```bash
cd /apps/web
npm install @react-oauth/google react-apple-signin-auth
```

#### 4. Wrap App with Google Provider (`/apps/web/src/App.jsx`)
```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      {/* Existing app content */}
    </GoogleOAuthProvider>
  );
}
```

#### 5. Environment Variables (`/apps/web/.env`)
```bash
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
REACT_APP_APPLE_CLIENT_ID=com.your-app.service-id
```

---

## 🔐 OAuth Setup Guide

### Google OAuth Setup:

1. **Go to Google Cloud Console**
   https://console.cloud.google.com/apis/credentials

2. **Create Project** (if new)
   - Click "Select a project" → "New Project"
   - Name: "IUP Golf App"

3. **Enable Google+ API**
   - APIs & Services → Library
   - Search "Google+ API" → Enable

4. **Create OAuth 2.0 Client ID**
   - Credentials → Create Credentials → OAuth client ID
   - Application type: Web application
   - Name: "IUP Golf Web"
   - Authorized JavaScript origins:
     - `http://localhost:3001`
     - `http://localhost:3000`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/v1/auth/google/callback`

5. **Copy Credentials**
   - Client ID → Add to `.env` as `GOOGLE_CLIENT_ID`
   - Client secret → Add to `.env` as `GOOGLE_CLIENT_SECRET`

### Apple Sign-In Setup:

1. **Apple Developer Account Required**
   https://developer.apple.com/account

2. **Create App ID**
   - Certificates, IDs & Profiles → Identifiers → App IDs
   - Register new App ID
   - Enable "Sign In with Apple"

3. **Create Service ID**
   - Identifiers → Services IDs
   - Register new Service ID
   - Enable "Sign In with Apple"
   - Configure:
     - Domains: `localhost`, `your-domain.com`
     - Return URLs: `http://localhost:3000/api/v1/auth/apple/callback`

4. **Create Key**
   - Keys → Register a new key
   - Enable "Sign In with Apple"
   - Download `.p8` file
   - Save to `/apps/api/config/apple-key.p8`

5. **Copy Credentials**
   - Service ID → Add to `.env` as `APPLE_CLIENT_ID`
   - Team ID → Add to `.env` as `APPLE_TEAM_ID`
   - Key ID → Add to `.env` as `APPLE_KEY_ID`

---

## 🧪 Testing Guide

### Backend Testing:

#### Test Google Sign-In (Manual):
```bash
# 1. Start backend
cd /apps/api
PORT=3000 npm run dev

# 2. Get Google ID token (use Google OAuth Playground or frontend)

# 3. Test endpoint
curl -X POST http://localhost:3000/api/v1/auth/google/signin \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY4YWU4..."
  }'

# Expected: 200 OK with accessToken, refreshToken, user
```

#### Test Apple Sign-In (Manual):
```bash
curl -X POST http://localhost:3000/api/v1/auth/apple/signin \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "eyJraWQiOiJmaDZCczhDIiwiYWxnIjoiUlM..."
  }'

# Expected: 200 OK with accessToken, refreshToken, user
```

### Frontend Testing:

1. Add OAuth buttons to Login page
2. Click "Sign in with Google"
3. Complete Google sign-in flow
4. Verify:
   - Tokens stored in localStorage
   - Redirected to dashboard
   - User info displayed
5. Repeat for Apple Sign-In

### Database Verification:

```sql
-- Check OAuth accounts
SELECT * FROM oauth_accounts;

-- Check users without passwords (OAuth only)
SELECT id, email, first_name, last_name, password_hash
FROM users
WHERE password_hash IS NULL;

-- Check OAuth account links
SELECT
  u.email,
  o.provider,
  o.provider_id,
  o.provider_email,
  o.created_at
FROM users u
JOIN oauth_accounts o ON u.id = o.user_id
ORDER BY o.created_at DESC;
```

---

## 🚀 Deployment Checklist

### Backend:
- [ ] Apply Prisma migration: `npx prisma db push`
- [ ] Add OAuth environment variables to production `.env`
- [ ] Update Google OAuth authorized domains (production URL)
- [ ] Update Apple Sign-In return URLs (production URL)
- [ ] Encrypt OAuth tokens in database (use crypto library)
- [ ] Enable HTTPS for OAuth callbacks
- [ ] Configure CORS for frontend origin

### Frontend:
- [ ] Install OAuth dependencies: `@react-oauth/google`, `react-apple-signin-auth`
- [ ] Add OAuth buttons to Login page
- [ ] Wrap App with GoogleOAuthProvider
- [ ] Add OAuth environment variables to `.env`
- [ ] Test OAuth flow in production
- [ ] Add error handling for OAuth failures
- [ ] Add loading states during OAuth

### Security:
- [ ] Validate OAuth tokens on every request
- [ ] Implement CSRF protection (state parameter)
- [ ] Rate limit OAuth endpoints
- [ ] Log OAuth authentication attempts
- [ ] Encrypt stored OAuth tokens
- [ ] Implement token refresh logic
- [ ] Add OAuth account unlinking feature

---

## 📊 Migration Script

**To apply OAuth schema changes:**

```bash
cd /apps/api

# Dev environment
npx prisma db push

# Production environment
npx prisma migrate deploy
```

**Expected Changes:**
1. `users.password_hash` column becomes nullable
2. New table: `oauth_accounts` (8 columns)
3. Foreign key: `oauth_accounts.user_id` → `users.id`
4. Unique constraint: `oauth_accounts (provider, provider_id)`

---

## 💡 Usage Examples

### Backend - Get or Create User:
```typescript
const profile = await oauthService.verifyGoogleIdToken(idToken);
const user = await oauthService.getOrCreateUserFromOAuth(profile);
// Returns existing user OR creates new user + tenant + OAuth account
```

### Frontend - Handle OAuth Success:
```javascript
const handleOAuthSuccess = (data) => {
  // Store tokens
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);

  // Update user context
  setUser(data.user);

  // Redirect to dashboard
  navigate('/');
};
```

---

## 🔄 Account Linking

**Scenario:** User signs up with email/password, later uses Google Sign-In with same email

**Behavior:**
1. OAuth service checks if email already exists
2. If YES: Link OAuth account to existing user
3. User can now login with either:
   - Email/password (traditional)
   - Google Sign-In (OAuth)

**Database Result:**
```
users:
  id: uuid-1
  email: user@example.com
  password_hash: bcrypt-hash-here  // Still exists!

oauth_accounts:
  id: uuid-2
  user_id: uuid-1
  provider: google
  provider_id: 123456789
```

---

## 📈 Success Metrics

**Backend Complete:**
- ✅ 600+ lines of OAuth code
- ✅ 6 OAuth endpoints
- ✅ Google + Apple providers
- ✅ User creation + linking
- ✅ JWT token generation

**Frontend TODO:**
- ⏸️ OAuth buttons component
- ⏸️ Login page integration
- ⏸️ Token storage
- ⏸️ Error handling
- ⏸️ Loading states

**Estimated Remaining Time:**
- Frontend implementation: 2-3 hours
- Testing: 1-2 hours
- **Total: 3-5 hours**

---

## 🛠 Troubleshooting

### "Can't reach database server"
- Database not running
- Fix: Start PostgreSQL or check DATABASE_URL

### "Invalid Google ID token"
- Wrong GOOGLE_CLIENT_ID
- Token expired
- Fix: Regenerate credentials, check .env

### "Failed to authenticate with Google"
- googleapis library error
- Fix: Check network connection, verify credentials

### "User creation failed"
- Database constraint violation
- Fix: Check unique email constraint, verify tenant creation

### OAuth redirect not working
- Wrong redirect URI in OAuth provider config
- Fix: Match REDIRECT_URI in .env with provider settings

---

**Created:** 2025-12-18
**Status:** BACKEND COMPLETE (5/8 tasks)
**Next:** Frontend OAuth buttons implementation
