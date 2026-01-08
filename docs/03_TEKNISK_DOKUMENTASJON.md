# Teknisk Dokumentasjon - IUP Golf

**For Senior Software Engineers**

---

## 1. Arkitekturoversikt

### 1.1 Tech Stack

| Layer | Teknologi | Versjon |
|-------|-----------|---------|
| **Backend Framework** | Fastify | 4.x |
| **Backend Language** | TypeScript | 5.x |
| **Database** | PostgreSQL | 15+ |
| **ORM** | Prisma | 5.x |
| **Cache** | Redis | 7.x |
| **Real-time** | WebSocket (@fastify/websocket) | - |
| **Validation** | Zod | 3.x |
| **Authentication** | JWT (jsonwebtoken) | - |
| **Monitoring** | Sentry + Prometheus | - |
| **Logging** | Pino | - |
| **Frontend Framework** | React | 18.x |
| **Routing** | React Router | 6.x |
| **Mobile** | Capacitor | 5.x |
| **Monorepo** | pnpm + Turbo | - |
| **Containerization** | Docker | - |

### 1.2 Monorepo Struktur

```
IUP_Master_V1/
├── apps/
│   ├── api/                    # Fastify backend
│   │   ├── src/
│   │   │   ├── app.ts          # Application bootstrap
│   │   │   ├── api/v1/         # 30+ route modules
│   │   │   ├── domain/         # Business logic
│   │   │   │   ├── gamification/
│   │   │   │   └── training-plan/
│   │   │   ├── core/           # Database, config
│   │   │   ├── middleware/     # Auth, error handling
│   │   │   ├── plugins/        # Fastify plugins
│   │   │   ├── utils/          # JWT, crypto, validation
│   │   │   └── services/       # External integrations
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # 60+ models
│   │   │   └── migrations/
│   │   └── package.json
│   │
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── App.jsx         # Main router
│   │   │   ├── api/            # API client
│   │   │   ├── contexts/       # State management
│   │   │   ├── features/       # 78 feature modules
│   │   │   ├── components/     # Shared UI
│   │   │   └── hooks/          # Custom hooks
│   │   └── package.json
│   │
│   └── golfer/                 # Mobile app (Capacitor)
│
├── packages/
│   └── design-tokens/          # Design system
│
├── config/                     # Environment config
├── scripts/                    # Build/deploy scripts
├── docs/                       # Documentation
├── turbo.json                  # Turbo build config
└── pnpm-workspace.yaml         # Monorepo config
```

---

## 2. Backend Arkitektur

### 2.1 Application Bootstrap

**Fil:** `apps/api/src/app.ts`

```typescript
// Core initialization med enterprise features
const app = Fastify({
  logger: opts.logger !== false ? logger : false,
  requestIdLogLabel: 'reqId',
  genReqId: (req) => (req.headers['x-request-id'] as string) ||
    `${Date.now()}-${Math.random()}`,
  trustProxy: true,  // Load balancer support
  ajv: {
    customOptions: {
      removeAdditional: 'all',
      coerceTypes: true,
      useDefaults: true,
    },
  },
});
```

**Arkitektoniske beslutninger:**
- **Request ID Generation:** Hvert request får unik ID for distributed tracing
- **Trust Proxy:** Korrekt IP-deteksjon bak reverse proxies
- **AJV Configuration:** Schema-validering med type coercion

### 2.2 Plugin Architecture

Plugin-registrering i korrekt rekkefølge:

```typescript
// Foundational plugins først
await app.register(sentryPlugin);              // Error tracking
await app.register(metricsPlugin);             // Prometheus metrics
await registerHelmet(app);                     // Security headers
await registerCors(app);                       // CORS policy
await registerSwagger(app);                    // OpenAPI docs (/docs)
await registerWebSocket(app);                  // Real-time
await registerCache(app);                      // Redis caching
await registerRateLimit(app);                  // Request throttling
```

**Plugin-formål:**
| Plugin | Funksjon |
|--------|----------|
| Sentry | Error capture, issue tracking |
| Metrics | `/health`, `/metrics`, `/ready`, `/live` |
| Helmet | CSP, X-Frame-Options, etc. |
| CORS | Cross-origin request handling |
| Swagger | API dokumentasjon |
| WebSocket | Bidirectional communication |
| Cache | Response caching med TTL |
| Rate Limit | Request throttling per user/IP |

