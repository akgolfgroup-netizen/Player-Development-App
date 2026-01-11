# AK Golf Academy - Gamification Research Package
## Documentation for Badge System Planning

**Dato:** 24. desember 2025
**Formål:** Komplett dokumentasjon for ChatGPT badge-planlegging

---

## 📋 INNHOLD

Denne pakken inneholder:
1. Prosjektoversikt og visjon
2. Eksisterende badge/achievement system
3. Kategori- og progresjonslogikk
4. Brukerreiser og domenelogikk
5. Gamification metrics og mål

---

## 1. PROSJEKT VISJON & MÅL

### Hva er AK Golf Academy?

**Kort beskrivelse:**
Production-ready Individual Development Plan (IUP) platform for junior golf training academies. Enterprise-grade coaching platform med fokus på:

- **Individual Development Plans** - Track progress across 11 categories (A-K) following Team Norway methodology
- **20+ Test Protocols** - Comprehensive testing for driver, approach, short game, putting, physical fitness
- **Advanced Analytics** - Peer comparison, breaking point detection, progress tracking
- **Training Plans** - Periodization with E/G/S/T phases and automated scheduling
- **Multi-tenant Architecture** - Secure organization isolation with role-based access control

### Kjerneverdier

1. **Data-drevet utvikling** - Følg Team Norway IUP-metodikk
2. **Strukturert progresjon** - 11 kategorier (A-K) med klare krav
3. **Langsiktig utvikling** - Fra junior til elite
4. **Coaching excellence** - Verktøy for trenere og spillere
5. **Målbar fremgang** - Testing, tracking, analytics

### Target Audience

**Primær:**
- Junior golfers (13-22 år)
- Elite golfers in development
- Golf academy coaches
- Golf academy administrators

**Sekundær:**
- Parents of junior golfers
- Golf federation administrators

---

## 2. TEAM NORWAY KATEGORI SYSTEM (A-K)

### 11 Kategorier for Golf Utvikling

Dette er KJERNEN i hele systemet - all gamification må relatere til dette:

| Kategori | Navn | Fokus |
|----------|------|-------|
| **A** | Driver/Distance | Lengde off tee |
| **B** | Approach | Jernspill, GIR |
| **C** | Short Game | Chipping, pitching |
| **D** | Putting | Green reading, stroke |
| **E** | Scrambling | Up & down % |
| **F** | Fysisk | Styrke, mobility, fitness |
| **G** | Mentalt | Mental toughness, focus |
| **H** | Strategi | Course management |
| **I** | Teknologi | Video analysis, data |
| **J** | Competition | Tournament performance |
| **K** | Lifestyle | Sleep, nutrition, recovery |

### Progresjonsnivåer per Kategori

Hver kategori har målbare krav på forskjellige nivåer:

**Nivåer:**
1. **Beginner** - Grunnleggende ferdigheter
2. **Intermediate** - Solide grunnlag
3. **Advanced** - Konkurransedyktig
4. **Elite** - Team Norway standard
5. **Professional** - Pro-nivå

**Eksempel fra Kategori A (Driver):**
- Beginner: Clubhead speed 80+ mph
- Intermediate: 90+ mph, fairway hit 50%+
- Advanced: 100+ mph, fairway 60%+
- Elite: 110+ mph, fairway 65%+, carry 250+ yards
- Professional: 115+ mph, tour-level stats

---

## 3. EKSISTERENDE BADGE/ACHIEVEMENT SYSTEM

### Current Badge Categories (fra AK_ICON_BADGE_SYSTEM_SPEC.md)

#### 3.1 Kategori Mastery Badges (A-K)
**Formål:** Anerkjenne fremgang i hver av 11 kategoriene

**Nivåer per kategori:**
- 🥉 Bronze (Beginner level achieved)
- 🥈 Silver (Intermediate level achieved)
- 🥇 Gold (Advanced level achieved)
- 💎 Diamond (Elite level achieved)
- 👑 Platinum (Professional level achieved)

**Totalt:** 11 kategorier × 5 nivåer = **55 badges**

