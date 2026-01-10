/**
 * Goals Service
 *
 * Business logic for goal streaks, badges, and statistics
 */

// TODO: Replace with actual Prisma models when database schema is ready
// import { getPrismaClient } from '../../../core/db/prisma';
// const prisma = getPrismaClient();

// In-memory storage for development (replace with database)
const streakData = new Map<string, {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  streakStatus: 'active' | 'at_risk' | 'frozen' | 'inactive';
}>();

const badgeData = new Map<string, Array<{
  id: string;
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
  viewed: boolean;
}>>();

// Badge definitions (should match frontend)
const BADGE_DEFINITIONS = [
  { id: 'first_goal', name: 'Første Mål', description: 'Fullført ditt første mål', icon: '🎯', rarity: 'common' },
  { id: 'three_day_streak', name: '3-dagers Streek', description: 'Oppdatert fremgang 3 dager på rad', icon: '🔥', rarity: 'common' },
  { id: 'week_streak', name: '7-dagers Streek', description: 'Oppdatert fremgang 7 dager på rad', icon: '⭐', rarity: 'rare' },
  { id: 'five_goals', name: 'Målbevisst', description: 'Fullført 5 mål', icon: '🏆', rarity: 'rare' },
] as const;

export class GoalsService {
  /**
   * Get current streak data for a user
   */
  async getStreak(userId: string) {
    let streak = streakData.get(userId);
    
    if (!streak) {
      // Initialize default streak
      streak = {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: new Date(),
        streakStatus: 'inactive'
      };
      streakData.set(userId, streak);
    }

    // Calculate days until expiry
    const now = new Date();
    const hoursSinceActivity = (now.getTime() - streak.lastActivityDate.getTime()) / (1000 * 60 * 60);
    const daysUntilExpiry = Math.max(0, Math.ceil(1 - hoursSinceActivity / 24));

    // Update status based on time since last activity
    if (hoursSinceActivity < 24) {
      streak.streakStatus = 'active';
    } else if (hoursSinceActivity < 48) {
      streak.streakStatus = 'at_risk';
    } else {
      streak.streakStatus = 'inactive';
      streak.currentStreak = 0;
    }

    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActivityDate: streak.lastActivityDate.toISOString(),
      streakStatus: streak.streakStatus,
      daysUntilExpiry
    };
  }

  /**
   * Update streak when user makes progress on a goal
   */
  async updateStreak(userId: string, goalId: string, progressValue: number) {
    let streak = streakData.get(userId);
    
    if (!streak) {
      streak = {
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: new Date(),
        streakStatus: 'active'
      };
    } else {
      const now = new Date();
      const hoursSinceActivity = (now.getTime() - streak.lastActivityDate.getTime()) / (1000 * 60 * 60);

      if (hoursSinceActivity < 24) {
        // Same day - don't increment
        streak.lastActivityDate = now;
      } else if (hoursSinceActivity < 48) {
        // Next day - increment streak
        streak.currentStreak++;
        streak.lastActivityDate = now;
        streak.streakStatus = 'active';

        // Update longest if needed
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak;
        }

        // Check for badge unlocks
        await this.checkStreakBadges(userId, streak.currentStreak);
      } else {
        // Streak broken - reset
        streak.currentStreak = 1;
        streak.lastActivityDate = now;
        streak.streakStatus = 'active';
      }
    }

    streakData.set(userId, streak);

    return {
      success: true,
      currentStreak: streak.currentStreak,
      streakUpdated: true,
      message: 'Streak updated successfully'
    };
  }

  /**
   * Get comprehensive goal statistics
   */
  async getStats(userId: string) {
    // TODO: Replace with actual database queries
    return {
      totalActive: 3,
      totalCompleted: 5,
      averageProgress: 67,
      completedThisMonth: 2,
      upcomingDeadlines: [],
      recentActivity: [
        { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], updates: 2 },
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], updates: 1 },
        { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], updates: 3 }
      ]
    };
  }

  /**
   * Get all badges for a user
   */
  async getBadges(userId: string) {
    const userBadges = badgeData.get(userId) || [];

    return {
      badges: userBadges,
      unlockedCount: userBadges.length,
      totalBadges: BADGE_DEFINITIONS.length,
      recentUnlocks: userBadges
        .sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime())
        .slice(0, 3)
        .map(b => ({
          id: b.id,
          badgeId: b.badgeId,
          name: b.name,
          icon: b.icon,
          unlockedAt: b.unlockedAt.toISOString()
        }))
    };
  }

  /**
   * Unlock a badge for a user
   */
  async unlockBadge(userId: string, badgeId: string) {
    const userBadges = badgeData.get(userId) || [];

    // Check if already unlocked
    if (userBadges.some(b => b.badgeId === badgeId)) {
      throw new Error('Badge already unlocked');
    }

    // Find badge definition
    const badgeDef = BADGE_DEFINITIONS.find(b => b.id === badgeId);
    if (!badgeDef) {
      throw new Error('Badge not found');
    }

    // Create badge instance
    const badge = {
      id: `${userId}-${badgeId}-${Date.now()}`,
      badgeId,
      name: badgeDef.name,
      description: badgeDef.description,
      icon: badgeDef.icon,
      rarity: badgeDef.rarity,
      unlockedAt: new Date(),
      viewed: false
    };

    userBadges.push(badge);
    badgeData.set(userId, userBadges);

    return {
      success: true,
      badge: {
        ...badge,
        unlockedAt: badge.unlockedAt.toISOString()
      }
    };
  }

  /**
   * Mark badge as viewed
   */
  async markBadgeViewed(userId: string, badgeId: string) {
    const userBadges = badgeData.get(userId) || [];
    const badge = userBadges.find(b => b.id === badgeId);

    if (badge) {
      badge.viewed = true;
      badgeData.set(userId, userBadges);
    }

    return { success: true };
  }

  /**
   * Check and unlock streak-based badges
   */
  private async checkStreakBadges(userId: string, currentStreak: number) {
    if (currentStreak === 3) {
      try {
        await this.unlockBadge(userId, 'three_day_streak');
      } catch (e) {
        // Badge already unlocked
      }
    } else if (currentStreak === 7) {
      try {
        await this.unlockBadge(userId, 'week_streak');
      } catch (e) {
        // Badge already unlocked
      }
    }
  }
}
