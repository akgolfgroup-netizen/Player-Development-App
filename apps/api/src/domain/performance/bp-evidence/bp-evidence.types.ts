/**
 * Breaking Point Evidence Types
 * Types for evidence-based progress tracking
 */

import type { TestDomainCode } from '../domain-mapping';

// ============================================================================
// STATUS TYPES
// ============================================================================

/**
 * Breaking point status values
 */
export type BPStatus =
  | 'identified'      // Just created, no work done
  | 'not_started'     // Legacy status (mapped to identified)
  | 'in_progress'     // Active training in progress
  | 'awaiting_proof'  // Training done, waiting for benchmark test
  | 'resolved'        // Benchmark passed, issue resolved
  | 'stalled';        // No progress for extended period

/**
 * Confidence levels for progress estimation
 */
export type BPConfidence = 'low' | 'medium' | 'high';

// ============================================================================
// EVIDENCE TYPES
// ============================================================================

/**
 * Test result evidence for breaking point evaluation
 */
export interface TestResultEvidence {
  testResultId: string;
  testNumber: number;
  testDate: Date;
  value: number;
  unit: string;
  source: 'test_result' | 'round_stats' | 'calibration';
}

/**
 * Training completion evidence
 */
export interface TrainingEvidence {
  totalSessionsPlanned: number;
  sessionsCompleted: number;
  totalMinutesPlanned: number;
  minutesCompleted: number;
  periodStart: Date;
  periodEnd: Date;
}

/**
 * Progress evaluation result
 */
export interface BPEvaluationResult {
  bpId: string;
  playerId: string;
  testDomainCode: TestDomainCode | null;

  // Effort metrics (training completion)
  effortPercent: number;  // 0-100
  sessionsCompleted: number;
  totalSessionsExpected: number;

  // Progress metrics (actual improvement)
  progressPercent: number;  // 0-100
  baselineValue: number | null;
  currentValue: number | null;
  targetValue: number | null;
  gapClosedPercent: number;  // How much of the gap has been closed

  // Status
  previousStatus: BPStatus;
  recommendedStatus: BPStatus;
  shouldTransition: boolean;

  // Metadata
  confidence: BPConfidence;
  evaluatedAt: Date;
  latestTestDate: Date | null;
  reasonCodes: string[];
}

// ============================================================================
// SUCCESS RULE TYPES
// ============================================================================

/**
 * Success rule evaluation context
 */
export interface SuccessRuleContext {
  bpId: string;
  playerId: string;
  successRule: string;
  benchmarkTestId: number | null;
  benchmarkWindowDays: number;
  asOfDate: Date;
}

/**
 * Success rule evaluation result
 */
export interface SuccessRuleResult {
  passed: boolean;
  rule: string;
  actualValue: number | null;
  requiredValue: number | null;
  operator: string | null;
  reason: string;
  evidenceDate: Date | null;
}

// ============================================================================
// UPDATE TYPES
// ============================================================================

/**
 * Breaking point update after session completion
 */
export interface BPEffortUpdate {
  bpId: string;
  sessionId: string;
  sessionDuration: number; // minutes
  sessionDate: Date;
  previousEffortPercent: number;
  newEffortPercent: number;
}

/**
 * Breaking point update after benchmark test
 */
export interface BPProgressUpdate {
  bpId: string;
  testResultId: string;
  testNumber: number;
  testDate: Date;
  previousProgressPercent: number;
  newProgressPercent: number;
  previousStatus: BPStatus;
  newStatus: BPStatus;
  successRulePassed: boolean;
}

// ============================================================================
// API TYPES
// ============================================================================

/**
 * Request to evaluate a breaking point
 */
export interface EvaluateBPRequest {
  bpId: string;
  asOfDate?: Date;
  includeTrainingDetails?: boolean;
}

/**
 * Response from breaking point evaluation
 */
export interface EvaluateBPResponse {
  evaluation: BPEvaluationResult;
  recentTests: TestResultEvidence[];
  trainingEvidence: TrainingEvidence | null;
}

/**
 * Request to update effort after session completion
 */
export interface UpdateEffortRequest {
  playerId: string;
  sessionId: string;
  sessionDuration: number;
  sessionDate: Date;
}

/**
 * Request to update progress after test completion
 */
export interface UpdateProgressRequest {
  playerId: string;
  testResultId: string;
  testNumber: number;
  testValue: number;
  testDate: Date;
}