### 2.3 Route Registration Pattern

Alle 30+ route-moduler registreres med versjonert prefix:

```typescript
// Dynamic imports for code-splitting
const { authRoutes } = await import('./api/v1/auth');
const { playerRoutes } = await import('./api/v1/players');
const { coachRoutes } = await import('./api/v1/coaches');
// ... 27 flere route modules

// Registration med prefix
await app.register(authRoutes, { prefix: `/api/v1/auth` });
await app.register(playerRoutes, { prefix: `/api/v1/players` });
// Alle API endpoints: /api/v1/{resource}
```

---

## 3. Authentication & Authorization

### 3.1 JWT Token Struktur

**Fil:** `apps/api/src/utils/jwt.ts`

```typescript
export interface AccessTokenPayload {
  id: string;        // User ID
  userId: string;    // Backwards compatibility
  tenantId: string;  // Multi-tenant support
  role: 'admin' | 'coach' | 'player' | 'parent';
  email: string;
  playerId?: string; // Når user er spiller
  coachId?: string;  // Når user er coach
}

// Token generation med standard claims
export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: '15m',              // Short-lived access token
    issuer: 'iup-golf-backend',
    audience: 'iup-golf-api',
  });
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: '7d',               // Long-lived refresh token
    issuer: 'iup-golf-backend',
    audience: 'iup-golf-api',
  });
}
```

### 3.2 Authentication Middleware

**Fil:** `apps/api/src/middleware/auth.ts`

```typescript
// 1. Mandatory authentication - kaster feil hvis ingen token
export async function authenticateUser(request, reply) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw authenticationError('Invalid header format');
  }
  const token = authHeader.substring(7);
  request.user = verifyAccessToken(token);
}

// 2. Optional authentication - kaster ikke feil
export async function optionalAuth(request, reply) {
  try {
    const token = request.headers.authorization?.substring(7);
    if (token) {
      request.user = verifyAccessToken(token);
    }
  } catch {
    // Silently fail - endpoint fungerer for anonyme brukere
  }
}

// 3. Role-based authorization
export function authorize(...allowedRoles: string[]) {
  return async (request, reply) => {
    if (!allowedRoles.includes(request.user.role)) {
      throw authorizationError(`Required: ${allowedRoles.join(', ')}`);
    }
  };
}

// Pre-built role checks
export const requireAdmin = authorize('admin');
export const requireCoach = authorize('admin', 'coach');
export const requirePlayer = authorize('admin', 'coach', 'player');
export const requireRole = authorize; // Alias
```

### 3.3 Bruk i Routes

```typescript
// Protected endpoint med role requirement
app.post('/protected-endpoint',
  { onRequest: [authenticateUser, authorize('admin', 'coach')] },
  async (request, reply) => {
    // request.user er garantert å eksistere med verifisert payload
  }
);
```

### 3.4 Auth Service Flow

**Fil:** `apps/api/src/api/v1/auth/service.ts`

```typescript
export class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    // 1. Find user
    const user = await this.prisma.user.findUnique({
      where: { email }
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // 2. Verify password
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    // 3. Generate new tokens
    const accessToken = generateAccessToken({
      id: user.id,
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      tokenId: crypto.randomUUID()
    });

    // 4. Store refresh token for revocation
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    // 5. Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return { accessToken, refreshToken, expiresIn: 900, user };
  }
}
```

---

## 4. Database Layer (Prisma)

### 4.1 Multi-Tenant Schema Design

**Fil:** `apps/api/prisma/schema.prisma`

