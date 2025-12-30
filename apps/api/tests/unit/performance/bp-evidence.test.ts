/**
 * BP Evidence Service Unit Tests
 * Tests for evidence-based progress tracking
 *
 * KEY PRINCIPLE: Completion affects effort, NOT progress.
 * Progress only changes when benchmark test shows improvement.
 */

import { PrismaClient } from '@prisma/client';
import {
  BPEvidenceService,
  createBPEvidenceService,
  evaluateSuccessRule,
  buildDefaultSuccessRule,
  type BPStatus,
} from '../../../src/domain/performance/bp-evidence';

// Mock Prisma Client
const createMockPrisma = () =>
  ({
    breakingPoint: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    trainingSession: {
      count: jest.fn(),
      findUnique: jest.fn(),
    },
    testResult: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  } as unknown as PrismaClient);

describe('BPEvidenceService', () => {
  let service: BPEvidenceService;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  const mockBreakingPoint = {
    id: 'bp-1',
    playerId: 'player-1',
    testDomainCode: 'TEE',
    status: 'in_progress',
    effortPercent: 30,
    progressPercent: 0,
    hoursPerWeek: 3,
    benchmarkTestId: 1,
    benchmarkWindowDays: 21,
    baselineMeasurement: '180',
    targetMeasurement: '220',
    successRule: null,
    createdAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = createMockPrisma();
    service = createBPEvidenceService(mockPrisma);
  });

  describe('evaluateBreakingPoint', () => {
    beforeEach(() => {
      (mockPrisma.breakingPoint.findUnique as jest.Mock).mockResolvedValue(mockBreakingPoint);
      (mockPrisma.trainingSession.count as jest.Mock).mockResolvedValue(5);
      (mockPrisma.testResult.findMany as jest.Mock).mockResolvedValue([]);
    });

    it('should return evaluation result with correct structure', async () => {
      const result = await service.evaluateBreakingPoint('bp-1');

      expect(result).toHaveProperty('bpId', 'bp-1');
      expect(result).toHaveProperty('playerId', 'player-1');
      expect(result).toHaveProperty('effortPercent');
      expect(result).toHaveProperty('progressPercent');
      expect(result).toHaveProperty('previousStatus');
      expect(result).toHaveProperty('recommendedStatus');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('reasonCodes');
    });

    it('should throw error if breaking point not found', async () => {
      (mockPrisma.breakingPoint.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.evaluateBreakingPoint('nonexistent')).rejects.toThrow(
        'Breaking point not found'
      );
    });

    it('should calculate progress based on test results gap closure', async () => {
      // Mock test results showing improvement
      (mockPrisma.testResult.findMany as jest.Mock).mockResolvedValue([
        { value: '185', testDate: new Date('2024-01-01') }, // Baseline-ish
        { value: '200', testDate: new Date('2024-01-15') }, // Progress
      ]);

      // Need to mock the second findUnique call for computeProgressPercent
      (mockPrisma.breakingPoint.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockBreakingPoint)
        .mockResolvedValueOnce({
          ...mockBreakingPoint,
          progressPercent: 0,
        });

      const result = await service.evaluateBreakingPoint('bp-1');

      expect(result.progressPercent).toBeGreaterThan(0);
      expect(result.latestTestDate).not.toBeNull();
    });

    it('should determine low confidence with no test data', async () => {
      (mockPrisma.trainingSession.count as jest.Mock).mockResolvedValue(1);
      (mockPrisma.testResult.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.evaluateBreakingPoint('bp-1');

      expect(result.confidence).toBe('low');
    });

    it('should recommend awaiting_proof when effort high but no test', async () => {
      (mockPrisma.breakingPoint.findUnique as jest.Mock).mockResolvedValue({
        ...mockBreakingPoint,
        effortPercent: 80,
        status: 'in_progress',
      });
      (mockPrisma.trainingSession.count as jest.Mock).mockResolvedValue(20);
      (mockPrisma.testResult.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.evaluateBreakingPoint('bp-1');

      expect(result.recommendedStatus).toBe('awaiting_proof');
      expect(result.reasonCodes).toContain('high_effort_no_test');
    });
  });

  describe('computeEffortPercent', () => {
    it('should calculate effort based on completed sessions', async () => {
      (mockPrisma.breakingPoint.findUnique as jest.Mock).mockResolvedValue({
        playerId: 'player-1',
        hoursPerWeek: 3,
        createdAt: new Date(),
        effortPercent: 0,
      });
      (mockPrisma.trainingSession.count as jest.Mock).mockResolvedValue(6);

      const result = await service.computeEffortPercent('bp-1', 21);

      expect(result.sessionsCompleted).toBe(6);
      expect(result.totalSessionsExpected).toBeGreaterThan(0);
      expect(result.effortPercent).toBeGreaterThan(0);
      expect(result.effortPercent).toBeLessThanOrEqual(100);
    });

    it('should return zero effort if BP not found', async () => {
      (mockPrisma.breakingPoint.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.computeEffortPercent('nonexistent', 21);

      expect(result.effortPercent).toBe(0);
      expect(result.sessionsCompleted).toBe(0);
    });
  });

  describe('updateEffortAfterSession', () => {
    it('should update effort without changing progress', async () => {
      (mockPrisma.breakingPoint.findMany as jest.Mock).mockResolvedValue([
        { id: 'bp-1', effortPercent: 20, status: 'in_progress' },
      ]);
      (mockPrisma.breakingPoint.update as jest.Mock).mockResolvedValue({});

      const updates = await service.updateEffortAfterSession('player-1', 'session-1', 60);

      expect(updates.length).toBe(1);
      expect(updates[0].previousEffortPercent).toBe(20);
      expect(updates[0].newEffortPercent).toBeGreaterThan(20);

      // Verify update was called with effort, not progress
      expect(mockPrisma.breakingPoint.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            effortPercent: expect.any(Number),
          }),
        })
      );
    });

    it('should transition from identified to in_progress on first effort', async () => {
      (mockPrisma.breakingPoint.findMany as jest.Mock).mockResolvedValue([
        { id: 'bp-1', effortPercent: 0, status: 'identified' },
      ]);
      (mockPrisma.breakingPoint.update as jest.Mock).mockResolvedValue({});

      await service.updateEffortAfterSession('player-1', 'session-1', 60);

      expect(mockPrisma.breakingPoint.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'in_progress',
          }),
        })
      );
    });

    it('should respect maximum effort cap', async () => {
      (mockPrisma.breakingPoint.findMany as jest.Mock).mockResolvedValue([
        { id: 'bp-1', effortPercent: 98, status: 'in_progress' },
      ]);
      (mockPrisma.breakingPoint.update as jest.Mock).mockResolvedValue({});

      const updates = await service.updateEffortAfterSession('player-1', 'session-1', 60);

      expect(updates[0].newEffortPercent).toBeLessThanOrEqual(100);
    });
  });

  describe('updateProgressAfterTest', () => {
    it('should update progress based on test result', async () => {
      (mockPrisma.breakingPoint.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'bp-1',
          progressPercent: 0,
          status: 'in_progress',
          benchmarkTestId: 1,
          benchmarkWindowDays: 21,
          baselineMeasurement: '180',
          targetMeasurement: '220',
          successRule: null,
        },
      ]);
      (mockPrisma.breakingPoint.findUnique as jest.Mock).mockResolvedValue({
        playerId: 'player-1',
        benchmarkTestId: 1,
        benchmarkWindowDays: 21,
        baselineMeasurement: '180',
        targetMeasurement: '220',
        progressPercent: 0,
      });
      (mockPrisma.testResult.findMany as jest.Mock).mockResolvedValue([
        { value: '200', testDate: new Date() },
      ]);
      (mockPrisma.breakingPoint.update as jest.Mock).mockResolvedValue({});

      const updates = await service.updateProgressAfterTest(
        'player-1',
        'test-1',
        1,
        200,
        new Date()
      );

      expect(updates.length).toBe(1);
      expect(updates[0].newProgressPercent).toBeGreaterThan(0);
      expect(mockPrisma.breakingPoint.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            progressPercent: expect.any(Number),
            currentMeasurement: '200',
          }),
        })
      );
    });

    it('should mark as resolved when progress reaches 100%', async () => {
      (mockPrisma.breakingPoint.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'bp-1',
          progressPercent: 90,
          status: 'in_progress',
          benchmarkTestId: 1,
          benchmarkWindowDays: 21,
          baselineMeasurement: '180',
          targetMeasurement: '220',
          successRule: null,
        },
      ]);
      (mockPrisma.breakingPoint.findUnique as jest.Mock).mockResolvedValue({
        playerId: 'player-1',
        benchmarkTestId: 1,
        benchmarkWindowDays: 21,
        baselineMeasurement: '180',
        targetMeasurement: '220',
        progressPercent: 90,
      });
      (mockPrisma.testResult.findMany as jest.Mock).mockResolvedValue([
        { value: '220', testDate: new Date() }, // Target met
      ]);
      (mockPrisma.breakingPoint.update as jest.Mock).mockResolvedValue({});

      const updates = await service.updateProgressAfterTest(
        'player-1',
        'test-1',
        1,
        220,
        new Date()
      );

      expect(updates[0].newStatus).toBe('resolved');
    });
  });

  describe('shouldTransitionStatus', () => {
    it('should recommend resolved when progress is 100%', () => {
      const result = service.shouldTransitionStatus('in_progress', 80, 100, new Date());

      expect(result.shouldTransition).toBe(true);
      expect(result.newStatus).toBe('resolved');
      expect(result.reason).toBe('progress_complete');
    });

    it('should recommend stalled after extended period without test', () => {
      const oldTestDate = new Date();
      oldTestDate.setDate(oldTestDate.getDate() - 45); // 45 days ago

      const result = service.shouldTransitionStatus('in_progress', 50, 30, oldTestDate);

      expect(result.shouldTransition).toBe(true);
      expect(result.newStatus).toBe('stalled');
      expect(result.reason).toBe('no_recent_benchmark');
    });

    it('should not transition if status is appropriate', () => {
      const result = service.shouldTransitionStatus('in_progress', 50, 40, new Date());

      expect(result.shouldTransition).toBe(false);
    });
  });
});

