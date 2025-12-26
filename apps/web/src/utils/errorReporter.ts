/**
 * Error Reporter Utility
 *
 * Minimal error tracking that can be swapped for Sentry/LogRocket later.
 * Currently logs to console in DEV, silent in PROD.
 *
 * To integrate Sentry later:
 *   1. npm install @sentry/react
 *   2. Replace captureException with Sentry.captureException
 *   3. Replace captureMessage with Sentry.captureMessage
 */

const IS_DEV = process.env.NODE_ENV === 'development';

interface ErrorContext {
  /** Where the error occurred */
  source?: string;
  /** User-facing action that triggered error */
  action?: string;
  /** Additional metadata */
  extra?: Record<string, unknown>;
}

/**
 * Capture and report an exception
 */
export function captureException(error: Error, context?: ErrorContext): void {
  if (IS_DEV) {
    console.error('[ErrorReporter] Exception:', {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  // TODO: Replace with Sentry.captureException(error, { extra: context })
  // Production: Could send to a logging endpoint here
}

/**
 * Capture and report a message (non-error event)
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  if (IS_DEV) {
    const logFn = level === 'error' ? console.error : level === 'warning' ? console.warn : console.log;
    logFn(`[ErrorReporter] ${level.toUpperCase()}:`, message);
  }

  // TODO: Replace with Sentry.captureMessage(message, level)
}

/**
 * Capture API errors with structured context
 */
export function captureAPIError(
  endpoint: string,
  status: number,
  errorMessage: string
): void {
  if (IS_DEV) {
    console.error('[ErrorReporter] API Error:', {
      endpoint,
      status,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }

  // TODO: Replace with Sentry integration
}

/**
 * Initialize error reporting (call once at app startup)
 * Currently sets up global error handlers
 */
export function initErrorReporter(): void {
  // Global unhandled error handler
  window.onerror = (message, source, lineno, colno, error) => {
    captureException(error || new Error(String(message)), {
      source: `${source}:${lineno}:${colno}`,
      action: 'unhandled_error',
    });
  };

  // Unhandled promise rejection handler
  window.onunhandledrejection = (event) => {
    const error = event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason));

    captureException(error, {
      action: 'unhandled_promise_rejection',
    });
  };

  if (IS_DEV) {
    console.log('[ErrorReporter] Initialized (DEV mode)');
  }
}
