# New Developer Onboarding Guide

> Welcome to TIER Golf IUP Platform! 🎉
> **For**: New developers joining the project
> **Time**: ~2-3 hours to get fully set up
> **Updated**: December 16, 2025

---

## 👋 Welcome!

You're joining a production-ready web application for managing Individual Development Plans (IUP) for junior golfers. This guide will get you from zero to productive in a few hours.

---

## 📚 Step 1: Read the Documentation (30 min)

### Start Here (Read in order):

1. **[README.md](./README.md)** (10 min)
   - Project overview
   - Quick start commands
   - Tech stack
   - Features list

2. **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** (15 min)
   - Complete architecture
   - Folder structure
   - Code patterns
   - Current state

3. **[AUTHENTICATION_COMPLETE.md](./AUTHENTICATION_COMPLETE.md)** (5 min)
   - How auth works
   - Login flow
   - Demo credentials

### Reference (Skim, read as needed):

- [INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md) - apps/web-backend integration
- [DESIGN_SOURCE_OF_TRUTH.md](./DESIGN_SOURCE_OF_TRUTH.md) - Design system
- [/apps/api/QUICK_START.md](./apps/api/QUICK_START.md) - Backend setup
- [/apps/api/IMPLEMENTATION_SUMMARY.md](./apps/api/IMPLEMENTATION_SUMMARY.md) - Full API docs

**Key Takeaways**:
- ✅ React apps/web on port 3001
- ✅ Fastify backend on port 3000
- ✅ PostgreSQL + Redis + Docker
- ✅ JWT authentication
- ✅ 13 screens, 40+ API endpoints

---

## 💻 Step 2: Environment Setup (45 min)

### Prerequisites

Install these if you don't have them:

```bash
# Check versions
node --version    # Should be v20+
npm --version     # Should be v10+
docker --version  # Should be v24+
git --version     # Any recent version

# Optional but recommended
pnpm --version    # Should be v8+
```

**Don't have them?**
- **Node.js**: https://nodejs.org (Download v20 LTS)
- **Docker Desktop**: https://www.docker.com/products/docker-desktop/
- **pnpm**: `npm install -g pnpm@8.12.1`

### Clone & Install

```bash
# 1. Navigate to project (if not already there)
cd "/Users/anderskristiansen/Library/Mobile Documents/com~apple~CloudDocs/01. Projects/Active/IUP_Master_V1"

# 2. Install backend dependencies
cd apps/api
npm install
# (This will take 2-3 minutes)

# 3. Install apps/web dependencies
cd ../apps/web
npm install
# (This will take 2-3 minutes)

# 4. Go back to root
cd ..
```

### Configure Environment

```bash
# Backend environment
cd apps/api
cp .env.example .env
# Edit .env if needed (defaults work for local dev)

# apps/web environment
cd ../apps/web
cp .env.example .env || echo "PORT=3001\nREACT_APP_API_URL=http://localhost:3000/api/v1" > .env
```

---

## 🐳 Step 3: Start Infrastructure (15 min)

### Start Docker

```bash
# Make sure Docker Desktop is running
# Check: docker ps (should not error)

# Start Database & cache
cd apps/api
docker-compose up -d

# Wait ~10 seconds for containers to be healthy
docker ps
# Should show: coaching-postgres (healthy), coaching-redis (healthy)
```

### Setup Database

```bash
# Still in apps/api/

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed demo data (creates 3 users)
npm run prisma:seed
# Creates: admin@demo.com, coach@demo.com, player@demo.com
```

**Verify**:
```bash
# Check Database
npx prisma studio
# Opens http://localhost:5555 - browse tables
```

---

## 🚀 Step 4: Start the App (10 min)

### Terminal 1: Backend

```bash
cd apps/api
npm run dev

# You should see:
# Server listening at http://0.0.0.0:3000
# ✓ Connected to Database
# ✓ Connected to Redis
```

**Test it**:
```bash
# In another terminal:
curl http://localhost:3000/health

# Should return:
# {"status":"ok","timestamp":"...","uptime":...}
```

### Terminal 2: apps/web

```bash
cd apps/web
npm start

# You should see:
# webpack compiled successfully
# Local: http://localhost:3001
# On Your Network: http://192.168.x.x:3001
```

**Test it**: Open http://localhost:3001 in browser

---

## 🎮 Step 5: Explore the App (20 min)

### Login

1. Go to http://localhost:3001
2. You'll be redirected to `/login`
3. Click **"Spiller (player@demo.com)"** demo button
4. You're logged in as Ole Hansen (player)

### Navigate Around

