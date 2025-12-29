import React from 'react';
import Card from '../primitives/Card';
import { LucideIcon } from 'lucide-react';

/**
 * StateCard
 * Reusable component for displaying loading, error, and empty states
 *
 * UI Canon:
 * - Uses Card primitive as base
 * - Consistent use of semantic tokens
 * - Three variants: info, error, empty
 */

interface StateCardProps {
  /** Main title/message */
  title: string;
  /** Optional description text */
  description?: string;
  /** Optional action button/element */
  action?: React.ReactNode;
  /** Visual variant */
  variant?: 'info' | 'error' | 'empty' | 'loading';
  /** Compact mode (less padding) */
  compact?: boolean;
  /** Optional custom icon (Lucide icon component) */
  icon?: LucideIcon;
}

const StateCard: React.FC<StateCardProps> = ({
  title,
  description,
  action,
  variant = 'info',
  compact = false,
  icon: IconComponent,
}) => {
  const variantConfig = variantStyles[variant];

  const renderIcon = () => {
    if (IconComponent) {
      return <IconComponent size={20} />;
    }
    if (variant === 'error') return '!';
    if (variant === 'empty') return '○';
    if (variant === 'info') return 'ℹ';
    if (variant === 'loading') return <span style={styles.spinner} />;
    return null;
  };

  return (
    <Card padding={compact ? 'compact' : 'default'}>
      <div style={styles.container}>
        <div style={{ ...styles.icon, ...variantConfig.icon }}>
          {renderIcon()}
        </div>
        <h3 style={{ ...styles.title, ...variantConfig.title }}>{title}</h3>
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
  title: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    margin: 0,
    marginBottom: 'var(--spacing-1)',
  },
  description: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--color-text-muted)',
    margin: 0,
    marginBottom: 'var(--spacing-3)',
    lineHeight: 1.4,
  },
  action: {
    marginTop: 'var(--spacing-2)',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid var(--color-border)',
    borderTopColor: 'var(--color-primary)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

const variantStyles: Record<string, { icon: React.CSSProperties; title: React.CSSProperties }> = {
  info: {
    icon: {
      backgroundColor: 'var(--accent-muted)',
      color: 'var(--color-primary)',
    },
    title: {
      color: 'var(--color-text)',
    },
  },
  error: {
    icon: {
      backgroundColor: 'var(--error-muted)',
      color: 'var(--color-danger)',
    },
    title: {
      color: 'var(--color-danger)',
    },
  },
  empty: {
    icon: {
      backgroundColor: 'var(--color-surface-2)',
      color: 'var(--color-text-muted)',
    },
    title: {
      color: 'var(--color-text-muted)',
    },
  },
  loading: {
    icon: {
      backgroundColor: 'var(--accent-muted)',
      color: 'var(--color-primary)',
    },
    title: {
      color: 'var(--color-text)',
    },
  },
};

export default StateCard;
