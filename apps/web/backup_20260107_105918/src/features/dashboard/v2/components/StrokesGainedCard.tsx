import React from 'react';
import Card from '../../../../ui/primitives/Card';
import { SubSectionTitle } from '../../../../components/typography';

/**
 * StrokesGainedCard
 *
 * Visualization of Strokes Gained metrics with centerline bar chart.
 * Positive values extend right (green), negative extend left (red).
 *
 * Design principles:
 * - Zero line is the visual anchor
 * - Color only used for semantic meaning (pos/neg)
 * - Values use tabular numerals
 * - Minimal decoration
 */

interface StrokesGainedMetric {
  id: string;
  label: string;
  value: number; // Can be positive or negative
  benchmark?: number; // e.g., scratch golfer = 0
}

interface StrokesGainedCardProps {
  /** Card title */
  title?: string;
  /** Subtitle/context (e.g., "Siste 20 runder") */
  subtitle?: string;
  /** Metrics to display */
  metrics: StrokesGainedMetric[];
  /** Total strokes gained */
  total?: number;
  /** Max absolute value for scaling (auto-calculated if not provided) */
  maxValue?: number;
  /** Click handler for details */
  onViewDetails?: () => void;
}

const StrokesGainedCard: React.FC<StrokesGainedCardProps> = ({
  title = 'Strokes Gained',
  subtitle,
  metrics,
  total,
  maxValue: providedMaxValue,
  onViewDetails,
}) => {
  // Calculate max value for scaling
  const maxValue = providedMaxValue || Math.max(
    ...metrics.map(m => Math.abs(m.value)),
    0.5 // Minimum scale
  );

  // Calculate bar width percentage (max 45% on each side)
  const getBarWidth = (value: number): number => {
    return Math.min(Math.abs(value) / maxValue * 45, 45);
  };

  return (
    <Card variant="default" padding="none">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <SubSectionTitle style={styles.title}>{title}</SubSectionTitle>
          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
        </div>
        {onViewDetails && (
          <button style={styles.detailsButton} onClick={onViewDetails}>
            Detaljer
          </button>
        )}
      </div>

      {/* Metrics */}
      <div style={styles.metricsContainer}>
        {metrics.map((metric) => (
          <div key={metric.id} style={styles.metricRow}>
            {/* Label */}
            <span style={styles.metricLabel}>{metric.label}</span>

            {/* Bar chart */}
            <div style={styles.barContainer}>
              {/* Negative bar (left side) */}
              <div style={styles.negativeBarArea}>
                {metric.value < 0 && (
                  <div
                    style={{
                      ...styles.bar,
                      ...styles.negativeBar,
                      width: `${getBarWidth(metric.value)}%`,
                    }}
                  />
                )}
              </div>

              {/* Center line */}
              <div style={styles.centerLine} />

              {/* Positive bar (right side) */}
              <div style={styles.positiveBarArea}>
                {metric.value > 0 && (
                  <div
                    style={{
                      ...styles.bar,
                      ...styles.positiveBar,
                      width: `${getBarWidth(metric.value)}%`,
                    }}
                  />
                )}
              </div>
            </div>

            {/* Value */}
            <span
              style={{
                ...styles.metricValue,
                color: metric.value >= 0
                  ? 'rgb(var(--status-success))'
                  : 'rgb(var(--status-error))',
              }}
            >
              {metric.value >= 0 ? '+' : ''}{metric.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Total (if provided) */}
      {typeof total === 'number' && (
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Total SG</span>
          <span
            style={{
              ...styles.totalValue,
              color: total >= 0
                ? 'rgb(var(--status-success))'
                : 'rgb(var(--status-error))',
            }}
          >
            {total >= 0 ? '+' : ''}{total.toFixed(2)}
          </span>
        </div>
      )}
    </Card>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 'var(--spacing-4)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  title: {
    fontSize: 'var(--font-size-headline)',
    lineHeight: 'var(--line-height-headline)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  subtitle: {
    fontSize: 'var(--font-size-caption1)',
    lineHeight: 'var(--line-height-caption1)',
    color: 'var(--text-tertiary)',
    margin: '2px 0 0 0',
  },
  detailsButton: {
    fontSize: 'var(--font-size-footnote)',
    lineHeight: 'var(--line-height-footnote)',
    fontWeight: 500,
    color: 'var(--text-brand)',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '4px 8px',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
  },
  metricsContainer: {
    padding: 'var(--spacing-4)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  metricRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    minHeight: '28px',
  },
  metricLabel: {
    width: '80px',
    fontSize: 'var(--font-size-footnote)',
    lineHeight: 'var(--line-height-footnote)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    flexShrink: 0,
  },
  barContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    height: '20px',
    position: 'relative',
  },
  negativeBarArea: {
    flex: 1,
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  positiveBarArea: {
    flex: 1,
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  centerLine: {
    width: '2px',
    height: '24px',
    backgroundColor: 'var(--border-strong)',
    flexShrink: 0,
  },
  bar: {
    height: '16px',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  positiveBar: {
    backgroundColor: 'rgb(var(--status-success))',
    opacity: 0.8,
    marginLeft: '2px',
  },
  negativeBar: {
    backgroundColor: 'rgb(var(--status-error))',
    opacity: 0.8,
    marginRight: '2px',
  },
  metricValue: {
    width: '56px',
    fontSize: 'var(--font-size-footnote)',
    lineHeight: 'var(--line-height-footnote)',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
    textAlign: 'right',
    flexShrink: 0,
  },
  totalRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-4)',
    borderTop: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--background-surface)',
  },
  totalLabel: {
    fontSize: 'var(--font-size-subheadline)',
    lineHeight: 'var(--line-height-subheadline)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  totalValue: {
    fontSize: 'var(--font-size-title3)',
    lineHeight: 'var(--line-height-title3)',
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
  },
};

export default StrokesGainedCard;
