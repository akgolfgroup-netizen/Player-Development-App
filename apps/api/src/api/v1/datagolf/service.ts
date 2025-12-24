/**
 * DataGolf Integration Service
 * Handles integration with DataGolf API and comparison functionality
 */

import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../../../middleware/errors';
import { getMapping, convertIupToDataGolf } from './mappings';
import { DataGolfClient } from '../../../integrations/datagolf/client';
import { logger } from '../../../utils/logger';
import type {
  DataGolfPlayerData,
  DataGolfTourAverages,
  IupToDataGolfComparison,
  DataGolfSyncStatus,
} from './types';

export class DataGolfService {
  private dataGolfClient: DataGolfClient;

  constructor(private prisma: PrismaClient) {
    this.dataGolfClient = new DataGolfClient();
  }

  /**
   * Get DataGolf data for a player
   */
  async getDataGolfPlayer(
    tenantId: string,
    playerId: string
  ): Promise<DataGolfPlayerData | null> {
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

    // Get DataGolf player data
    const dataGolfPlayer = await this.prisma.dataGolfPlayer.findFirst({
      where: {
        iupPlayerId: playerId,
      },
    });

    if (!dataGolfPlayer) {
      return null;
    }

    return {
      playerId: dataGolfPlayer.iupPlayerId,
      dataGolfPlayerId: dataGolfPlayer.dataGolfId,
      playerName: dataGolfPlayer.playerName,
      tour: dataGolfPlayer.tour,
      lastUpdated: dataGolfPlayer.lastSynced,
      strokesGainedTotal: dataGolfPlayer.sgTotal ? Number(dataGolfPlayer.sgTotal) : null,
      strokesGainedOTT: dataGolfPlayer.sgOffTee ? Number(dataGolfPlayer.sgOffTee) : null,
      strokesGainedAPR: dataGolfPlayer.sgApproach ? Number(dataGolfPlayer.sgApproach) : null,
      strokesGainedARG: dataGolfPlayer.sgAroundGreen ? Number(dataGolfPlayer.sgAroundGreen) : null,
      strokesGainedPutting: dataGolfPlayer.sgPutting ? Number(dataGolfPlayer.sgPutting) : null,
      drivingDistance: dataGolfPlayer.drivingDistance ? Number(dataGolfPlayer.drivingDistance) : null,
      drivingAccuracy: dataGolfPlayer.drivingAccuracy ? Number(dataGolfPlayer.drivingAccuracy) : null,
      scoringAverage: null, // Not in schema
      birdiesToPars: null, // Not in schema
      greensInRegulation: dataGolfPlayer.girPercent ? Number(dataGolfPlayer.girPercent) : null,
      scrambling: dataGolfPlayer.scramblingPercent ? Number(dataGolfPlayer.scramblingPercent) : null,
      puttsPerRound: dataGolfPlayer.puttsPerRound ? Number(dataGolfPlayer.puttsPerRound) : null,
    };
  }

  /**
   * Get tour averages for a specific tour
   */
  async getTourAverages(tour: string, season: number): Promise<DataGolfTourAverages | null> {
    const tourAverage = await this.prisma.dataGolfTourAverage.findFirst({
      where: {
        tour,
        season,
      },
    });

    if (!tourAverage) {
      return null;
    }

    const stats = tourAverage.stats as any;
    return {
      tour: tourAverage.tour,
      season: tourAverage.season,
      lastUpdated: tourAverage.updatedAt,
      avgStrokesGainedTotal: stats?.avgSgTotal ?? null,
      avgStrokesGainedOTT: stats?.avgSgOtt ?? null,
      avgStrokesGainedAPR: stats?.avgSgApp ?? null,
      avgStrokesGainedARG: stats?.avgSgArg ?? null,
      avgStrokesGainedPutting: stats?.avgSgPutt ?? null,
      avgDrivingDistance: stats?.avgDrivingDistance ?? null,
      avgDrivingAccuracy: stats?.avgDrivingAccuracy ?? null,
      avgScoringAverage: stats?.avgScoringAverage ?? null,
      avgGreensInRegulation: stats?.avgGreensInRegulation ?? null,
      avgScrambling: stats?.avgScrambling ?? null,
      avgPuttsPerRound: stats?.avgPuttsPerRound ?? null,
    };
  }

