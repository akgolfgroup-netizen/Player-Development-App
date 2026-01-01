// @ts-nocheck
/**
 * SearchBar - Tournament Search and Filter Toggle
 *
 * Search input with filter button for opening advanced filters.
 *
 * Design System: AK Golf Premium Light
 */

import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import Button from '../../../ui/primitives/Button';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  hasActiveFilters: boolean;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  onFilterClick,
  hasActiveFilters,
}: SearchBarProps) {
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

const styles: Record<string, React.CSSProperties> = {
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
};