#### 3.2 Milestone Badges
**Formål:** Feire viktige milepæler

Eksempler:
- **First Test Completed** - Gjennomført første test
- **First Training Session** - Fullført første treningsøkt
- **Weekly Warrior** - 7 dager på rad med trening
- **Monthly Master** - Alle planlagte økter fullført i en måned
- **100 Sessions** - 100 treningsøkter totalt
- **1000 Hours** - 1000 timer trening totalt
- **Perfect Week** - Alle økter + alle tester fullført

#### 3.3 Performance Badges
**Formål:** Belønne spesifikke prestasjoner

Eksempler:
- **Ace** - Hole in one
- **Eagle** - Eagle eller bedre
- **Breaking 80** - Runde under 80 slag
- **Breaking 75** - Runde under 75 slag
- **Breaking 70** - Runde under 70 slag
- **Personal Best** - Ny personlig rekord
- **Tournament Winner** - Vunnet turnering

#### 3.4 Consistency Badges
**Formål:** Belønne konsistens over tid

Eksempler:
- **7-Day Streak** - 7 dager på rad
- **30-Day Streak** - 30 dager på rad
- **100-Day Streak** - 100 dager på rad
- **Year of Excellence** - 365 dager på rad
- **Test Master** - Alle tester fullført kvartalsvis
- **Category Climber** - Fremgang i 3+ kategorier samtidig

#### 3.5 Social/Team Badges
**Formål:** Stimulere samarbeid og fellesskap

Eksempler:
- **Team Player** - Deltatt på teamøkt
- **Mentor** - Hjulpet medspiller
- **Study Group** - Deltatt i videoanalyse-gruppe
- **Tournament Teammate** - Spilt lag-turnering
- **Practice Partner** - 10+ økter med partner

#### 3.6 Special Achievement Badges
**Formål:** Unike prestasjoner og milepæler

Eksempler:
- **Early Bird** - Trening før kl 06:00
- **Night Owl** - Trening etter kl 22:00
- **All-Rounder** - Trent alle 11 kategorier i én uke
- **Data Geek** - Lastet opp 50+ videoer
- **Feedback King** - Gitt 100+ tilbakemeldinger
- **Tournament Ready** - Fullført pre-tournament checklist

---

## 4. BRUKERREISER & USER STORIES

### 4.1 Junior Golfer Journey (13-18 år)

**Fase 1: Onboarding (Måned 1-3)**
- Først test av alle 11 kategorier
- Etablere baseline
- Få første badges (onboarding badges)
- Lære systemet

**Fase 2: Building Foundation (År 1)**
- Fokus på 2-3 svake kategorier
- Strukturert treningsplan
- Månedlige tester
- Samle consistency badges

**Fase 3: Acceleration (År 2-3)**
- Tydelig progresjon i kategorier
- Økt fokus på competition (J)
- Mentor for yngre spillere
- Team badges

**Fase 4: Elite Development (År 4+)**
- Diamond/Platinum badges
- Tournament performance
- Team Norway standard
- Professional pathway

### 4.2 Coach Journey

**Daglig:**
- Sjekke spilleres fremgang
- Gi feedback på økter
- Planlegge neste uke

**Ukentlig:**
- Review progress across team
- Identifisere trender
- Justere treningsplaner

**Månedlig:**
- Testing og evaluering
- Meetings med spillere
- Rapportering til foreldre/klubb

### 4.3 Parent Journey

**Ukentlig:**
- Se barns fremgang
- Forstå kategori-system
- Motivere videre innsats

**Månedlig:**
- Review med coach
- Se badge-progresjon
- Forstå langsiktig plan

---

## 5. DOMENELOGIKK - GOLF SPESIFIKT

### 5.1 Training Session Structure

**Session Types:**
- **E (Endurance)** - Volum, repetisjoner, motor learning
- **G (General)** - Allsidig trening, flere kategorier
- **S (Specific)** - Spesifikk golf-skill training
- **T (Tournament)** - Turnering eller turnering-simulering

