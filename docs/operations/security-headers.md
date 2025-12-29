# Security Headers Audit

API security headers configuration and best practices.

---

## Current Configuration

### Helmet Security Headers

Located in: `apps/api/src/plugins/helmet.ts`

| Header | Value | Notes |
|--------|-------|-------|
| Content-Security-Policy | See below | Strict in prod, lenient in dev |
| X-Frame-Options | DENY | Prevents clickjacking |
| X-Content-Type-Options | nosniff | Prevents MIME sniffing |
| X-XSS-Protection | 1; mode=block | XSS filter enabled |
| Referrer-Policy | strict-origin-when-cross-origin | Privacy-preserving |
| HSTS | max-age=31536000; includeSubDomains; preload | Production only |
| Cross-Origin-Resource-Policy | cross-origin | Allows cross-origin access |

### Content Security Policy (Production)

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https: <S3_ENDPOINT>;
connect-src 'self' <FRONTEND_URL> <S3_ENDPOINT>;
font-src 'self' data:;
object-src 'none';
media-src 'self' <S3_ENDPOINT>;
frame-src 'none';
```

**Dynamic values:**
- `<S3_ENDPOINT>`: From `S3_ENDPOINT` env var (default: `https://s3.eu-north-1.amazonaws.com`)
- `<FRONTEND_URL>`: From `FRONTEND_URL` env var (default: `http://localhost:3001`)

### CSP (Development)

More permissive to support Swagger UI and hot reload:
- `script-src`: Adds `'unsafe-inline'`, `'unsafe-eval'`
- `frame-src`: `'self'` (for Swagger)

---

## CORS Configuration

Located in: `apps/api/src/plugins/cors.ts`

| Setting | Value |
|---------|-------|
| Origin | From `CORS_ORIGIN` env var |
| Credentials | true |
| Methods | GET, POST, PUT, PATCH, DELETE, OPTIONS |
| Max Age | 86400 (24 hours) |

**Allowed Headers:**
- Content-Type
- Authorization
- X-Requested-With
- X-Tenant-ID

**Exposed Headers:**
- X-Total-Count
- X-Page-Count
- X-Page
- X-Per-Page

---

## Rate Limiting

Located in: `apps/api/src/plugins/rate-limit.ts`

| Endpoint Type | Max Requests | Time Window |
|---------------|--------------|-------------|
| Default | 100 | 1 minute |
| Auth (login/register) | 5 | 1 minute |
| Heavy (reports/exports) | 10 | 1 minute |
| Write operations | 30 | 1 minute |
| Search/query | 50 | 1 minute |

**Key generation:**
- Authenticated: `user:<userId>`
- Unauthenticated: `ip:<clientIP>`

**Skip list:**
- `/health`
- `/ws/stats`

---

## Staging Checklist

Before deploying to staging, verify:

- [ ] `CORS_ORIGIN` includes staging frontend URL
- [ ] `S3_ENDPOINT` is set for media/video access
- [ ] `FRONTEND_URL` set for CSP connect-src
- [ ] Rate limits appropriate for staging traffic
- [ ] HSTS enabled (production mode)

---

## Testing Security Headers

```bash
# Check response headers
curl -I https://api-staging.akgolf.no/health

# Expected headers:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Content-Security-Policy: ...
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

---

## Known Limitations

1. **`'unsafe-inline'` for styles**: Required for inline CSS. Consider extracting to external stylesheets for stricter CSP.

2. **No CSP nonces/hashes**: Would improve security but requires build-time integration.

3. **Rate limiting is in-memory**: Doesn't persist across restarts or scale horizontally. Consider Redis for production.

---

## Recommendations for Production

1. **Add CSP report-uri**: Collect CSP violation reports
   ```
   report-uri https://api.akgolf.no/csp-report
   ```

2. **Consider stricter script-src**: Use nonces instead of `'unsafe-inline'` if possible

3. **Enable Permissions-Policy**: Control browser features
   ```
   Permissions-Policy: geolocation=(), microphone=(), camera=()
   ```

4. **Add Cross-Origin-Opener-Policy**: Additional isolation
   ```
   Cross-Origin-Opener-Policy: same-origin
   ```

---

## Version History

| Date | Change |
|------|--------|
| 2025-12-26 | Initial audit, fixed CSP to include S3 endpoint |
