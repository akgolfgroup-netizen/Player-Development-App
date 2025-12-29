import React from 'react';
import { ChevronRight } from 'lucide-react';

/**
 * WidgetHeader
 * Unified header for dashboard widgets with optional action button
 */

interface WidgetHeaderProps {
  /** Widget title */
  title: string;
  /** Optional icon component */
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  /** Optional action handler */
  action?: () => void;
  /** Action button label */
  actionLabel?: string;
}

const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  title,
  icon: Icon,
  action,
  actionLabel = 'Se alle',
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.titleContainer}>
        {Icon && <Icon size={18} className="text-ak-primary" />}
        <h3 style={styles.title}>{title}</h3>
      </div>
      {action && (
        <button onClick={action} style={styles.actionButton}>
          {actionLabel} <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--spacing-4)',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  title: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  actionButton: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--accent)',
    fontWeight: 500,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: 0,
  },
};

export default WidgetHeader;
