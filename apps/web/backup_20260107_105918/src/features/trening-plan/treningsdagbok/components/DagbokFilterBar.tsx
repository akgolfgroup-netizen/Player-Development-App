/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * DagbokFilterBar
 *
 * Single-line filter row with pyramid segmented control,
 * period selector, plan type, and search.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
  X,
  RotateCcw,
} from 'lucide-react';

import type {
  DagbokState,
  DagbokActions,
  FilterVisibility,
  Pyramid,
  DagbokPeriod,
  DagbokPlanType,
} from '../types';

import {
  PYRAMID_OPTIONS,
  PERIOD_OPTIONS,
  PLAN_TYPE_OPTIONS,
  PYRAMIDS,
  SEARCH_DEBOUNCE_MS,
  PYRAMID_ICONS,
} from '../constants';

import cssStyles from './DagbokFilterBar.module.css';

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'var(--card-background)',
    borderBottom: '1px solid var(--border-default)',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  pyramidSegment: {
    display: 'flex',
    gap: '4px',
    backgroundColor: 'var(--bg-secondary)',
    padding: '3px',
    borderRadius: 'var(--radius-sm)',
  },
  pyramidButton: (isActive: boolean) => ({
    backgroundColor: isActive ? 'var(--accent)' : 'transparent',
    color: isActive ? 'var(--text-inverse)' : 'var(--text-secondary)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-xs)',
    fontSize: '11px',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    whiteSpace: 'nowrap' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    minWidth: '50px',
  }),
  periodNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  periodButton: {
    padding: '4px 8px',
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  navButton: {
    padding: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    minWidth: '120px',
    textAlign: 'center' as const,
  },
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  leftControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  rightControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  selectWrapper: {
    position: 'relative' as const,
  },
  select: {
    padding: '4px 24px 4px 8px',
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
    outline: 'none',
    transition: 'all 150ms ease',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 8px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-sm)',
    minWidth: '160px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '11px',
    color: 'var(--text-primary)',
  },
  clearButton: {
    padding: '2px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-tertiary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  filterToggle: {
    padding: '4px 8px',
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  filterBadge: {
    backgroundColor: 'var(--accent)',
    color: 'var(--text-inverted)',
    fontSize: '9px',
    fontWeight: 600,
    padding: '1px 5px',
    borderRadius: '8px',
    minWidth: '14px',
    textAlign: 'center' as const,
  },
  resetButton: {
    padding: '4px 8px',
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export interface DagbokFilterBarProps {
  state: DagbokState;
  actions: DagbokActions;
  visibility: FilterVisibility;
  activeFilterCount: number;
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: () => void;
  className?: string;
}

export const DagbokFilterBar: React.FC<DagbokFilterBarProps> = ({
  state,
  actions,
  visibility,
  activeFilterCount,
  showAdvancedFilters,
  onToggleAdvancedFilters,
  className = '',
}) => {
  const [localSearch, setLocalSearch] = useState(state.searchQuery);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Sync local search with state
  useEffect(() => {
    setLocalSearch(state.searchQuery);
  }, [state.searchQuery]);

  // Debounced search
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      actions.setSearchQuery(value);
    }, SEARCH_DEBOUNCE_MS);
  }, [actions]);

  const handleClearSearch = useCallback(() => {
    setLocalSearch('');
    actions.setSearchQuery('');
  }, [actions]);

  // Period label
  const getPeriodLabel = () => {
    if (state.period === 'week') {
      return `Uke ${state.weekNumber}, ${state.year}`;
    }
    if (state.period === 'month') {
      return `${state.monthName} ${state.year}`;
    }
    return 'Egendefinert';
  };

  return (
    <div className={className} style={styles.container}>
      {/* Top row: Pyramid segment + Period navigation */}
      <div style={styles.topRow}>
        {/* Pyramid segmented control */}
        <div style={styles.pyramidSegment}>
          {PYRAMID_OPTIONS.map((opt) => {
            const PyramidIcon = opt.value !== 'all' ? PYRAMID_ICONS[opt.value as keyof typeof PYRAMID_ICONS] : null;
            return (
              <button
                key={opt.value}
                onClick={() => actions.setPyramid(opt.value === 'all' ? null : opt.value as Pyramid)}
                style={styles.pyramidButton(
                  opt.value === 'all' ? state.pyramid === null : state.pyramid === opt.value
                )}
              >
                {PyramidIcon && <PyramidIcon size={13} />}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Period navigation */}
        <div style={styles.periodNav}>
          <button
            onClick={actions.goToPrev}
            style={styles.navButton}
            aria-label="Forrige"
          >
            <ChevronLeft size={14} />
          </button>

          <span style={styles.dateLabel}>{getPeriodLabel()}</span>

          <button
            onClick={actions.goToNext}
            style={styles.navButton}
            aria-label="Neste"
          >
            <ChevronRight size={14} />
          </button>

          <button
            onClick={actions.goToToday}
            style={styles.periodButton}
          >
            I dag
          </button>
        </div>
      </div>

      {/* Bottom row: Period select, Plan type, Search, Filter toggle */}
      <div style={styles.bottomRow}>
        <div style={styles.leftControls}>
          {/* Period type select */}
          <div style={styles.selectWrapper}>
            <select
              value={state.period}
              onChange={(e) => actions.setPeriod(e.target.value as DagbokPeriod)}
              className={cssStyles.select}
            >
              {PERIOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Plan type select */}
          <div style={styles.selectWrapper}>
            <select
              value={state.planType}
              onChange={(e) => actions.setPlanType(e.target.value as DagbokPlanType)}
              className={cssStyles.select}
            >
              {PLAN_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Advanced filters toggle */}
          <button
            onClick={onToggleAdvancedFilters}
            style={{
              ...styles.filterToggle,
              backgroundColor: showAdvancedFilters ? 'var(--accent)' : 'var(--bg-secondary)',
              color: showAdvancedFilters ? 'var(--text-inverted)' : 'var(--text-secondary)',
              borderColor: showAdvancedFilters ? 'var(--accent)' : 'var(--border-default)',
            }}
          >
            <Filter size={12} />
            Filtre
            {activeFilterCount > 0 && (
              <span style={styles.filterBadge}>{activeFilterCount}</span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={actions.resetFilters}
              style={styles.resetButton}
            >
              <RotateCcw size={10} />
              Nullstill
            </button>
          )}
        </div>

        <div style={styles.rightControls}>
          {/* Search */}
          <div style={styles.searchContainer}>
            <Search size={12} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Søk i økter..."
              value={localSearch}
              onChange={handleSearchChange}
              style={styles.searchInput}
            />
            {localSearch && (
              <button
                onClick={handleClearSearch}
                style={styles.clearButton}
              >
                <X size={10} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DagbokFilterBar;