describe('evaluateSuccessRule', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should evaluate test pass rule', async () => {
    (mockPrisma.testResult.findFirst as jest.Mock).mockResolvedValue({
      value: '85',
      passed: true,
      testDate: new Date(),
    });

    const result = await evaluateSuccessRule(mockPrisma, {
      bpId: 'bp-1',
      playerId: 'player-1',
      successRule: '15:pass',
      benchmarkTestId: 15,
      benchmarkWindowDays: 21,
      asOfDate: new Date(),
    });

    expect(result.passed).toBe(true);
    expect(result.operator).toBe('pass');
  });

  it('should fail test pass rule when test not passed', async () => {
    (mockPrisma.testResult.findFirst as jest.Mock).mockResolvedValue({
      value: '0',
      passed: false,
      testDate: new Date(),
    });

    const result = await evaluateSuccessRule(mockPrisma, {
      bpId: 'bp-1',
      playerId: 'player-1',
      successRule: '15:pass',
      benchmarkTestId: 15,
      benchmarkWindowDays: 21,
      asOfDate: new Date(),
    });

    expect(result.passed).toBe(false);
  });

  it('should return invalid for unparseable rules', async () => {
    const result = await evaluateSuccessRule(mockPrisma, {
      bpId: 'bp-1',
      playerId: 'player-1',
      successRule: 'invalid_rule',
      benchmarkTestId: null,
      benchmarkWindowDays: 21,
      asOfDate: new Date(),
    });

    expect(result.passed).toBe(false);
    expect(result.reason).toBe('invalid_rule_format');
  });
});

describe('buildDefaultSuccessRule', () => {
  it('should build threshold rule for small gaps', () => {
    const rule = buildDefaultSuccessRule(1, 210, 220, '>=');

    expect(rule).toContain('1');
    expect(rule).toContain('>=');
    expect(rule).toContain('220');
  });

  it('should build improvement rule for large gaps', () => {
    const rule = buildDefaultSuccessRule(1, 150, 220, '>=');

    expect(rule).toContain('improvement');
    expect(rule).toContain('percent');
  });
});
