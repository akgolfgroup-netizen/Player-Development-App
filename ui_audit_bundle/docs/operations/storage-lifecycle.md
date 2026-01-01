# Storage Lifecycle Management

## Overview

This document describes storage lifecycle policies for IUP Golf Academy video assets.

---

## Storage Layout

```
tenants/{tenantId}/videos/{playerId}/{timestamp}-{filename}     # Original video
tenants/{tenantId}/videos/{playerId}/thumbnails/{filename}.jpg  # Thumbnail
videos/{videoId}/hls/master.m3u8                                # HLS manifest
videos/{videoId}/hls/360p/index.m3u8                            # Variant playlist
videos/{videoId}/hls/360p/segment*.ts                           # Segments
```

---

## Deletion Semantics

### Soft Delete (Archive)

- Sets `archivedAt` in database
- Video hidden from lists
- Storage assets preserved
- Player/coach can no longer access via API
- Recoverable by clearing `archivedAt`

### Hard Delete

- Sets `deletedAt` in database
- Deletes all storage assets:
  - Original video (mp4)
  - Thumbnail (jpg)
  - HLS manifest and segments (all files under prefix)
- Not recoverable

---

## Recommended S3 Lifecycle Rules

### 1. Abort Incomplete Multipart Uploads

```json
{
  "Rules": [
    {
      "ID": "AbortIncompleteMultipartUpload",
      "Status": "Enabled",
      "Filter": {},
      "AbortIncompleteMultipartUpload": {
        "DaysAfterInitiation": 7
      }
    }
  ]
}
```

**Rationale**: Failed uploads leave partial data. Clean up after 7 days.

### 2. Delete Temporary Objects

```json
{
  "Rules": [
    {
      "ID": "DeleteTempAfter30Days",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "temp/"
      },
      "Expiration": {
        "Days": 30
      }
    }
  ]
}
```

### 3. Transition to Infrequent Access (Optional)

For cost optimization on rarely accessed videos:

```json
{
  "Rules": [
    {
      "ID": "TransitionToIA",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "tenants/"
      },
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "STANDARD_IA"
        }
      ]
    }
  ]
}
```

**Note**: Only enable if videos are rarely re-accessed after 90 days.

### 4. Deep Archive (Very Old Content)

```json
{
  "Rules": [
    {
      "ID": "ArchiveOldVideos",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "tenants/"
      },
      "Transitions": [
        {
          "Days": 365,
          "StorageClass": "GLACIER_IR"
        }
      ]
    }
  ]
}
```

---

## Orphan Cleanup Job

### What is an Orphan?

1. Storage objects where `videoId` doesn't exist in database
2. Videos with `deletedAt` older than retention period

### Running Cleanup

```bash
# Dry run (log only, no deletions)
CLEANUP_DRY_RUN=true npx tsx src/jobs/cleanupOrphanedAssets.ts

# Actual cleanup
npx tsx src/jobs/cleanupOrphanedAssets.ts
```

### Recommended Schedule

- Weekly cron: `0 3 * * 0` (Sunday 3am)
- Or manual after bulk operations

---

## Retention Policy

| Asset Type | Default Retention | Configurable |
|------------|------------------|--------------|
| Archived videos | 90 days | Per-video `retentionDays` |
| Deleted videos (DB) | 30 days | - |
| Storage (after hard delete) | Immediate | - |
| Thumbnails | Same as video | - |
| HLS segments | Same as video | - |

---

## Cost Optimization Tips

1. **Enable lifecycle rules** for old content transition
2. **Use hard delete** when data is no longer needed
3. **Monitor storage growth** via S3 metrics
4. **Clean orphans regularly** to avoid bloat
5. **Consider Intelligent-Tiering** for unpredictable access patterns

---

## Implementation Checklist

- [x] Soft delete (archivedAt)
- [x] Hard delete with storage cleanup
- [x] deletePrefix for batch deletion
- [x] deleteVideoAssets helper
- [x] Orphan cleanup job
- [ ] Cron scheduling (external)

