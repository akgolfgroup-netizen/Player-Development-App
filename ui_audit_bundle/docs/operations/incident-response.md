# Incident Response Playbook

## Overview

This playbook provides structured procedures for responding to production incidents in the IUP Golf Academy platform.

## Severity Levels

### P0 - Critical (Complete Outage)
- **Response Time:** Immediate (< 5 minutes)
- **Examples:** Service completely down, database unavailable, data loss
- **Team:** Full on-call team mobilized
- **Communication:** Real-time status updates

### P1 - High (Major Functionality Impaired)
- **Response Time:** < 15 minutes
- **Examples:** Login broken, critical API failures, payment processing down
- **Team:** Primary on-call + backup
- **Communication:** Updates every 30 minutes

### P2 - Medium (Degraded Performance)
- **Response Time:** < 1 hour
- **Examples:** Slow response times, intermittent errors, non-critical features down
- **Team:** Primary on-call
- **Communication:** Updates every 2 hours

### P3 - Low (Minor Issues)
- **Response Time:** < 4 hours
- **Examples:** UI glitches, cosmetic issues, non-urgent bugs
- **Team:** Next business day
- **Communication:** Daily updates if needed

---

## Incident Response Process

### Phase 1: Detection & Alert (0-5 minutes)

#### 1.1 Incident Detection

Incidents can be detected via:
- **Automated Monitoring:** Prometheus alerts, Sentry errors
- **User Reports:** Support tickets, social media
- **Internal Discovery:** Team members notice issues

#### 1.2 Initial Assessment

```bash
# Quick health check
curl https://api.iup-golf.com/health

# Check system status
ssh production-api-server
pm2 status
docker ps

# Review recent logs
pm2 logs api --lines 100 --err

# Check error tracking
# Open Sentry dashboard
```

#### 1.3 Determine Severity

Ask:
- How many users affected?
- What functionality is impacted?
- Is data at risk?
- Is there a workaround?

#### 1.4 Create Incident

```bash
# Create incident in PagerDuty
# Or use incident management tool

# Create Slack channel
/incident create #incident-2025-12-23-api-down

# Post initial status
Status: INVESTIGATING
Severity: P0
Impact: Complete service outage
Started: 2025-12-23 14:30 UTC
```

---

### Phase 2: Triage & Mobilization (5-15 minutes)

#### 2.1 Assign Incident Commander (IC)

**IC Responsibilities:**
- Own the incident end-to-end
- Coordinate response team
- Make final decisions
- Manage communications
- Declare incident resolved

#### 2.2 Assemble Response Team

For P0/P1 incidents:
- **Incident Commander:** Lead the response
- **Primary On-Call Engineer:** Hands-on troubleshooting
- **Backup Engineer:** Support and second pair of eyes
- **Communications Lead:** Handle stakeholder updates
- **CTO/Engineering Manager:** Executive oversight (for P0)

#### 2.3 Establish Communication Channels

```markdown
# Incident Slack Channel Template

**Incident:** API Complete Outage
**Severity:** P0
**Status:** INVESTIGATING
**IC:** @anders
**Started:** 2025-12-23 14:30 UTC

**Impact:**
- All API requests returning 503
- ~1000 users affected
- Web and mobile apps non-functional

**Current Actions:**
- @engineer1: Investigating application logs
- @engineer2: Checking database connectivity
- @comms: Updating status page

**Timeline:**
14:30 - Incident detected via monitoring alert
14:32 - IC assigned, team mobilized
14:35 - Initial triage in progress
```

#### 2.4 Update Status Page

```bash
# Update public status page
curl -X POST https://status.iup-golf.com/api/incidents \
  -H "Authorization: Bearer $STATUS_PAGE_TOKEN" \
  -d '{
    "name": "API Service Disruption",
    "status": "investigating",
    "impact": "major",
    "message": "We are investigating issues with our API service. Users may experience errors when accessing the application."
  }'
```

---

### Phase 3: Investigation & Diagnosis (15-60 minutes)

#### 3.1 Gather Information

**Check Application Logs:**
```bash
# SSH to production server
ssh production-api-server

# Check PM2 logs
pm2 logs api --lines 500 --err

# Check Nginx access logs
tail -n 100 /var/log/nginx/access.log

# Check Nginx error logs
tail -n 100 /var/log/nginx/error.log

# Check system logs
journalctl -u api -n 100
```

**Check Database:**
```bash
# Connect to database
psql $DATABASE_URL

# Check active connections
SELECT count(*) FROM pg_stat_activity;

# Check blocked queries
SELECT * FROM pg_stat_activity WHERE wait_event IS NOT NULL;

# Check database size
SELECT pg_size_pretty(pg_database_size('iup_golf'));

# Exit
\q
```

