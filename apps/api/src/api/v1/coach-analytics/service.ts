/**
 * Coach Analytics API Service
 */

import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../../../middleware/errors';
import {
  calculatePlayerOverview,
  calculateCategoryProgression,
  compareMultiplePlayers,
  calculateTeamAnalytics,
  type PlayerOverview,
  type CategoryProgression,
  type MultiPlayerComparison,
  type TeamAnalytics,
} from '../../../domain/coach-analytics';

export class CoachAnalyticsService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get player overview with test summaries
   */
  async getPlayerOverview(
    tenantId: string,
    playerId: string
  ): Promise<PlayerOverview> {
    // Get player
    const player = await this.prisma.player.findFirst({
      where: {
        id: playerId,
        tenantId,
      },
    });

    if (!player) {
      throw new NotFoundError('Player not found');
    }

    // Get all test results for player
    const testResults = await this.prisma.testResult.findMany({
      where: {
        playerId,
      },
      include: {
        test: true,
        peerComparisons: {
          orderBy: {
            calculatedAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        testDate: 'desc',
      },
    });

    // Transform to expected format
    const formattedResults = testResults.map((r) => ({
      testNumber: r.test.testNumber,
      testName: r.test.name,
      value: Number(r.value),
      passed: r.passed,
      date: r.testDate,
      percentile: r.peerComparisons[0]?.playerPercentile
        ? Number(r.peerComparisons[0].playerPercentile)
        : undefined,
    }));

    // Test metadata (which tests have "lower is better")
    const testMetadata = Array.from({ length: 20 }, (_, i) => ({
      testNumber: i + 1,
      higherIsBetter: ![8, 9, 10, 11, 17, 18, 19, 20].includes(i + 1),
    }));

    // Calculate overview (convert Decimal handicap to number)
    const playerWithNumberHandicap = {
      ...player,
      handicap: player.handicap ? Number(player.handicap) : null,
    };
    const overview = calculatePlayerOverview(playerWithNumberHandicap, formattedResults, testMetadata);

    return overview;
  }

  /**
   * Get category progression analysis
   */
  async getCategoryProgression(
    tenantId: string,
    playerId: string
  ): Promise<CategoryProgression> {
    // Get player
    const player = await this.prisma.player.findFirst({
      where: {
        id: playerId,
        tenantId,
      },
    });

    if (!player) {
      throw new NotFoundError('Player not found');
    }

    // Get player's latest results for all tests
    const latestResults = await this.prisma.testResult.findMany({
      where: {
        playerId,
      },
      include: {
        test: true,
      },
      orderBy: {
        testDate: 'desc',
      },
      distinct: ['testId'],
    });

    const formattedResults = latestResults.map((r) => ({
      testNumber: r.test.testNumber,
      testName: r.test.name,
      value: Number(r.value),
      passed: r.passed,
    }));

    // Get next category
    const categories = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    const currentIndex = categories.indexOf(player.category);
    const nextCategory = currentIndex > 0 ? categories[currentIndex - 1] : 'A';

    // Get requirements for next category
    const nextCategoryRequirements = await this.prisma.categoryRequirement.findMany({
      where: {
        category: nextCategory,
        gender: player.gender as 'M' | 'K',
      },
    });

    const formattedRequirements = nextCategoryRequirements.map((req) => ({
      testNumber: req.testNumber,
      testName: `Test ${req.testNumber}`,
      requirement: Number(req.requirement),
      unit: req.unit,
      higherIsBetter: req.comparison === '>=',
    }));

    // Calculate progression
    const progression = calculateCategoryProgression(
      player,
      formattedResults,
      formattedRequirements
    );

    return progression;
  }

  /**
   * Compare multiple players
   */
  async compareMultiplePlayers(
    tenantId: string,
    playerIds: string[],
    testNumbers: number[]
  ): Promise<MultiPlayerComparison> {
    // Get players
    const players = await this.prisma.player.findMany({
      where: {
        id: { in: playerIds },
        tenantId,
      },
    });

    if (players.length === 0) {
      throw new NotFoundError('No players found');
    }

    // Get latest test results for selected tests
    const testResults = await this.prisma.testResult.findMany({
      where: {
        playerId: { in: playerIds },
        test: {
          testNumber: { in: testNumbers },
        },
      },
      include: {
        test: true,
        peerComparisons: {
          orderBy: {
            calculatedAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        testDate: 'desc',
      },
      distinct: ['playerId', 'testId'],
    });

    const formattedResults = testResults.map((r) => ({
      playerId: r.playerId,
      testNumber: r.test.testNumber,
      value: Number(r.value),
      passed: r.passed,
      percentile: r.peerComparisons[0]?.playerPercentile
        ? Number(r.peerComparisons[0].playerPercentile)
        : undefined,
    }));

    // Compare players
    const comparison = compareMultiplePlayers(players, formattedResults, testNumbers);

    return comparison;
  }

  /**
   * Get team analytics for a coach
   */
  async getTeamAnalytics(tenantId: string, coachId: string): Promise<TeamAnalytics> {
    // Get coach's players
    const players = await this.prisma.player.findMany({
      where: {
        tenantId,
        coachId: coachId,
      },
    });

    if (players.length === 0) {
      // Return empty analytics
      return {
        coachId,
        totalPlayers: 0,
        playersByCategory: {},
        overallCompletionRate: 0,
        testsCompletedTotal: 0,
        testsPossibleTotal: 0,
        testStatistics: [],
        recentActivityCount: 0,
        monthlyTrend: 'stable',
      };
    }

    // Get all test results for these players
    const allTestResults = await this.prisma.testResult.findMany({
      where: {
        playerId: { in: players.map((p) => p.id) },
      },
      include: {
        test: true,
      },
      orderBy: {
        testDate: 'desc',
      },
    });

    const formattedResults = allTestResults.map((r) => ({
      playerId: r.playerId,
      testNumber: r.test.testNumber,
      testName: r.test.name,
      value: Number(r.value),
      passed: r.passed,
      date: r.testDate,
    }));

    // Calculate team analytics
    const analytics = calculateTeamAnalytics(coachId, players, formattedResults);

    return analytics;
  }

  /**
   * Get coach dashboard data
   */
  async getCoachDashboard(tenantId: string, coachId: string): Promise<any> {
    // Get coach
    const coach = await this.prisma.coach.findFirst({
      where: {
        id: coachId,
        tenantId,
      },
    });

    if (!coach) {
      throw new NotFoundError('Coach not found');
    }

    // Get team analytics
    const teamAnalytics = await this.getTeamAnalytics(tenantId, coachId);

    // Get recent test results (last 10)
    const recentTests = await this.prisma.testResult.findMany({
      where: {
        player: {
          tenantId,
          coachId: coachId,
        },
      },
      include: {
        player: true,
        test: true,
      },
      orderBy: {
        testDate: 'desc',
      },
      take: 10,
    });

    const formattedRecentTests = recentTests.map((r) => ({
      playerId: r.playerId,
      playerName: `${r.player.firstName} ${r.player.lastName}`,
      testNumber: r.test.testNumber,
      testName: r.test.name,
      value: Number(r.value),
      passed: r.passed,
      date: r.testDate,
    }));

    // TODO: Generate alerts based on player progress
    const alerts: any[] = [];

    return {
      coach: {
        id: coach.id,
        name: `${coach.firstName} ${coach.lastName}`,
      },
      summary: {
        totalPlayers: teamAnalytics.totalPlayers,
        activePlayersLast30Days: 0, // TODO: Calculate
        totalTestsCompleted: teamAnalytics.testsCompletedTotal,
        averageCompletionRate: teamAnalytics.overallCompletionRate,
      },
      teamAnalytics,
      recentTests: formattedRecentTests,
      alerts,
    };
  }
}
