/**
 * AK Golf Academy - Badge Evaluator Service
 * Evaluates player metrics and awards badges automatically
 */

import { PrismaClient } from '@prisma/client';
import {
  PlayerMetrics,
  VolumeMetrics,
  StreakMetrics,
  StrengthMetrics,
  PerformanceMetrics,
  PhaseMetrics,
  BadgeProgress,
  BadgeUnlockEvent,
} from './types';

// Re-export for convenience
export type { BadgeUnlockEvent } from './types';
import {
  calculateAllBadgeProgress,
  processBadgeUnlocks,
  getLevelFromXP,
  getXPToNextLevel,
} from './badge-calculator';
import { ALL_BADGES } from './achievement-definitions';
import { filterAvailableBadges } from './badge-availability';
import { logger } from '../../utils/logger';

// ═══════════════════════════════════════════════════════════════
// BADGE EVALUATOR SERVICE
// ═══════════════════════════════════════════════════════════════

export class BadgeEvaluatorService {
  private logger = logger;

  constructor(private prisma: PrismaClient) {}

  /**
   * Main entry point: Evaluate all badges for a player
   * Call this after any action that might trigger a badge
   */
  async evaluatePlayerBadges(playerId: string): Promise<{
    unlockedBadges: BadgeUnlockEvent[];
    xpGained: number;
    newLevel?: number;
    updatedProgress: BadgeProgress[];
  }> {
    // 1. Calculate current player metrics
    const metrics = await this.calculatePlayerMetrics(playerId);

    // 2. Get existing badge progress
    const existingProgress = await this.getExistingBadgeProgress(playerId);
    const existingProgressMap = new Map(existingProgress.map((bp) => [bp.badgeId, bp]));

    // 3. Get available badges only (skip unavailable ones)
    const availableBadges = filterAvailableBadges(ALL_BADGES);

    // 4. Calculate new progress for all badges
    const newProgress = calculateAllBadgeProgress(metrics, availableBadges, existingProgressMap);

    // 5. Process unlocks
    const { events: unlockedBadges, xpGained } = processBadgeUnlocks(
      playerId,
      availableBadges,
      existingProgress,
      newProgress,
      metrics
    );

    // 6. Persist changes
    await this.persistBadgeProgress(playerId, newProgress);

    // 7. Award XP and check for level up
    let newLevel: number | undefined;
    if (xpGained > 0) {
      newLevel = await this.awardXP(playerId, xpGained);
    }

    // 8. Create notification for each unlocked badge
    for (const event of unlockedBadges) {
      await this.createBadgeNotification(playerId, event);
    }

    return {
      unlockedBadges,
      xpGained,
      newLevel,
      updatedProgress: newProgress,
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // METRICS CALCULATION
  // ═══════════════════════════════════════════════════════════════

  /**
   * Calculate all player metrics from database
   */
  async calculatePlayerMetrics(playerId: string): Promise<PlayerMetrics> {
    const [volume, streaks, strength, performance, phase, playerData] = await Promise.all([
      this.calculateVolumeMetrics(playerId),
      this.calculateStreakMetrics(playerId),
      this.calculateStrengthMetrics(playerId),
      this.calculatePerformanceMetrics(playerId),
      this.calculatePhaseMetrics(playerId),
      // Calculate XP from earned badges
      this.prisma.playerBadge.findMany({
        where: { playerId, earnedAt: { not: null } },
      }),
    ]);

    // Calculate totalXP from earned badges (each badge gives xpValue based on tier)
    const totalXP = playerData?.length ? playerData.length * 50 : 0; // Simplified: 50 XP per badge

    return {
      playerId,
      volume,
      streaks,
      strength,
      performance,
      phase,
      totalXP,
      currentLevel: getLevelFromXP(totalXP),
      xpToNextLevel: getXPToNextLevel(totalXP),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastCalculated: new Date(),
    };
  }

  /**
   * Calculate volume metrics (hours, sessions, swings)
   */
  private async calculateVolumeMetrics(playerId: string): Promise<VolumeMetrics> {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Get all completed sessions
    const sessions = await this.prisma.trainingSession.findMany({
      where: {
        playerId,
        completionStatus: { in: ['completed', 'auto_completed'] },
      },
      select: {
        duration: true,
        sessionType: true,
        totalShots: true,
        sessionDate: true,
      },
    });

    const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalHours = totalMinutes / 60;

    // Hours by type
    const hoursByType: Record<string, number> = {
      teknikk: 0,
      golfslag: 0,
      spill: 0,
      konkurranse: 0,
      fysisk: 0,
      mental: 0,
      rest: 0,
    };

    sessions.forEach((s) => {
      const type = s.sessionType?.toLowerCase() || 'other';
      if (hoursByType[type] !== undefined) {
        hoursByType[type] += (s.duration || 0) / 60;
      }
    });

    // Sessions by time period
    const sessionsThisWeek = sessions.filter(
      (s) => new Date(s.sessionDate) >= startOfWeek
    ).length;
    const sessionsThisMonth = sessions.filter(
      (s) => new Date(s.sessionDate) >= startOfMonth
    ).length;
    const sessionsThisYear = sessions.filter(
      (s) => new Date(s.sessionDate) >= startOfYear
    ).length;

    // Weekly/monthly hours
    const weeklyMinutes = sessions
      .filter((s) => new Date(s.sessionDate) >= startOfWeek)
      .reduce((sum, s) => sum + (s.duration || 0), 0);
    const monthlyMinutes = sessions
      .filter((s) => new Date(s.sessionDate) >= startOfMonth)
      .reduce((sum, s) => sum + (s.duration || 0), 0);
    const yearlyMinutes = sessions
      .filter((s) => new Date(s.sessionDate) >= startOfYear)
      .reduce((sum, s) => sum + (s.duration || 0), 0);

    // Total swings
    const totalSwings = sessions.reduce((sum, s) => sum + (s.totalShots || 0), 0);

    // Calculate completion rate (completed sessions / planned sessions)
    const completedSessions = sessions.length;
    // Assume average of 5 planned sessions per week for active players
    const weeksActive = Math.max(1, Math.ceil(
      (Date.now() - Math.min(...sessions.map(s => new Date(s.sessionDate).getTime()))) / (7 * 24 * 60 * 60 * 1000)
    ));
    const estimatedPlanned = weeksActive * 5;
    const completionRate = Math.min(100, Math.round((completedSessions / estimatedPlanned) * 100));

    return {
      totalHours,
      hoursByType: hoursByType as any,
      totalSessions: sessions.length,
      sessionsThisWeek,
      sessionsThisMonth,
      sessionsThisYear,
      completionRate,
      totalSwings,
      swingsByClub: {} as any,
      totalDrillsCompleted: 0,
      drillsByCategory: {},
      weeklyHours: weeklyMinutes / 60,
      monthlyHours: monthlyMinutes / 60,
      yearlyHours: yearlyMinutes / 60,
    };
  }

  /**
   * Calculate streak metrics
   */
  private async calculateStreakMetrics(playerId: string): Promise<StreakMetrics> {
    // Get all session dates
    const sessions = await this.prisma.trainingSession.findMany({
      where: {
        playerId,
        completionStatus: { in: ['completed', 'auto_completed'] },
      },
      select: {
        sessionDate: true,
      },
      orderBy: { sessionDate: 'desc' },
    });

    if (sessions.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        perfectWeeks: 0,
        consecutivePerfectWeeks: 0,
        earlyMorningSessions: 0,
        eveningSessions: 0,
        weekendSessions: 0,
        consistencyScore: 0,
        lastActiveDate: new Date(0),
        daysActive: 0,
      };
    }

    // Get unique dates
    const uniqueDates = new Set<string>();
    sessions.forEach((s) => {
      uniqueDates.add(new Date(s.sessionDate).toISOString().split('T')[0]);
    });
    const sortedDates = Array.from(uniqueDates).sort().reverse();

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if trained today or yesterday
    if (sortedDates[0] === today || sortedDates[0] === yesterday) {
      currentStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const diffDays = (prevDate.getTime() - currDate.getTime()) / 86400000;

        if (diffDays <= 1.5) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffDays = (prevDate.getTime() - currDate.getTime()) / 86400000;

      if (diffDays <= 1.5) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    // Count morning/evening/weekend sessions
    let earlyMorningSessions = 0;
    let eveningSessions = 0;
    let weekendSessions = 0;

    sessions.forEach((s) => {
      const date = new Date(s.sessionDate);
      const hour = date.getHours();
      const day = date.getDay();

      if (hour < 9) earlyMorningSessions++;
      if (hour >= 19) eveningSessions++;
      if (day === 0 || day === 6) weekendSessions++;
    });

    // Calculate perfect weeks (weeks with 5+ sessions)
    const weekMap = new Map<string, number>();
    sessions.forEach((s) => {
      const date = new Date(s.sessionDate);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay() + 1);
      const weekKey = weekStart.toISOString().split('T')[0];
      weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + 1);
    });

    const perfectWeeks = Array.from(weekMap.values()).filter(count => count >= 5).length;

    // Calculate consecutive perfect weeks
    const sortedWeeks = Array.from(weekMap.entries())
      .filter(([_, count]) => count >= 5)
      .map(([week]) => week)
      .sort()
      .reverse();

    let consecutivePerfectWeeks = 0;
    for (let i = 0; i < sortedWeeks.length; i++) {
      if (i === 0) {
        consecutivePerfectWeeks = 1;
      } else {
        const prevWeek = new Date(sortedWeeks[i - 1]);
        const currWeek = new Date(sortedWeeks[i]);
        const diffWeeks = (prevWeek.getTime() - currWeek.getTime()) / (7 * 24 * 60 * 60 * 1000);
        if (Math.abs(diffWeeks - 1) < 0.5) {
          consecutivePerfectWeeks++;
        } else {
          break;
        }
      }
    }

    return {
      currentStreak,
      longestStreak,
      perfectWeeks,
      consecutivePerfectWeeks,
      earlyMorningSessions,
      eveningSessions,
      weekendSessions,
      consistencyScore: Math.min(100, (uniqueDates.size / 30) * 100),
      lastActiveDate: new Date(sortedDates[0]),
      daysActive: uniqueDates.size,
    };
  }

