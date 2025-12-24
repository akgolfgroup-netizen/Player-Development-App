# AKGolfDashboard - Visuell Spesifikasjon v1.0

> **KILDE:** `/Design/figma/ak_golf_complete_figma_kit.svg`
> **Design System:** AK Golf Academy v2.1 - Blue Palette 01
> **Font:** Inter (Open Source, Cross-Platform)
> **Typografi:** Apple Human Interface Guidelines Scale
> **Ikoner:** 24×24px, 1.5px stroke, Round caps
> **Opprettet:** 15. desember 2025

---

## ⚠️ VIKTIG: DESIGN SOURCE OF TRUTH

**ALLE komponenter og design MÅ baseres på:**

```
/Design/figma/ak_golf_complete_figma_kit.svg
```

**Sekundære kilder (tokens):**
- `/Design/tokens/design-tokens.js` - JavaScript tokens
- `/Design/tokens/tokens.css` - CSS variables
- `/Design/tokens/tailwind.config.js` - Tailwind config

**IKKE bruk andre kilder for design-verdier.**

---

## 📱 OVERSIKT

Dashboard for spillere med fokus på dagens trening, progresjon og kommunikasjon.

```
┌────────────────────────────────────────────────────────────┐
│  HEADER                                                    │
├────────────────────────────────────────────────────────────┤
│  VELKOMST + STATUS BAR                                     │
├────────────────────────────────────────────────────────────┤
│  📅 DAGENS ØKTER (Timeline View)                           │
├────────────────────────────────────────────────────────────┤
│  🏆 BADGES DENNE UKEN                                      │
├──────────────────────────┬─────────────────────────────────┤
│  🎯 MÅLSETNINGER         │  📊 UKEPROGRESJON               │
├──────────────────────────┴─────────────────────────────────┤
│  💬 MELDINGER                                              │
├────────────────────────────────────────────────────────────┤
│  📆 PERIODEOVERSIKT                                        │
├────────────────────────────────────────────────────────────┤
│  BOTTOM NAV                                                │
└────────────────────────────────────────────────────────────┘
```

---

## 🎨 DESIGN TOKENS (Fra ak_golf_complete_figma_kit.svg)

### Farger - Brand Colors
| Navn | Hex | Bruk |
|------|-----|------|
| Blue Primary | `#10456A` | Primary |
| Blue Light | `#2C5F7F` | Secondary |
| Foam | `#EDF0F2` | Background |
| Ivory | `#EBE5DA` | Surface |
| Gold | `#C9A227` | Accent |

### Farger - Semantic Colors
| Navn | Hex | Bruk |
|------|-----|------|
| Success | `#4A7C59` | Fullført, Positiv |
| Warning | `#D4A84B` | Advarsel, Pågår |
| Error | `#C45B4E` | Feil, Negativ |

### Farger - Neutrals
| Navn | Hex | Bruk |
|------|-----|------|
| Charcoal | `#1C1C1E` | Primary text |
| Steel | `#8E8E93` | Secondary text |
| Mist | `#E5E5EA` | Borders, dividers |
| Cloud | `#F2F2F7` | Light backgrounds |
| White | `#FFFFFF` | White |

### Typografi (Apple HIG Scale)
| Stil | Størrelse | Vekt | Line Height | Tracking | Bruksområde |
|------|-----------|------|-------------|----------|--------------|
| Large Title | 34px | 700 | 41px | -0.4px | Splash, hovedtitler |
| Title 1 | 28px | 700 | 34px | 0.36px | Skjermtitler |
| Title 2 | 22px | 700 | 28px | -0.26px | Seksjoner, kort-titler |
| Title 3 | 20px | 600 | 25px | -0.45px | Økt-navn, turneringer |
| Headline | 17px | 600 | 22px | -0.43px | Knapper, liste-titler |
| Body | 17px | 400 | 22px | -0.43px | Brødtekst, input |
| Callout | 16px | 400 | 21px | -0.31px | Metadata, hints |
| Subhead | 15px | 400 | 20px | -0.23px | Labels, timestamps |
| Footnote | 13px | 400 | 18px | -0.08px | Help text |
| Caption | 12px | 400 | 16px | 0 | Small labels, tabs |

