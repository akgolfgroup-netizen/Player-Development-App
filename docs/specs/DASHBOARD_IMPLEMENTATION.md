# Dashboard Implementation - TIER Golf

> **Implementert:** 15. desember 2025
> **Design Kilde:** `/Design/figma/ak_golf_complete_figma_kit.svg`

---

## Oversikt

Dashboard-modulen gir spillere en komplett oversikt over deres treningsprogresjon, oppnåelser, mål og kommunikasjon.

---

## Nye Database-modeller

### Training Statistics
| Modell | Tabell | Beskrivelse |
|--------|--------|-------------|
| `WeeklyTrainingStats` | `weekly_training_stats` | Ukentlig aggregert statistikk |
| `MonthlyTrainingStats` | `monthly_training_stats` | Månedlig oppsummering |
| `DailyTrainingStats` | `daily_training_stats` | Daglig oversikt med streak |

### Achievements & Badges
| Modell | Tabell | Beskrivelse |
|--------|--------|-------------|
| `AchievementDefinition` | `achievement_definitions` | Badge-definisjoner |
| `PlayerAchievement` | `player_achievements` | Opptjente badges |

### Player Goals
| Modell | Tabell | Beskrivelse |
|--------|--------|-------------|
| `PlayerGoal` | `player_goals` | Spillermål med progress |

### Messaging
| Modell | Tabell | Beskrivelse |
|--------|--------|-------------|
| `ChatGroup` | `chat_groups` | Chat-grupper |
| `ChatGroupMember` | `chat_group_members` | Medlemskap |
| `ChatMessage` | `chat_messages` | Meldinger |

---

## React Komponenter

Lokasjon: `IUP_Master_Folder_2/frontend/src/components/dashboard/`

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `Dashboard` | `Dashboard.jsx` | Hovedkomponent |
| `PeriodCard` | `PeriodCard.jsx` | Aktiv periode-oversikt |
| `TimelineSession` | `TimelineSession.jsx` | Dagens økter (Notion-stil) |
| `AchievementsBadges` | `AchievementsBadges.jsx` | Badges med scroll |
| `GoalCard` | `GoalCard.jsx` | Mål med progress |
| `WeeklyStats` | `WeeklyStats.jsx` | Ukentlig statistikk |
| `MessagesList` | `MessagesList.jsx` | Meldinger med ulest |

### Bruk

```jsx
import { Dashboard } from './components/dashboard';

const DashboardPage = () => {
  const data = {
    player: { firstName: 'Ola', category: 'B', averageScore: 74.2 },
    period: { type: 'G', number: 1, focusAreas: ['Teknikk', 'Langspill'] },
    todaySessions: [...],
    badges: [...],
    goals: [...],
    weeklyStats: { period: 'Uke 50', stats: [...] },
    messages: [...],
  };

  return <Dashboard {...data} />;
};
```

---

## API Endepunkter

Base URL: `/api/v1/dashboard`

### GET /dashboard
Henter komplett dashboard for innlogget spiller.

**Response:**
```json
{
  "player": { "id": "...", "firstName": "Ola", "category": "B" },
  "period": { "type": "G", "number": 1, "focusAreas": ["Teknikk"] },
  "todaySessions": [...],
  "badges": [...],
  "goals": [...],
  "weeklyStats": { "period": "Uke 50", "stats": [...] },
  "messages": [...],
  "unreadCount": 3
}
```

### GET /dashboard/:playerId
Henter dashboard for spesifikk spiller (coach/admin).

### GET /dashboard/weekly-stats
Henter ukentlig statistikk.

### GET /dashboard/badges
Henter alle badges for spiller.

### GET /dashboard/goals
Henter alle mål for spiller.

---

## Tag-system

### Learning Phases (L1-L5)
| Tag | Farge | Beskrivelse |
|-----|-------|-------------|
| L1 | Light green | Introduksjon |
| L2 | Light green | Grunnleggende |
| L3 | Medium green | Ferdighet |
| L4 | Success green | Kompetanse |
| L5 | Blue Primary | Automatikk |

### Club Speeds (CS20-CS100)
| Tag | Farge | Hastighet |
|-----|-------|-----------|
| CS20-CS40 | Light green | Lav |
| CS60 | Light green | Medium |
| CS80 | Medium green | Høy |
| CS100 | Blue Primary | Full |

