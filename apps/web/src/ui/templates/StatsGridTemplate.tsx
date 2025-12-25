import React from 'react';
import Card from '../primitives/Card';

/**
 * StatsGridTemplate
 * Unified template for displaying statistics in a responsive grid
 * Supports both simple stat cards and cards with change indicators
 */

export interface StatsItem {
  id: string;
  label: string;
  value: string | number;
  sublabel?: string;
  change?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
}

interface StatsGridTemplateProps {
  /** Array of statistics to display */
  items: StatsItem[];
  /** Number of columns (auto-responsive if not specified) */
  columns?: 2 | 3 | 4;
  /** Additional CSS class name */
  className?: string;
}

const StatsGridTemplate: React.FC<StatsGridTemplateProps> = ({
  items,
  columns,
  className = '',
}) => {
  const gridStyle: React.CSSProperties = {
    ...styles.grid,
    ...(columns && { gridTemplateColumns: `repeat(${columns}, 1fr)` }),
  };

  const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return 'var(--ak-success)';
      case 'down':
        return 'var(--ak-error)';
      default:
        return 'var(--text-secondary)';
    }
  };

  const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '−';
    }
  };

  return (
    <div style={gridStyle} className={className}>
      {items.map((item) => (
        <Card key={item.id} style={styles.statCardLayout}>
          {/* Value and Label */}
          <div style={styles.statContent}>
            <div style={styles.value}>{item.value}</div>
            <div style={styles.label}>{item.label}</div>
            {item.sublabel && (
              <div style={styles.sublabel}>{item.sublabel}</div>
            )}
          </div>

          {/* Change Indicator */}
          {item.change && (
            <div
              style={{
                ...styles.trend,
                color: getTrendColor(item.change.direction),
              }}
            >
              <span style={styles.trendIcon}>
                {getTrendIcon(item.change.direction)}
              </span>
              <span style={styles.trendValue}>{item.change.value}</span>
            </div>
          )}
        </Card>
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
  statCardLayout: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
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
  label: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  sublabel: {
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
    fontSize: 'var(--font-size-footnote)',
  },
  trendValue: {
    // Inherits color from parent
  },
};

export default StatsGridTemplate;