```prisma
model Tenant {
  id               String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name             String   @db.VarChar(255)
  slug             String   @unique @db.VarChar(100)
  subscriptionTier String   @default("free") @db.VarChar(50)
  maxPlayers       Int      @default(50)
  maxCoaches       Int      @default(5)
  settings         Json     @default("{}") @db.JsonB
  status           String   @default("active") @db.VarChar(20)
  createdAt        DateTime @default(now()) @db.Timestamptz(6)
  updatedAt        DateTime @updatedAt @db.Timestamptz(6)

  // Relations til alle tenant-scoped entities
  coaches          Coach[]
  players          Player[]
  users            User[]
  @@map("tenants")
}

model User {
  id                String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  tenantId          String   @map("tenant_id") @db.Uuid
  email             String   @unique @db.VarChar(255)
  passwordHash      String   @map("password_hash") @db.VarChar(255)
  firstName         String   @map("first_name") @db.VarChar(100)
  lastName          String   @map("last_name") @db.VarChar(100)
  role              String   @db.VarChar(50) // admin, coach, player, parent
  isActive          Boolean  @default(true) @map("is_active")

  // 2FA
  twoFactorSecret      String?  @map("two_factor_secret")
  twoFactorEnabled     Boolean  @default(false)
  twoFactorBackupCodes String[] @default([])

  // Relations
  tenant               Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  refreshTokens        RefreshToken[]
  player               Player?        // One-to-one
  coach                Coach?         // One-to-one

  @@index([tenantId])
  @@index([email])
  @@map("users")
}

model Player {
  id                   String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  tenantId             String    @map("tenant_id") @db.Uuid
  userId               String?   @unique @map("user_id") @db.Uuid
  firstName            String    @db.VarChar(100)
  lastName             String    @db.VarChar(100)
  category             String    @default("K") @db.VarChar(1) // A-K
  averageScore         Decimal?  @db.Decimal(5, 2)
  handicap             Decimal?  @db.Decimal(5, 2)
  drivingDistance      Int?
  clubHeadSpeed        Decimal?  @db.Decimal(5, 1)
  status               String    @default("active") @db.VarChar(20)
  weeklyTrainingHours  Int       @default(10)

  // Relations
  tenant               Tenant                @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  coach                Coach?                @relation(fields: [coachId], references: [id])
  coachId              String?               @db.Uuid
  trainingSessions     TrainingSession[]
  tests                TestResult[]
  achievements         UserAchievement[]
  annualTrainingPlan   AnnualTrainingPlan[]
  breakingPoints       BreakingPoint[]

  @@index([tenantId])
  @@index([category])
  @@index([coachId])
  @@map("players")
}
```

### 4.2 Query Optimization Patterns

```typescript
// 1. N+1 Prevention med includes
const playerWithStats = await prisma.player.findUnique({
  where: { id: playerId },
  include: {
    coach: {
      select: { id: true, firstName: true, lastName: true }
    },
    trainingSessions: {
      where: { status: 'completed' },
      orderBy: { date: 'desc' },
      take: 10,
      select: { id: true, duration: true, date: true }
    }
  }
});

// 2. Batch operations for performance
const players = await prisma.player.findMany({
  where: {
    tenantId,
    category: { in: ['A', 'B', 'C'] },
    status: 'active'
  },
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' }
});

// 3. Transactions for data consistency
const result = await prisma.$transaction(async (tx) => {
  const plan = await tx.annualTrainingPlan.create({ data: {...} });
  await tx.periodization.createMany({
    data: weeks.map((w) => ({ ...w, annualPlanId: plan.id }))
  });
  await tx.player.update({
    where: { id: playerId },
    data: { currentPeriodId: plan.id }
  });
  return plan;
});

// 4. Aggregations for analytics
const stats = await prisma.trainingSession.aggregate({
  where: { playerId, date: { gte: weekStart } },
  _sum: { duration: true },
  _count: true,
  _avg: { intensity: true }
});
```

---

## 5. API Design Patterns

### 5.1 Route Module Struktur

Standard pattern for alle 30+ endpoint-moduler:

**Schema Definition (Zod):**

```typescript
// players/schema.ts
export const createPlayerSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().optional(),
  dateOfBirth: z.string().refine((d) => !isNaN(Date.parse(d))),
  gender: z.enum(['male', 'female', 'other']),
  category: z.enum(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']),
  averageScore: z.number().min(0).max(200).optional(),
  handicap: z.number().min(-10).max(54).optional(),
  coachId: z.string().uuid().optional(),
  weeklyTrainingHours: z.number().int().default(10),
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
});

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;
```

**Service Layer Pattern:**