### Spesial-typografi
| Stil | Størrelse | Vekt | Tracking | Bruk |
|------|-----------|------|----------|------|
| Stat Number | 48px | 700 | -0.5px | Store tall |
| Stat Label | 11px | 500 | 0.5px + UPPERCASE | Labels under tall |

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
| Navn | Verdi |
|------|-------|
| Card | `0 2px 4px rgba(0, 0, 0, 0.06)` |
| Elevated | `0 4px 12px rgba(0, 0, 0, 0.08)` |

### Border Radius
| Størrelse | Verdi |
|-----------|-------|
| sm | 8px |
| md | 12px |
| lg | 16px |

---

## 📐 SEKSJON 1: HEADER

```
┌────────────────────────────────────────────────────────────┐
│  ┌──────┐                                         ┌────┐   │
│  │ LOGO │  IUP                                    │ 👤 │   │
│  │  AK  │  AK Golf Academy                        │    │   │
│  └──────┘                                         └────┘   │
└────────────────────────────────────────────────────────────┘
```

### Spesifikasjoner
| Element | Verdi |
|---------|-------|
| Høyde | 64px |
| Bakgrunn | `ak-white` |
| Border | `1px solid ak-mist` (bottom) |
| Logo container | 40×40px, `ak-primary`, `border-radius: 12px` |
| Logo SVG | 24px, white |
| Tittel | `ak-headline`, `ak-charcoal` |
| Subtitle | `ak-caption`, `ak-steel` |
| Avatar | 36px diameter, `ak-primary` bg |

---

## 📐 SEKSJON 2: VELKOMST + STATUS BAR

```
┌────────────────────────────────────────────────────────────┐
│  God morgen, Ola 👋                                        │
│                                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Kat. B   │  │ Snitt    │  │ Periode  │  │ Uke      │   │
│  │    🏌️    │  │  74.2    │  │ Grunn    │  │ 3/12     │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────────────────────────────────────────────────────┘
```

### Spesifikasjoner
| Element | Verdi |
|---------|-------|
| Greeting | `ak-title-1`, `ak-charcoal` |
| Status cards | 4 stk, `ak-ivory`, `border-radius: 12px`, `shadow-ak-card` |
| Card padding | 12px |
| Card label | `ak-caption`, `ak-steel` |
| Card value | `ak-headline`, `ak-charcoal` |
| Card icon/emoji | 20px |

---

## 📐 SEKSJON 3: DAGENS ØKTER (Timeline View)

