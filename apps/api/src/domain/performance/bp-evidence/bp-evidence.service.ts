/**
 * Breaking Point Evidence Service
 * Evidence-based progress tracking for breaking points
 *
 * KEY PRINCIPLE: Completion affects effort, NOT progress.
 * Progress only changes when benchmark test shows improvement.
 */

import { PrismaClient } from '@prisma/client';
import type {
  BPStatus,
  BPConfidence,
  BPEvaluationResult,
  TestResultEvidence,
  TrainingEvidence,
  BPEffortUpdate,
  BPProgressUpdate,
} from './bp-evidence.types';
import { evaluateSuccessRule } from './bp-evidence.rules';
import type { TestDomainCode } from '../domain-mapping';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  effortPerSession: 5, // % effort added per completed session
  maxEffortPerDay: 15, // Max effort gain per day
  stalledThresholdDays: 30, // Days without progress before "stalled"
  minSessionsForHighConfidence: 10,
  minSessionsForMediumConfidence: 3,
};

// ============================================================================
// MAIN SERVICE
// ============================================================================

export class BPEvidenceService {
  constructor(private prisma: PrismaClient) {}

  // ==========================================================================
  // EVALUATION
  // ==========================================================================

  /**
   * Evaluate a breaking point's current state
   */
  async evaluateBreakingPoint(
    bpId: string,
    asOfDate: Date = new Date()
  ): Promise<BPEvaluationResult> {
    // Get breaking point
    const bp = await this.prisma.breakingPoint.findUnique({
      where: { id: bpId },
    });

    if (!bp) {
      throw new Error(`Breaking point not found: ${bpId}`);
    }

    const playerId = bp.playerId;
    const testDomainCode = bp.testDomainCode as TestDomainCode | null;
    const previousStatus = this.normalizeStatus(bp.status);

    // Calculate effort (from training completion)
    const { effortPercent, sessionsCompleted, totalSessionsExpected } =
      await this.computeEffortPercent(bpId, bp.benchmarkWindowDays);

    // Calculate progress (from test results)
    const progressData = await this.computeProgressPercent(bpId, asOfDate);

    // Determine confidence
    const confidence = this.determineConfidence(
      sessionsCompleted,
      progressData.latestTestDate !== null
    );

    // Determine recommended status
    const { recommendedStatus, shouldTransition, reasonCodes } =
      this.determineStatusTransition(
        previousStatus,
        effortPercent,
        progressData.progressPercent,
        progressData.latestTestDate,
        asOfDate
      );

    return {
      bpId,
      playerId,
      testDomainCode,
      effortPercent,
      sessionsCompleted,
      totalSessionsExpected,
      progressPercent: progressData.progressPercent,
      baselineValue: progressData.baselineValue,
      currentValue: progressData.currentValue,
      targetValue: progressData.targetValue,
      gapClosedPercent: progressData.gapClosedPercent,
      previousStatus,
      recommendedStatus,
      shouldTransition,
      confidence,
      evaluatedAt: new Date(),
      latestTestDate: progressData.latestTestDate,
      reasonCodes,
    };
  }

  /**
   * Compute effort percentage based on completed training
   * This represents HOW MUCH training the player has done
   */
  async computeEffortPercent(
    bpId: string,
    windowDays: number = 21
  ): Promise<{ effortPercent: number; sessionsCompleted: number; totalSessionsExpected: number }> {
    const bp = await this.prisma.breakingPoint.findUnique({
      where: { id: bpId },
      select: {
        playerId: true,
        hoursPerWeek: true,
        createdAt: true,
        effortPercent: true,
      },
    });

    if (!bp) {
      return { effortPercent: 0, sessionsCompleted: 0, totalSessionsExpected: 0 };
    }

    const windowStart = new Date();
    windowStart.setDate(windowStart.getDate() - windowDays);

    // Count completed sessions in window
    const completedSessions = await this.prisma.trainingSession.count({
      where: {
        playerId: bp.playerId,
        completedAt: {
          gte: windowStart,
        },
        status: 'completed',
      },
    });

    // Expected sessions based on hoursPerWeek
    const hoursPerWeek = bp.hoursPerWeek || 3;
    const weeksInWindow = windowDays / 7;
    const expectedHours = hoursPerWeek * weeksInWindow;
    const expectedSessions = Math.ceil(expectedHours); // Assume ~1 hour per session

    // Calculate effort percent
    const effortPercent = Math.min(100, (completedSessions / Math.max(1, expectedSessions)) * 100);

    return {
      effortPercent: Math.round(effortPercent),
      sessionsCompleted: completedSessions,
      totalSessionsExpected: expectedSessions,
    };
  }