```typescript
// players/service.ts
export class PlayerService {
  constructor(private prisma: PrismaClient) {}

  async createPlayer(
    tenantId: string,
    input: CreatePlayerInput
  ): Promise<PlayerWithRelations> {
    // Check duplicate email
    if (input.email) {
      const exists = await this.prisma.player.findFirst({
        where: { tenantId, email: input.email }
      });
      if (exists) throw new ConflictError('Email already exists');
    }

    // Verify coach exists
    if (input.coachId) {
      const coach = await this.prisma.coach.findFirst({
        where: { id: input.coachId, tenantId }
      });
      if (!coach) throw new NotFoundError('Coach not found');
    }

    return this.prisma.player.create({
      data: { tenantId, ...input },
      include: {
        coach: { select: { id: true, firstName: true } }
      }
    });
  }
}
```

**Route Handler:**

```typescript
// players/index.ts
export async function playerRoutes(app: FastifyInstance) {
  const prisma = getPrismaClient();
  const playerService = new PlayerService(prisma);

  app.post<{ Body: CreatePlayerInput }>(
    '/',
    {
      schema: {
        description: 'Create a new player',
        tags: ['players'],
        response: {
          201: { type: 'object', properties: { success: true, data: {} } },
          409: { $ref: 'Error#' }
        }
      }
    },
    async (request, reply) => {
      const input = validate(createPlayerSchema, request.body);
      const player = await playerService.createPlayer(
        request.user.tenantId,
        input
      );
      return reply.code(201).send({ success: true, data: player });
    }
  );
}
```

### 5.2 Error Handling Strategy

```typescript
// 1. Define error types
class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: string
  ) {
    super(message);
  }

  toJSON() {
    return {
      success: false,
      error: { code: this.code, message: this.message }
    };
  }
}

export const authenticationError = (msg: string) =>
  new AppError(401, msg, 'AUTHENTICATION_ERROR');
export const authorizationError = (msg: string) =>
  new AppError(403, msg, 'AUTHORIZATION_ERROR');
export const notFoundError = (msg: string) =>
  new AppError(404, msg, 'NOT_FOUND');
export const conflictError = (msg: string) =>
  new AppError(409, msg, 'CONFLICT');
export const validationError = (msg: string) =>
  new AppError(422, msg, 'VALIDATION_ERROR');

// 2. Centralized error handler
app.setErrorHandler(async (error, request, reply) => {
  // AppError
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send(error.toJSON());
  }

  // Fastify validation errors
  if ('validation' in error) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.validation
      }
    });
  }

  // Unexpected errors
  request.log.error(error);
  return reply.status(500).send({
    success: false,
    error: { code: 'INTERNAL_SERVER_ERROR', message: 'Unexpected error' }
  });
});
```

---

## 6. Domain Services

### 6.1 Gamification System

**Fil:** `apps/api/src/domain/gamification/badge-evaluator.ts`

Badge-systemet tildeler achievements basert på treningsmetrikker:

```typescript
export class BadgeEvaluatorService {
  constructor(private prisma: PrismaClient) {}

  async evaluateBadgesForPlayer(playerId: string): Promise<BadgeUnlockEvent[]> {
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
      include: {
        trainingSessions: true,
        tests: true,
        achievements: true
      }
    });

    // Calculate metrics for badge conditions
    const metrics: PlayerMetrics = {
      volume: this.calculateVolumeMetrics(player.trainingSessions),
      streak: this.calculateStreakMetrics(player.trainingSessions),
      strength: this.calculateStrengthMetrics(player.tests),
      performance: this.calculatePerformanceMetrics(player.tests)
    };

    // Check each badge
    const allBadges = ALL_BADGES;
    const unlocks: BadgeUnlockEvent[] = [];

    for (const badge of allBadges) {
      const alreadyHas = player.achievements.some(a => a.badgeId === badge.id);
      if (!alreadyHas && badge.condition(metrics)) {
        await this.prisma.userAchievement.create({
          data: {
            userId: player.userId!,
            badgeId: badge.id,
            unlockedAt: new Date()
          }
        });
        unlocks.push({ badgeId: badge.id, badgeName: badge.name });
      }
    }

    return unlocks;
  }

  private calculateStreakMetrics(sessions: TrainingSession[]): StreakMetrics {
    const sorted = sessions.sort((a, b) => b.date - a.date);
    let currentStreak = 0;
    let longestStreak = 0;
    let lastDate = new Date();

    for (const session of sorted) {
      const daysDiff = Math.floor(
        (lastDate.getTime() - session.date.getTime()) / (24 * 60 * 60 * 1000)
      );

      if (daysDiff <= 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
      lastDate = session.date;
    }

    return { currentStreak, longestStreak };
  }
}

// Badge definitions
export const ALL_BADGES = [
  {
    id: 'first-session',
    name: 'Getting Started',
    icon: '🏌️',
    condition: (m) => m.volume.sessionCount >= 1
  },
  {
    id: 'streak-7',
    name: '7-Day Warrior',
    icon: '⚔️',
    condition: (m) => m.streak.currentStreak >= 7
  },
  {
    id: 'volume-50',
    name: '50-Hour Master',
    icon: '🎯',
    condition: (m) => m.volume.monthlyHours >= 50
  }
];
```

