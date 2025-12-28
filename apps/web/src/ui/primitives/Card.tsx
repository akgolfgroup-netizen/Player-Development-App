import React from 'react';

/**
 * Card Primitive
 * Basic card container with consistent styling
 *
 * UI Canon v1.2 (Apple/Stripe):
 * - Radius: 20px (--radius-xl) - premium rounded corners
 * - Default: soft shadow, thin border for definition
 * - Outlined: 1px border, no shadow
 * - Flat: no shadow, muted bg (for nested cards)
 * - Elevated: stronger shadow for hover/interactive states
 * - Padding: default 20px, compact 12px, spacious 24px
 */

type CardVariant = 'default' | 'outlined' | 'flat' | 'elevated' | 'accent';
type CardPadding = 'none' | 'compact' | 'default' | 'spacious';

interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Optional header section */
  header?: React.ReactNode;
  /** Optional footer section */
  footer?: React.ReactNode;
  /** Card variant */
  variant?: CardVariant;
  /** Padding size */
  padding?: CardPadding;
  /** Additional className */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Click handler */
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  variant = 'default',
  padding = 'default',
  className = '',
  style = {},
  onClick,
}) => {
  const cardStyle: React.CSSProperties = {
    ...styles.base,
    ...variantStyles[variant],
    ...paddingStyles[padding],
    ...(onClick && styles.clickable),
    ...style,
  };

  // Add interactive class for hover/active effects on clickable cards
  const cardClasses = [
    className,
    onClick ? 'card-interactive' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      style={cardStyle}
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {header && <div style={styles.header}>{header}</div>}
      {children}
      {footer && <div style={styles.footer}>{footer}</div>}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  base: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-xl)', // 20px - Apple/Stripe premium
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
  },
  header: {
    marginBottom: 'var(--spacing-3)',
    paddingBottom: 'var(--spacing-2)',
    borderBottom: '1px solid var(--color-border)',
  },
  footer: {
    marginTop: 'var(--spacing-3)',
    paddingTop: 'var(--spacing-2)',
    borderTop: '1px solid var(--color-border)',
  },
  clickable: {
    cursor: 'pointer',
  },
};

const variantStyles: Record<CardVariant, React.CSSProperties> = {
  default: {
    boxShadow: 'var(--shadow-card)',
    border: '1px solid transparent', // Subtle definition
  },
  outlined: {
    boxShadow: 'none',
    border: '1px solid var(--color-border)',
  },
  flat: {
    boxShadow: 'none',
    border: 'none',
    backgroundColor: 'var(--color-surface-2)',
  },
  elevated: {
    boxShadow: 'var(--shadow-elevated)',
    border: '1px solid transparent',
  },
  accent: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-primary-foreground)',
    boxShadow: 'var(--shadow-card)',
    border: 'none',
  },
};

const paddingStyles: Record<CardPadding, React.CSSProperties> = {
  none: {
    padding: 0,
  },
  compact: {
    padding: 'var(--spacing-3)', // 12px
  },
  default: {
    padding: 'var(--spacing-5)', // 20px
  },
  spacious: {
    padding: 'var(--spacing-6)', // 24px
  },
};

export default Card;
