# Technology Choices & Rationale

**Last Updated:** January 8, 2026

This document explains the technology decisions made for the IUP Golf Academy platform, including the rationale behind each choice and alternatives that were considered.

---

## Technology Decision Matrix

| Category | Technology | Why We Chose This | Alternatives Considered | Decision Date |
|----------|-----------|-------------------|------------------------|---------------|
| **Backend Framework** | Fastify 4 | 2-3x faster than Express, first-class TypeScript support, schema validation built-in, plugin architecture for modularity | Express.js, Nest.js, Koa | Dec 2024 |
| **ORM** | Prisma 5 | Type-safe queries, auto-generated types, zero-downtime migrations, excellent DX, multi-tenant support | TypeORM, Drizzle, Sequelize | Dec 2024 |
| **Frontend Framework** | React 18 | Industry standard, massive ecosystem, team expertise, concurrent features, server components ready | Vue 3, Svelte, Angular | Dec 2024 |
| **Database** | PostgreSQL 16 | ACID compliance, JSON support, proven reliability, excellent performance, rich feature set | MySQL 8, MongoDB, CockroachDB | Dec 2024 |
| **Cache Layer** | Redis 7 | Sub-millisecond reads, pub/sub for WebSockets, session storage, horizontal scaling | Memcached, Dragonfly, Valkey | Dec 2024 |
| **Object Storage** | AWS S3 / MinIO | Industry standard, multipart upload, CDN integration, S3-compatible API (MinIO for local dev) | Google Cloud Storage, Azure Blob, Cloudflare R2 | Jan 2025 |
| **Authentication** | JWT + TOTP | Stateless tokens (scalable), TOTP standard for 2FA, refresh token rotation, widely supported | Session-based, Passport.js, Auth0, Supabase Auth | Dec 2024 |
| **Payment Processing** | Stripe | Industry leader, PCI DSS Level 1 compliant, excellent API/docs, webhook reliability, customer portal | PayPal, Braintree, Square | Jan 2025 |
| **Testing Framework** | Jest + Playwright | Jest for unit/integration (speed), Playwright for E2E (modern, reliable), good TypeScript support | Vitest, Cypress, TestCafe | Dec 2024 |
| **Monitoring** | Prometheus + Grafana | Open-source standard, battle-tested, flexible queries (PromQL), rich visualization (Grafana) | Datadog, New Relic, AppDynamics | Jan 2025 |
| **Error Tracking** | Sentry | Best-in-class error grouping, source maps support, performance profiling, affordable self-hosted option | Rollbar, Bugsnag, LogRocket | Jan 2025 |
| **Real-Time Communication** | WebSocket (ws library) | Full-duplex communication, native browser support, Redis pub/sub for scaling | Server-Sent Events (SSE), Socket.io, Ably | Jan 2025 |
| **Monorepo Tool** | Turborepo | Intelligent caching, remote caching support, task orchestration, pnpm integration | Nx, Lerna, Rush | Dec 2024 |
| **Package Manager** | pnpm | 3x faster installs, disk-efficient (hard links), monorepo-native, strict dependency resolution | npm, yarn, yarn berry | Dec 2024 |
| **CSS Framework** | Tailwind CSS 3 | Utility-first (no naming conflicts), design tokens integration, tree-shaking, small bundle | styled-components, Emotion, CSS Modules, Sass | Dec 2024 |
| **Form Handling** | React Hook Form | Minimal re-renders, excellent DX, small bundle (9KB), TypeScript support | Formik, Redux Form, Final Form | Jan 2025 |
| **API Client** | React Query | Server state management, caching, automatic refetching, optimistic updates | SWR, RTK Query, Apollo Client | Jan 2025 |
| **Build Tool** | Turbo (monorepo), Webpack (frontend), SWC (backend) | Turbo for caching, Webpack (CRA default), SWC for fast TypeScript compilation | Vite, esbuild, Rollup | Dec 2024 |
| **CI/CD Platform** | GitHub Actions | Native to GitHub, free for public/private repos, marketplace actions, matrix builds | GitLab CI, CircleCI, Travis CI | Dec 2024 |
| **Deployment** | Docker + Railway | Containerization (Docker) for consistency, Railway for managed deployment (Heroku-like DX) | Kubernetes, AWS ECS, Vercel, Netlify | Jan 2025 |
| **Logging** | Pino | Fastest Node.js logger (benchmarked), JSON structured logs, low overhead | Winston, Bunyan, log4js | Dec 2024 |

