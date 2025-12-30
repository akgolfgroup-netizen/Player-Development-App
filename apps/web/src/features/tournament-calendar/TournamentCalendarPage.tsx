/**
 * AK Golf Academy - Tournament Calendar Page
 *
 * Main tournament discovery and planning surface.
 * List-first design with robust filtering.
 *
 * Design System: AK Golf Premium Light
 * - Semantic tokens only (no raw hex)
 * - Gold reserved for earned achievements only
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Clock,
  Search,
  Medal,
  Flag,
  Star,
  ChevronRight,
  ExternalLink,
  Hotel,
  FileText,
  Plus,
  X,
  Filter,
  CalendarPlus,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Button from '../../ui/primitives/Button';
import Badge from '../../ui/primitives/Badge.primitive';
import StateCard from '../../ui/composites/StateCard';
import {
  Tournament,
  TournamentFilters,
  TournamentSort,
  TournamentStats,
  TournamentTab,
  TourType,
  TournamentStatus,
  PlayerCategory,
  TOUR_LABELS,
  STATUS_LABELS,
  CATEGORY_LABELS,
} from './types';
import {
  fetchTournaments,
  calculateStats,
  groupTournamentsByPeriod,
} from './tournament-service';
import {
  getCategoryBadgeConfig,
  isTournamentRecommendedForPlayer,
} from './hierarchy-config';
import TournamentDetailsPanel from './TournamentDetailsPanel';

// ============================================================================
// CONSTANTS
// ============================================================================

const TABS: { key: TournamentTab; label: string }[] = [
  { key: 'alle', label: 'Alle' },
  { key: 'mine_turneringer', label: 'Mine turneringer' },
  { key: 'junior', label: 'Junior' },
  { key: 'elite', label: 'Elite' },
  { key: 'open', label: 'Åpen' },
];

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
    tours: searchParams.getAll('tour') as TourType[] || undefined,
    statuses: searchParams.getAll('status') as TournamentStatus[] || undefined,
    recommendedCategories: searchParams.getAll('category') as PlayerCategory[] || undefined,
    dateRange: (searchParams.get('dateRange') as TournamentFilters['dateRange']) || undefined,
    countries: searchParams.getAll('country') || undefined,
  }), [searchParams]);

  const setFilters = useCallback((newFilters: TournamentFilters) => {
    const params = new URLSearchParams();

    if (newFilters.searchQuery) params.set('q', newFilters.searchQuery);
    newFilters.tours?.forEach(t => params.append('tour', t));
    newFilters.statuses?.forEach(s => params.append('status', s));
    newFilters.recommendedCategories?.forEach(c => params.append('category', c));
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
// HELPER FUNCTIONS
// ============================================================================

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
}

function formatDateRange(start: string, end: string): string {
  if (start === end) return formatDate(start);
  return `${formatDate(start)} - ${formatDate(end)}`;
}

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getTourIcon(tour: TourType) {
  switch (tour) {
    case 'pga_tour':
    case 'dp_world_tour':
    case 'challenge_tour':
      return Star;
    case 'wagr_turnering':
    case 'ega_turnering':
      return Medal;
    case 'nordic_league':
    case 'global_junior_tour':
      return Flag;
    default:
      return Trophy;
  }
}

function getStatusConfig(status: TournamentStatus, isRegistered?: boolean): {
  label: string;
  variant: 'success' | 'error' | 'neutral' | 'accent' | 'warning';
} {
  if (isRegistered) {
    return { label: 'Påmeldt', variant: 'success' };
  }

  switch (status) {
    case 'registration_open':
      return { label: 'Åpen for påmelding', variant: 'accent' };
    case 'full':
      return { label: 'Fullt', variant: 'error' };
    case 'registered':
      return { label: 'Påmeldt', variant: 'success' };
    case 'upcoming':
      return { label: 'Kommer snart', variant: 'neutral' };
    case 'in_progress':
      return { label: 'Pågår', variant: 'warning' };
    case 'completed':
      return { label: 'Avsluttet', variant: 'neutral' };
    default:
      return { label: STATUS_LABELS[status] || status, variant: 'neutral' };
  }
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Stats row component
 */
