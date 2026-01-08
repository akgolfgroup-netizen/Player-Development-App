// @ts-nocheck
/**
 * QuickFilterTabs - Tournament Tab Filters
 *
 * Quick filter tabs: Alle, Mine turneringer, Junior, Elite, Åpen
 *
 * Design System: TIER Golf Premium Light
 */

import React from 'react';
import { QuickFilter, QUICK_FILTER_LABELS } from '../types';

interface QuickFilterTabsProps {
  activeTab: QuickFilter;
  onTabChange: (tab: QuickFilter) => void;
}

const TABS: QuickFilter[] = ['alle', 'mine', 'junior', 'elite', 'åpen'];

export default function QuickFilterTabs({ activeTab, onTabChange }: QuickFilterTabsProps) {
  return (
    <div style={styles.tabBar}>
      {TABS.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          style={{
            ...styles.tabButton,
            ...(activeTab === tab ? styles.tabButtonActive : {}),
          }}
        >
          {QUICK_FILTER_LABELS[tab]}
        </button>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  tabBar: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    overflowX: 'auto' as const,
    paddingBottom: 'var(--spacing-1)',
  },
  tabButton: {
    backgroundColor: 'var(--background-white)',
    color: 'var(--text-secondary)',
    padding: 'var(--spacing-2) var(--spacing-4)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    border: '1px solid var(--border-default)',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.2s ease',
  },
  tabButtonActive: {
    backgroundColor: 'var(--accent)',
    color: 'var(--text-inverse)',
    border: 'none',
  },
};
