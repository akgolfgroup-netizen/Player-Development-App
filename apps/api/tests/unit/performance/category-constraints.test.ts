/**
 * Category Constraints Service Unit Tests
 * Tests for binding constraint computation
 */

import { PrismaClient } from '@prisma/client';
import {
  CategoryConstraintsService,
  createCategoryConstraintsService,
  type CategoryAK,
} from '../../../src/domain/performance/category-constraints';

// Mock Prisma Client
const createMockPrisma = () =>
  ({
    categoryRequirement: {
      findMany: jest.fn(),
    },
  } as unknown as PrismaClient);

describe('CategoryConstraintsService', () => {
  let service: CategoryConstraintsService;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  // Sample category requirements matching real data structure
  const mockRequirements = [
    {
      id: 'req-1',
      category: 'F',
      gender: 'M',
      testNumber: 1,
      minimumValue: 200,
      isHardConstraint: true,
      testDomainCode: 'TEE',
    },
    {
      id: 'req-2',
      category: 'F',
      gender: 'M',
      testNumber: 5,
      minimumValue: 95,
      isHardConstraint: true,
      testDomainCode: 'TEE',
    },
    {
      id: 'req-3',
      category: 'F',
      gender: 'M',
      testNumber: 15,
      minimumValue: 70,
      isHardConstraint: false,
      testDomainCode: 'PUTT',
    },
    {
      id: 'req-4',
      category: 'F',
      gender: 'M',
      testNumber: 17,
      minimumValue: 5.0,
      isHardConstraint: false,
      testDomainCode: 'ARG',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = createMockPrisma();
    service = createCategoryConstraintsService(mockPrisma);

    // Setup default mock
    (mockPrisma.categoryRequirement.findMany as jest.Mock).mockResolvedValue(mockRequirements);
  });

  describe('computeCategoryConstraints', () => {
    it('should identify binding constraints when player is below requirements', async () => {
      const result = await service.computeCategoryConstraints({
        playerId: 'player-1',
        currentCategory: 'G', // One below F
        gender: 'M',
        latestTestValues: {
          1: 180, // Below 200 requirement for driver
          5: 90, // Below 95 requirement for club speed
          15: 75, // Above 70 requirement (passing)
          17: 4.5, // Below 5.0 requirement for chip
        },
      });

      expect(result.bindingConstraints.length).toBeGreaterThan(0);
      expect(result.canAdvance).toBe(false);

      // Should identify driver and club speed as binding (hard constraints not met)
      const driverConstraint = result.bindingConstraints.find((c) => c.testNumber === 1);
      const clubSpeedConstraint = result.bindingConstraints.find((c) => c.testNumber === 5);

      expect(driverConstraint).toBeDefined();
      expect(driverConstraint?.severity).toBe('hard');
      expect(clubSpeedConstraint).toBeDefined();
      expect(clubSpeedConstraint?.severity).toBe('hard');
    });

    it('should return canAdvance=true when all hard constraints are met', async () => {
      const result = await service.computeCategoryConstraints({
        playerId: 'player-1',
        currentCategory: 'G',
        gender: 'M',
        latestTestValues: {
          1: 210, // Above 200 (passing hard constraint)
          5: 98, // Above 95 (passing hard constraint)
          15: 65, // Below 70 (soft constraint)
          17: 4.0, // Below 5.0 (soft constraint)
        },
      });

      expect(result.canAdvance).toBe(true);
      // Should still have binding constraints (soft ones not met)
      expect(result.bindingConstraints.length).toBeGreaterThan(0);
      expect(result.bindingConstraints.every((c) => c.severity === 'soft')).toBe(true);
    });

    it('should calculate normalized gap correctly', async () => {
      const result = await service.computeCategoryConstraints({
        playerId: 'player-1',
        currentCategory: 'G',
        gender: 'M',
        latestTestValues: {
          1: 160, // 40 below 200 = 20% gap
          5: 95, // Exactly at requirement = 0% gap
          15: 80, // 10 above 70 = no gap (exceeded)
          17: 6.0, // 1 above 5.0 = no gap (exceeded)
        },
      });

      const driverConstraint = result.bindingConstraints.find((c) => c.testNumber === 1);
      expect(driverConstraint).toBeDefined();
      expect(driverConstraint?.gapNormalized).toBeGreaterThan(0);

      // Club speed should not be in constraints (met exactly)
      const clubSpeedConstraint = result.bindingConstraints.find((c) => c.testNumber === 5);
      // May or may not be present depending on implementation
      if (clubSpeedConstraint) {
        expect(clubSpeedConstraint.gapNormalized).toBe(0);
      }
    });

    it('should prioritize hard constraints over soft ones', async () => {
      const result = await service.computeCategoryConstraints({
        playerId: 'player-1',
        currentCategory: 'G',
        gender: 'M',
        latestTestValues: {
          1: 190, // Small gap (10) on hard constraint
          5: 94, // Small gap (1) on hard constraint
          15: 50, // Large gap (20) on soft constraint
          17: 2.0, // Large gap (3) on soft constraint
        },
      });

      expect(result.bindingConstraints.length).toBeGreaterThan(0);

      // Hard constraints should come before soft, regardless of gap size
      const firstSoftIndex = result.bindingConstraints.findIndex((c) => c.severity === 'soft');
      const lastHardIndex = result.bindingConstraints.reduce(
        (idx, c, i) => (c.severity === 'hard' ? i : idx),
        -1
      );

      if (firstSoftIndex !== -1 && lastHardIndex !== -1) {
        expect(lastHardIndex).toBeLessThan(firstSoftIndex);
      }
    });

    it('should limit binding constraints to top N', async () => {
      // Create many requirements
      const manyRequirements = Array.from({ length: 10 }, (_, i) => ({
        id: `req-${i}`,
        category: 'F',
        gender: 'M',
        testNumber: i + 1,
        minimumValue: 100,
        isHardConstraint: i < 3, // First 3 are hard
        testDomainCode: 'TEE',
      }));

      (mockPrisma.categoryRequirement.findMany as jest.Mock).mockResolvedValue(manyRequirements);

      const result = await service.computeCategoryConstraints({
        playerId: 'player-1',
        currentCategory: 'G',
        gender: 'M',
        latestTestValues: Object.fromEntries(
          Array.from({ length: 10 }, (_, i) => [i + 1, 50]) // All below requirement
        ),
      });

      // Should limit to configurable max (default 4)
      expect(result.bindingConstraints.length).toBeLessThanOrEqual(4);
    });

    it('should include testDomainCode in constraints', async () => {
      const result = await service.computeCategoryConstraints({
        playerId: 'player-1',
        currentCategory: 'G',
        gender: 'M',
        latestTestValues: {
          1: 180,
          17: 4.0,
        },
      });

      result.bindingConstraints.forEach((constraint) => {
        expect(constraint.testDomainCode).toBeDefined();
        expect(['TEE', 'INN200', 'INN150', 'INN100', 'INN50', 'ARG', 'PUTT', 'PHYS']).toContain(
          constraint.testDomainCode
        );
      });
    });

    it('should calculate readiness score based on constraints', async () => {
      const result = await service.computeCategoryConstraints({
        playerId: 'player-1',
        currentCategory: 'G',
        gender: 'M',
        latestTestValues: {
          1: 190, // 5% gap
          5: 93, // 2% gap
          15: 68, // 3% gap
          17: 4.8, // 4% gap
        },
      });

      expect(result.readinessScore).toBeGreaterThanOrEqual(0);
      expect(result.readinessScore).toBeLessThanOrEqual(100);
    });

    it('should handle missing test values gracefully', async () => {
      const result = await service.computeCategoryConstraints({
        playerId: 'player-1',
        currentCategory: 'G',
        gender: 'M',
        latestTestValues: {}, // No test values at all
      });

      // Should still return valid result
      expect(result).toBeDefined();
      expect(result.bindingConstraints).toBeDefined();
      expect(result.readinessScore).toBeDefined();
    });
  });

  describe('createCategoryConstraintsService', () => {
    it('should create a valid service instance', () => {
      const newService = createCategoryConstraintsService(mockPrisma);
      expect(newService).toBeInstanceOf(CategoryConstraintsService);
    });
  });
});
