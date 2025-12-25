/**
 * VideoFilters Component
 * Filter and sort controls for the video library
 *
 * Features:
 * - Search input for filtering by title
 * - Category filter dropdown
 * - Sort by dropdown (date, title, duration)
 * - View toggle (grid/list)
 * - Player filter (coach view only)
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';

// Filter options
export const VIDEO_CATEGORIES = [
  { value: '', label: 'Alle kategorier' },
  { value: 'swing', label: 'Full Swing' },
  { value: 'putting', label: 'Putting' },
  { value: 'short_game', label: 'Short Game' },
  { value: 'other', label: 'Annet' },
];

export const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Nyeste først' },
  { value: 'createdAt:asc', label: 'Eldste først' },
  { value: 'title:asc', label: 'Tittel A-Å' },
  { value: 'title:desc', label: 'Tittel Å-A' },
  { value: 'duration:desc', label: 'Lengste først' },
  { value: 'duration:asc', label: 'Korteste først' },
];

export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list',
};

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3, 12px)',
    padding: 'var(--spacing-4, 16px)',
    backgroundColor: 'var(--ak-surface, #1a1a2e)',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-3, 12px)',
    alignItems: 'center',
  },
  searchContainer: {
    flex: '1 1 250px',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '18px',
    height: '18px',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.4))',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '10px 12px 10px 40px',
    fontSize: '14px',
    color: 'var(--ak-text-primary, white)',
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    borderRadius: 'var(--radius-md, 8px)',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  searchInputFocus: {
    borderColor: 'var(--ak-primary, #6366f1)',
  },
  clearButton: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    padding: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.4))',
    borderRadius: 'var(--radius-sm, 4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  select: {
    padding: '10px 36px 10px 12px',
    fontSize: '14px',
    color: 'var(--ak-text-primary, white)',
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    borderRadius: 'var(--radius-md, 8px)',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    minWidth: '150px',
    transition: 'border-color 0.2s ease',
  },
  selectFocus: {
    borderColor: 'var(--ak-primary, #6366f1)',
  },
  viewToggle: {
    display: 'flex',
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
    borderRadius: 'var(--radius-md, 8px)',
    padding: '4px',
    gap: '4px',
  },
  viewButton: {
    padding: '8px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-sm, 4px)',
    cursor: 'pointer',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  viewButtonActive: {
    backgroundColor: 'var(--ak-primary, #6366f1)',
    color: 'white',
  },
  viewIcon: {
    width: '18px',
    height: '18px',
  },
  playerSelect: {
    minWidth: '180px',
  },
  activeFilters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-2, 8px)',
    alignItems: 'center',
  },
  filterChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1, 4px)',
    padding: '4px 8px 4px 12px',
    backgroundColor: 'var(--ak-primary-soft, rgba(99, 102, 241, 0.2))',
    color: 'var(--ak-primary, #6366f1)',
    borderRadius: 'var(--radius-full, 9999px)',
    fontSize: '12px',
    fontWeight: '500',
  },
  filterChipRemove: {
    padding: '2px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'inherit',
    borderRadius: 'var(--radius-full, 9999px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
    transition: 'opacity 0.2s ease',
  },
  clearAllButton: {
    padding: '4px 12px',
    backgroundColor: 'transparent',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.2))',
    borderRadius: 'var(--radius-full, 9999px)',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  resultCount: {
    marginLeft: 'auto',
    fontSize: '13px',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
  },
};

// Icons
const SearchIcon = () => (
  <svg style={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const ClearIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const GridIcon = () => (
  <svg style={styles.viewIcon} viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ListIcon = () => (
  <svg style={styles.viewIcon} viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="4" width="18" height="4" rx="1" />
    <rect x="3" y="10" width="18" height="4" rx="1" />
    <rect x="3" y="16" width="18" height="4" rx="1" />
  </svg>
);

/**
 * VideoFilters Component
 */
