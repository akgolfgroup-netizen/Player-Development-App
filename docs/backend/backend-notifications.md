# Backend Notifications - Real-time Architecture

## Overview

Real-time notification system using Server-Sent Events (SSE) with Redis pub/sub for horizontal scaling.

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  API Node 1 │     │  API Node 2 │     │  API Node N │
│             │     │             │     │             │
│ SSE Handler │     │ SSE Handler │     │ SSE Handler │
│      │      │     │      │      │     │      │      │
│      ▼      │     │      ▼      │     │      ▼      │
│ Redis Sub   │◄────┼─────►│◄─────┼─────►│             │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌──────▼──────┐
                    │    Redis    │
                    │  Pub/Sub    │
                    └─────────────┘
```

---

## Deployment Modes

### Single Instance (Development)

Uses in-memory pub/sub. No Redis required.

```bash
# No special env vars needed
npm run dev
```

**Warning**: Notifications only work within the same process.

### Multi Instance (Production/Staging)

Requires Redis for cross-instance pub/sub.

```bash
# Required env vars
REDIS_URL=redis://localhost:6379/0
# OR
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=optional
REDIS_DB=0
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REDIS_URL` | No* | (computed) | Full Redis URL |
| `REDIS_HOST` | No* | `localhost` | Redis host |
| `REDIS_PORT` | No | `6379` | Redis port |
| `REDIS_PASSWORD` | No | (none) | Redis password |
| `REDIS_DB` | No | `0` | Redis database number |

*Either `REDIS_URL` or `REDIS_HOST` should be set for production.

---

## Channel Strategy

**Per-user channels**: `notifications:user:{userId}`

Each user has their own Redis channel. When a notification is published:
1. Message is published to `notifications:user:{targetUserId}`
2. Only SSE connections subscribed to that channel receive the message
3. No server-side filtering needed

**Payload format** (minimal, non-sensitive):
```json
{
  "id": "uuid",
  "type": "video_shared|comment_created|video_reviewed|...",
  "title": "Notification title",
  "body": "Optional message body",
  "entityType": "video|comment|session|goal|achievement",
  "entityId": "uuid",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "isRead": false
}
```

---

## API Endpoints

### SSE Stream

```
GET /api/v1/notifications/stream
```

**Auth**: Bearer token in header OR `?token=xxx` query param (for EventSource)

**Response**: Server-Sent Events stream

**Events**:
- `connected`: Initial connection confirmation
- `notification`: New notification payload
- `ping`: Keep-alive (every 25s)
- `error`: Connection error (non-sensitive)

### Stream Status

```
GET /api/v1/notifications/stream/status
```

**Response**:
```json
{
  "success": true,
  "data": {
    "mode": "redis|memory",
    "activeSubscriptions": 5,
    "redisAvailable": true
  }
}
```

---

## Frontend Integration

The frontend uses EventSource to connect to the SSE stream:

```javascript
const token = getAccessToken();
const apiUrl = process.env.REACT_APP_API_URL || '/api/v1';
const eventSource = new EventSource(`${apiUrl}/notifications/stream?token=${token}`);

eventSource.addEventListener('notification', (event) => {
  const notification = JSON.parse(event.data);
  // Handle notification
});

eventSource.addEventListener('ping', () => {
  // Connection alive
});

eventSource.onerror = () => {
  // Reconnect or fallback to polling
};
```

---

## Notification Types

| Type | Trigger | Target |
|------|---------|--------|
| `video_shared` | Coach shares video | Player |
| `video_reviewed` | Coach marks video reviewed | Player |
| `comment_created` | Coach comments on video | Player |

---

## Files

### Backend
- `src/services/redis/redisClient.ts` - Redis connection singleton
- `src/services/notifications/notificationBus.ts` - Unified pub/sub interface
- `src/services/notifications/redisNotificationBus.ts` - Redis implementation
- `src/services/notifications/inMemoryNotificationBus.ts` - In-memory fallback
- `src/services/notifications/notificationPublisher.ts` - Helper for publishing
- `src/api/v1/notifications/index.ts` - SSE endpoint

### Frontend
- `src/contexts/NotificationContext.jsx` - SSE connection and state

---

## Limitations

1. **In-memory mode**: Does not work across API instances. Use for local dev only.
2. **No message persistence**: If user is offline, they miss SSE events. They'll see notifications on next fetch.
3. **Token in URL**: EventSource doesn't support headers, so token is passed in query. Use HTTPS.

---

## Future Improvements

1. **Redis Streams**: For message persistence and replay
2. **WebSocket upgrade**: For bidirectional communication
3. **Push notifications**: For mobile/offline users
