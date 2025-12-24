import { FastifyInstance, FastifyRequest, FastifyReply, FastifyError } from 'fastify';
import fp from 'fastify-plugin';

// Sentry SDK types (install with: pnpm add @sentry/node @sentry/profiling-node)
interface SentryConfig {
  dsn?: string;
  environment: string;
  tracesSampleRate: number;
  profilesSampleRate: number;
  enabled: boolean;
}

// Simple Sentry mock for when SDK is not available
let Sentry: any = null;

try {
  // Try to load Sentry - will only work if @sentry/node is installed
  Sentry = require('@sentry/node');
  require('@sentry/profiling-node');
} catch (error) {
  console.warn('Sentry SDK not installed. Install with: pnpm add @sentry/node @sentry/profiling-node');
}

async function sentryPlugin(fastify: FastifyInstance) {
  const sentryConfig: SentryConfig = {
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    profilesSampleRate: parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE || '0.1'),
    enabled: !!process.env.SENTRY_DSN && process.env.NODE_ENV !== 'test',
  };

  if (!sentryConfig.enabled) {
    fastify.log.info('Sentry integration disabled (no DSN configured or test environment)');

    // Add no-op decorators when Sentry is disabled
    fastify.decorate('sentry', {
      captureException: (error: Error) => {
        fastify.log.error({ err: error }, 'Error captured (Sentry disabled)');
      },
      captureMessage: (message: string) => {
        fastify.log.info(`Message captured (Sentry disabled): ${message}`);
      },
      setUser: (user: any) => {},
      setTag: (key: string, value: string) => {},
      setContext: (name: string, context: any) => {},
    });
    return;
  }

  if (!Sentry) {
    fastify.log.warn('Sentry SDK not available. Install @sentry/node to enable error tracking.');
    return;
  }

  // Initialize Sentry
  Sentry.init({
    dsn: sentryConfig.dsn,
    environment: sentryConfig.environment,
    tracesSampleRate: sentryConfig.tracesSampleRate,
    profilesSampleRate: sentryConfig.profilesSampleRate,

    integrations: [
      // Enable performance monitoring
      new Sentry.Integrations.Http({ tracing: true }),
      // Enable profiling
      new Sentry.ProfilingIntegration(),
    ],

    // Filter out sensitive information
    beforeSend(event, hint) {
      // Redact sensitive headers
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }

      // Redact sensitive query params
      if (event.request?.query_string) {
        const sanitized = event.request.query_string
          .replace(/token=[^&]*/g, 'token=[REDACTED]')
          .replace(/password=[^&]*/g, 'password=[REDACTED]')
          .replace(/secret=[^&]*/g, 'secret=[REDACTED]');
        event.request.query_string = sanitized;
      }

      return event;
    },

    // Ignore certain errors
    ignoreErrors: [
      'ValidationError',
      'UnauthorizedError',
      'NotFoundError',
      /ECONNREFUSED/,
      /ETIMEDOUT/,
    ],
  });

  // Decorate Fastify instance with Sentry methods
  fastify.decorate('sentry', Sentry);

  // Add request context hook
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    // Start a new Sentry transaction for each request
    const transaction = Sentry.startTransaction({
      op: 'http.server',
      name: `${request.method} ${request.routeOptions?.url || request.url}`,
      tags: {
        method: request.method,
        url: request.url,
      },
    });

    // Store transaction on request for later use
    (request as any).sentryTransaction = transaction;

    // Set request context
    Sentry.configureScope((scope: any) => {
      scope.setSpan(transaction);
      scope.setTag('route', request.routeOptions?.url || request.url);
      scope.setTag('method', request.method);
      scope.setContext('request', {
        method: request.method,
        url: request.url,
        query: request.query,
        params: request.params,
        headers: {
          userAgent: request.headers['user-agent'],
          referer: request.headers.referer,
        },
      });

      // Set user context if available
      if ((request as any).user) {
        scope.setUser({
          id: (request as any).user.userId,
          username: (request as any).user.username,
          email: (request as any).user.email,
        });
      }

      // Set tenant context if available
      if ((request as any).tenant) {
        scope.setTag('tenantId', (request as any).tenant.id);
      }
    });
  });

  // Add response hook to finish transaction
  fastify.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
    const transaction = (request as any).sentryTransaction;
    if (transaction) {
      transaction.setHttpStatus(reply.statusCode);
      transaction.finish();
    }
  });

  // Add error handler hook
  fastify.addHook('onError', async (request: FastifyRequest, reply: FastifyReply, error: FastifyError) => {
    // Only send errors to Sentry for 5xx errors or specific error types
    const shouldReport =
      reply.statusCode >= 500 ||
      error.name === 'Error' ||
      error.name === 'InternalServerError';

    if (shouldReport) {
      Sentry.withScope((scope: any) => {
        // Add request context
        scope.setContext('request', {
          method: request.method,
          url: request.url,
          query: request.query,
          params: request.params,
          headers: {
            userAgent: request.headers['user-agent'],
            referer: request.headers.referer,
          },
        });

        // Add error context
        scope.setContext('error', {
          name: error.name,
          message: error.message,
          code: error.code,
          statusCode: error.statusCode || reply.statusCode,
          stack: error.stack,
        });

        // Set error level
        const level = reply.statusCode >= 500 ? 'error' : 'warning';
        scope.setLevel(level as any);

        // Capture the exception
        Sentry.captureException(error);
      });
    }

    // Finish the transaction with error status
    const transaction = (request as any).sentryTransaction;
    if (transaction) {
      transaction.setHttpStatus(reply.statusCode);
      transaction.setStatus('internal_error');
      transaction.finish();
    }
  });

  fastify.log.info({
    environment: sentryConfig.environment,
    tracesSampleRate: sentryConfig.tracesSampleRate,
    profilesSampleRate: sentryConfig.profilesSampleRate,
  }, 'Sentry integration enabled');
}

export default fp(sentryPlugin, {
  name: 'sentry',
  fastify: '4.x',
});

// Export helper functions
export function captureException(error: Error, context?: Record<string, any>) {
  if (!Sentry) return;

  Sentry.withScope((scope: any) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
    }
    Sentry.captureException(error);
  });
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (!Sentry) return;
  Sentry.captureMessage(message, level as any);
}

export function setUserContext(user: { id: string; email?: string; username?: string }) {
  if (!Sentry) return;
  Sentry.setUser(user);
}

export function clearUserContext() {
  if (!Sentry) return;
  Sentry.setUser(null);
}