export function VideoFilters({
  filters = {},
  onFilterChange,
  viewMode = VIEW_MODES.GRID,
  onViewModeChange,
  players = [],
  showPlayerFilter = false,
  resultCount,
  style,
  className,
}) {
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Handle search with debounce
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      onFilterChange?.({ ...filters, search: value });
    }, 300);
  }, [filters, onFilterChange]);

  // Clear search
  const handleClearSearch = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    onFilterChange?.({ ...filters, search: '' });
  }, [filters, onFilterChange]);

  // Handle category change
  const handleCategoryChange = useCallback((e) => {
    onFilterChange?.({ ...filters, category: e.target.value });
  }, [filters, onFilterChange]);

  // Handle sort change
  const handleSortChange = useCallback((e) => {
    const [sortBy, sortOrder] = e.target.value.split(':');
    onFilterChange?.({ ...filters, sortBy, sortOrder });
  }, [filters, onFilterChange]);

  // Handle player change
  const handlePlayerChange = useCallback((e) => {
    onFilterChange?.({ ...filters, playerId: e.target.value });
  }, [filters, onFilterChange]);

  // Remove individual filter
  const handleRemoveFilter = useCallback((filterKey) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    if (filterKey === 'search' && searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    onFilterChange?.(newFilters);
  }, [filters, onFilterChange]);

  // Clear all filters
  const handleClearAll = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    onFilterChange?.({
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, [onFilterChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Check if any filters are active
  const hasActiveFilters = filters.search || filters.category || filters.playerId;

  // Get current sort value
  const currentSort = `${filters.sortBy || 'createdAt'}:${filters.sortOrder || 'desc'}`;

  // Get category label for chip
  const getCategoryLabel = (value) => {
    const option = VIDEO_CATEGORIES.find((opt) => opt.value === value);
    return option?.label || value;
  };

  // Get player label for chip
  const getPlayerLabel = (playerId) => {
    const player = players.find((p) => p.id === playerId);
    return player?.name || 'Ukjent spiller';
  };

  return (
    <div className={className} style={{ ...styles.container, ...style }}>
      {/* Main filter row */}
      <div style={styles.row}>
        {/* Search */}
        <div style={styles.searchContainer}>
          <SearchIcon />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Søk etter videoer..."
            defaultValue={filters.search || ''}
            onChange={handleSearchChange}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              ...styles.searchInput,
              ...(searchFocused ? styles.searchInputFocus : {}),
            }}
          />
          {filters.search && (
            <button
              style={styles.clearButton}
              onClick={handleClearSearch}
              aria-label="Tøm søk"
            >
              <ClearIcon size={14} />
            </button>
          )}
        </div>

        {/* Category filter */}
        <select
          value={filters.category || ''}
          onChange={handleCategoryChange}
          style={styles.select}
          aria-label="Filtrer etter kategori"
        >
          {VIDEO_CATEGORIES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Player filter (coach view) */}
        {showPlayerFilter && players.length > 0 && (
          <select
            value={filters.playerId || ''}
            onChange={handlePlayerChange}
            style={{ ...styles.select, ...styles.playerSelect }}
            aria-label="Filtrer etter spiller"
          >
            <option value="">Alle spillere</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        )}

        {/* Sort */}
        <select
          value={currentSort}
          onChange={handleSortChange}
          style={styles.select}
          aria-label="Sorter etter"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* View toggle */}
        <div style={styles.viewToggle} role="group" aria-label="Visningstype">
          <button
            style={{
              ...styles.viewButton,
              ...(viewMode === VIEW_MODES.GRID ? styles.viewButtonActive : {}),
            }}
            onClick={() => onViewModeChange?.(VIEW_MODES.GRID)}
            aria-label="Rutenett-visning"
            aria-pressed={viewMode === VIEW_MODES.GRID}
          >
            <GridIcon />
          </button>
          <button
            style={{
              ...styles.viewButton,
              ...(viewMode === VIEW_MODES.LIST ? styles.viewButtonActive : {}),
            }}
            onClick={() => onViewModeChange?.(VIEW_MODES.LIST)}
            aria-label="Liste-visning"
            aria-pressed={viewMode === VIEW_MODES.LIST}
          >
            <ListIcon />
          </button>
        </div>
      </div>

      {/* Active filters row */}
      {(hasActiveFilters || resultCount !== undefined) && (
        <div style={styles.activeFilters}>
          {/* Search chip */}
          {filters.search && (
            <div style={styles.filterChip}>
              <span>Søk: "{filters.search}"</span>
              <button
                style={styles.filterChipRemove}
                onClick={() => handleRemoveFilter('search')}
                aria-label="Fjern søkefilter"
              >
                <ClearIcon size={12} />
              </button>
            </div>
          )}

          {/* Category chip */}
          {filters.category && (
            <div style={styles.filterChip}>
              <span>{getCategoryLabel(filters.category)}</span>
              <button
                style={styles.filterChipRemove}
                onClick={() => handleRemoveFilter('category')}
                aria-label="Fjern kategorifilter"
              >
                <ClearIcon size={12} />
              </button>
            </div>
          )}

          {/* Player chip */}
          {filters.playerId && (
            <div style={styles.filterChip}>
              <span>{getPlayerLabel(filters.playerId)}</span>
              <button
                style={styles.filterChipRemove}
                onClick={() => handleRemoveFilter('playerId')}
                aria-label="Fjern spillerfilter"
              >
                <ClearIcon size={12} />
              </button>
            </div>
          )}

          {/* Clear all button */}
          {hasActiveFilters && (
            <button
              style={styles.clearAllButton}
              onClick={handleClearAll}
            >
              Nullstill filtre
            </button>
          )}

          {/* Result count */}
          {resultCount !== undefined && (
            <span style={styles.resultCount}>
              {resultCount} {resultCount === 1 ? 'video' : 'videoer'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoFilters;
