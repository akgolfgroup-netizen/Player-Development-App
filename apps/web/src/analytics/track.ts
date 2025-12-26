/**
 * Analytics Tracking Module
 *
 * Lightweight analytics wrapper that logs events.
 * DEV: Logs to console
 * PROD: TODO - integrate with Segment/Amplitude/Posthog
 *
 * @example
 * track('screen_view', { screen: 'Dashboard', path: '/dashboard' })
 */

import { pushDebugEvent } from './AnalyticsDebug';

const IS_DEV = process.env.NODE_ENV === 'development';

export type AnalyticsEventName =
  | 'screen_view'
  | 'plan_confirmed'
  | 'training_log_submitted'
  | 'structured_session_completed'
  | 'feedback_received';

export interface BasePayload {
  source?: string;
  screen?: string;
  id?: string;
  date?: string;
  type?: string;
}

// Allowed payload keys (whitelist approach)
const ALLOWED_KEYS = new Set([
  'source', 'screen', 'id', 'date', 'type', 'path', 'action'
]);

// Keys that should NEVER be sent (blocklist as safety net)
const BLOCKED_KEYS = new Set([
  'email', 'password', 'token', 'accessToken', 'refreshToken',
  'name', 'firstName', 'lastName', 'phone', 'address',
  'note', 'notes', 'comment', 'comments', 'message',
  'authorization', 'auth', 'secret', 'key', 'apiKey'
]);

/**
 * Sanitize payload to prevent sensitive data leakage
 * Uses whitelist + blocklist approach
 */
function sanitizePayload(
  payload?: Record<string, unknown>
): Record<string, unknown> | undefined {
  if (!payload) return undefined;

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(payload)) {
    const lowerKey = key.toLowerCase();

    // Block known sensitive keys
    if (BLOCKED_KEYS.has(lowerKey)) {
      if (IS_DEV) {
        console.warn(`[Analytics] Blocked sensitive key: ${key}`);
      }
      continue;
    }

    // Only allow whitelisted keys
    if (ALLOWED_KEYS.has(key)) {
      // Ensure value is primitive (no objects/arrays)
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key] = value;
      }
    }
  }

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

/**
 * Track an analytics event
 * @param name - Event name from AnalyticsEventName
 * @param payload - Event data (no PII)
 */
export function track(
  name: AnalyticsEventName,
  payload?: BasePayload & Record<string, unknown>
): void {
  // Sanitize payload to prevent sensitive data leakage
  const safePayload = sanitizePayload(payload);

  const timestamp = new Date().toISOString();
  const eventData = {
    event: name,
    timestamp,
    ...safePayload,
  };

  if (IS_DEV) {
    console.info(`[Analytics] ${name}`, eventData);
    pushDebugEvent(name, safePayload);
    return;
  }

  // TODO: PROD integration
  // Replace this with your analytics provider:
  //
  // Segment:
  //   window.analytics?.track(name, payload);
  //
  // Posthog:
  //   posthog.capture(name, payload);
  //
  // Amplitude:
  //   amplitude.track(name, payload);
  //
  // For now, silently ignore in production
}

/**
 * Identify a user (for when user logs in)
 * @param userId - User ID
 * @param traits - User traits (no PII like name/email)
 */
export function identify(
  userId: string,
  traits?: { role?: string; tier?: string }
): void {
  if (IS_DEV) {
    console.info('[Analytics] identify', { userId, ...traits });
  }

  // TODO: PROD integration
  // window.analytics?.identify(userId, traits);
}