**Check Infrastructure:**
```bash
# CPU usage
top -n 1

# Memory usage
free -h

# Disk usage
df -h

# Network connectivity
ping 8.8.8.8
curl https://www.google.com

# DNS resolution
nslookup api.iup-golf.com
```

**Check External Dependencies:**
```bash
# Check Redis
redis-cli ping

# Check S3
aws s3 ls s3://iup-media/

# Check third-party APIs
curl https://api.external-service.com/health
```

#### 3.2 Review Recent Changes

```bash
# Check recent deployments
git log -5 --oneline

# Check recent database migrations
pnpm prisma migrate status

# Check recent configuration changes
git diff HEAD~5 .env.production

# Check infrastructure changes
terraform show
```

#### 3.3 Review Monitoring Data

**Sentry:**
- Filter errors by last 1 hour
- Group by error type
- Check affected users
- Review stack traces

**Prometheus/Grafana:**
- Check request rate (spike or drop?)
- Check error rate (sudden increase?)
- Check response time (timeout?)
- Check database query time
- Check memory/CPU usage

**Application Metrics:**
```bash
# Check metrics endpoint
curl https://api.iup-golf.com/metrics | grep -E "(http_requests|http_errors|process_memory)"
```

#### 3.4 Form Hypothesis

Based on data gathered:
1. What changed recently?
2. What are the symptoms?
3. What could cause these symptoms?
4. What's the most likely root cause?

---

### Phase 4: Mitigation & Resolution (Variable)

#### 4.1 Common Incident Scenarios

##### Scenario A: Application Crash Loop

**Symptoms:**
- PM2 shows app restarting repeatedly
- Errors in startup logs

**Diagnosis:**
```bash
pm2 logs api --lines 100 --err
```

**Resolution:**
```bash
# If due to bad deployment
git revert HEAD
pnpm install --frozen-lockfile
pnpm build
pm2 restart api

# If due to configuration
vim .env.production
pm2 restart api

# If due to dependency issue
pnpm install --frozen-lockfile
pnpm build
pm2 restart api
```

##### Scenario B: Database Connection Pool Exhausted

**Symptoms:**
- "Too many connections" errors
- Timeouts on database queries

**Diagnosis:**
```bash
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"
```

**Resolution:**
```bash
# Kill idle connections
psql $DATABASE_URL -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle' AND state_change < NOW() - INTERVAL '5 minutes';"

# Restart application to reset pool
pm2 restart api

# Increase pool size (if necessary)
vim .env.production
# DATABASE_POOL_SIZE=20
pm2 restart api
```

##### Scenario C: Memory Leak

**Symptoms:**
- Gradual memory increase
- OOM errors
- Slow response times

**Diagnosis:**
```bash
# Check memory usage
free -h
pm2 info api

# Check heap usage
node --expose-gc --inspect dist/server.js
```

**Resolution:**
```bash
# Immediate: Restart application
pm2 restart api

# Short-term: Increase memory limit
pm2 delete api
pm2 start dist/server.js --name api --max-memory-restart 2G

# Long-term: Fix memory leak in code
# Add heap profiling
# Analyze with Chrome DevTools
```

##### Scenario D: Third-Party API Down

**Symptoms:**
- Timeouts on specific endpoints
- External API errors in logs

**Diagnosis:**
```bash
# Test external API
curl https://api.external-service.com/health

# Check service status page
```

**Resolution:**
```bash
# Enable circuit breaker (if implemented)
# Or disable feature temporarily

# Update environment variable
export FEATURE_EXTERNAL_API_ENABLED=false
pm2 restart api

# Notify users about limited functionality
```

##### Scenario E: Disk Full

**Symptoms:**
- "No space left on device" errors
- Application can't write logs

**Diagnosis:**
```bash
df -h
du -sh /var/log/* | sort -h
```

**Resolution:**
```bash
# Clean up old logs
find /var/log -name "*.log" -type f -mtime +7 -delete
find /tmp -type f -mtime +1 -delete

# Rotate logs
logrotate -f /etc/logrotate.conf

# Clear Docker images (if applicable)
docker system prune -a

# Restart application
pm2 restart api
```

##### Scenario F: DDoS Attack

**Symptoms:**
- Massive spike in traffic
- Legitimate requests timing out
- High CPU/memory usage

**Diagnosis:**
```bash
# Check request rate
tail -n 1000 /var/log/nginx/access.log | cut -d' ' -f1 | sort | uniq -c | sort -rn | head -20

# Check active connections
netstat -an | grep :80 | wc -l
```

**Resolution:**
```bash
# Enable rate limiting
# Update Nginx config
sudo vim /etc/nginx/nginx.conf
# Add: limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
sudo nginx -t
sudo systemctl reload nginx

# Enable Cloudflare "I'm Under Attack" mode
# Or update firewall rules

# Block malicious IPs
sudo iptables -A INPUT -s MALICIOUS_IP -j DROP
```

