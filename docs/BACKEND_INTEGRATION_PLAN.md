# Backend Integration Plan - IUP Golf Platform

**Versjon:** 1.0
**Dato:** 11. januar 2026
**Status:** Klar for implementering

---

## Oversikt

Dette dokumentet beskriver en 6-ukers plan for å implementere backend og koble det til den eksisterende frontend-koden. Frontend er 100% ferdig og venter på backend-APIer.

**Mål:** Full funksjonell applikasjon med alle 34 features koblet til ekte data.

**Estimert tid:** 6-8 uker (1 fulltime utvikler)

---

## Fase 1: Grunnleggende Infrastruktur (Uke 1)

### 1.1 Database Oppsett

**Tid:** 2 dager

#### Oppgaver
- [ ] Sett opp PostgreSQL database (lokal + produksjon)
- [ ] Installer og konfigurer migrasjonsverktøy (Prisma eller TypeORM)
- [ ] Opprett base schema fra eksisterende kode
- [ ] Kjør eksisterende migrasjoner

#### Database Konfiguration
```bash
# Local development
DATABASE_URL="postgresql://iup_golf:dev_password@localhost:5432/iup_golf_dev"

# Production (Railway/Heroku)
DATABASE_URL="postgresql://user:password@host:5432/iup_golf_prod"
```

#### Migrasjonsfiler å lage (prioritert rekkefølge)
1. `001_existing_schema.sql` - Eksisterende tabeller
2. `002_annual_plan_enhancements.sql` - Årsplan forbedringer
3. `003_messaging_system.sql` - Meldingssystem (5 tabeller)
4. `004_technical_tasks.sql` - P-system (7 tabeller)
5. `005_indexes_and_constraints.sql` - Performance optimalisering

#### Testing
```bash
# Test database connection
npm run db:test

# Run migrations
npm run db:migrate

# Seed demo data
npm run db:seed
```

---

### 1.2 API Grunnstruktur

**Tid:** 3 dager

#### Oppgaver
- [ ] Oppsett Express/Fastify server struktur
- [ ] Implementer autentisering middleware (JWT)
- [ ] Oppsett CORS og security headers
- [ ] Implementer error handling middleware
- [ ] Oppsett logging (Winston eller Pino)
- [ ] Implementer request validation (Zod eller Joi)

#### API Struktur
```
apps/api/src/
├── api/
│   └── v1/
│       ├── sessions/          # Treningsøkter
│       ├── annual-plan/       # Årsplan
│       ├── messages/          # Meldinger
│       ├── technique-plan/    # P-system
│       ├── players/           # Spillere
│       └── auth/             # Autentisering
├── middleware/
│   ├── auth.ts
│   ├── validation.ts
│   ├── errorHandler.ts
│   └── logger.ts
├── services/
│   ├── database.ts
│   ├── email.ts
│   └── file-upload.ts
└── app.ts
```

#### Environment Variables
```bash
# .env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-...
AWS_S3_BUCKET=iup-golf-uploads
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

#### Testing
```bash
# Test API server starts
npm run dev

# Test auth endpoint
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"player@demo.com","password":"demo123"}'
```

---

## Fase 2: Kjerne-APIer (Uke 2-3)

### 2.1 Treningsøkter API (Priority 1)

**Tid:** 4 dager

Frontend filer som venter på dette:
- `features/sessions/SessionCreateForm.jsx`
- `features/sessions/QuickSessionRegistration.jsx`
- `features/training/Treningsprotokoll.jsx`

#### Endpoints å implementere

```typescript
// 1. Hent alle økter for spiller
GET /api/v1/sessions/:playerId
Query params: ?startDate=2026-01-01&endDate=2026-12-31
Response: {
  sessions: Array<{
    id: string;
    playerId: string;
    pyramidCategory: 'FYS' | 'TEK' | 'SLAG' | 'SPILL' | 'TURN';
    sessionDate: string;
    duration: number;
    location: string;
    exercises: Array<Exercise>;
    evaluationEnergy: number;
    evaluationFocus: number;
  }>
}

// 2. Opprett ny økt
POST /api/v1/sessions
Body: {
  playerId: string;
  pyramidCategory: string;
  sessionDate: string;
  duration: number;
  location: string;
  exercises: Array<{ id, repetitions, duration }>;
  learningPhase?: string;
  clubSpeed?: number;
  pressure?: string;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate?: string;
    count?: number;
  };
}

