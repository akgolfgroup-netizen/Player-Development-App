# Setup & Test Guide - IUP Golf Academy

> Komplett guide for å kjøre migrering og teste alle nye funksjoner
> Dato: 15. desember 2025

---

## 🚀 QUICK START

### 1. Start Database

```bash
cd "/Users/anderskristiansen/Library/Mobile Documents/com~apple~CloudDocs/01. Projects/Active/IUP_Master_V1/backend-fastify/docker"

# Start kun PostgreSQL
docker compose up -d postgres

# Eller start alt (PostgreSQL + Redis + MinIO)
docker compose up -d
```

### 2. Kjør Migrering

```bash
cd "/Users/anderskristiansen/Library/Mobile Documents/com~apple~CloudDocs/01. Projects/Active/IUP_Master_V1/backend-fastify"

# Generate Prisma client
npx prisma generate

# Kjør migrering (oppretter nye tabeller)
npx prisma migrate dev --name add_test_comparison_system
```

### 3. Seed Database

```bash
# Seed kategori-krav (440 requirements)
npm run prisma:seed

# Eller direkte:
tsx prisma/seed.ts
```

### 4. Start Server

```bash
# Development mode med hot reload
npm run dev

# Server starter på: http://localhost:3000
# Swagger UI: http://localhost:3000/documentation
```

---

## 🧪 TESTING

### Swagger UI (Anbefalt for manuell testing)

1. Åpne: `http://localhost:3000/documentation`
2. Authenticate med bearer token
3. Test endepunkter interaktivt

### API Endpoints å teste

#### ✅ **Test 1: Record Enhanced Test Result**

```bash
POST http://localhost:3000/api/v1/tests/results/enhanced

Body:
{
  "playerId": "your-player-uuid",
  "testNumber": 1,
  "testDate": "2025-12-15T10:00:00Z",
  "testTime": "14:30",
  "location": "Oslo GK",
  "facility": "Driving Range",
  "environment": "outdoor",
  "conditions": {
    "weather": "Sunny",
    "wind": "Light",
    "temperature": 18
  },
  "testData": {
    "shots": [
      { "shotNumber": 1, "carryDistanceMeters": 265 },
      { "shotNumber": 2, "carryDistanceMeters": 270 },
      { "shotNumber": 3, "carryDistanceMeters": 268 },
      { "shotNumber": 4, "carryDistanceMeters": 262 },
      { "shotNumber": 5, "carryDistanceMeters": 271 },
      { "shotNumber": 6, "carryDistanceMeters": 269 }
    ]
  }
}
```

**Forventet Response:**
```json
{
  "success": true,
  "data": {
    "testResult": {
      "id": "...",
      "value": 270.0,
      "passed": true,
      "categoryRequirement": 270,
      "percentOfRequirement": 100.0,
      "pei": null
    },
    "peerComparison": {
      "playerPercentile": 75.5,
      "playerRank": 12,
      "peerCount": 48,
      "comparisonText": "Very good! Top 25% among 48 peers"
    },
    "categoryRequirement": { ... }
  }
}
```

#### ✅ **Test 2: Get Player Overview**

```bash
GET http://localhost:3000/api/v1/coach-analytics/players/{playerId}/overview
```

**Forventet Response:**
```json
{
  "success": true,
  "data": {
    "playerName": "Ole Nordmann",
    "category": "D",
    "testsCompleted": 15,
    "totalTests": 20,
    "completionPercentage": 75,
    "testsPassed": 12,
    "testsFailed": 3,
    "passRate": 80,
    "overallPercentile": 72,
    "strengthAreas": [1, 8, 15],
    "weaknessAreas": [12, 14],
    "testSummaries": [...]
  }
}
```

#### ✅ **Test 3: Peer Comparison**

```bash
GET http://localhost:3000/api/v1/peer-comparison?playerId={id}&testNumber=1
```

#### ✅ **Test 4: Multi-Level Comparison**

```bash
GET http://localhost:3000/api/v1/peer-comparison/multi-level?playerId={id}&testNumber=1
```

#### ✅ **Test 5: Category Progression**

