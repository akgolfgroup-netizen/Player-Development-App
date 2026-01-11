import React from 'react';
import Card from '../primitives/Card';
import { LucideIcon } from 'lucide-react';
import { SubSectionTitle } from '../../components/typography';

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
      return <IconComponent size={48} />;
    }
    if (variant === 'loading') return <span style={styles.spinner} />;
    return null;
  };

  return (
    <Card padding={compact ? 'compact' : 'default'}>
      <div style={styles.container}>
        {renderIcon() && (
          <div style={{ ...styles.icon, ...variantConfig.icon }}>
            {renderIcon()}
          </div>
        )}
        <SubSectionTitle style={{ ...styles.title, ...variantConfig.title, marginBottom: 0 }}>{title}</SubSectionTitle>
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
    padding: 'var(--spacing-12) var(--spacing-4)',
    textAlign: 'center',
  },
  icon: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 'var(--spacing-4)',
  },
  title: {
    fontSize: 'var(--font-size-headline)',
    fontWeight: 600,
    margin: 0,
    marginBottom: 'var(--spacing-2)',
  },
  description: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-tertiary)',
    margin: 0,
    marginBottom: 'var(--spacing-4)',
    maxWidth: '320px',
    lineHeight: 1.4,
  },
  action: {
    marginTop: 0,
  },
  spinner: {
    width: '24px',
    height: '24px',
    border: '2px solid var(--color-border)',
    borderTopColor: 'var(--color-primary)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

const variantStyles: Record<string, { icon: React.CSSProperties; title: React.CSSProperties }> = {
  info: {
    icon: {
      color: 'var(--text-muted)',
    },
    title: {
      color: 'var(--text-primary)',
    },
  },
  error: {
    icon: {
      color: 'var(--color-danger)',
    },
    title: {
      color: 'var(--text-primary)',
    },
  },
  empty: {
    icon: {
      color: 'var(--text-muted)',
    },
    title: {
      color: 'var(--text-primary)',
    },
  },
  loading: {
    icon: {
      color: 'var(--text-muted)',
    },
    title: {
      color: 'var(--text-primary)',
    },
  },
};

export default StateCard;