- **Dashboard** - Main overview (placeholder data)
- **Brukerprofil** - User profile
- **Trenerteam** - Coach team
- **Målsetninger** - Goals
- **Årsplan** - Annual plan
- **Testprotokoll** - Test protocols
- **Testresultater** - Test results
- **Treningsprotokoll** - Training log
- **Treningsstatistikk** - Training stats
- **Øvelser** - Exercises
- **Notater** - Notes
- **Arkiv** - Archive
- **Kalender** - Calendar

**Notice**:
- Sidebar navigation works
- User info shown at bottom (name, email)
- "Logg ut" button available
- All screens load (but most show mock data)

### Try Different Users

Logout and login as:
- **Coach**: coach@demo.com / coach123 (Anders Kristiansen)
- **Admin**: admin@demo.com / admin123 (Full access)

### Test Backend API

```bash
# Login via API
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"admin123"}'

# Copy the accessToken from response

# Use token to list players
curl http://localhost:3000/api/v1/players \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🛠️ Step 6: Development Workflow (30 min)

### Code Organization

```
Your workflow:
  apps/web/src/components/  → UI components (React)
  apps/web/src/services/    → API calls (Axios)
  apps/api/src/api/  → API routes
  apps/api/src/domain/ → Business logic
  apps/api/prisma/   → Database schema
```

### Make Your First Change

Let's add a welcome message to the Dashboard:

1. **Open** `frontend/src/components/AKGolfDashboard.jsx`

2. **Find** the main return statement (around line 400+)

3. **Add** this at the top of the component:
   ```jsx
   <div style={{
     padding: '16px',
     backgroundColor: '#E8F5E9',
     borderRadius: '8px',
     marginBottom: '24px'
   }}>
     <h3 style={{ margin: 0 }}>Welcome, {user?.firstName || 'Guest'}! 🎉</h3>
     <p style={{ margin: '8px 0 0' }}>You're working on a production-ready app!</p>
   </div>
   ```

4. **Import** useAuth at the top:
   ```jsx
   import { useAuth } from '../contexts/AuthContext';
   ```

5. **Add** the hook:
   ```jsx
   const { user } = useAuth();
   ```

6. **Save** - apps/web should hot-reload

7. **Check** http://localhost:3001 - see your message!

### Make a Backend Change

Let's add a custom endpoint:

1. **Create** `apps/api/src/api/v1/hello/index.ts`:
   ```typescript
   import { FastifyPluginAsync } from 'fastify';

   const helloRoutes: FastifyPluginAsync = async (fastify) => {
     fastify.get('/', async (req, reply) => {
       return {
         message: 'Hello from IUP Golf!',
         user: req.user?.firstName || 'Anonymous',
         timestamp: new Date().toISOString()
       };
     });
   };

   export default helloRoutes;
   ```

2. **Register** it in `apps/api/src/app.ts`:
   ```typescript
   import helloRoutes from './api/v1/hello';
   // ...
   fastify.register(helloRoutes, { prefix: '/api/v1/hello' });
   ```

3. **Test**:
   ```bash
   curl http://localhost:3000/api/v1/hello
   ```

### Run Tests

```bash
# Backend tests
cd apps/api
npm test

