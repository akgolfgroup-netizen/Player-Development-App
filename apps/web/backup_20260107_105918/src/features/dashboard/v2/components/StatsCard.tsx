import React from 'react';
import Card from '../../../../ui/primitives/Card';

/**
 * StatsCard
 *
 * Single metric card for displaying key performance indicators.
 * Uses monospace numerals for data legibility.
 *
 * Design principles:
 * - Value is dominant (large, bold)
 * - Change indicator uses semantic status colors
 * - Minimal chrome, maximum data clarity
 * - Touch-friendly (min 44px height)
 */

type TrendDirection = 'up' | 'down' | 'neutral';

interface StatsCardProps {
  /** Metric label (e.g., "Treningsøkter") */
  label: string;
  /** Primary value (e.g., "12", "67.3") */
  value: string | number;
  /** Unit suffix (e.g., "timer", "%") */
  unit?: string;
  /** Change from previous period */
  change?: {
    value: string | number;
    direction: TrendDirection;
    label?: string; // e.g., "vs. forrige uke"
  };
  /** Optional icon component */
  icon?: React.ReactNode;
  /** Click handler for drill-down */
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  unit,
  change,
  icon,
  onClick,
}) => {
  const getTrendColor = (direction: TrendDirection): string => {
    switch (direction) {
      case 'up':
        return 'rgb(var(--status-success))';
      case 'down':
        return 'rgb(var(--status-error))';
      default:
        return 'var(--text-tertiary)';
    }
  };

  const getTrendSymbol = (direction: TrendDirection): string => {
    switch (direction) {
      case 'up':
        return '+';
      case 'down':
        return '−'; // Using proper minus sign (U+2212)
      default:
        return '';
    }
  };

  return (
    <Card
      variant="default"
      padding="md"
      onClick={onClick}
      style={onClick ? styles.clickable : undefined}
    >
      {/* Header row: Label + Icon */}
      <div style={styles.header}>
        <span style={styles.label}>{label}</span>
        {icon && <span style={styles.iconWrapper}>{icon}</span>}
      </div>

      {/* Value row */}
      <div style={styles.valueRow}>
        <span style={styles.value}>{value}</span>
        {unit && <span style={styles.unit}>{unit}</span>}
      </div>

      {/* Change indicator */}
      {change && (
        <div style={styles.changeRow}>
          <span
            style={{
              ...styles.changeValue,
              color: getTrendColor(change.direction),
            }}
          >
            {getTrendSymbol(change.direction)}{change.value}
          </span>
          {change.label && (
            <span style={styles.changeLabel}>{change.label}</span>
          )}
        </div>
      )}
    </Card>
  );
};

const styles: Record<string, React.CSSProperties> = {
  clickable: {
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--spacing-2)',
  },
  label: {
    fontSize: 'var(--font-size-caption1)',
    lineHeight: 'var(--line-height-caption1)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-tertiary)',
  },
  valueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },
  value: {
    fontSize: 'var(--font-size-title1)',
    lineHeight: 'var(--line-height-title1)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontVariantNumeric: 'tabular-nums',
  },
  unit: {
    fontSize: 'var(--font-size-footnote)',
    lineHeight: 'var(--line-height-footnote)',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
  },
  changeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    marginTop: 'var(--spacing-2)',
  },
  changeValue: {
    fontSize: 'var(--font-size-footnote)',
    lineHeight: 'var(--line-height-footnote)',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
  changeLabel: {
    fontSize: 'var(--font-size-caption1)',
    lineHeight: 'var(--line-height-caption1)',
    color: 'var(--text-tertiary)',
  },
};

export default StatsCard;

/**
 * StatsGrid
 *
 * 2x2 grid container for StatsCards.
 * Maintains consistent spacing and alignment.
 */
interface StatsGridProps {
  children: React.ReactNode;
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ children, className = '' }) => {
  return (
    <div className={className} style={statsGridStyles.grid}>
      {children}
    </div>
  );
};

const statsGridStyles: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--spacing-3)',
  },
};
