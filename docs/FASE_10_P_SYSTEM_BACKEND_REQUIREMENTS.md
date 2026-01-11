# FASE 10.4: P-System (Teknisk Plan) - Backend Requirements

## Status
✅ **Frontend UI Complete**
⏳ **Backend Implementation Required**

---

## Completed (Frontend)

### UI Components ✅
**File:** `apps/web/src/features/technique-plan/TechnicalPlanView.tsx`

**Features implemented:**
- P1.0 - P10.0 level selector and display
- Task card with expandable details
- Repetitions tracking
- Image/video upload UI
- Drills assignment interface
- Responsible person assignment
- Priority ordering (drag handle visible)
- Three-tab layout:
  - **Utviklingsområder** - P-tasks management
  - **Status & Progresjon** - Image/video progress tracking
  - **TrackMan Data** - TrackMan file import and analysis
- Summary statistics cards
- Mock data for development

### Navigation ✅
**Files:**
- `apps/web/src/App.jsx` (line 137, 1350-1356)
- `apps/web/src/config/player-navigation-v3.ts` (line 196)

- Route: `/plan/teknisk-plan`
- Navigation: Trening → Teknisk plan → P-System (P1.0-P10.0)

---

## P-System Overview

The P-System is a position-based technical development framework used in golf instruction:

- **P1.0** - Address position & posture
- **P2.0** - Takeaway
- **P3.0** - Mid-backswing
- **P4.0** - Top of backswing
- **P5.0** - Transition/early downswing
- **P6.0** - Mid-downswing
- **P7.0** - Impact
- **P8.0** - Early follow-through
- **P9.0** - Mid follow-through
- **P10.0** - Finish position

Each position can have multiple development tasks with drills, responsible persons, and progress tracking.

---

## Database Schema

### Core Tables

```sql
-- Technical tasks (P-system positions)
CREATE TABLE technical_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  p_level VARCHAR(10) NOT NULL CHECK (p_level IN (
    'P1.0', 'P2.0', 'P3.0', 'P4.0', 'P5.0',
    'P6.0', 'P7.0', 'P8.0', 'P9.0', 'P10.0'
  )),
  description TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  repetitions INTEGER DEFAULT 0,
  priority_order INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drills linked to technical tasks
CREATE TABLE technical_task_drills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES technical_tasks(id) ON DELETE CASCADE,
  drill_id UUID REFERENCES exercises(id), -- Link to existing exercises table
  drill_name VARCHAR(255), -- For custom drills not in exercise library
  drill_category VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Responsible persons for tasks
CREATE TABLE technical_task_responsible (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES technical_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  role VARCHAR(50) NOT NULL, -- 'coach', 'mentor', 'parent', etc.
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id, user_id)
);

-- Progress tracking images
CREATE TABLE technical_task_progress_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES technical_tasks(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress tracking videos
CREATE TABLE technical_task_progress_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES technical_tasks(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  duration_seconds INTEGER,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- TrackMan data records
CREATE TABLE trackman_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  task_id UUID REFERENCES technical_tasks(id), -- Optional link to P-level task
  session_date DATE NOT NULL,

  -- Swing data
  attack_angle DECIMAL(5,2), -- degrees
  low_point DECIMAL(5,2), -- inches
  swing_direction DECIMAL(5,2), -- degrees
  swing_plane DECIMAL(5,2), -- degrees
  club_path DECIMAL(5,2), -- degrees
  face_angle DECIMAL(5,2), -- degrees
  face_to_path DECIMAL(5,2), -- degrees
  dynamic_loft DECIMAL(5,2), -- degrees

  -- Impact
  impact_location VARCHAR(50), -- 'center', 'toe', 'heel', etc.

  -- Speed
  club_speed DECIMAL(5,2), -- mph
  ball_speed DECIMAL(5,2), -- mph
  smash_factor DECIMAL(4,3),

  -- Ball flight
  launch_angle DECIMAL(5,2), -- degrees
  spin_rate INTEGER, -- rpm
  carry_distance DECIMAL(5,1), -- yards
  total_distance DECIMAL(5,1), -- yards

  -- Metadata
  club VARCHAR(50), -- 'Driver', '7 Iron', etc.
  raw_file_url TEXT, -- Original TrackMan file
  ai_analysis TEXT, -- AI-generated insights from file import

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TrackMan reference data (player's target values)
CREATE TABLE trackman_reference_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  club VARCHAR(50) NOT NULL, -- 'Driver', '7 Iron', etc.
  parameter VARCHAR(50) NOT NULL, -- 'attack_angle', 'club_path', etc.
  target_value DECIMAL(5,2) NOT NULL,
  tolerance DECIMAL(5,2) NOT NULL, -- Acceptable deviation (+/-)
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, club, parameter)
);

-- Indexes for performance
CREATE INDEX idx_technical_tasks_player ON technical_tasks(player_id);
CREATE INDEX idx_technical_tasks_priority ON technical_tasks(player_id, priority_order);
CREATE INDEX idx_technical_task_drills_task ON technical_task_drills(task_id);
CREATE INDEX idx_technical_task_responsible_task ON technical_task_responsible(task_id);
CREATE INDEX idx_trackman_data_player ON trackman_data(player_id);
CREATE INDEX idx_trackman_data_session_date ON trackman_data(session_date DESC);
CREATE INDEX idx_trackman_reference_player ON trackman_reference_data(player_id);
```

