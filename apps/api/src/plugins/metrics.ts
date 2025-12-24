import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

interface MetricsData {
  httpRequestDuration: Map<string, number[]>;
  httpRequestCount: Map<string, number>;
  activeUsers: number;
  dbQueryDuration: number[];
  errorCount: Map<string, number>;
  lastUpdated: Date;
}

const metrics: MetricsData = {
  httpRequestDuration: new Map(),
  httpRequestCount: new Map(),
  activeUsers: 0,
  dbQueryDuration: [],
  errorCount: new Map(),
  lastUpdated: new Date(),
};

// Helper function to calculate percentiles
function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

// Helper function to format metrics in Prometheus format
function formatPrometheusMetrics(): string {
  const lines: string[] = [];
  const now = Date.now();

  // HTTP Request Duration metrics
  lines.push('# HELP http_request_duration_seconds HTTP request duration in seconds');
  lines.push('# TYPE http_request_duration_seconds histogram');

  for (const [route, durations] of metrics.httpRequestDuration.entries()) {
    if (durations.length > 0) {
      const p50 = calculatePercentile(durations, 50) / 1000;
      const p90 = calculatePercentile(durations, 90) / 1000;
      const p99 = calculatePercentile(durations, 99) / 1000;
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length / 1000;

      lines.push(`http_request_duration_seconds{route="${route}",quantile="0.5"} ${p50.toFixed(3)}`);
      lines.push(`http_request_duration_seconds{route="${route}",quantile="0.9"} ${p90.toFixed(3)}`);
      lines.push(`http_request_duration_seconds{route="${route}",quantile="0.99"} ${p99.toFixed(3)}`);
      lines.push(`http_request_duration_seconds_sum{route="${route}"} ${(avg * durations.length).toFixed(3)}`);
      lines.push(`http_request_duration_seconds_count{route="${route}"} ${durations.length}`);
    }
  }

  // HTTP Request Count metrics
  lines.push('');
  lines.push('# HELP http_requests_total Total number of HTTP requests');
  lines.push('# TYPE http_requests_total counter');

  for (const [route, count] of metrics.httpRequestCount.entries()) {
    lines.push(`http_requests_total{route="${route}"} ${count}`);
  }

  // Active Users metric
  lines.push('');
  lines.push('# HELP active_users_total Number of currently active users');
  lines.push('# TYPE active_users_total gauge');
  lines.push(`active_users_total ${metrics.activeUsers}`);

  // Database Query Duration metrics
  lines.push('');
  lines.push('# HELP db_query_duration_seconds Database query duration in seconds');
  lines.push('# TYPE db_query_duration_seconds histogram');

  if (metrics.dbQueryDuration.length > 0) {
    const p50 = calculatePercentile(metrics.dbQueryDuration, 50) / 1000;
    const p90 = calculatePercentile(metrics.dbQueryDuration, 90) / 1000;
    const p99 = calculatePercentile(metrics.dbQueryDuration, 99) / 1000;
    const avg = metrics.dbQueryDuration.reduce((a, b) => a + b, 0) / metrics.dbQueryDuration.length / 1000;

    lines.push(`db_query_duration_seconds{quantile="0.5"} ${p50.toFixed(3)}`);
    lines.push(`db_query_duration_seconds{quantile="0.9"} ${p90.toFixed(3)}`);
    lines.push(`db_query_duration_seconds{quantile="0.99"} ${p99.toFixed(3)}`);
    lines.push(`db_query_duration_seconds_sum ${(avg * metrics.dbQueryDuration.length).toFixed(3)}`);
    lines.push(`db_query_duration_seconds_count ${metrics.dbQueryDuration.length}`);
  }

  // Error Rate metrics
  lines.push('');
  lines.push('# HELP http_errors_total Total number of HTTP errors');
  lines.push('# TYPE http_errors_total counter');

  for (const [errorType, count] of metrics.errorCount.entries()) {
    lines.push(`http_errors_total{type="${errorType}"} ${count}`);
  }

  // Process metrics
  lines.push('');
  lines.push('# HELP process_uptime_seconds Process uptime in seconds');
  lines.push('# TYPE process_uptime_seconds gauge');
  lines.push(`process_uptime_seconds ${process.uptime().toFixed(2)}`);

  lines.push('');
  lines.push('# HELP process_memory_usage_bytes Process memory usage in bytes');
  lines.push('# TYPE process_memory_usage_bytes gauge');
  const memUsage = process.memoryUsage();
  lines.push(`process_memory_usage_bytes{type="rss"} ${memUsage.rss}`);
  lines.push(`process_memory_usage_bytes{type="heapTotal"} ${memUsage.heapTotal}`);
  lines.push(`process_memory_usage_bytes{type="heapUsed"} ${memUsage.heapUsed}`);
  lines.push(`process_memory_usage_bytes{type="external"} ${memUsage.external}`);

  return lines.join('\n') + '\n';
}

