# Monitoring & Observability Guide

## Overview

This guide covers monitoring, observability, and alerting for the IUP Golf platform. It provides instructions for setting up dashboards, understanding metrics, and responding to alerts.

## Table of Contents

1. [Monitoring Stack](#monitoring-stack)
2. [Metrics & KPIs](#metrics--kpis)
3. [Dashboard Setup](#dashboard-setup)
4. [Alert Configuration](#alert-configuration)
5. [Log Management](#log-management)
6. [Tracing & Profiling](#tracing--profiling)
7. [Troubleshooting](#troubleshooting)

---

## Monitoring Stack

### Components

```
┌─────────────────────────────────────────────────────────┐
│                     Application                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Metrics   │  │    Logs     │  │   Traces    │    │
│  │  (Prom)     │  │   (Pino)    │  │  (Sentry)   │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
└─────────┼─────────────────┼─────────────────┼──────────┘
          │                 │                 │
          │                 │                 │
    ┌─────▼──────┐   ┌──────▼──────┐  ┌──────▼──────┐
    │ Prometheus │   │  Loki/ELK   │  │   Sentry    │
    │  (Metrics) │   │   (Logs)    │  │   (APM)     │
    └─────┬──────┘   └──────┬──────┘  └──────┬──────┘
          │                 │                 │
          └────────┬────────┴─────────────────┘
                   │
            ┌──────▼──────┐
            │   Grafana   │
            │ (Dashboard) │
            └─────────────┘
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Metrics | Prometheus | Time-series metrics collection |
| Logs | Pino + Loki/ELK | Structured logging |
| APM | Sentry | Error tracking, performance monitoring |
| Dashboards | Grafana | Visualization and alerting |
| Uptime | UptimeRobot | External monitoring |

---

## Metrics & KPIs

### Application Metrics

#### HTTP Metrics

```promql
# Request rate
rate(http_requests_total[5m])

# Error rate
rate(http_errors_total[5m]) / rate(http_requests_total[5m])

# Request duration (p95)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Request duration (p99)
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
```

#### Database Metrics

```promql
# Query duration (p95)
histogram_quantile(0.95, rate(db_query_duration_seconds_bucket[5m]))

# Connection pool usage
db_connection_pool_active / db_connection_pool_max

# Slow queries (> 1s)
rate(db_query_duration_seconds_bucket{le="1.0"}[5m])
```

#### Business Metrics

```promql
# Active users
active_users_total

# Sessions created per hour
rate(sessions_created_total[1h])

# Goals completed per day
rate(goals_completed_total[1d])

# Bookings per hour
rate(bookings_created_total[1h])
```

#### System Metrics

```promql
# CPU usage
process_cpu_usage_percent

# Memory usage
process_memory_usage_bytes{type="rss"} / process_memory_limit_bytes

# Heap usage
process_memory_usage_bytes{type="heapUsed"} / process_memory_usage_bytes{type="heapTotal"}

# Event loop lag
nodejs_eventloop_lag_seconds
```

### Key Performance Indicators (KPIs)

| KPI | Target | Alert Threshold |
|-----|--------|----------------|
| Error Rate | < 0.1% | > 1% |
| Response Time (p95) | < 200ms | > 500ms |
| Response Time (p99) | < 500ms | > 1000ms |
| Availability (uptime) | > 99.9% | < 99.5% |
| Database Query Time (p95) | < 100ms | > 500ms |
| API Requests/second | Variable | +/- 3 std dev |
| Active Users | Variable | Monitor trends |
| Memory Usage | < 80% | > 90% |
| CPU Usage | < 70% | > 85% |

---

## Dashboard Setup

### Grafana Installation

```bash
# Install Grafana
curl -s https://packages.grafana.com/gpg.key | sudo apt-key add -
echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee /etc/apt/sources.list.d/grafana.list
sudo apt update
sudo apt install grafana

# Start Grafana
sudo systemctl start grafana-server
sudo systemctl enable grafana-server

# Access Grafana
# http://localhost:3000
# Default login: admin/admin
```

### Add Prometheus Data Source

1. Navigate to Configuration > Data Sources
2. Click "Add data source"
3. Select "Prometheus"
4. Configure URL: `http://localhost:9090`
5. Click "Save & Test"

### Dashboard 1: Application Health

**Purpose:** High-level overview of application health

**Panels:**

1. **Request Rate (RPS)**
   ```promql
   sum(rate(http_requests_total[5m]))
   ```

2. **Error Rate (%)**
   ```promql
   sum(rate(http_errors_total[5m])) / sum(rate(http_requests_total[5m])) * 100
   ```

3. **Response Time (p95)**
   ```promql
   histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
   ```

4. **Active Users**
   ```promql
   active_users_total
   ```

5. **Uptime**
   ```promql
   process_uptime_seconds
   ```

6. **Memory Usage**
   ```promql
   process_memory_usage_bytes{type="rss"} / 1024 / 1024
   ```

### Dashboard 2: API Performance

**Purpose:** Detailed API endpoint performance

**Panels:**

1. **Requests by Endpoint**
   ```promql
   sum(rate(http_requests_total[5m])) by (route)
   ```

2. **Response Time by Endpoint**
   ```promql
   histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (route, le))
   ```

3. **Error Rate by Endpoint**
   ```promql
   sum(rate(http_errors_total[5m])) by (route)
   ```

4. **Slowest Endpoints (Top 10)**
   ```promql
   topk(10, sum(rate(http_request_duration_seconds_sum[5m])) by (route) / sum(rate(http_request_duration_seconds_count[5m])) by (route))
   ```

### Dashboard 3: Database Performance

**Purpose:** Database query performance and health

**Panels:**

1. **Query Duration (p95)**
   ```promql
   histogram_quantile(0.95, rate(db_query_duration_seconds_bucket[5m]))
   ```

2. **Slow Queries (> 1s)**
   ```promql
   sum(rate(db_query_duration_seconds_count[5m])) - sum(rate(db_query_duration_seconds_bucket{le="1.0"}[5m]))
   ```

3. **Connection Pool Usage**
   ```promql
   db_connection_pool_active
   ```

4. **Query Rate**
   ```promql
   rate(db_query_duration_seconds_count[5m])
   ```

### Dashboard 4: Business Metrics

**Purpose:** Business KPIs and user activity

**Panels:**

1. **New Users Today**
   ```promql
   increase(users_created_total[1d])
   ```

2. **Active Sessions**
   ```promql
   active_sessions_total
   ```

3. **Bookings per Hour**
   ```promql
   rate(bookings_created_total[1h])
   ```

4. **Goals Progress**
   ```promql
   sum(goals_in_progress_total) / sum(goals_total) * 100
   ```

5. **Average Session Duration**
   ```promql
   avg(session_duration_seconds)
   ```

### Dashboard 5: System Resources

**Purpose:** Infrastructure health and capacity

**Panels:**

1. **CPU Usage**
   ```promql
   process_cpu_usage_percent
   ```

2. **Memory Usage**
   ```promql
   process_memory_usage_bytes{type="rss"} / process_memory_limit_bytes * 100
   ```

3. **Event Loop Lag**
   ```promql
   nodejs_eventloop_lag_seconds
   ```

4. **Garbage Collection**
   ```promql
   rate(nodejs_gc_duration_seconds_sum[5m])
   ```

5. **Disk Usage**
   ```promql
   disk_usage_percent
   ```

### Export Dashboard JSON

```bash
# Save dashboard configuration
curl -H "Authorization: Bearer $GRAFANA_API_KEY" \
  http://localhost:3000/api/dashboards/uid/dashboard-id \
  > dashboard.json

# Import dashboard
curl -X POST \
  -H "Authorization: Bearer $GRAFANA_API_KEY" \
  -H "Content-Type: application/json" \
  -d @dashboard.json \
  http://localhost:3000/api/dashboards/db
```

---

## Alert Configuration

### Alert Rules

#### 1. High Error Rate

```yaml
# prometheus/alerts/error-rate.yml
groups:
  - name: error-rate
    interval: 1m
    rules:
      - alert: HighErrorRate
        expr: |
          (sum(rate(http_errors_total[5m])) / sum(rate(http_requests_total[5m]))) * 100 > 1
        for: 5m
        labels:
          severity: critical
          component: api
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }}% (threshold: 1%)"
```

#### 2. Slow Response Time

```yaml
# prometheus/alerts/response-time.yml
groups:
  - name: response-time
    interval: 1m
    rules:
      - alert: SlowResponseTime
        expr: |
          histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
          component: api
        annotations:
          summary: "Slow API response time"
          description: "P95 response time is {{ $value }}s (threshold: 0.5s)"
```

#### 3. High Memory Usage

```yaml
# prometheus/alerts/memory.yml
groups:
  - name: memory
    interval: 1m
    rules:
      - alert: HighMemoryUsage
        expr: |
          (process_memory_usage_bytes{type="rss"} / process_memory_limit_bytes) * 100 > 90
        for: 5m
        labels:
          severity: warning
          component: system
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value }}% (threshold: 90%)"
```

#### 4. Database Connection Pool Exhausted

```yaml
# prometheus/alerts/database.yml
groups:
  - name: database
    interval: 1m
    rules:
      - alert: DatabaseConnectionPoolExhausted
        expr: |
          db_connection_pool_active / db_connection_pool_max > 0.9
        for: 2m
        labels:
          severity: critical
          component: database
        annotations:
          summary: "Database connection pool nearly exhausted"
          description: "Connection pool usage is {{ $value }}% (threshold: 90%)"
```

#### 5. API Down

```yaml
# prometheus/alerts/uptime.yml
groups:
  - name: uptime
    interval: 30s
    rules:
      - alert: APIDown
        expr: |
          up{job="api"} == 0
        for: 1m
        labels:
          severity: critical
          component: api
        annotations:
          summary: "API is down"
          description: "API has been down for more than 1 minute"
```

### Alert Manager Configuration

```yaml
# prometheus/alertmanager.yml
global:
  resolve_timeout: 5m
  slack_api_url: 'YOUR_SLACK_WEBHOOK_URL'

route:
  group_by: ['alertname', 'severity']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty'
      continue: true
    - match:
        severity: critical
      receiver: 'slack-critical'
    - match:
        severity: warning
      receiver: 'slack-warning'

receivers:
  - name: 'default'
    slack_configs:
      - channel: '#alerts'
        title: 'Alert: {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'

  - name: 'slack-critical'
    slack_configs:
      - channel: '#alerts-critical'
        title: 'CRITICAL: {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
        color: 'danger'

  - name: 'slack-warning'
    slack_configs:
      - channel: '#alerts-warning'
        title: 'WARNING: {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
        color: 'warning'

  - name: 'pagerduty'
    pagerduty_configs:
      - service_key: 'YOUR_PAGERDUTY_SERVICE_KEY'
```

---

## Log Management

### Log Collection

**Pino Structured Logging:**

```typescript
// Example log formats
logger.info({ userId: '123', action: 'login' }, 'User logged in');
logger.error({ err, userId: '123' }, 'Failed to process request');
logger.warn({ memory: process.memoryUsage() }, 'High memory usage');
```

### Log Levels

| Level | Usage | Example |
|-------|-------|---------|
| ERROR | Errors requiring attention | Database connection failed |
| WARN | Potential issues | Slow query detected |
| INFO | General information | User logged in |
| DEBUG | Detailed debugging | Request payload |
| TRACE | Very detailed debugging | Function entry/exit |

### Log Query Examples

**Using Loki:**

```logql
# Find errors in last hour
{app="iup-api"} |= "level=ERROR" | json | line_format "{{.time}} {{.msg}}"

# Find slow queries
{app="iup-api"} | json | duration > 1s

# Find user-specific logs
{app="iup-api"} | json | userId="123"

# Find requests by route
{app="iup-api"} | json | route="/api/v1/players"

# Count errors by type
sum(count_over_time({app="iup-api"} |= "level=ERROR" [1h])) by (errorType)
```

### Log Retention

| Environment | Retention Period | Storage |
|------------|-----------------|---------|
| Development | 7 days | Local disk |
| Staging | 30 days | S3/CloudWatch |
| Production | 90 days | S3/CloudWatch |

### Log Rotation

```bash
# Configure logrotate
sudo vim /etc/logrotate.d/iup-api

/var/log/iup-api/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    missingok
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

## Tracing & Profiling

### Sentry Configuration

**Initialize Sentry:**

```typescript
// apps/api/src/plugins/sentry.ts already configured

// Set user context
Sentry.setUser({ id: userId, email: userEmail });

// Capture exception
Sentry.captureException(error);

// Capture message
Sentry.captureMessage('Something went wrong', 'warning');

// Add breadcrumb
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User attempting login',
  level: 'info',
});
```

### Performance Monitoring

**Transaction Tracking:**

```typescript
// Automatic transaction tracking via Sentry plugin
// Manual transactions:
const transaction = Sentry.startTransaction({
  op: 'task',
  name: 'processPlayerData',
});

try {
  // ... work ...
  transaction.setStatus('ok');
} catch (error) {
  transaction.setStatus('internal_error');
  throw error;
} finally {
  transaction.finish();
}
```

### Profiling

**Node.js Profiling:**

```bash
# CPU profiling
node --prof dist/server.js
# Generate report
node --prof-process isolate-*.log > profile.txt

# Heap profiling
node --inspect dist/server.js
# Connect Chrome DevTools to localhost:9229
# Take heap snapshot

# Continuous profiling with clinic.js
npm install -g clinic
clinic doctor -- node dist/server.js
clinic flame -- node dist/server.js
```

---

## Troubleshooting

### Issue: Missing Metrics

**Check metrics endpoint:**
```bash
curl http://localhost:3001/metrics
```

**Verify Prometheus scraping:**
```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets
```

### Issue: Logs Not Showing

**Check log output:**
```bash
pm2 logs api --lines 100
```

**Verify log level:**
```bash
# Check LOG_LEVEL environment variable
echo $LOG_LEVEL
```

### Issue: Alerts Not Firing

**Test alert rule:**
```bash
# Query Prometheus
curl 'http://localhost:9090/api/v1/query?query=YOUR_ALERT_QUERY'
```

**Check AlertManager:**
```bash
curl http://localhost:9093/api/v1/alerts
```

---

## Best Practices

### Monitoring Best Practices

1. **Use SLIs (Service Level Indicators)**
   - Request success rate
   - Request latency
   - System availability

2. **Define SLOs (Service Level Objectives)**
   - 99.9% uptime
   - 95% of requests < 200ms
   - Error rate < 0.1%

3. **Set Meaningful Alerts**
   - Alert on symptoms, not causes
   - Avoid alert fatigue
   - Include actionable context

4. **Monitor the Full Stack**
   - Application metrics
   - Infrastructure metrics
   - Business metrics

5. **Regular Review**
   - Review dashboards weekly
   - Update alert thresholds
   - Archive unused metrics

### Logging Best Practices

1. **Structured Logging**
   - Use JSON format
   - Include context (userId, requestId)
   - Consistent field names

2. **Appropriate Log Levels**
   - ERROR: Requires immediate action
   - WARN: Potential issues
   - INFO: Normal operations
   - DEBUG: Development/debugging

3. **Redact PII**
   - Passwords, tokens, secrets
   - Personal information
   - Credit card numbers

4. **Performance Considerations**
   - Avoid logging in hot paths
   - Use async logging
   - Set appropriate log levels in production

---

## Monitoring Checklist

### Daily
- [ ] Review critical alerts
- [ ] Check error rate trends
- [ ] Monitor response times
- [ ] Review Sentry errors

### Weekly
- [ ] Review dashboard metrics
- [ ] Analyze slow queries
- [ ] Check resource utilization
- [ ] Review business KPIs

### Monthly
- [ ] Update alert thresholds
- [ ] Review and update dashboards
- [ ] Analyze performance trends
- [ ] Capacity planning review

---

## Tools & Resources

### Monitoring Tools
- **Prometheus:** https://prometheus.io
- **Grafana:** https://grafana.com
- **Sentry:** https://sentry.io
- **Loki:** https://grafana.com/oss/loki

### Documentation
- [Prometheus Query Guide](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Grafana Dashboard Guide](https://grafana.com/docs/grafana/latest/dashboards/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)

---

## Emergency Contacts

- **DevOps Lead:** +47 XXX XX XXX
- **On-Call Engineer:** PagerDuty
- **CTO:** +47 XXX XX XXX

---

## Related Documentation

- [Incident Response Playbook](./incident-response.md)
- [Deployment Guide](./deployment.md)
- [Database Migration Runbook](./database-migration.md)

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2025-12-23 | Anders K | Initial monitoring guide |