  /**
   * Compute progress percentage based on test results
   * This represents HOW MUCH improvement has been made toward the goal
   */
  async computeProgressPercent(
    bpId: string,
    asOfDate: Date = new Date()
  ): Promise<{
    progressPercent: number;
    baselineValue: number | null;
    currentValue: number | null;
    targetValue: number | null;
    gapClosedPercent: number;
    latestTestDate: Date | null;
  }> {
    const bp = await this.prisma.breakingPoint.findUnique({
      where: { id: bpId },
      select: {
        playerId: true,
        benchmarkTestId: true,
        benchmarkWindowDays: true,
        baselineMeasurement: true,
        targetMeasurement: true,
        successRule: true,
        progressPercent: true,
      },
    });

    if (!bp || !bp.benchmarkTestId) {
      return {
        progressPercent: bp?.progressPercent || 0,
        baselineValue: null,
        currentValue: null,
        targetValue: null,
        gapClosedPercent: 0,
        latestTestDate: null,
      };
    }

    const windowStart = new Date(asOfDate);
    windowStart.setDate(windowStart.getDate() - bp.benchmarkWindowDays);

    // Get test results in window
    const testResults = await this.prisma.testResult.findMany({
      where: {
        playerId: bp.playerId,
        test: { testNumber: bp.benchmarkTestId },
        testDate: {
          gte: windowStart,
          lte: asOfDate,
        },
      },
      orderBy: { testDate: 'asc' },
    });

    if (testResults.length === 0) {
      return {
        progressPercent: bp.progressPercent || 0,
        baselineValue: parseFloat(bp.baselineMeasurement || '0') || null,
        currentValue: null,
        targetValue: parseFloat(bp.targetMeasurement || '0') || null,
        gapClosedPercent: 0,
        latestTestDate: null,
      };
    }

    const baselineValue = parseFloat(bp.baselineMeasurement || '0') || Number(testResults[0].value);
    const currentValue = Number(testResults[testResults.length - 1].value);
    const targetValue = parseFloat(bp.targetMeasurement || '0');

    // Calculate gap closed
    const initialGap = Math.abs(targetValue - baselineValue);
    const currentGap = Math.abs(targetValue - currentValue);
    const gapClosedPercent = initialGap > 0
      ? Math.round(((initialGap - currentGap) / initialGap) * 100)
      : 0;

    // Progress percent based on gap closure (0 = no progress, 100 = fully resolved)
    const progressPercent = Math.max(0, Math.min(100, gapClosedPercent));

    return {
      progressPercent,
      baselineValue,
      currentValue,
      targetValue,
      gapClosedPercent,
      latestTestDate: testResults[testResults.length - 1].testDate,
    };
  }

  /**
   * Check if status should transition
   */
  shouldTransitionStatus(
    currentStatus: BPStatus,
    effortPercent: number,
    progressPercent: number,
    lastTestDate: Date | null,
    asOfDate: Date = new Date()
  ): { shouldTransition: boolean; newStatus: BPStatus; reason: string } {
    const result = this.determineStatusTransition(
      currentStatus,
      effortPercent,
      progressPercent,
      lastTestDate,
      asOfDate
    );

    return {
      shouldTransition: result.shouldTransition,
      newStatus: result.recommendedStatus,
      reason: result.reasonCodes[0] || 'no_change',
    };
  }

  // ==========================================================================
  // UPDATES
  // ==========================================================================

  /**
   * Update effort after session completion
   * IMPORTANT: This only updates effort, NOT progress
   */
  async updateEffortAfterSession(
    playerId: string,
    sessionId: string,
    sessionDuration: number
  ): Promise<BPEffortUpdate[]> {
    // Find all active breaking points for this player
    const breakingPoints = await this.prisma.breakingPoint.findMany({
      where: {
        playerId,
        status: { in: ['identified', 'not_started', 'in_progress'] },
      },
    });

    const updates: BPEffortUpdate[] = [];

    for (const bp of breakingPoints) {
      const previousEffort = bp.effortPercent || 0;
      const increment = Math.min(CONFIG.effortPerSession, CONFIG.maxEffortPerDay);
      const newEffort = Math.min(100, previousEffort + increment);

      // Update in database
      await this.prisma.breakingPoint.update({
        where: { id: bp.id },
        data: {
          effortPercent: newEffort,
          status: previousEffort === 0 && bp.status === 'identified' ? 'in_progress' : bp.status,
        },
      });

      updates.push({
        bpId: bp.id,
        sessionId,
        sessionDuration,
        sessionDate: new Date(),
        previousEffortPercent: previousEffort,
        newEffortPercent: newEffort,
      });
    }

    return updates;
  }