#### 4.2 Escalation Criteria

Escalate to next level if:
- Unable to resolve within expected timeframe
- Incident severity increases
- Need specialized expertise
- Risk of data loss

---

### Phase 5: Communication (Ongoing)

#### 5.1 Internal Communication

**Slack Updates (every 15-30 minutes for P0/P1):**
```markdown
**UPDATE - 15:00 UTC**
Status: INVESTIGATING
Progress: Identified database connection issue
Actions: Restarting connection pool
ETA: 15 minutes
```

#### 5.2 External Communication

**Status Page Updates:**
```bash
curl -X PATCH https://status.iup-golf.com/api/incidents/latest \
  -d "status=identified" \
  -d "message=We have identified the issue and are working on a fix. Expected resolution time: 15 minutes."
```

**Email/SMS (for P0 incidents lasting > 30 minutes):**
```markdown
Subject: [INCIDENT] IUP Golf Academy Service Disruption

Dear Customers,

We are currently experiencing service disruption affecting our platform.

Impact: All users unable to access the application
Start Time: 14:30 UTC
Current Status: We have identified the root cause and are implementing a fix
Expected Resolution: 15:15 UTC

We apologize for the inconvenience and will provide updates every 30 minutes.

Best regards,
IUP Golf Academy Team
```

---

### Phase 6: Recovery & Verification (30-60 minutes)

#### 6.1 Implement Fix

```bash
# Apply the fix
# (specific commands depend on incident)

# Restart application
pm2 restart api

# Wait for application to stabilize
sleep 30
```

#### 6.2 Verify Resolution

**Automated Checks:**
```bash
# Health check
curl https://api.iup-golf.com/health

# Test key endpoints
./scripts/smoke-tests.sh

# Check metrics
curl https://api.iup-golf.com/metrics | grep http_errors_total

# Check error rate in Sentry
```

**Manual Verification:**
```bash
# Test user flows:
1. User registration
2. User login
3. Create player
4. Fetch player list
5. Create exercise
6. Book session
```

#### 6.3 Monitor for Stability

**Watch for 15-30 minutes:**
- Error rates return to normal
- Response times within SLA
- No new alerts firing
- User reports stop coming in

---

### Phase 7: Resolution & Post-Incident

#### 7.1 Declare Incident Resolved

```markdown
**RESOLVED - 15:30 UTC**

The incident has been resolved. All services are operating normally.

Root Cause: Database connection pool exhausted due to long-running queries
Fix Applied: Killed idle connections and increased pool size
Duration: 60 minutes
Users Affected: ~1000

We will be conducting a post-mortem and implementing measures to prevent recurrence.
```

#### 7.2 Update Status Page

```bash
curl -X PATCH https://status.iup-golf.com/api/incidents/latest \
  -d "status=resolved" \
  -d "message=The incident has been resolved. All services are operating normally. We apologize for the disruption."
```

#### 7.3 Send Resolution Communication

```markdown
Subject: [RESOLVED] IUP Golf Academy Service Restored

Dear Customers,

Our service has been fully restored and is operating normally.

Incident Duration: 14:30 - 15:30 UTC (60 minutes)
Root Cause: Database connection issue
Users Affected: ~1000

We have implemented a fix and are monitoring closely. We apologize for the inconvenience and are taking steps to prevent similar issues in the future.

If you continue to experience any issues, please contact support@iup-golf.com.

Best regards,
IUP Golf Academy Team
```

#### 7.4 Document Timeline

Create incident timeline in documentation:

```markdown
# Incident Timeline: 2025-12-23 API Outage

## Overview
- **Severity:** P0
- **Duration:** 60 minutes
- **Users Affected:** ~1000
- **Root Cause:** Database connection pool exhausted

## Timeline

**14:30** - Incident detected via monitoring alert
**14:32** - IC assigned (@anders), team mobilized
**14:35** - Initial triage: all API requests returning 503
**14:40** - Identified database connection pool exhausted
**14:45** - Killed idle database connections
**14:50** - Increased connection pool size
**14:55** - Restarted application
**15:00** - Services restored, monitoring for stability
**15:30** - Incident declared resolved

## Actions Taken
1. Killed idle database connections
2. Increased DATABASE_POOL_SIZE from 10 to 20
3. Restarted application
4. Monitored for 30 minutes

## Root Cause
A series of long-running analytical queries exhausted the database connection pool, preventing new connections from being established.

## Impact
- All API endpoints returned 503 errors
- Web and mobile applications non-functional
- ~1000 active users affected
- No data loss

## Prevention
- Implement query timeout limits
- Add connection pool monitoring alerts
- Separate analytical queries to read replica
- Schedule post-mortem meeting
```

