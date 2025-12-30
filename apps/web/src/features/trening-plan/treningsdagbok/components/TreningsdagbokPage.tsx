/**
 * TreningsdagbokPage
 *
 * Training Ledger main page component.
 * Displays weekly training heatmap, session list, and summary stats.
 * Uses URL-based state via useDagbokState hook.
 */

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Filter, Search, X } from 'lucide-react';

import { useDagbokState } from '../hooks/useDagbokState';
import {
  PYRAMID_OPTIONS,
  PERIOD_OPTIONS,
  PLAN_TYPE_OPTIONS,
  DAY_NAMES,
  HEATMAP_PYRAMID_ORDER,
  PYRAMID_COLORS,
  PYRAMIDS,
  getHeatmapIntensity,
} from '../constants';
import type {
  Pyramid,
  DagbokPeriod,
  DagbokPlanType,
  HeatmapIntensity,
  DagbokSession,
} from '../types';

// =============================================================================
// MOCK DATA (replace with API hook)
// =============================================================================

const MOCK_SESSIONS: DagbokSession[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:30',
    isPlanned: true,
    pyramid: 'TEK',
    area: 'TEE',
    title: 'Driver teknikk',
    description: 'Fokus på setup og takeaway',
    duration: 90,
    drills: [],
    totalSets: 5,
    totalReps: 50,
    rating: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '15:00',
    isPlanned: true,
    pyramid: 'SLAG',
    area: 'INN100',
    title: 'Wedge spill',
    description: 'Avstandskontroll 80-100m',
    duration: 60,
    drills: [],
    totalSets: 4,
    totalReps: 40,
    rating: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    isPlanned: false,
    pyramid: 'FYS',
    title: 'Styrketrening',
    description: 'Kjernemuskulatur og rotasjon',
    duration: 60,
    drills: [],
    totalSets: 3,
    totalReps: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function TreningsdagbokPage() {
  const state = useDagbokState();
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(state.searchQuery);

  // Mock data - replace with API hook
  const sessions = MOCK_SESSIONS;
  const isLoading = false;

  // Filter sessions based on state
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      // Date range filter
      const sessionDate = new Date(session.date);
      if (sessionDate < state.rangeStart || sessionDate > state.rangeEnd) {
        return false;
      }

      // Pyramid filter
      if (state.pyramid && session.pyramid !== state.pyramid) {
        return false;
      }

      // Plan type filter
      if (state.planType === 'planned' && !session.isPlanned) {
        return false;
      }
      if (state.planType === 'free' && session.isPlanned) {
        return false;
      }

      // Search filter
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        return (
          session.title.toLowerCase().includes(query) ||
          session.description?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [sessions, state]);

  // Generate heatmap data
  const heatmapData = useMemo(() => {
    const data: Record<string, Record<Pyramid, number>> = {};

    // Initialize all days in range
    const current = new Date(state.rangeStart);
    while (current <= state.rangeEnd) {
      const dateKey = current.toISOString().split('T')[0];
      data[dateKey] = { FYS: 0, TEK: 0, SLAG: 0, SPILL: 0, TURN: 0 };
      current.setDate(current.getDate() + 1);
    }

    // Sum minutes per day per pyramid
    sessions.forEach((session) => {
      if (data[session.date]) {
        data[session.date][session.pyramid] += session.duration;
      }
    });

    return data;
  }, [sessions, state.rangeStart, state.rangeEnd]);

  // Summary stats
  const stats = useMemo(() => {
    const totalMinutes = filteredSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalSessions = filteredSessions.length;
    const totalReps = filteredSessions.reduce((sum, s) => sum + s.totalReps, 0);
    const avgRating =
      filteredSessions.filter((s) => s.rating).reduce((sum, s) => sum + (s.rating || 0), 0) /
        filteredSessions.filter((s) => s.rating).length || 0;

    return { totalMinutes, totalSessions, totalReps, avgRating };
  }, [filteredSessions]);

  // Handle search with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    // Debounce would go here
    state.setSearchQuery(e.target.value);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <h1 style={styles.title}>Treningsdagbok</h1>
          <button
            style={styles.filterToggle}
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
          >
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>

        {/* Period Navigation */}
        <div style={styles.periodNav}>
          <button style={styles.navButton} onClick={state.goToPrev} aria-label="Forrige">
            <ChevronLeft size={20} />
          </button>

          <div style={styles.periodInfo}>
            <span style={styles.periodLabel}>
              {state.period === 'week' && `Uke ${state.weekNumber}`}
              {state.period === 'month' && state.monthName}
            </span>
            <span style={styles.periodYear}>{state.year}</span>
          </div>

          <button style={styles.navButton} onClick={state.goToNext} aria-label="Neste">
            <ChevronRight size={20} />
          </button>

          <button style={styles.todayButton} onClick={state.goToToday}>
            <Calendar size={16} />
            <span>I dag</span>
          </button>
        </div>

        {/* Period Type Selector */}
        <div style={styles.periodSelector}>
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              style={{
                ...styles.periodButton,
                ...(state.period === option.value ? styles.periodButtonActive : {}),
              }}
              onClick={() => state.setPeriod(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      {/* Filters Panel */}
      {showFilters && (
        <div style={styles.filtersPanel}>
          {/* Search */}
          <div style={styles.searchContainer}>
            <Search size={16} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Søk i økter..."
              value={searchValue}
              onChange={handleSearchChange}
              style={styles.searchInput}
            />
            {searchValue && (
              <button
                style={styles.clearSearch}
                onClick={() => {
                  setSearchValue('');
                  state.setSearchQuery('');
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Pyramid Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Pyramide</label>
            <div style={styles.filterChips}>
              {PYRAMID_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  style={{
                    ...styles.filterChip,
                    ...(state.pyramid === option.value ||
                    (option.value === 'all' && !state.pyramid)
                      ? styles.filterChipActive
                      : {}),
                  }}
                  onClick={() =>
                    state.setPyramid(option.value === 'all' ? null : (option.value as Pyramid))
                  }
                >
                  {option.icon && <span>{option.icon}</span>}
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Plan Type Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Type</label>
            <div style={styles.filterChips}>
              {PLAN_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  style={{
                    ...styles.filterChip,
                    ...(state.planType === option.value ? styles.filterChipActive : {}),
                  }}
                  onClick={() => state.setPlanType(option.value as DagbokPlanType)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters */}
          <button style={styles.resetButton} onClick={state.resetFilters}>
            Nullstill filter
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{stats.totalSessions}</span>
          <span style={styles.statLabel}>Økter</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{Math.round(stats.totalMinutes / 60)}t</span>
          <span style={styles.statLabel}>Timer</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{stats.totalReps}</span>
          <span style={styles.statLabel}>Reps</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>
            {stats.avgRating ? stats.avgRating.toFixed(1) : '–'}
          </span>
          <span style={styles.statLabel}>Snitt</span>
        </div>
      </div>

      {/* Weekly Heatmap */}
      <section style={styles.heatmapSection}>
        <h2 style={styles.sectionTitle}>Ukesoversikt</h2>
        <div style={styles.heatmap}>
          {/* Header row with pyramid labels */}
          <div style={styles.heatmapHeader}>
            <div style={styles.heatmapDayLabel} />
            {HEATMAP_PYRAMID_ORDER.map((pyramid) => (
              <div key={pyramid} style={styles.heatmapPyramidLabel}>
                <span>{PYRAMIDS[pyramid].icon}</span>
              </div>
            ))}
          </div>

          {/* Day rows */}
          {DAY_NAMES.map((dayName, dayIndex) => {
            const dayDate = new Date(state.rangeStart);
            dayDate.setDate(dayDate.getDate() + dayIndex);
            const dateKey = dayDate.toISOString().split('T')[0];
            const dayData = heatmapData[dateKey] || { FYS: 0, TEK: 0, SLAG: 0, SPILL: 0, TURN: 0 };

            return (
              <div key={dayIndex} style={styles.heatmapRow}>
                <div style={styles.heatmapDayLabel}>
                  <span style={styles.dayName}>{dayName}</span>
                  <span style={styles.dayDate}>{dayDate.getDate()}</span>
                </div>
                {HEATMAP_PYRAMID_ORDER.map((pyramid) => {
                  const minutes = dayData[pyramid];
                  const intensity = getHeatmapIntensity(minutes);
                  return (
                    <div
                      key={pyramid}
                      style={{
                        ...styles.heatmapCell,
                        ...getIntensityStyle(intensity, pyramid),
                      }}
                      title={`${PYRAMIDS[pyramid].label}: ${minutes} min`}
                    >
                      {minutes > 0 && <span style={styles.cellMinutes}>{minutes}</span>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={styles.heatmapLegend}>
          <span style={styles.legendLabel}>Mindre</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              style={{
                ...styles.legendCell,
                backgroundColor: `color-mix(in srgb, var(--accent) ${level * 20}%, transparent)`,
                border: level === 0 ? '1px solid var(--border-default)' : 'none',
              }}
            />
          ))}
          <span style={styles.legendLabel}>Mer</span>
        </div>
      </section>

      {/* Session List */}
      <section style={styles.sessionsSection}>
        <h2 style={styles.sectionTitle}>
          Økter
          <span style={styles.sessionCount}>({filteredSessions.length})</span>
        </h2>

        {isLoading ? (
          <div style={styles.loading}>Laster økter...</div>
        ) : filteredSessions.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Ingen økter funnet for denne perioden.</p>
          </div>
        ) : (
          <div style={styles.sessionList}>
            {filteredSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// =============================================================================
// SESSION CARD COMPONENT
// =============================================================================

interface SessionCardProps {
  session: DagbokSession;
}

function SessionCard({ session }: SessionCardProps) {
  const pyramidStyle = PYRAMID_COLORS[session.pyramid];

  return (
    <div style={styles.sessionCard}>
      <div style={styles.sessionHeader}>
        <div
          style={{
            ...styles.pyramidBadge,
            backgroundColor: pyramidStyle.bg,
            color: pyramidStyle.text,
            borderColor: pyramidStyle.border,
          }}
        >
          {PYRAMIDS[session.pyramid].icon} {PYRAMIDS[session.pyramid].label}
        </div>
        {session.isPlanned && <span style={styles.plannedBadge}>Planlagt</span>}
      </div>

      <h3 style={styles.sessionTitle}>{session.title}</h3>
      {session.description && <p style={styles.sessionDescription}>{session.description}</p>}

      <div style={styles.sessionMeta}>
        <span style={styles.sessionTime}>
          {session.startTime} - {session.endTime}
        </span>
        <span style={styles.sessionDuration}>{session.duration} min</span>
        {session.rating && (
          <span style={styles.sessionRating}>
            {'★'.repeat(session.rating)}{'☆'.repeat(5 - session.rating)}
          </span>
        )}
      </div>

      {(session.totalSets > 0 || session.totalReps > 0) && (
        <div style={styles.sessionStats}>
          {session.totalSets > 0 && <span>{session.totalSets} sett</span>}
          {session.totalReps > 0 && <span>{session.totalReps} reps</span>}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// HELPERS
// =============================================================================

function getIntensityStyle(
  intensity: HeatmapIntensity,
  pyramid: Pyramid
): React.CSSProperties {
  if (intensity === 0) {
    return {
      backgroundColor: 'var(--background-surface)',
    };
  }

  const color = PYRAMID_COLORS[pyramid];
  return {
    backgroundColor: `color-mix(in srgb, ${color.text} ${intensity * 20}%, transparent)`,
  };
}

// =============================================================================
// STYLES
// =============================================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '1536px',
    margin: '0 auto',
    padding: '24px',
  },

  // Header
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },
  filterToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'var(--background-surface)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },

  // Period Navigation
  periodNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    backgroundColor: 'var(--background-white)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  periodInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '100px',
  },
  periodLabel: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  periodYear: {
    fontSize: '13px',
    color: 'var(--text-tertiary)',
  },
  todayButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    backgroundColor: 'var(--accent)',
    color: 'var(--text-inverse)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    marginLeft: 'auto',
  },

  // Period Selector
  periodSelector: {
    display: 'flex',
    gap: '8px',
  },
  periodButton: {
    padding: '8px 16px',
    backgroundColor: 'var(--background-surface)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  periodButtonActive: {
    backgroundColor: 'var(--accent)',
    color: 'var(--text-inverse)',
    borderColor: 'var(--accent)',
  },

  // Filters Panel
  filtersPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '20px',
    backgroundColor: 'var(--background-white)',
    borderRadius: '12px',
    border: '1px solid var(--border-subtle)',
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-tertiary)',
  },
  searchInput: {
    width: '100%',
    padding: '10px 36px',
    backgroundColor: 'var(--background-surface)',
    border: '1px solid var(--border-default)',
    borderRadius: '8px',
    fontSize: '14px',
    color: 'var(--text-primary)',
  },
  clearSearch: {
    position: 'absolute',
    right: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    backgroundColor: 'var(--background-surface)',
    color: 'var(--text-tertiary)',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  filterLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  filterChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  filterChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'var(--background-surface)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  filterChipActive: {
    backgroundColor: 'var(--accent)',
    color: 'var(--text-inverse)',
    borderColor: 'var(--accent)',
  },
  resetButton: {
    alignSelf: 'flex-start',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },

  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: 'var(--background-white)',
    borderRadius: '12px',
    border: '1px solid var(--border-subtle)',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  statLabel: {
    fontSize: '13px',
    color: 'var(--text-tertiary)',
    marginTop: '4px',
  },

  // Heatmap
  heatmapSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  heatmap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '16px',
    backgroundColor: 'var(--background-white)',
    borderRadius: '12px',
    border: '1px solid var(--border-subtle)',
  },
  heatmapHeader: {
    display: 'flex',
    gap: '4px',
  },
  heatmapDayLabel: {
    width: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingRight: '8px',
  },
  heatmapPyramidLabel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '32px',
    fontSize: '16px',
  },
  heatmapRow: {
    display: 'flex',
    gap: '4px',
  },
  dayName: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  dayDate: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
  },
  heatmapCell: {
    flex: 1,
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    transition: 'transform 0.1s',
    cursor: 'pointer',
  },
  cellMinutes: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  heatmapLegend: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '8px',
  },
  legendLabel: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
  },
  legendCell: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
  },

  // Sessions
  sessionsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sessionCount: {
    fontSize: '14px',
    fontWeight: 400,
    color: 'var(--text-tertiary)',
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    color: 'var(--text-tertiary)',
  },
  emptyState: {
    padding: '40px',
    textAlign: 'center',
    color: 'var(--text-tertiary)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: '12px',
  },
  sessionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sessionCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '16px',
    backgroundColor: 'var(--background-white)',
    borderRadius: '12px',
    border: '1px solid var(--border-subtle)',
  },
  sessionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  pyramidBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    border: '1px solid',
  },
  plannedBadge: {
    padding: '2px 8px',
    backgroundColor: 'color-mix(in srgb, var(--success) 15%, transparent)',
    color: 'var(--success)',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
  },
  sessionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  sessionDescription: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: 0,
    lineHeight: 1.4,
  },
  sessionMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '13px',
    color: 'var(--text-tertiary)',
  },
  sessionTime: {
    fontWeight: 500,
  },
  sessionDuration: {
    color: 'var(--accent)',
    fontWeight: 600,
  },
  sessionRating: {
    color: 'var(--warning)',
  },
  sessionStats: {
    display: 'flex',
    gap: '12px',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    paddingTop: '8px',
    borderTop: '1px solid var(--border-subtle)',
  },
};

export default TreningsdagbokPage;
