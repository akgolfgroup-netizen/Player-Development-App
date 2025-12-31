/**
 * Input Sanitization Utilities
 *
 * Provides functions for sanitizing user input to prevent XSS and injection attacks.
 * Uses a whitelist approach for allowed HTML tags and attributes.
 */

// =============================================================================
// Configuration
// =============================================================================

/**
 * Allowed HTML tags for rich text content
 */
const ALLOWED_TAGS = new Set([
  'p', 'br', 'b', 'i', 'u', 'strong', 'em', 'strike', 's',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'a', 'span', 'div',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
]);

/**
 * Allowed attributes per tag
 */
const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'title', 'width', 'height']),
  '*': new Set(['class', 'id']), // Global attributes
};

/**
 * URL schemes allowed in href and src attributes
 */
const ALLOWED_URL_SCHEMES = new Set(['http:', 'https:', 'mailto:']);

// =============================================================================
// Sanitization Functions
// =============================================================================

/**
 * Strip all HTML tags from a string
 * Use for plain text fields like names, titles, etc.
 */
export function stripHtml(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Escape HTML special characters
 * Use when you need to display user input in HTML without interpretation
 */
export function escapeHtml(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sanitize a URL to prevent javascript: and data: attacks
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim().toLowerCase();

  // Check for dangerous schemes
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:')
  ) {
    return '';
  }

  // Validate URL scheme if present
  try {
    const parsed = new URL(url, 'http://localhost');
    if (!ALLOWED_URL_SCHEMES.has(parsed.protocol)) {
      return '';
    }
  } catch {
    // If URL parsing fails, check if it's a relative URL
    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
      return url;
    }
    return '';
  }

  return url;
}

/**
 * Basic HTML sanitizer - strips dangerous content while preserving safe HTML
 * For production use with rich text, consider using DOMPurify
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove script tags and their content
  let result = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove style tags and their content
  result = result.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove on* event handlers
  result = result.replace(/\s+on\w+\s*=\s*(['"])[^'"]*\1/gi, '');
  result = result.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, '');

  // Remove javascript: URLs in href and src
  result = result.replace(/href\s*=\s*(['"])javascript:[^'"]*\1/gi, 'href="removed"');
  result = result.replace(/src\s*=\s*(['"])javascript:[^'"]*\1/gi, 'src="removed"');
  result = result.replace(/href\s*=\s*(['"])data:[^'"]*\1/gi, 'href="removed"');
  result = result.replace(/src\s*=\s*(['"])data:[^'"]*\1/gi, 'src="removed"');

  // Remove dangerous tags
  const dangerousTags = ['script', 'style', 'iframe', 'frame', 'frameset', 'object', 'embed', 'applet', 'form', 'input', 'button', 'select', 'textarea'];
  for (const tag of dangerousTags) {
    const regex = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>|<${tag}\\b[^>]*\\/?>`, 'gi');
    result = result.replace(regex, '');
  }

  // Remove meta and link tags
  result = result.replace(/<(meta|link|base)\b[^>]*\/?>/gi, '');

  return result.trim();
}

/**
 * Sanitize object values recursively
 * Useful for sanitizing entire request bodies
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  options: {
    stripHtml?: boolean;
    preserveRichText?: string[]; // Field names that should preserve safe HTML
  } = {}
): T {
  const { stripHtml: shouldStripHtml = true, preserveRichText = [] } = options;

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      sanitized[key] = value;
    } else if (typeof value === 'string') {
      if (preserveRichText.includes(key)) {
        sanitized[key] = sanitizeHtml(value);
      } else if (shouldStripHtml) {
        sanitized[key] = stripHtml(value);
      } else {
        sanitized[key] = escapeHtml(value);
      }
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        typeof item === 'object' && item !== null
          ? sanitizeObject(item as Record<string, unknown>, options)
          : typeof item === 'string'
            ? (shouldStripHtml ? stripHtml(item) : escapeHtml(item))
            : item
      );
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>, options);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * Sanitize SQL-like input to prevent injection
 * Note: This is a basic check - always use parameterized queries!
 */
export function sanitizeSqlInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove common SQL injection patterns
  return input
    .replace(/'/g, "''") // Escape single quotes
    .replace(/;/g, '') // Remove semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comment start
    .replace(/\*\//g, '') // Remove block comment end
    .replace(/xp_/gi, '') // Remove extended stored procedure calls
    .replace(/union\s+select/gi, '') // Remove UNION SELECT
    .trim();
}

/**
 * Validate and sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmed = email.trim().toLowerCase();

  if (!emailRegex.test(trimmed)) {
    return '';
  }

  return trimmed;
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return '';
  }

  return filename
    .replace(/\.\./g, '') // Remove path traversal
    .replace(/[/\\]/g, '') // Remove path separators
    .replace(/[<>:"|?*]/g, '') // Remove invalid filename characters
    .replace(/\x00/g, '') // Remove null bytes
    .trim();
}

// =============================================================================
// Export Default
// =============================================================================

export default {
  stripHtml,
  escapeHtml,
  sanitizeHtml,
  sanitizeUrl,
  sanitizeObject,
  sanitizeSqlInput,
  sanitizeEmail,
  sanitizeFilename,
};