---

### Phase 8: Post-Mortem (Within 48 hours)

#### 8.1 Schedule Post-Mortem Meeting

**Attendees:**
- Incident Commander
- Response team members
- Engineering Manager
- Product Manager
- CTO (for P0/P1)

**Agenda:**
1. Review timeline
2. Discuss what went well
3. Discuss what could be improved
4. Identify root causes
5. Create action items

#### 8.2 Post-Mortem Template

```markdown
# Post-Mortem: API Outage - 2025-12-23

## Incident Summary
- **Date:** 2025-12-23
- **Duration:** 60 minutes (14:30 - 15:30 UTC)
- **Severity:** P0
- **Users Affected:** ~1000
- **Data Loss:** None

## What Happened
A series of long-running analytical queries exhausted the database connection pool, preventing new connections from being established. This caused all API endpoints to return 503 errors, making the entire application non-functional.

## Root Cause Analysis

### Immediate Cause
Database connection pool exhausted (all 10 connections in use)

### Contributing Factors
1. No query timeout configured
2. No connection pool monitoring
3. Analytical queries running on primary database
4. Connection pool size too small for load

### Root Cause
Lack of query performance monitoring and connection pool sizing

## What Went Well
1. Incident detected within 2 minutes via monitoring
2. Team mobilized quickly
3. Root cause identified within 15 minutes
4. Communication was clear and timely
5. Fix implemented without data loss

## What Could Be Improved
1. Earlier detection of slow queries
2. Automated alerting on connection pool usage
3. Better separation of analytical vs transactional workloads
4. Documented playbook for this scenario
5. Faster communication to users

## Action Items

| Action | Owner | Priority | Due Date | Status |
|--------|-------|----------|----------|--------|
| Implement query timeout (30s) | @engineer1 | P0 | 2025-12-24 | TODO |
| Add connection pool monitoring | @engineer1 | P0 | 2025-12-24 | TODO |
| Increase pool size to 50 | @engineer1 | P0 | 2025-12-23 | DONE |
| Set up read replica for analytics | @engineer2 | P1 | 2025-12-30 | TODO |
| Create database health dashboard | @engineer2 | P1 | 2025-12-30 | TODO |
| Add slow query logging | @engineer3 | P2 | 2026-01-05 | TODO |
| Update incident response playbook | @anders | P2 | 2025-12-27 | TODO |

## Lessons Learned
1. Connection pool monitoring is critical for database-backed apps
2. Separation of concerns: analytical queries should use read replicas
3. Query timeouts prevent resource exhaustion
4. Fast communication reduces user frustration
5. Regular load testing can identify capacity issues before they become incidents

## Follow-Up
- Review action items weekly until all completed
- Update monitoring and alerting strategy
- Schedule quarterly load testing
- Share learnings with team in next all-hands
```

---

## Incident Response Checklists

### P0 Incident Checklist

- [ ] **0-5 min:** Incident detected and IC assigned
- [ ] **5 min:** Team mobilized in Slack channel
- [ ] **5 min:** Status page updated to "Investigating"
- [ ] **10 min:** Initial triage completed
- [ ] **15 min:** Root cause hypothesis formed
- [ ] **30 min:** First status update to users
- [ ] **Variable:** Fix implemented
- [ ] **Post-fix:** Services verified operational
- [ ] **Post-fix + 15 min:** Incident declared resolved
- [ ] **Post-fix + 30 min:** Status page updated to "Resolved"
- [ ] **Post-fix + 1 hour:** Resolution email sent to users
- [ ] **Within 24 hours:** Incident timeline documented
- [ ] **Within 48 hours:** Post-mortem conducted
- [ ] **Within 1 week:** Action items assigned and tracked

---

## Emergency Contacts

### On-Call Engineers
- **Primary:** +47 XXX XX XXX (PagerDuty)
- **Backup:** +47 XXX XX XXX (PagerDuty)

### Leadership
- **Engineering Manager:** +47 XXX XX XXX
- **CTO:** +47 XXX XX XXX

### External Support
- **Database Admin:** support@database-provider.com
- **Cloud Provider:** support@aws.com
- **Hosting Support:** support@vercel.com

### Tools
- **PagerDuty:** https://iup-golf.pagerduty.com
- **Status Page:** https://status.iup-golf.com/admin
- **Sentry:** https://sentry.io/organizations/iup-golf
- **Grafana:** https://grafana.iup-golf.com

---

## Related Documentation

- [Database Migration Runbook](./database-migration.md)
- [Deployment Guide](./deployment.md)
- [Monitoring Guide](./monitoring.md)
- [Architecture Overview](../architecture/overview.md)

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2025-12-23 | Anders K | Initial playbook creation |
