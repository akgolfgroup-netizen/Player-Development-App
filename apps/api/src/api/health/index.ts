/**
 * ================================================================
 * Health Check API - Enhanced Monitoring
 * ================================================================
 *
 * Provides detailed health status for monitoring and alerting.
 * Checks database, dependencies, and system resources.
 */

import { FastifyPluginAsync } from 'fastify';
import { getPrismaClient } from '../../core/db/prisma';

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: HealthCheckResult;
    memory: HealthCheckResult;
    disk?: HealthCheckResult;
  };
  performance: {
    avgResponseTime?: number;
    requestCount?: number;
  };
}

interface HealthCheckResult {
  status: 'ok' | 'warning' | 'error';
  message: string;
  details?: Record<string, any>;
  responseTime?: number;
}

const healthRoutes: FastifyPluginAsync = async (fastify) => {
  const prisma = getPrismaClient();

  // Request counter for simple metrics
  let requestCount = 0;
  let totalResponseTime = 0;

  // Middleware to track requests
  fastify.addHook('onRequest', async () => {
    requestCount++;
  });

  fastify.addHook('onResponse', async (request, reply) => {
    const responseTime = reply.getResponseTime();
    totalResponseTime += responseTime;
  });

  /**
   * GET /health
   * Basic health check (fast, lightweight)
   */
  fastify.get('/', async (request, reply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  });

  /**
   * GET /health/detailed
   * Detailed health check with all service checks
   */
  fastify.get('/detailed', async (request, reply) => {
    const startTime = Date.now();

    // Run all checks in parallel
    const [databaseCheck, memoryCheck] = await Promise.all([
      checkDatabase(),
      checkMemory(),
    ]);

    // Determine overall status
    const checks = { database: databaseCheck, memory: memoryCheck };
    const overallStatus = determineOverallStatus(checks);

    const response: HealthCheckResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      checks,
      performance: {
        avgResponseTime: requestCount > 0 ? totalResponseTime / requestCount : 0,
        requestCount,
      },
    };

    const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 503 : 500;
    reply.code(statusCode).send(response);
  });

  /**
   * GET /health/ready
   * Readiness probe (for Kubernetes/Docker)
   */
  fastify.get('/ready', async (request, reply) => {
    const databaseCheck = await checkDatabase();

    if (databaseCheck.status === 'ok') {
      return reply.code(200).send({
        ready: true,
        message: 'Service is ready to accept requests',
      });
    } else {
      return reply.code(503).send({
        ready: false,
        message: 'Service is not ready',
        reason: databaseCheck.message,
      });
    }
  });

  /**
   * GET /health/live
   * Liveness probe (for Kubernetes/Docker)
   */
  fastify.get('/live', async (request, reply) => {
    // Simple liveness check - if we can respond, we're alive
    return {
      alive: true,
      uptime: process.uptime(),
    };
  });

  /**
   * Check database connectivity and performance
   */
  async function checkDatabase(): Promise<HealthCheckResult> {
    const start = Date.now();

    try {
      // Execute a simple query to verify database connectivity
      await prisma.$queryRaw`SELECT 1 as result`;

      const responseTime = Date.now() - start;

      // Get connection pool stats (if available)
      const metrics = await prisma.$metrics.json();

      return {
        status: responseTime < 100 ? 'ok' : responseTime < 500 ? 'warning' : 'error',
        message: responseTime < 100 ? 'Database connected' : 'Database slow',
        responseTime,
        details: {
          responseTime: `${responseTime}ms`,
          metrics: metrics || 'Not available',
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Database connection failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Check memory usage
   */
  async function checkMemory(): Promise<HealthCheckResult> {
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    const heapUsagePercent = (heapUsedMB / heapTotalMB) * 100;

    let status: 'ok' | 'warning' | 'error' = 'ok';
    let message = 'Memory usage normal';

    if (heapUsagePercent > 90) {
      status = 'error';
      message = 'Critical memory usage';
    } else if (heapUsagePercent > 75) {
      status = 'warning';
      message = 'High memory usage';
    }

    return {
      status,
      message,
      details: {
        heapUsed: `${heapUsedMB}MB`,
        heapTotal: `${heapTotalMB}MB`,
        heapUsagePercent: `${heapUsagePercent.toFixed(1)}%`,
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
      },
    };
  }

  /**
   * Determine overall system status based on individual checks
   */
  function determineOverallStatus(checks: Record<string, HealthCheckResult>): 'healthy' | 'degraded' | 'unhealthy' {
    const statuses = Object.values(checks).map(check => check.status);

    if (statuses.includes('error')) {
      return 'unhealthy';
    }
    if (statuses.includes('warning')) {
      return 'degraded';
    }
    return 'healthy';
  }
};

export default healthRoutes;
