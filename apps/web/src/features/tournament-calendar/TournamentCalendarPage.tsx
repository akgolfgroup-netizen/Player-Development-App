// @ts-nocheck
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
import { useAuth } from '../../contexts/AuthContext';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
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
  CheckCircle,
  Target,
} from 'lucide-react';
// Layout handled by parent route - no AppShell needed
import Button from '../../ui/primitives/Button';
import Badge from '../../ui/primitives/Badge.primitive';
import StateCard from '../../ui/composites/StateCard';
import { SectionTitle, SubSectionTitle, CardTitle } from '../../components/typography';
import {
  Tournament,
  TournamentFilters,
  TournamentStats,
  TournamentTab,
  TourType,
  TournamentStatus,
  PlayerCategory,
  TournamentPurpose,
  CompetitionLevel,
  JuniorTourRegion,
  TOUR_LABELS,
  STATUS_LABELS,
  CATEGORY_LABELS,
  COUNTRY_LABELS,
  COUNTRY_GROUPS,
  PURPOSE_LABELS,
  PURPOSE_DESCRIPTIONS,
  LEVEL_LABELS,
  JUNIOR_TOUR_REGION_LABELS,
  JUNIOR_TOUR_REGION_DESCRIPTIONS,
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
    purposes: searchParams.getAll('purpose') as TournamentPurpose[] || undefined,
    levels: searchParams.getAll('level') as CompetitionLevel[] || undefined,
    juniorTourRegions: searchParams.getAll('region') as JuniorTourRegion[] || undefined,
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
  onPlanTournament,
}: {
  tournament: Tournament;
  playerCategory?: PlayerCategory;
  onSelect: (t: Tournament) => void;
  onRegister: (t: Tournament) => void;
  onAddToCalendar: (t: Tournament) => void;
  onPlanTournament: (t: Tournament) => void;
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
            <SubSectionTitle style={styles.cardTitle}>{tournament.name}</SubSectionTitle>
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
          {/* PLANLEGG action - add to tournament plan */}
          <button
            onClick={e => {
              e.stopPropagation();
              onPlanTournament(tournament);
            }}
            style={styles.planButton}
            title="Legg til i turneringsplan"
          >
            <Target size={14} />
            Planlegg
          </button>
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
 * Filter Panel component
 */
function FilterPanel({
  filters,
  onFiltersChange,
  onClose,
  onClear,
}: {
  filters: TournamentFilters;
  onFiltersChange: (filters: TournamentFilters) => void;
  onClose: () => void;
  onClear: () => void;
}) {
  const [localFilters, setLocalFilters] = useState<TournamentFilters>(filters);

  const toggleArrayFilter = <T extends string>(
    key: keyof TournamentFilters,
    value: T
  ) => {
    const current = (localFilters[key] as T[] | undefined) || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setLocalFilters({ ...localFilters, [key]: updated.length ? updated : undefined });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({});
    onClear();
    onClose();
  };

  const categories: PlayerCategory[] = ['A', 'B', 'C', 'D', 'E'];
  const purposes: TournamentPurpose[] = ['RESULTAT', 'UTVIKLING', 'TRENING'];
  const levels: CompetitionLevel[] = [
    'internasjonal',
    'nasjonal',
    'regional',
    'klubb',
    'junior',
    'trenings_turnering',
  ];
  const juniorRegions: JuniorTourRegion[] = [
    'ostlandet_ost',
    'ostlandet_vest',
    'sorlandet',
    'vestlandet',
    'midt_norge',
    'nord_norge',
  ];
  const tours: TourType[] = [
    'junior_tour_regional',
    'srixon_tour',
    'garmin_norges_cup',
    'global_junior_tour',
    'nordic_league',
    'ega_turnering',
    'wagr_turnering',
    'college_turneringer',
    'challenge_tour',
    'dp_world_tour',
    'pga_tour',
  ];
  const statuses: TournamentStatus[] = [
    'registration_open',
    'upcoming',
    'full',
    'in_progress',
    'completed',
  ];
  const dateRanges: { value: TournamentFilters['dateRange']; label: string }[] = [
    { value: 'next_30_days', label: 'Neste 30 dager' },
    { value: 'next_90_days', label: 'Neste 90 dager' },
    { value: 'this_season', label: 'Denne sesongen' },
  ];

  return (
    <div style={filterPanelStyles.overlay} onClick={onClose}>
      <div style={filterPanelStyles.panel} onClick={e => e.stopPropagation()}>
        <div style={filterPanelStyles.header}>
          <SubSectionTitle style={filterPanelStyles.title}>Filtrer turneringer</SubSectionTitle>
          <button onClick={onClose} style={filterPanelStyles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div style={filterPanelStyles.content}>
          {/* Tournament Purpose Filter (from hierarchy document) */}
          <div style={filterPanelStyles.section}>
            <CardTitle style={filterPanelStyles.sectionTitle}>Turneringsformål</CardTitle>
            <p style={filterPanelStyles.sectionDescription}>
              Hvordan du bør tilnærme deg turneringen
            </p>
            <div style={filterPanelStyles.chipGrid}>
              {purposes.map(purpose => {
                const isSelected = localFilters.purposes?.includes(purpose);
                return (
                  <button
                    key={purpose}
                    onClick={() => toggleArrayFilter('purposes', purpose)}
                    style={{
                      ...filterPanelStyles.chip,
                      ...(isSelected ? filterPanelStyles.chipSelected : {}),
                    }}
                    title={PURPOSE_DESCRIPTIONS[purpose]}
                    aria-label={`${PURPOSE_LABELS[purpose]}: ${PURPOSE_DESCRIPTIONS[purpose]}`}
                  >
                    {PURPOSE_LABELS[purpose]}
                    {isSelected && <CheckCircle size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Competition Level Filter (from hierarchy document) */}
          <div style={filterPanelStyles.section}>
            <CardTitle style={filterPanelStyles.sectionTitle}>Konkurransenivå</CardTitle>
            <div style={filterPanelStyles.chipGrid}>
              {levels.map(level => {
                const isSelected = localFilters.levels?.includes(level);
                return (
                  <button
                    key={level}
                    onClick={() => toggleArrayFilter('levels', level)}
                    style={{
                      ...filterPanelStyles.chip,
                      ...(isSelected ? filterPanelStyles.chipSelected : {}),
                    }}
                    aria-label={`Konkurransenivå: ${LEVEL_LABELS[level]}`}
                  >
                    {LEVEL_LABELS[level]}
                    {isSelected && <CheckCircle size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Junior Tour Region Filter (Appendix 2) */}
          <div style={filterPanelStyles.section}>
            <CardTitle style={filterPanelStyles.sectionTitle}>Junior Tour Region</CardTitle>
            <p style={filterPanelStyles.sectionDescription}>
              Filtrer junior turneringer etter region (kun Junior Tour Regional)
            </p>
            <div style={filterPanelStyles.chipGrid}>
              {juniorRegions.map(region => {
                const isSelected = localFilters.juniorTourRegions?.includes(region);
                return (
                  <button
                    key={region}
                    onClick={() => toggleArrayFilter('juniorTourRegions', region)}
                    style={{
                      ...filterPanelStyles.chip,
                      ...(isSelected ? filterPanelStyles.chipSelected : {}),
                    }}
                    title={JUNIOR_TOUR_REGION_DESCRIPTIONS[region]}
                    aria-label={`${JUNIOR_TOUR_REGION_LABELS[region]}: ${JUNIOR_TOUR_REGION_DESCRIPTIONS[region]}`}
                  >
                    {JUNIOR_TOUR_REGION_LABELS[region]}
                    {isSelected && <CheckCircle size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Player Category Filter */}
          <div style={filterPanelStyles.section}>
            <CardTitle style={filterPanelStyles.sectionTitle}>Anbefalt spillernivå</CardTitle>
            <div style={filterPanelStyles.chipGrid}>
              {categories.map(cat => {
                const isSelected = localFilters.recommendedCategories?.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleArrayFilter('recommendedCategories', cat)}
                    style={{
                      ...filterPanelStyles.chip,
                      ...(isSelected ? filterPanelStyles.chipSelected : {}),
                    }}
                    aria-label={`Spillerkategori ${CATEGORY_LABELS[cat]}`}
                  >
                    {CATEGORY_LABELS[cat]}
                    {isSelected && <CheckCircle size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tour Filter */}
          <div style={filterPanelStyles.section}>
            <CardTitle style={filterPanelStyles.sectionTitle}>Turneringsserie</CardTitle>
            <div style={filterPanelStyles.chipGrid}>
              {tours.map(tour => {
                const isSelected = localFilters.tours?.includes(tour);
                return (
                  <button
                    key={tour}
                    onClick={() => toggleArrayFilter('tours', tour)}
                    style={{
                      ...filterPanelStyles.chip,
                      ...(isSelected ? filterPanelStyles.chipSelected : {}),
                    }}
                  >
                    {TOUR_LABELS[tour]}
                    {isSelected && <CheckCircle size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter */}
          <div style={filterPanelStyles.section}>
            <CardTitle style={filterPanelStyles.sectionTitle}>Status</CardTitle>
            <div style={filterPanelStyles.chipGrid}>
              {statuses.map(status => {
                const isSelected = localFilters.statuses?.includes(status);
                return (
                  <button
                    key={status}
                    onClick={() => toggleArrayFilter('statuses', status)}
                    style={{
                      ...filterPanelStyles.chip,
                      ...(isSelected ? filterPanelStyles.chipSelected : {}),
                    }}
                  >
                    {STATUS_LABELS[status]}
                    {isSelected && <CheckCircle size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range Filter */}
          <div style={filterPanelStyles.section}>
            <CardTitle style={filterPanelStyles.sectionTitle}>Tidsperiode</CardTitle>
            <div style={filterPanelStyles.chipGrid}>
              {dateRanges.map(({ value, label }) => {
                const isSelected = localFilters.dateRange === value;
                return (
                  <button
                    key={value}
                    onClick={() => setLocalFilters({
                      ...localFilters,
                      dateRange: isSelected ? undefined : value,
                    })}
                    style={{
                      ...filterPanelStyles.chip,
                      ...(isSelected ? filterPanelStyles.chipSelected : {}),
                    }}
                  >
                    {label}
                    {isSelected && <CheckCircle size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Country Filter */}
          <div style={filterPanelStyles.section}>
            <CardTitle style={filterPanelStyles.sectionTitle}>Land</CardTitle>
            {/* Quick select groups */}
            <div style={{ ...filterPanelStyles.chipGrid, marginBottom: 'var(--spacing-3)' }}>
              <button
                onClick={() => setLocalFilters({
                  ...localFilters,
                  countries: COUNTRY_GROUPS.nordic,
                })}
                style={{
                  ...filterPanelStyles.chip,
                  fontSize: '12px',
                  padding: '6px 10px',
                }}
              >
                Norden
              </button>
              <button
                onClick={() => setLocalFilters({
                  ...localFilters,
                  countries: COUNTRY_GROUPS.europe,
                })}
                style={{
                  ...filterPanelStyles.chip,
                  fontSize: '12px',
                  padding: '6px 10px',
                }}
              >
                Europa
              </button>
              <button
                onClick={() => setLocalFilters({
                  ...localFilters,
                  countries: undefined,
                })}
                style={{
                  ...filterPanelStyles.chip,
                  fontSize: '12px',
                  padding: '6px 10px',
                }}
              >
                Alle land
              </button>
            </div>
            <div style={filterPanelStyles.chipGrid}>
              {['NO', 'SE', 'DK', 'FI', 'GB', 'US', 'ES', 'DE', 'IE', 'ZA'].map(code => {
                const isSelected = localFilters.countries?.includes(code);
                return (
                  <button
                    key={code}
                    onClick={() => toggleArrayFilter('countries', code)}
                    style={{
                      ...filterPanelStyles.chip,
                      ...(isSelected ? filterPanelStyles.chipSelected : {}),
                    }}
                  >
                    {COUNTRY_LABELS[code] || code}
                    {isSelected && <CheckCircle size={14} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={filterPanelStyles.footer}>
          <Button variant="ghost" onClick={handleClear}>
            Nullstill
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Bruk filter
          </Button>
        </div>
      </div>
    </div>
  );
}

const filterPanelStyles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  panel: {
    width: '100%',
    maxWidth: '400px',
    height: '100%',
    backgroundColor: 'var(--background-white)',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-4) var(--spacing-5)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  closeButton: {
    padding: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
  },
  content: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: 'var(--spacing-5)',
  },
  section: {
    marginBottom: 'var(--spacing-6)',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: '0 0 var(--spacing-2) 0',
  },
  sectionDescription: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: '0 0 var(--spacing-3) 0',
  },
  chipGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 'var(--spacing-2)',
  },
  chip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--border-default)',
    backgroundColor: 'var(--background-surface)',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  chipSelected: {
    backgroundColor: 'var(--accent)',
    borderColor: 'var(--accent)',
    color: 'var(--text-inverse)',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 'var(--spacing-4) var(--spacing-5)',
    borderTop: '1px solid var(--border-subtle)',
  },
};

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
  const { user } = useAuth();
  const { filters, setFilters, clearFilters } = useFilterState();

  // State
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TournamentTab>('alle');
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
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/calendar/add-tournament', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tournamentId: tournament.id,
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
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Show success feedback
        alert(data.message || `"${tournament.name}" lagt til i kalenderen!`);
      } else {
        throw new Error('Failed to add to calendar');
      }
    } catch (error) {
      console.error('Failed to add tournament to calendar:', error);
      alert('Kunne ikke legge til i kalenderen. Prøv igjen.');
    }
  };

  // Handle adding tournament to planner (PLANLEGG)
  const handlePlanTournament = (tournament: Tournament) => {
    // Get existing plan from localStorage
    const LOCAL_STORAGE_KEY = 'ak_golf_tournament_plan';
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
      // Navigate to planner if already added
      navigate('/turneringer/planlegger');
      return;
    }

    // Add to plan with default purpose based on hierarchy
    const newEntry = {
      tournament,
      purpose: tournament.purpose || 'UTVIKLING', // Default to UTVIKLING
      notes: '',
      addedAt: new Date().toISOString(),
    };

    existingPlan.push(newEntry);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existingPlan));

    // Navigate to planner
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
          <SectionTitle style={styles.sectionTitle}>Kommende turneringer</SectionTitle>

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
                  onPlanTournament={handlePlanTournament}
                />
              ))}
            </div>
          )}
        </section>

        {/* Past Tournaments */}
        {past.length > 0 && (
          <section style={styles.section}>
            <SectionTitle style={styles.sectionTitle}>Tidligere resultater</SectionTitle>
            <div style={styles.pastList}>
              {past.map(tournament => (
                <PastTournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <FilterPanel
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

  planButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-default)',
    backgroundColor: 'var(--background-surface)',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
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