### 6.2 Training Plan Generation

**Fil:** `apps/api/src/domain/training-plan/plan-generation.service.ts`

Genererer 12-måneders treningsplaner basert på spillerprofil:

```typescript
export class PlanGenerationService {
  static async generateAnnualPlan(
    input: GenerateAnnualPlanInput
  ): Promise<AnnualPlanGenerationResult> {
    const prisma = getPrismaClient();

    // 1. Get periodization template (52-week structure)
    const template = getTemplateForScoringAverage(input.baselineAverageScore);

    // 2. Create AnnualTrainingPlan record
    const annualPlan = await prisma.annualTrainingPlan.create({
      data: {
        playerId: input.playerId,
        tenantId: input.tenantId,
        planName: `${input.baselineAverageScore} avg - 12-month plan`,
        startDate: input.startDate,
        endDate: addWeeks(input.startDate, 52),
        status: 'active',
        baselineAverageScore: input.baselineAverageScore,
        basePeriodWeeks: template.basePeriodWeeks,        // E.g., 16
        specializationWeeks: template.specializationWeeks, // E.g., 20
        tournamentWeeks: template.tournamentWeeks,         // E.g., 12
        weeklyHoursTarget: input.weeklyHoursTarget || 12
      }
    });

    // 3. Generate 52 periodization weeks
    const weeks = this.generatePeriodizationStructure(
      input.startDate,
      template
    );

    await prisma.periodization.createMany({
      data: weeks.map((week) => ({
        playerId: input.playerId,
        annualPlanId: annualPlan.id,
        weekNumber: week.weekNumber,
        period: week.period,        // BASE, SPEC, TOURNAMENT, RECOVERY
        periodPhase: week.phase,    // BUILD, MAINTENANCE, TAPER, REST
        volumeIntensity: week.intensity,
        plannedHours: week.targetHours
      }))
    });

    return { annualPlan, periodizationWeeks: weeks };
  }

  private static generatePeriodizationStructure(
    startDate: Date,
    template: PeriodizationTemplate
  ): PeriodizationWeek[] {
    const weeks: PeriodizationWeek[] = [];
    let weekNum = 1;
    let currentDate = new Date(startDate);

    // BASE PERIOD (General preparation)
    for (let i = 0; i < template.basePeriodWeeks; i++) {
      weeks.push({
        weekNumber: weekNum++,
        period: 'BASE',
        phase: i < template.basePeriodWeeks - 4 ? 'BUILD' : 'MAINTENANCE',
        intensity: 'MODERATE',
        targetHours: 12,
        startDate: new Date(currentDate)
      });
      currentDate.setDate(currentDate.getDate() + 7);
    }

    // SPECIALIZATION PERIOD
    for (let i = 0; i < template.specializationWeeks; i++) {
      weeks.push({
        weekNumber: weekNum++,
        period: 'SPEC',
        phase: 'BUILD',
        intensity: 'HIGH',
        targetHours: 14,
        startDate: new Date(currentDate)
      });
      currentDate.setDate(currentDate.getDate() + 7);
    }

    // TOURNAMENT PERIOD
    for (let i = 0; i < template.tournamentWeeks; i++) {
      weeks.push({
        weekNumber: weekNum++,
        period: 'TOURNAMENT',
        phase: 'TAPER',
        intensity: 'MODERATE',
        targetHours: 8,
        startDate: new Date(currentDate)
      });
      currentDate.setDate(currentDate.getDate() + 7);
    }

    // RECOVERY PERIOD (remaining weeks)
    const remaining = 52 - weekNum + 1;
    for (let i = 0; i < remaining; i++) {
      weeks.push({
        weekNumber: weekNum++,
        period: 'RECOVERY',
        phase: 'REST',
        intensity: 'LOW',
        targetHours: 4,
        startDate: new Date(currentDate)
      });
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return weeks;
  }
}
```

