import React from 'react';

/**
 * ProgressBar Primitive
 *
 * Linear progress indicator with semantic color options.
 *
 * UI Canon v1.2 Compliance:
 * - Uses brand primary for standard progress (NOT gold)
 * - Gold reserved for achievement completion only
 * - No decorative gradients
 * - Accessible (role="progressbar" with aria attributes)
 *
 * IMPORTANT: Gold color is ONLY allowed when:
 * - This represents an earned achievement/badge
 * - It's the single gold element in the viewport
 */

type ProgressVariant = 'default' | 'success' | 'warning' | 'error' | 'achievement';
type ProgressSize = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  /** Current progress value (0-100) */
  value: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Visual variant */
  variant?: ProgressVariant;
  /** Size of the progress bar */
  size?: ProgressSize;
  /** Show percentage label */
  showLabel?: boolean;
  /** Custom label format */
  labelFormat?: (value: number, max: number) => string;
  /** Animated fill transition */
  animated?: boolean;
  /** Additional className */
  className?: string;
  /** Accessible label */
  ariaLabel?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  labelFormat,
  animated = true,
  className = '',
  ariaLabel,
}) => {
  // Clamp value between 0 and max
  const clampedValue = Math.min(Math.max(0, value), max);
  const percentage = (clampedValue / max) * 100;

  // Generate label
  const getLabel = (): string => {
    if (labelFormat) {
      return labelFormat(clampedValue, max);
    }
    return `${Math.round(percentage)}%`;
  };

  const heightStyles = getSizeStyles(size);
  const fillColor = getVariantColor(variant);

  return (
    <div className={className} style={styles.container}>
      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel || `Progress: ${Math.round(percentage)}%`}
        style={{
          ...styles.track,
          height: heightStyles.height,
          borderRadius: heightStyles.borderRadius,
        }}
      >
        <div
          style={{
            ...styles.fill,
            width: `${percentage}%`,
            backgroundColor: fillColor,
            borderRadius: heightStyles.borderRadius,
            transition: animated ? 'width 0.3s ease' : 'none',
          }}
        />
      </div>

      {/* Label */}
      {showLabel && (
        <span style={styles.label}>{getLabel()}</span>
      )}
    </div>
  );
};

const getSizeStyles = (size: ProgressSize) => {
  const sizes = {
    sm: { height: '4px', borderRadius: '2px' },
    md: { height: '8px', borderRadius: '4px' },
    lg: { height: '12px', borderRadius: '6px' },
  };
  return sizes[size];
};

const getVariantColor = (variant: ProgressVariant): string => {
  const colors = {
    default: 'var(--ak-primary)',
    success: 'var(--ak-success)',
    warning: 'var(--ak-warning)',
    error: 'var(--ak-error)',
    // IMPORTANT: Only use for earned achievements
    // Must be the single gold element in viewport
    achievement: 'var(--ak-gold)',
  };
  return colors[variant];
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    width: '100%',
  },
  track: {
    flex: 1,
    backgroundColor: 'var(--background-elevated)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    minWidth: 0,
  },
  label: {
    fontSize: 'var(--font-size-caption1)',
    lineHeight: 'var(--line-height-caption1)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    fontVariantNumeric: 'tabular-nums',
    flexShrink: 0,
    minWidth: '36px',
    textAlign: 'right',
  },
};

export default ProgressBar;

/**
 * SegmentedProgressBar
 *
 * Multi-segment progress bar for displaying multiple metrics.
 */
interface Segment {
  value: number;
  color: string;
  label?: string;
}

interface SegmentedProgressBarProps {
  /** Progress segments */
  segments: Segment[];
  /** Total/max value */
  total: number;
  /** Size of the progress bar */
  size?: ProgressSize;
  /** Additional className */
  className?: string;
}

export const SegmentedProgressBar: React.FC<SegmentedProgressBarProps> = ({
  segments,
  total,
  size = 'md',
  className = '',
}) => {
  const heightStyles = getSizeStyles(size);

  return (
    <div
      className={className}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      style={{
        ...styles.track,
        height: heightStyles.height,
        borderRadius: heightStyles.borderRadius,
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {segments.map((segment, index) => {
        const percentage = (segment.value / total) * 100;
        return (
          <div
            key={index}
            title={segment.label}
            style={{
              width: `${percentage}%`,
              height: '100%',
              backgroundColor: segment.color,
              transition: 'width 0.3s ease',
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * CircularProgress
 *
 * Circular progress indicator for compact displays.
 */
interface CircularProgressProps {
  /** Current progress value (0-100) */
  value: number;
  /** Size in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Visual variant */
  variant?: ProgressVariant;
  /** Show percentage in center */
  showLabel?: boolean;
  /** Additional className */
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 48,
  strokeWidth = 4,
  variant = 'default',
  showLabel = true,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedValue = Math.min(Math.max(0, value), 100);
  const offset = circumference - (clampedValue / 100) * circumference;
  const fillColor = getVariantColor(variant);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--background-elevated)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>
      {showLabel && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size > 40 ? 'var(--font-size-footnote)' : 'var(--font-size-caption2)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {Math.round(clampedValue)}%
        </div>
      )}
    </div>
  );
};