```
┌────────────────────────────────────────────────────────────┐
│  📅 Dagens økter                           Se alle →       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  09:00 ┃  ┌────────────────────────────────────────────┐   │
│        ┃  │  ✓  Morgenstrekk                          │   │
│        ┃  │      Fysisk · 30 min                      │   │
│        ┃  └────────────────────────────────────────────┘   │
│        ┃                                                   │
│  14:00 ┃  ┌────────────────────────────────────────────┐   │
│   ●    ┃  │  🔵  Langspill - Driver & Jern            │   │
│        ┃  │      ┌────┐ ┌────┐ ┌────┐                 │   │
│        ┃  │      │ L4 │ │CS60│ │ S6 │                 │   │
│        ┃  │      └────┘ └────┘ └────┘                 │   │
│        ┃  │      Teknikk · 90 min                     │   │
│        ┃  └────────────────────────────────────────────┘   │
│        ┃                                                   │
│  16:30 ┃  ┌────────────────────────────────────────────┐   │
│        ┃  │  ○  Putting Practice                      │   │
│        ┃  │      Shortgame · 45 min                   │   │
│        ┃  └────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Timeline Spesifikasjoner
| Element | Verdi |
|---------|-------|
| Section title | `ak-title-3`, `ak-charcoal` |
| "Se alle" link | `ak-subhead`, `ak-primary`, 600 weight |
| Time label | `ak-footnote`, `ak-steel`, width: 48px |
| Timeline line | 2px, `ak-mist` |
| Current dot | 8px, `ak-primary`, filled |
| Past dot | 8px, `ak-success`, checkmark |
| Future dot | 8px, `ak-mist`, stroke only |

### Økt-kort Spesifikasjoner
| Element | Verdi |
|---------|-------|
| Card | `ak-ivory`, `border-radius: 12px`, `shadow-ak-card` |
| Card padding | 16px |
| Status icon | ✓ (completed), 🔵 (current), ○ (upcoming) |
| Session title | `ak-headline`, `ak-charcoal` |
| Tags container | `gap: 6px`, `margin-top: 8px` |
| L-tag | Dynamic bg based on level (se under) |
| CS-tag | Dynamic bg based on speed |
| S-tag | Dynamic bg based on setting |
| Meta info | `ak-footnote`, `ak-steel` |

### Tag Farger (L-faser)
```
L1: bg: #F2F2F7, text: #8E8E93  (Eksponering)
L2: bg: #E5E5EA, text: #8E8E93  (Kropp+Armer)
L3: bg: #D4E5DB, text: #10456A  (Kølle)
L4: bg: #4A7C59, text: #FFFFFF  (Kontrollert)
L5: bg: #10456A, text: #FFFFFF  (Automatikk)
```

### Tag Farger (Club Speed)
```
CS20:  bg: #F2F2F7, text: #8E8E93
CS40:  bg: #E5E5EA, text: #8E8E93
CS60:  bg: #D4E5DB, text: #10456A
CS80:  bg: #4A7C59, text: #FFFFFF
CS100: bg: #10456A, text: #FFFFFF
```

### Tag Farger (Setting)
```
S1-S5:  bg: #EDF0F2, text: #8E8E93  (Indoor)
S6-S7:  bg: #E5E5EA, text: #1C1C1E  (Range)
S8:     bg: #D4E5DB, text: #10456A  (Bane)
S9-S10: bg: #10456A, text: #FFFFFF  (Turnering)
```

---

## 📐 SEKSJON 4: BADGES DENNE UKEN

```
┌────────────────────────────────────────────────────────────┐
│  🏆 Oppnåelser denne uken                                  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │     🔥      │  │     ⭐      │  │     🎯      │        │
│  │  5 dager    │  │  L5 første  │  │  100 putts  │        │
│  │   streak    │  │    gang     │  │  fullført   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                            │
│  +2 mer →                                                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Spesifikasjoner
| Element | Verdi |
|---------|-------|
| Section title | `ak-title-3`, `ak-charcoal` |
| Badge card | `ak-ivory`, `border: 2px solid ak-gold`, `border-radius: 12px` |
| Badge size | 80×80px |
| Badge emoji | 24px |
| Badge title | `ak-footnote`, `ak-charcoal`, 600 weight |
| Badge subtitle | `ak-caption`, `ak-steel` |
| Horizontal scroll | `overflow-x: auto`, `gap: 12px` |
| New badge glow | `box-shadow: 0 0 12px rgba(201, 162, 39, 0.3)` |

---

## 📐 SEKSJON 5: MÅLSETNINGER + UKEPROGRESJON (2-kolonner)

```
┌───────────────────────────┬────────────────────────────────┐
│  🎯 Målsetninger          │  📊 Denne uken                 │
├───────────────────────────┼────────────────────────────────┤
│                           │                                │
│  Snittscore < 73          │  Økter fullført                │
│  ████████░░░░░░ 68%       │  ████████████░░░ 8/12          │
│  Frist: Aug 2026          │                                │
│                           │  Timer trent                   │
│  L5 på wedge-slag         │  ██████████░░░░░ 12.5/20t      │
│  █████░░░░░░░░░ 45%       │                                │
│  Frist: Apr 2026          │  vs. forrige uke               │
│                           │  ↑ +2 økter  ↑ +3.5t           │
│  Se alle →                │                                │
│                           │                                │
└───────────────────────────┴────────────────────────────────┘
```

