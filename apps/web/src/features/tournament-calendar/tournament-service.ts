/**
 * AK Golf Academy - Tournament Data Service
 *
 * Handles tournament data fetching from API and provides
 * deterministic seed data when API is unavailable.
 */

import {
  Tournament,
  TourType,
  TournamentStatus,
  TournamentFilters,
  TournamentSort,
  FetchTournamentsParams,
  TournamentsResponse,
  TournamentStats,
  TournamentResult,
} from './types';
import { applyHierarchyMapping, getTourPrestigeScore } from './hierarchy-config';

// ============================================================================
// API CONFIGURATION
// ============================================================================

const API_BASE = '/api/v1';

// ============================================================================
// FETCH TOURNAMENTS FROM API
// ============================================================================

/**
 * Fetch tournaments from API
 * Falls back to seed data if API returns empty or errors
 */
export async function fetchTournaments(
  params: FetchTournamentsParams = {}
): Promise<TournamentsResponse> {
  try {
    const response = await fetch(`${API_BASE}/calendar/tournaments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.tournaments && data.tournaments.length > 0) {
        // Apply hierarchy mapping to each tournament
        const tournaments = data.tournaments.map((t: unknown) =>
          applyHierarchyMapping(t as Omit<Tournament, 'recommendedCategory' | 'recommendedLevelLabel' | 'recommendationConfidence'>)
        );

        // Apply filters and sorting
        const filtered = applyFilters(tournaments, params.filters);
        const sorted = applySorting(filtered, params.sort);

        return {
          tournaments: sorted,
          total: sorted.length,
          page: params.page || 1,
          hasMore: false,
        };
      }
    }
  } catch (error) {
    console.warn('Failed to fetch tournaments from API, using seed data:', error);
  }

  // Fallback to seed data
  const seedTournaments = generateSeedTournaments();
  const filtered = applyFilters(seedTournaments, params.filters);
  const sorted = applySorting(filtered, params.sort);

  return {
    tournaments: sorted,
    total: sorted.length,
    page: params.page || 1,
    hasMore: false,
  };
}

/**
 * Get tournament statistics
 */
export function calculateStats(tournaments: Tournament[]): TournamentStats {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const upcoming = tournaments.filter(t => {
    const startDate = new Date(t.startDate);
    return startDate >= now && t.status !== 'completed';
  }).length;

  const registered = tournaments.filter(t =>
    t.isRegistered || t.status === 'registered'
  ).length;

  const completedThisYear = tournaments.filter(t => {
    const startDate = new Date(t.startDate);
    return (
      t.status === 'completed' &&
      startDate >= yearStart &&
      startDate <= now
    );
  });

  const podiums = completedThisYear.filter(t =>
    t.result && t.result.position <= 3
  ).length;

  return {
    upcoming,
    registered,
    podiums,
    playedThisYear: completedThisYear.length,
  };
}

// ============================================================================
// FILTERING
// ============================================================================

function applyFilters(
  tournaments: Tournament[],
  filters?: TournamentFilters
): Tournament[] {
  if (!filters) return tournaments;

  return tournaments.filter(t => {
    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchable = `${t.name} ${t.venue} ${t.city}`.toLowerCase();
      if (!searchable.includes(query)) return false;
    }

    // Category filter
    if (filters.recommendedCategories?.length) {
      if (!filters.recommendedCategories.includes(t.recommendedCategory)) {
        return false;
      }
    }

    // Tour filter
    if (filters.tours?.length) {
      if (!filters.tours.includes(t.tour)) {
        return false;
      }
    }

    // Status filter
    if (filters.statuses?.length) {
      // Map internal status to filter status
      let effectiveStatus = t.status;
      if (t.isRegistered) effectiveStatus = 'registered';

      if (!filters.statuses.includes(effectiveStatus)) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateRange) {
      const startDate = new Date(t.startDate);
      const now = new Date();

      switch (filters.dateRange) {
        case 'next_30_days': {
          const thirtyDays = new Date(now);
          thirtyDays.setDate(thirtyDays.getDate() + 30);
          if (startDate < now || startDate > thirtyDays) return false;
          break;
        }
        case 'next_90_days': {
          const ninetyDays = new Date(now);
          ninetyDays.setDate(ninetyDays.getDate() + 90);
          if (startDate < now || startDate > ninetyDays) return false;
          break;
        }
        case 'this_season': {
          // Season: March to October
          const seasonStart = new Date(now.getFullYear(), 2, 1);
          const seasonEnd = new Date(now.getFullYear(), 9, 31);
          if (startDate < seasonStart || startDate > seasonEnd) return false;
          break;
        }
        case 'custom': {
          if (filters.customDateStart) {
            const minDate = new Date(filters.customDateStart);
            if (startDate < minDate) return false;
          }
          if (filters.customDateEnd) {
            const maxDate = new Date(filters.customDateEnd);
            if (startDate > maxDate) return false;
          }
          break;
        }
      }
    }

    // Country filter
    if (filters.countries?.length) {
      if (!filters.countries.includes(t.country)) {
        return false;
      }
    }

    return true;
  });
}

// ============================================================================
// SORTING
// ============================================================================

function applySorting(
  tournaments: Tournament[],
  sort?: TournamentSort
): Tournament[] {
  const sortKey = sort?.key || 'date';
  const direction = sort?.direction || 'asc';

  return [...tournaments].sort((a, b) => {
    let comparison = 0;

    switch (sortKey) {
      case 'date':
        comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        break;

      case 'prestige':
        comparison = getTourPrestigeScore(b.tour) - getTourPrestigeScore(a.tour);
        break;

      case 'recommended_fit':
        // Sort by category match (A=1, E=5)
        const categoryOrder = { A: 1, B: 2, C: 3, D: 4, E: 5, udefinert: 6 };
        comparison =
          (categoryOrder[a.recommendedCategory] || 6) -
          (categoryOrder[b.recommendedCategory] || 6);
        break;

      default:
        comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }

    return direction === 'desc' ? -comparison : comparison;
  });
}

// ============================================================================
// SEED DATA GENERATION
// ============================================================================

/**
 * Generate deterministic seed tournaments for development/testing
 * Stable based on anchor date (today) for QA consistency
 */
export function generateSeedTournaments(): Tournament[] {
  const today = new Date();
  const year = today.getFullYear();

  // Helper to create dates relative to today
  const daysFromNow = (days: number): string => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const daysBefore = (days: number): string => {
    const date = new Date(today);
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  const baseTournaments: Omit<Tournament, 'recommendedCategory' | 'recommendedLevelLabel' | 'recommendationConfidence'>[] = [
    // Junior Tour Regional - 2 tournaments
    {
      id: 'seed-jtr-1',
      name: 'Junior Tour Regional - Østfold',
      startDate: daysFromNow(14),
      endDate: daysFromNow(14),
      venue: 'Gamle Fredrikstad GK',
      city: 'Fredrikstad',
      country: 'NO',
      tour: 'junior_tour_regional',
      status: 'registration_open',
      maxParticipants: 60,
      currentParticipants: 34,
      entryFee: 350,
      format: '18 hull slagspill',
      registrationUrl: 'https://mingolf.no/tournament/jtr-ostfold',
    },
    {
      id: 'seed-jtr-2',
      name: 'Junior Tour Regional - Oslo',
      startDate: daysFromNow(45),
      endDate: daysFromNow(45),
      venue: 'Oslo Golfklubb',
      city: 'Oslo',
      country: 'NO',
      tour: 'junior_tour_regional',
      status: 'upcoming',
      maxParticipants: 80,
      currentParticipants: 0,
      entryFee: 350,
      format: '18 hull slagspill',
    },

    // Srixon Tour
    {
      id: 'seed-srixon-1',
      name: 'Srixon Tour - Runde 4',
      startDate: daysFromNow(21),
      endDate: daysFromNow(22),
      venue: 'Holtsmark GK',
      city: 'Drammen',
      country: 'NO',
      tour: 'srixon_tour',
      status: 'registration_open',
      maxParticipants: 100,
      currentParticipants: 67,
      entryFee: 550,
      format: '36 hull slagspill',
      registrationUrl: 'https://mingolf.no/tournament/srixon-r4',
    },

    // Garmin Norges Cup
    {
      id: 'seed-gnc-1',
      name: 'Garmin Norges Cup - Finale',
      startDate: daysFromNow(60),
      endDate: daysFromNow(62),
      venue: 'Miklagard Golf',
      city: 'Kløfta',
      country: 'NO',
      tour: 'garmin_norges_cup',
      status: 'registration_open',
      maxParticipants: 120,
      currentParticipants: 89,
      entryFee: 850,
      format: '54 hull slagspill',
      registrationUrl: 'https://mingolf.no/tournament/gnc-finale',
      hotelUrl: 'https://booking.com/miklagard',
    },

    // Global Junior Tour
    {
      id: 'seed-gjt-1',
      name: 'Global Junior Tour - Norway Open',
      startDate: daysFromNow(75),
      endDate: daysFromNow(77),
      venue: 'Borre Golfklubb',
      city: 'Horten',
      country: 'NO',
      tour: 'global_junior_tour',
      status: 'upcoming',
      maxParticipants: 80,
      currentParticipants: 12,
      entryFee: 1200,
      format: '54 hull slagspill',
    },

    // Nordic League
    {
      id: 'seed-nl-1',
      name: 'Nordic League - Round 2',
      startDate: daysFromNow(35),
      endDate: daysFromNow(37),
      venue: 'Rungsted Golf Klub',
      city: 'København',
      country: 'DK',
      tour: 'nordic_league',
      status: 'registration_open',
      maxParticipants: 100,
      currentParticipants: 78,
      entryFee: 1500,
      format: '54 hull slagspill',
      hotelUrl: 'https://booking.com/copenhagen',
    },

    // EGA Turnering
    {
      id: 'seed-ega-1',
      name: 'European Amateur Championship',
      startDate: daysFromNow(90),
      endDate: daysFromNow(93),
      venue: 'Royal Portrush',
      city: 'Portrush',
      country: 'GB',
      tour: 'ega_turnering',
      status: 'upcoming',
      maxParticipants: 144,
      currentParticipants: 45,
      entryFee: 2500,
      format: '72 hull slagspill',
    },

    // WAGR Turnering
    {
      id: 'seed-wagr-1',
      name: 'Scandinavian Amateur',
      startDate: daysFromNow(50),
      endDate: daysFromNow(53),
      venue: 'Vasatorps GK',
      city: 'Helsingborg',
      country: 'SE',
      tour: 'wagr_turnering',
      status: 'registration_open',
      maxParticipants: 120,
      currentParticipants: 98,
      entryFee: 1800,
      format: '72 hull slagspill',
      hotelUrl: 'https://booking.com/helsingborg',
    },

    // College Turneringer
    {
      id: 'seed-college-1',
      name: 'NCAA Division I Championship Qualifier',
      startDate: daysFromNow(120),
      endDate: daysFromNow(122),
      venue: 'TPC Sawgrass',
      city: 'Jacksonville, FL',
      country: 'US',
      tour: 'college_turneringer',
      status: 'upcoming',
      maxParticipants: 60,
      currentParticipants: 0,
      entryFee: 3000,
      format: '54 hull slagspill',
    },

    // Challenge Tour (example - usually not accessible to juniors)
    {
      id: 'seed-ct-1',
      name: 'Challenge Tour - Norwegian Open',
      startDate: daysFromNow(100),
      endDate: daysFromNow(103),
      venue: 'Oslo Golfklubb',
      city: 'Oslo',
      country: 'NO',
      tour: 'challenge_tour',
      status: 'upcoming',
      maxParticipants: 156,
      currentParticipants: 120,
      entryFee: 5000,
      format: '72 hull slagspill',
    },

    // Club Tournament (registered)
    {
      id: 'seed-club-1',
      name: 'AK Golf Academy Cup',
      startDate: daysFromNow(7),
      endDate: daysFromNow(7),
      venue: 'Miklagard Golf',
      city: 'Kløfta',
      country: 'NO',
      tour: 'academy',
      status: 'registered',
      isRegistered: true,
      maxParticipants: 60,
      currentParticipants: 45,
      entryFee: 350,
      format: '18 hull stableford',
      description: 'Intern turnering for AK Golf Academy medlemmer.',
    },

    // Full tournament
    {
      id: 'seed-full-1',
      name: 'NM Junior 2025',
      startDate: daysFromNow(28),
      endDate: daysFromNow(30),
      venue: 'Oslo Golfklubb',
      city: 'Oslo',
      country: 'NO',
      tour: 'garmin_norges_cup',
      status: 'full',
      maxParticipants: 120,
      currentParticipants: 120,
      entryFee: 850,
      format: '54 hull slagspill',
      description: 'Norgesmesterskap for juniorer. Kvalifisering til Nordisk Mesterskap.',
    },

    // DP World Tour (spectator interest)
    {
      id: 'seed-dpwt-1',
      name: 'Made in HimmerLand',
      startDate: daysFromNow(85),
      endDate: daysFromNow(88),
      venue: 'Himmerland Golf & Spa',
      city: 'Farsø',
      country: 'DK',
      tour: 'dp_world_tour',
      status: 'upcoming',
      maxParticipants: 156,
      currentParticipants: 156,
      entryFee: 0, // Pro tournament
      format: '72 hull slagspill',
    },

    // Past tournament with result (podium)
    {
      id: 'seed-past-1',
      name: 'Vårturneringen 2025',
      startDate: daysBefore(45),
      endDate: daysBefore(45),
      venue: 'Holtsmark GK',
      city: 'Drammen',
      country: 'NO',
      tour: 'club',
      status: 'completed',
      maxParticipants: 50,
      currentParticipants: 42,
      entryFee: 400,
      format: '18 hull slagspill',
      result: {
        position: 3,
        score: 74,
        scoreToPar: 2,
        field: 42,
      },
    },

    // Past tournament with result
    {
      id: 'seed-past-2',
      name: 'NGF Tour - Runde 1',
      startDate: daysBefore(60),
      endDate: daysBefore(59),
      venue: 'Drammens GK',
      city: 'Drammen',
      country: 'NO',
      tour: 'srixon_tour',
      status: 'completed',
      maxParticipants: 80,
      currentParticipants: 78,
      entryFee: 550,
      format: '36 hull slagspill',
      result: {
        position: 12,
        score: 148,
        scoreToPar: 4,
        field: 78,
        rounds: [73, 75],
      },
    },

    // Past tournament with result (win)
    {
      id: 'seed-past-3',
      name: 'Sesongåpning',
      startDate: daysBefore(90),
      endDate: daysBefore(90),
      venue: 'Tyrifjord GK',
      city: 'Vikersund',
      country: 'NO',
      tour: 'club',
      status: 'completed',
      maxParticipants: 40,
      currentParticipants: 35,
      entryFee: 300,
      format: '18 hull slagspill',
      result: {
        position: 1,
        score: 71,
        scoreToPar: -1,
        field: 35,
      },
    },
  ];

  // Apply hierarchy mapping to all tournaments
  return baseTournaments.map(t => applyHierarchyMapping(t));
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get unique countries from tournament list
 */
export function getAvailableCountries(tournaments: Tournament[]): string[] {
  const countries = new Set(tournaments.map(t => t.country));
  return Array.from(countries).sort();
}

/**
 * Get unique tours from tournament list
 */
export function getAvailableTours(tournaments: Tournament[]): TourType[] {
  const tours = new Set(tournaments.map(t => t.tour));
  return Array.from(tours) as TourType[];
}

/**
 * Group tournaments by time period
 */
export function groupTournamentsByPeriod(tournaments: Tournament[]): {
  upcoming: Tournament[];
  past: Tournament[];
} {
  const now = new Date();

  return {
    upcoming: tournaments.filter(t => {
      const startDate = new Date(t.startDate);
      return startDate >= now || t.status === 'in_progress';
    }),
    past: tournaments.filter(t => {
      const startDate = new Date(t.startDate);
      return startDate < now && t.status === 'completed';
    }),
  };
}
