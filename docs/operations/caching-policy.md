# Caching Policy

## Overview

This document defines the caching strategy for IUP Golf API and web application.

---

## Cache Headers by Resource Type

### Thumbnails (S3/CDN)

| Header | Value |
|--------|-------|
| Cache-Control | `public, max-age=31536000, immutable` |
| Content-Type | `image/jpeg` or `image/png` |

**Rationale**: Thumbnail keys are content-addressed (based on video ID). They never change once generated, making them safe for long-term caching.

### Video Playback URLs

| Header | Value |
|--------|-------|
| Cache-Control | `private, no-store` |

**Rationale**: Signed URLs contain time-limited authentication tokens. They must never be cached to prevent unauthorized access.

### API Endpoints

| Endpoint | Cache-Control | Rationale |
|----------|---------------|-----------|
| `GET /v1/videos` | `private, max-age=10, must-revalidate` | Short cache for list data, user-specific |
| `GET /v1/videos/:id` | `private, no-store` | Contains signed URL in response |
| `GET /v1/videos/:id/playback` | `private, no-store` | Signed URL response |
| `GET /v1/videos/:id/thumbnail` | `private, no-store` | Signed URL response |
| `GET /v1/notifications` | `private, no-store` | Real-time data, must be fresh |
| `GET /v1/notifications/stream` | N/A (SSE) | Streaming, no cache |
| `GET /v1/audit-logs` | `private, max-age=10, must-revalidate` | Short cache for audit data |
| `GET /health` | `public, max-age=30` | Health check, short cache |
| `GET /ready` | `no-store` | Readiness must be real-time |
| `GET /docs/*` | `public, max-age=86400` | OpenAPI docs, 1 day cache |

---

## Signed URL TTLs

| Resource Type | TTL | Notes |
|---------------|-----|-------|
| Video Playback | 10 minutes (600s) | Short for security, UI can refresh |
| Thumbnail | 24 hours (86400s) | Long for performance |
| Upload (presigned PUT) | 1 hour (3600s) | Upload window |

---

## CDN Recommendations

### Safe to Cache in CDN

- **Thumbnails**: Yes, cache aggressively
  - Path pattern: `/thumbnails/*` or S3 key pattern
  - TTL: 1 year (origin controls via Cache-Control)
  - Note: Use `Vary: Accept-Encoding` if serving webp variants

- **Static Assets**: Yes
  - Path pattern: `/static/*`, `/_next/static/*`
  - TTL: 1 year (immutable)

- **OpenAPI/Docs**: Yes
  - Path pattern: `/docs/*`, `/openapi/*`
  - TTL: 1 day

### NOT Safe to Cache in CDN

- **Signed Playback URLs**: Never cache
  - Contains auth tokens
  - Short-lived by design

- **API Responses**: Do not cache at CDN level
  - User-specific data
  - Auth-dependent responses
  - Use `private` directive to prevent CDN caching

- **Notifications**: Never cache
  - Real-time data

---

## Browser Cache Behavior

### Images (Thumbnails)

```html
<img
  src={thumbnailUrl}
  loading="lazy"
  decoding="async"
  width="320"
  height="180"
/>
```

- Use `loading="lazy"` for off-screen images
- Use `decoding="async"` to avoid blocking main thread
- Set `width`/`height` to prevent layout shift

### API Data

- List endpoints: SWR/React Query with `staleTime: 10000` (10s)
- Single video: `staleTime: 0` (always refetch for fresh signed URL)
- Notifications: `staleTime: 0` with polling or SSE for real-time

---

## Implementation Checklist

- [ ] Cache headers middleware in API
- [ ] Signed URL TTL standardization
- [ ] Lazy loading in video cards
- [ ] CDN configuration (staging/production)

---

## Future Improvements

1. **Thumbnail Proxy Endpoint**: Add `GET /v1/videos/:id/thumb` that proxies S3 with long cache headers, avoiding signed URL generation for thumbnails.

2. **ETag Support**: Implement ETag/If-None-Match for video lists to reduce payload on unchanged data.

3. **Service Worker**: Cache thumbnails in service worker for offline support.

