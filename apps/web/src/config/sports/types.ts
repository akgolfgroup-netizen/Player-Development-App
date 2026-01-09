/**
 * Sport Configuration Types
 *
 * Multi-sport architecture foundation.
 * These types define the structure for sport-specific configurations
 * that can be swapped at runtime for different sports.
 *
 * Supported sports (planned):
 * - Golf (current)
 * - Running
 * - Handball
 * - Football
 * - Javelin
 * - etc.
 */

// ============================================================================
// CORE TYPES
// ============================================================================

export type SportId = 'golf' | 'running' | 'handball' | 'football' | 'javelin' | 'tennis' | 'swimming';

export interface SportConfig {
  id: SportId;
  name: string;
  nameNO: string;
  icon: string;
  color: string;

  // Training structure
  trainingAreas: TrainingAreaGroup[];
  environments: Environment[];
  phases: TrainingPhase[];
  intensityLevels: IntensityLevel[];
  pressureLevels: PressureLevel[];

  // Testing & metrics
  testProtocols: TestProtocol[];
  performanceMetrics: PerformanceMetric[];
  benchmarkSource?: string;

  // Goals & categories
  goalCategories: GoalCategory[];

  // Terminology
  terminology: SportTerminology;

  // Equipment (optional)
  equipment?: Equipment[];

  // Sport-specific metadata
  metadata?: Record<string, unknown>;
}

// ============================================================================
// TRAINING AREAS
// ============================================================================

export interface TrainingArea {
  code: string;
  label: string;
  labelNO?: string;
  icon: string;
  description: string;
  descriptionNO?: string;
  /** Whether this area uses intensity/speed tracking */
  usesIntensity?: boolean;
  /** Parent group code */
  groupCode?: string;
}

export interface TrainingAreaGroup {
  code: string;
  label: string;
  labelNO?: string;
  icon?: string;
  areas: TrainingArea[];
}

// ============================================================================
// ENVIRONMENTS
// ============================================================================

export interface Environment {
  code: string;
  label: string;
  labelNO?: string;
  description: string;
  descriptionNO?: string;
  icon: string;
  /** Indoor/outdoor/mixed */
  type: 'indoor' | 'outdoor' | 'mixed';
  /** Competition level: 0 = practice, 5 = competition */
  competitionLevel: number;
}

// ============================================================================
// TRAINING PHASES
// ============================================================================

export interface TrainingPhase {
  code: string;
  label: string;
  labelNO?: string;
  description: string;
  descriptionNO?: string;
  icon: string;
  /** Recommended intensity range */
  intensityRange?: string;
  /** Order in progression */
  order: number;
}

// ============================================================================
// INTENSITY & PRESSURE
// ============================================================================

export interface IntensityLevel {
  code: string;
  value: number;
  label: string;
  labelNO?: string;
  description: string;
  descriptionNO?: string;
}

export interface PressureLevel {
  code: string;
  level: number;
  label: string;
  labelNO?: string;
  description: string;
  descriptionNO?: string;
  icon: string;
}

// ============================================================================
// TEST PROTOCOLS
// ============================================================================

export type TestCategory =
  | 'speed'
  | 'distance'
  | 'accuracy'
  | 'endurance'
  | 'strength'
  | 'technique'
  | 'mental'
  | 'tactical'
  | 'physical'
  | 'scoring'
  | 'short_game'
  | 'putting';

export type FormType = 'simple' | 'percentage' | 'table' | 'round' | 'timed' | 'repetitions';
export type CalculationType = 'best' | 'average' | 'averageBest3' | 'percentage' | 'pei' | 'stddev' | 'direct' | 'sum';

export interface ScoringThreshold {
  max: number;
  label: string;
  labelNO?: string;
  color: string;
}

export interface ScoringThresholds {
  excellent: ScoringThreshold;
  good: ScoringThreshold;
  average: ScoringThreshold;
  needsWork: ScoringThreshold;
}

export interface TestProtocol {
  id: string;
  testNumber: number;
  name: string;
  nameNO?: string;
  shortName: string;
  category: TestCategory;
  icon: string;
  description: string;
  descriptionNO?: string;
  purpose: string;
  purposeNO?: string;
  methodology: string[];
  equipment: string[];
  duration: string;
  attempts: number;
  unit: string;
  lowerIsBetter: boolean;
  formType: FormType;
  calculationType: CalculationType;
  scoring: ScoringThresholds;
  tips: string[];
  formConfig?: {
    columns?: ColumnDef[];
    distances?: number[];
    targetWidth?: number;
    holes?: number;
    [key: string]: unknown;
  };
}

export interface ColumnDef {
  key: string;
  label: string;
  type: 'number' | 'select' | 'boolean' | 'text';
  unit?: string;
  options?: { id: string; label: string; color?: string }[];
  required?: boolean;
}

// ============================================================================
// PERFORMANCE METRICS
// ============================================================================

export interface PerformanceMetric {
  id: string;
  name: string;
  nameNO?: string;
  unit: string;
  description: string;
  descriptionNO?: string;
  category: string;
  /** Higher is better (true) or lower is better (false) */
  higherIsBetter: boolean;
  /** Benchmark values by level */
  benchmarks?: {
    amateur?: number;
    intermediate?: number;
    advanced?: number;
    elite?: number;
    professional?: number;
  };
  /** Calculation method if derived */
  calculation?: string;
}

// ============================================================================
// GOALS
// ============================================================================

export interface GoalCategory {
  id: string;
  name: string;
  nameNO?: string;
  icon: string;
  color: string;
  description?: string;
  descriptionNO?: string;
}

// ============================================================================
// EQUIPMENT
// ============================================================================

export interface Equipment {
  id: string;
  name: string;
  nameNO?: string;
  category: string;
  icon?: string;
  description?: string;
  /** Whether this equipment provides data (e.g., TrackMan, GPS watch) */
  providesData?: boolean;
  /** Data types this equipment can provide */
  dataTypes?: string[];
}

// ============================================================================
// TERMINOLOGY
// ============================================================================

export interface SportTerminology {
  // Roles
  athlete: string;
  athletePlural: string;
  coach: string;
  coachPlural: string;

  // Training
  session: string;
  sessionPlural: string;
  practice: string;
  drill: string;
  drillPlural: string;

  // Competition
  competition: string;
  competitionPlural: string;
  match: string;
  matchPlural: string;

  // Performance
  score: string;
  result: string;
  personalBest: string;

  // Sport-specific terms (extensible)
  [key: string]: string;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export type SportConfigKey = keyof SportConfig;

export interface PartialSportConfig extends Partial<SportConfig> {
  id: SportId;
  name: string;
}