# apps/web tests (if configured)
cd apps/web
npm test
```

---

## 📖 Step 7: Learn the Codebase (ongoing)

### Key Patterns

**apps/web**:
- **Components** - React functional components with hooks
- **Context** - AuthContext for global auth state
- **Services** - api.js for all backend communication
- **Routing** - React Router with protected routes
- **Styling** - Inline styles (Design System v2.1 tokens)

**Backend**:
- **Routes** - Fastify route handlers in `/api/v1/`
- **Services** - Business logic in service classes
- **Domain** - Complex calculations in `/domain/`
- **Middleware** - Auth, tenant, rate-limit
- **Prisma** - Type-safe Database access

### Important Files to Know

| File | What It Does |
|------|-------------|
| `frontend/src/App.jsx` | Main app, routing, auth provider |
| `frontend/src/services/api.js` | All API calls |
| `frontend/src/contexts/AuthContext.jsx` | Auth state management |
| `apps/api/src/app.ts` | Fastify app setup, plugin registration |
| `apps/api/src/api/v1/*/index.ts` | Route definitions |
| `apps/api/prisma/schema.prisma` | Database schema |
| `apps/api/src/middleware/auth.ts` | JWT authentication |

### Design System

Colors:
- `#10456A` - Forest (primary)
- `#EDF0F2` - Foam (background)
- `#EBE5DA` - Ivory (surface)
- `#C9A227` - Gold (accent)

Typography:
- Font: Inter (imported from Google Fonts)
- Title: 28px, 700 weight
- Body: 17px, 400 weight
- Button: 17px, 600 weight

Icons:
- Lucide React library
- 24x24px, 1.5px stroke

**Full guide**: [DESIGN_SOURCE_OF_TRUTH.md](./DESIGN_SOURCE_OF_TRUTH.md)

---

## 🎯 Step 8: Pick Your First Task (15 min)

### Easy Wins (Good for first day)

1. **Connect Brukerprofil to Backend**
   - File: `frontend/src/components/ak_golf_brukerprofil_onboarding.jsx`
   - Task: Replace mock data with `playersAPI.getById(user.id)`
   - Time: ~1 hour

2. **Add Loading States**
   - File: Any component
   - Task: Add loading spinner while fetching data
   - Time: ~30 min

3. **Fix ESLint Warnings**
   - Run: `npm run lint` in apps/web/
   - Fix: Unused variables
   - Time: ~30 min

### Medium Tasks (Good for first week)

1. **Connect Trenerteam to Backend**
   - Fetch real coach data
   - Display coach list dynamically
   - Time: ~2 hours

2. **Add Form Validation**
   - Use Zod or react-hook-form
   - Validate user inputs
   - Time: ~3 hours

3. **Create Test Results Form**
   - Submit test results
   - Call `/api/v1/tests/results/enhanced`
   - Time: ~4 hours

### Challenging Tasks (Good for learning)

1. **Build Real-time Notifications**
   - WebSocket integration
   - Toast notifications
   - Time: ~1 day

2. **Add File Upload**
   - Profile images
   - Test result documents
   - Time: ~1-2 days

3. **Create Analytics Dashboard**
   - Charts with recharts/victory
   - Real data from `/api/v1/coach-analytics`
   - Time: ~2-3 days

---

## 🤔 Common Questions

**Q: Which backend should I use?**
A: **apps/api/** - It's the active one. `/backend/` is legacy.

**Q: Can I use the existing components?**
A: Yes! All 13 screen components exist. Just need API integration.

**Q: Where are the API docs?**
A: [/apps/api/IMPLEMENTATION_SUMMARY.md](./apps/api/IMPLEMENTATION_SUMMARY.md)

**Q: How do I add a new API endpoint?**
A:
1. Create `/apps/api/src/api/v1/your-feature/index.ts`
2. Register in `app.ts`
3. Add to `/apps/web/src/services/api.js`

**Q: How do I add a Database table?**
A:
1. Edit `/apps/api/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_change`
3. Run `npx prisma generate`

**Q: Tests are failing, what do I do?**
A: Check the test output, fix the issue, re-run. Most likely:
- Missing environment variable
- Database not running
- Wrong test data

**Q: Can I use TypeScript in apps/web?**
A: Currently it's JavaScript. You can migrate files to .tsx gradually.

---

## 🆘 Getting Help

### Documentation

1. Check [README.md](./README.md)
2. Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
3. Check specific docs in `/docs/`
4. Check backend API docs

### Debugging

**apps/web issues**:
```bash
# Check browser console (F12)
# Check React DevTools
# Check network tab for API calls
```

**Backend issues**:
```bash
# Check server logs in terminal
# Check Database with: npx prisma studio
# Check Docker logs: docker logs coaching-postgres
```

### Common Errors

**Port already in use**:
```bash
lsof -i :3000  # or :3001
kill -9 <PID>
```

**Database connection error**:
```bash
docker-compose down
docker-compose up -d
```

**apps/web won't compile**:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Onboarding Checklist

- [ ] Read README.md
- [ ] Read PROJECT_STRUCTURE.md
- [ ] Read AUTHENTICATION_COMPLETE.md
- [ ] Installed Node.js, Docker, pnpm
- [ ] Cloned/accessed repository
- [ ] Installed dependencies (apps/web + backend)
- [ ] Started Docker containers
- [ ] Setup Database (migrate + seed)
- [ ] Started backend (http://localhost:3000)
- [ ] Started apps/web (http://localhost:3001)
- [ ] Logged in as demo user
- [ ] Explored all 13 screens
- [ ] Made first code change
- [ ] Tested backend API
- [ ] Read design system guide
- [ ] Picked first task
- [ ] Joined team communication channels
- [ ] Asked questions when stuck

---

## 🎉 You're Ready!

Congratulations! You're now fully onboarded and ready to contribute.

**Next Steps**:
1. Pick a task from "Easy Wins"
2. Create a feature branch: `git checkout -b feature/your-task`
3. Make changes
4. Test locally
5. Commit with conventional commits: `feat: add user profile API integration`
6. Submit PR for review
7. Get feedback, iterate
8. Ship it! 🚀

**Welcome to the team! Happy coding! 💻**