---

## API Endpoints

### Technical Tasks

```typescript
GET /api/v1/technique-plan/:playerId
Response: {
  tasks: Array<{
    id: string;
    pLevel: 'P1.0' | 'P2.0' | ... | 'P10.0';
    description: string;
    imageUrl?: string;
    videoUrl?: string;
    repetitions: number;
    priorityOrder: number;
    status: 'active' | 'completed' | 'paused';
    drills: Array<{
      id: string;
      name: string;
      category: string;
    }>;
    responsible: Array<{
      id: string;
      name: string;
      role: string;
    }>;
    progressImages: Array<{
      id: string;
      url: string;
      uploadedAt: string;
    }>;
    progressVideos: Array<{
      id: string;
      url: string;
      uploadedAt: string;
    }>;
  }>
}

POST /api/v1/technique-plan/:playerId/tasks
Body: {
  pLevel: string;
  description: string;
  repetitions?: number;
  priorityOrder: number;
}
Response: { task: { /* created task */ } }

PUT /api/v1/technique-plan/tasks/:taskId
Body: {
  description?: string;
  repetitions?: number;
  priorityOrder?: number;
  status?: 'active' | 'completed' | 'paused';
}
Response: { task: { /* updated task */ } }

DELETE /api/v1/technique-plan/tasks/:taskId
Response: { success: boolean }

PUT /api/v1/technique-plan/tasks/:taskId/priority
Body: {
  newPriorityOrder: number;
}
Response: { success: boolean }
Notes: Reorders all tasks when priority changes
```

### Drills Management

```typescript
POST /api/v1/technique-plan/tasks/:taskId/drills
Body: {
  drillId?: string; // ID from exercises table
  drillName?: string; // For custom drills
  drillCategory?: string;
}
Response: { drill: { /* created drill link */ } }

DELETE /api/v1/technique-plan/tasks/:taskId/drills/:drillId
Response: { success: boolean }
```

### Responsible Persons

```typescript
POST /api/v1/technique-plan/tasks/:taskId/responsible
Body: {
  userId: string;
  role: string; // 'coach', 'mentor', etc.
}
Response: { responsible: { /* created assignment */ } }

DELETE /api/v1/technique-plan/tasks/:taskId/responsible/:userId
Response: { success: boolean }
```

### Progress Tracking

```typescript
POST /api/v1/technique-plan/tasks/:taskId/images
Body: multipart/form-data {
  file: File;
  caption?: string;
}
Response: { image: { id, url, uploadedAt } }

POST /api/v1/technique-plan/tasks/:taskId/videos
Body: multipart/form-data {
  file: File;
  caption?: string;
}
Response: { video: { id, url, thumbnailUrl, uploadedAt } }

DELETE /api/v1/technique-plan/tasks/:taskId/images/:imageId
Response: { success: boolean }

DELETE /api/v1/technique-plan/tasks/:taskId/videos/:videoId
Response: { success: boolean }
```

### TrackMan Integration

