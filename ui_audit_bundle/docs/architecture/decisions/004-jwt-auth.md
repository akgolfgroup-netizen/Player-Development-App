# ADR 004: JWT-Based Authentication

## Status

Accepted

## Context

We need to authenticate users across web and mobile clients. Options considered:

1. **Session cookies** - Server-side sessions
2. **JWT tokens** - Stateless tokens
3. **OAuth only** - Delegate to external provider

## Decision

Use **JWT tokens** for authentication with refresh token rotation.

## Rationale

1. **Stateless**: No server-side session storage needed
2. **Mobile-friendly**: Works well with native apps
3. **Scalable**: Any server can validate tokens
4. **Claims**: Embed user info (role, tenant) in token

## Implementation

### Token Structure

```typescript
// Access Token (15 min expiry)
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "player",
  "tenantId": "tenant-uuid",
  "iat": 1234567890,
  "exp": 1234568790
}

// Refresh Token (7 days expiry)
{
  "sub": "user-uuid",
  "type": "refresh",
  "iat": 1234567890,
  "exp": 1235172690
}
```

### Token Flow

```
1. Login → Access Token + Refresh Token
2. API calls → Access Token in Authorization header
3. Token expired → Use Refresh Token to get new pair
4. Refresh expired → Re-login required
```

### Security Measures

- **Short access token expiry**: 15 minutes
- **Refresh token rotation**: New refresh token on each use
- **Token blacklist**: Redis-based for logout
- **HTTPS only**: Tokens never sent over HTTP

## Consequences

### Positive

- Horizontal scaling without shared session state
- Works across web, iOS, Android
- Can include authorization claims
- No database lookup for validation

### Negative

- Cannot immediately revoke access tokens
- Token size larger than session ID
- Must handle refresh flow in all clients
- JWT secret must be protected

## References

- [JWT Best Practices (RFC 8725)](https://datatracker.ietf.org/doc/html/rfc8725)
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
