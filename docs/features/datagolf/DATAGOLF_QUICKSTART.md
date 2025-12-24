# DataGolf Integration - Quick Start Guide

*Siste oppdatering: 18. desember 2025*

## 🎯 Mål
Laste ned live golf statistikk fra DataGolf API og synkronisere med IUP database.

---

## 📋 Forutsetninger

✅ Backend API kjører (`npm run dev` i `/apps/api`)
✅ Database er oppe (PostgreSQL)
✅ Prisma migrations er kjørt
❌ **DataGolf API key** (må skaffes - se Steg 1)

---

## 🚀 Steg-for-Steg Oppsett

### Steg 1: Skaff DataGolf API Key

1. **Gå til:** https://datagolf.com
2. **Klikk:** "Sign Up" eller "Log In"
3. **Velg subscription:**
   - **Free:** Begrenset data, 50 requests/dag
   - **Pro:** $20/måned - **ANBEFALES** for full tilgang
   - **Enterprise:** Custom pricing for høyt volum

4. **Gå til Dashboard** → **API** → **Copy API Key**
5. **Lagre nøkkelen** - vi trenger den i neste steg

---

### Steg 2: Konfigurer Environment Variables

Åpne `/apps/api/.env` filen:

```bash
cd /Users/anderskristiansen/IUP_Master_V1/apps/api
nano .env
```

Finn DataGolf seksjonen (linje ~76) og oppdater:

```env
# ============================================================================
# DataGolf API Configuration
# ============================================================================
DATAGOLF_API_KEY=din_faktiske_api_key_her    # ⬅️ ENDRE DENNE
DATAGOLF_BASE_URL=https://feeds.datagolf.com
DATAGOLF_RATE_LIMIT=100
DATAGOLF_SYNC_ENABLED=true                    # ⬅️ ENDRE TIL true
DATAGOLF_SYNC_SCHEDULE=0 3 * * *
```

**Lagre:** `Ctrl+O` → `Enter` → `Ctrl+X`

---

### Steg 3: Test API Tilkobling

Kjør test scriptet for å verifisere at alt fungerer:

```bash
cd /Users/anderskristiansen/IUP_Master_V1/apps/api
npx tsx scripts/test-datagolf.ts
```

**Forventet output:**
```
🏌️  DataGolf API Connection Test
==================================================
✅ API key er konfigurert
   Lengde: 40 tegn
   Prefix: sk_live_ab...

✅ DataGolf klient opprettet

🔍 Tester tilkobling...
✅ Tilkobling vellykket!

📊 Henter tour gjennomsnitt...
   ✅ PGA: 25 stats hentet
      SG Total: 0.0
      Driving Distance: 295.5 yards
   ✅ EURO: 25 stats hentet
   ✅ KFT: 25 stats hentet

⛳ Henter player skill decompositions (PGA)...
   ✅ Hentet data for 250 spillere

   📋 Sample spiller: Rory McIlroy
      SG Total: 2.5
      SG Off Tee: 0.8
      SG Approach: 1.2
      SG Around Green: 0.3
      SG Putting: 0.2

==================================================
✅ Alle tester fullført!
```

**Hvis testen feiler:**
- ❌ `API key er ikke satt` → Sjekk at du oppdaterte .env
- ❌ `401 Unauthorized` → API key er ugyldig, sjekk DataGolf dashboard
- ❌ `429 Rate Limited` → Vent 1 time eller oppgrader subscription

---

### Steg 4: Kjør Første Sync (Tour Averages)

Synkroniser tour gjennomsnitt for PGA, DP World Tour, og Korn Ferry:

```bash
npx tsx scripts/sync-datagolf.ts --tours
```

**Forventet output:**
```
🏌️  DataGolf Sync Script
==================================================

📊 Synkroniserer Tour Gjennomsnitt...

⏳ Henter PGA Tour (2025)...
   ✅ PGA Tour: 25 stats lagret
⏳ Henter DP World Tour (2025)...
   ✅ DP World Tour: 25 stats lagret
⏳ Henter Korn Ferry Tour (2025)...
   ✅ Korn Ferry Tour: 25 stats lagret

==================================================
✅ Sync fullført!
```

---

### Steg 5: Verifiser Data i Database

Sjekk at tour averages ble lagret:

```bash
cd /Users/anderskristiansen/IUP_Master_V1/apps/api
npx prisma studio
```

1. **Åpne:** http://localhost:5555
2. **Klikk:** `DataGolfTourAverage` tabellen
3. **Sjekk:**
   - 3 rader (PGA, EURO, KFT)
   - `stats` kolonne har JSON data
   - `updatedAt` er nylig timestamp

**Alternativt via SQL:**
```bash
psql postgresql://iup_golf:dev_password@localhost:5432/iup_golf_dev

SELECT tour, season, jsonb_object_keys(stats) as stat_name
FROM datagolf_tour_averages
LIMIT 10;
```

---

### Steg 6: Start Backend API

Hvis backend ikke kjører, start den:

