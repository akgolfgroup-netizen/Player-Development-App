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

// ============================================================================
// TOURNAMENT PURPOSE (from hierarchy document Section 10)
// ============================================================================

/**
 * Tournament purpose categories from hierarchy document
 * Determines how the player should approach the tournament
 */
export type TournamentPurpose =
  | 'RESULTAT'   // High priority - results matter, full performance mode
  | 'UTVIKLING'  // Medium priority - gain experience, test skills
  | 'TRENING';   // Low priority - practice under competition conditions

export const PURPOSE_LABELS: Record<TournamentPurpose, string> = {
  RESULTAT: 'Resultat',
  UTVIKLING: 'Utvikling',
  TRENING: 'Trening',
};

export const PURPOSE_DESCRIPTIONS: Record<TournamentPurpose, string> = {
  RESULTAT: 'Full prestasjonsmodus - resultatet er viktigst',
  UTVIKLING: 'Teste ferdigheter - bygge konkurranseerfaring',
  TRENING: 'Øve under turneringspress - eksperimentere',
};

// ============================================================================
// COMPETITION LEVEL (from hierarchy document - Nivå)
// ============================================================================

/**
 * Competition level/scope
 * Determines the geographic scope and prestige of the tournament
 */
export type CompetitionLevel =
  | 'internasjonal'
  | 'nasjonal'
  | 'regional'
  | 'klubb'
  | 'junior'
  | 'trenings_turnering';

export const LEVEL_LABELS: Record<CompetitionLevel, string> = {
  internasjonal: 'Internasjonal',
  nasjonal: 'Nasjonal',
  regional: 'Regional',
  klubb: 'Klubb',
  junior: 'Junior',
  trenings_turnering: 'Treningsturnering',
};

// ============================================================================
// JUNIOR TOUR REGIONS (Appendix 2 - Norwegian Golf Federation)
// ============================================================================

/**
 * Junior Tour regions based on NGF regional structure
 * Used for filtering regional junior tournaments
 */
export type JuniorTourRegion =
  | 'ostlandet_ost'     // Østfold, parts of Akershus
  | 'ostlandet_vest'    // Oslo, Buskerud, Vestfold, parts of Akershus
  | 'sorlandet'         // Agder (Aust-Agder, Vest-Agder)
  | 'vestlandet'        // Rogaland, Hordaland, Sogn og Fjordane
  | 'midt_norge'        // Trøndelag (Nord-Trøndelag, Sør-Trøndelag)
  | 'nord_norge';       // Nordland, Troms, Finnmark

export const JUNIOR_TOUR_REGION_LABELS: Record<JuniorTourRegion, string> = {
  ostlandet_ost: 'Østlandet Øst',
  ostlandet_vest: 'Østlandet Vest',
  sorlandet: 'Sørlandet',
  vestlandet: 'Vestlandet',
  midt_norge: 'Midt-Norge',
  nord_norge: 'Nord-Norge',
};

export const JUNIOR_TOUR_REGION_DESCRIPTIONS: Record<JuniorTourRegion, string> = {
  ostlandet_ost: 'Østfold, Follo, Romerike Øst',
  ostlandet_vest: 'Oslo, Buskerud, Vestfold, Asker/Bærum',
  sorlandet: 'Aust-Agder, Vest-Agder',
  vestlandet: 'Rogaland, Hordaland, Sogn og Fjordane',
  midt_norge: 'Sør-Trøndelag, Nord-Trøndelag',
  nord_norge: 'Nordland, Troms, Finnmark',
};

/**
 * Map counties/cities to Junior Tour regions
 * Used for automatic region assignment based on tournament location
 */