---

## 7. Frontend Arkitektur

### 7.1 Application Structure

**Fil:** `apps/web/src/App.jsx`

```typescript
function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <BadgeNotificationProvider>
              <ErrorBoundary>
                <Suspense fallback={<LoadingState />}>
                  <Routes>
                    {/* PUBLIC */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<SplitScreenLanding />} />

                    {/* MOBILE */}
                    <Route path="/m" element={
                      <ProtectedRoute><MobileShell /></ProtectedRoute>
                    }>
                      <Route path="home" element={<MobileHome />} />
                      <Route path="plan" element={<MobilePlan />} />
                      <Route path="log" element={<MobileQuickLog />} />
                    </Route>

                    {/* PLAYER */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <DashboardLayout><DashboardContainer /></DashboardLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/profil" element={
                      <ProtectedRoute>
                        <AuthenticatedLayout title="Min profil">
                          <BrukerprofilContainer />
                        </AuthenticatedLayout>
                      </ProtectedRoute>
                    } />

                    {/* COACH */}
                    <Route path="/coach" element={
                      <ProtectedRoute requiredRole="coach">
                        <CoachLayout><CoachDashboard /></CoachLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/coach/athletes/:id" element={
                      <ProtectedRoute requiredRole="coach">
                        <CoachLayout><CoachAthleteDetail /></CoachLayout>
                      </ProtectedRoute>
                    } />

                    {/* ADMIN */}
                    <Route path="/admin" element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminLayout><AdminSystemOverview /></AdminLayout>
                      </ProtectedRoute>
                    } />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </BadgeNotificationProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
```

### 7.2 Context Providers

**AuthContext:**

```typescript
export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<AuthResult>;
  isAuthenticated: boolean;
  isPlayer: boolean;
  isCoach: boolean;
  isAdmin: boolean;
}

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('userData');
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    const { accessToken, user: userData } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    return { success: true };
  };

  const logout = async () => {
    await authAPI.logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout,
      isAuthenticated: !!user,
      isPlayer: user?.role === 'player',
      isCoach: user?.role === 'coach',
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### 7.3 Protected Routes

```typescript
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'coach' | 'player';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingState />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
```

### 7.4 Custom Hooks

```typescript
// useBreakingPoints.ts
export function useBreakingPoints(playerId: string) {
  const [breakingPoints, setBreakingPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await api.get(`/players/${playerId}/breaking-points`);
      setBreakingPoints(data);
      setLoading(false);
    };
    fetch();
  }, [playerId]);

  return { breakingPoints, loading };
}

// usePlayerInsights.js
export function usePlayerInsights(playerId: string) {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await api.get(`/players/${playerId}/insights`);
      setInsights(data);
    };
    fetch();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToPlayerUpdates(playerId, (update) => {
      setInsights(prev => ({ ...prev, ...update }));
    });

    return unsubscribe;
  }, [playerId]);

  return insights;
}

// useStrokesGained.js (DataGolf integration)
export function useStrokesGained(playerId: string, roundId?: string) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const result = await api.get(
        `/players/${playerId}/strokes-gained${roundId ? `/${roundId}` : ''}`
      );
      setData(result);
    };
    fetch();
  }, [playerId, roundId]);

  return { data };
}
```

---

## 8. Real-time Communication

### 8.1 WebSocket Implementation

**Fil:** `apps/api/src/plugins/websocket.ts`

```typescript
class WebSocketManager {
  private clients: Map<string, ConnectedClient[]> = new Map();