```bash
GET http://localhost:3000/api/v1/coach-analytics/players/{playerId}/category-progression
```

#### ✅ **Test 6: Apply Filter**

```bash
POST http://localhost:3000/api/v1/filters/apply

Body:
{
  "filters": {
    "categories": ["C", "D", "E"],
    "gender": "M",
    "ageRange": { "min": 16, "max": 20 }
  },
  "limit": 20
}
```

#### ✅ **Test 7: Compare to DataGolf**

```bash
GET http://localhost:3000/api/v1/datagolf/compare?playerId={id}&tour=PGA&season=2025
```

---

## 🗄️ DATABASE VERIFICATION

### Check Tables

```bash
# Connect to database
docker exec -it iup-golf-postgres psql -U postgres -d ak_golf_iup

# List tables
\dt

# Verify new tables exist:
# - category_requirements
# - peer_comparisons
# - datagolf_players
# - datagolf_tour_averages
# - saved_filters
# - analytics_cache
```

### Check Seed Data

```sql
-- Check category requirements
SELECT category, gender, test_number, requirement
FROM category_requirements
WHERE test_number = 1
ORDER BY category, gender;

-- Should return 22 rows (11 categories × 2 genders)
```

### Check Test Results

```sql
-- View test results with new fields
SELECT
  id,
  test_id,
  player_id,
  value,
  passed,
  category_requirement,
  percent_of_requirement
FROM test_results
LIMIT 10;
```

---

## 📊 POSTMAN COLLECTION

### Import this collection:

```json
{
  "info": {
    "name": "IUP Golf Academy - Enhanced API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Tests",
      "item": [
        {
          "name": "Record Enhanced Test Result",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": "{{baseUrl}}/api/v1/tests/results/enhanced",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"playerId\": \"{{playerId}}\",\n  \"testNumber\": 1,\n  \"testDate\": \"2025-12-15T10:00:00Z\",\n  \"location\": \"Oslo GK\",\n  \"facility\": \"Driving Range\",\n  \"environment\": \"outdoor\",\n  \"testData\": {\n    \"shots\": [\n      {\"shotNumber\": 1, \"carryDistanceMeters\": 265},\n      {\"shotNumber\": 2, \"carryDistanceMeters\": 270},\n      {\"shotNumber\": 3, \"carryDistanceMeters\": 268},\n      {\"shotNumber\": 4, \"carryDistanceMeters\": 262},\n      {\"shotNumber\": 5, \"carryDistanceMeters\": 271},\n      {\"shotNumber\": 6, \"carryDistanceMeters\": 269}\n    ]\n  }\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Get Test Result with Comparison",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": "{{baseUrl}}/api/v1/tests/results/{{testResultId}}/enhanced"
          }
        }
      ]
    },
    {
      "name": "Peer Comparison",
      "item": [
        {
          "name": "Get Peer Comparison",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/v1/peer-comparison?playerId={{playerId}}&testNumber=1",
              "host": ["{{baseUrl}}"],
              "path": ["api", "v1", "peer-comparison"],
              "query": [
                { "key": "playerId", "value": "{{playerId}}" },
                { "key": "testNumber", "value": "1" }
              ]
            }
          }
        },
        {
          "name": "Get Multi-Level Comparison",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/v1/peer-comparison/multi-level?playerId={{playerId}}&testNumber=1",
              "host": ["{{baseUrl}}"],
              "path": ["api", "v1", "peer-comparison", "multi-level"],
              "query": [
                { "key": "playerId", "value": "{{playerId}}" },
                { "key": "testNumber", "value": "1" }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Coach Analytics",
      "item": [
        {
          "name": "Get Player Overview",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": "{{baseUrl}}/api/v1/coach-analytics/players/{{playerId}}/overview"
          }
        },
        {
          "name": "Get Category Progression",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": "{{baseUrl}}/api/v1/coach-analytics/players/{{playerId}}/category-progression"
          }
        },
        {
          "name": "Get Team Analytics",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": "{{baseUrl}}/api/v1/coach-analytics/team/{{coachId}}"
          }
        },
        {
          "name": "Compare Players",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": "{{baseUrl}}/api/v1/coach-analytics/compare-players",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"playerIds\": [\"{{playerId1}}\", \"{{playerId2}}\"],\n  \"testNumbers\": [1, 8, 15]\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        }
      ]
    },
    {
      "name": "Filters",
      "item": [
        {
          "name": "Apply Filter",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": "{{baseUrl}}/api/v1/filters/apply",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"filters\": {\n    \"categories\": [\"C\", \"D\", \"E\"],\n    \"gender\": \"M\",\n    \"ageRange\": { \"min\": 16, \"max\": 20 }\n  },\n  \"limit\": 20\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Create Saved Filter",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": "{{baseUrl}}/api/v1/filters",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"coachId\": \"{{coachId}}\",\n  \"name\": \"Junior Spillere 16-20\",\n  \"description\": \"Alle junior spillere mellom 16-20 år\",\n  \"filters\": {\n    \"categories\": [\"C\", \"D\", \"E\"],\n    \"ageRange\": { \"min\": 16, \"max\": 20 }\n  }\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        }
      ]
    },
    {
      "name": "DataGolf",
      "item": [
        {
          "name": "Compare to Tour",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/v1/datagolf/compare?playerId={{playerId}}&tour=PGA&season=2025",
              "host": ["{{baseUrl}}"],
              "path": ["api", "v1", "datagolf", "compare"],
              "query": [
                { "key": "playerId", "value": "{{playerId}}" },
                { "key": "tour", "value": "PGA" },
                { "key": "season", "value": "2025" }
              ]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "token",
      "value": "your-jwt-token-here"
    },
    {
      "key": "playerId",
      "value": "player-uuid-here"
    },
    {
      "key": "coachId",
      "value": "coach-uuid-here"
    }
  ]
}
```