---

## Detailed Rationale

### Backend: Fastify over Express/Nest.js

**Why Fastify:**
- **Performance:** 2-3x faster than Express (50k+ req/sec vs 20k)
- **TypeScript:** First-class support, not an afterthought
- **Schema Validation:** Built-in with JSON Schema, automatic OpenAPI generation
- **Plugin System:** Encapsulation, dependency injection, lifecycle hooks
- **Modern:** Async/await native, Node.js best practices

**Why Not Express:**
- Callback-based design (older paradigm)
- TypeScript support via third-party types
- No built-in schema validation
- Slower performance

**Why Not Nest.js:**
- Opinionated architecture (we wanted flexibility)
- Steeper learning curve
- Heavier framework (more abstractions)
- Performance overhead from decorators

**Decision:** Fastify's performance + TypeScript support + flexibility

---

### ORM: Prisma over TypeORM/Drizzle

**Why Prisma:**
- **Type Safety:** Auto-generated types synced with schema
- **Developer Experience:** Best-in-class autocomplete, error messages
- **Migrations:** Declarative schema, zero-downtime migrations
- **Multi-Tenant:** Middleware support for organization scoping
- **Introspection:** Can reverse-engineer existing databases

**Why Not TypeORM:**
- Less type-safe (manual type definitions)
- Migrations require manual SQL knowledge
- Decorator-heavy (preference for declarative)

**Why Not Drizzle:**
- Too new (released after project started)
- Smaller community/ecosystem
- Unproven at scale

**Decision:** Prisma's type safety + DX + proven track record

---

### Database: PostgreSQL over MySQL/MongoDB

**Why PostgreSQL:**
- **ACID Compliance:** Strong consistency guarantees
- **JSON Support:** `JSONB` type for flexible schemas (best of both worlds)
- **Performance:** Excellent query planner, mature optimizer
- **Features:** Full-text search, window functions, CTEs, JSON path queries
- **Extensions:** PostGIS for potential location features, pg_trgm for fuzzy search

**Why Not MySQL:**
- Weaker JSON support
- Less advanced query features
- InnoDB limitations vs PostgreSQL

**Why Not MongoDB:**
- NoSQL not ideal for relational data (players, coaches, tests are highly relational)
- No ACID transactions (at the time of decision)
- Type safety harder with Mongoose

**Decision:** PostgreSQL's SQL + JSON hybrid approach fits our domain

---

### Caching: Redis over Memcached

**Why Redis:**
- **Data Structures:** Beyond key-value (lists, sets, sorted sets, hashes)
- **Pub/Sub:** Essential for WebSocket horizontal scaling
- **Persistence:** Optional durability (useful for sessions)
- **Atomic Operations:** `INCR`, `ZADD` for rate limiting, leaderboards
- **TTL Support:** Automatic expiration

**Why Not Memcached:**
- Only key-value (no pub/sub)
- No persistence
- Limited data structures

**Decision:** Redis's versatility (caching + pub/sub + sessions)

---

### Authentication: JWT over Session-based

**Why JWT:**
- **Stateless:** No server-side session storage (scales horizontally)
- **Mobile-Friendly:** Works seamlessly with native apps
- **Microservices:** Easy to validate across services
- **Standard:** Industry-standard (`aud`, `iss`, `exp` claims)

**Why Refresh Tokens:**
- Short-lived access tokens (15 min) limit damage if leaked
- Refresh tokens (7 days) stored securely, revocable

**Why TOTP for 2FA:**
- Standard (RFC 6238)
- Works offline (time-based)
- Compatible with Google Authenticator, Authy, etc.
- No SMS costs or delivery issues