// 3. Oppdater økt
PUT /api/v1/sessions/:sessionId
Body: { /* partial session data */ }

// 4. Slett økt
DELETE /api/v1/sessions/:sessionId

// 5. Registrer hurtigøkt
POST /api/v1/sessions/quick
Body: {
  playerId: string;
  pyramidCategory: string;
  sessionDate: string;
  duration: number;
  technicalTaskId?: string;
  notes?: string;
}
```

#### Database Schema
```sql
-- Existing session table enhancements needed
ALTER TABLE training_sessions ADD COLUMN pyramid_category VARCHAR(10);
ALTER TABLE training_sessions ADD COLUMN learning_phase VARCHAR(10);
ALTER TABLE training_sessions ADD COLUMN club_speed INTEGER;
ALTER TABLE training_sessions ADD COLUMN pressure_level VARCHAR(50);
ALTER TABLE training_sessions ADD COLUMN evaluation_energy INTEGER;
ALTER TABLE training_sessions ADD COLUMN evaluation_focus INTEGER;

-- Recurring sessions
ALTER TABLE training_sessions ADD COLUMN recurrence_rule VARCHAR(255);
ALTER TABLE training_sessions ADD COLUMN parent_session_id UUID;

-- Session exercises junction table
CREATE TABLE session_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES training_sessions(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id),
  repetitions INTEGER,
  duration INTEGER,
  order_index INTEGER
);
```

#### Integrasjon med Frontend
```typescript
// apps/web/src/services/sessionService.ts
export const sessionService = {
  async getAll(playerId: string, startDate: string, endDate: string) {
    const response = await apiClient.get(
      `/sessions/${playerId}?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data.sessions;
  },

  async create(sessionData: CreateSessionDto) {
    const response = await apiClient.post('/sessions', sessionData);
    return response.data.session;
  },

  async createQuick(quickSessionData: QuickSessionDto) {
    const response = await apiClient.post('/sessions/quick', quickSessionData);
    return response.data.session;
  },

  async update(sessionId: string, updates: Partial<Session>) {
    const response = await apiClient.put(`/sessions/${sessionId}`, updates);
    return response.data.session;
  },

  async delete(sessionId: string) {
    await apiClient.delete(`/sessions/${sessionId}`);
  },
};
```

#### Testing Plan
```bash
# Unit tests
npm run test:unit -- session.service.spec.ts

# Integration tests
npm run test:integration -- session.api.spec.ts

# Manual testing med curl
curl http://localhost:3000/api/v1/sessions/player-123 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 2.2 Årsplan API (Priority 2)

**Tid:** 3 dager

Frontend filer som venter:
- `features/player-annual-plan/PlayerAnnualPlanOverview.tsx`

#### Endpoints

```typescript
// 1. Hent årsplan for spiller
GET /api/v1/annual-plan/:playerId
Response: {
  plan: {
    id: string;
    playerId: string;
    name: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'completed';
    periods: Array<{
      id: string;
      name: string;
      type: 'E' | 'G' | 'S' | 'T'; // Evaluering, Grunn, Spesialisering, Turnering
      startDate: string;
      endDate: string;
      weeklyFrequency: number;
      goals: string[];
      description?: string;
      color: string;
    }>;
  }
}

// 2. Opprett ny årsplan
POST /api/v1/annual-plan/:playerId
Body: {
  name: string;
  startDate: string;
  endDate: string;
  periods: Array<PeriodDto>;
}

// 3. Generer årsplan automatisk (AI-assistert)
POST /api/v1/annual-plan/:playerId/generate
Body: {
  playerLevel: string;
  targetCategory: string;
  tournamentDates?: string[];
  schoolSchedule?: {
    examDates: string[];
    holidayPeriods: Array<{ start: string; end: string }>;
  };
}

// 4. Oppdater periode
PUT /api/v1/annual-plan/periods/:periodId
Body: { /* period updates */ }

// 5. Kanseller årsplan
DELETE /api/v1/annual-plan/:planId

// 6. Send endringsforespørsel til trener
POST /api/v1/annual-plan/:planId/change-request
Body: {
  message: string;
  requestedChanges: string[];
}
```

#### Database Schema
```sql
-- Add to existing annual_plan_periods table
ALTER TABLE annual_plan_periods ADD COLUMN color VARCHAR(20);
ALTER TABLE annual_plan_periods ADD COLUMN description TEXT;

-- Goals for periods
CREATE TABLE period_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id UUID REFERENCES annual_plan_periods(id) ON DELETE CASCADE,
  goal_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Change requests
CREATE TABLE annual_plan_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES annual_plans(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id),
  coach_id UUID REFERENCES coaches(id),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 2.3 Stats & Profile API (Priority 3)

**Tid:** 2 dager

Frontend filer som venter:
- `features/profile/ProfileView.tsx`
- `features/training/Treningsstatistikk.tsx`
- `features/dashboard/v2/DashboardV2.tsx`

#### Endpoints

```typescript
// 1. Hent spiller profil
GET /api/v1/players/:playerId
Response: {
  player: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    club: string;
    category: string;
    averageScore: number; // VIKTIG: Ikke handicap
    wagrRank?: number;
    profileImageUrl?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relation: string; // Inkluderer "Fullmakt"
    };
  }
}

// 2. Oppdater profil
PUT /api/v1/players/:playerId
Body: { /* profile updates */ }

// 3. Last opp profilbilde
POST /api/v1/players/:playerId/profile-image
Body: multipart/form-data { file: File }

// 4. Hent treningsstatistikk
GET /api/v1/stats/:playerId/training
Query: ?period=week|month|year
Response: {
  stats: {
    totalSessions: number;
    totalHours: number;
    totalRepetitions: number;
    byCategory: {
      FYS: { sessions: number; hours: number };
      TEK: { sessions: number; hours: number };
      // ...
    };
    averageScoreProgression: Array<{
      date: string;
      score: number;
    }>;
  }
}
```

#### Database Updates
```sql
-- Ensure average_score exists (should be from Phase 1)
ALTER TABLE players ADD COLUMN IF NOT EXISTS average_score DECIMAL(5,2);

-- Score history for progression chart
CREATE TABLE IF NOT EXISTS score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  score INTEGER NOT NULL,
  tournament_id UUID REFERENCES tournaments(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Fase 3: Avanserte Features (Uke 4-5)

### 3.1 Meldingssystem API (Priority 4)

**Tid:** 5 dager

Frontend filer som venter:
- `features/messaging/MessageCenter.tsx`
- `features/messaging/ConversationView.tsx`

Se fullstendig spec i: **`docs/FASE_9_BACKEND_REQUIREMENTS.md`**

#### Kjerne Endpoints (8 total)

```typescript
// 1. Hent samtaler
GET /api/v1/messages/conversations
Query: ?filter=trenere|grupper|samlinger|turneringer|personer|all

// 2. Hent meldinger i samtale
GET /api/v1/messages/conversations/:conversationId/messages

// 3. Send melding
POST /api/v1/messages/conversations/:conversationId/messages
Body: {
  content: string;
  replyToId?: string;
}

// 4. Marker som lest
PUT /api/v1/messages/conversations/:conversationId/read

// 5. Opprett lesebekreftelse
POST /api/v1/messages/:messageId/read-receipt

// 6. Hent lesebekreftelser
GET /api/v1/messages/:messageId/receipts

// 7. Hent kontakter
GET /api/v1/messages/contacts

// 8. Opprett ny samtale
POST /api/v1/messages/conversations
Body: {
  participants: string[];
  type: 'direct' | 'team' | 'coach_player';
}
```

#### Database (5 tabeller)
Se FASE_9_BACKEND_REQUIREMENTS.md for fullstendig schema:
- `message_threads`
- `message_participants`
- `messages`
- `message_read_receipts`
- `message_reminders`

#### Background Job: Message Reminders
```typescript
// apps/api/src/jobs/MessageReminderJob.ts
import cron from 'node-cron';

export class MessageReminderJob {
  start() {
    // Kjør hver 15. minutt
    cron.schedule('*/15 * * * *', async () => {
      await this.processReminders();
    });
  }

  async processReminders() {
    // 1. Finn meldinger > 60 min gamle uten svar
    // 2. Send in-app notifikasjon
    // 3. Logg reminder i message_reminders
    // 4. Gjenta hver time til svar
  }
}
```

#### Integrasjon
```typescript
// apps/web/src/services/messageService.ts
export const messageService = {
  async getConversations(filter: MessageFilterType) {
    const response = await apiClient.get(
      `/messages/conversations?filter=${filter}`
    );
    return response.data.conversations;
  },

  async getMessages(conversationId: string) {
    const response = await apiClient.get(
      `/messages/conversations/${conversationId}/messages`
    );
    return response.data.messages;
  },

  async sendMessage(conversationId: string, content: string, replyToId?: string) {
    const response = await apiClient.post(
      `/messages/conversations/${conversationId}/messages`,
      { content, replyToId }
    );
    return response.data.message;
  },

  async markAsRead(conversationId: string) {
    await apiClient.put(`/messages/conversations/${conversationId}/read`);
  },

  async createReadReceipt(messageId: string) {
    await apiClient.post(`/messages/${messageId}/read-receipt`);
  },

  async getReadReceipts(messageId: string) {
    const response = await apiClient.get(`/messages/${messageId}/receipts`);
    return response.data.receipts;
  },
};
```

---

### 3.2 P-System & TrackMan API (Priority 5)

**Tid:** 5 dager

Frontend filer som venter:
- `features/technique-plan/TechnicalPlanView.tsx`

Se fullstendig spec i: **`docs/FASE_10_P_SYSTEM_BACKEND_REQUIREMENTS.md`**

#### P-System Endpoints (15+)

```typescript
// Technical Tasks
GET /api/v1/technique-plan/:playerId
POST /api/v1/technique-plan/:playerId/tasks
PUT /api/v1/technique-plan/tasks/:taskId
DELETE /api/v1/technique-plan/tasks/:taskId
PUT /api/v1/technique-plan/tasks/:taskId/priority

// Drills
POST /api/v1/technique-plan/tasks/:taskId/drills
DELETE /api/v1/technique-plan/tasks/:taskId/drills/:drillId

// Responsible persons
POST /api/v1/technique-plan/tasks/:taskId/responsible
DELETE /api/v1/technique-plan/tasks/:taskId/responsible/:userId

// Progress tracking
POST /api/v1/technique-plan/tasks/:taskId/images
POST /api/v1/technique-plan/tasks/:taskId/videos
DELETE /api/v1/technique-plan/tasks/:taskId/images/:imageId
DELETE /api/v1/technique-plan/tasks/:taskId/videos/:videoId

// TrackMan
POST /api/v1/trackman/import
POST /api/v1/trackman/:playerId/reference
GET /api/v1/trackman/:playerId/reference
GET /api/v1/trackman/:playerId/history
GET /api/v1/trackman/:playerId/analysis
```

#### TrackMan AI Integration
```typescript
// apps/api/src/services/trackman/TrackmanImporter.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class TrackManImporter {
  async importFile(
    fileBuffer: Buffer,
    playerId: string,
    taskId?: string
  ) {
    // 1. Parse CSV/JSON fil (standard eller med OpenAI)
    const parsed = await this.parseFile(fileBuffer);

    // 2. Beregn gjennomsnitt
    const aggregated = this.aggregateShots(parsed.shots);

    // 3. Hent spillerens referanseverdier
    const references = await this.getReferences(playerId);

    // 4. Beregn avvik
    const deviations = this.calculateDeviations(aggregated, references);

    // 5. Generer AI-analyse
    const analysis = await this.generateAIAnalysis(aggregated, deviations);

    // 6. Lagre i database
    const dataId = await this.storeData(playerId, taskId, aggregated, analysis);

    return { dataId, analysis, deviations };
  }

  private async generateAIAnalysis(aggregated: any, deviations: any) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'system',
        content: 'Du er en golf swing-analyseekspert. Analyser TrackMan-data og gi konkrete anbefalinger på norsk.'
      }, {
        role: 'user',
        content: JSON.stringify({ averages: aggregated, deviations })
      }]
    });

    return completion.choices[0].message.content;
  }
}
```

#### File Upload Setup
```typescript
// Install dependencies
// npm install multer @aws-sdk/client-s3