### Settings (S1-S10)
| Tag | Farge | Setting |
|-----|-------|---------|
| S1-S5 | Light gold | Enkel |
| S6-S8 | Medium gold | Medium |
| S9-S10 | Gold | Krevende |

---

## Seed Data

Kjør for å populere testdata:

```bash
cd backend-fastify
npx ts-node prisma/seed-dashboard.ts
```

Dette lager:
- 11 achievement definitions
- 4 player achievements
- 4 player goals
- Weekly training stats
- 3 chat groups med meldinger

---

## Design Tokens

> **KILDE:** `/Design/figma/ak_golf_complete_figma_kit.svg`
> **Versjon:** Design System v2.1

### Brand Colors
| Navn | Hex | Bruk |
|------|-----|------|
| Blue Primary | `#10456A` | Primary |
| **Blue Light** | `#2C5F7F` | Secondary |
| **Foam** | `#EDF0F2` | Background |
| **Ivory** | `#EBE5DA` | Surface |
| **Gold** | `#C9A227` | Accent |

### Semantic Colors
| Navn | Hex | Bruk |
|------|-----|------|
| **Success** | `#4A7C59` | Fullført, Positiv |
| **Warning** | `#D4A84B` | Advarsel, Pågår |
| **Error** | `#C45B4E` | Feil, Negativ |

### Neutrals
| Navn | Hex | Bruk |
|------|-----|------|
| **Charcoal** | `#1C1C1E` | Text primary |
| **Steel** | `#8E8E93` | Text secondary |
| **Mist** | `#E5E5EA` | Borders |
| **Cloud** | `#F2F2F7` | Backgrounds |
| **White** | `#FFFFFF` | Surface |

### Typografi (Apple HIG Scale)
| Stil | Størrelse | Vekt | Line Height | Tracking |
|------|-----------|------|-------------|----------|
| Large Title | 34px | 700 | 41px | -0.4px |
| Title 1 | 28px | 700 | 34px | 0.36px |
| Title 2 | 22px | 700 | 28px | -0.26px |
| Title 3 | 20px | 600 | 25px | -0.45px |
| Headline | 17px | 600 | 22px | -0.43px |
| Body | 17px | 400 | 22px | -0.43px |
| Callout | 16px | 400 | 21px | -0.31px |
| Subhead | 15px | 400 | 20px | -0.23px |
| Footnote | 13px | 400 | 18px | -0.08px |
| Caption | 12px | 400 | 16px | 0 |

### Icon Spesifikasjoner
| Egenskap | Verdi |
|----------|-------|
| Størrelse | 24×24px |
| Stroke | 1.5px |
| Line Cap | Round |
| Line Join | Round |
| Safe Area | 2px padding |
| Farge | #10456A (Blue Primary) |

### Shadows
- Card: `0 2px 4px rgba(0, 0, 0, 0.06)`
- Elevated: `0 4px 12px rgba(0, 0, 0, 0.08)`

### Border Radius
- sm: `8px`
- md: `12px`
- lg: `16px`

### Font
- **Familie:** Inter (Open Source, Cross-Platform)
- **Import:** `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700`

---

## Filstruktur

```
IUP_Master_V1/
├── backend-fastify/
│   ├── prisma/
│   │   ├── schema.prisma         # Oppdatert med nye modeller
│   │   └── seed-dashboard.ts     # Seed-data
│   └── src/api/v1/dashboard/
│       ├── index.ts              # Routes
│       ├── schema.ts             # Zod schemas
│       └── service.ts            # Business logic
│
├── IUP_Master_Folder_2/frontend/src/components/
│   └── dashboard/
│       ├── index.js              # Exports
│       ├── Dashboard.jsx         # Main component
│       ├── PeriodCard.jsx
│       ├── TimelineSession.jsx
│       ├── AchievementsBadges.jsx
│       ├── GoalCard.jsx
│       ├── WeeklyStats.jsx
│       └── MessagesList.jsx
│
└── Design/mockups/
    ├── AK_Golf_Dashboard_v3.0.html
    └── AK_Golf_Interactive_Demo_v2.1.html
```