  /**
   * Update progress after benchmark test
   * This is the ONLY way progress should change
   */
  async updateProgressAfterTest(
    playerId: string,
    testResultId: string,
    testNumber: number,
    testValue: number,
    testDate: Date
  ): Promise<BPProgressUpdate[]> {
    // Find breaking points that use this test as benchmark
    const breakingPoints = await this.prisma.breakingPoint.findMany({
      where: {
        playerId,
        benchmarkTestId: testNumber,
        status: { in: ['identified', 'not_started', 'in_progress', 'awaiting_proof'] },
      },
    });

    const updates: BPProgressUpdate[] = [];

    for (const bp of breakingPoints) {
      const previousProgress = bp.progressPercent || 0;
      const previousStatus = this.normalizeStatus(bp.status);

      // Evaluate success rule if defined
      let successRulePassed = false;
      if (bp.successRule) {
        const result = await evaluateSuccessRule(this.prisma, {
          bpId: bp.id,
          playerId,
          successRule: bp.successRule,
          benchmarkTestId: testNumber,
          benchmarkWindowDays: bp.benchmarkWindowDays,
          asOfDate: testDate,
        });
        successRulePassed = result.passed;
      }

      // Calculate new progress
      const progressData = await this.computeProgressPercent(bp.id, testDate);
      const newProgress = progressData.progressPercent;

      // Determine new status
      let newStatus: BPStatus = previousStatus;
      if (successRulePassed || newProgress >= 100) {
        newStatus = 'resolved';
      } else if (newProgress > previousProgress) {
        newStatus = 'in_progress';
      }

      // Update database
      await this.prisma.breakingPoint.update({
        where: { id: bp.id },
        data: {
          progressPercent: newProgress,
          currentMeasurement: String(testValue),
          status: newStatus,
          resolvedDate: newStatus === 'resolved' ? testDate : null,
        },
      });

      updates.push({
        bpId: bp.id,
        testResultId,
        testNumber,
        testDate,
        previousProgressPercent: previousProgress,
        newProgressPercent: newProgress,
        previousStatus,
        newStatus,
        successRulePassed,
      });
    }

    return updates;
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  private normalizeStatus(status: string): BPStatus {
    const statusMap: Record<string, BPStatus> = {
      'identified': 'identified',
      'not_started': 'identified',
      'in_progress': 'in_progress',
      'awaiting_proof': 'awaiting_proof',
      'resolved': 'resolved',
      'stalled': 'stalled',
    };
    return statusMap[status] || 'identified';
  }

  private determineConfidence(
    sessionsCompleted: number,
    hasRecentTest: boolean
  ): BPConfidence {
    if (sessionsCompleted >= CONFIG.minSessionsForHighConfidence && hasRecentTest) {
      return 'high';
    }
    if (sessionsCompleted >= CONFIG.minSessionsForMediumConfidence || hasRecentTest) {
      return 'medium';
    }
    return 'low';
  }

  private determineStatusTransition(
    currentStatus: BPStatus,
    effortPercent: number,
    progressPercent: number,
    lastTestDate: Date | null,
    asOfDate: Date
  ): { recommendedStatus: BPStatus; shouldTransition: boolean; reasonCodes: string[] } {
    const reasonCodes: string[] = [];
    let recommendedStatus: BPStatus = currentStatus;

    // Check for resolved
    if (progressPercent >= 100) {
      recommendedStatus = 'resolved';
      reasonCodes.push('progress_complete');
    }
    // Check for stalled (no test in extended period + no progress)
    else if (lastTestDate) {
      const daysSinceTest = Math.floor(
        (asOfDate.getTime() - lastTestDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceTest > CONFIG.stalledThresholdDays && progressPercent < 50) {
        recommendedStatus = 'stalled';
        reasonCodes.push('no_recent_benchmark');
      }
    }
    // Check for awaiting proof (high effort but no recent test)
    else if (effortPercent >= 70 && !lastTestDate) {
      recommendedStatus = 'awaiting_proof';
      reasonCodes.push('high_effort_no_test');
    }
    // Check for in_progress (some effort started)
    else if (effortPercent > 0 && currentStatus === 'identified') {
      recommendedStatus = 'in_progress';
      reasonCodes.push('training_started');
    }

    const shouldTransition = recommendedStatus !== currentStatus;

    return { recommendedStatus, shouldTransition, reasonCodes };
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createBPEvidenceService(prisma: PrismaClient): BPEvidenceService {
  return new BPEvidenceService(prisma);
}