---

## 🐛 TROUBLESHOOTING

### Problem: Migrering feiler

```bash
# Reset database og start på nytt
docker compose down -v
docker compose up -d postgres
npx prisma migrate dev --name add_test_comparison_system
```

### Problem: TypeScript errors

```bash
# Regenerate Prisma client
npx prisma generate

# Restart TypeScript server i editor
```

### Problem: Seed feiler

```bash
# Check if tables exist
npx prisma studio

# Manuelt kjør seed
tsx prisma/seeds/category-requirements.ts
```

### Problem: Port 3000 i bruk

```bash
# Finn prosess
lsof -ti:3000

# Kill prosess
kill -9 $(lsof -ti:3000)

# Eller endre port i .env
PORT=3001
```

---

## 📈 PERFORMANCE TESTING

### Load Testing med k6

```javascript
// test-load.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  let response = http.get('http://localhost:3000/health');
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
```

```bash
# Run load test
k6 run test-load.js
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Database startet og kjører
- [ ] Migrering fullført uten feil
- [ ] Seed-data lastet inn (440 requirements)
- [ ] Server starter uten errors
- [ ] Swagger UI tilgjengelig
- [ ] Health check fungerer: `GET /health`
- [ ] Auth fungerer (login/register)
- [ ] Kan opprette test-resultat med enhanced endpoint
- [ ] Peer comparison kalkuleres automatisk
- [ ] Player overview viser korrekt data
- [ ] Filter system fungerer
- [ ] DataGolf endpoints svarer

---

## 🎓 NEXT STEPS

1. **Frontend Integration**
   - Bygg React/Vue forms for test input
   - Vis peer comparison visuelt
   - Coach dashboard med charts

2. **Mobile App**
   - React Native app for spillere
   - Offline-støtte for test-input
   - Push notifications for resultater

3. **Advanced Features**
   - Real-time updates (WebSocket)
   - Video-analyse integrasjon
   - ML-modell for progresjon

4. **Production Deployment**
   - Deploy til cloud (AWS/Azure/GCP)
   - Setup CI/CD pipeline
   - Monitoring og logging

---

**Status**: ✅ Klar for testing!
**Support**: Se IMPLEMENTATION_SUMMARY.md for fullstendig API dokumentasjon