function StatsRow({ stats }: { stats: TournamentStats }) {
  return (
    <div style={styles.statsRow}>
      <div style={styles.statCard}>
        <div style={styles.statValue}>{stats.upcoming}</div>
        <div style={styles.statLabel}>Kommende</div>
      </div>
      <div style={styles.statCard}>
        <div style={{ ...styles.statValue, color: 'var(--success)' }}>
          {stats.registered}
        </div>
        <div style={styles.statLabel}>Påmeldt</div>
      </div>
      <div style={styles.statCard}>
        <div style={{ ...styles.statValue, color: 'var(--accent)' }}>
          {stats.podiums}
        </div>
        <div style={styles.statLabel}>Pallplasser</div>
      </div>
      <div style={styles.statCard}>
        <div style={styles.statValue}>{stats.playedThisYear}</div>
        <div style={styles.statLabel}>Spilt i år</div>
      </div>
    </div>
  );
}

/**
 * Tab bar component
 */
function TabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: TournamentTab;
  onTabChange: (tab: TournamentTab) => void;
}) {
  return (
    <div style={styles.tabBar}>
      {TABS.map(tab => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          style={{
            ...styles.tabButton,
            ...(activeTab === tab.key ? styles.tabButtonActive : {}),
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Search and filter bar
 */
function FilterBar({
  searchQuery,
  onSearchChange,
  onFilterClick,
  hasActiveFilters,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <div style={styles.filterBar}>
      <div style={styles.searchContainer}>
        <Search size={18} color="var(--text-tertiary)" />
        <input
          type="text"
          placeholder="Søk turnering, bane eller by..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          style={styles.searchInput}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            style={styles.clearButton}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <Button
        variant={hasActiveFilters ? 'primary' : 'ghost'}
        size="sm"
        leftIcon={<Filter size={16} />}
        onClick={onFilterClick}
      >
        Filter
        {hasActiveFilters && (
          <span style={styles.filterBadge}>!</span>
        )}
      </Button>
    </div>
  );
}

/**
 * Tournament card component
 */
function TournamentCard({
  tournament,
  playerCategory,
  onSelect,
  onRegister,
  onAddToCalendar,
}: {
  tournament: Tournament;
  playerCategory?: PlayerCategory;
  onSelect: (t: Tournament) => void;
  onRegister: (t: Tournament) => void;
  onAddToCalendar: (t: Tournament) => void;
}) {
  const daysUntil = getDaysUntil(tournament.startDate);
  const statusConfig = getStatusConfig(tournament.status, tournament.isRegistered);
  const TourIcon = getTourIcon(tournament.tour);
  const isRecommended = playerCategory
    ? isTournamentRecommendedForPlayer(tournament, playerCategory)
    : false;
  const categoryBadgeConfig = getCategoryBadgeConfig(
    tournament.recommendedCategory,
    isRecommended
  );

  const showRegisterButton =
    tournament.status === 'registration_open' && !tournament.isRegistered;
  const showQuickActions = tournament.isRegistered;

  return (
    <div
      onClick={() => onSelect(tournament)}
      style={{
        ...styles.card,
        border: tournament.isRegistered
          ? '2px solid var(--success)'
          : isRecommended
          ? '2px solid var(--accent)'
          : '1px solid var(--border-default)',
      }}
    >
      {/* Header */}
      <div style={styles.cardHeader}>
        <div style={styles.cardHeaderLeft}>
          <div style={styles.tourIconContainer}>
            <TourIcon size={22} color="var(--text-secondary)" />
          </div>
          <div>
            <h3 style={styles.cardTitle}>{tournament.name}</h3>
            <div style={styles.badgeRow}>
              <span
                style={{
                  ...styles.categoryBadge,
                  backgroundColor: `var(--${categoryBadgeConfig.bgClass.replace('bg-', '')}, var(--gray-100))`,
                  color: `var(--${categoryBadgeConfig.textClass.replace('text-', '')}, var(--text-secondary))`,
                }}
              >
                {CATEGORY_LABELS[tournament.recommendedCategory]}
              </span>
              <Badge
                variant={statusConfig.variant}
                size="sm"
              >
                {statusConfig.label}
              </Badge>
            </div>
          </div>
        </div>

        {daysUntil >= 0 && daysUntil <= 14 && (
          <div style={styles.daysUntilBadge}>
            {daysUntil === 0 ? 'I dag!' : `Om ${daysUntil} d`}
          </div>
        )}
      </div>

      {/* Details */}
      <div style={styles.cardDetails}>
        <div style={styles.detailItem}>
          <Calendar size={14} color="var(--text-tertiary)" />
          <span>{formatDateRange(tournament.startDate, tournament.endDate)}</span>
        </div>
        <div style={styles.detailItem}>
          <MapPin size={14} color="var(--text-tertiary)" />
          <span>{tournament.venue}, {tournament.city}</span>
        </div>
        <div style={styles.detailItem}>
          <Users size={14} color="var(--text-tertiary)" />
          <span>
            {tournament.currentParticipants ?? 0}/{tournament.maxParticipants ?? '∞'} påmeldte
          </span>
        </div>
        {tournament.format && (
          <div style={styles.detailItem}>
            <Flag size={14} color="var(--text-tertiary)" />
            <span>{tournament.format}</span>
          </div>
        )}
      </div>

      {/* Quick Actions (for registered tournaments) */}
      {showQuickActions && (
        <div style={styles.quickActions}>
          {tournament.hotelUrl && (
            <button
              onClick={e => {
                e.stopPropagation();
                window.open(tournament.hotelUrl, '_blank');
              }}
              style={styles.quickActionButton}
            >
              <Hotel size={12} />
              Bestill hotell
            </button>
          )}
          <button
            onClick={e => {
              e.stopPropagation();
              // TODO: Integrate with school absence system
            }}
            style={styles.quickActionButton}
          >
            <FileText size={12} />
            Søk idrettsfravær
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onAddToCalendar(tournament);
            }}
            style={styles.quickActionButtonDashed}
          >
            <Plus size={12} />
            Legg til
          </button>
        </div>
      )}

      {/* Footer */}
      <div style={styles.cardFooter}>
        <div>
          <span style={styles.feeLabel}>Startavgift</span>
          <div style={styles.feeValue}>
            {tournament.entryFee === 0 ? 'Gratis' : `${tournament.entryFee} kr`}
          </div>
        </div>
        <div style={styles.cardActions}>
          {showRegisterButton && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ExternalLink size={14} />}
              onClick={e => {
                e.stopPropagation();
                onRegister(tournament);
              }}
            >
              Meld på
            </Button>
          )}
          <button
            onClick={e => {
              e.stopPropagation();
              onSelect(tournament);
            }}
            style={styles.detailsLink}
          >
            Se detaljer
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Past tournament result card
 */
function PastTournamentCard({ tournament }: { tournament: Tournament }) {
  if (!tournament.result) return null;

  const isTopThree = tournament.result.position <= 3;

  return (
    <div style={styles.pastCard}>
      <div style={styles.pastCardPosition}>
        {isTopThree ? (
          <Medal size={20} color="var(--achievement)" />
        ) : (
          <span style={styles.positionNumber}>{tournament.result.position}</span>
        )}
      </div>
      <div style={styles.pastCardInfo}>
        <div style={styles.pastCardName}>{tournament.name}</div>
        <div style={styles.pastCardMeta}>
          {formatDate(tournament.startDate)} · {tournament.venue}
        </div>
      </div>
      <div style={styles.pastCardResult}>
        <div style={styles.pastCardResultPosition}>
          {tournament.result.position}. plass
        </div>
        <div style={styles.pastCardResultScore}>
          Score: {tournament.result.score} · {tournament.result.field} deltakere
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TournamentCalendarPage() {
  const navigate = useNavigate();
  const { filters, setFilters, clearFilters } = useFilterState();

  // State
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TournamentTab>('alle');
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Player category (would come from user context in production)
  const playerCategory: PlayerCategory = 'C';

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
        case 'mine_turneringer':
          return t.isRegistered || t.status === 'registered';
        case 'junior':
          return ['junior_tour_regional', 'global_junior_tour'].includes(t.tour);
        case 'elite':
          return ['pga_tour', 'dp_world_tour', 'challenge_tour', 'wagr_turnering', 'ega_turnering', 'nordic_league'].includes(t.tour);
        case 'open':
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
    // TODO: Integrate with calendar API
    // For now, show a confirmation
    alert(`"${tournament.name}" lagt til i kalenderen!`);
  };

  // Render loading state
  if (loading) {
    return (
      <AppShell title="Turneringskalender" subtitle="Laster turneringer..." actions={null}>
        <div style={styles.loadingContainer}>
          <StateCard variant="loading" title="Laster turneringer..." />
        </div>
      </AppShell>
    );
  }

  // Render error state
  if (error) {
    return (
      <AppShell title="Turneringskalender" subtitle="Noe gikk galt" actions={null}>
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
      </AppShell>
    );
  }

  return (
    <AppShell title="Turneringskalender" subtitle="Kommende turneringer" actions={null}>
      <div style={styles.container}>
        {/* Stats */}
        <StatsRow stats={stats} />

        {/* Tabs */}
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={() => setShowFilterPanel(true)}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Upcoming Tournaments */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Kommende turneringer</h2>

          {upcoming.length === 0 ? (
            <StateCard
              variant="empty"
              icon={Trophy}
              title="Ingen kommende turneringer"
              description="Prøv å endre filter eller søkekriterier"
            />
          ) : (
            <div style={styles.cardGrid}>
              {upcoming.map(tournament => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  playerCategory={playerCategory}
                  onSelect={setSelectedTournament}
                  onRegister={handleRegister}
                  onAddToCalendar={handleAddToCalendar}
                />
              ))}
            </div>
          )}
        </section>

        {/* Past Tournaments */}
        {past.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tidligere resultater</h2>
            <div style={styles.pastList}>
              {past.map(tournament => (
                <PastTournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          </section>
        )}
      </div>

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
    </AppShell>
  );
}

// ============================================================================
// STYLES (using CSS variables for token discipline)
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

  // Stats
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 'var(--spacing-3)',
  },

  statCard: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-4)',
    textAlign: 'center' as const,
    border: '1px solid var(--border-subtle)',
  },

  statValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1.2,
  },

  statLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: 'var(--spacing-1)',
  },

  // Tabs
  tabBar: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    overflowX: 'auto' as const,
    paddingBottom: 'var(--spacing-1)',
  },

  tabButton: {
    padding: '8px 16px',
    borderRadius: 'var(--radius-full)',
    border: 'none',
    backgroundColor: 'var(--background-white)',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    transition: 'all 0.2s ease',
  },

  tabButtonActive: {
    backgroundColor: 'var(--accent)',
    color: 'var(--text-inverse)',
    boxShadow: 'none',
  },

  // Filter bar
  filterBar: {
    display: 'flex',
    gap: 'var(--spacing-3)',
    alignItems: 'center',
  },

  searchContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 14px',
    border: '1px solid var(--border-default)',
  },

  searchInput: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    color: 'var(--text-primary)',
    outline: 'none',
  },

  clearButton: {
    padding: '4px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
  },

  filterBadge: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--error)',
    marginLeft: '4px',
  },

  // Sections
  section: {
    marginTop: 'var(--spacing-4)',
  },

  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: '0 0 var(--spacing-4) 0',
  },

  // Cards
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: 'var(--spacing-4)',
  },

  card: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-5)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },

  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 'var(--spacing-4)',
  },

  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3)',
  },

  tourIconContainer: {
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--background-elevated)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
    lineHeight: 1.3,
  },

  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    marginTop: 'var(--spacing-2)',
    flexWrap: 'wrap' as const,
  },

  categoryBadge: {
    fontSize: '11px',
    fontWeight: 500,
    padding: '3px 8px',
    borderRadius: 'var(--radius-sm)',
  },

  daysUntilBadge: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--accent)',
    backgroundColor: 'var(--accent-muted)',
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
    whiteSpace: 'nowrap' as const,
  },

  cardDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--spacing-2)',
    marginBottom: 'var(--spacing-4)',
  },

  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    fontSize: '14px',
    color: 'var(--text-primary)',
  },

  quickActions: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    marginBottom: 'var(--spacing-4)',
    flexWrap: 'wrap' as const,
  },

  quickActionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-default)',
    backgroundColor: 'var(--background-surface)',
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  quickActionButtonDashed: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 10px',
    borderRadius: 'var(--radius-sm)',
    border: '1px dashed var(--border-default)',
    backgroundColor: 'transparent',
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 'var(--spacing-3)',
    borderTop: '1px solid var(--border-subtle)',
  },

  feeLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },

  feeValue: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },

  cardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },

  detailsLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: 'var(--accent)',
    fontSize: '14px',
    fontWeight: 500,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },

  // Past tournaments
  pastList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--spacing-2)',
  },

  pastCard: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-4)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-4)',
    border: '1px solid var(--border-subtle)',
  },

  pastCardPosition: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--background-elevated)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  positionNumber: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },

  pastCardInfo: {
    flex: 1,
  },

  pastCardName: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },

  pastCardMeta: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },

  pastCardResult: {
    textAlign: 'right' as const,
  },

  pastCardResultPosition: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },

  pastCardResultScore: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
};
