/**
 * Breaking Point Evidence Module
 * Evidence-based progress tracking for breaking points
 *
 * KEY PRINCIPLE: Completion affects effort, NOT progress.
 * Progress only changes when benchmark test shows improvement.
 */

// Types
export type {
  BPStatus,
  BPConfidence,
  BPEvaluationResult,
  TestResultEvidence,
  TrainingEvidence,
  BPEffortUpdate,
  BPProgressUpdate,
  SuccessRuleContext,
  SuccessRuleResult,
  EvaluateBPRequest,
  EvaluateBPResponse,
  UpdateEffortRequest,
  UpdateProgressRequest,
} from './bp-evidence.types';

// Rules
export { evaluateSuccessRule, buildDefaultSuccessRule } from './bp-evidence.rules';

// Service
export { BPEvidenceService, createBPEvidenceService } from './bp-evidence.service';
