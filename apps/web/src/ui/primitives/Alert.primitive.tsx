import React from 'react';

/**
 * Alert Primitive
 *
 * Status-based alert/notification component.
 * Uses semantic status colors for clear communication.
 *
 * UI Canon v1.2 Compliance:
 * - Status colors used only for status meaning
 * - No decorative gradients
 * - Clear visual hierarchy
 * - Touch-friendly dismiss target (44px)
 */

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  /** Alert variant determines color and icon */
  variant: AlertVariant;
  /** Alert title (optional) */
  title?: string;
  /** Alert message content */
  children: React.ReactNode;
  /** Dismissible alert */
  dismissible?: boolean;
  /** Dismiss callback */
  onDismiss?: () => void;
  /** Action button (e.g., retry) */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Additional className */
  className?: string;
  /** Compact variant (less padding) */
  compact?: boolean;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  children,
  dismissible = false,
  onDismiss,
  action,
  className = '',
  compact = false,
  style: customStyle = {},
}) => {
  const variantStyles = getVariantStyles(variant);

  return (
    <div
      className={className}
      role="alert"
      style={{
        ...styles.base,
        ...variantStyles.container,
        padding: compact ? 'var(--spacing-3)' : 'var(--spacing-4)',
        ...customStyle,
      }}
    >
      {/* Icon */}
      <div style={{ ...styles.iconWrapper, color: variantStyles.iconColor }}>
        {getIcon(variant)}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {title && (
          <p style={styles.title}>{title}</p>
        )}
        <div style={styles.message}>{children}</div>

        {/* Action button */}
        {action && (
          <button
            style={{
              ...styles.actionButton,
              color: variantStyles.actionColor,
            }}
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Dismiss button */}
      {dismissible && onDismiss && (
        <button
          style={styles.dismissButton}
          onClick={onDismiss}
          aria-label="Lukk"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

const getVariantStyles = (variant: AlertVariant) => {
  const variants = {
    info: {
      container: {
        backgroundColor: 'var(--info-muted)',
        borderColor: 'var(--ak-info)',
      },
      iconColor: 'var(--ak-info)',
      actionColor: 'var(--ak-info)',
    },
    success: {
      container: {
        backgroundColor: 'var(--success-muted)',
        borderColor: 'var(--ak-success)',
      },
      iconColor: 'var(--ak-success)',
      actionColor: 'var(--ak-success)',
    },
    warning: {
      container: {
        backgroundColor: 'var(--warning-muted)',
        borderColor: 'var(--ak-warning)',
      },
      iconColor: 'var(--ak-warning)',
      actionColor: 'var(--ak-warning)',
    },
    error: {
      container: {
        backgroundColor: 'var(--error-muted)',
        borderColor: 'var(--ak-error)',
      },
      iconColor: 'var(--ak-error)',
      actionColor: 'var(--ak-error)',
    },
  };

  return variants[variant];
};

const getIcon = (variant: AlertVariant) => {
  const icons = {
    info: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    success: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    warning: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    error: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  };

  return icons[variant];
};

const styles: Record<string, React.CSSProperties> = {
  base: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3)',
    borderRadius: 'var(--radius-md)',
    borderLeft: '4px solid',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '1px',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 'var(--font-size-subheadline)',
    lineHeight: 'var(--line-height-subheadline)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: '0 0 4px 0',
  },
  message: {
    fontSize: 'var(--font-size-footnote)',
    lineHeight: 'var(--line-height-footnote)',
    color: 'var(--text-secondary)',
  },
  actionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    marginTop: 'var(--spacing-2)',
    padding: '4px 0',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.15s ease',
  },
  dismissButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    padding: 0,
    color: 'var(--text-tertiary)',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'background-color 0.15s ease',
  },
};

export default Alert;
