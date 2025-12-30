/**
 * AK Golf Academy - Tournament Calendar Types
 *
 * Type definitions for the tournament calendar feature.
 * Follows the spec requirements for tournament ingestion,
 * hierarchy mapping, and filtering.
 */

// ============================================================================
// TOUR/SERIES TYPES
// ============================================================================

/**
 * Supported tournament tour/series types
 * As defined in the spec requirements
 */
export type TourType =
  | 'junior_tour_regional'
  | 'srixon_tour'
  | 'garmin_norges_cup'
  | 'global_junior_tour'
  | 'nordic_league'
  | 'ega_turnering'
  | 'wagr_turnering'
  | 'college_turneringer'
  | 'challenge_tour'
  | 'dp_world_tour'
  | 'pga_tour'
  | 'club'      // Local club tournaments
  | 'academy';  // AK Golf Academy internal

export const TOUR_LABELS: Record<TourType, string> = {
  junior_tour_regional: 'Junior Tour Regional',
  srixon_tour: 'Srixon Tour',
  garmin_norges_cup: 'Garmin Norges Cup',
  global_junior_tour: 'Global Junior Tour',
  nordic_league: 'Nordic League',
  ega_turnering: 'EGA Turnering',
  wagr_turnering: 'WAGR Turnering',
  college_turneringer: 'College Turneringer',
  challenge_tour: 'Challenge Tour',
  dp_world_tour: 'DP World Tour',
  pga_tour: 'PGA Tour',
  club: 'Klubbturnering',
  academy: 'Akademiturnering',
};

// ============================================================================
// STATUS TYPES
// ============================================================================

/**
 * Tournament registration/completion status
 */
export type TournamentStatus =
  | 'upcoming'           // Not yet open for registration
  | 'registration_open'  // Open for registration
  | 'registered'         // User is registered
  | 'registration_closed'// Registration closed, not full
  | 'full'               // Registration full
  | 'in_progress'        // Tournament is ongoing
  | 'completed';         // Tournament finished, results available

export const STATUS_LABELS: Record<TournamentStatus, string> = {
  upcoming: 'Kommer snart',
  registration_open: 'Åpen for påmelding',
  registered: 'Påmeldt',
  registration_closed: 'Påmelding stengt',
  full: 'Fullt',
  in_progress: 'Pågår',
  completed: 'Avsluttet',
};

// ============================================================================
// CATEGORY TYPES (Player Categories / Hierarchy)
// ============================================================================

/**
 * Player categories based on hierarchy document
 * Determines recommended tournament level
 */
export type PlayerCategory =
  | 'A'  // Elite / Professional level
  | 'B'  // Advanced / Semi-professional
  | 'C'  // Intermediate / Competitive amateur
  | 'D'  // Developing / Club level
  | 'E'  // Beginner / Entry level
  | 'udefinert'; // Unknown/undefined

export const CATEGORY_LABELS: Record<PlayerCategory, string> = {
  A: 'Kategori A',
  B: 'Kategori B',
  C: 'Kategori C',
  D: 'Kategori D',
  E: 'Kategori E',
  udefinert: 'Udefinert',
};

export const CATEGORY_DESCRIPTIONS: Record<PlayerCategory, string> = {
  A: 'Elite / Profesjonell nivå',
  B: 'Avansert / Semi-profesjonell',
  C: 'Viderekommende / Konkurranseamatør',
  D: 'Utviklende / Klubbnivå',
  E: 'Nybegynner / Inngangsnivå',
  udefinert: 'Kategori ikke definert',
};

/**
 * Confidence level for category recommendation
 */
export type RecommendationConfidence = 'high' | 'medium' | 'low';

// ============================================================================
// TOURNAMENT INTERFACE
// ============================================================================

/**
 * Result data for completed tournaments
 */
export interface TournamentResult {
  position: number;
  score: number;
  scoreToPar?: number;
  field: number;  // Total participants
  rounds?: number[];
}

/**
 * Main Tournament interface
 * Normalized format for all tournament data regardless of source
 */
export interface Tournament {
  // Identity
  id: string;
  name: string;

  // Dates
  startDate: string;  // ISO date string YYYY-MM-DD
  endDate: string;    // ISO date string YYYY-MM-DD
  registrationDeadline?: string;

  // Location
  venue: string;      // Course name
  city: string;
  region?: string;
  country: string;    // ISO country code

  // Tour/Source
  tour: TourType;

  // Status
  status: TournamentStatus;

  // Participation
  maxParticipants?: number;
  currentParticipants?: number;

  // Fees & Links
  entryFee?: number;  // In NOK
  registrationUrl?: string;
  hotelUrl?: string;
  resultsUrl?: string;

  // Format
  format?: string;    // e.g., "54 hull slagspill"
  description?: string;

  // Player-specific
  isRegistered?: boolean;
  result?: TournamentResult;

  // Hierarchy mapping (derived)
  recommendedCategory: PlayerCategory;
  recommendedLevelLabel: string;
  recommendationConfidence: RecommendationConfidence;

  // Metadata
  source?: string;    // API source identifier
  lastUpdated?: string;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

/**
 * Date range filter options
 */
export type DateRangePreset =
  | 'next_30_days'
  | 'next_90_days'
  | 'this_season'
  | 'custom';

/**
 * Tournament list filters
 */
export interface TournamentFilters {
  // Category filter
  recommendedCategories?: PlayerCategory[];
  showRecommendedForMe?: boolean;

  // Tour filter
  tours?: TourType[];

  // Status filter
  statuses?: TournamentStatus[];

  // Date filter
  dateRange?: DateRangePreset;
  customDateStart?: string;
  customDateEnd?: string;

  // Location filter
  countries?: string[];
  regions?: string[];

  // Search
  searchQuery?: string;
}

/**
 * Sort options for tournament list
 */
export type TournamentSortKey =
  | 'date'
  | 'recommended_fit'
  | 'prestige'
  | 'distance';

export interface TournamentSort {
  key: TournamentSortKey;
  direction: 'asc' | 'desc';
}

// ============================================================================
// TAB TYPES
// ============================================================================

/**
 * Tab filter types for quick filtering
 */
export type TournamentTab =
  | 'alle'
  | 'mine_turneringer'
  | 'junior'
  | 'elite'
  | 'open';

// ============================================================================
// API TYPES
// ============================================================================

/**
 * Parameters for fetching tournaments
 */
export interface FetchTournamentsParams {
  startDate?: string;
  endDate?: string;
  filters?: TournamentFilters;
  sort?: TournamentSort;
  page?: number;
  limit?: number;
}

/**
 * Response from tournament fetch
 */
export interface TournamentsResponse {
  tournaments: Tournament[];
  total: number;
  page: number;
  hasMore: boolean;
}

// ============================================================================
// STATISTICS TYPES
// ============================================================================

/**
 * Tournament statistics for header display
 */
export interface TournamentStats {
  upcoming: number;
  registered: number;
  podiums: number;      // Top 3 finishes this year
  playedThisYear: number;
}
