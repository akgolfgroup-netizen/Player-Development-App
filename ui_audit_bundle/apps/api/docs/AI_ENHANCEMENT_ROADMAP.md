# EliteGolfCoach: AI Enhancement Roadmap

> Strukturert plan for å utvikle verdens ledende AI-drevet treningsplanlegger

---

## 🎯 Overordnet Mål

**Transformere** dagens regelbaserte treningsplanlegger til en **intelligent, adaptiv AI-coach** som:
- Lærer fra tusenvis av spillere
- Tilpasser seg individuell utvikling i sanntid
- Kommuniserer som en menneskelig coach
- Predikerer og optimaliserer resultater

**Målgruppe**: Golfsenter, coaches, seriøse amatørspillere (HCP 5-25)

**Suksessmåling**:
- Score improvement: Fra -3.2 til -4.5 slag/år (40% bedre)
- Retention: Fra 70% til 90% plan completion
- Coach efficiency: 50% reduksjon i tid per spiller

---

## 📅 Tidsplan & Faser

```
Phase 1: Foundation (4 uker)     → MVP med conversational planning
Phase 2: Intelligence (6 uker)   → Adaptive coaching + prediction
Phase 3: Advanced (8 uker)       → Multi-modal + precision diagnostics
Phase 4: Scale (Ongoing)         → Data learning + continuous improvement

Total til production: 18 uker
```

---

## 🏗️ Teknisk Arkitektur

### System Oversikt

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Mobile/Web)                    │
│  - Conversational UI    - Video upload    - Voice coaching  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   BACKEND FASTIFY (Existing)                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              NEW: AI Services Layer                  │    │
│  │  ┌──────────────────────────────────────────────┐   │    │
│  │  │  Claude API Integration (Anthropic SDK)      │   │    │
│  │  │  - Messages API (chat, analysis, coaching)   │   │    │
│  │  │  - Vision API (video/image analysis)         │   │    │
│  │  │  - Tool use (plan modifications)              │   │    │
│  │  └──────────────────────────────────────────────┘   │    │
│  │                                                       │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │    │
│  │  │Conversational│  │  Adaptive    │  │Performance│  │    │
│  │  │  Planning    │  │ Rebalancing  │  │Prediction │  │    │
│  │  └──────────────┘  └──────────────┘  └──────────┘  │    │
│  │                                                       │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │    │
│  │  │ Intelligent  │  │  Breaking    │  │   Data    │  │    │
│  │  │Session Design│  │Point Precision│  │ Learning  │  │    │
│  │  └──────────────┘  └──────────────┘  └──────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         EXISTING: Core Services Layer                │    │
│  │  - PlanGenerationService    - CalibrationService     │    │
│  │  - SessionSelectionService  - ProgressTrackingService│    │
│  │  - ManualAdjustmentService  - ReviewService          │    │
│  └─────────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              PostgreSQL Database (Existing)                  │
│  + NEW: Conversation history, AI insights, outcome data     │
└──────────────────────────────────────────────────────────────┘
```

### Nye Database Modeller

```prisma
// Conversation history for multi-turn planning
model PlanningConversation {
  id                String   @id @default(uuid())
  playerId          String
  status            String   // active, completed, abandoned
  messages          Json     // Array of {role, content, timestamp}
  extractedData     Json     // Structured data extracted from conversation
  generatedPlanId   String?  // Link to final generated plan
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  player            Player   @relation(...)
}

// AI-generated insights and recommendations
model AIInsight {
  id                String   @id @default(uuid())
  playerId          String
  planId            String?
  insightType       String   // weekly_analysis, breaking_point_diagnosis, session_recommendation
  content           Json     // Structured AI output
  confidence        Decimal  // 0-1
  appliedAt         DateTime?
  wasAccepted       Boolean?
  outcome           Json?    // Did it work? Track for learning
  createdAt         DateTime @default(now())

  player            Player   @relation(...)
  plan              AnnualTrainingPlan? @relation(...)
}

// Performance outcomes for ML training
model TrainingOutcome {
  id                String   @id @default(uuid())
  playerId          String   @unique(composite: [playerId, planId])
  planId            String
  timepoint         String   // 3_months, 6_months, 12_months
  scoreBaseline     Decimal
  scoreCurrent      Decimal
  scoreImprovement  Decimal
  breakingPointsResolved Int
  sessionsCompleted Int
  satisfactionScore Int?    // 1-10
  metadata          Json     // Rich context for ML
  recordedAt        DateTime @default(now())

  player            Player   @relation(...)
  plan              AnnualTrainingPlan @relation(...)
}