### Målsetninger Spesifikasjoner
| Element | Verdi |
|---------|-------|
| Card | `ak-ivory`, `border-radius: 16px`, `shadow-ak-card` |
| Card padding | 16px |
| Goal title | `ak-subhead`, `ak-charcoal`, 600 weight |
| Progress bar | Height: 6px, `ak-primary` fill, `ak-mist` bg |
| Percentage | `ak-footnote`, `ak-primary`, 600 weight |
| Deadline | `ak-caption`, `ak-steel` |
| Gap between goals | 12px |

### Ukeprogresjon Spesifikasjoner
| Element | Verdi |
|---------|-------|
| Metric label | `ak-footnote`, `ak-steel` |
| Metric value | `ak-headline`, `ak-charcoal` |
| Progress bar | Height: 8px, `ak-primary` fill |
| Comparison | `ak-caption` |
| Positive change | `ak-success` |
| Negative change | `ak-error` |

---

## 📐 SEKSJON 6: MELDINGER

```
┌────────────────────────────────────────────────────────────┐
│  💬 Meldinger                                   Se alle →  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │  ┌────┐  Trener Anders                    2 ulest  │    │
│  │  │ 👨‍🏫 │  Bra jobbet i dag! La oss sn...  ● 14:32  │    │
│  │  └────┘                                            │    │
│  └────────────────────────────────────────────────────┘    │
│                                                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │  ┌────┐  Team Norway Junior                        │    │
│  │  │ 👥 │  Neste samling er 20. januar...     I går │    │
│  │  └────┘                                            │    │
│  └────────────────────────────────────────────────────┘    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Spesifikasjoner
| Element | Verdi |
|---------|-------|
| Section title | `ak-title-3`, `ak-charcoal` |
| Chat row | `ak-ivory`, `border-radius: 12px`, padding: 12px |
| Avatar | 40px, `ak-primary` bg eller bilde |
| Chat name | `ak-subhead`, `ak-charcoal`, 600 weight |
| Preview text | `ak-footnote`, `ak-steel`, `text-overflow: ellipsis` |
| Unread badge | `ak-error` bg, white text, pill shape, `ak-caption` |
| Timestamp | `ak-caption`, `ak-steel` |
| Unread indicator | 8px dot, `ak-primary` |

---

## 📐 SEKSJON 7: PERIODEOVERSIKT

```
┌────────────────────────────────────────────────────────────┐
│  📆 Periodeoversikt                                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │   ┌────────┐                                         │  │
│  │   │ GRUNN  │  Uke 43-48 · Okt - Nov 2025            │  │
│  │   │PERIODE │                                         │  │
│  │   └────────┘                                         │  │
│  │                                                      │  │
│  │   Uke 3 av 6 i perioden                             │  │
│  │   ████████████░░░░░░░░░░░░                          │  │
│  │                                                      │  │
│  │   Fokusområder:                                     │  │
│  │   ● Utvikle: Teknikk, Langspill                     │  │
│  │   ○ Vedlikehold: Putting                            │  │
│  │   ◦ Oppretthold: Shortgame                          │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Periode Badge Farger
```
Evaluering (E):       bg: #C9A227, text: #FFFFFF
Grunnperiode (G):     bg: #4A7C59, text: #FFFFFF
Spesialisering (S):   bg: #2C5F7F, text: #FFFFFF
Turnering (T):        bg: #10456A, text: #FFFFFF
```

### Spesifikasjoner
| Element | Verdi |
|---------|-------|
| Card | `ak-ivory`, `border-radius: 16px`, `shadow-ak-elevated` |
| Period badge | 64×64px, dynamic color, `border-radius: 12px` |
| Period name | `ak-caption`, white, uppercase |
| Date range | `ak-subhead`, `ak-charcoal` |
| Week progress | `ak-footnote`, `ak-steel` |
| Progress bar | Height: 4px, `ak-primary` |
| Focus bullet (Utvikle) | `ak-primary` filled circle |
| Focus bullet (Vedlikehold) | `ak-steel` filled circle |
| Focus bullet (Oppretthold) | `ak-mist` stroke circle |

---

