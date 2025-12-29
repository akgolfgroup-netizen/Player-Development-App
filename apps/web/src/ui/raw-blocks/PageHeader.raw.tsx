import React from 'react';

/**
 * PageHeader Raw Block
 * Main page header with title, breadcrumbs, and actions
 */

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Page subtitle or description */
  subtitle?: string;
  /** Breadcrumb navigation */
  breadcrumbs?: BreadcrumbItem[];
  /** Action buttons (right side) */
  actions?: React.ReactNode;
  /** Back button */
  onBack?: () => void;
  /** Show divider at bottom */
  divider?: boolean;
  /** Sticky header */
  sticky?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  onBack,
  divider = true,
  sticky = false,
}) => {
  return (
    <header
      style={{
        ...styles.header,
        ...(divider && styles.headerWithDivider),
        ...(sticky && styles.headerSticky),
      }}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav style={styles.breadcrumbs} aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <span style={styles.breadcrumbSeparator}>/</span>
              )}
              {crumb.href || crumb.onClick ? (
                <a
                  href={crumb.href}
                  onClick={(e) => {
                    if (crumb.onClick) {
                      e.preventDefault();
                      crumb.onClick();
                    }
                  }}
                  style={{
                    ...styles.breadcrumbLink,
                    ...(index === breadcrumbs.length - 1 && styles.breadcrumbCurrent),
                  }}
                  aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                >
                  {crumb.label}
                </a>
              ) : (
                <span style={styles.breadcrumbText}>{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title Section */}
      <div style={styles.titleSection}>
        <div style={styles.titleContent}>
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              style={styles.backButton}
              aria-label="Go back"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5L7 10L12 15" />
              </svg>
            </button>
          )}

          {/* Title and Subtitle */}
          <div style={styles.titleWrapper}>
            <h1 style={styles.title}>{title}</h1>
            {subtitle && (
              <p style={styles.subtitle}>{subtitle}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div style={styles.actions}>
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    backgroundColor: 'var(--background-white)',
    padding: 'var(--spacing-4)',
    marginBottom: 'var(--spacing-4)',
  },
  headerWithDivider: {
    borderBottom: '1px solid var(--border-subtle)',
  },
  headerSticky: {
    position: 'sticky',
    top: 0,
    zIndex: 30,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    backgroundColor: 'var(--overlay-glass)',
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    marginBottom: 'var(--spacing-3)',
    flexWrap: 'wrap',
  },
  breadcrumbLink: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'color 0.15s ease',
  },
  breadcrumbCurrent: {
    color: 'var(--text-primary)',
    fontWeight: 500,
  },
  breadcrumbText: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
  },
  breadcrumbSeparator: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-tertiary)',
    margin: '0 var(--spacing-1)',
  },
  titleSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 'var(--spacing-4)',
  },
  titleContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3)',
    flex: 1,
    minWidth: 0,
  },
  backButton: {
    background: 'transparent',
    border: 'none',
    padding: 'var(--spacing-2)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s ease, color 0.15s ease',
    marginTop: '2px',
  },
  titleWrapper: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 'var(--font-size-title1)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 'var(--font-size-subheadline)',
    color: 'var(--text-secondary)',
    margin: 'var(--spacing-1) 0 0',
    lineHeight: 1.4,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    flexShrink: 0,
  },
};

// Responsive adjustments
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(max-width: 767px)');
  if (mediaQuery.matches) {
    styles.titleSection = {
      ...styles.titleSection,
      flexDirection: 'column',
      gap: 'var(--spacing-3)',
    };
    styles.title = {
      ...styles.title,
      fontSize: 'var(--font-size-title2)',
    };
  }
}

export default PageHeader;
