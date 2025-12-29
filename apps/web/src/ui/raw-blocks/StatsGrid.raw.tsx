import React from 'react';

/**
 * StatsGrid Raw Block
 * Responsive grid layout for displaying statistics
 */

interface StatItem {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  subtitle?: string;
}

interface StatsGridProps {
  /** Array of statistics to display */
  stats: StatItem[];
  /** Number of columns (auto-responsive if not specified) */
  columns?: 2 | 3 | 4;
  /** Compact mode for smaller displays */
  compact?: boolean;
  /** Show trend indicators */
  showTrend?: boolean;
  /** Click handler for stat items */
  onStatClick?: (stat: StatItem) => void;
}

const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  columns,
  compact = false,
  showTrend = true,
  onStatClick,
}) => {
  const gridStyle: React.CSSProperties = {
    ...styles.grid,
    ...(columns && { gridTemplateColumns: `repeat(${columns}, 1fr)` }),
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'var(--success)';
      case 'down':
        return 'var(--error)';
      default:
        return 'var(--text-secondary)';
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '−';
    }
  };

  return (
    <div style={gridStyle}>
      {stats.map((stat) => (
        <div
          key={stat.id}
          style={{
            ...styles.statCard,
            ...(compact && styles.statCardCompact),
            ...(onStatClick && styles.statCardClickable),
          }}
          onClick={() => onStatClick?.(stat)}
          role={onStatClick ? 'button' : undefined}
          tabIndex={onStatClick ? 0 : undefined}
        >
          {/* Icon */}
          {stat.icon && (
            <div style={styles.iconContainer}>
              {stat.icon}
            </div>
          )}

          {/* Value and Label */}
          <div style={styles.statContent}>
            <div style={{
              ...styles.value,
              ...(compact && styles.valueCompact),
            }}>
              {stat.value}
            </div>
            <div style={styles.label}>{stat.label}</div>
            {stat.subtitle && (
              <div style={styles.subtitle}>{stat.subtitle}</div>
            )}
          </div>

          {/* Trend Indicator */}
          {showTrend && stat.change !== undefined && (
            <div
              style={{
                ...styles.trend,
                color: getTrendColor(stat.trend),
              }}
            >
              <span style={styles.trendIcon}>{getTrendIcon(stat.trend)}</span>
              <span style={styles.trendValue}>
                {Math.abs(stat.change)}%
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 'var(--spacing-3)',
  },
  statCard: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-4)',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  },
  statCardCompact: {
    padding: 'var(--spacing-3)',
    gap: 'var(--spacing-1)',
  },
  statCardClickable: {
    cursor: 'pointer',
  },
  iconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'rgba(16, 69, 106, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--accent)',
  },
  statContent: {
    flex: 1,
  },
  value: {
    fontSize: 'var(--font-size-title2)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1.2,
    marginBottom: 'var(--spacing-1)',
  },
  valueCompact: {
    fontSize: 'var(--font-size-title3)',
  },
  label: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  subtitle: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
    marginTop: '2px',
  },
  trend: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
  },
  trendIcon: {
    fontSize: '14px',
  },
  trendValue: {
    // Inherits color from parent
  },
};

export default StatsGrid;
