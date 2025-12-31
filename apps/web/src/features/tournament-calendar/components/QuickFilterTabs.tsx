// @ts-nocheck
/**
 * QuickFilterTabs - Tournament Tab Filters
 *
 * Quick filter tabs: Alle, Mine turneringer, Junior, Elite, Åpen
 *
 * Design System: AK Golf Premium Light
 */

import React from 'react';
import { TournamentTab } from '../types';

interface QuickFilterTabsProps {
  activeTab: TournamentTab;
  onTabChange: (tab: TournamentTab) => void;
}

const TABS: { key: TournamentTab; label: string }[] = [
  { key: 'alle', label: 'Alle' },
  { key: 'mine_turneringer', label: 'Mine turneringer' },
  { key: 'junior', label: 'Junior' },
  { key: 'elite', label: 'Elite' },
  { key: 'open', label: 'Åpen' },
];

export default function QuickFilterTabs({ activeTab, onTabChange }: QuickFilterTabsProps) {
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