// apps/api/src/middleware/upload.ts
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB for videos
  },
  fileFilter: (req, file, cb) => {
    // Validate file types
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif',
      'video/mp4', 'video/quicktime',
      'text/csv', 'application/json'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

export async function uploadToS3(
  file: Express.Multer.File,
  folder: string
): Promise<string> {
  const key = `${folder}/${Date.now()}-${file.originalname}`;

  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));

  return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
}
```

---

## Fase 4: Testing & Kvalitetssikring (Uke 6)

### 4.1 Backend Testing

**Tid:** 3 dager

#### Unit Tests
```bash
# Test services
npm run test:unit

# Coverage report
npm run test:coverage
```

#### Integration Tests
```typescript
// apps/api/tests/integration/sessions.test.ts
describe('Sessions API', () => {
  it('should create new session', async () => {
    const response = await request(app)
      .post('/api/v1/sessions')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        playerId: testPlayerId,
        pyramidCategory: 'TEK',
        sessionDate: '2026-01-15T10:00:00',
        duration: 60,
      });

    expect(response.status).toBe(201);
    expect(response.body.session).toHaveProperty('id');
  });

  it('should get all sessions for player', async () => {
    const response = await request(app)
      .get(`/api/v1/sessions/${testPlayerId}`)
      .set('Authorization', `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.sessions).toBeInstanceOf(Array);
  });
});
```

#### E2E Tests med Frontend
```typescript
// apps/web/tests/e2e/session-flow.spec.ts
import { test, expect } from '@playwright/test';

test('create and view session', async ({ page }) => {
  // Login
  await page.goto('http://localhost:3000/login');
  await page.fill('[name="email"]', 'player@demo.com');
  await page.fill('[name="password"]', 'demo123');
  await page.click('button[type="submit"]');

  // Navigate to quick registration
  await page.click('text=Hurtigregistrering');

  // Select pyramid level
  await page.click('text=TEK');

  // Fill form
  await page.fill('[name="location"]', 'Range');
  await page.fill('[name="duration"]', '60');

  // Submit
  await page.click('text=Registrer');

  // Verify success
  await expect(page.locator('text=Økt registrert')).toBeVisible();
});
```

---

### 4.2 Frontend Integrasjon

**Tid:** 2 dager

#### Oppdater API Client
```typescript
// apps/web/src/services/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

#### Koble komponenter til API
```typescript
// apps/web/src/features/sessions/QuickSessionRegistration.jsx

// FØR (mock data):
const handleSave = async (formData) => {
  console.log('Mock save:', formData);
  alert('Økt lagret (mock)');
};

// ETTER (ekte API):
import { sessionService } from '../../services/sessionService';

const handleSave = async (formData) => {
  try {
    setLoading(true);
    const session = await sessionService.createQuick({
      playerId: user.id,
      pyramidCategory: formData.pyramidCategory,
      sessionDate: formData.sessionDate,
      duration: formData.duration,
      location: formData.location,
      technicalTaskId: formData.technicalTask,
      notes: formData.notes,
      evaluationEnergy: formData.evaluationEnergy,
      evaluationFocus: formData.evaluationFocus,
    });

    toast.success('Økt registrert!');
    navigate('/trening/dagbok');
  } catch (error) {
    console.error('Failed to save session:', error);
    toast.error('Kunne ikke lagre økt');
  } finally {
    setLoading(false);
  }
};
```

#### Fjern Mock Data
Finn og erstatt alle steder med mock data:
```bash
# Søk etter mock data
grep -r "mock\|Mock\|MOCK" apps/web/src/features --include="*.tsx" --include="*.jsx"

# Typiske mønstre å lete etter:
# - const MOCK_DATA = [...]
# - Mock data for development
# - setData(mockData)
```

---

### 4.3 Performance Testing

**Tid:** 1 dag

#### Load Testing
```typescript
// Install k6: https://k6.io
// tests/load/sessions.js

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 10 },  // Ramp up
    { duration: '5m', target: 10 },  // Stay at 10 users
    { duration: '2m', target: 50 },  // Ramp to 50
    { duration: '5m', target: 50 },  // Stay at 50
    { duration: '2m', target: 0 },   // Ramp down
  ],
};

