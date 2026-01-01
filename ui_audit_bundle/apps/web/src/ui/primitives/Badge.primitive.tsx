import React from 'react';

/**
 * Badge Primitive
 * Status indicators and labels
 *
 * UI Canon:
 * - Consistent use of semantic tokens
 * - Subtle backgrounds (10% opacity of semantic color)
 * - Uppercase text for emphasis
 * - Sizes: sm, md
 */

type BadgeVariant = 'neutral' | 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'achievement';
type BadgeSize = 'sm' | 'md';

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
  variant = 'neutral',
  size = 'md',
  dot = false,
  pill = false,
  className = '',
  style = {},
}) => {
  const badgeStyle: React.CSSProperties = {
    ...styles.base,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(pill && styles.pill),
    ...style,
  };

  return (
    <span style={badgeStyle} className={className}>
      {dot && <span style={{ ...styles.dot, ...dotVariantStyles[variant] }} />}
      {children}
    </span>
  );
};

const styles: Record<string, React.CSSProperties> = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    fontFamily: 'inherit',
    fontWeight: 600,
    borderRadius: 'var(--radius-sm)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
  },
  pill: {
    borderRadius: 'var(--radius-full)',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
  },
};

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  neutral: {
    backgroundColor: 'var(--bg-neutral-subtle)',
    color: 'var(--text-secondary)',
  },
  default: {
    backgroundColor: 'var(--bg-neutral-subtle)',
    color: 'var(--text-secondary)',
  },
  primary: {
    backgroundColor: 'var(--bg-accent-subtle)',
    color: 'var(--accent)',
  },
  accent: {
    backgroundColor: 'var(--bg-accent-subtle)',
    color: 'var(--accent)',
  },
  success: {
    backgroundColor: 'color-mix(in srgb, var(--success) 15%, transparent)',
    color: 'var(--success)',
  },
  warning: {
    backgroundColor: 'color-mix(in srgb, var(--warning) 15%, transparent)',
    color: 'var(--warning)',
  },
  error: {
    backgroundColor: 'color-mix(in srgb, var(--error) 15%, transparent)',
    color: 'var(--error)',
  },
  achievement: {
    backgroundColor: 'var(--bg-achievement-subtle)',
    color: 'var(--achievement)',
  },
};

const dotVariantStyles: Record<BadgeVariant, React.CSSProperties> = {
  neutral: { backgroundColor: 'var(--text-tertiary)' },
  default: { backgroundColor: 'var(--text-tertiary)' },
  primary: { backgroundColor: 'var(--accent)' },
  accent: { backgroundColor: 'var(--accent)' },
  success: { backgroundColor: 'var(--success)' },
  warning: { backgroundColor: 'var(--warning)' },
  error: { backgroundColor: 'var(--error)' },
  achievement: { backgroundColor: 'var(--achievement)' },
};

const sizeStyles: Record<BadgeSize, React.CSSProperties> = {
  sm: {
    padding: '2px var(--spacing-2)',
    fontSize: 'var(--font-size-caption2)',
  },
  md: {
    padding: 'var(--spacing-1) var(--spacing-2)',
    fontSize: 'var(--font-size-caption1)',
  },
};

export default Badge;
