# 🏌️ IUP Golf Academy - Quick Demo

## 🚀 One-Command Start

```bash
./start-demo.sh
```

This will automatically:
- ✅ Start PostgreSQL + Redis databases
- ✅ Apply all migrations (including new AI features)
- ✅ Seed demo data
- ✅ Start backend API on http://localhost:3000
- ✅ Start frontend web app on http://localhost:3001
- ✅ Open the app in your browser

## 🔐 Demo Login

```
Email:    player@example.com
Password: password123
```

## 🎯 Key Features to Try

1. **Dashboard** - Training statistics and overview
2. **Goals** - Create and track goals with auto-progress
3. **Notes** - Training notes with tags and categories
4. **Achievements** - Unlock and view achievements with tiers
5. **🆕 Season Onboarding** - AI-powered baseline recommendation
6. **Training Sessions** - Log and track training
7. **Bookings** - Schedule sessions with coaches
8. **Tests** - Skill assessments and calibration

## 📚 Full Documentation

- **Startup Guide:** [START_DEMO.md](./START_DEMO.md)
- **Complete Features:** [100_PERCENT_COMPLETE.md](./100_PERCENT_COMPLETE.md)
- **AI Recommendation:** [SEASON_ONBOARDING_AI_COMPLETE.md](./SEASON_ONBOARDING_AI_COMPLETE.md)

## 🌐 URLs

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000
- **API Docs:** http://localhost:3000/docs
- **Health Check:** http://localhost:3000/health

## 🛑 Stop the Demo

Press `Ctrl+C` in the terminal windows, or run:

```bash
docker-compose -f apps/api/docker-compose.yml down
```

---

**Need help?** Check [START_DEMO.md](./START_DEMO.md) for detailed instructions.