  addClient(ws: WebSocket, userId: string, role: string, tenantId: string) {
    const client = { ws, userId, role, tenantId, connectedAt: new Date() };
    if (!this.clients.has(userId)) {
      this.clients.set(userId, []);
    }
    this.clients.get(userId)!.push(client);
  }

  sendToUser(userId: string, type: string, payload: unknown) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      userClients.forEach(client => {
        client.ws.send(JSON.stringify({ type, payload, timestamp: new Date() }));
      });
    }
  }

  broadcastToRole(tenantId: string, role: string, type: string, payload: unknown) {
    for (const [_, clients] of this.clients) {
      clients.forEach(client => {
        if (client.tenantId === tenantId && client.role === role) {
          client.ws.send(JSON.stringify({ type, payload }));
        }
      });
    }
  }
}

// Connection handler
export async function registerWebSocket(app: FastifyInstance) {
  const wsManager = new WebSocketManager();

  await app.register(websocket);

  app.get<{ Querystring: { token: string } }>(
    '/ws',
    { websocket: true },
    async (socket, request) => {
      const token = request.query.token;
      const user = await verifyToken(token);

      if (!user) {
        socket.close(1008, 'Unauthorized');
        return;
      }

      wsManager.addClient(socket, user.id, user.role, user.tenantId);

      socket.on('message', (data) => {
        const message = JSON.parse(data.toString());
        switch (message.type) {
          case 'ping':
            socket.send(JSON.stringify({ type: 'pong' }));
            break;
          case 'subscribe-channel':
            wsManager.subscribeToChannel(user.id, message.channel);
            break;
        }
      });

      socket.on('close', () => {
        wsManager.removeClient(socket, user.id);
      });
    }
  );

  app.decorate('wsManager', wsManager);
}
```

**Real-time Events:**

```typescript
// Badge unlocked
wsManager.sendToUser(userId, 'badge-unlocked', {
  badgeId: 'streak-7',
  badgeName: '7-Day Warrior'
});

// Coach notification
wsManager.broadcastToRole(tenantId, 'coach', 'player-session-completed', {
  playerId,
  playerName,
  sessionType: 'Strength Training',
  duration: 60
});

// Plan progress
wsManager.sendToUser(userId, 'plan-progress', {
  weekNumber: 12,
  hoursCompleted: 10,
  hoursPlanned: 12,
  progressPercent: 83
});
```

---

## 9. Caching & Rate Limiting

### 9.1 Redis Cache

```typescript
class CacheService {
  private redis: Redis | null = null;
  private prefix: string = 'iup:';
  private defaultTTL: number = 3600; // 1 hour

  async get<T>(key: string): Promise<T | null> {
    if (!this.redis) return null;
    const data = await this.redis.get(this.prefix + key);
    return data ? JSON.parse(data) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
    if (!this.redis) return false;
    const ttl = ttlSeconds || this.defaultTTL;
    await this.redis.setex(this.prefix + key, ttl, JSON.stringify(value));
    return true;
  }

