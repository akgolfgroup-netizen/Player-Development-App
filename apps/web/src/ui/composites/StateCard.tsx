import React from 'react';
import Card from '../primitives/Card';

/**
 * StateCard
 * Reusable component for displaying loading, error, and empty states
 * Uses Card primitive with consistent styling
 */

interface StateCardProps {
  /** Main title/message */
  title: string;
  /** Optional description text */
  description?: string;
  /** Optional action button/element */
  action?: React.ReactNode;
  /** Visual variant */
  variant?: 'info' | 'error' | 'empty';
}

const StateCard: React.FC<StateCardProps> = ({
  title,
  description,
  action,
  variant = 'info',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'error':
        return {
          icon: styles.iconError,
          title: styles.titleError,
        };
      case 'empty':
        return {
          icon: styles.iconEmpty,
          title: styles.titleEmpty,
        };
      default:
        return {
          icon: styles.iconInfo,
          title: styles.titleInfo,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Card>
      <div style={styles.container}>
        <div style={{ ...styles.icon, ...variantStyles.icon }}>
          {variant === 'error' && '!'}
          {variant === 'empty' && '○'}
          {variant === 'info' && '…'}
        </div>
        <h3 style={{ ...styles.title, ...variantStyles.title }}>{title}</h3>
        {description && <p style={styles.description}>{description}</p>}
        {action && <div style={styles.action}>{action}</div>}
      </div>
    </Card>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-4)',
    textAlign: 'center',
    minHeight: '120px',
  },
  icon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--font-size-title2)',
    fontWeight: 600,
    marginBottom: 'var(--spacing-3)',
  },
  iconInfo: {
    backgroundColor: 'rgba(16, 69, 106, 0.1)',
    color: 'var(--ak-primary)',
  },
  iconError: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    color: 'var(--color-danger)',
  },
  iconEmpty: {
    backgroundColor: 'var(--background-surface)',
    color: 'var(--text-tertiary)',
  },
  title: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    margin: 0,
    marginBottom: 'var(--spacing-1)',
  },
  titleInfo: {
    color: 'var(--text-primary)',
  },
  titleError: {
    color: 'var(--color-danger)',
  },
  titleEmpty: {
    color: 'var(--text-secondary)',
  },
  description: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
    margin: 0,
    marginBottom: 'var(--spacing-3)',
    lineHeight: 1.4,
  },
  action: {
    marginTop: 'var(--spacing-2)',
  },
};

export default StateCard;
