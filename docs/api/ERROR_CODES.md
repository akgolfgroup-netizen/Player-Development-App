# Error Code Reference

**IUP Golf Academy API**

This document provides a complete reference of all error codes returned by the API.

---

## Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Optional additional information
    }
  }
}
```

---

## Authentication & Authorization Errors

### `UNAUTHORIZED` (401)

**Message:** "Authentication token is required"

**Cause:** Request doesn't include an `Authorization` header with a valid Bearer token.

**Solution:** Include a valid access token in the request:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### `INVALID_CREDENTIALS` (401)

**Message:** "Invalid email or password"

**Cause:** Login attempt with incorrect email or password.

**Solution:** Verify the email and password are correct. Use the forgot password flow if needed.

---

### `TOKEN_EXPIRED` (401)

**Message:** "Access token has expired"

**Cause:** The JWT access token is expired (lifetime: 15 minutes).

**Solution:** Use the refresh token to get a new access token:
```http
POST /api/v1/auth/refresh
{
  "refreshToken": "your-refresh-token"
}
```

---

### `TOKEN_INVALID` (401)

**Message:** "Token is invalid or malformed"

**Cause:** The JWT token is malformed, tampered with, or uses wrong signing key.

**Solution:** Re-authenticate to get a fresh token.

---

### `REFRESH_TOKEN_EXPIRED` (401)

**Message:** "Refresh token has expired"

**Cause:** The refresh token is expired (lifetime: 7 days).

**Solution:** User must log in again.

---

### `REFRESH_TOKEN_REVOKED` (401)

**Message:** "Refresh token has been revoked"

**Cause:** The refresh token was explicitly revoked (e.g., via logout).

**Solution:** User must log in again.

---

### `FORBIDDEN` (403)

**Message:** "You don't have permission to access this resource"

**Cause:** User is authenticated but doesn't have the required role/permissions.

**Example:** A `player` trying to access an admin-only endpoint.

**Solution:** Ensure the user has the appropriate role (admin, coach, or player).

---

### `SESSION_EXPIRED` (401)

**Message:** "Your session has expired. Please log in again."

**Cause:** Both access and refresh tokens are expired.

**Solution:** User must log in again.

---

## CSRF Protection Errors

### `CSRF_TOKEN_MISSING` (403)

**Message:** "CSRF token missing. Please include CSRF token in request."

**Cause:** State-changing request (POST, PUT, PATCH, DELETE) without CSRF token.

**Solution:** Get a CSRF token and include it:
```javascript
// 1. Get token
const response = await fetch('/csrf-token');
const { data } = await response.json();