// Session quality ratings for learning
model SessionFeedback {
  id                String   @id @default(uuid())
  assignmentId      String
  qualityRating     Int      // 1-10
  effortRating      Int      // 1-10
  fatigueLevel      Int      // 1-10
  notes             String?
  wasAIGenerated    Boolean  // Track AI-designed vs template sessions
  createdAt         DateTime @default(now())

  assignment        DailyTrainingAssignment @relation(...)
}
```

---

## 📋 FASE 1: Foundation (Uke 1-4)

**Mål**: MVP med conversational planning og Claude integration

### Uke 1: Claude API Setup & Architecture

**Oppgaver**:
1. **Anthropic SDK Integration**
   ```bash
   npm install @anthropic-ai/sdk
   ```

2. **Environment Configuration**
   ```env
   ANTHROPIC_API_KEY=sk-ant-...
   ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
   ANTHROPIC_MAX_TOKENS=4096
   ANTHROPIC_TEMPERATURE=0.7
   ```

3. **Create Base Service**
   ```typescript
   // src/services/ai/claude-client.service.ts
   import Anthropic from '@anthropic-ai/sdk';

   export class ClaudeClientService {
     private client: Anthropic;

     constructor() {
       this.client = new Anthropic({
         apiKey: config.anthropic.apiKey
       });
     }

     async chat(messages: Message[], tools?: Tool[]) {
       return await this.client.messages.create({
         model: config.anthropic.model,
         max_tokens: config.anthropic.maxTokens,
         messages,
         tools
       });
     }
   }
   ```

4. **Error Handling & Retry Logic**
   - Rate limit handling
   - Timeout configuration
   - Fallback strategies

**Deliverables**:
- ✅ Claude SDK integrated og testet
- ✅ Base service med error handling
- ✅ Configuration management
- ✅ Unit tests for API calls

**Estimat**: 5 dager (1 utvikler)

---

### Uke 2-3: Conversational Planning API

**Oppgaver**:

1. **Database Migration**
   ```sql
   -- Add PlanningConversation table
   CREATE TABLE planning_conversations (
     id UUID PRIMARY KEY,
     player_id UUID REFERENCES players(id),
     status VARCHAR(20),
     messages JSONB,
     extracted_data JSONB,
     generated_plan_id UUID REFERENCES annual_training_plans(id),
     created_at TIMESTAMPTZ,
     updated_at TIMESTAMPTZ
   );
   ```

2. **Conversation Service**
   ```typescript
   // src/domain/ai/conversational-planning.service.ts
   export class ConversationalPlanningService {

     async startConversation(playerId: string): Promise<ConversationResponse> {
       // 1. Get player profile
       const player = await this.getPlayerProfile(playerId);

       // 2. Create conversation record
       const conversation = await prisma.planningConversation.create({
         data: {
           playerId,
           status: 'active',
           messages: [],
           extractedData: {}
         }
       });

       // 3. Generate initial Claude prompt
       const systemPrompt = this.buildSystemPrompt(player);
       const response = await claudeClient.chat([{
         role: 'user',
         content: 'Jeg vil ha en treningsplan for 2025'
       }], { system: systemPrompt });

       // 4. Store message and return
       await this.addMessage(conversation.id, 'user', 'Jeg vil ha...');
       await this.addMessage(conversation.id, 'assistant', response.content);

       return {
         conversationId: conversation.id,
         message: response.content
       };
     }

     async continueConversation(
       conversationId: string,
       userMessage: string
     ): Promise<ConversationResponse> {
       // 1. Load conversation history
       const conversation = await this.loadConversation(conversationId);

       // 2. Build messages array for Claude
       const messages = this.buildMessageHistory(conversation);
       messages.push({ role: 'user', content: userMessage });

       // 3. Call Claude with full context
       const response = await claudeClient.chat(messages, {
         system: this.buildSystemPrompt(),
         tools: this.getPlanningTools() // Tools for data extraction
       });

       // 4. Handle tool use (data extraction)
       if (response.stop_reason === 'tool_use') {
         await this.extractStructuredData(conversation.id, response.tool_calls);
       }

       // 5. Check if ready to generate plan
       if (this.hasEnoughInformation(conversation.extractedData)) {
         // Offer to generate plan
         return {
           conversationId,
           message: response.content,
           canGeneratePlan: true
         };
       }

       // 6. Store and return
       await this.addMessage(conversationId, 'user', userMessage);
       await this.addMessage(conversationId, 'assistant', response.content);

       return {
         conversationId,
         message: response.content
       };
     }

     async generatePlanFromConversation(
       conversationId: string
     ): Promise<AnnualPlanGenerationResult> {
       // Extract structured data from conversation
       const conversation = await this.loadConversation(conversationId);
       const planInput = this.convertToGenerationInput(conversation.extractedData);

       // Use existing generation service
       const result = await PlanGenerationService.generateAnnualPlan(planInput);

       // Link plan to conversation
       await prisma.planningConversation.update({
         where: { id: conversationId },
         data: {
           generatedPlanId: result.annualPlan.id,
           status: 'completed'
         }
       });

       return result;
     }
   }
   ```

3. **System Prompts Engineering**
   ```typescript
   private buildSystemPrompt(player?: Player): string {
     return `Du er en elite golf-coach som lager personaliserte 12-måneders treningsplaner.

DITT MÅL:
Samle nok informasjon gjennom naturlig samtale til å lage en optimal plan.

SPILLERPROFIL (hvis tilgjengelig):
${player ? `
- Snittcore: ${player.averageScore}
- Handicap: ${player.handicap}
- Driver speed: ${player.driverSpeed} mph
- Breaking points: ${player.breakingPoints}
- Mål: ${player.goals}
` : 'Ingen tidligere data'}

NØDVENDIG INFORMASJON:
1. Treningshistorie (erfaring, tidligere planer)
2. Skadehistorikk (særlig rygg, skulder, håndledd)
3. Tilgjengelighet (timer/uke, dager tilgjengelig)
4. Største frustrasjon/svakhet på banen
5. Sesongmål (turneringer, target handicap)
6. Livsstil-faktorer (jobb, familie, stress)
7. Mentale aspekter (press, fokus, motivasjon)

SAMTALESTIL:
- Vær empatisk og engasjerende
- Still 1-2 spørsmål om gangen (ikke intervju)
- Bygg på spillerens svar med innsikt
- Forklar "hvorfor" du spør om noe
- Gi små råd underveis for å bygge tillit

TOOLS TILGJENGELIG:
- extract_player_data: Strukturer info fra samtalen
- check_information_complete: Sjekk om klar for planlegging
- generate_plan_preview: Vis utkast til plan for feedback

Når du har nok info (etter 5-7 spørsmål), tilby å vise et planutkast.`;
   }
   ```

4. **API Routes**
   ```typescript
   // src/api/v1/ai/conversational-planning.routes.ts

   // POST /api/v1/ai/planning/start
   app.post('/start', async (request, reply) => {
     const { playerId } = request.body;
     const result = await ConversationalPlanningService.startConversation(playerId);
     return reply.code(201).send({ success: true, data: result });
   });

   // POST /api/v1/ai/planning/:conversationId/message
   app.post('/:conversationId/message', async (request, reply) => {
     const { conversationId } = request.params;
     const { message } = request.body;
     const result = await ConversationalPlanningService.continueConversation(
       conversationId,
       message
     );
     return reply.send({ success: true, data: result });
   });

   // POST /api/v1/ai/planning/:conversationId/generate
   app.post('/:conversationId/generate', async (request, reply) => {
     const { conversationId } = request.params;
     const result = await ConversationalPlanningService.generatePlanFromConversation(
       conversationId
     );
     return reply.send({ success: true, data: result });
   });

   // GET /api/v1/ai/planning/:conversationId/history
   app.get('/:conversationId/history', async (request, reply) => {
     const conversation = await ConversationalPlanningService.loadConversation(
       request.params.conversationId
     );
     return reply.send({ success: true, data: conversation });
   });
   ```

5. **Claude Tools for Data Extraction**
   ```typescript
   const planningTools = [
     {
       name: 'extract_player_data',
       description: 'Extract structured information from player responses',
       input_schema: {
         type: 'object',
         properties: {
           trainingHistory: {
             type: 'string',
             description: 'Previous training experience'
           },
           injuries: {
             type: 'array',
             items: { type: 'string' },
             description: 'Past or current injuries'
           },
           weeklyAvailability: {
             type: 'number',
             description: 'Hours available per week'
           },
           mainWeakness: {
             type: 'string',
             description: 'Biggest frustration on course'
           },
           goals: {
             type: 'array',
             items: { type: 'string' },
             description: 'Season goals and targets'
           },
           lifeFactors: {
             type: 'object',
             description: 'Work, family, stress level'
           }
         }
       }
     },
     {
       name: 'check_information_complete',
       description: 'Check if enough information has been gathered',
       input_schema: {
         type: 'object',
         properties: {
           completeness: {
             type: 'number',
             description: 'Percentage of required info (0-100)'
           },
           missingItems: {
             type: 'array',
             items: { type: 'string' }
           }
         }
       }
     }
   ];
   ```

**Deliverables**:
- ✅ PlanningConversation database model
- ✅ ConversationalPlanningService with multi-turn dialog
- ✅ API routes for conversation flow
- ✅ Claude tools for data extraction
- ✅ System prompt engineering
- ✅ Integration tests with mock conversations

**Estimat**: 10 dager (2 utviklere)

---

### Uke 4: Testing & Refinement

**Oppgaver**:

1. **End-to-End Testing**
   - Create test conversations covering different player profiles
   - Test conversation branches and edge cases
   - Validate data extraction accuracy
   - Test plan generation from extracted data

2. **Prompt Optimization**
   - A/B test different system prompts
   - Measure conversation quality (avg questions to completion)
   - Refine based on user feedback
   - Document best practices

3. **Performance Optimization**
   - Cache conversation context (reduce API calls)
   - Implement streaming for real-time responses
   - Optimize database queries
   - Add monitoring and logging

4. **Documentation**
   - API documentation for frontend team
   - Conversation flow diagrams
   - Example conversations (happy path + edge cases)
   - Deployment guide

**Deliverables**:
- ✅ Comprehensive test suite
- ✅ Optimized prompts and performance
- ✅ Complete documentation
- ✅ Ready for Phase 2

**Estimat**: 5 dager (2 utviklere)

---

## 📋 FASE 2: Intelligence (Uke 5-10)

**Mål**: Adaptive coaching med prognosering og intelligent sesjondesign

### Uke 5-6: Adaptive Rebalancing Engine

**Oppgaver**:

1. **Weekly Analysis Service**
   ```typescript
   // src/domain/ai/adaptive-rebalancing.service.ts

   interface WeeklyAnalysis {
     weekNumber: number;
     completionRate: number;
     avgQualityRating: number;
     breakingPointVelocity: number;
     fatigueLevel: number;
     recentPerformance?: {
       scores: number[];
       trend: 'improving' | 'stable' | 'declining';
     };
   }

   export class AdaptiveRebalancingService {

     async analyzeWeek(planId: string, weekNumber: number): Promise<WeeklyAnalysis> {
       // Gather data from multiple sources
       const assignments = await this.getWeekAssignments(planId, weekNumber);
       const feedback = await this.getSessionFeedback(assignments);
       const breakingPoints = await this.getBreakingPointProgress(planId);
       const performance = await this.getRecentScores(planId);

       return {
         weekNumber,
         completionRate: this.calculateCompletionRate(assignments),
         avgQualityRating: this.avgRating(feedback, 'quality'),
         breakingPointVelocity: this.calculateVelocity(breakingPoints),
         fatigueLevel: this.avgRating(feedback, 'fatigue'),
         recentPerformance: this.analyzeScoreTrend(performance)
       };
     }

     async generateRecommendations(
       planId: string,
       weekNumber: number
     ): Promise<AdaptiveRecommendation[]> {
       // 1. Analyze current week
       const analysis = await this.analyzeWeek(planId, weekNumber);

       // 2. Get plan context
       const plan = await this.getPlanContext(planId, weekNumber);

       // 3. Ask Claude for recommendations
       const response = await claudeClient.chat([{
         role: 'user',
         content: `Analyser denne ukens treningsdata og gi anbefalinger:

ANALYSE:
- Fullføringsgrad: ${analysis.completionRate}% (target: 85%+)
- Gjennomsnittlig kvalitet: ${analysis.avgQualityRating}/10
- Breaking point progresjon: ${analysis.breakingPointVelocity}%/uke
- Tretthetsnivå: ${analysis.fatigueLevel}/10
- Score-trend: ${analysis.recentPerformance?.trend || 'ukjent'}

PLAN-KONTEKST:
- Uke: ${weekNumber} av ${plan.totalWeeks}
- Periode: ${plan.currentPeriod} (${plan.periodPhase})
- Intensitet: ${plan.volumeIntensity}
- Neste milepæl: ${plan.nextMilestone}

KOMMENDE UKE:
- Planlagt: ${plan.nextWeekSummary}
- Turnering: ${plan.upcomingTournament || 'Ingen'}

ANBEFALINGER:
Vurder justeringer for neste uke basert på:
1. Er spilleren over/under-trent?
2. Går breaking point-progresjon som forventet?
3. Er intensitet passende for periode?
4. Trengs recovery eller push?

Bruk tools til å foreslå konkrete endringer.`
       }], {
         tools: this.getRebalancingTools()
       });

       // 4. Parse tool calls into recommendations
       const recommendations = this.parseToolCalls(response);

       // 5. Store as AI insights
       await this.storeInsights(planId, recommendations);

       return recommendations;
     }

     async applyRecommendations(
       planId: string,
       recommendations: AdaptiveRecommendation[],
       autoApply: boolean = false
     ): Promise<AppliedChanges> {
       const changes = [];

       for (const rec of recommendations) {
         // Only auto-apply low-risk changes
         if (autoApply && rec.risk === 'low') {
           const change = await this.applyRecommendation(planId, rec);
           changes.push(change);
         }
       }

       return { applied: changes, pendingApproval: recommendations.filter(r => r.risk !== 'low') };
     }
   }
   ```

2. **Rebalancing Tools for Claude**
   ```typescript
   const rebalancingTools = [
     {
       name: 'adjust_weekly_intensity',
       description: 'Adjust intensity level for upcoming week',
       input_schema: {
         type: 'object',
         properties: {
           weekNumber: { type: 'number' },
           newIntensity: {
             type: 'string',
             enum: ['low', 'medium', 'high', 'peak', 'taper']
           },
           reason: { type: 'string' }
         }
       }
     },
     {
       name: 'add_rest_day',
       description: 'Add extra rest day to reduce fatigue',
       input_schema: {
         type: 'object',
         properties: {
           date: { type: 'string', format: 'date' },
           replaceSession: { type: 'string' }, // Which session to replace
           reason: { type: 'string' }
         }
       }
     },
     {
       name: 'increase_breaking_point_focus',
       description: 'Allocate more time to specific breaking point',
       input_schema: {
         type: 'object',
         properties: {
           breakingPointId: { type: 'string' },
           additionalMinutes: { type: 'number' },
           duration: { type: 'number', description: 'How many weeks' }
         }
       }
     },
     {
       name: 'substitute_session',
       description: 'Replace a session with different type',
       input_schema: {
         type: 'object',
         properties: {
           date: { type: 'string', format: 'date' },
           newSessionType: { type: 'string' },
           reason: { type: 'string' }
         }
       }
     }
   ];
   ```

3. **Automated Weekly Trigger**
   ```typescript
   // src/jobs/weekly-analysis.job.ts
   import cron from 'node-cron';

   // Run every Monday at 6 AM
   cron.schedule('0 6 * * 1', async () => {
     const activePlans = await prisma.annualTrainingPlan.findMany({
       where: { status: 'active' }
     });

     for (const plan of activePlans) {
       try {
         // Calculate current week
         const weekNumber = calculateWeekNumber(plan.startDate, new Date());

         // Generate recommendations
         const recommendations = await AdaptiveRebalancingService.generateRecommendations(
           plan.id,
           weekNumber
         );

         // Auto-apply low-risk changes
         await AdaptiveRebalancingService.applyRecommendations(
           plan.id,
           recommendations,
           true // auto-apply
         );

         // Notify player of changes
         await NotificationService.sendWeeklyUpdate(plan.playerId, recommendations);

       } catch (error) {
         logger.error(`Failed to analyze plan ${plan.id}:`, error);
       }
     }
   });
   ```

**Deliverables**:
- ✅ AIInsight database model
- ✅ AdaptiveRebalancingService
- ✅ Weekly analysis automation
- ✅ Recommendation approval UI/API
- ✅ Auto-apply logic for low-risk changes

**Estimat**: 10 dager (2 utviklere)

---

### Uke 7-8: Performance Prediction

**Oppgaver**:

1. **Outcome Data Collection**
   ```typescript
   // src/domain/ai/outcome-tracking.service.ts

   export class OutcomeTrackingService {

     async recordMilestone(
       planId: string,
       timepoint: '3_months' | '6_months' | '12_months'
     ) {
       const plan = await this.getPlanWithHistory(planId);
       const player = await this.getPlayerWithHistory(plan.playerId);

       // Calculate improvement
       const outcome = {
         playerId: plan.playerId,
         planId: plan.id,
         timepoint,
         scoreBaseline: plan.baselineAverageScore,
         scoreCurrent: player.currentAverageScore,
         scoreImprovement: player.currentAverageScore - plan.baselineAverageScore,
         breakingPointsResolved: await this.countResolved(plan.playerId),
         sessionsCompleted: await this.countCompleted(plan.id),
         metadata: {
           category: plan.playerCategory,
           basePeriodWeeks: plan.basePeriodWeeks,
           specializationWeeks: plan.specializationWeeks,
           weeklyHoursTarget: plan.weeklyHoursTarget,
           breakingPointTypes: await this.getBreakingPointTypes(plan.playerId),
           completionRate: await this.getOverallCompletionRate(plan.id)
         }
       };

       await prisma.trainingOutcome.create({ data: outcome });
       return outcome;
     }
   }
   ```

2. **Prediction Service**
   ```typescript
   // src/domain/ai/performance-prediction.service.ts

   export class PerformancePredictionService {

     async predictFuturePerformance(planId: string): Promise<PerformanceForecast> {
       // 1. Get current state
       const plan = await this.getPlanWithProgress(planId);
       const player = await this.getPlayerProfile(plan.playerId);
       const progress = await PlanProgressService.getProgressSummary(planId);

       // 2. Get historical outcomes from similar players
       const similarOutcomes = await this.findSimilarCases({
         category: plan.playerCategory,
         baselineScore: plan.baselineAverageScore,
         weeklyHours: plan.weeklyHoursTarget,
         breakingPointTypes: await this.getBreakingPointTypes(plan.playerId)
       });

       // 3. Ask Claude to predict
       const response = await claudeClient.chat([{
         role: 'user',
         content: `Prediker fremtidig prestasjon basert på data:

NÅVÆRENDE STATUS:
- Spiller: ${plan.playerCategory} (${plan.baselineAverageScore} snitt)
- Ukentlig treningsvolum: ${plan.weeklyHoursTarget} timer
- Uke ${progress.overall.weeksCurrent} av ${progress.overall.totalWeeks}
- Fullføringsgrad: ${progress.assignments.completionRate}%
- Breaking points: ${progress.breakingPoints.total} (${progress.breakingPoints.avgProgress}% avg progresjon)

HISTORISKE DATA (${similarOutcomes.length} lignende spillere):
- Gjennomsnittlig forbedring: ${this.avgImprovement(similarOutcomes)} slag/år
- Range: ${this.minImprovement(similarOutcomes)} til ${this.maxImprovement(similarOutcomes)}
- Breaking point suksessrate: ${this.avgBPSuccess(similarOutcomes)}%

PREDIKER:
1. 3-måneders score (uke ${progress.overall.weeksCurrent + 12})
2. 6-måneders score (uke ${progress.overall.weeksCurrent + 24})
3. 12-måneders score (ved plan slutt)

Inkluder:
- Forventet score med confidence interval
- Reasoning for hver prediksjon
- Faktorer som kan påvirke (positiv/negativ)
- Milestone-anbefalinger

Bruk tools for strukturert output.`
       }], {
         tools: [{
           name: 'predict_milestone',
           description: 'Predict score at future milestone',
           input_schema: {
             type: 'object',
             properties: {
               weeks: { type: 'number' },
               expectedScore: { type: 'number' },
               confidenceLow: { type: 'number' },
               confidenceHigh: { type: 'number' },
               confidence: { type: 'number', minimum: 0, maximum: 1 },
               reasoning: { type: 'string' },
               keyFactors: {
                 type: 'array',
                 items: { type: 'string' }
               }
             }
           }
         }]
       });

       return this.parsePredictions(response);
     }

     async suggestGoals(planId: string): Promise<GoalRecommendations> {
       const forecast = await this.predictFuturePerformance(planId);

       // Claude suggests realistic, aggressive, conservative goals
       const response = await claudeClient.chat([{
         role: 'user',
         content: `Basert på prediksjoner, foreslå mål:

PREDIKSJONER:
- 3 måneder: ${forecast.milestones[0].expectedScore} (±${forecast.milestones[0].confidenceInterval})
- 6 måneder: ${forecast.milestones[1].expectedScore} (±${forecast.milestones[1].confidenceInterval})
- 12 måneder: ${forecast.milestones[2].expectedScore} (±${forecast.milestones[2].confidenceInterval})

FORESLÅ 3 MÅL-SCENARIOS:
1. Aggressivt (75th percentile, krever høy consistency)
2. Realistisk (50th percentile, standard trajectory)
3. Konservativt (25th percentile, accounting for setbacks)

For hvert scenario, inkluder:
- Målscore ved 3/6/12 måneder
- Nødvendige checkpoints
- Risikofaktorer
- Success factors`
       }]
       });

       return this.parseGoalRecommendations(response);
     }
   }
   ```

3. **Prediction API**
   ```typescript
   // GET /api/v1/ai/prediction/:planId
   app.get('/:planId', async (request, reply) => {
     const forecast = await PerformancePredictionService.predictFuturePerformance(
       request.params.planId
     );
     return reply.send({ success: true, data: forecast });
   });

   // GET /api/v1/ai/prediction/:planId/goals
   app.get('/:planId/goals', async (request, reply) => {
     const goals = await PerformancePredictionService.suggestGoals(
       request.params.planId
     );
     return reply.send({ success: true, data: goals });
   });
   ```

**Deliverables**:
- ✅ TrainingOutcome database model
- ✅ Outcome tracking at milestones
- ✅ Prediction service with historical data
- ✅ Goal recommendation engine
- ✅ API for frontend integration

**Estimat**: 10 dager (2 utviklere)

---

### Uke 9-10: Intelligent Session Design

**Oppgaver**:

1. **Session Design Service**
   ```typescript
   // src/domain/ai/session-design.service.ts

   interface SessionDesignContext {
     player: PlayerProfile;
     weekNumber: number;
     period: string;
     learningPhase: string;
     availableMinutes: number;
     breakingPointFocus?: BreakingPoint;
     recentSessions: Session[];
     fatigueLevel: number;
     weatherConditions?: string;
     equipmentAvailable?: string[];
   }

   export class SessionDesignService {

     async designCustomSession(context: SessionDesignContext): Promise<CustomSession> {
       // Ask Claude to design tailored session
       const response = await claudeClient.chat([{
         role: 'user',
         content: `Design en treningsøkt tilpasset denne spilleren:

SPILLER:
- Kategori: ${context.player.category}
- Snittcore: ${context.player.averageScore}
- Breaking point fokus: ${context.breakingPointFocus?.area || 'Generelt'}

KONTEKST:
- Uke: ${context.weekNumber} (${context.period} periode)
- Læringsfase: ${context.learningPhase}
- Tilgjengelig tid: ${context.availableMinutes} minutter
- Tretthet: ${context.fatigueLevel}/10
- Siste økter: ${context.recentSessions.map(s => s.type).join(', ')}

DESIGN PRINSIPPER:
1. Progressive overload (litt hardere enn sist)
2. Spesifisitet (match periode og fase)
3. Variasjon (ikke repeter eksakt samme drills)
4. Recovery awareness (juster for tretthet)
5. Breaking point prioritering

OUTPUT FORMAT:
- Oppvarming (5-15min)
- Hovedøkt (delt i 2-3 blokker)
- Nedtrapping (5-10min)
- Metrics å tracke
- Hjemmelekse

Vær spesifikk med:
- Antall repetisjoner
- Pause mellom sett
- Intensitetsnivå
- Success criteria`
       }], {
         tools: [{
           name: 'structure_session',
           description: 'Create structured session plan',
           input_schema: {
             type: 'object',
             properties: {
               sessionName: { type: 'string' },
               totalDuration: { type: 'number' },
               warmup: {
                 type: 'object',
                 properties: {
                   duration: { type: 'number' },
                   drills: { type: 'array', items: { type: 'string' } }
                 }
               },
               mainBlocks: {
                 type: 'array',
                 items: {
                   type: 'object',
                   properties: {
                     name: { type: 'string' },
                     duration: { type: 'number' },
                     drills: { type: 'array' },
                     rationale: { type: 'string' }
                   }
                 }
               },
               cooldown: {
                 type: 'object',
                 properties: {
                   duration: { type: 'number' },
                   activities: { type: 'array', items: { type: 'string' } }
                 }
               },
               metricsToTrack: { type: 'array', items: { type: 'string' } },
               homework: { type: 'array', items: { type: 'string' } }
             }
           }
         }]
       });

       const session = this.parseSessionDesign(response);

       // Store as AI-generated session
       await this.storeCustomSession(context.player.id, session);

       return session;
     }

     async replaceTemplateWithCustom(assignmentId: string): Promise<void> {
       // Get assignment context
       const assignment = await this.getAssignmentWithContext(assignmentId);

       // Design custom session
       const customSession = await this.designCustomSession({
         player: assignment.player,
         weekNumber: assignment.weekNumber,
         period: assignment.period,
         learningPhase: assignment.learningPhase,
         availableMinutes: assignment.estimatedDuration,
         breakingPointFocus: await this.getPriorityBreakingPoint(assignment.playerId),
         recentSessions: await this.getRecentSessions(assignment.playerId, 5),
         fatigueLevel: await this.getFatigueLevel(assignment.playerId)
       });

       // Update assignment with custom design
       await prisma.dailyTrainingAssignment.update({
         where: { id: assignmentId },
         data: {
           sessionTemplateId: null, // No longer template-based
           coachNotes: JSON.stringify(customSession), // Store custom design
           canBeSubstituted: false // Custom sessions should not be auto-replaced
         }
       });
     }
   }
   ```

2. **Progressive Overload Tracking**
   ```typescript
   // Track session difficulty over time
   interface ProgressiveOverloadTracker {
     calculateNextSessionDifficulty(
       recentSessions: Session[],
       targetIncrease: number = 0.05 // 5% increase
     ): number {
       const avgDifficulty = this.avgSessionDifficulty(recentSessions);
       const nextDifficulty = avgDifficulty * (1 + targetIncrease);
       return Math.min(nextDifficulty, 10); // Cap at 10
     }

     private avgSessionDifficulty(sessions: Session[]): number {
       // Composite score from duration, intensity, complexity
       return sessions.reduce((sum, s) => {
         return sum + (
           (s.duration / 180) * 0.3 +      // Duration factor
           (s.intensity / 10) * 0.4 +       // Intensity factor
           (this.learningPhaseComplexity(s.learningPhase)) * 0.3
         );
       }, 0) / sessions.length;
     }
   }
   ```

**Deliverables**:
- ✅ SessionDesignService with Claude integration
- ✅ Custom session storage and retrieval
- ✅ Progressive overload calculation
- ✅ Template replacement API
- ✅ Session quality feedback loop

**Estimat**: 10 dager (2 utviklere)

---

## 📋 FASE 3: Advanced Features (Uke 11-18)

**Mål**: Multi-modal integration og precision diagnostics

### Uke 11-13: Breaking Point Precision

**Oppgaver**:

1. **Root Cause Diagnosis**
2. **Similar Case Matching**
3. **Exercise Effectiveness Ranking**
4. **Timeline Prediction**

**Estimat**: 15 dager (2 utviklere)

---

### Uke 14-16: Multi-Modal Integration

**Oppgaver**:

1. **Video Analysis with Claude Vision**
2. **Voice Coaching Interface**
3. **Real-time Feedback During Sessions**

**Estimat**: 15 dager (2 utviklere)

---

### Uke 17-18: Integration & Testing

**Oppgaver**:

1. **End-to-end testing**
2. **Performance optimization**
3. **User acceptance testing**
4. **Production deployment**

**Estimat**: 10 dager (3 utviklere)

---

## 📋 FASE 4: Scale & Learn (Ongoing)

### Data Collection Pipeline

```typescript
// Anonymized data aggregation for ML
export class DataLearningPipeline {

