import React from 'react';

/**
 * Spinner Primitive
 * Loading spinner with multiple variants
 */

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'circular' | 'dots' | 'pulse';

interface SpinnerProps {
  /** Size variant */
  size?: SpinnerSize;
  /** Visual variant */
  variant?: SpinnerVariant;
  /** Custom color */
  color?: string;
  /** Label for accessibility */
  label?: string;
  /** Additional className */
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'circular',
  color = 'var(--ak-primary)',
  label = 'Loading',
  className = '',
}) => {
  const sizeValue = sizes[size];

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div style={styles.dotsContainer}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  ...styles.dot,
                  backgroundColor: color,
                  width: sizeValue / 4,
                  height: sizeValue / 4,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div
            style={{
              ...styles.pulse,
              width: sizeValue,
              height: sizeValue,
              backgroundColor: color,
            }}
          />
        );

      default:
        return (
          <svg
            width={sizeValue}
            height={sizeValue}
            viewBox="0 0 50 50"
            style={styles.circular}
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="31.4 31.4"
            />
          </svg>
        );
    }
  };

  return (
    <div
      style={styles.container}
      className={className}
      role="status"
      aria-label={label}
    >
      {renderSpinner()}
      <span style={styles.srOnly}>{label}</span>
    </div>
  );
};

const sizes: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circular: {
    animation: 'spin 0.8s linear infinite',
  },
  dotsContainer: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },
  dot: {
    borderRadius: '50%',
    animation: 'pulse 1.4s ease-in-out infinite',
  },
  pulse: {
    borderRadius: '50%',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
};

export default Spinner;
