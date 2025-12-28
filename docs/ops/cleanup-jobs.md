# Cleanup Jobs Runbook

## Overview

This document describes operational procedures for the orphan cleanup job that removes orphaned storage assets and expired deleted videos.

---

## Job: `cleanupOrphanedAssets.ts`

### What It Does

1. **Finds orphaned HLS assets**: Storage objects under `videos/{videoId}/hls/` where the videoId doesn't exist in the database
2. **Finds expired deleted videos**: Videos with `deletedAt` older than retention period (default: 30 days)
3. **Cleans up**: Deletes storage objects and database records

### When to Run

| Environment | Schedule | Recommendation |
|-------------|----------|----------------|
| Production | Weekly | Sunday 3:00 AM UTC |
| Staging | Weekly | Sunday 4:00 AM UTC |
| Development | Manual | After bulk test operations |

---

## Running the Job

### Dry Run (Safe Preview)

Always run a dry-run first to see what would be deleted:

```bash
# Development/Staging
CLEANUP_DRY_RUN=true npx tsx src/jobs/cleanupOrphanedAssets.ts

# Production (explicit dry-run)
NODE_ENV=production CLEANUP_DRY_RUN=true npx tsx src/jobs/cleanupOrphanedAssets.ts
```

### Live Cleanup

```bash
# Development/Staging
CLEANUP_DRY_RUN=false npx tsx src/jobs/cleanupOrphanedAssets.ts

# Production (MUST set CLEANUP_DRY_RUN=false explicitly)
NODE_ENV=production CLEANUP_DRY_RUN=false npx tsx src/jobs/cleanupOrphanedAssets.ts
```

### Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `CLEANUP_DRY_RUN` | `true` | Set to `false` to perform actual deletions |
| `DELETED_RETENTION_DAYS` | `30` | Days before deleted videos are purged |
| `NODE_ENV` | `development` | Environment (affects safety guards) |

---

## Exit Codes

| Code | Meaning | Action |
|------|---------|--------|
| `0` | Success | No action needed |
| `1` | Partial/critical failure | Check logs for `[CLEANUP_JOB_ERROR]` |
| `2` | Safety guard triggered | Fix configuration, re-run |

---

## Verifying Output

### Check Logs

Look for these log prefixes:

```
[CLEANUP_JOB]        - Informational messages
[CLEANUP_JOB_ERROR]  - Errors (triggers alerting)
```

### JSON Summary

Each run outputs a JSON summary line for log aggregation:

```
[CLEANUP_JOB] JSON_SUMMARY: {"job":"cleanup_orphaned_assets","mode":"dry_run",...}
```

### Verify No Unintended Deletions

1. Run dry-run first
2. Check `orphanedPrefixes` and `expiredVideos` counts
3. Verify listed video IDs are expected to be orphaned/deleted
4. Only then run with `CLEANUP_DRY_RUN=false`

---

## Stopping/Disabling the Job

### Immediate Stop

Kill the process:

```bash
# Find and kill
ps aux | grep cleanupOrphanedAssets
kill <PID>
```

### Disable Scheduled Runs

- **Cron**: Comment out or remove the cron entry
- **GitHub Actions**: Set `if: false` or delete the workflow
- **Cloud Scheduler**: Pause or delete the job

---

## Troubleshooting

### Safety Guard Triggered (Exit 2)

```
[CLEANUP_JOB_ERROR] Production safety guard triggered!
```

**Cause**: Running in production without explicit `CLEANUP_DRY_RUN` value.

**Fix**: Set `CLEANUP_DRY_RUN=true` for dry-run or `CLEANUP_DRY_RUN=false` for real cleanup.

### S3 Connection Errors

```
[CLEANUP_JOB_ERROR] Failed to find orphaned HLS: ...
```

**Check**:
- S3 credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
- S3 endpoint and bucket configuration
- Network connectivity

### Database Connection Errors

**Check**:
- `DATABASE_URL` environment variable
- Database availability
- Connection limits

---

## Worst-Case Recovery