export default function () {
  const token = __ENV.TEST_TOKEN;

  const response = http.get(
    'http://localhost:3000/api/v1/sessions/player-123',
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

Kjør test:
```bash
k6 run tests/load/sessions.js
```

#### Database Query Optimization
```sql
-- Analyser treg queries
EXPLAIN ANALYZE
SELECT * FROM training_sessions
WHERE player_id = 'xxx'
AND session_date >= '2026-01-01';

-- Legg til manglende indexes
CREATE INDEX idx_sessions_player_date
ON training_sessions(player_id, session_date DESC);
```

---

## Fase 5: Deployment & DevOps (Uke 7)

### 5.1 Backend Deployment

**Tid:** 2 dager

#### Railway Deployment (Anbefalt)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up

# Set environment variables
railway variables set DATABASE_URL=postgresql://...
railway variables set JWT_SECRET=...
railway variables set OPENAI_API_KEY=...
railway variables set AWS_S3_BUCKET=...
```

#### Alternative: Heroku
```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Create app
heroku create iup-golf-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set env vars
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=...

# Deploy
git push heroku main

# Run migrations
heroku run npm run db:migrate
```

---

### 5.2 Frontend Deployment

**Tid:** 1 dag

#### Build Frontend
```bash
cd apps/web

# Set production API URL
echo "REACT_APP_API_URL=https://iup-golf-backend.up.railway.app/api/v1" > .env.production

# Build
npm run build

# Test build locally
npx serve -s build
```

#### Deploy til Vercel (Anbefalt)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variable
vercel env add REACT_APP_API_URL production
```

#### Alternative: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build

# Set environment
netlify env:set REACT_APP_API_URL https://iup-golf-backend.up.railway.app/api/v1
```

---

### 5.3 CI/CD Pipeline

**Tid:** 1 dag

#### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test
      - run: npm run lint

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

### 5.4 Monitoring & Logging

**Tid:** 1 dag

#### Sentry for Error Tracking
```typescript
// apps/api/src/app.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

// Error handler middleware
app.use(Sentry.Handlers.errorHandler());
```

```typescript
// apps/web/src/index.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 0.1,
});
```

#### LogRocket for Session Replay
```typescript
// apps/web/src/index.tsx
import LogRocket from 'logrocket';

