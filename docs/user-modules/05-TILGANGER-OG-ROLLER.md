# Tilganger og Roller

> Rollebasert tilgangsstyring og autorisasjon

---

## 1. Rolle-hierarki

```
┌─────────────────────────────────────────────────────┐
│                    ADMIN                             │
│          Full tilgang til alt i tenant               │
│                      ↓                               │
├─────────────────────────────────────────────────────┤
│                    COACH                             │
│        Tilgang til tildelte spillere                 │
│        Lese/skrive treningsdata                      │
│                      ↓                               │
├─────────────────────────────────────────────────────┤
│                   PLAYER                             │
│          Kun egen data                               │
│          Dele med coach                              │
└─────────────────────────────────────────────────────┘
```

---

## 2. Tilgangsmatrise

### Data-tilgang per rolle

| Ressurs | Player | Coach | Admin |
|---------|--------|-------|-------|
| **Egen profil** | R/W | R/W | R/W |
| **Andres profil** | - | R (tildelte) | R/W |
| **Egne treninger** | R/W | R/W | R/W |
| **Andres treninger** | - | R (tildelte) | R/W |
| **Egne tester** | R/W | R/W | R/W |
| **Andres tester** | - | R (tildelte) | R/W |
| **Egne mål** | R/W | R (tildelte) | R/W |
| **Treningsplaner** | R | R/W | R/W |
| **Grupper** | R (medlem) | R/W (egne) | R/W |
| **Meldinger** | R/W (egne) | R/W (egne) | R/W |
| **Brukeradmin** | - | - | R/W |
| **Systemconfig** | - | - | R/W |

R = Les, W = Skriv, - = Ingen tilgang

### Feature-tilgang per rolle

| Feature | Player | Coach | Admin |
|---------|--------|-------|-------|
| Dashboard | ✅ Personlig | ✅ Oversikt | ✅ System |
| Logg trening | ✅ | ❌ (for spiller) | ✅ |
| Se treningshistorikk | ✅ Egen | ✅ Tildelte | ✅ Alle |
| Registrer test | ✅ | ❌ | ✅ |
| Se testresultater | ✅ Egne | ✅ Tildelte | ✅ Alle |
| Sett mål | ✅ | ✅ (for spiller) | ✅ |
| Lag treningsplan | ❌ | ✅ | ✅ |
| Lag årsplan | ❌ | ✅ | ✅ |
| Inviter spillere | ❌ | ✅ | ✅ |
| Administrer brukere | ❌ | ❌ | ✅ |
| Konfigurer system | ❌ | ❌ | ✅ |

---

## 3. Coach-Player kobling

### Koblingstyper

```prisma
enum CoachRole {
  PRIMARY    // Hovedtrener
  SECONDARY  // Hjelptrener
  TEMPORARY  // Vikar/midlertidig
}

model CoachPlayerAssignment {
  id        String    @id
  coachId   String
  playerId  String
  role      CoachRole
  startDate DateTime
  endDate   DateTime?

  // Spesifikke tillatelser
  canViewPersonalInfo  Boolean @default(true)
  canViewTests         Boolean @default(true)
  canViewGoals         Boolean @default(true)
  canCreatePlans       Boolean @default(true)
  canSendMessages      Boolean @default(true)

  coach     Coach
  player    Player

  @@unique([coachId, playerId])
}
```

### Kobling via grupper

```prisma
model PlayerGroup {
  id        String
  tenantId  String
  coachId   String
  name      String

  players   PlayerGroupMember[]
  coach     Coach
}

model PlayerGroupMember {
  id        String
  groupId   String
  playerId  String
  joinedAt  DateTime

  group     PlayerGroup
  player    Player
}
```

---

## 4. API-autorisasjon

### Middleware-struktur

```typescript
// middleware/auth.ts
export function requireAuth(req, res, next) {
  // Verifiser JWT token
  // Sett req.user med { id, tenantId, role, playerId?, coachId? }
}

export function requireRole(...roles: string[]) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

export function requireCoachAccess(req, res, next) {
  // Sjekk at coach har tilgang til spiller
  const { playerId } = req.params;
  const { coachId } = req.user;

  // Sjekk CoachPlayerAssignment eller gruppemedlemskap
}
```

### Route-eksempler

```typescript
// Kun player selv eller coach med tilgang
router.get('/players/:playerId/sessions',
  requireAuth,
  requirePlayerOrCoachAccess,
  getPlayerSessions
);

// Kun coach
router.post('/players/:playerId/plans',
  requireAuth,
  requireRole('coach', 'admin'),
  requireCoachAccess,
  createPlayerPlan
);

// Kun admin
router.post('/users',
  requireAuth,
  requireRole('admin'),
  createUser
);
```

---

## 5. Frontend-autorisasjon

### Rolle-context