export const CITY_TO_JUNIOR_REGION: Record<string, JuniorTourRegion> = {
  // Østlandet Øst
  'Fredrikstad': 'ostlandet_ost',
  'Sarpsborg': 'ostlandet_ost',
  'Halden': 'ostlandet_ost',
  'Moss': 'ostlandet_ost',
  'Askim': 'ostlandet_ost',
  'Ski': 'ostlandet_ost',
  'Drøbak': 'ostlandet_ost',
  'Lillestrøm': 'ostlandet_ost',
  'Jessheim': 'ostlandet_ost',
  'Lørenskog': 'ostlandet_ost',

  // Østlandet Vest
  'Oslo': 'ostlandet_vest',
  'Drammen': 'ostlandet_vest',
  'Kongsberg': 'ostlandet_vest',
  'Hønefoss': 'ostlandet_vest',
  'Tønsberg': 'ostlandet_vest',
  'Sandefjord': 'ostlandet_vest',
  'Larvik': 'ostlandet_vest',
  'Horten': 'ostlandet_vest',
  'Asker': 'ostlandet_vest',
  'Sandvika': 'ostlandet_vest',
  'Kløfta': 'ostlandet_vest',

  // Sørlandet
  'Kristiansand': 'sorlandet',
  'Arendal': 'sorlandet',
  'Grimstad': 'sorlandet',
  'Mandal': 'sorlandet',
  'Flekkefjord': 'sorlandet',

  // Vestlandet
  'Stavanger': 'vestlandet',
  'Bergen': 'vestlandet',
  'Haugesund': 'vestlandet',
  'Ålesund': 'vestlandet',
  'Florø': 'vestlandet',

  // Midt-Norge
  'Trondheim': 'midt_norge',
  'Steinkjer': 'midt_norge',
  'Levanger': 'midt_norge',
  'Namsos': 'midt_norge',

  // Nord-Norge
  'Bodø': 'nord_norge',
  'Tromsø': 'nord_norge',
  'Narvik': 'nord_norge',
  'Alta': 'nord_norge',
  'Hammerfest': 'nord_norge',
};

// ============================================================================
// COUNTRY TYPES
// ============================================================================

/**
 * Country labels for filtering
 * ISO 3166-1 alpha-2 codes
 */
export const COUNTRY_LABELS: Record<string, string> = {
  NO: 'Norge',
  SE: 'Sverige',
  DK: 'Danmark',
  FI: 'Finland',
  GB: 'Storbritannia',
  IE: 'Irland',
  US: 'USA',
  ES: 'Spania',
  PT: 'Portugal',
  FR: 'Frankrike',
  DE: 'Tyskland',
  IT: 'Italia',
  NL: 'Nederland',
  BE: 'Belgia',
  CH: 'Sveits',
  AT: 'Østerrike',
  CZ: 'Tsjekkia',
  SK: 'Slovakia',
  ZA: 'Sør-Afrika',
  AE: 'De forente arabiske emirater',
  QA: 'Qatar',
  BH: 'Bahrain',
  CN: 'Kina',
  JP: 'Japan',
  KE: 'Kenya',
};

/**
 * Country groups for quick filtering
 */
export const COUNTRY_GROUPS: Record<string, string[]> = {
  nordic: ['NO', 'SE', 'DK', 'FI'],
  europe: ['NO', 'SE', 'DK', 'FI', 'GB', 'IE', 'ES', 'PT', 'FR', 'DE', 'IT', 'NL', 'BE', 'CH', 'AT', 'CZ', 'SK'],
  worldwide: ['US', 'ZA', 'AE', 'QA', 'BH', 'CN', 'JP', 'KE'],
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

  // Hierarchy classification (from hierarchy document)
  purpose?: TournamentPurpose;  // RESULTAT, UTVIKLING, TRENING
  level?: CompetitionLevel;     // Internasjonal, Nasjonal, Regional, etc.

  // Junior Tour region (for regional filtering)
  juniorTourRegion?: JuniorTourRegion;

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

  // Hierarchy filters (from hierarchy document)
  purposes?: TournamentPurpose[];   // RESULTAT, UTVIKLING, TRENING
  levels?: CompetitionLevel[];      // Internasjonal, Nasjonal, Regional, etc.

  // Junior Tour Region filter (Appendix 2)
  juniorTourRegions?: JuniorTourRegion[];

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
