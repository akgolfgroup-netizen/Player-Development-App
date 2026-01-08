/**
 * DagbokComplianceBand
 *
 * Visual bar showing planned vs actual training.
 * Shows compliance rate as a percentage.
 */

import React from 'react';
import { Target, TrendingUp } from 'lucide-react';

import type { DagbokComplianceBandProps } from '../types';

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  container: {
    padding: '16px',
    backgroundColor: 'var(--card-background)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-default)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  complianceValue: (rate: number) => ({
    fontSize: '14px',
    fontWeight: 700,
    color: rate >= 80 ? 'var(--success)' : rate >= 50 ? 'var(--warning)' : 'var(--error)',
    fontVariantNumeric: 'tabular-nums',
  }),
  barContainer: {
    height: '24px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden',
    position: 'relative' as const,
    marginBottom: '12px',
  },
  plannedBar: (width: number) => ({
    position: 'absolute' as const,
    top: 0,
    left: 0,
    height: '100%',
    width: `${Math.min(100, width)}%`,
    backgroundColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
    borderRadius: 'var(--radius-sm)',
    transition: 'width 300ms ease',
  }),
  actualBar: (width: number, complianceRate: number) => ({
    position: 'absolute' as const,
    top: 0,
    left: 0,
    height: '100%',
    width: `${Math.min(100, width)}%`,
    backgroundColor: complianceRate >= 80
      ? 'var(--success)'
      : complianceRate >= 50
        ? 'var(--warning)'
        : 'var(--error)',
    borderRadius: 'var(--radius-sm)',
    transition: 'width 300ms ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '8px',
  }),
  barLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-inverted)',
  },
  legend: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendDot: (color: string) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: color,
  }),
  legendText: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  legendValue: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    fontVariantNumeric: 'tabular-nums',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid var(--border-subtle)',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '2px',
  },
  statValue: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontVariantNumeric: 'tabular-nums',
  },
  statLabel: {
    fontSize: '10px',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export const DagbokComplianceBand: React.FC<DagbokComplianceBandProps> = ({
  plannedMinutes,
  actualMinutes,
  plannedSessions,
  actualSessions,
  complianceRate,
  className = '',
}) => {
  // Calculate bar widths based on max of planned/actual
  const maxMinutes = Math.max(plannedMinutes, actualMinutes, 1);
  const plannedWidth = (plannedMinutes / maxMinutes) * 100;
  const actualWidth = (actualMinutes / maxMinutes) * 100;

  return (
    <div className={className} style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <Target size={16} style={{ color: 'var(--text-secondary)' }} />
          <span style={styles.title}>Etterlevelse</span>
        </div>
        <span style={styles.complianceValue(complianceRate)}>
          {complianceRate}%
        </span>
      </div>

      {/* Progress bar */}
      <div style={styles.barContainer}>
        {/* Planned (background) */}
        <div style={styles.plannedBar(plannedWidth)} />
        {/* Actual (foreground) */}
        <div style={styles.actualBar(actualWidth, complianceRate)}>
          {actualWidth > 15 && (
            <span style={styles.barLabel}>{actualMinutes} min</span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={styles.legendDot('color-mix(in srgb, var(--accent) 30%, transparent)')} />
          <span style={styles.legendText}>Planlagt:</span>
          <span style={styles.legendValue}>{plannedMinutes} min</span>
        </div>
        <div style={styles.legendItem}>
          <div style={styles.legendDot(
            complianceRate >= 80 ? 'var(--success)' :
            complianceRate >= 50 ? 'var(--warning)' : 'var(--error)'
          )} />
          <span style={styles.legendText}>Gjennomfort:</span>
          <span style={styles.legendValue}>{actualMinutes} min</span>
        </div>
      </div>

      {/* Session stats */}
      <div style={styles.stats}>
        <div style={styles.statItem}>
          <span style={styles.statValue}>{plannedSessions}</span>
          <span style={styles.statLabel}>Planlagte økter</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statValue}>{actualSessions}</span>
          <span style={styles.statLabel}>Gjennomførte</span>
        </div>
        <div style={styles.statItem}>
          <span style={{
            ...styles.statValue,
            color: complianceRate >= 80 ? 'var(--success)' :
                   complianceRate >= 50 ? 'var(--warning)' : 'var(--error)',
          }}>
            {complianceRate >= 100 ? (
              <TrendingUp size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            ) : null}
            {complianceRate}%
          </span>
          <span style={styles.statLabel}>Etterlevelse</span>
        </div>
      </div>
    </div>
  );
};

export default DagbokComplianceBand;