```bash
cd /Users/anderskristiansen/IUP_Master_V1/apps/api
npm run dev
```

**Forventet output:**
```
🚀 Server started on port 3000
✅ Database connected
✅ DataGolf sync cron job scheduled (0 3 * * *)
```

---

### Steg 7: Test Frontend Tour Benchmark Tab

1. **Åpne:** http://localhost:3001/stats
2. **Klikk:** "🏆 Tour" tab
3. **Velg:** Tour (PGA/LPGA/DP) og sesong (2025)
4. **Se:** Live DataGolf data vises i sammenligning

**Hva du skal se:**
- ✅ SG Total, Off Tee, Approach, Around Green, Putting bars
- ✅ Bubble chart: Driving Distance vs Accuracy
- ✅ Traditional stats: Scoring Avg, GIR%, Scrambling, Putts/Round
- ✅ Overall assessment med percentile

---

## 📊 Neste Steg: Sync Players (Avansert)

### Forutsetninger
- ✅ IUP players må mappes til DataGolf player IDs
- ✅ Må vite DataGolf ID for hver spiller

### Eksempel: Legg til DataGolf mapping for en spiller

```sql
-- 1. Finn IUP player
SELECT id, first_name, last_name FROM players WHERE last_name = 'McIlroy';

-- 2. Opprett DataGolf kobling (erstatt {iup_player_id} med faktisk UUID)
INSERT INTO datagolf_players (
  datagolf_id,
  player_name,
  iup_player_id,
  tour,
  season,
  last_synced
) VALUES (
  '12345',                 -- DataGolf player ID (finn via API)
  'Rory McIlroy',
  '{iup_player_id}',       -- IUP player UUID
  'PGA',
  2025,
  NOW()
);
```

### Kjør player sync

```bash
# Sync alle players med DataGolf mapping
npx tsx scripts/sync-datagolf.ts --all
```

---

## 🔄 Automatisk Daglig Sync

Cron jobben kjører automatisk hver dag kl 03:00 UTC når `DATAGOLF_SYNC_ENABLED=true`.

**Hva synkroniseres:**
1. Tour averages (PGA, DP World, Korn Ferry)
2. Alle players med `datagolf_id` (oppdaterer SG og traditional stats)

**Overvåk logs:**
```bash
tail -f logs/datagolf-sync.log
```

**Endre schedule:**
```env
# .env
DATAGOLF_SYNC_SCHEDULE=0 6 * * *  # Endret til 6 AM UTC
```

---

## 🐛 Troubleshooting

### Problem: "API key er ikke satt"
**Løsning:**
1. Sjekk at `.env` er oppdatert
2. Restart backend: `npm run dev`
3. Kjør test igjen: `npx tsx scripts/test-datagolf.ts`

---

### Problem: "401 Unauthorized"
**Løsning:**
1. Sjekk at API key er korrekt kopiert (ingen ekstra spaces)
2. Gå til DataGolf dashboard og verifiser at key er aktiv
3. Sjekk at subscription er aktiv

---

### Problem: "429 Rate Limited"
**Løsning:**
1. **Free tier:** Vent 24 timer (50 requests/dag limit)
2. **Pro tier:** Vent 1 time (100 requests/time limit)
3. Sjekk rate limit status: `getDataGolfRateLimiter().getStatus()`

---

### Problem: "No players synced"
**Løsning:**
1. Sjekk at players har `datagolf_id` i database:
   ```sql
   SELECT COUNT(*) FROM datagolf_players;
   ```
2. Hvis 0: Må manuelt mappe IUP players til DataGolf IDs (se Neste Steg)

---

## 📚 Relaterte Filer

**Backend:**
- `/apps/api/src/services/datagolf-client.ts` - API client
- `/apps/api/src/services/datagolf-sync.service.ts` - Sync service
- `/apps/api/src/jobs/datagolf-sync.cron.ts` - Cron job
- `/apps/api/src/api/v1/datagolf/` - API endpoints

**Scripts:**
- `/apps/api/scripts/test-datagolf.ts` - Test script
- `/apps/api/scripts/sync-datagolf.ts` - Manual sync script

**Frontend:**
- `/apps/web/src/features/stats/components/TourBenchmark.jsx` - Tour tab
- `/apps/web/src/features/stats/hooks/useDataGolfComparison.js` - Data hook

**Documentation:**
- `/DATAGOLF_DATABASE_OVERSIKT.md` - Database schema & mappings
- `/DATAGOLF_STATS_FORSLAG.md` - Original proposal
- `/.claude/plans/wiggly-roaming-pond.md` - Implementation plan

---

## ✅ Checklist

- [ ] DataGolf API key skaffet
- [ ] `.env` oppdatert med API key
- [ ] Test script kjørt vellykket
- [ ] Tour averages synkronisert
- [ ] Data verifisert i database
- [ ] Frontend viser live data
- [ ] Cron job aktivert
- [ ] (Valgfritt) Players mapped og synkronisert

---

**Du er nå klar til å bruke DataGolf data i IUP systemet! 🎉**
