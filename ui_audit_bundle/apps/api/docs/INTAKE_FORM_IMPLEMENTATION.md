# Player Intake Form Implementation

## Overview

The intake form system allows players to submit their golf background, goals, and preferences, which the system then uses to automatically generate a personalized 12-month training plan.

## Architecture

### Flow

```
Player fills intake form → Form validation → Data processing → Training plan generation
```

### Key Components

1. **Type Definitions** (`src/domain/intake/intake.types.ts`)
2. **Database Model** (`PlayerIntake` in `schema.prisma`)
3. **Processing Service** (`src/domain/intake/intake-processing.service.ts`)
4. **API Endpoints** (`src/api/v1/intake/index.ts`)
5. **Test Scripts** (`scripts/test-intake-flow.ts`)

## Intake Form Structure

The intake form consists of 8 sections:

### 1. Background (Required)
- Years playing golf
- Current handicap
- Average score (last 10 rounds)
- Rounds per year
- Training history (none/sporadic/regular/systematic)

### 2. Availability (Required)
- Hours per week available (8-25 hours)
- Preferred training days (0=Sunday, 6=Saturday)
- Can travel to facility (boolean)
- Has home equipment (boolean)
- Seasonal availability variations (optional)

### 3. Goals (Required)
- Primary goal (lower handicap, compete tournaments, consistency, enjoy more, specific skill)
- Target handicap (optional)
- Target score (optional)
- Timeframe (3/6/12 months)
- Planned tournaments with importance level (A/B/C)
- Specific focus areas

### 4. Weaknesses (Required)
- Biggest frustration (open text)
- Problem areas (driver, irons, short game, putting, etc.)
- Mental challenges (pressure, focus, confidence, etc.)
- Physical limitations (back, shoulder, wrist, etc.)

### 5. Health (Required)
- Current injuries
- Injury history (last 2 years)
- Chronic conditions
- Mobility issues
- Age group

### 6. Lifestyle (Optional)
- Work schedule
- Stress level (1-5)
- Sleep quality (1-5)
- Nutrition focus
- Physical activity level

### 7. Equipment (Optional)
- Has driver speed measurement
- Driver speed (if known)
- Recent club fitting
- Access to TrackMan/simulator
- Access to gym
- Investment willingness (minimal/moderate/significant)

### 8. Learning Preferences (Optional)
- Preferred learning style (visual/verbal/kinesthetic/mixed)
- Wants detailed explanations
- Prefers structured plan
- Motivation type (competition/personal growth/social/achievement)

## API Endpoints

All endpoints require authentication and tenant context.

### POST `/api/v1/intake`
Submit or update player intake form (supports progressive submission).

**Request Body:**
```json
{
  "playerId": "uuid",
  "background": { /* see structure above */ },
  "availability": { /* optional */ },
  "goals": { /* optional */ },
  "weaknesses": { /* optional */ },
  "health": { /* optional */ },
  "lifestyle": { /* optional */ },
  "equipment": { /* optional */ },
  "learning": { /* optional */ }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "intake-uuid",
    "completionPercentage": 75,
    "isComplete": false
  }
}
```

### GET `/api/v1/intake/player/:playerId`
Get player's latest intake form.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "intake-uuid",
    "playerId": "player-uuid",
    "completionPercentage": 100,
    "isComplete": true,
    "background": { /* data */ },
    "availability": { /* data */ },
    /* ... all sections ... */
    "submittedAt": "2025-01-15T10:00:00Z"
  }
}
```

### POST `/api/v1/intake/:intakeId/generate-plan`
Generate 12-month training plan from completed intake.

**Requirements:**
- Intake must be 100% complete (all required sections filled)

**Response:**
```json
{
  "success": true,
  "data": {
    "annualPlan": {
      "id": "plan-uuid",
      "planName": "2025 Treningsplan",
      "startDate": "2025-01-15",
      "endDate": "2026-01-15",
      "playerCategory": "I1",
      "weeklyHoursTarget": 12,
      "basePeriodWeeks": 24,
      "specializationWeeks": 18,
      "tournamentWeeks": 8
    },
    "periodizations": [ /* 52 week periods */ ],
    "dailyAssignments": [ /* 365 daily sessions */ ],
    "tournaments": [ /* scheduled tournaments */ ]
  }
}
```

### GET `/api/v1/intake/tenant/:tenantId`
Get all intakes for a tenant (admin view).

**Query Parameters:**
- `isComplete`: Filter by completion status (true/false)
- `hasGeneratedPlan`: Filter by plan generation status (true/false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "intake-uuid",
      "playerId": "player-uuid",
      "completionPercentage": 100,
      "isComplete": true,
      "submittedAt": "2025-01-15T10:00:00Z",
      "player": {
        "id": "player-uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

### DELETE `/api/v1/intake/:intakeId`
Delete an intake form.

**Response:**
```json
{
  "success": true,
  "message": "Intake form deleted successfully"
}
```

## Processing Logic

### Completion Validation

Required sections: background, availability, goals, weaknesses, health (5 sections)
Optional sections: lifestyle, equipment, learning (3 sections)

Completion percentage = (completed sections / 8 total sections) × 100

### Player Categorization

Based on average score:
- **E1 (Elite)**: < 70
- **A1 (Advanced)**: 70-75
- **I1 (Intermediate)**: 75-80
- **D1 (Developing)**: 80-85
- **B1 (Beginner)**: ≥ 85

### Weekly Hours Adjustment

Starting with requested hours per week:
- **High stress** (level ≥4): -15% reduction
- **Older age** (55-65, 65+): -10% reduction
- **Final range**: Capped at 8-25 hours

### Plan Duration

- 3 months: 12 weeks
- 6 months: 26 weeks
- 12 months: 52 weeks

### Tournament Processing

Tournament importance maps to priority:
- **major** → A priority
- **important** → B priority
- **minor** → C priority

Topping period starts 2-3 weeks before tournament.
Tapering starts 3-7 days before (varies by importance).

## Database Schema

### PlayerIntake Model

```prisma
model PlayerIntake {
  id                    String   @id @default(dbgenerated("gen_random_uuid()"))
  playerId              String
  tenantId              String

  // Structured intake data (JSONB for flexibility)
  background            Json     @db.JsonB
  availability          Json     @db.JsonB
  goals                 Json     @db.JsonB
  weaknesses            Json     @db.JsonB
  health                Json     @db.JsonB
  lifestyle             Json     @db.JsonB
  equipment             Json     @db.JsonB
  learning              Json     @db.JsonB

  // Completion tracking
  completionPercentage  Int      @default(0)
  isComplete            Boolean  @default(false)

  // Linked plan (when generated)
  generatedPlanId       String?

  // Timestamps
  submittedAt           DateTime @default(now())
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  // Relations
  player                Player   @relation(...)
  tenant                Tenant   @relation(...)

  @@unique([playerId, submittedAt])
  @@index([playerId])
  @@index([tenantId])
  @@index([isComplete])
}
```

## Testing

### Manual Testing with Script

```bash
npx tsx scripts/test-intake-flow.ts
```

This script demonstrates:
1. Creating test tenant and player
2. Progressive form submission (partial → complete)
3. Validation and completion tracking
4. Training plan generation from intake
5. Detailed plan output with periodization and tournaments

### API Testing with cURL

**Submit Intake:**
```bash
curl -X POST http://localhost:3000/api/v1/intake \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "playerId": "player-uuid",
    "background": {
      "yearsPlaying": 10,
      "currentHandicap": 8.2,
      "averageScore": 78.5,
      "roundsPerYear": 40,
      "trainingHistory": "sporadic"
    }
  }'