**Decision:** JWT + refresh tokens + TOTP = secure, scalable, standard

---

### Monitoring: Prometheus + Grafana over Datadog

**Why Prometheus:**
- **Pull-Based:** Servers scrape metrics (no agent pushing)
- **PromQL:** Powerful query language
- **Open-Source:** No vendor lock-in
- **Kubernetes-Native:** De facto standard for cloud-native

**Why Grafana:**
- **Visualization:** Best-in-class dashboards
- **Multi-Source:** Can query Prometheus, Loki, Elasticsearch
- **Alerting:** Built-in alert manager

**Why Not Datadog/New Relic:**
- Cost (expensive at scale)
- Vendor lock-in
- Overkill for current scale

**Decision:** Open-source, cost-effective, proven combo

---

### Monorepo: Turborepo over Nx

**Why Turborepo:**
- **Caching:** Intelligent caching of task outputs
- **Simplicity:** Less configuration than Nx
- **pnpm Integration:** First-class support
- **Remote Caching:** Vercel-hosted or self-hosted
- **Task Pipelines:** Clear dependency graphs

**Why Not Nx:**
- More opinionated (Angular heritage)
- Steeper learning curve
- Heavier tooling

**Why Not Lerna:**
- Maintenance mode (archived)
- No task caching
- Slower than modern tools

**Decision:** Turborepo's simplicity + caching + pnpm fit

---

### Package Manager: pnpm over npm/yarn

**Why pnpm:**
- **Speed:** 3x faster installs (parallel + hard links)
- **Disk Efficiency:** Single global content-addressable store
- **Strict:** No phantom dependencies (only declared deps accessible)
- **Monorepo:** Native workspace support

**Why Not npm:**
- Slower (no parallel installs)
- Duplicate packages (wasted disk)
- Phantom dependencies possible

**Why Not Yarn (v1):**
- Slower than pnpm
- Less strict dependency resolution

**Decision:** pnpm's speed + strictness + monorepo support

---

## Trade-Offs & Future Considerations

### Current Trade-Offs

1. **Frontend TypeScript (0%)**
   - **Trade-Off:** Faster initial development (JavaScript)
   - **Cost:** Reduced type safety on frontend
   - **Plan:** Gradual migration to TypeScript

2. **React Scripts (Create React App)**
   - **Trade-Off:** Easy setup, zero config
   - **Cost:** Bundle size not optimal, can't customize Webpack easily
   - **Plan:** Evaluate Vite migration in Q2 2026

3. **E2E Tests Disabled in CI**
   - **Trade-Off:** CI pipeline speed
   - **Cost:** Manual E2E testing required
   - **Plan:** Optimize tests, investigate CI resources

### Future Technology Evaluations

**Potential Migrations (Q3-Q4 2026):**
- **Vite** - Replace CRA for faster dev/build (frontend)
- **tRPC** - End-to-end type safety for API calls
- **Bun** - Faster runtime if Node.js becomes bottleneck
- **Drizzle** - If Prisma performance becomes issue

**Research Areas:**
- **Edge Functions** - For globally distributed API (Cloudflare Workers, Vercel Edge)
- **GraphQL** - If REST becomes too chatty for mobile app
- **WebAssembly** - For compute-intensive features (video processing, analytics)

---

## Decision-Making Principles

When evaluating new technologies, we prioritize:

1. **Type Safety** - Prevents entire classes of bugs
2. **Developer Experience** - Faster development, happier team
3. **Performance** - User experience, cost efficiency
4. **Ecosystem** - Community, libraries, hiring
5. **Proven** - Battle-tested over bleeding-edge
6. **Cost** - Open-source preferred, managed where it makes sense
7. **Scalability** - Horizontal scaling, stateless where possible

---

## References

- **Architecture Decision Records:** [/docs/architecture/decisions/](./decisions/)
- **Performance Benchmarks:** [/docs/architecture/performance.md](./performance.md)
- **Security Considerations:** [/docs/operations/security.md](../operations/security.md)

**Last Updated:** January 8, 2026
