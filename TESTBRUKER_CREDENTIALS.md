# TIER Golf Academy - Testbruker Credentials

**Opprettet**: 2026-01-09
**Status**: ✅ Alle brukere er klar til testing

---

## 🔐 LOGIN CREDENTIALS

### Admin
- **Email**: `admin@demo.com`
- **Password**: `admin123`
- **Navn**: Admin Demo
- **Rolle**: Administrator

---

### Coach (Trener)
- **Email**: `coach@demo.com`
- **Password**: `coach123`
- **Navn**: Jørn Johnsen
- **Rolle**: Coach/Trener
- **Spesialiseringer**: Driver, Short Game, Mental Training, Tournament Preparation
- **Sertifiseringer**: PGA Professional, Team Norway Coach, Level 3 Golf Coach
- **Telefon**: +47 900 12 345

---

### Players (Spillere) - Alle bruker passord: `player123`

#### 1. Andreas Holm (Primary Demo Player)
- **Email**: `player@demo.com`
- **Password**: `player123`
- **Kategori**: B
- **Handicap**: 5.4
- **Klubb**: Oslo GK
- **Skole**: WANG Toppidrett Oslo
- **Kjønn**: Mann
- **Mål**: Team Norway Junior, Reach Category A, Improve driver distance

#### 2. Øyvind Rohjan
- **Email**: `oyvind.rohjan@demo.com`
- **Password**: `player123`
- **Kategori**: B
- **Handicap**: 4.8
- **Klubb**: Oslo GK
- **Skole**: WANG Toppidrett Oslo
- **Kjønn**: Mann
- **Mål**: Team Norway Junior, Reach Category A, Improve driver accuracy

#### 3. Nils Jonas Lilja
- **Email**: `nils.lilja@demo.com`
- **Password**: `player123`
- **Kategori**: B
- **Handicap**: 5.2
- **Klubb**: Oslo GK
- **Skole**: WANG Toppidrett Oslo
- **Kjønn**: Mann
- **Mål**: Team Norway Junior, Consistent ball striking, Improve putting

#### 4. Carl Johan Gustavsson
- **Email**: `carl.gustavsson@demo.com`
- **Password**: `player123`
- **Kategori**: C
- **Handicap**: 8.5
- **Klubb**: Oslo GK
- **Skole**: WANG Toppidrett Oslo
- **Kjønn**: Mann
- **Mål**: Team Norway Junior, Break 80 consistently, Improve fitness

#### 5. Caroline Diethelm
- **Email**: `caroline.diethelm@demo.com`
- **Password**: `player123`
- **Kategori**: A
- **Handicap**: 3.2
- **Klubb**: Oslo GK
- **Skole**: WANG Toppidrett Oslo
- **Kjønn**: Kvinne
- **Mål**: Team Norway Junior, Qualify for national team, Improve iron play

#### 6. Test Spiller
- **Email**: `test@akgolf.no`
- **Password**: `player123`
- **Kategori**: (varies)
- **Note**: General test account

---

## 📊 DEMO DATA TILGJENGELIG

Database inneholder følgende demo-data:

| Data Type | Count | Description |
|-----------|-------|-------------|
| **Training Sessions** | 224 | Historiske treningsøkter |
| **Goals** | 8 | Spillermål |
| **Tests** | 20 | Test protokoller |
| **Players** | 10 | Aktive spillere |
| **Coaches** | 3 | Aktive trenere |
| **Exercises** | ~300 | Øvelsesbibliotek |
| **Tournaments** | Multiple | Events og turneringer |

---

## 🚀 HVORDAN LOGGE INN

### Frontend (Web App)
1. Start frontend: `cd apps/web && npm start`
2. Åpne: http://localhost:3000
3. Logg inn med en av brukerne over

### Backend API
- **Base URL**: http://localhost:4000/api/v1
- **Health Check**: http://localhost:4000/health
- **Swagger Docs**: http://localhost:4000/documentation (hvis aktivert)

### Login via API:
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"player@demo.com","password":"player123"}'
```

---

## ✅ VERIFIKASJON

Alle brukere er verifisert og fungerende:
- ✅ Admin login: Fungerer
- ✅ Coach login: Fungerer
- ✅ Player login: Fungerer

---

## 🎯 ANBEFALTE TEST SCENARIER

### Spiller (Player) Perspektiv
1. **Dashboard**: Se treningsøkter, mål, og progresjon
2. **Treningsplan**: Sjekk ukentlige og daglige planer
3. **Videoanalyse**: Last opp video, sammenlign, annote
4. **Statistikk**: Se grafer og trendlinjer
5. **Booking**: Book tid med trener (Coach: Jørn Johnsen)
6. **Mål**: Opprett nye mål og track fremgang
7. **Tester**: Utfør tester og se resultater

### Trener (Coach) Perspektiv
1. **Athletes Dashboard**: Se alle spillere
2. **Booking Calendar**: Se bookings fra spillere
3. **Create Training Plans**: Opprett treningsplaner
4. **Video Review**: Se og kommenter på spillervideoer
5. **Progress Reports**: Generer rapporter
6. **Communication**: Send meldinger til spillere

### Admin Perspektiv
1. **User Management**: Administrer brukere
2. **Analytics**: Se plattform statistikk
3. **System Config**: Konfigurer innstillinger

---

## 📝 NOTATER

- Alle spillere er tilknyttet **Oslo GK**
- Alle spillere går på **WANG Toppidrett Oslo**
- Alle spillere er tilknyttet coach **Jørn Johnsen**
- Emergency contacts er mock data
- Profil bilder er placeholders (paths finnes men images må lastes opp)

---

## 🔧 TROUBLESHOOTING

### Hvis login feiler:
1. Sjekk at backend kjører: `curl http://localhost:4000/health`
2. Sjekk database: `docker ps | grep postgres`
3. Restart services hvis nødvendig

### Hvis data mangler:
1. Data finnes allerede i databasen
2. Kjør migrations hvis nødvendig: `npm run prisma:migrate`
3. Kjør seed hvis nødvendig: `npm run prisma:seed`

---

**Sist oppdatert**: 2026-01-09
**Database**: iup_golf_dev (PostgreSQL via Docker)
**Backend**: Fastify API på port 4000
**Frontend**: React på port 3000