if (process.env.NODE_ENV === 'production') {
  LogRocket.init('your-app-id');
}
```

---

## Fase 6: Launch & Brukertesting (Uke 8)

### 6.1 Seeding & Demo Data

**Tid:** 1 dag

```typescript
// apps/api/src/database/seeds/production-seed.ts

export async function seedProduction() {
  // 1. Opprett demo spillere (Anders, Nils, Øyvind)
  const players = await createDemoPlayers();

  // 2. Generer årsplaner
  for (const player of players) {
    await generateAnnualPlan(player.id);
  }

  // 3. Opprett noen treningsøkter
  await createSampleSessions(players);

  // 4. Opprett P-system oppgaver
  await createTechnicalTasks(players);

  // 5. Opprett noen samtaler
  await createConversations(players);
}
```

---

### 6.2 User Acceptance Testing

**Tid:** 2 dager

#### Test Scenarios

**Scenario 1: Ny spiller onboarding**
- [ ] Registrer ny bruker
- [ ] Fullfør onboarding (alle steg)
- [ ] Verifiser profil opprettes korrekt
- [ ] Sjekk at årsplan kan genereres

**Scenario 2: Registrer treningsøkt**
- [ ] Logg inn som demo spiller
- [ ] Klikk "Hurtigregistrering"
- [ ] Velg pyramidenivå (TEK)
- [ ] Fyll ut detaljer
- [ ] Lagre økt
- [ ] Verifiser vises i kalender

**Scenario 3: P-System**
- [ ] Naviger til P-System
- [ ] Opprett ny P4.0 oppgave
- [ ] Legg til drill
- [ ] Tildel ansvarlig person
- [ ] Last opp bilde
- [ ] Verifiser alt lagres

**Scenario 4: Meldinger**
- [ ] Åpne meldinger
- [ ] Test alle 6 filtere
- [ ] Send ny melding
- [ ] Verifiser lesebekreftelse
- [ ] Test reply funksjon

**Scenario 5: TrackMan Import**
- [ ] Gå til P-System → TrackMan
- [ ] Last opp TrackMan CSV
- [ ] Vent på AI-analyse
- [ ] Verifiser resultater vises
- [ ] Sjekk avvik fra referanseverdier

---

### 6.3 Bug Fixing & Polish

**Tid:** 2 dager

#### Vanlige Issues å Fikse
- [ ] CORS errors (backend config)
- [ ] Authentication token refresh
- [ ] File upload size limits
- [ ] Mobile responsiveness issues
- [ ] Loading states mangler
- [ ] Error messages ikke bruker-vennlige
- [ ] Dato/tid formateringsfeil
- [ ] Validering mangler

#### Performance Issues
- [ ] Treg innlasting av store datasett → paginer
- [ ] Mange API calls → implementer caching
- [ ] Store bilder → komprimer
- [ ] Lange TrackMan analyser → vis progress

---

## Oppsummering: Integrasjons-Checklist

### Backend (API)

#### Infrastruktur
- [ ] PostgreSQL database oppsatt (lokal + prod)
- [ ] Migrasjoner kjørt (005 filer)
- [ ] Indexes opprettet
- [ ] Express/Fastify server running
- [ ] CORS konfigurert
- [ ] JWT autentisering fungerer
- [ ] Error handling middleware
- [ ] Request validation (Zod/Joi)
- [ ] Logging (Winston/Pino)

#### API Endpoints (50+ total)
- [ ] Sessions API (5 endpoints)
- [ ] Annual Plan API (6 endpoints)
- [ ] Profile/Stats API (4 endpoints)
- [ ] Messaging API (8 endpoints)
- [ ] P-System API (15+ endpoints)
- [ ] TrackMan API (5 endpoints)

#### Services & Jobs
- [ ] File upload service (S3)
- [ ] Email service
- [ ] TrackMan importer (OpenAI)
- [ ] Message reminder job (cron)

#### Testing
- [ ] Unit tests (>80% coverage)
- [ ] Integration tests
- [ ] Load testing (k6)

### Frontend (React)

#### API Integration
- [ ] API client konfigurert
- [ ] Environment variables satt
- [ ] Authentication interceptors
- [ ] Error handling
- [ ] Loading states
- [ ] Success/error toast notifications

#### Service Layer
- [ ] sessionService.ts
- [ ] annualPlanService.ts
- [ ] messageService.ts
- [ ] techniquePlanService.ts
- [ ] trackmanService.ts
- [ ] profileService.ts

#### Component Updates (14 filer)
- [ ] QuickSessionRegistration.jsx - koble til API
- [ ] TechnicalPlanView.tsx - koble til API
- [ ] MessageCenter.tsx - koble til API
- [ ] ConversationView.tsx - koble til API
- [ ] PlayerAnnualPlanOverview.tsx - koble til API
- [ ] ProfileView.tsx - koble til API
- [ ] Treningsstatistikk.tsx - koble til API
- [ ] DashboardV2.tsx - koble til API
- [ ] Fjern ALL mock data

#### Testing
- [ ] E2E tests (Playwright)
- [ ] Manual testing alle features
- [ ] Cross-browser testing
- [ ] Mobile testing

### DevOps

#### Deployment
- [ ] Backend deployed (Railway/Heroku)
- [ ] Frontend deployed (Vercel/Netlify)
- [ ] Database deployed (managed PostgreSQL)
- [ ] S3 bucket oppsatt
- [ ] Environment variables satt
- [ ] SSL/HTTPS aktivert
- [ ] Custom domain konfigurert

#### CI/CD
- [ ] GitHub Actions workflow
- [ ] Automated testing
- [ ] Automated deployment
- [ ] Rollback strategy

#### Monitoring
- [ ] Sentry for error tracking
- [ ] LogRocket for session replay
- [ ] Database monitoring
- [ ] API performance monitoring
- [ ] Uptime monitoring

---

## Tidsestimat

| Fase | Oppgaver | Tid | Kumulativ |
|------|----------|-----|-----------|
| 1 | Database + API infrastruktur | 5 dager | 5 dager |
| 2 | Kjerne-APIer (Sessions, Annual, Stats) | 9 dager | 14 dager |
| 3 | Avanserte features (Messaging, P-System) | 10 dager | 24 dager |
| 4 | Testing & QA | 6 dager | 30 dager |
| 5 | Deployment & DevOps | 5 dager | 35 dager |
| 6 | Launch & UAT | 5 dager | 40 dager |

**Total: 40 arbeidsdager (8 uker)**

Med 1 fulltime utvikler: **8 uker**
Med 2 utviklere: **4-5 uker**

---

## Kostnadsestimat

### Hosting
- **Railway/Heroku:** $25-50/måned (backend + database)
- **Vercel/Netlify:** $0-20/måned (frontend)
- **S3 Storage:** $5-10/måned (bilder/videoer)

### Tjenester
- **OpenAI API:** $20-50/måned (TrackMan analyse)
- **Sentry:** $0-26/måned (error tracking)
- **LogRocket:** $0-99/måned (optional session replay)

**Total: ~$75-150/måned** for 100 aktive brukere

---

## Neste Steg

1. **Godkjenn plan** - Review og godkjenn integrasjonsplanen
2. **Prioriter features** - Bekreft prioritering av API-implementering
3. **Sett opp miljø** - Database, API server, deployment
4. **Start Fase 1** - Database migrasjoner og API grunnstruktur
5. **Ukentlige reviews** - Status møter hver fredag

**Klar til å starte? 🚀**
