/**
 * DataGolf Integration Types
 * Based on SAMMENLIGNING_OG_ANALYTICS.md
 */

// ============================================================================
// DATAGOLF PLAYER DATA
// ============================================================================

export interface DataGolfPlayerData {
  playerId: string | null; // IUP Player ID
  dataGolfPlayerId: string;
  playerName: string;
  tour: string | null; // PGA, LPGA, DP World, etc.
  lastUpdated: Date;

  // Strokes Gained stats
  strokesGainedTotal: number | null;
  strokesGainedOTT: number | null; // Off the tee
  strokesGainedAPR: number | null; // Approach
  strokesGainedARG: number | null; // Around the green
  strokesGainedPutting: number | null;

  // Distance stats
  drivingDistance: number | null;
  drivingAccuracy: number | null;

  // Scoring stats
  scoringAverage: number | null;
  birdiesToPars: number | null;

  // Additional stats
  greensInRegulation: number | null;
  scrambling: number | null;
  puttsPerRound: number | null;
}

// ============================================================================
// DATAGOLF TOUR AVERAGES
// ============================================================================

export interface DataGolfTourAverages {
  tour: string;
  season: number;
  lastUpdated: Date;

  // Average strokes gained
  avgStrokesGainedTotal: number | null;
  avgStrokesGainedOTT: number | null;
  avgStrokesGainedAPR: number | null;
  avgStrokesGainedARG: number | null;
  avgStrokesGainedPutting: number | null;

  // Average distance
  avgDrivingDistance: number | null;
  avgDrivingAccuracy: number | null;

  // Average scoring
  avgScoringAverage: number | null;
  avgGreensInRegulation: number | null;
  avgScrambling: number | null;
  avgPuttsPerRound: number | null;
}

// ============================================================================
// IUP TO DATAGOLF MAPPING
// ============================================================================

export interface IupDataGolfMapping {
  iupTestNumber: number;
  iupTestName: string;
  dataGolfMetric: string;
  conversionFormula?: string; // e.g., "meters * 1.094 for yards"
  correlationStrength: number; // 0-1, how well they correlate
  notes?: string;
}

// ============================================================================
// COMPARISON RESULT
// ============================================================================

export interface IupToDataGolfComparison {
  playerId: string;
  playerName: string;
  category: string;

  comparisons: Array<{
    iupTestNumber: number;
    iupTestName: string;
    iupValue: number;
    dataGolfMetric: string;
    dataGolfValue: number;
    tourAverage: number;
    percentileVsTour: number; // 0-100
    gap: number; // Difference from tour average
    gapPercentage: number;
  }>;

  overallAssessment: {
    totalTests: number;
    aboveTourAverage: number;
    belowTourAverage: number;
    nearTourAverage: number;
    overallPercentile: number;
  };
}

// ============================================================================
// SYNC STATUS
// ============================================================================

export interface DataGolfSyncStatus {
  lastSyncAt: Date;
  nextSyncAt: Date;
  syncStatus: 'idle' | 'syncing' | 'error' | 'success' | 'failed' | 'completed_with_errors';
  playersUpdated: number;
  tourAveragesUpdated: number;
  errors?: string[];
}