  async aggregateOutcomes(): Promise<AggregatedInsights> {
    // Aggregate across all players (anonymized)
    const outcomes = await prisma.trainingOutcome.findMany({
      select: {
        // Exclude PII
        scoreImprovement: true,
        metadata: true,
        breakingPointsResolved: true,
        sessionsCompleted: true
      }
    });

    // Group by player category
    const insights = this.groupAndAnalyze(outcomes);

    // Use Claude to find patterns
    const patterns = await this.findPatterns(insights);

    return patterns;
  }

  async improveAlgorithms(patterns: AggregatedInsights): Promise<void> {
    // Use insights to update templates, session selection logic, etc.
    // This is continuous improvement loop
  }
}
```

---

## 📊 Success Metrics & KPIs

### Phase 1 (Foundation)
- ✅ Conversation completion rate >80%
- ✅ Avg questions to plan generation <7
- ✅ Player satisfaction with conversation >4/5
- ✅ Data extraction accuracy >90%

### Phase 2 (Intelligence)
- ✅ Weekly recommendations accepted rate >60%
- ✅ Prediction accuracy within ±1 stroke at 3 months
- ✅ Custom session quality rating >4/5
- ✅ Breaking point resolution time -20%

### Phase 3 (Advanced)
- ✅ Video analysis insights rated useful >70%
- ✅ Breaking point diagnosis accuracy >85%
- ✅ Multi-modal engagement increase +40%

### Phase 4 (Scale)
- ✅ Score improvement: -4.5 slag/år (vs -3.2 baseline)
- ✅ Plan completion rate: 90% (vs 70% baseline)
- ✅ Player retention: +25%
- ✅ Coach efficiency: 50% reduction in time per player

---

## 💰 Resource Requirements

### Team
- **2 Backend developers** (Full-time, 18 uker)
- **1 Frontend developer** (Part-time for API integration, 12 uker)
- **1 ML/Data engineer** (Part-time for Phase 4, 8 uker)
- **1 Golf domain expert** (Consulting, ongoing)

### Infrastructure
- **Claude API**: ~$2000/mnd (estimat for 100 aktive spillere)
- **Database storage**: +20% for new tables
- **Monitoring**: Datadog/Sentry for AI service tracking

### Total Estimat
- **Development**: 18 uker (2 utviklere)
- **Budget**: ~$35,000 (salaries + API costs)
- **ROI**: Break-even ved 50 betalende spillere @ $50/mnd

---

## 🚀 Deployment Strategy

### Phase 1 Beta (Uke 4)
- **Internal testing** med 5 test-spillere
- **Feedback collection** for prompt refinement
- **Performance monitoring** for API usage

### Phase 2 Limited Release (Uke 10)
- **Beta users**: 20 existing customers
- **A/B testing**: AI vs traditional planning
- **Data collection** for prediction models

### Phase 3 Public Launch (Uke 18)
- **Full release** to all customers
- **Marketing campaign** highlighting AI features
- **Coach training** on AI-assisted workflows

### Phase 4 Continuous (Ongoing)
- **Monthly algorithm updates** based on data
- **New feature releases** quarterly
- **Community feedback** integration

---

## 🎯 Next Steps

**Immediate Actions:**
1. ✅ Review og godkjenn roadmap
2. ✅ Set opp Anthropic API account
3. ✅ Assign development team
4. ✅ Kick-off meeting (dag 1)

**Week 1 Deliverables:**
- Claude SDK integrated
- Base service med error handling
- System prompt v1 drafted
- Database migrations planned

**Ready to Start?** 🚀