// 2. Include in request
fetch('/api/v1/players', {
  method: 'POST',
  headers: {
    'x-csrf-token': data.token,
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(...)
});
```

---

### `CSRF_TOKEN_MISMATCH` (403)

**Message:** "CSRF token mismatch. Invalid request."

**Cause:** Token in header doesn't match token in cookie (double-submit pattern).

**Solution:** Ensure you're using the same token from both the `/csrf-token` response and cookie.

---

### `CSRF_TOKEN_INVALID` (403)

**Message:** "Invalid CSRF token. Token may have been tampered with."

**Cause:** CSRF token signature verification failed.

**Solution:** Get a fresh CSRF token from `/csrf-token`.

---

## Validation Errors

### `VALIDATION_ERROR` (400)

**Message:** "Validation failed"

**Cause:** Request body or query parameters don't match expected schema.

**Response includes field-level errors:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "email": "Invalid email format",
        "password": "Password must be at least 8 characters",
        "dateOfBirth": "Must be a valid date"
      }
    }
  }
}
```

**Solution:** Fix the invalid fields according to the error details.

---

### `INVALID_INPUT` (400)

**Message:** "Invalid input data"

**Cause:** Request data is malformed or contains invalid types.

**Solution:** Check request payload matches API documentation.

---

### `MISSING_REQUIRED_FIELD` (400)

**Message:** "Required field is missing: [field_name]"

**Cause:** Required field not provided in request.

**Solution:** Include the required field in your request.

---

## Resource Errors

### `NOT_FOUND` (404)

**Message:** "Resource not found"

**Cause:** The requested resource (player, coach, exercise, etc.) doesn't exist.

**Examples:**
- `GET /api/v1/players/invalid-id` → Player not found
- `GET /api/v1/exercises/non-existent-id` → Exercise not found

**Solution:** Verify the resource ID exists.

---

### `PLAYER_NOT_FOUND` (404)

**Message:** "Player not found"

**Cause:** Player with specified ID doesn't exist in the tenant.

**Solution:** Verify the player ID and tenant context.

---

### `COACH_NOT_FOUND` (404)

**Message:** "Coach not found"

**Cause:** Coach with specified ID doesn't exist in the tenant.

**Solution:** Verify the coach ID and tenant context.

---

### `DUPLICATE_EMAIL` (409)

**Message:** "Email already registered"

**Cause:** Attempting to create a user/player with an email that already exists.

**Solution:** Use a different email or update the existing record.

---

### `DUPLICATE_RESOURCE` (409)

**Message:** "Resource already exists"

**Cause:** Attempting to create a resource that violates uniqueness constraints.

**Solution:** Update the existing resource instead of creating a new one.

---

## Rate Limiting Errors

### `RATE_LIMIT_EXCEEDED` (429)

**Message:** "Too many requests. Please try again in [N] seconds."

**Cause:** Exceeded rate limit for the endpoint.

**Response includes retry information:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 30 seconds.",
    "details": {
      "retryAfter": 30,
      "limit": 100,
      "remaining": 0
    }
  }
}
```

**Solution:** Wait for the specified `retryAfter` seconds before retrying.

**Rate Limits:**
- Auth endpoints: 5 req/min
- Write operations: 30 req/min
- Heavy operations: 10 req/min
- Default: 100 req/min

---

## Data Errors

### `INVALID_DATE_RANGE` (400)

**Message:** "Invalid date range"

**Cause:** `endDate` is before `startDate`, or date range exceeds maximum.

**Solution:** Ensure `startDate` ≤ `endDate` and range is within limits.

---

### `INVALID_CATEGORY` (400)

**Message:** "Invalid player category"

**Cause:** Player category is not one of: A, B, C, D, E.

**Solution:** Use a valid category from the allowed list.

---

### `INVALID_ROLE` (400)

**Message:** "Invalid user role"

**Cause:** Role is not one of: admin, coach, player.

**Solution:** Use a valid role from the allowed list.

---

## Business Logic Errors

### `CANNOT_DELETE_ACTIVE_PLAYER` (400)

**Message:** "Cannot delete player with active training plan"

**Cause:** Attempting to delete a player who has an active training plan.

**Solution:** Archive the training plan first, or use soft delete (status = 'inactive').

---

### `TRAINING_PLAN_NOT_ACTIVE` (400)

**Message:** "Training plan is not active"

**Cause:** Attempting to modify an inactive or archived training plan.

**Solution:** Activate the training plan first.

---

### `INSUFFICIENT_PERMISSIONS` (403)

**Message:** "You don't have permission to modify this resource"

**Cause:** User trying to modify a resource they don't own.

**Example:** A coach trying to modify another coach's training plan.

**Solution:** Ensure the user has ownership or admin privileges.

---

## Password & Security Errors

### `WEAK_PASSWORD` (400)

**Message:** "Password does not meet security requirements"

**Cause:** Password doesn't meet minimum requirements.

**Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Solution:** Use a stronger password.

---

### `PASSWORD_MISMATCH` (400)

**Message:** "Passwords do not match"

**Cause:** Password and confirm password fields don't match.

**Solution:** Ensure both password fields are identical.

---

### `INCORRECT_PASSWORD` (401)

**Message:** "Current password is incorrect"

**Cause:** Wrong current password when changing password or disabling 2FA.

**Solution:** Provide the correct current password.

---

### `RESET_TOKEN_INVALID` (400)

**Message:** "Password reset token is invalid or expired"

**Cause:** Reset token is malformed, already used, or expired (lifetime: 1 hour).

**Solution:** Request a new password reset email.

---

## Two-Factor Authentication Errors

### `2FA_REQUIRED` (401)

**Message:** "Two-factor authentication code required"

**Cause:** User has 2FA enabled but didn't provide a TOTP code.

**Solution:** Include the 6-digit 2FA code from authenticator app.

---

### `2FA_CODE_INVALID` (401)

**Message:** "Invalid two-factor authentication code"

**Cause:** 2FA code is incorrect or expired.

**Solution:** Use the current 6-digit code from your authenticator app (valid for 30 seconds).

---

### `2FA_ALREADY_ENABLED` (400)

**Message:** "Two-factor authentication is already enabled"

**Cause:** Attempting to setup 2FA when it's already active.

**Solution:** Disable 2FA first if you want to reconfigure.

---

### `2FA_NOT_ENABLED` (400)

**Message:** "Two-factor authentication is not enabled"

**Cause:** Attempting to verify/disable 2FA when it's not enabled.

**Solution:** Setup 2FA first using `/api/v1/auth/2fa/setup`.

---

## File Upload Errors

### `FILE_TOO_LARGE` (413)

**Message:** "File size exceeds maximum allowed size"

**Cause:** Uploaded file is larger than the limit (typically 50MB for videos, 10MB for images).

**Solution:** Compress the file or upload a smaller file.

---

### `INVALID_FILE_TYPE` (400)

**Message:** "Invalid file type"

**Cause:** File type not in allowed list (e.g., uploading .exe when only images allowed).

**Solution:** Upload an allowed file type (JPEG, PNG, MP4, etc.).

---

### `UPLOAD_FAILED` (500)

**Message:** "File upload failed"

**Cause:** Error during S3/storage upload.

**Solution:** Retry the upload. Contact support if persists.

---

## Server Errors

### `INTERNAL_ERROR` (500)

**Message:** "An unexpected error occurred"

**Cause:** Unhandled server error.

**Note:** These errors are automatically logged to Sentry with full context.

**Solution:** Retry the request. If the error persists, contact support.

---

### `DATABASE_ERROR` (500)

**Message:** "Database operation failed"

**Cause:** Database connection or query error.

**Solution:** Retry the request. Contact support if persists.

---

### `EXTERNAL_SERVICE_ERROR` (503)

**Message:** "External service unavailable"

**Cause:** Third-party service (email, SMS, etc.) is down.

**Solution:** Retry the request after a delay.

---

## Tenant & Multi-tenancy Errors

### `TENANT_NOT_FOUND` (404)

**Message:** "Organization not found"

**Cause:** Tenant/organization with specified ID doesn't exist.

**Solution:** Verify the tenant ID.

---

### `CROSS_TENANT_ACCESS` (403)

**Message:** "Cannot access resources from another organization"

**Cause:** Attempting to access a resource from a different tenant.

**Solution:** Ensure you're accessing resources within your organization.

---

## Handling Errors in Client Code

### JavaScript/TypeScript Example

```typescript
async function makeRequest() {
  try {
    const response = await fetch('/api/v1/players', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const error = await response.json();

      // Handle specific error codes
      switch (error.error.code) {
        case 'TOKEN_EXPIRED':
          // Refresh token and retry
          await refreshAccessToken();
          return makeRequest();

        case 'RATE_LIMIT_EXCEEDED':
          // Wait and retry
          const retryAfter = error.error.details.retryAfter;
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          return makeRequest();

        case 'NOT_FOUND':
          // Show not found message
          showError('Resource not found');
          break;

        default:
          // Generic error handling
          showError(error.error.message);
      }

      throw error;
    }

    return await response.json();
  } catch (err) {
    console.error('Request failed:', err);
    throw err;
  }
}
```

---

## Error Code Summary Table

| Code | HTTP | Category | Retry? |
|------|------|----------|--------|
| `UNAUTHORIZED` | 401 | Auth | ❌ Re-authenticate |
| `INVALID_CREDENTIALS` | 401 | Auth | ❌ Fix credentials |
| `TOKEN_EXPIRED` | 401 | Auth | ✅ Refresh token |
| `TOKEN_INVALID` | 401 | Auth | ❌ Re-authenticate |
| `FORBIDDEN` | 403 | Auth | ❌ Need permissions |
| `CSRF_TOKEN_MISSING` | 403 | CSRF | ❌ Add CSRF token |
| `CSRF_TOKEN_INVALID` | 403 | CSRF | ❌ Get new token |
| `VALIDATION_ERROR` | 400 | Input | ❌ Fix input |
| `NOT_FOUND` | 404 | Resource | ❌ Check ID |
| `DUPLICATE_EMAIL` | 409 | Resource | ❌ Use different email |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate Limit | ✅ Wait & retry |
| `INTERNAL_ERROR` | 500 | Server | ✅ Retry |
| `DATABASE_ERROR` | 500 | Server | ✅ Retry |
| `EXTERNAL_SERVICE_ERROR` | 503 | Server | ✅ Retry |

---

**Last Updated:** December 25, 2024