// Track HTTP request metrics
async function trackRequestMetrics(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const start = Date.now();

  reply.addHook('onSend', async (request, reply, payload) => {
    const duration = Date.now() - start;
    const route = request.routeOptions?.url || request.url;
    const method = request.method;
    const routeKey = `${method} ${route}`;

    // Track duration
    if (!metrics.httpRequestDuration.has(routeKey)) {
      metrics.httpRequestDuration.set(routeKey, []);
    }
    const durations = metrics.httpRequestDuration.get(routeKey)!;
    durations.push(duration);

    // Keep only last 1000 measurements to prevent memory issues
    if (durations.length > 1000) {
      durations.shift();
    }

    // Track count
    const currentCount = metrics.httpRequestCount.get(routeKey) || 0;
    metrics.httpRequestCount.set(routeKey, currentCount + 1);

    // Track errors
    if (reply.statusCode >= 400) {
      const errorType = reply.statusCode >= 500 ? '5xx' : '4xx';
      const currentErrorCount = metrics.errorCount.get(errorType) || 0;
      metrics.errorCount.set(errorType, currentErrorCount + 1);
    }

    metrics.lastUpdated = new Date();

    return payload;
  });
}

// Database query tracking function (to be called from Prisma middleware)
export function trackDbQuery(duration: number) {
  metrics.dbQueryDuration.push(duration);

  // Keep only last 1000 measurements
  if (metrics.dbQueryDuration.length > 1000) {
    metrics.dbQueryDuration.shift();
  }
}

// Active users tracking functions
export function incrementActiveUsers() {
  metrics.activeUsers++;
}

export function decrementActiveUsers() {
  metrics.activeUsers = Math.max(0, metrics.activeUsers - 1);
}

export function setActiveUsers(count: number) {
  metrics.activeUsers = Math.max(0, count);
}

// Plugin definition
async function metricsPlugin(fastify: FastifyInstance) {
  // Add metrics endpoint
  fastify.get('/metrics', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.type('text/plain; version=0.0.4; charset=utf-8');
    return formatPrometheusMetrics();
  });

  // Add health check endpoint
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      metrics: {
        totalRequests: Array.from(metrics.httpRequestCount.values()).reduce((a, b) => a + b, 0),
        totalErrors: Array.from(metrics.errorCount.values()).reduce((a, b) => a + b, 0),
        activeUsers: metrics.activeUsers,
        lastUpdated: metrics.lastUpdated,
      },
    };

    return healthCheck;
  });

  // Add readiness check endpoint
  fastify.get('/ready', async (request: FastifyRequest, reply: FastifyReply) => {
    // Check if application is ready to serve traffic
    // You can add database connectivity check here
    try {
      // Simple check - if we can respond, we're ready
      return { ready: true, timestamp: new Date().toISOString() };
    } catch (error) {
      reply.code(503);
      return { ready: false, error: 'Service not ready' };
    }
  });

  // Add liveness check endpoint
  fastify.get('/live', async (request: FastifyRequest, reply: FastifyReply) => {
    // Basic liveness check - process is alive if it can respond
    return { alive: true, timestamp: new Date().toISOString() };
  });

  // Hook to track all requests
  fastify.addHook('onRequest', trackRequestMetrics);

  fastify.log.info('Metrics plugin loaded - endpoints: /metrics, /health, /ready, /live');
}

export default fp(metricsPlugin, {
  name: 'metrics',
  fastify: '4.x',
});

export { metrics };
