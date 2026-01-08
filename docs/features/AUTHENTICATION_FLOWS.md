# Authentication Flows

**IUP Golf API**

This document provides detailed diagrams and explanations of authentication workflows.

---

## Table of Contents

1. [JWT Token Architecture](#jwt-token-architecture)
2. [Registration Flow](#registration-flow)
3. [Login Flow](#login-flow)
4. [Token Refresh Flow](#token-refresh-flow)
5. [Password Reset Flow](#password-reset-flow)
6. [Two-Factor Authentication (2FA) Flow](#two-factor-authentication-2fa-flow)
7. [Logout Flow](#logout-flow)
8. [Session Management](#session-management)

---

## JWT Token Architecture

The API uses a dual-token system:

- **Access Token**: Short-lived (15 minutes), used for authenticating API requests
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

```
┌─────────────────────────────────────────────────────────────┐
│                      TOKEN STRUCTURE                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Access Token (JWT)                                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │ Header                                             │     │
│  │ {                                                  │     │
│  │   "alg": "HS256",                                  │     │
│  │   "typ": "JWT"                                     │     │
│  │ }                                                  │     │
│  ├────────────────────────────────────────────────────┤     │
│  │ Payload                                            │     │
│  │ {                                                  │     │
│  │   "id": "user-uuid",                               │     │
│  │   "userId": "user-uuid",                           │     │
│  │   "role": "coach",                                 │     │
│  │   "email": "coach@example.com",                    │     │
│  │   "tenantId": "org-uuid",                          │     │
│  │   "playerId": "player-uuid",  // if role=player    │     │
│  │   "iat": 1640000000,          // issued at         │     │
│  │   "exp": 1640000900,          // expires (15min)   │     │
│  │   "aud": "iup-golf-api",                           │     │
│  │   "iss": "iup-golf-backend"                        │     │
│  │ }                                                  │     │
│  ├────────────────────────────────────────────────────┤     │
│  │ Signature                                          │     │
│  │ HMACSHA256(                                        │     │
│  │   base64UrlEncode(header) + "." +                  │     │
│  │   base64UrlEncode(payload),                        │     │
│  │   JWT_ACCESS_SECRET                                │     │
│  │ )                                                  │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  Lifetime: 15 minutes                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Refresh Token (JWT + Database)                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │ JWT Payload                                        │     │
│  │ {                                                  │     │
│  │   "id": "user-uuid",                               │     │
│  │   "type": "refresh",                               │     │
│  │   "iat": 1640000000,                               │     │
│  │   "exp": 1640604800  // 7 days                     │     │
│  │ }                                                  │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  Database Record (RefreshToken table)                        │
│  ┌────────────────────────────────────────────────────┐     │
│  │ id, userId, token, expiresAt, isRevoked,           │     │
│  │ createdAt, lastUsedAt                              │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  Lifetime: 7 days                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Registration Flow

```
┌──────────┐                                    ┌──────────┐
│          │                                    │          │
│  Client  │                                    │   API    │
│          │                                    │          │
└────┬─────┘                                    └────┬─────┘
     │                                               │
     │  1. POST /api/v1/auth/register               │
     │  {                                            │
     │    email, password, firstName,                │
     │    lastName, role, organizationName           │
     │  }                                            │
     ├──────────────────────────────────────────────>│
     │                                               │
     │                                               │ 2. Validate input
     │                                               │    - Email format
     │                                               │    - Password strength
     │                                               │    - Required fields
     │                                               │
     │                                               │ 3. Check email uniqueness
     │                                               │    SELECT * FROM users
     │                                               │    WHERE email = ?
     │                                               │
     │                                               │ 4. Hash password
     │                                               │    bcrypt.hash(password, 10)
     │                                               │
     │                                               │ 5. Create transaction
     │                                               │    BEGIN TRANSACTION
     │                                               │
     │                                               │ 6. Create organization
     │                                               │    INSERT INTO tenants
     │                                               │    (name, slug)
     │                                               │
     │                                               │ 7. Create user
     │                                               │    INSERT INTO users
     │                                               │    (email, passwordHash,
     │                                               │     role, tenantId)
     │                                               │
     │                                               │ 8. Create player record
     │                                               │    (if role = player)
     │                                               │    INSERT INTO players
     │                                               │
     │                                               │ 9. Generate tokens
     │                                               │    - Access token (JWT)
     │                                               │    - Refresh token (JWT)
     │                                               │
     │                                               │ 10. Store refresh token
     │                                               │     INSERT INTO refresh_tokens
     │                                               │
     │                                               │ 11. Commit transaction
     │                                               │     COMMIT
     │                                               │
     │  12. 201 Created                              │
     │  {                                            │
     │    success: true,                             │
     │    data: {                                    │
     │      accessToken,                             │
     │      refreshToken,                            │
     │      expiresIn: 900,                          │
     │      user: {...}                              │
     │    }                                          │
     │  }                                            │
     │<──────────────────────────────────────────────┤
     │                                               │
     │ 13. Store tokens in memory                    │
     │     (NOT localStorage)                        │
     │                                               │
     │ 14. Redirect to dashboard                     │
     │                                               │
```

**Error Cases:**

- **409 Conflict**: Email already registered
- **400 Bad Request**: Validation failed (weak password, invalid email, etc.)

---

## Login Flow

```
┌──────────┐                                    ┌──────────┐
│          │                                    │          │
│  Client  │                                    │   API    │
│          │                                    │          │
└────┬─────┘                                    └────┬─────┘
     │                                               │
     │  1. POST /api/v1/auth/login                  │
     │  {                                            │
     │    email: "coach@example.com",                │
     │    password: "SecurePass123!"                 │
     │  }                                            │
     ├──────────────────────────────────────────────>│
     │                                               │
     │                                               │ 2. Validate input
     │                                               │    - Email format
     │                                               │    - Password present
     │                                               │
     │                                               │ 3. Find user by email
     │                                               │    SELECT * FROM users
     │                                               │    WHERE email = ?
     │                                               │    AND isActive = true
     │                                               │
     │                                               │ 4. Verify password
     │                                               │    bcrypt.compare(
     │                                               │      password,
     │                                               │      user.passwordHash
     │                                               │    )
     │                                               │
     │                                               │ 5. Check 2FA status
     │                                               │    IF user.twoFactorEnabled
     │                                               │      → Require 2FA code
     │                                               │
     │                                               │ 6. Update last login
     │                                               │    UPDATE users
     │                                               │    SET lastLoginAt = NOW()
     │                                               │    WHERE id = ?
     │                                               │
     │                                               │ 7. Generate tokens
     │                                               │    - Access token (JWT)
     │                                               │    - Refresh token (JWT)
     │                                               │
     │                                               │ 8. Store refresh token
     │                                               │    INSERT INTO refresh_tokens
     │                                               │
     │  9. 200 OK                                    │
     │  {                                            │
     │    success: true,                             │
     │    data: {                                    │
     │      accessToken,                             │
     │      refreshToken,                            │
     │      expiresIn: 900,                          │
     │      user: {...}                              │
     │    }                                          │
     │  }                                            │
     │<──────────────────────────────────────────────┤
     │                                               │
     │ 10. Store tokens in memory                    │
     │                                               │
     │ 11. Make authenticated requests               │
     │     Authorization: Bearer <accessToken>       │
     │                                               │
```

**Error Cases:**

- **401 Unauthorized**: Invalid email or password
- **401 Unauthorized**: User account is inactive
- **401 Unauthorized**: 2FA required (if enabled)

---

## Token Refresh Flow

```
┌──────────┐                                    ┌──────────┐
│          │                                    │          │
│  Client  │                                    │   API    │
│          │                                    │          │
└────┬─────┘                                    └────┬─────┘
     │                                               │
     │  1. API Request                               │
     │  Authorization: Bearer <access-token>         │
     ├──────────────────────────────────────────────>│
     │                                               │
     │                                               │ 2. Verify token
     │                                               │    jwt.verify(token)
     │                                               │
     │  3. 401 Unauthorized                          │
     │  {                                            │
     │    error: {                                   │
     │      code: "TOKEN_EXPIRED",                   │
     │      message: "Access token has expired"      │
     │    }                                          │
     │  }                                            │
     │<──────────────────────────────────────────────┤
     │                                               │
     │ 4. Detect token expiration                    │
     │                                               │
     │  5. POST /api/v1/auth/refresh                │
     │  {                                            │
     │    refreshToken: "eyJhbGc..."                 │
     │  }                                            │
     ├──────────────────────────────────────────────>│
     │                                               │
     │                                               │ 6. Verify refresh token
     │                                               │    jwt.verify(refreshToken)
     │                                               │
     │                                               │ 7. Check database
     │                                               │    SELECT * FROM refresh_tokens
     │                                               │    WHERE token = ?
     │                                               │    AND isRevoked = false
     │                                               │    AND expiresAt > NOW()
     │                                               │
     │                                               │ 8. Get user
     │                                               │    SELECT * FROM users
     │                                               │    WHERE id = ?
     │                                               │    AND isActive = true
     │                                               │
     │                                               │ 9. Generate new tokens
     │                                               │    - New access token
     │                                               │    - New refresh token
     │                                               │
     │                                               │ 10. Revoke old refresh token
     │                                               │     UPDATE refresh_tokens
     │                                               │     SET isRevoked = true
     │                                               │     WHERE token = ?
     │                                               │
     │                                               │ 11. Store new refresh token
     │                                               │     INSERT INTO refresh_tokens
     │                                               │
     │  12. 200 OK                                   │
     │  {                                            │
     │    success: true,                             │
     │    data: {                                    │
     │      accessToken: "new-token",                │
     │      refreshToken: "new-refresh",             │
     │      expiresIn: 900,                          │
     │      user: {...}                              │
     │    }                                          │
     │  }                                            │
     │<──────────────────────────────────────────────┤
     │                                               │
     │ 13. Update stored tokens                      │
     │                                               │
     │ 14. Retry original request                    │
     │     Authorization: Bearer <new-access-token>  │
     ├──────────────────────────────────────────────>│
     │                                               │
```

**Error Cases:**

- **401 Unauthorized**: Refresh token expired (user must re-login)
- **401 Unauthorized**: Refresh token revoked
- **401 Unauthorized**: Refresh token invalid/malformed

---

## Password Reset Flow

```
┌──────────┐          ┌──────────┐          ┌──────────┐
│          │          │          │          │          │
│  Client  │          │   API    │          │  Email   │
│          │          │          │          │ Service  │
└────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │
     │  1. POST /api/v1/auth/forgot-password     │
     │  {                                        │
     │    email: "user@example.com"              │
     │  }                                        │
     ├────────────────────>│                     │
     │                     │                     │
     │                     │ 2. Find user        │
     │                     │    SELECT * FROM users
     │                     │    WHERE email = ?  │
     │                     │                     │
     │                     │ 3. Generate reset token
     │                     │    - crypto.randomBytes(32)
     │                     │    - SHA-256 hash   │
     │                     │    - 1 hour expiry  │
     │                     │                     │
     │                     │ 4. Store token      │
     │                     │    UPDATE users     │
     │                     │    SET resetToken = ?,
     │                     │        resetTokenExpiry = ?
     │                     │                     │
     │                     │ 5. Send email       │
     │                     │    resetLink =      │
     │                     │    "https://app/reset?token=..."
     │                     ├────────────────────>│
     │                     │                     │
     │                     │                     │ 6. Email sent
     │                     │                     │    "Password Reset"
     │                     │<────────────────────┤    with reset link
     │                     │                     │
     │  7. 200 OK          │                     │
     │  {                                        │
     │    success: true,                         │
     │    message: "Reset email sent"            │
     │  }                                        │
     │<────────────────────┤                     │
     │                     │                     │
     │                     │                     │
     │  8. User clicks link in email             │
     │  GET /reset-password?token=abc123         │
     │                     │                     │
     │                     │                     │
     │  9. Verify token                          │
     │  GET /api/v1/auth/verify-reset-token?token=abc123
     ├────────────────────>│                     │
     │                     │                     │
     │                     │ 10. Hash and check  │
     │                     │     SELECT * FROM users
     │                     │     WHERE resetToken = hash(token)
     │                     │     AND resetTokenExpiry > NOW()
     │                     │                     │
     │  11. Token valid    │                     │
     │  {                                        │
     │    success: true,                         │
     │    data: {                                │
     │      valid: true,                         │
     │      email: "user@example.com"            │
     │    }                                      │
     │  }                                        │
     │<────────────────────┤                     │
     │                     │                     │
     │                     │                     │
     │  12. POST /api/v1/auth/reset-password    │
     │  {                                        │
     │    token: "abc123",                       │
     │    newPassword: "NewSecure123!"           │
     │  }                                        │
     ├────────────────────>│                     │
     │                     │                     │
     │                     │ 13. Verify token    │
     │                     │                     │
     │                     │ 14. Hash new password
     │                     │     bcrypt.hash()   │
     │                     │                     │
     │                     │ 15. Update password │
     │                     │     UPDATE users    │
     │                     │     SET passwordHash = ?,
     │                     │         resetToken = NULL,
     │                     │         resetTokenExpiry = NULL
     │                     │                     │
     │                     │ 16. Revoke all sessions
     │                     │     UPDATE refresh_tokens
     │                     │     SET isRevoked = true
     │                     │     WHERE userId = ?
     │                     │                     │
     │  17. 200 OK         │                     │
     │  {                                        │
     │    success: true,                         │
     │    message: "Password reset successfully" │
     │  }                                        │
     │<────────────────────┤                     │
     │                     │                     │
     │ 18. Redirect to login                     │
     │                     │                     │
```

**Security Measures:**

- Reset tokens are single-use only
- Tokens expire after 1 hour
- Tokens are hashed (SHA-256) before storage
- All sessions revoked after password reset
- Same response for valid/invalid emails (prevent user enumeration)

---

## Two-Factor Authentication (2FA) Flow

### Setup 2FA

```
┌──────────┐                                    ┌──────────┐
│          │                                    │          │
│  Client  │                                    │   API    │
│          │                                    │          │
└────┬─────┘                                    └────┬─────┘
     │                                               │
     │  1. POST /api/v1/auth/2fa/setup              │
     │  Authorization: Bearer <token>                │
     │  {                                            │
     │    password: "CurrentPassword123!"            │
     │  }                                            │
     ├──────────────────────────────────────────────>│
     │                                               │
     │                                               │ 2. Verify password
     │                                               │    bcrypt.compare()
     │                                               │
     │                                               │ 3. Generate TOTP secret
     │                                               │    speakeasy.generateSecret()
     │                                               │
     │                                               │ 4. Generate QR code URL
     │                                               │    otpauth://totp/...
     │                                               │
     │                                               │ 5. Generate backup codes
     │                                               │    10 random codes
     │                                               │
     │                                               │ 6. Store secret (encrypted)
     │                                               │    UPDATE users
     │                                               │    SET twoFactorSecret = ?
     │                                               │
     │  7. 200 OK                                    │
     │  {                                            │
     │    success: true,                             │
     │    data: {                                    │
     │      secret: "JBSWY3DPEHPK3PXP",              │
     │      qrCodeUrl: "otpauth://...",              │
     │      backupCodes: ["123456", ...]             │
     │    }                                          │
     │  }                                            │
     │<──────────────────────────────────────────────┤
     │                                               │
     │ 8. Display QR code to user                    │
     │    User scans with authenticator app          │
     │    (Google Authenticator, Authy, etc.)        │
     │                                               │
     │  9. POST /api/v1/auth/2fa/verify             │
     │  {                                            │
     │    token: "123456"  // 6-digit code           │
     │  }                                            │
     ├──────────────────────────────────────────────>│
     │                                               │
     │                                               │ 10. Verify TOTP code
     │                                               │     speakeasy.verify()
     │                                               │
     │                                               │ 11. Enable 2FA
     │                                               │     UPDATE users
     │                                               │     SET twoFactorEnabled = true
     │                                               │
     │  12. 200 OK                                   │
     │  {                                            │
     │    success: true,                             │
     │    message: "2FA enabled successfully"        │
     │  }                                            │
     │<──────────────────────────────────────────────┤
     │                                               │
```

### Login with 2FA

```
┌──────────┐                                    ┌──────────┐
│          │                                    │          │
│  Client  │                                    │   API    │
│          │                                    │          │
└────┬─────┘                                    └────┬─────┘
     │                                               │
     │  1. POST /api/v1/auth/login                  │
     │  {                                            │
     │    email: "user@example.com",                 │
     │    password: "SecurePass123!"                 │
     │  }                                            │
     ├──────────────────────────────────────────────>│
     │                                               │
     │                                               │ 2. Verify credentials
     │                                               │
     │                                               │ 3. Check 2FA enabled
     │                                               │    IF twoFactorEnabled = true
     │                                               │
     │  4. 401 Unauthorized                          │
     │  {                                            │
     │    error: {                                   │
     │      code: "2FA_REQUIRED",                    │
     │      message: "2FA code required"             │
     │    }                                          │
     │  }                                            │
     │<──────────────────────────────────────────────┤
     │                                               │
     │ 5. Prompt user for 2FA code                   │
     │                                               │
     │  6. POST /api/v1/auth/login                  │
     │  {                                            │
     │    email: "user@example.com",                 │
     │    password: "SecurePass123!",                │
     │    twoFactorCode: "123456"                    │
     │  }                                            │
     ├──────────────────────────────────────────────>│
     │                                               │
     │                                               │ 7. Verify credentials
     │                                               │
     │                                               │ 8. Verify TOTP code
     │                                               │    speakeasy.verify()
     │                                               │
     │                                               │ 9. Generate tokens
     │                                               │
     │  10. 200 OK (logged in)                       │
     │<──────────────────────────────────────────────┤
     │                                               │
```

---

## Logout Flow

```
┌──────────┐                                    ┌──────────┐
│          │                                    │          │
│  Client  │                                    │   API    │
│          │                                    │          │
└────┬─────┘                                    └────┬─────┘
     │                                               │
     │  1. POST /api/v1/auth/logout                 │
     │  {                                            │
     │    refreshToken: "eyJhbGc..."                 │
     │  }                                            │
     ├──────────────────────────────────────────────>│
     │                                               │
     │                                               │ 2. Find refresh token
     │                                               │    SELECT * FROM refresh_tokens
     │                                               │    WHERE token = ?
     │                                               │
     │                                               │ 3. Revoke token
     │                                               │    UPDATE refresh_tokens
     │                                               │    SET isRevoked = true
     │                                               │    WHERE token = ?
     │                                               │
     │  4. 200 OK                                    │
     │  {                                            │
     │    success: true,                             │
     │    message: "Logged out successfully"         │
     │  }                                            │
     │<──────────────────────────────────────────────┤
     │                                               │
     │ 5. Clear tokens from memory                   │
     │    accessToken = null                         │
     │    refreshToken = null                        │
     │                                               │
     │ 6. Redirect to login page                     │
     │                                               │
```

---

## Session Management

### Token Storage Best Practices

**✅ DO:**
- Store tokens in memory (JavaScript variables)
- Use HTTP-only cookies for web apps
- Use secure storage for mobile apps (Keychain/Keystore)
- Clear tokens on logout

**❌ DON'T:**
- Store tokens in localStorage (XSS vulnerable)
- Store tokens in sessionStorage (XSS vulnerable)
- Log tokens to console
- Send tokens in URL parameters

### Token Lifecycle

```
Access Token Lifecycle:
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Created → Active (15 min) → Expired → Refreshed       │
│              │                  │                       │
│              │                  └─> Use refresh token   │
│              │                                          │
│              └─> Used for API requests                  │
│                                                         │
└─────────────────────────────────────────────────────────┘

Refresh Token Lifecycle:
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Created → Active (7 days) → Expired/Revoked → Delete  │
│              │                                          │
│              ├─> Used once to refresh access token      │
│              │                                          │
│              └─> Revoked on:                            │
│                  - Logout                               │
│                  - Password change                      │
│                  - New refresh (rotation)               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Automatic Token Cleanup

The API automatically cleans up expired/revoked tokens:

```sql
-- Runs daily via cron job
DELETE FROM refresh_tokens
WHERE expiresAt < NOW()
   OR (isRevoked = true AND updatedAt < NOW() - INTERVAL '30 days');
```

---

## Security Considerations

### Best Practices Implemented

1. **Short-lived access tokens** (15 minutes)
2. **Refresh token rotation** (new token issued on refresh)
3. **Database-backed refresh tokens** (revokable)
4. **Password hashing** (bcrypt with 10 rounds)
5. **Constant-time password comparison** (prevent timing attacks)
6. **Rate limiting** on auth endpoints (5 req/min)
7. **2FA support** (TOTP)
8. **Secure password reset** (time-limited, single-use tokens)
9. **No user enumeration** (same response for valid/invalid emails)
10. **Session revocation** on password change

### Token Security

- Access tokens are **stateless** (no database lookup)
- Refresh tokens are **stateful** (database-backed, revokable)
- All tokens signed with **HMAC-SHA256**
- Token secrets stored in **environment variables**
- Different secrets for access vs refresh tokens

---

**Last Updated:** December 25, 2024