### If Data Was Accidentally Deleted

Storage objects deleted by this job **cannot be recovered** unless:

1. **S3 Versioning is enabled**: Restore previous versions
2. **S3 Cross-Region Replication**: Restore from replica bucket
3. **Backups**: Restore from external backups

### Preventive Measures

1. Always run dry-run first
2. Keep S3 versioning enabled (recommended)
3. Review the output before running live cleanup
4. Limit batch size if unsure

---

## Cron Examples

### Linux Cron

```bash
# Edit crontab
crontab -e

# Add entry (Sunday 3:00 AM UTC)
0 3 * * 0 cd /path/to/apps/api && NODE_ENV=production CLEANUP_DRY_RUN=false npx tsx src/jobs/cleanupOrphanedAssets.ts >> /var/log/cleanup-job.log 2>&1
```

### GitHub Actions (Scheduled Workflow)

```yaml
# .github/workflows/cleanup-job.yml
name: Orphan Cleanup Job

on:
  schedule:
    # Sunday 3:00 AM UTC
    - cron: '0 3 * * 0'
  workflow_dispatch:
    inputs:
      dry_run:
        description: 'Run in dry-run mode'
        required: true
        default: 'true'
        type: choice
        options:
          - 'true'
          - 'false'

jobs:
  cleanup:
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        working-directory: apps/api
        run: npm ci

      - name: Run cleanup job
        working-directory: apps/api
        env:
          NODE_ENV: production
          CLEANUP_DRY_RUN: ${{ github.event.inputs.dry_run || 'false' }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          S3_BUCKET: ${{ secrets.S3_BUCKET }}
          S3_REGION: ${{ secrets.S3_REGION }}
        run: npx tsx src/jobs/cleanupOrphanedAssets.ts
```

### Google Cloud Scheduler

```bash
# Create Cloud Scheduler job
gcloud scheduler jobs create http cleanup-orphaned-assets \
  --schedule="0 3 * * 0" \
  --uri="https://your-cloud-run-service.run.app/jobs/cleanup" \
  --http-method=POST \
  --headers="Authorization=Bearer $(gcloud auth print-identity-token)" \
  --time-zone="UTC"
```

### Render.com Cron Job

```yaml
# render.yaml
services:
  - type: cron
    name: cleanup-orphaned-assets
    schedule: "0 3 * * 0"
    buildCommand: npm ci
    startCommand: NODE_ENV=production CLEANUP_DRY_RUN=false npx tsx src/jobs/cleanupOrphanedAssets.ts
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: iup-golf-db
          property: connectionString
```

### Fly.io (fly.toml)

```toml
# In fly.toml, use fly machines for scheduled jobs
# Or use external scheduler like GitHub Actions

# Manual run via fly ssh:
# fly ssh console -a your-app
# NODE_ENV=production CLEANUP_DRY_RUN=false npx tsx src/jobs/cleanupOrphanedAssets.ts
```

---

## Monitoring Integration

### Log-Based Alerts

Set up alerts for log patterns:

| Pattern | Alert Level | Action |
|---------|-------------|--------|
| `[CLEANUP_JOB_ERROR]` | Warning | Investigate errors |
| `"errorCount":[1-9]` | Warning | Check partial failures |
| `"success":false` | Critical | Investigate and re-run |
| Exit code `2` | Critical | Fix configuration |

### Metrics to Track

- `cleanup_job_duration_ms` - Job duration
- `cleanup_job_orphans_found` - Orphaned prefixes found
- `cleanup_job_expired_found` - Expired videos found
- `cleanup_job_objects_deleted` - Storage objects deleted
- `cleanup_job_errors` - Error count

---

## Checklist: Before Running in Production

- [ ] Run dry-run first and review output
- [ ] Verify S3 versioning is enabled (for recovery)
- [ ] Confirm `DELETED_RETENTION_DAYS` is appropriate
- [ ] Ensure database backup exists
- [ ] Notify team if running manually during business hours
- [ ] Monitor logs after completion
