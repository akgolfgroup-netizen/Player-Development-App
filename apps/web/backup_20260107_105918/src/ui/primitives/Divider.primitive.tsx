import React from 'react';

/**
 * Divider Primitive
 * Visual separator with optional label
 */

type DividerOrientation = 'horizontal' | 'vertical';
type DividerVariant = 'solid' | 'dashed' | 'dotted';

interface DividerProps {
  /** Orientation */
  orientation?: DividerOrientation;
  /** Visual variant */
  variant?: DividerVariant;
  /** Optional label */
  label?: string;
  /** Spacing around divider */
  spacing?: number;
  /** Custom color */
  color?: string;
  /** Additional className */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
}

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  label,
  spacing = 16,
  color = 'var(--border-default)',
  className = '',
  style = {},
}) => {
  const isHorizontal = orientation === 'horizontal';

  const dividerStyle: React.CSSProperties = {
    ...styles.base,
    ...(isHorizontal ? styles.horizontal : styles.vertical),
    borderColor: color,
    borderStyle: variant,
    ...(isHorizontal
      ? { marginTop: spacing, marginBottom: spacing }
      : { marginLeft: spacing, marginRight: spacing }),
    ...style,
  };

  if (label && isHorizontal) {
    return (
      <div style={styles.labelContainer} className={className}>
        <div
          style={{
            ...styles.line,
            borderColor: color,
            borderStyle: variant,
          }}
        />
        <span style={styles.label}>{label}</span>
        <div
          style={{
            ...styles.line,
            borderColor: color,
            borderStyle: variant,
          }}
        />
      </div>
    );
  }

  return <hr style={dividerStyle} className={className} />;
};

const styles: Record<string, React.CSSProperties> = {
  base: {
    margin: 0,
    border: 0,
  },
  horizontal: {
    borderTopWidth: '1px',
    width: '100%',
    height: 0,
  },
  vertical: {
    borderLeftWidth: '1px',
    height: '100%',
    width: 0,
    display: 'inline-block',
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    width: '100%',
  },
  line: {
    flex: 1,
    borderTopWidth: '1px',
    height: 0,
  },
  label: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
};

export default Divider;