  /**
   * Compare IUP player performance to DataGolf tour averages
   */
  async compareToTour(
    tenantId: string,
    playerId: string,
    tour: string = 'PGA',
    season: number = new Date().getFullYear()
  ): Promise<IupToDataGolfComparison> {
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

    // Get player's latest test results
    const testResults = await this.prisma.testResult.findMany({
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

    // Get tour averages
    const tourAverages = await this.getTourAverages(tour, season);

    if (!tourAverages) {
      throw new NotFoundError(`Tour averages not found for ${tour} ${season}`);
    }

    // Build comparisons
    const comparisons: any[] = [];
    let aboveTourAverage = 0;
    let belowTourAverage = 0;
    let nearTourAverage = 0;

    for (const result of testResults) {
      const mapping = getMapping(result.test.testNumber);
      if (!mapping || mapping.dataGolfMetric === 'none') {
        continue;
      }

      const iupValue = Number(result.value);
      const convertedValue = convertIupToDataGolf(result.test.testNumber, iupValue);

      if (convertedValue === null) {
        continue;
      }

      // Get tour average for this metric (placeholder - would need proper mapping)
      let tourAvg = 0;
      let dataGolfValue = 0;

      // Map to tour averages based on metric
      switch (mapping.dataGolfMetric) {
        case 'driving_distance':
          tourAvg = tourAverages.avgDrivingDistance ?? 0;
          dataGolfValue = convertedValue;
          break;
        case 'strokes_gained_approach':
          tourAvg = tourAverages.avgStrokesGainedAPR ?? 0;
          dataGolfValue = iupValue; // Would need proper conversion
          break;
        case 'strokes_gained_putting':
          tourAvg = tourAverages.avgStrokesGainedPutting ?? 0;
          dataGolfValue = iupValue; // Would need proper conversion
          break;
        case 'strokes_gained_around_green':
          tourAvg = tourAverages.avgStrokesGainedARG ?? 0;
          dataGolfValue = iupValue; // Would need proper conversion
          break;
        case 'scoring_average':
          tourAvg = tourAverages.avgScoringAverage ?? 0;
          dataGolfValue = iupValue;
          break;
        default:
          continue;
      }

      const gap = dataGolfValue - tourAvg;
      const gapPercentage = tourAvg !== 0 ? (gap / tourAvg) * 100 : 0;

      // Calculate percentile (simplified)
      const percentile = gap > 0 ? 60 : gap < 0 ? 40 : 50;

      if (Math.abs(gapPercentage) < 5) {
        nearTourAverage++;
      } else if (gap > 0) {
        aboveTourAverage++;
      } else {
        belowTourAverage++;
      }

      comparisons.push({
        iupTestNumber: result.test.testNumber,
        iupTestName: result.test.name,
        iupValue,
        dataGolfMetric: mapping.dataGolfMetric,
        dataGolfValue,
        tourAverage: tourAvg,
        percentileVsTour: percentile,
        gap: Math.round(gap * 100) / 100,
        gapPercentage: Math.round(gapPercentage * 10) / 10,
      });
    }

    const totalTests = comparisons.length;
    const overallPercentile =
      totalTests > 0
        ? Math.round(
            ((aboveTourAverage + nearTourAverage * 0.5) / totalTests) * 100
          )
        : 50;

    return {
      playerId: player.id,
      playerName: `${player.firstName} ${player.lastName}`,
      category: player.category,
      comparisons,
      overallAssessment: {
        totalTests,
        aboveTourAverage,
        belowTourAverage,
        nearTourAverage,
        overallPercentile,
      },
    };
  }

  /**
   * Sync DataGolf data from API
   */
  async syncDataGolf(tenantId: string): Promise<DataGolfSyncStatus> {
    if (!this.dataGolfClient.isConfigured()) {
      logger.warn({ tenantId }, 'DataGolf API not configured, skipping sync');
      return {
        lastSyncAt: new Date(),
        nextSyncAt: this.calculateNextSync(),
        syncStatus: 'failed',
        playersUpdated: 0,
        tourAveragesUpdated: 0,
        errors: ['DataGolf API key not configured'],
      };
    }

    logger.info({ tenantId }, 'Starting DataGolf sync');
    const startTime = Date.now();
    let playersUpdated = 0;
    let tourAveragesUpdated = 0;
    const errors: string[] = [];

    try {
      // Sync PGA Tour
      logger.debug('Syncing PGA Tour data');
      const pgaData = await this.dataGolfClient.getSkillRatings('pga');

      if (pgaData && Array.isArray(pgaData)) {
        await this.syncTourData('pga', 2025, pgaData);
        tourAveragesUpdated++;

        // Sync selected players (top 100 + Norwegian players)
        const playersToSync = this.getPlayersToSync(pgaData);
        logger.debug({ count: playersToSync.length }, 'Syncing players');

        for (const playerData of playersToSync) {
          try {
            await this.syncPlayer(playerData);
            playersUpdated++;
          } catch (error: any) {
            logger.error({ error: error.message, player: playerData.player_name }, 'Failed to sync player');
            errors.push(`Failed to sync ${playerData.player_name}: ${error.message}`);
          }
        }
      }

      const duration = Date.now() - startTime;
      logger.info({
        tenantId,
        playersUpdated,
        tourAveragesUpdated,
        duration,
        errorCount: errors.length
      }, 'DataGolf sync completed');

      return {
        lastSyncAt: new Date(),
        nextSyncAt: this.calculateNextSync(),
        syncStatus: errors.length > 0 ? 'completed_with_errors' : 'success',
        playersUpdated,
        tourAveragesUpdated,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error: any) {
      logger.error({ error: error.message, tenantId }, 'DataGolf sync failed');

      return {
        lastSyncAt: new Date(),
        nextSyncAt: this.calculateNextSync(),
        syncStatus: 'failed',
        playersUpdated: 0,
        tourAveragesUpdated: 0,
        errors: [error.message],
      };
    }
  }

  /**
   * Sync tour averages to database
   */
  private async syncTourData(tour: string, season: number, skillRatings: any[]): Promise<void> {
    const averages = {
      avgSgTotal: this.calculateAverage(skillRatings, 'sg_total'),
      avgSgOtt: this.calculateAverage(skillRatings, 'sg_ott'),
      avgSgApp: this.calculateAverage(skillRatings, 'sg_app'),
      avgSgArg: this.calculateAverage(skillRatings, 'sg_arg'),
      avgSgPutt: this.calculateAverage(skillRatings, 'sg_putt'),
    };

    await this.prisma.dataGolfTourAverage.upsert({
      where: {
        tour_season: {
          tour,
          season,
        },
      },
      create: {
        tour,
        season,
        stats: averages,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      update: {
        stats: averages,
        updatedAt: new Date(),
      },
    });

    logger.debug({ tour, season, averages }, 'Synced tour averages');
  }

  /**
   * Sync individual player data to database
   */
  private async syncPlayer(playerData: any): Promise<void> {
    await this.prisma.dataGolfPlayer.upsert({
      where: {
        dataGolfId: playerData.dg_id.toString(),
      },
      create: {
        dataGolfId: playerData.dg_id.toString(),
        playerName: playerData.player_name,
        sgTotal: playerData.sg_total,
        sgOffTee: playerData.sg_ott,
        sgApproach: playerData.sg_app,
        sgAroundGreen: playerData.sg_arg,
        sgPutting: playerData.sg_putt,
        tour: 'pga',
        season: 2025,
        lastSynced: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      update: {
        playerName: playerData.player_name,
        sgTotal: playerData.sg_total,
        sgOffTee: playerData.sg_ott,
        sgApproach: playerData.sg_app,
        sgAroundGreen: playerData.sg_arg,
        sgPutting: playerData.sg_putt,
        lastSynced: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Select which players to sync (top 100 + Norwegian players)
   */
  private getPlayersToSync(skillRatings: any[]): any[] {
    // Top 100 players
    const top100 = skillRatings
      .sort((a, b) => (b.sg_total || 0) - (a.sg_total || 0))
      .slice(0, 100);

    // Norwegian players
    const norwegianNames = ['Viktor Hovland', 'Ludvig Åberg', 'Kristoffer Ventura', 'Kristian Krogh Johannessen'];
    const norwegianPlayers = skillRatings.filter(p =>
      norwegianNames.some(name => p.player_name?.includes(name))
    );

    // Combine and deduplicate
    const allPlayers = [...top100, ...norwegianPlayers];
    const uniquePlayers = Array.from(
      new Map(allPlayers.map(p => [p.dg_id, p])).values()
    );

    return uniquePlayers;
  }

  /**
   * Calculate next sync time (03:00 UTC daily)
   */
  private calculateNextSync(): Date {
    const next = new Date();
    next.setUTCHours(3, 0, 0, 0);

    // If we've passed 03:00 UTC today, schedule for tomorrow
    if (next <= new Date()) {
      next.setUTCDate(next.getUTCDate() + 1);
    }

    return next;
  }

  /**
   * Calculate average for a field
   */
  private calculateAverage(data: any[], field: string): number {
    const values = data
      .map(item => item[field])
      .filter(val => val !== null && val !== undefined && !isNaN(val));

    if (values.length === 0) {
      return 0;
    }

    const sum = values.reduce((acc, val) => acc + val, 0);
    return Number((sum / values.length).toFixed(3));
  }

  /**
   * Get sync status
   */
  async getSyncStatus(): Promise<DataGolfSyncStatus> {
    // Get last sync time from database
    const lastSync = await this.prisma.dataGolfPlayer.findFirst({
      orderBy: {
        lastSynced: 'desc',
      },
      select: {
        lastSynced: true,
      },
    });

    const lastSyncAt = lastSync?.lastSynced || new Date(0);
    const nextSyncAt = new Date(lastSyncAt.getTime() + 24 * 60 * 60 * 1000);

    const playerCount = await this.prisma.dataGolfPlayer.count();
    const tourAverageCount = await this.prisma.dataGolfTourAverage.count();

    return {
      lastSyncAt,
      nextSyncAt,
      syncStatus: 'idle',
      playersUpdated: playerCount,
      tourAveragesUpdated: tourAverageCount,
    };
  }
}
