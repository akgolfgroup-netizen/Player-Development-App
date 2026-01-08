// @ts-nocheck
/**
 * TIER Golf Academy - Tournament Calendar Page
 *
 * Main tournament discovery and planning surface.
 * List-first design with robust filtering.
 *
 * Design System: TIER Golf Premium Light
 * - Semantic tokens only (no raw hex)
 * - Gold reserved for earned achievements only
 *
 * Refactored to use modular components for better maintainability.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { tournamentsAPI } from '../../services/api';
import { useToast } from '../../components/shadcn/use-toast';
import Button from '../../ui/primitives/Button';
import StateCard from '../../ui/composites/StateCard';
import {
  Tournament,
  TournamentFilters,
  QuickFilter,
  PlayerCategory,
} from './types';
import {
  fetchTournaments,
  calculateStats,
  groupTournamentsByPeriod,
} from './tournament-service';
import TournamentDetailsPanel from './TournamentDetailsPanel';

// Modular components
import {
  CalendarHeader,
  QuickFilterTabs,
  SearchBar,
  FilterDrawer,
  TournamentList,
} from './components';

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook for managing filter state with URL persistence
 */
function useFilterState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: TournamentFilters = useMemo(() => ({
    searchQuery: searchParams.get('q') || undefined,
    tours: searchParams.getAll('tour') as any[] || undefined,
    statuses: searchParams.getAll('status') as any[] || undefined,
    recommendedCategories: searchParams.getAll('category') as PlayerCategory[] || undefined,
    purposes: searchParams.getAll('purpose') as any[] || undefined,
    levels: searchParams.getAll('level') as any[] || undefined,
    juniorTourRegions: searchParams.getAll('region') as any[] || undefined,
    dateRange: (searchParams.get('dateRange') as TournamentFilters['dateRange']) || undefined,
    countries: searchParams.getAll('country') || undefined,
  }), [searchParams]);

  const setFilters = useCallback((newFilters: TournamentFilters) => {
    const params = new URLSearchParams();

    if (newFilters.searchQuery) params.set('q', newFilters.searchQuery);
    newFilters.tours?.forEach(t => params.append('tour', t));
    newFilters.statuses?.forEach(s => params.append('status', s));
    newFilters.recommendedCategories?.forEach(c => params.append('category', c));
    newFilters.purposes?.forEach(p => params.append('purpose', p));
    newFilters.levels?.forEach(l => params.append('level', l));
    newFilters.juniorTourRegions?.forEach(r => params.append('region', r));
    if (newFilters.dateRange) params.set('dateRange', newFilters.dateRange);
    newFilters.countries?.forEach(c => params.append('country', c));

    setSearchParams(params);
  }, [setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return { filters, setFilters, clearFilters };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TournamentCalendarPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { filters, setFilters, clearFilters } = useFilterState();
  const { toast } = useToast();

  // State
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<QuickFilter>('alle');
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Get player category from user context (defaults to 'C' for intermediate)
  const playerCategory: PlayerCategory = (user?.category as PlayerCategory) || 'C';

  // Fetch tournaments
  useEffect(() => {
    const loadTournaments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchTournaments({ filters });
        setTournaments(response.tournaments);
      } catch (err) {
        setError('Kunne ikke laste turneringer. Prøv igjen.');
        console.error('Failed to load tournaments:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTournaments();
  }, [filters]);

  // Update search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ ...filters, searchQuery: searchQuery || undefined });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Apply tab filter
  const filteredByTab = useMemo(() => {
    return tournaments.filter(t => {
      switch (activeTab) {
        case 'mine':
          return t.isRegistered || t.status === 'open';
        case 'junior':
          return ['junior_tour_regional', 'global_junior_tour'].includes(t.tour);
        case 'elite':
          return ['pga_tour', 'dp_world_tour', 'challenge_tour', 'wagr_turnering', 'ega_turnering', 'nordic_league'].includes(t.tour);
        case 'åpen':
          return ['club', 'academy', 'srixon_tour', 'garmin_norges_cup'].includes(t.tour);
        default:
          return true;
      }
    });
  }, [tournaments, activeTab]);

  // Group by period
  const { upcoming, past } = useMemo(
    () => groupTournamentsByPeriod(filteredByTab),
    [filteredByTab]
  );

  // Calculate stats
  const stats = useMemo(() => calculateStats(tournaments), [tournaments]);

  // Check for active filters
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.tours?.length ||
      filters.statuses?.length ||
      filters.recommendedCategories?.length ||
      filters.purposes?.length ||
      filters.levels?.length ||
      filters.juniorTourRegions?.length ||
      filters.dateRange ||
      filters.countries?.length
    );
  }, [filters]);

  // Handlers
  const handleRegister = (tournament: Tournament) => {
    if (tournament.registrationUrl) {
      window.open(tournament.registrationUrl, '_blank');
    }
  };

  const handleAddToCalendar = async (tournament: Tournament) => {
    try {
      await tournamentsAPI.addToCalendar(tournament.id, {
        name: tournament.name,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        venue: tournament.venue,
        city: tournament.city,
        country: tournament.country,
        tour: tournament.tour,
        format: tournament.format,
        entryFee: tournament.entryFee,
        registrationUrl: tournament.registrationUrl,
      });
      toast({
        title: 'Lagt til i kalenderen',
        description: `"${tournament.name}" er nå i kalenderen din`,
      });
    } catch (error) {
      console.error('Failed to add tournament to calendar:', error);
      toast({
        title: 'Kunne ikke legge til',
        description: 'Kunne ikke legge til turneringen i kalenderen. Prøv igjen.',
        variant: 'destructive',
      });
    }
  };

  // Handle school absence request
  const handleAbsenceRequest = (tournament: Tournament) => {
    navigate('/skoleplan', {
      state: {
        tournamentAbsence: {
          name: tournament.name,
          startDate: tournament.startDate,
          endDate: tournament.endDate,
          venue: tournament.venue,
        },
      },
    });
  };

  // Handle adding tournament to planner (PLANLEGG)
  const handlePlanTournament = (tournament: Tournament) => {
    const LOCAL_STORAGE_KEY = 'tier_golf_tournament_plan';
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    let existingPlan: Array<{tournament: Tournament; purpose: string; addedAt: string}> = [];

    if (saved) {
      try {
        existingPlan = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse tournament plan:', e);
      }
    }

    // Check if already in plan
    const alreadyPlanned = existingPlan.some(p => p.tournament.id === tournament.id);
    if (alreadyPlanned) {
      navigate('/turneringer/planlegger');
      return;
    }

    // Add to plan with default purpose based on hierarchy
    const newEntry = {
      tournament,
      purpose: tournament.purpose || 'UTVIKLING',
      notes: '',
      addedAt: new Date().toISOString(),
    };

    existingPlan.push(newEntry);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existingPlan));
    navigate('/turneringer/planlegger');
  };

  // Render loading state
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <StateCard variant="loading" title="Laster turneringer..." />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div style={styles.loadingContainer}>
        <StateCard
          variant="error"
          title="Kunne ikke laste turneringer"
          description={error}
          action={
            <Button variant="primary" onClick={() => window.location.reload()}>
              Prøv igjen
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <div style={styles.container}>
        {/* Stats Header */}
        <CalendarHeader stats={stats} />

        {/* Quick Filter Tabs */}
        <QuickFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={() => setShowFilterPanel(true)}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Tournament List */}
        <TournamentList
          upcoming={upcoming}
          past={past}
          playerCategory={playerCategory}
          onSelect={setSelectedTournament}
          onRegister={handleRegister}
          onAddToCalendar={handleAddToCalendar}
          onPlanTournament={handlePlanTournament}
          onAbsenceRequest={handleAbsenceRequest}
        />
      </div>

      {/* Filter Drawer */}
      {showFilterPanel && (
        <FilterDrawer
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilterPanel(false)}
          onClear={clearFilters}
        />
      )}

      {/* Details Panel */}
      {selectedTournament && (
        <TournamentDetailsPanel
          tournament={selectedTournament}
          playerCategory={playerCategory}
          onClose={() => setSelectedTournament(null)}
          onRegister={handleRegister}
          onAddToCalendar={handleAddToCalendar}
        />
      )}
    </>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  },
};
