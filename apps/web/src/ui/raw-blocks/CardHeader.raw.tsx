import React from 'react';

/**
 * CardHeader Raw Block
 * Header section for cards with title, subtitle, and action buttons
 */

interface CardHeaderProps {
  /** Main title */
  title: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Icon or avatar on the left */
  icon?: React.ReactNode;
  /** Action buttons on the right */
  actions?: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Border bottom */
  divider?: boolean;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions,
  size = 'md',
  divider = false,
}) => {
  const getTitleSize = () => {
    switch (size) {
      case 'sm':
        return 'var(--font-size-subheadline)';
      case 'lg':
        return 'var(--font-size-title3)';
      default:
        return 'var(--font-size-headline)';
    }
  };

  const getSubtitleSize = () => {
    switch (size) {
      case 'sm':
        return 'var(--font-size-caption1)';
      case 'lg':
        return 'var(--font-size-subheadline)';
      default:
        return 'var(--font-size-footnote)';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return 'var(--spacing-2)';
      case 'lg':
        return 'var(--spacing-5)';
      default:
        return 'var(--spacing-3)';
    }
  };

  return (
    <div
      style={{
        ...styles.header,
        padding: getPadding(),
        ...(divider && styles.headerWithDivider),
      }}
    >
      {/* Left Side: Icon + Text */}
      <div style={styles.leftContent}>
        {icon && (
          <div style={styles.iconContainer}>
            {icon}
          </div>
        )}

        <div style={styles.textContent}>
          <h3
            style={{
              ...styles.title,
              fontSize: getTitleSize(),
            }}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              style={{
                ...styles.subtitle,
                fontSize: getSubtitleSize(),
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Side: Actions */}
      {actions && (
        <div style={styles.actions}>
          {actions}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--spacing-3)',
  },
  headerWithDivider: {
    borderBottom: '1px solid var(--border-subtle)',
  },
  leftContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    flex: 1,
    minWidth: 0, // Allow text truncation
  },
  iconContainer: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
    minWidth: 0, // Allow text truncation
  },
  title: {
    margin: 0,
    fontWeight: 600,
    color: 'var(--text-primary)',
    lineHeight: 1.3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  subtitle: {
    margin: '2px 0 0',
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    flexShrink: 0,
  },
};

export default CardHeader;