  async invalidate(pattern: string): Promise<void> {
    if (!this.redis) return;
    const keys = await this.redis.keys(this.prefix + pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

// Usage in routes
app.get('/players/:id', async (request, reply) => {
  const cacheKey = `player:${request.params.id}`;

  // Check cache
  const cached = await cacheService.get(cacheKey);
  if (cached) return reply.send(cached);

  // Fetch from DB
  const player = await prisma.player.findUnique({
    where: { id: request.params.id }
  });

  // Cache for 1 hour
  await cacheService.set(cacheKey, player, 3600);

  return reply.send(player);
});
```

### 9.2 Rate Limiting

```typescript
export const RateLimitConfig = {
  default: { max: 100, timeWindow: '1 minute' },
  auth: { max: 5, timeWindow: '1 minute' },      // Brute force prevention
  heavy: { max: 10, timeWindow: '1 minute' },    // Reports, exports
  write: { max: 30, timeWindow: '1 minute' },    // Create/update
  search: { max: 50, timeWindow: '1 minute' },   // Search, filter
};

// Key generation
function keyGenerator(request: FastifyRequest): string {
  const userId = request.user?.id;
  return userId ? `user:${userId}` : `ip:${request.ip}`;
}

// Applied per route
app.post('/login',
  { onRequest: [rateLimit(RateLimitConfig.auth)] },
  loginHandler
);
```

---

## 10. Environment Configuration

```typescript
// apps/api/src/config/index.ts
export const config = {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    env: process.env.NODE_ENV || 'development',
    apiVersion: 'v1',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    enabled: !!process.env.REDIS_URL,
    url: process.env.REDIS_URL,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiry: '15m',
    refreshExpiry: '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: process.env.AWS_S3_BUCKET,
    region: process.env.AWS_REGION || 'eu-north-1',
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
};
```

---

## 11. Key Architectural Patterns

### 11.1 Service Layer Separation

```
Route Handler (HTTP)
    ↓
  ↙ validates input med Zod
  ↓
Service (Pure business logic)
    ↓
  ↙ ingen HTTP concerns
  ↙ bruker Prisma
  ↙ returnerer domain objects
  ↓
Route Handler (HTTP)
    ↓
  ↙ formaterer response
  ↙ setter status code
```

### 11.2 Multi-Tenant Data Isolation

```typescript
// Alle queries filtrerer på tenant
const players = await prisma.player.findMany({
  where: {
    tenantId: request.user.tenantId  // Alltid filter
  }
});

// Cascade deletes sikrer data isolation
model Tenant {
  players Player[] @relation(onDelete: Cascade)
  coaches Coach[] @relation(onDelete: Cascade)
}
```

### 11.3 Feature Module Pattern (Frontend)

```
apps/web/src/features/
├── dashboard/
│   ├── DashboardContainer.jsx
│   ├── DashboardWidgets.jsx
│   └── index.js
├── tests/
│   ├── TestList.jsx
│   ├── TestResult.jsx
│   └── index.js
├── coach/
│   ├── CoachDashboard.jsx
│   ├── AthleteList.jsx
│   ├── AthleteDetail.jsx
│   └── index.js
└── ... (78 feature modules)
```

---

## 12. Development Commands

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev                    # All apps
pnpm --filter iup-golf-backend dev   # Backend only
pnpm --filter iup-golf-web dev       # Frontend only

# Database
pnpm --filter iup-golf-backend prisma:generate  # Generate client
pnpm --filter iup-golf-backend prisma:migrate   # Run migrations
pnpm --filter iup-golf-backend prisma:seed      # Seed data

# Build
pnpm build                  # All apps
pnpm --filter iup-golf-backend build
pnpm --filter iup-golf-web build

# Testing
pnpm test                   # All tests
pnpm --filter iup-golf-backend test

# Linting
pnpm lint
pnpm --filter iup-golf-backend lint
```

---

## 13. Deployment

### Railway (Production)

```bash
# Backend deploys automatically on push to main
# Manual deploy:
railway up --detach

# Environment variables configured in Railway dashboard:
# - DATABASE_URL
# - JWT_ACCESS_SECRET
# - JWT_REFRESH_SECRET
# - REDIS_URL
# - AWS_* credentials
# - SENTRY_DSN
# - ANTHROPIC_API_KEY
```

### Health Checks

- `GET /health` - Basic health check
- `GET /ready` - Readiness probe (database connected)
- `GET /live` - Liveness probe
- `GET /metrics` - Prometheus metrics

---

## Konklusjon

IUP Golf er en produksjonsklar, skalerbar coaching-plattform som demonstrerer:

1. **Modern API Design:** RESTful endpoints med clear separation of concerns
2. **Enterprise Security:** JWT auth, RBAC, input validation, rate limiting
3. **Real-time Capabilities:** WebSocket for live updates
4. **Scalability:** Multi-tenant, caching, optimized queries
5. **Developer Experience:** TypeScript, monorepo, comprehensive error handling
6. **Performance:** Lazy-loading, Redis caching, Prisma optimizations
7. **Domain-Driven Design:** Dedikerte services for gamification og training plans

Arkitekturen skalerer fra MVP til tusenvis av brukere gjennom proper abstractions og enterprise patterns.