**Typical Week:**
```
Mandag:    E (Driver + Fysisk)
Tirsdag:   G (Short game + Putting)
Onsdag:    S (Approach + Mental)
Torsdag:   Pause/Recovery
Fredag:    G (Alle kategorier)
Lørdag:    T (Turnering/Simulering)
Søndag:    Pause
```

### 5.2 Testing Protocols (20+ tester)

**Kategori A (Driver):**
- Clubhead speed test
- Ball speed test
- Carry distance test
- Fairway accuracy test
- Launch angle test

**Kategori B (Approach):**
- GIR% test
- Proximity to hole (various distances)
- Distance control test
- Shot shape test

**Kategori C (Short Game):**
- Chipping test (8 positions)
- Pitching test (3 distances)
- Bunker test
- Lob shot test

**Kategori D (Putting):**
- 6-foot circle test
- Lag putting test (30-60 feet)
- Breaking putt test
- Speed control test

**Kategori F (Fysisk):**
- Vertical jump
- Broad jump
- Medicine ball rotation
- Plank test
- Mobility tests

### 5.3 Key Performance Indicators (KPIs)

**Overall Performance:**
- Scoring average
- Tournament results
- Category levels (A-K average)
- Test score trends

**Training Quality:**
- Sessions completed vs planned
- Training hours per week
- Session quality ratings
- Coach feedback scores

**Engagement:**
- Days active per week
- Streak length
- Badge collection rate
- Peer interaction

---

## 6. GAMIFICATION METRICS & MÅLING

### 6.1 Hva Systemet Optimaliserer For

**Primære mål:**
1. **Konsistent trening** - 4-6 økter per uke
2. **Balansert utvikling** - Fremgang i alle 11 kategorier
3. **Målbar fremgang** - Testing hvert kvartal
4. **Langsiktig tenking** - 4+ års utviklingsplan
5. **Coach-spiller relasjon** - Tett oppfølging

**Sekundære mål:**
1. Sosial interaksjon - Lag/gruppe-følelse
2. Data-innsamling - Video, stats, feedback
3. Parent engagement - Involvering av foreldre
4. Competition readiness - Turnerings-forberedelse

### 6.2 Badge Effectiveness Metrics

**Success Metrics:**
- Badge unlock rate (per user per month)
- Time to first badge (onboarding)
- Badge diversity (spread across categories)
- Badge progression rate (bronze → silver → gold)
- Retention correlation (badge earners vs non-earners)

**Engagement Metrics:**
- Session completion rate
- Test participation rate
- Streak maintenance
- Social interaction (team badges)
- Coach feedback engagement

### 6.3 Risiko: Badge Inflation

**Current Problem:**
- 55 kategori badges + 30+ milestone badges = 85+ badges
- Risk: Too many badges = diluted value
- Risk: Too easy = no achievement feeling
- Risk: Too hard = demotivation

**Needs:**
- Clear badge hierarchy
- Meaningful vs trivial badges
- Progressive difficulty
- Rarity system

---

## 7. TEKNISK IMPLEMENTERING

### 7.1 Database Structure (fra Prisma schema)

```prisma
model Achievement {
  id          String   @id @default(uuid())
  playerId    String
  player      Player   @relation(...)

  // Achievement details
  achievementType  String  // "category_mastery", "milestone", "performance", etc.
  category         String? // A-K for category badges
  level           String? // "bronze", "silver", "gold", "diamond", "platinum"

  // Metadata
  earnedAt    DateTime
  expiresAt   DateTime? // For time-based achievements

  // Display
  title       String
  description String
  iconUrl     String
  rarity      String   // "common", "rare", "epic", "legendary"

  @@index([playerId, achievementType])
  @@index([playerId, earnedAt])
}
```

### 7.2 Badge Trigger System

**Automated Triggers:**
- Test completion → Check category level → Award badge if threshold met
- Session completion → Check streaks → Award consistency badges
- Tournament result → Check performance → Award performance badges

**Manual Triggers (Coach):**
- Coach can award special achievement badges
- Recognition for effort, attitude, improvement

---

## 8. DESIGN SYSTEM FOR BADGES