## 📐 SEKSJON 8: BOTTOM NAVIGATION

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│    🏠          📅          🎯          📊          👤      │
│   Hjem       Økter        Mål        Stats      Profil    │
│    ●                                                       │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Spesifikasjoner
| Element | Verdi |
|---------|-------|
| Height | 64px + safe area |
| Background | `ak-white` |
| Border | `1px solid ak-mist` (top) |
| Icon size | 24px |
| Icon active | `ak-primary` |
| Icon inactive | `ak-steel` |
| Label | `ak-caption` |
| Active indicator | 4px dot, `ak-primary`, under icon |

---

## 📊 DATA STRUKTURER (API Response)

### Dashboard Data
```typescript
interface DashboardData {
  player: {
    id: string;
    firstName: string;
    lastName: string;
    category: string;        // A-K
    averageScore: number;
    profileImageUrl?: string;
  };

  currentPeriod: {
    type: 'E' | 'G' | 'S' | 'T';
    name: string;            // "Grunnperiode"
    weekNumber: number;      // Uke i perioden
    totalWeeks: number;
    dateRange: string;       // "Okt - Nov 2025"
    focusAreas: {
      develop: string[];     // Utvikle
      maintain: string[];    // Vedlikehold
      sustain: string[];     // Oppretthold
    };
  };

  todaySessions: DailySession[];

  weeklyStats: {
    sessionsCompleted: number;
    sessionsPlanned: number;
    hoursCompleted: number;
    hoursPlanned: number;
    comparedToLastWeek: {
      sessions: number;      // +2 eller -1
      hours: number;
    };
  };

  goals: Goal[];

  badges: Badge[];

  unreadMessages: ChatPreview[];
}

interface DailySession {
  id: string;
  title: string;
  startTime: string;         // "14:00"
  endTime: string;           // "15:30"
  duration: number;          // minutes
  status: 'completed' | 'current' | 'upcoming';
  sessionType: string;       // "Teknikk", "Shortgame", etc.
  learningPhase?: string;    // "L4"
  clubSpeed?: string;        // "CS60"
  setting?: string;          // "S6"
}

interface Goal {
  id: string;
  title: string;
  type: 'result' | 'process' | 'volume';
  progress: number;          // 0-100
  deadline: string;          // "Aug 2026"
}

interface Badge {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  earnedAt: string;
  isNew: boolean;
}

interface ChatPreview {
  id: string;
  name: string;
  avatarUrl?: string;
  avatarEmoji?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}
```

---

## 🔄 INTERAKSJONER

### Tap Actions
| Element | Handling |
|---------|----------|
| Økt-kort | Åpne økt-detaljer (slide-up modal) |
| Målsetting-kort | Navigere til Målsetninger-tab |
| Badge | Vise badge-detaljer (toast/popover) |
| Chat-rad | Åpne chat-samtale |
| "Se alle" lenker | Navigere til relevant seksjon |
| Periode-kort | Åpne fullstendig årsplan |

### Gestures
- Pull-to-refresh på hele dashboard
- Horizontal scroll på badges-seksjon
- Swipe left på chat for "merk som lest"

### Animations
- Skeleton loading state ved oppstart
- Progress bar animasjon (350ms ease-out)
- Badge pulse-animasjon for nye badges
- Smooth scroll mellom seksjoner

---

## 📱 RESPONSIVE BREAKPOINTS

| Breakpoint | Tilpasning |
|------------|------------|
| < 375px | Status cards: 2×2 grid |
| 375-428px | Status cards: 4×1 row (default) |
| > 428px | Max-width: 428px, centered |

---

## ✅ IMPLEMENTASJONS-SJEKKLISTE

- [ ] Header med logo og avatar
- [ ] Velkomst med dynamisk tid ("God morgen/ettermiddag/kveld")
- [ ] Status bar med 4 KPI-kort
- [ ] Timeline view for dagens økter
- [ ] Badges horizontal scroll section
- [ ] Målsetninger med progress bars
- [ ] Ukeprogresjon med sammenligning
- [ ] Chat/meldinger preview
- [ ] Periodeoversikt-kort
- [ ] Bottom navigation med 5 tabs
- [ ] Pull-to-refresh
- [ ] Skeleton loading states
- [ ] Error states
- [ ] Empty states

---

*Denne spesifikasjonen er grunnlaget for implementasjon av AKGolfDashboard.jsx*
