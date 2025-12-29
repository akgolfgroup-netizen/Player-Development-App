import React from 'react';

/**
 * DashboardWidget
 *
 * Unified card shell for all dashboard modules.
 * Provides consistent styling, spacing, and state handling.
 *
 * Design principles:
 * - Consistent border, radius, padding, title row patterns
 * - Compact error/loading/empty states
 * - Semantic tokens only (no raw colors)
 */

const DashboardWidget = ({
  title,
  subtitle,
  action,
  actionLabel = 'Se alle',
  children,
  loading = false,
  error = null,
  onRetry,
  empty = false,
  emptyMessage = 'Ingen data tilgjengelig',
  emptyAction,
  emptyActionLabel,
  compact = false,
  noPadding = false,
  className = '',
  style = {},
}) => {
  // Loading state - skeleton
  if (loading) {
    return (
      <div style={{ ...styles.container, ...style }} className={className}>
        {title && (
          <div style={styles.header}>
            <div style={styles.skeletonTitle} />
          </div>
        )}
        <div style={noPadding ? {} : styles.content}>
          <div style={styles.skeletonContent}>
            <div style={styles.skeletonLine} />
            <div style={{ ...styles.skeletonLine, width: '70%' }} />
            <div style={{ ...styles.skeletonLine, width: '50%' }} />
          </div>
        </div>
      </div>
    );
  }

  // Error state - compact inline
  if (error) {
    return (
      <div style={{ ...styles.container, ...style }} className={className}>
        {title && (
          <div style={styles.header}>
            <h3 style={styles.title}>{title}</h3>
          </div>
        )}
        <div style={styles.content}>
          <div style={styles.errorState}>
            <span style={styles.errorIcon}>!</span>
            <span style={styles.errorText}>{typeof error === 'string' ? error : 'Kunne ikke laste data'}</span>
            {onRetry && (
              <button style={styles.retryButton} onClick={onRetry}>
                Prøv igjen
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Empty state - compact
  if (empty) {
    return (
      <div style={{ ...styles.container, ...style }} className={className}>
        {title && (
          <div style={styles.header}>
            <h3 style={styles.title}>{title}</h3>
            {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
          </div>
        )}
        <div style={styles.content}>
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>{emptyMessage}</p>
            {emptyAction && (
              <button style={styles.emptyAction} onClick={emptyAction}>
                {emptyActionLabel || 'Legg til'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Normal state
  return (
    <div style={{ ...styles.container, ...style }} className={className}>
      {title && (
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h3 style={styles.title}>{title}</h3>
            {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
          </div>
          {action && (
            <button style={styles.actionButton} onClick={action}>
              {actionLabel}
            </button>
          )}
        </div>
      )}
      <div style={noPadding ? {} : (compact ? styles.contentCompact : styles.content)}>
        {children}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'var(--card)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-card)',
    border: '1px solid var(--border-subtle)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-4) var(--spacing-5)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  title: {
    fontSize: 'var(--font-size-subheadline)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  subtitle: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
    margin: 0,
  },
  actionButton: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
    color: 'var(--text-brand)',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  content: {
    padding: 'var(--spacing-5)',
  },
  contentCompact: {
    padding: 'var(--spacing-4)',
  },
  // Skeleton styles
  skeletonTitle: {
    width: '120px',
    height: '16px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-sm)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  skeletonContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  skeletonLine: {
    width: '100%',
    height: '14px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-sm)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  // Error state
  errorState: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--error-muted)',
    borderRadius: 'var(--radius-md)',
  },
  errorIcon: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'var(--ak-error)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
    flexShrink: 0,
  },
  errorText: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
    flex: 1,
  },
  retryButton: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
    color: 'var(--ak-error)',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '4px 8px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  // Empty state
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-4)',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-tertiary)',
    margin: 0,
  },
  emptyAction: {
    marginTop: 'var(--spacing-3)',
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
    color: 'var(--text-brand)',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '6px 12px',
    cursor: 'pointer',
  },
};

export default DashboardWidget;
