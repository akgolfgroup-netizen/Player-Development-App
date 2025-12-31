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

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: 'var(--card-background)',
    borderBottom: '1px solid var(--border-default)',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap' as const,
  },
  pyramidSegment: {
    display: 'flex',
    gap: '6px',
  },
  pyramidButton: (isActive: boolean) => ({
    backgroundColor: isActive ? 'var(--accent)' : 'var(--background-white)',
    color: isActive ? 'var(--text-inverse)' : 'var(--text-secondary)',
    padding: 'var(--spacing-2) var(--spacing-4)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    border: isActive ? 'none' : '1px solid var(--border-default)',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    whiteSpace: 'nowrap' as const,
  }),
  periodNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  periodButton: {
    padding: '6px 10px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  navButton: {
    padding: '6px',
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
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    minWidth: '140px',
    textAlign: 'center' as const,
  },
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  leftControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  rightControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  selectWrapper: {
    position: 'relative' as const,
  },
  select: {
    padding: '6px 28px 6px 10px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 10px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-sm)',
    minWidth: '200px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '13px',
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
    padding: '6px 10px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  filterBadge: {
    backgroundColor: 'var(--accent)',
    color: 'var(--text-inverted)',
    fontSize: '10px',
    fontWeight: 600,
    padding: '2px 6px',
    borderRadius: '10px',
    minWidth: '16px',
    textAlign: 'center' as const,
  },
  resetButton: {
    padding: '6px 10px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
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
                {PyramidIcon && <PyramidIcon size={14} style={{ marginRight: '4px' }} />}
                {opt.label}
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
            <ChevronLeft size={18} />
          </button>

          <span style={styles.dateLabel}>{getPeriodLabel()}</span>

          <button
            onClick={actions.goToNext}
            style={styles.navButton}
            aria-label="Neste"
          >
            <ChevronRight size={18} />
          </button>

          <button
            onClick={actions.goToToday}
            style={{
              ...styles.periodButton,
              padding: '4px 8px',
              fontSize: '11px',
            }}
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
              style={styles.select}
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
              style={styles.select}
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
              borderColor: showAdvancedFilters ? 'var(--accent)' : 'var(--border-default)',
            }}
          >
            <Filter size={14} />
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
              <RotateCcw size={12} />
              Nullstill
            </button>
          )}
        </div>

        <div style={styles.rightControls}>
          {/* Search */}
          <div style={styles.searchContainer}>
            <Search size={14} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Sok i okter..."
              value={localSearch}
              onChange={handleSearchChange}
              style={styles.searchInput}
            />
            {localSearch && (
              <button
                onClick={handleClearSearch}
                style={styles.clearButton}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DagbokFilterBar;
