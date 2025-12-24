import React from 'react';

/**
 * Badge Primitive
 * Status indicators and labels
 */

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'gold';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Visual variant */
  variant?: BadgeVariant;
  /** Size variant */
  size?: BadgeSize;
  /** Dot indicator */
  dot?: boolean;
  /** Rounded pill style */
  pill?: boolean;
  /** Additional className */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pill = false,
  className = '',
  style = {},
}) => {
  const badgeStyle: React.CSSProperties = {
    ...styles.base,
    ...styles.variants[variant],
    ...styles.sizes[size],
    ...(pill && styles.pill),
    ...style,
  };

  return (
    <span style={badgeStyle} className={className}>
      {dot && <span style={styles.dot} />}
      {children}
    </span>
  );
};

const styles: Record<string, React.CSSProperties | Record<string, React.CSSProperties>> = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    fontFamily: 'var(--font-family)',
    fontWeight: 600,
    borderRadius: 'var(--radius-sm)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,
  variants: {
    default: {
      backgroundColor: 'var(--gray-100)',
      color: 'var(--text-secondary)',
    },
    primary: {
      backgroundColor: 'rgba(16, 69, 106, 0.1)',
      color: 'var(--ak-primary)',
    },
    success: {
      backgroundColor: 'rgba(74, 124, 89, 0.1)',
      color: 'var(--ak-success)',
    },
    warning: {
      backgroundColor: 'rgba(212, 168, 75, 0.1)',
      color: 'var(--ak-warning)',
    },
    error: {
      backgroundColor: 'rgba(196, 91, 78, 0.1)',
      color: 'var(--ak-error)',
    },
    gold: {
      backgroundColor: 'rgba(201, 162, 39, 0.1)',
      color: 'var(--ak-gold)',
    },
  },
  sizes: {
    sm: {
      padding: '2px var(--spacing-2)',
      fontSize: 'var(--font-size-caption2)',
    },
    md: {
      padding: 'var(--spacing-1) var(--spacing-2)',
      fontSize: 'var(--font-size-caption1)',
    },
    lg: {
      padding: 'var(--spacing-1) var(--spacing-3)',
      fontSize: 'var(--font-size-footnote)',
    },
  },
  pill: {
    borderRadius: 'var(--radius-full)',
  } as React.CSSProperties,
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  } as React.CSSProperties,
};

export default Badge;
