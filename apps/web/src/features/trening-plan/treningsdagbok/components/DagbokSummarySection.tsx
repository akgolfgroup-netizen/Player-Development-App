/**
 * DagbokSummarySection
 *
 * Compact stats summary for the training period.
 * Shows totals, averages, and pyramid breakdown.
 */

import React from 'react';
import { Clock, Activity, Star, Flame } from 'lucide-react';

import type { DagbokSummarySectionProps, Pyramid } from '../types';
import { PYRAMIDS, PYRAMID_COLORS } from '../constants';

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '10px',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '12px',
    backgroundColor: 'var(--card-background)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-default)',
  },
  statIcon: {
    marginBottom: '6px',
    color: 'var(--text-tertiary)',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1.2,
  },
  statLabel: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  pyramidBreakdown: {
    backgroundColor: 'var(--card-background)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-default)',
    padding: '12px',
  },
  breakdownTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '10px',
  },
  breakdownGrid: {
    display: 'flex',
    gap: '8px',
  },
  pyramidItem: (pyramid: Pyramid) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '8px 4px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: PYRAMID_COLORS[pyramid].bg,
  }),
  pyramidIcon: {
    fontSize: '14px',
    marginBottom: '4px',
  },
  pyramidLabel: {
    fontSize: '9px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '2px',
  },
  pyramidValue: (pyramid: Pyramid) => ({
    fontSize: '14px',
    fontWeight: 700,
    color: PYRAMID_COLORS[pyramid].text,
    fontVariantNumeric: 'tabular-nums',
  }),
  pyramidSubvalue: {
    fontSize: '9px',
    color: 'var(--text-tertiary)',
  },
  skeletonCard: {
    height: '80px',
    backgroundColor: 'var(--skeleton-bg)',
    animation: 'pulse 1.5s ease-in-out infinite',
    borderRadius: 'var(--radius-md)',
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export const DagbokSummarySection: React.FC<DagbokSummarySectionProps> = ({
  stats,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={className} style={styles.container}>
        <div style={styles.statsRow}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={styles.skeletonCard} />
          ))}
        </div>
        <div style={{ ...styles.skeletonCard, height: '100px' }} />
      </div>
    );
  }

  const pyramidOrder: Pyramid[] = ['FYS', 'TEK', 'SLAG', 'SPILL', 'TURN'];

  return (
    <div className={className} style={styles.container}>
      {/* Top stats row */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <Activity size={16} style={styles.statIcon} />
          <span style={styles.statValue}>{stats.totalSessions}</span>
          <span style={styles.statLabel}>Okter</span>
        </div>

        <div style={styles.statCard}>
          <Clock size={16} style={styles.statIcon} />
          <span style={styles.statValue}>{stats.totalMinutes}</span>
          <span style={styles.statLabel}>Minutter</span>
        </div>

        <div style={styles.statCard}>
          <Flame size={16} style={styles.statIcon} />
          <span style={styles.statValue}>{stats.totalReps}</span>
          <span style={styles.statLabel}>Reps</span>
        </div>

        <div style={styles.statCard}>
          <Star size={16} style={{ ...styles.statIcon, color: 'var(--warning)' }} />
          <span style={styles.statValue}>
            {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '-'}
          </span>
          <span style={styles.statLabel}>Snittrating</span>
        </div>
      </div>

      {/* Pyramid breakdown */}
      <div style={styles.pyramidBreakdown}>
        <div style={styles.breakdownTitle}>Fordeling per kategori</div>
        <div style={styles.breakdownGrid}>
          {pyramidOrder.map((pyramid) => {
            const data = stats.byPyramid[pyramid];
            return (
              <div key={pyramid} style={styles.pyramidItem(pyramid)}>
                <span style={styles.pyramidIcon}>{PYRAMIDS[pyramid].icon}</span>
                <span style={styles.pyramidLabel}>{pyramid}</span>
                <span style={styles.pyramidValue(pyramid)}>{data.sessions}</span>
                <span style={styles.pyramidSubvalue}>
                  {data.minutes > 0 ? `${data.minutes}m` : '-'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DagbokSummarySection;
