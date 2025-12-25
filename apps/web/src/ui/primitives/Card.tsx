import React from 'react';

/**
 * Card Primitive
 * Basic card container with consistent styling
 * Extracted from StatsGridTemplate and CalendarTemplate patterns
 */

interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Optional header section */
  header?: React.ReactNode;
  /** Optional footer section */
  footer?: React.ReactNode;
  /** Card variant */
  variant?: 'default' | 'outlined' | 'accent';
  /** Additional className */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  variant = 'default',
  className = '',
  style = {},
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'outlined':
        return {
          ...styles.base,
          boxShadow: 'none',
          border: '1px solid var(--border-subtle)',
        };
      case 'accent':
        return {
          ...styles.base,
          backgroundColor: 'var(--ak-primary)',
          color: 'var(--text-inverse)',
        };
      default:
        return styles.base;
    }
  };

  return (
    <div style={{ ...getVariantStyles(), ...style }} className={className}>
      {header && <div style={styles.header}>{header}</div>}
      {children}
      {footer && <div style={styles.footer}>{footer}</div>}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  base: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-4)',
    boxShadow: 'var(--shadow-card)',
  },
  header: {
    marginBottom: 'var(--spacing-3)',
    paddingBottom: 'var(--spacing-2)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  footer: {
    marginTop: 'var(--spacing-3)',
    paddingTop: 'var(--spacing-2)',
    borderTop: '1px solid var(--border-subtle)',
  },
};

export default Card;
