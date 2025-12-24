/**
 * DataGolf API Client
 * Handles communication with DataGolf API for tour statistics and player data
 */

import axios, { AxiosInstance } from 'axios';
import { logger } from '../../utils/logger';

export class DataGolfClient {
  private client: AxiosInstance;
  private apiKey: string;
  private baseUrl: string;
  private rateLimit: number;
  private lastRequestTime: number = 0;

  constructor() {
    this.apiKey = process.env.DATAGOLF_API_KEY || '';
    this.baseUrl = process.env.DATAGOLF_BASE_URL || 'https://feeds.datagolf.com';
    this.rateLimit = parseInt(process.env.DATAGOLF_RATE_LIMIT || '1000', 10); // ms between requests

    if (!this.apiKey) {
      logger.warn('⚠️  DataGolf API key not configured. DataGolf features will be disabled.');
    }

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });
  }

  /**
   * Rate limiting to respect DataGolf API limits (1 request per second)
   */
  private async applyRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.rateLimit) {
      const delay = this.rateLimit - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Get skill ratings for a specific tour
   */
  async getSkillRatings(tour: string = 'pga'): Promise<any> {
    if (!this.apiKey) {
      throw new Error('DataGolf API key not configured');
    }

    await this.applyRateLimit();

    try {
      const response = await this.client.get('/preds/skill-ratings', {
        params: {
          tour,
          key: this.apiKey
        },
      });

      logger.debug({ tour, playerCount: response.data?.length || 0 }, 'Fetched DataGolf skill ratings');
      return response.data;
    } catch (error: any) {
      logger.error({ error: error.message, tour }, 'Failed to fetch DataGolf skill ratings');
      throw error;
    }
  }

  /**
   * Calculate tour averages from skill ratings
   * DataGolf doesn't have a direct "tour averages" endpoint, so we calculate from all players
   */
  async getTourAverages(tour: string = 'pga'): Promise<any> {
    await this.applyRateLimit();

    try {
      const skillRatings = await this.getSkillRatings(tour);

      if (!Array.isArray(skillRatings) || skillRatings.length === 0) {
        logger.warn({ tour }, 'No skill ratings data available for tour');
        return null;
      }

      // Calculate averages from all players
      const averages = {
        avgSgTotal: this.calculateAverage(skillRatings, 'sg_total'),
        avgSgOtt: this.calculateAverage(skillRatings, 'sg_ott'),
        avgSgApp: this.calculateAverage(skillRatings, 'sg_app'),
        avgSgArg: this.calculateAverage(skillRatings, 'sg_arg'),
        avgSgPutt: this.calculateAverage(skillRatings, 'sg_putt'),
      };

      logger.debug({ tour, averages }, 'Calculated tour averages');
      return averages;
    } catch (error: any) {
      logger.error({ error: error.message, tour }, 'Failed to calculate tour averages');
      throw error;
    }
  }

  /**
   * Find a player by name
   */
  async getPlayerByName(playerName: string, tour: string = 'pga'): Promise<any | null> {
    try {
      const skillRatings = await this.getSkillRatings(tour);

      if (!Array.isArray(skillRatings)) {
        return null;
      }

      const player = skillRatings.find((p: any) =>
        p.player_name?.toLowerCase().includes(playerName.toLowerCase())
      );

      if (player) {
        logger.debug({ playerName, tour, foundPlayer: player.player_name }, 'Found player in DataGolf');
      } else {
        logger.debug({ playerName, tour }, 'Player not found in DataGolf');
      }

      return player || null;
    } catch (error: any) {
      logger.error({ error: error.message, playerName, tour }, 'Failed to find player');
      return null;
    }
  }

  /**
   * Calculate average for a specific field across all players
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
   * Check if API is configured and available
   */
  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      await this.getSkillRatings('pga');
      return true;
    } catch (error) {
      return false;
    }
  }
}
