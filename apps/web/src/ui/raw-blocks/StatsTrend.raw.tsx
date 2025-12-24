import React from 'react';

/**
 * StatsTrend Raw Block
 * Visual representation of statistical trends with sparkline
 */

interface DataPoint {
  value: number;
  label?: string;
  date?: string;
}

interface StatsTrendProps {
  /** Main metric value */
  value: string | number;
  /** Metric label */
  label: string;
  /** Data points for trend visualization */
  data: DataPoint[];
  /** Change percentage */
  change?: number;
  /** Trend direction */
  trend?: 'up' | 'down' | 'neutral';
  /** Color theme */
  color?: 'primary' | 'success' | 'warning' | 'error' | 'gold';
  /** Show sparkline chart */
  showChart?: boolean;
  /** Compact mode */
  compact?: boolean;
}

const StatsTrend: React.FC<StatsTrendProps> = ({
  value,
  label,
  data,
  change,
  trend,
  color = 'primary',
  showChart = true,
  compact = false,
}) => {
  const getColor = () => {
    switch (color) {
      case 'success':
        return 'var(--ak-success)';
      case 'warning':
        return 'var(--ak-warning)';
      case 'error':
        return 'var(--ak-error)';
      case 'gold':
        return 'var(--ak-gold)';
      default:
        return 'var(--ak-primary)';
    }
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'var(--ak-success)';
    if (trend === 'down') return 'var(--ak-error)';
    return 'var(--text-secondary)';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  // Calculate sparkline path
  const generateSparkline = () => {
    if (data.length < 2) return '';

    const width = 100;
    const height = 40;
    const padding = 4;

    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = height - padding - ((d.value - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  return (
    <div style={{
      ...styles.container,
      ...(compact && styles.containerCompact),
    }}>
      {/* Header: Value and Change */}
      <div style={styles.header}>
        <div>
          <div style={{
            ...styles.value,
            color: getColor(),
            ...(compact && styles.valueCompact),
          }}>
            {value}
          </div>
          <div style={styles.label}>{label}</div>
        </div>

        {change !== undefined && (
          <div style={{
            ...styles.change,
            color: getTrendColor(),
          }}>
            <span style={styles.trendIcon}>{getTrendIcon()}</span>
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>

      {/* Sparkline Chart */}
      {showChart && data.length > 1 && (
        <div style={styles.chartContainer}>
          <svg
            width="100%"
            height={compact ? "30" : "40"}
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            style={styles.chart}
          >
            {/* Background grid lines */}
            <line
              x1="0"
              y1="20"
              x2="100"
              y2="20"
              stroke="var(--border-subtle)"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />

            {/* Trend line */}
            <path
              d={generateSparkline()}
              fill="none"
              stroke={getColor()}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Area fill */}
            <path
              d={`${generateSparkline()} L 100,40 L 0,40 Z`}
              fill={getColor()}
              fillOpacity="0.1"
            />

            {/* Data points */}
            {!compact && data.map((d, i) => {
              const values = data.map(d => d.value);
              const min = Math.min(...values);
              const max = Math.max(...values);
              const range = max - min || 1;
              const x = (i / (data.length - 1)) * 96 + 4;
              const y = 36 - ((d.value - min) / range) * 32;

              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="2"
                  fill={getColor()}
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Data Range */}
      {!compact && data.length > 0 && (
        <div style={styles.range}>
          <span style={styles.rangeLabel}>
            {data[0].label || data[0].date || 'Start'}
          </span>
          <span style={styles.rangeLabel}>
            {data[data.length - 1].label || data[data.length - 1].date || 'End'}
          </span>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-4)',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  containerCompact: {
    padding: 'var(--spacing-3)',
    gap: 'var(--spacing-2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  value: {
    fontSize: 'var(--font-size-title2)',
    fontWeight: 700,
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
  change: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    fontSize: 'var(--font-size-subheadline)',
    fontWeight: 600,
    padding: 'var(--spacing-1) var(--spacing-2)',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  trendIcon: {
    fontSize: '16px',
  },
  chartContainer: {
    width: '100%',
    height: 'auto',
  },
  chart: {
    display: 'block',
    width: '100%',
  },
  range: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 'var(--spacing-1)',
  },
  rangeLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
};

export default StatsTrend;