```typescript
POST /api/v1/trackman/import
Body: multipart/form-data {
  file: File; // CSV or JSON from TrackMan
  playerId: string;
  taskId?: string; // Optional link to P-level task
  club?: string;
}
Response: {
  data: {
    id: string;
    sessionDate: string;
    attackAngle: number;
    clubPath: number;
    faceAngle: number;
    // ... all metrics
    aiAnalysis: string; // AI-generated insights
    deviations: Array<{
      parameter: string;
      value: number;
      target: number;
      deviation: number;
      percentageOff: number;
    }>;
  }
}
Notes:
- Uses OpenAI API to parse and analyze TrackMan file
- Compares values against player's reference data
- Generates insights and recommendations

POST /api/v1/trackman/:playerId/reference
Body: {
  club: string;
  parameter: string;
  targetValue: number;
  tolerance: number;
  notes?: string;
}
Response: { reference: { /* created reference */ } }

GET /api/v1/trackman/:playerId/reference
Query: ?club=Driver
Response: {
  references: Array<{
    club: string;
    parameter: string;
    targetValue: number;
    tolerance: number;
    notes?: string;
  }>
}

GET /api/v1/trackman/:playerId/history
Query: ?club=Driver&parameter=club_path&limit=10
Response: {
  history: Array<{
    date: string;
    value: number;
    deviation: number;
  }>
}

GET /api/v1/trackman/:playerId/analysis
Query: ?taskId=xxx (optional)
Response: {
  summary: {
    totalSessions: number;
    avgClubSpeed: number;
    avgBallSpeed: number;
    consistency: {
      clubPath: { stdDev: number, range: number },
      faceAngle: { stdDev: number, range: number },
      // ... for all parameters
    };
  };
  trends: {
    improving: Array<string>; // Parameters getting better
    declining: Array<string>; // Parameters getting worse
    stable: Array<string>; // Parameters staying consistent
  };
  recommendations: Array<{
    parameter: string;
    issue: string;
    suggestion: string;
  }>;
}
```

---

## TrackMan AI Integration

### File: `apps/api/src/services/trackman/TrackmanImporter.ts`