```tsx
// contexts/AuthContext.tsx
interface AuthContextValue {
  user: {
    id: string;
    role: 'admin' | 'coach' | 'player';
    tenantId: string;
    playerId?: string;
    coachId?: string;
  };
  isAdmin: boolean;
  isCoach: boolean;
  isPlayer: boolean;
  hasAccess: (resource: string, action: string) => boolean;
}
```

### Rolle-guards

```tsx
// components/guards/RoleGuard.tsx
interface RoleGuardProps {
  roles: ('admin' | 'coach' | 'player')[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ roles, children, fallback }: RoleGuardProps) {
  const { user } = useAuth();

  if (!roles.includes(user.role)) {
    return fallback || <Navigate to="/unauthorized" />;
  }

  return children;
}

// Bruk:
<RoleGuard roles={['coach', 'admin']}>
  <CreatePlanButton />
</RoleGuard>
```

### Feature-flags per rolle

```tsx
// hooks/useFeatureAccess.ts
export function useFeatureAccess() {
  const { user } = useAuth();

  return {
    canLogTraining: user.role === 'player',
    canCreatePlans: ['coach', 'admin'].includes(user.role),
    canViewAllPlayers: ['coach', 'admin'].includes(user.role),
    canManageUsers: user.role === 'admin',
    canConfigureSystem: user.role === 'admin',
  };
}
```

---

## 6. Data-isolasjon

### Tenant-isolasjon

All data er isolert per tenant:

```typescript
// Alle queries inkluderer tenantId
async getPlayers(tenantId: string) {
  return prisma.player.findMany({
    where: { tenantId }
  });
}
```

### Player-isolasjon

Spillere ser kun egen data:

```typescript
async getMyTrainingSessions(playerId: string) {
  return prisma.trainingSession.findMany({
    where: { playerId }
  });
}
```

### Coach-filtrering

Coaches ser kun tildelte spillere:

```typescript
async getCoachPlayers(coachId: string) {
  const assignments = await prisma.coachPlayerAssignment.findMany({
    where: { coachId },
    include: { player: true }
  });
  return assignments.map(a => a.player);
}
```

---

## 7. Dele-innstillinger

### Spiller-kontrollert deling

```prisma
model PlayerSharingSettings {
  id                String
  playerId          String  @unique

  // Hva deles med coach
  shareTrainingSessions  Boolean @default(true)
  shareTestResults       Boolean @default(true)
  shareGoals             Boolean @default(true)
  sharePersonalInfo      Boolean @default(false)
  shareTournamentResults Boolean @default(true)

  player            Player
}
```

### UI for dele-innstillinger

```
┌──────────────────────────────────────────────────────┐
│  Dele-innstillinger                                  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Hva deler du med din trener?                       │
│                                                      │
│  ☑ Treningsøkter                                    │
│  ☑ Testresultater                                   │
│  ☑ Målsettinger                                     │
│  ☐ Personlig informasjon                            │
│  ☑ Turneringsresultater                             │
│                                                      │
│  [ Lagre innstillinger ]                            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 8. Audit-logging

### Logg sensitiva handlinger

```prisma
model AuditLog {
  id          String   @id
  tenantId    String
  userId      String
  action      String   // 'view', 'create', 'update', 'delete'
  resource    String   // 'player', 'session', 'test', etc.
  resourceId  String
  details     Json?
  ipAddress   String?
  userAgent   String?
  timestamp   DateTime @default(now())
}
```

### Hva logges

| Handling | Logges | Detaljer |
|----------|--------|----------|
| Login | ✅ | IP, User-Agent |
| Se annen spillers data | ✅ | Hvem så hva |
| Endre brukerroller | ✅ | Gammel/ny rolle |
| Slette data | ✅ | Hva ble slettet |
| Eksportere data | ✅ | Hva ble eksportert |

---

## 9. Implementeringsplan

### Fase 1: Grunnleggende
- [ ] Rolle-felt på User
- [ ] requireRole middleware
- [ ] RoleGuard komponent
- [ ] Basis route-beskyttelse

### Fase 2: Coach-Player kobling
- [ ] CoachPlayerAssignment modell
- [ ] requireCoachAccess middleware
- [ ] Coach-player tilgangssjekk i queries

### Fase 3: Dele-innstillinger
- [ ] PlayerSharingSettings modell
- [ ] UI for innstillinger
- [ ] Respektere innstillinger i queries

### Fase 4: Audit
- [ ] AuditLog modell
- [ ] Logging middleware
- [ ] Admin-visning av logger

---

## 10. Sikkerhetshensyn

### Aldri stol på frontend
- All tilgangskontroll må skje på backend
- Frontend-guards er kun for UX

### Valider alltid
- Sjekk at bruker har tilgang til ressurs
- Sjekk at ressurs tilhører riktig tenant

### Logg mistenkelig aktivitet
- Mange feilede tilgangsforsøk
- Uvanlige mønstre

### Token-sikkerhet
- Kort levetid på access tokens
- Refresh token rotasjon
- Revokering ved passordbytte
