// @ts-nocheck
/**
 * CalendarHeader - Tournament Statistics Header
 *
 * Displays key tournament statistics: upcoming, registered, podiums, played this year.
 *
 * Design System: TIER Golf Premium Light
 */

import React from 'react';
import { TournamentStats } from '../types';

interface CalendarHeaderProps {
  stats: TournamentStats;
}

export default function CalendarHeader({ stats }: CalendarHeaderProps) {
  return (
    <div style={styles.statsRow}>
      <div style={styles.statCard}>
        <div style={styles.statValue}>{stats.upcoming}</div>
        <div style={styles.statLabel}>Kommende</div>
      </div>
      <div style={styles.statCard}>
        <div style={{ ...styles.statValue, color: 'var(--status-success)' }}>
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

const styles: Record<string, React.CSSProperties> = {
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
};