```typescript
import OpenAI from 'openai';
import { parse as csvParse } from 'csv-parse/sync';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface TrackManRow {
  // TrackMan CSV columns (varies by version)
  [key: string]: string | number;
}

interface ParsedTrackManData {
  sessionDate: Date;
  shots: Array<{
    attackAngle?: number;
    lowPoint?: number;
    swingDirection?: number;
    swingPlane?: number;
    clubPath?: number;
    faceAngle?: number;
    faceToPath?: number;
    dynamicLoft?: number;
    impactLocation?: string;
    clubSpeed?: number;
    ballSpeed?: number;
    smashFactor?: number;
    launchAngle?: number;
    spinRate?: number;
    carryDistance?: number;
    totalDistance?: number;
    club?: string;
  }>;
}

export class TrackManImporter {
  /**
   * Import and parse TrackMan file (CSV or JSON)
   * Uses OpenAI to handle various TrackMan formats
   */
  async importFile(
    fileBuffer: Buffer,
    fileName: string,
    playerId: string,
    taskId?: string,
    club?: string
  ): Promise<{ dataId: string; analysis: string }> {
    try {
      // Step 1: Parse file content
      const fileContent = fileBuffer.toString('utf-8');
      const parsedData = await this.parseTrackManFile(fileContent, fileName);

      // Step 2: Calculate aggregated metrics
      const aggregated = this.aggregateShots(parsedData.shots);

      // Step 3: Get player's reference data
      const references = await this.getPlayerReferences(playerId, club);

      // Step 4: Calculate deviations
      const deviations = this.calculateDeviations(aggregated, references);

      // Step 5: Generate AI analysis
      const aiAnalysis = await this.generateAIAnalysis(
        aggregated,
        deviations,
        parsedData.shots
      );

      // Step 6: Store in database
      const dataId = await this.storeTrackManData(
        playerId,
        taskId,
        aggregated,
        fileContent,
        aiAnalysis
      );

      return { dataId, analysis: aiAnalysis };
    } catch (error) {
      console.error('TrackMan import failed:', error);
      throw new Error(`Failed to import TrackMan data: ${error.message}`);
    }
  }

  /**
   * Use OpenAI to parse TrackMan file
   * Handles different CSV formats and column names
   */
  private async parseTrackManFile(
    fileContent: string,
    fileName: string
  ): Promise<ParsedTrackManData> {
    // Try standard CSV parsing first
    if (fileName.endsWith('.csv')) {
      try {
        const records = csvParse(fileContent, {
          columns: true,
          skip_empty_lines: true,
        });

        // Map TrackMan columns to our schema
        const shots = records.map((row: TrackManRow) => ({
          attackAngle: this.parseNumeric(row['Attack Angle'] || row['attack_angle']),
          clubPath: this.parseNumeric(row['Club Path'] || row['club_path']),
          faceAngle: this.parseNumeric(row['Face Angle'] || row['face_angle']),
          faceToPath: this.parseNumeric(row['Face To Path'] || row['face_to_path']),
          clubSpeed: this.parseNumeric(row['Club Speed'] || row['club_speed']),
          ballSpeed: this.parseNumeric(row['Ball Speed'] || row['ball_speed']),
          // ... map all fields
        }));

        return {
          sessionDate: new Date(),
          shots,
        };
      } catch (error) {
        console.warn('Standard CSV parsing failed, using AI fallback', error);
      }
    }

    // Fallback: Use OpenAI to parse non-standard format
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a TrackMan data parser. Extract golf swing metrics from the provided TrackMan file content. Return a JSON object with this structure:
{
  "sessionDate": "YYYY-MM-DD",
  "shots": [
    {
      "attackAngle": number,
      "clubPath": number,
      "faceAngle": number,
      "faceToPath": number,
      "dynamicLoft": number,
      "clubSpeed": number,
      "ballSpeed": number,
      "smashFactor": number,
      "launchAngle": number,
      "spinRate": number,
      "club": string
    }
  ]
}
Only include fields that are present in the data.`,
        },
        {
          role: 'user',
          content: fileContent,
        },
      ],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(completion.choices[0].message.content!);
  }

  /**
   * Aggregate multiple shots into summary statistics
   */
  private aggregateShots(shots: any[]): Record<string, number> {
    const metrics = [
      'attackAngle',
      'clubPath',
      'faceAngle',
      'faceToPath',
      'dynamicLoft',
      'clubSpeed',
      'ballSpeed',
      'smashFactor',
      'launchAngle',
      'spinRate',
    ];

    const aggregated: Record<string, number> = {};

    for (const metric of metrics) {
      const values = shots
        .map(s => s[metric])
        .filter(v => v !== null && v !== undefined && !isNaN(v));

      if (values.length > 0) {
        aggregated[metric] = values.reduce((a, b) => a + b, 0) / values.length;
      }
    }

    return aggregated;
  }

  /**
   * Calculate deviations from reference values
   */
  private calculateDeviations(
    actual: Record<string, number>,
    references: Array<{ parameter: string; targetValue: number; tolerance: number }>
  ): Array<{
    parameter: string;
    value: number;
    target: number;
    deviation: number;
    percentageOff: number;
    withinTolerance: boolean;
  }> {
    return references.map(ref => {
      const value = actual[ref.parameter] || 0;
      const deviation = value - ref.targetValue;
      const percentageOff = ref.targetValue !== 0
        ? (deviation / ref.targetValue) * 100
        : 0;
      const withinTolerance = Math.abs(deviation) <= ref.tolerance;

      return {
        parameter: ref.parameter,
        value,
        target: ref.targetValue,
        deviation,
        percentageOff,
        withinTolerance,
      };
    });
  }

  /**
   * Generate AI analysis of TrackMan data
   */
  private async generateAIAnalysis(
    aggregated: Record<string, number>,
    deviations: any[],
    rawShots: any[]
  ): Promise<string> {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a golf swing analysis expert. Analyze TrackMan data and provide actionable insights in Norwegian. Focus on:
1. Key strengths and weaknesses
2. Consistency (variability in metrics)
3. Specific technical recommendations
4. Priority areas for improvement

Be concise and practical. Use Norwegian golf terminology.`,
        },
        {
          role: 'user',
          content: JSON.stringify({
            averages: aggregated,
            deviations,
            totalShots: rawShots.length,
          }),
        },
      ],
    });

    return completion.choices[0].message.content!;
  }

  /**
   * Get player's reference data from database
   */
  private async getPlayerReferences(
    playerId: string,
    club?: string
  ): Promise<Array<{ parameter: string; targetValue: number; tolerance: number }>> {
    // Query database for player's reference values
    const query = `
      SELECT parameter, target_value, tolerance
      FROM trackman_reference_data
      WHERE player_id = $1
      ${club ? 'AND club = $2' : ''}
    `;
    const params = club ? [playerId, club] : [playerId];

    // Execute query and return results
    // Implementation depends on your database client
    return [];
  }

  /**
   * Store TrackMan data in database
   */
  private async storeTrackManData(
    playerId: string,
    taskId: string | undefined,
    aggregated: Record<string, number>,
    rawFileContent: string,
    aiAnalysis: string
  ): Promise<string> {
    // Insert into trackman_data table
    // Return the generated UUID
    return 'uuid-placeholder';
  }

  /**
   * Parse numeric value from various formats
   */
  private parseNumeric(value: any): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  }
}
```

### Environment Variables

```bash
# .env
OPENAI_API_KEY=sk-...  # Required for TrackMan AI analysis
```

---

## Implementation Checklist

### Database
- [ ] Run migration to create technical_tasks table
- [ ] Run migration to create technical_task_drills table
- [ ] Run migration to create technical_task_responsible table
- [ ] Run migration to create technical_task_progress_images table
- [ ] Run migration to create technical_task_progress_videos table
- [ ] Run migration to create trackman_data table
- [ ] Run migration to create trackman_reference_data table
- [ ] Add all required indexes

### API Endpoints - Technical Tasks
- [ ] Implement GET /api/v1/technique-plan/:playerId
- [ ] Implement POST /api/v1/technique-plan/:playerId/tasks
- [ ] Implement PUT /api/v1/technique-plan/tasks/:taskId
- [ ] Implement DELETE /api/v1/technique-plan/tasks/:taskId
- [ ] Implement PUT /api/v1/technique-plan/tasks/:taskId/priority

### API Endpoints - Drills & Responsible
- [ ] Implement POST /api/v1/technique-plan/tasks/:taskId/drills
- [ ] Implement DELETE /api/v1/technique-plan/tasks/:taskId/drills/:drillId
- [ ] Implement POST /api/v1/technique-plan/tasks/:taskId/responsible
- [ ] Implement DELETE /api/v1/technique-plan/tasks/:taskId/responsible/:userId

### API Endpoints - Progress Tracking
- [ ] Implement POST /api/v1/technique-plan/tasks/:taskId/images (file upload)
- [ ] Implement POST /api/v1/technique-plan/tasks/:taskId/videos (file upload)
- [ ] Implement DELETE /api/v1/technique-plan/tasks/:taskId/images/:imageId
- [ ] Implement DELETE /api/v1/technique-plan/tasks/:taskId/videos/:videoId
- [ ] Set up file storage (S3, CloudStorage, or local)
- [ ] Implement video thumbnail generation

### API Endpoints - TrackMan
- [ ] Implement POST /api/v1/trackman/import (with OpenAI integration)
- [ ] Implement POST /api/v1/trackman/:playerId/reference
- [ ] Implement GET /api/v1/trackman/:playerId/reference
- [ ] Implement GET /api/v1/trackman/:playerId/history
- [ ] Implement GET /api/v1/trackman/:playerId/analysis

### TrackMan AI Integration
- [ ] Install OpenAI SDK: `npm install openai`
- [ ] Create TrackmanImporter service class
- [ ] Implement CSV parsing with various TrackMan formats
- [ ] Implement AI-powered file parsing fallback
- [ ] Implement metrics aggregation
- [ ] Implement deviation calculation
- [ ] Implement AI analysis generation
- [ ] Test with real TrackMan files
- [ ] Add error handling for malformed files
- [ ] Add rate limiting for OpenAI API calls

### Frontend Integration
- [ ] Connect TechnicalPlanView to real API
- [ ] Implement drag-and-drop priority reordering (use react-beautiful-dnd)
- [ ] Implement file upload for images/videos
- [ ] Add image preview modal
- [ ] Add video player component
- [ ] Implement TrackMan file upload flow
- [ ] Display TrackMan analysis results
- [ ] Add charts for TrackMan metrics over time
- [ ] Add deviation visualizations (gauge charts)

### Testing
- [ ] Test P-level CRUD operations
- [ ] Test drills assignment/removal
- [ ] Test responsible person assignment
- [ ] Test priority reordering
- [ ] Test image/video uploads
- [ ] Test TrackMan file import with various formats
- [ ] Test AI analysis generation
- [ ] Test reference data management
- [ ] Test metrics deviation calculations
- [ ] Load test with multiple concurrent uploads

---

## Frontend Enhancements Needed

### 1. Drag-and-Drop Implementation

Install library:
```bash
npm install react-beautiful-dnd
```

Update TechnicalPlanView.tsx:
```typescript
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// In component:
const handleDragEnd = (result: any) => {
  if (!result.destination) return;

  const items = Array.from(tasks);
  const [reordered] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reordered);

  // Update priority_order for all tasks
  const updated = items.map((task, index) => ({
    ...task,
    priorityOrder: index + 1,
  }));

  setTasks(updated);

  // Call API to update priorities
  await fetch(`/api/v1/technique-plan/tasks/${result.draggableId}/priority`, {
    method: 'PUT',
    body: JSON.stringify({ newPriorityOrder: result.destination.index + 1 }),
  });
};

// Wrap tasks list:
<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="tasks">
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef}>
        {tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <TechnicalTaskCard task={task} ... />
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>
```

### 2. TrackMan Results Display Component

Create `apps/web/src/features/technique-plan/components/TrackManResults.tsx`:
```typescript
interface TrackManResultsProps {
  data: TrackManData;
  deviations: Array<Deviation>;
  analysis: string;
}

export const TrackManResults: React.FC<TrackManResultsProps> = ({
  data,
  deviations,
  analysis,
}) => {
  return (
    <div className="space-y-6">
      {/* Metrics grid */}
      <div className="grid grid-cols-3 gap-4">
        {deviations.map(dev => (
          <Card key={dev.parameter}>
            <CardContent>
              <div className="text-sm text-tier-text-secondary">{dev.parameter}</div>
              <div className="text-2xl font-bold">{dev.value.toFixed(2)}</div>
              <div className={dev.withinTolerance ? 'text-status-success' : 'text-status-error'}>
                {dev.deviation > 0 ? '+' : ''}{dev.deviation.toFixed(2)}° fra mål
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>AI Analyse</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{analysis}</p>
        </CardContent>
      </Card>
    </div>
  );
};
```

---

## Performance Considerations

### File Uploads
- Implement chunked uploads for large video files
- Use pre-signed URLs for direct S3 uploads (avoid server bottleneck)
- Generate video thumbnails asynchronously with background job
- Compress images before upload (client-side)

### TrackMan Processing
- Process TrackMan imports asynchronously (background job)
- Show loading state during AI analysis (can take 5-10 seconds)
- Cache OpenAI responses to avoid repeat API calls for same file
- Implement retry logic for OpenAI API failures

### Database
- Use database transactions for task priority updates (atomic reordering)
- Paginate tasks if player has >50 items
- Use materialized views for TrackMan analytics queries

---

## Security Considerations

### File Uploads
- Validate file types (only allow specific image/video formats)
- Scan uploads for malware
- Limit file sizes (10MB for images, 100MB for videos)
- Use signed URLs with expiration for S3 access

### TrackMan Data
- Validate TrackMan CSV/JSON structure before OpenAI processing
- Sanitize file content to prevent prompt injection attacks
- Rate limit TrackMan imports (max 10 per day per player)
- Store raw files in secure storage with access logs

### OpenAI API
- Use function calling for structured outputs (more reliable than JSON mode)
- Implement cost monitoring (track token usage)
- Set temperature=0 for deterministic analysis
- Add timeout for OpenAI calls (max 30 seconds)

---

## Cost Estimation

### OpenAI API Costs (GPT-4)
- File parsing: ~500 tokens input + 1000 tokens output = $0.02 per file
- Analysis generation: ~1000 tokens input + 500 tokens output = $0.025 per analysis
- **Estimated:** $0.045 per TrackMan import

For 100 players uploading 1 file/week:
- 100 players × 4 weeks × $0.045 = **$18/month**

### Storage Costs (S3)
- Images: ~2MB each × 20 per player × 100 players = 4GB = **$0.10/month**
- Videos: ~20MB each × 10 per player × 100 players = 20GB = **$0.50/month**
- **Total storage:** ~$0.60/month

### Total Estimated Cost
- **~$20/month** for 100 active players