### 8.1 Visual Hierarchy

**Icon Sizes:**
- Small: 32x32px (list view)
- Medium: 48x48px (card view)
- Large: 96x96px (award modal)
- Hero: 128x128px (achievement page)

**Colors by Rarity:**
- Common: Gray (#8E8E93)
- Rare: Blue (#10456A) - Primary brand
- Epic: Gold (#C9A227) - Brand accent
- Legendary: Gradient (Gold → Primary Blue)

**Badge States:**
- Locked: Grayscale, 50% opacity, lock icon
- Unlocked: Full color, glow effect
- In Progress: Partial color, progress ring
- Expired: Faded, strikethrough

### 8.2 Badge Categories Visual Language

**Category Mastery (A-K):**
- Icon: Letter badge (A, B, C, etc.)
- Frame: Metallic (bronze, silver, gold, diamond, platinum)
- Background: Category color

**Milestone:**
- Icon: Trophy, star, flame
- Frame: Circular
- Background: Achievement-specific

**Performance:**
- Icon: Specific to achievement (ace = flag, eagle = bird)
- Frame: Shield
- Background: Gradient

**Consistency:**
- Icon: Calendar, streak flame
- Frame: Hexagon
- Background: Time-based gradient

---

## 9. EKSISTERENDE BADGE PLAN

### Fra PLAN-Hierarkisk-Badge-System.md

**Tier 1: Foundation Badges (Beginner)**
- First Test Completed
- First Session Logged
- Profile Complete
- 7-Day Streak Started

**Tier 2: Progress Badges (Intermediate)**
- Category Bronze (all 11)
- 30-Day Streak
- 50 Sessions
- Monthly Master

**Tier 3: Mastery Badges (Advanced)**
- Category Silver (all 11)
- 100-Day Streak
- 100 Sessions
- Tournament Participant

**Tier 4: Elite Badges (Professional)**
- Category Gold (all 11)
- Year of Excellence
- 500 Sessions
- Tournament Winner

**Tier 5: Legendary Badges (Exceptional)**
- Category Diamond/Platinum
- All-Star (All categories Gold+)
- 1000 Hours
- Elite Achievement

---

## 10. NØKKELSPØRSMÅL FOR CHATGPT

### Strategiske Spørsmål

1. **Badge Portfolio Size**
   - Hvor mange badges er optimalt? (nå: 85+)
   - Hva er riktig balanse mellom common vs rare?

2. **Progression Design**
   - Skal alle badges ha progressive levels?
   - Hvordan unngå badge inflation?

3. **Category vs Universal**
   - Fokusere mer på kategori-badges (A-K)?
   - Eller balansere med universal badges?

4. **Time-Based vs Achievement-Based**
   - Balanse mellom effort (streaks) og results (performance)?

5. **Social vs Individual**
   - Hvor mye fokus på team/social badges?

### Taktiske Spørsmål

1. **MVP vs Phase 2**
   - Hvilke 10-15 badges skal vi lansere først?

2. **Rarity Distribution**
   - Hvor mange common/rare/epic/legendary?

3. **Expiration Logic**
   - Skal noen badges expire (sesong-basert)?

4. **Coach vs Auto-Award**
   - Hvilke badges skal coach kunne tildele manuelt?

5. **Display Priority**
   - Hvilke badges vises på profil vs arkiv?

---

## 11. COMPETITIVE ANALYSIS

### Lignende Systemer

**Strava (Cycling/Running):**
- Focus: Segment KOMs, challenges, achievements
- Learning: Monthly challenges work well, leaderboards motivate

**Duolingo (Language Learning):**
- Focus: Daily streaks, league system, XP
- Learning: Streak anxiety is real, leagues create FOMO

**Whoop (Fitness Tracking):**
- Focus: Recovery, strain, sleep
- Learning: Data-driven, minimal gamification, premium feel

**Arccos Golf:**
- Focus: Shot tracking, strokes gained, handicap
- Learning: Data-heavy, less gamification, coach-oriented

### AK Golf Positioning

**Differentiators:**
- Team Norway methodology (11 categories)
- Long-term development (4+ years)
- Coach-centric platform
- Nordic minimalism design
- Balanced gamification (not over-gamified like Duolingo, not data-only like Arccos)

---

## 12. BRUKER PERSONAS

### Persona 1: Emma (15 år, Junior Spiller)

**Mål:**
- Komme på Team Norway (langsiktig)
- Forbedre short game (kortsiktig)
- Henge med venner på akademiet

**Motivasjon:**
- Konkurranseinstinkt (vil vinne)
- Sosial validering (badges å vise frem)
- Fremgang (se resultater)

**Badge Preferences:**
- Performance badges (ace, eagle, PB)
- Social badges (team player)
- Kategori badges (show progress)

### Persona 2: Ole (17 år, Elite Spiller)

**Mål:**
- Bli profesjonell (langsiktig)
- Optimalisere trening (kortsiktig)
- Spille college golf i USA

**Motivasjon:**
- Prestasjon (data-driven)
- Identitet (jeg er elite)
- Autonomi (kontroll over plan)

**Badge Preferences:**
- Elite badges (diamond/platinum)
- All-rounder badges (balansert utvikling)
- Legendary badges (differentiering)

### Persona 3: Coach Lars

**Mål:**
- Utvikle spillere til Team Norway
- Effektiv treningsplanlegging
- Dokumentasjon av fremgang

**Motivasjon:**
- Impact (spillere som lykkes)
- Profesjonalitet (system og struktur)
- Coaching excellence

**Badge Preferences:**
- Awards special achievement badges
- Sees badge data as engagement metric
- Wants simple, meaningful system

---

## 13. KONKLUSJON & FORVENTNINGER

### Hva ChatGPT skal levere:

1. **Badge Portfolio Analysis**
   - Current state assessment
   - Recommended badge count (10-15 MVP + 20-30 Phase 2)
   - Rarity distribution

2. **Badge Kategorisering**
   - Hvilke typer skal beholdes/fjernes/slås sammen
   - Hierarki og prioritering

3. **MVP Badge Set**
   - 10-15 essential badges for launch
   - Rationale for each

4. **Phase 2 & 3 Roadmap**
   - Additional badges post-launch
   - Seasonal/event badges

5. **Badge Framework & Regler**
   - Criteria for new badges
   - Approval process
   - Anti-inflation guidelines

### Suksesskriterier for Badge System:

✅ **Meaningful** - Each badge represents real achievement
✅ **Progressive** - Clear path from beginner to elite
✅ **Balanced** - Not too easy, not too hard
✅ **Motivating** - Drives desired behaviors
✅ **Aligned** - Supports Team Norway methodology
✅ **Sustainable** - Can evolve without dilution

---

## 14. APPENDIKS: VIKTIGE FILER

Følgende filer er inkludert i denne pakken:

1. **README.md** - Prosjektoversikt
2. **DESIGN_README.md** - Design system
3. **docs/AK_ICON_BADGE_SYSTEM_SPEC.md** - Badge spec
4. **docs/GAMIFICATION_METRICS_SPEC.md** - Gamification metrics
5. **docs/CONFIG_KATEGORI_KRAV.md** - Kategori krav
6. **docs/PLAN-Hierarkisk-Badge-System.md** - Badge plan
7. **docs/00_MASTER_PROSJEKTDOKUMENT.md** - Master doc
8. **docs/CLAUDE-SKILL-AK-Golf-Category-System.md** - Category system
9. **docs/BRUKERGUIDE.md** - User guide

---

**Pakke generert:** 24. desember 2025
**Versjon:** 1.0
**Status:** Klar for ChatGPT analyse

---

**Next Step:** Last opp følgende filer til ChatGPT:
1. Denne filen (GAMIFICATION_RESEARCH_PACKAGE.md)
2. AK_ICON_BADGE_SYSTEM_SPEC.md
3. CONFIG_KATEGORI_KRAV.md
4. GAMIFICATION_METRICS_SPEC.md
5. PLAN-Hierarkisk-Badge-System.md
