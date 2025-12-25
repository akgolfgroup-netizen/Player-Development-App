import React from 'react';
import { CardSimple } from '../raw-blocks';

/**
 * DashboardCard
 * Unified card wrapper for dashboard widgets with consistent styling
 * Extends CardSimple with optional click handler and footer actions
 */

interface DashboardCardProps {
  /** Card content */
  children: React.ReactNode;
  /** Optional click handler (makes card clickable) */
  onClick?: () => void;
  /** Additional className */
  className?: string;
  /** Optional footer content (typically action buttons) */
  footer?: React.ReactNode;
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  children,
  onClick,
  className = '',
  footer,
  padding = 'lg',
}) => {
  const cardStyle: React.CSSProperties = {
    ...styles.card,
    ...(onClick && styles.clickableCard),
  };

  const containerStyle: React.CSSProperties = {
    ...styles.container,
    ...styles.padding[padding],
  };

  return (
    <div style={cardStyle} onClick={onClick} className={className}>
      <div style={containerStyle}>{children}</div>
      {footer && <div style={styles.footer}>{footer}</div>}
    </div>
  );
};

const styles: Record<string, React.CSSProperties | Record<string, React.CSSProperties>> = {
  card: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  clickableCard: {
    cursor: 'pointer',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  container: {
    width: '100%',
  },
  padding: {
    none: { padding: 0 },
    sm: { padding: 'var(--spacing-3)' },
    md: { padding: 'var(--spacing-4)' },
    lg: { padding: 'var(--spacing-5)' },
  },
  footer: {
    borderTop: '1px solid var(--border-subtle)',
    padding: 'var(--spacing-4) var(--spacing-5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 'var(--spacing-3)',
  },
};

export default DashboardCard;
