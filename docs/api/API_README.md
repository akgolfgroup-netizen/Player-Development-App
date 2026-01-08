# API Documentation

**IUP Golf API - Complete Documentation Suite**

Welcome to the IUP Golf API documentation! This directory contains comprehensive guides for using and integrating with our REST API.

---

## 📚 Documentation Index

### Getting Started

1. **[API Documentation](./API_DOCUMENTATION.md)** ⭐ **START HERE**
   - Complete API usage guide
   - Authentication tutorials
   - Common workflows
   - Request/response examples
   - All endpoints reference

### Security & Authentication

2. **[Authentication Flows](./AUTHENTICATION_FLOWS.md)**
   - JWT token architecture
   - Login & registration flows
   - Token refresh mechanism
   - Password reset flow
   - Two-factor authentication (2FA)
   - Session management

3. **[Security Audit Report](./SECURITY_AUDIT_REPORT.md)**
   - Comprehensive security assessment
   - Security rating: A- (Excellent)
   - CSRF protection details
   - Rate limiting configuration
   - Best practices implemented

### Error Handling

4. **[Error Codes Reference](./ERROR_CODES.md)**
   - Complete error code catalog
   - HTTP status codes
   - Error handling examples
   - Retry strategies
   - Client-side error handling

### Deployment & Production

5. **[Production Deployment Checklist](./PRODUCTION_DEPLOYMENT_CHECKLIST.md)**
   - Pre-deployment verification
   - Environment configuration
   - Database migration strategy
   - Monitoring setup
   - Rollback procedures

6. **[Production Environment Setup](./PRODUCTION_ENVIRONMENT_SETUP.md)**
   - Environment variables guide
   - Infrastructure requirements
   - Service configuration
   - Security hardening

---

## 🚀 Quick Start

### 1. Access Interactive Documentation

The easiest way to explore the API is through the built-in Swagger UI:

```bash
# Start the API server
cd apps/api
npm run dev

# Open in browser:
# http://localhost:3000/docs
```

The Swagger UI provides:
- Interactive endpoint testing
- Request/response examples
- Schema validation
- Authentication testing

### 2. Export API Documentation

Generate OpenAPI specification and Postman collection:

```bash
cd apps/api

# Export OpenAPI specification (JSON)
npm run docs:export-openapi
# Output: openapi.json

# Export Postman Collection
npm run docs:export-postman
# Output: postman-collection.json

# Export both
npm run docs:export-all
```

### 3. Import to Postman

1. Open Postman
2. Click **Import**
3. Select `postman-collection.json`
4. Set environment variables:
   - `baseUrl`: `http://localhost:3000`
   - `accessToken`: (get from login)
   - `refreshToken`: (get from login)

---

## 🔑 Authentication Quick Reference

### Get Access Token

```bash
# Register new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "coach@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "role": "coach",
    "organizationName": "My Golf",
    "organizationSlug": "my-academy"
  }'

# Response includes accessToken and refreshToken
```

### Use Access Token

```bash
# Include in Authorization header
curl -X GET http://localhost:3000/api/v1/players \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh Token

```bash
# When access token expires (after 15 minutes)
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

---

## 📖 Common Use Cases

### 1. Create a Player

```bash
# Get CSRF token (required for state-changing operations)
curl -X GET http://localhost:3000/csrf-token

# Create player
curl -X POST http://localhost:3000/api/v1/players \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "x-csrf-token: YOUR_CSRF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Emma",
    "lastName": "Wilson",
    "email": "emma@example.com",
    "dateOfBirth": "2005-03-15",
    "category": "B",
    "handicap": 15.4
  }'
```

### 2. List Players with Pagination

```bash
curl -X GET 'http://localhost:3000/api/v1/players?page=1&limit=20&category=A&status=active' \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Get Training Plan

```bash
# Get full training plan
curl -X GET http://localhost:3000/api/v1/training-plan/PLAYER_ID/full \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get today's training
curl -X GET http://localhost:3000/api/v1/training-plan/PLAYER_ID/today \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🛡️ Security Features