```

**Generate Plan:**
```bash
curl -X POST http://localhost:3000/api/v1/intake/INTAKE_ID/generate-plan \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Integration with Existing Systems

### Links to:
- **Player** - Each intake belongs to a player
- **Tenant** - Multi-tenancy support
- **AnnualTrainingPlan** - Generated plan is linked back to intake
- **ClubSpeedCalibration** - Driver speed from equipment section

### Data Flow:

```
1. Player submits intake form
   ↓
2. IntakeProcessingService validates and stores data
   ↓
3. When complete, generatePlanFromIntake() is called
   ↓
4. processIntakeData() converts to ProcessedIntake
   ↓
5. convertToPlanGenerationInput() creates plan input
   ↓
6. PlanGenerationService.generateAnnualPlan() creates:
   - AnnualTrainingPlan
   - 52 Periodization records
   - 365 DailyTrainingAssignment records
   - ScheduledTournament records
   ↓
7. generatedPlanId is linked back to intake
```

## Future Enhancements

### Phase 1 (Current Implementation)
- ✅ Form-based intake submission
- ✅ Progressive completion tracking
- ✅ Automatic plan generation
- ✅ Player categorization
- ✅ Weekly hours adjustment
- ✅ Tournament scheduling

### Phase 2 (Planned - AI Enhancement)
- 🔄 Conversational intake with Claude AI
- 🔄 Natural language processing of frustrations
- 🔄 Smart follow-up questions based on answers
- 🔄 Adaptive recommendation engine
- 🔄 Weekly plan adjustments based on feedback

See `docs/AI_ENHANCEMENT_ROADMAP.md` for detailed AI enhancement plans.

## Error Handling

### Common Errors

**PLAYER_NOT_FOUND** (404)
- Player doesn't exist or doesn't belong to tenant

**INTAKE_NOT_FOUND** (404)
- No intake form found for player
- Intake doesn't belong to tenant

**INCOMPLETE_INTAKE** (400)
- Attempting to generate plan from incomplete intake
- Missing required sections

**PLAN_GENERATION_FAILED** (500)
- Error during plan generation process
- Check logs for detailed error

## Best Practices

1. **Progressive Submission**: Allow players to save partial forms and complete later
2. **Validation**: Validate all numeric ranges and required fields
3. **Privacy**: Only show intakes from same tenant
4. **Error Messages**: Provide clear, actionable error messages
5. **Logging**: Log plan generation for debugging and analytics
6. **Testing**: Test with various player profiles and edge cases

## Files Modified/Created

### Created:
- `src/domain/intake/intake.types.ts` - Type definitions
- `src/domain/intake/intake-processing.service.ts` - Processing logic
- `src/api/v1/intake/index.ts` - API routes
- `scripts/test-intake-flow.ts` - Comprehensive test script
- `scripts/test-intake-simple.ts` - Simple database connectivity test
- `docs/INTAKE_FORM_IMPLEMENTATION.md` - This document

### Modified:
- `prisma/schema.prisma` - Added PlayerIntake model + relations
- `src/app.ts` - Registered intake routes

## Migration

Database migration already applied:
```bash
npx prisma db push
npx prisma generate
```

## Summary

The intake form system provides a structured way for players to onboard and receive personalized training plans. It supports progressive form filling, automatic player categorization, smart adjustments based on lifestyle factors, and seamless integration with the existing 12-month training plan generation system.

Next step: Add conversational AI intake using Claude API (see AI Enhancement Roadmap).