  /**
   * Calculate strength metrics
   */
  private async calculateStrengthMetrics(playerId: string): Promise<StrengthMetrics> {
    // Get gym sessions
    const gymSessions = await this.prisma.trainingSession.findMany({
      where: {
        playerId,
        sessionType: 'fysisk',
        completionStatus: { in: ['completed', 'auto_completed'] },
      },
      select: {
        sessionDate: true,
        duration: true,
      },
      orderBy: { sessionDate: 'desc' },
    });

    // Calculate gym streak
    let gymStreak = 0;
    if (gymSessions.length > 0) {
      const uniqueWeeks = new Set<string>();
      gymSessions.forEach((s) => {
        const date = new Date(s.sessionDate);
        const weekNum = Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));
        uniqueWeeks.add(weekNum.toString());
      });
      gymStreak = uniqueWeeks.size;
    }

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const gymSessionsThisWeek = gymSessions.filter(
      (s) => new Date(s.sessionDate) >= startOfWeek
    ).length;
    const gymSessionsThisMonth = gymSessions.filter(
      (s) => new Date(s.sessionDate) >= startOfMonth
    ).length;

    return {
      totalTonnage: 0, // TODO: calculate from exercise records
      weeklyTonnage: 0,
      monthlyTonnage: 0,
      bodyweight: 70, // TODO: get from player profile
      prs: {} as any,
      prCount: 0, // TODO: calculate from PR records
      prCountThisMonth: 0,
      relativeStrength: {
        squat: 0,
        deadlift: 0,
        benchPress: 0,
      },
      golfFitness: {
        medBallThrow: 0,
        verticalJump: 0,
        broadJump: 0,
        hipRotationLeft: 0,
        hipRotationRight: 0,
        thoracicRotation: 0,
        shoulderMobility: 0,
        singleLegBalanceLeft: 0,
        singleLegBalanceRight: 0,
        plankHold: 0,
        clubheadSpeedDriver: 0,
        clubheadSpeed7Iron: 0,
        lastAssessmentDate: new Date(),
      },
      gymSessionsThisWeek,
      gymSessionsThisMonth,
      gymStreak,
    };
  }

  /**
   * Calculate performance metrics (from tests and tournaments)
   */
  private async calculatePerformanceMetrics(playerId: string): Promise<PerformanceMetrics> {
    // Get test results for speed via test relation
    const speedTests = await this.prisma.testResult.findMany({
      where: {
        playerId,
        test: { testType: { in: ['driver_speed', 'clubhead_speed', 'speed'] } },
      },
      orderBy: { testDate: 'desc' },
      take: 5,
    });

    const latestSpeed = speedTests[0]?.value ? Number(speedTests[0].value) : 0;

    // Get tournament results
    const tournaments = await this.prisma.tournamentResult.findMany({
      where: { playerId },
      orderBy: { createdAt: 'desc' },
    });

    const scores = tournaments.map((t) => t.totalScore).filter((s) => s !== null) as number[];
    const bestScore = scores.length > 0 ? Math.min(...scores) : 0;
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    // Get player handicap
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
      select: { handicap: true },
    });

    return {
      speed: {
        driverSpeed: latestSpeed,
        sevenIronSpeed: 0,
        wedgeSpeed: 0,
        driverSpeedBaseline: 0,
        baselineDate: new Date(),
        speedImprovement: 0,
        driverBallSpeed: 0,
        smashFactor: 0,
        launchAngle: 0,
        spinRate: 0,
      },
      accuracy: {
        fairwayHitPct: 0,
        avgDrivingDistance: 0,
        drivingDispersion: 0,
        missDirection: 'balanced',
        girPct: 0,
        avgProximity: 0,
        proximityFrom100: 0,
        proximityFrom150: 0,
        roundsTracked: tournaments.length,
      },
      putting: {
        avgPuttsPerRound: 0,
        onePuttPct: 0,
        threePuttPct: 0,
        makeRateInside3ft: 0,
        makeRate3to6ft: 0,
        makeRate6to10ft: 0,
        makeRate10to20ft: 0,
        makeRateOver20ft: 0,
        avgFirstPuttDistance: 0,
        totalPuttingDrills: 0,
        puttingDrillAccuracy: 0,
      },
      shortGame: {
        upAndDownPct: 0,
        sandSavePct: 0,
        scramblingPct: 0,
        proximityFrom50: 0,
        proximityFrom30: 0,
        proximityChip: 0,
        totalShortGameDrills: 0,
        shortGameDrillAccuracy: 0,
      },
      scoring: {
        bestScore18: bestScore,
        bestScore9: 0,
        avgScore18: avgScore,
        avgScoreLast10: avgScore,
        avgScoreLast20: avgScore,
        roundsUnder80: scores.filter((s) => s < 80).length,
        roundsUnder75: scores.filter((s) => s < 75).length,
        roundsUnder70: scores.filter((s) => s < 70).length,
        roundsUnderPar: scores.filter((s) => s < 72).length,
        currentHandicap: player?.handicap ? Number(player.handicap) : 54,
        lowHandicap: player?.handicap ? Number(player.handicap) : 54,
        handicapTrend: 'stable',
        totalRoundsPlayed: tournaments.length,
        competitiveRounds: tournaments.length,
      },
    };
  }

  /**
   * Calculate phase metrics
   */
  private async calculatePhaseMetrics(_playerId: string): Promise<PhaseMetrics> {
    // TODO: Implement phase tracking
    return {
      currentPhase: 'grunnlag' as any,
      phaseStartDate: new Date(),
      phaseEndDate: new Date(),
      daysInPhase: 0,
      phaseCompliance: 0,
      volumeVsPlan: 0,
      intensityVsPlan: 0,
      phasesCompleted: 0,
      phaseHistory: [],
      annualPlanCompliance: 0,
      yearlyGoalsAchieved: 0,
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // DATABASE OPERATIONS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get existing badge progress from database
   */
  private async getExistingBadgeProgress(playerId: string): Promise<BadgeProgress[]> {
    const records = await this.prisma.playerBadge.findMany({
      where: { playerId },
    });

    return records.map((r) => ({
      badgeId: r.badgeId,
      playerId: r.playerId,
      earned: r.earnedAt !== null,
      earnedAt: r.earnedAt ?? undefined,
      progress: r.progress ?? 0,
      requirementProgress: [],
      isNew: false,
      viewedAt: r.viewedAt ?? undefined,
    }));
  }

  /**
   * Persist badge progress to database
   */
  private async persistBadgeProgress(
    playerId: string,
    progress: BadgeProgress[]
  ): Promise<void> {
    for (const bp of progress) {
      await this.prisma.playerBadge.upsert({
        where: {
          playerId_badgeId: {
            playerId,
            badgeId: bp.badgeId,
          },
        },
        update: {
          progress: bp.progress,
          earnedAt: bp.earned && bp.earnedAt ? bp.earnedAt : undefined,
        },
        create: {
          playerId,
          badgeId: bp.badgeId,
          progress: bp.progress,
          earnedAt: bp.earned ? bp.earnedAt ?? new Date() : null,
        },
      });
    }
  }

  /**
   * Award XP to player and return new level if leveled up
   * Note: XP is calculated from earned badges, not stored directly on Player
   */
  private async awardXP(playerId: string, xpAmount: number): Promise<number | undefined> {
    // Get current XP from earned badges
    const earnedBadges = await this.prisma.playerBadge.findMany({
      where: { playerId, earnedAt: { not: null } },
    });

    const oldXP = earnedBadges.length * 50; // Simplified: 50 XP per badge
    const newXP = oldXP + xpAmount;
    const oldLevel = getLevelFromXP(oldXP);
    const newLevel = getLevelFromXP(newXP);

    // XP is tracked implicitly through badges, no direct update needed

    return newLevel > oldLevel ? newLevel : undefined;
  }

  /**
   * Create notification for badge unlock
   */
  private async createBadgeNotification(
    playerId: string,
    event: BadgeUnlockEvent
  ): Promise<void> {
    try {
      await this.prisma.notification.create({
        data: {
          recipientType: 'player',
          recipientId: playerId,
          notificationType: 'badge_unlocked',
          title: `Badge opptjent: ${event.badge.name}`,
          message: event.badge.description,
          metadata: {
            badgeId: event.badgeId,
            xpAwarded: event.xpAwarded,
            tier: event.badge.tier,
            category: event.badge.category,
            symbol: event.badge.symbol,
          },
          priority: 'normal',
          status: 'pending',
        },
      });
    } catch (error) {
      // Notification table might not exist yet
      this.logger.warn({ error }, 'Could not create badge notification');
    }
  }
}

/**
 * Factory function
 */
export function createBadgeEvaluatorService(prisma: PrismaClient): BadgeEvaluatorService {
  return new BadgeEvaluatorService(prisma);
}
