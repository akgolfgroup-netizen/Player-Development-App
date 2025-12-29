# Backend Performance Considerations

## Database Indexes

### Video Table

| Index | Columns | Purpose |
|-------|---------|---------|
| `Video_tenantId_deletedAt_createdAt_idx` | `tenantId, deletedAt, createdAt DESC` | Active videos list query (soft-delete filter + sort) |
| `Video_status_createdAt_idx` | `status, createdAt DESC` | Worker queue processing |
| `Video_playerId_idx` | `playerId` | Player video lookup |

### VideoShare Table

| Index | Columns | Purpose |
|-------|---------|---------|
| `VideoShare_videoId_playerId_idx` | `videoId, playerId` | Share existence check |
| `VideoShare_playerId_idx` | `playerId` | Find shares by player |

### Notification Table

| Index | Columns | Purpose |
|-------|---------|---------|
| `Notification_recipientId_readAt_createdAt_idx` | `recipientId, readAt, createdAt DESC` | Unread notifications list |
| `Notification_recipientId_createdAt_idx` | `recipientId, createdAt DESC` | All notifications list |

---

## Pagination Strategy

### Cursor-based Pagination (Recommended)

Used for notifications endpoint. Provides stable pagination even when new items are added.

```typescript
// Request
GET /api/v1/notifications?limit=20&cursor=abc123

// Response
{
  "data": {
    "notifications": [...],
    "unreadCount": 5,
    "nextCursor": "def456"  // null if no more pages
  }
}
```

**Advantages:**
- Stable results when new items are added
- More efficient for large datasets
- No "skipped items" problem

### Offset-based Pagination

Used for video and comment lists. Simpler but can skip items if new data is added between requests.

```typescript
// Request
GET /api/v1/videos?limit=20&offset=40

// Response
{
  "videos": [...],
  "total": 150,
  "limit": 20,
  "offset": 40
}
```

---

## Query Optimization Patterns

### N+1 Prevention

All list endpoints use Prisma `include` to fetch related data in a single query:

```typescript
// Good: Single query with includes
prisma.video.findMany({
  include: {
    player: { select: { firstName: true, lastName: true } },
  },
});

// Bad: N+1 (avoided in codebase)
const videos = await prisma.video.findMany();
for (const video of videos) {
  video.player = await prisma.player.findUnique({ where: { id: video.playerId } });
}
```

### Count Optimization

For reply counts on comments, we use `_count` instead of a separate query:

```typescript
prisma.videoComment.findMany({
  include: {
    _count: { select: { replies: true } },
  },
});
```

---

## Hotspot Endpoints

| Endpoint | Optimizations Applied |
|----------|----------------------|
| `GET /api/v1/videos` | Composite index on `(tenantId, deletedAt, createdAt)`, includes for player |
| `GET /api/v1/notifications` | Cursor pagination, composite index on `(recipientId, readAt, createdAt)` |
| `POST /api/v1/videos/:id/share` | Index on `(videoId, playerId)` for duplicate check |
| `GET /api/v1/comments/video/:id` | Includes for author, `_count` for replies |

---

## Environment-Specific Settings

### Development

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/iup_golf_dev"
```

### Production

```bash
# Connection pooling recommended
DATABASE_URL="postgresql://user:pass@db.example.com:5432/iup_golf?connection_limit=10"

# Optional: Read replicas for heavy read workloads
DATABASE_READ_URL="postgresql://user:pass@db-read.example.com:5432/iup_golf"
```

---

## Monitoring Recommendations

1. **Slow query logging**: Enable `log_min_duration_statement = 100` in PostgreSQL
2. **Index usage**: Monitor `pg_stat_user_indexes` for unused indexes
3. **Connection pool**: Watch for connection exhaustion during traffic spikes
4. **Cache hit ratio**: Target > 99% buffer cache hit ratio