### Implemented Protections

- ✅ **JWT Authentication** (access + refresh tokens)
- ✅ **Role-Based Access Control** (admin, coach, player)
- ✅ **CSRF Protection** (double-submit cookie pattern)
- ✅ **Rate Limiting** (per-user and per-IP)
- ✅ **Security Headers** (Helmet with CSP)
- ✅ **CORS Configuration** (restricted origins)
- ✅ **Input Validation** (Zod schemas)
- ✅ **SQL Injection Prevention** (Prisma ORM)
- ✅ **XSS Protection** (JSON API, no HTML rendering)
- ✅ **Password Hashing** (bcrypt, 10 rounds)
- ✅ **2FA Support** (TOTP)
- ✅ **Error Tracking** (Sentry)

### Rate Limits

| Tier | Limit | Endpoints |
|------|-------|-----------|
| Auth | 5 req/min | `/auth/login`, `/auth/register` |
| Heavy | 10 req/min | Reports, exports |
| Write | 30 req/min | POST, PUT, PATCH, DELETE |
| Search | 50 req/min | Search queries |
| Default | 100 req/min | All other endpoints |

---

## 🎯 API Endpoints Summary

### Core Resources

| Resource | Endpoint Base | Description |
|----------|---------------|-------------|
| Authentication | `/api/v1/auth` | Login, register, 2FA, password reset |
| Players | `/api/v1/players` | Player management (CRUD) |
| Coaches | `/api/v1/coaches` | Coach management |
| Exercises | `/api/v1/exercises` | Exercise library |
| Training Plans | `/api/v1/training-plan` | Training plan management |
| Tests | `/api/v1/tests` | Testing and evaluation |
| Dashboard | `/api/v1/dashboard` | Analytics dashboards |
| Videos | `/api/v1/videos` | Video upload and management |
| Goals | `/api/v1/goals` | Goal tracking |
| Tournaments | `/api/v1/tournaments` | Tournament management |

**Total Endpoints:** 150+

See [API Documentation](./API_DOCUMENTATION.md) for complete endpoint list.

---

## 🔧 Development Tools

### Testing the API

```bash
# Run all tests
npm test

# Run integration tests
npm test:integration

# Run with coverage
npm test:coverage

# Run specific test file
npm test tests/integration/auth.test.ts
```

### Database Tools

```bash
# Open Prisma Studio (database GUI)
npm run prisma:studio

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

---

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Optional error details
    }
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

---

## 🌐 Environment Variables

### Required Variables

```bash
# Server
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@host:5432/db

# JWT Secrets
JWT_ACCESS_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# Frontend URL (for CORS)
FRONTEND_URL=https://app.yourdomain.com
```

See [Production Environment Setup](./PRODUCTION_ENVIRONMENT_SETUP.md) for complete list.

---

## 📞 Support & Resources

### Documentation

- **Swagger UI:** [http://localhost:3000/docs](http://localhost:3000/docs)
- **Health Check:** [http://localhost:3000/health](http://localhost:3000/health)
- **Metrics:** [http://localhost:3000/metrics](http://localhost:3000/metrics)

### Contact

- **Email:** anders@akgolf.no
- **GitHub:** [Report an issue](https://github.com/your-org/iup-golf-api/issues)

### Additional Resources

- [Fastify Documentation](https://www.fastify.io/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 📝 Document Versions

| Document | Last Updated | Version |
|----------|--------------|---------|
| API Documentation | 2024-12-25 | 1.0.0 |
| Authentication Flows | 2024-12-25 | 1.0.0 |
| Security Audit Report | 2024-12-25 | 1.0.0 |
| Error Codes Reference | 2024-12-25 | 1.0.0 |
| Production Checklist | 2024-12-25 | 1.0.0 |

---

## 🚦 API Status

**Current Version:** 1.0.0
**Status:** ✅ Production Ready
**Security Rating:** A- (Excellent)
**Test Coverage:** 100% (616/616 tests passing)
**Dependencies:** ✅ No known vulnerabilities

---

**Happy Coding! 🏌️‍♂️**
