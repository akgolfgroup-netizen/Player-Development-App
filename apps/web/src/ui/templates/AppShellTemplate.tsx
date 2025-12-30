import React, { lazy, Suspense } from 'react';
import ThemeSwitcher from '../composites/ThemeSwitcher';

// DEV-only analytics debug overlay
const IS_DEV = process.env.NODE_ENV === 'development';
const AnalyticsDebug = IS_DEV
  ? lazy(() => import('../../analytics/AnalyticsDebug'))
  : null;

/**
 * AppShellTemplate
 * Main application layout container following AK Golf design system
 * Provides mobile-first responsive layout with header, navigation, and content areas
 */

interface AppShellTemplateProps {
  /** Page title displayed in header */
  title?: string;
  /** Optional subtitle displayed below title */
  subtitle?: string;
  /** Action buttons or controls displayed on the right side of header */
  actions?: React.ReactNode;
  /** Main content area */
  children: React.ReactNode;
  /** Bottom navigation (fixed at bottom on mobile) */
  bottomNav?: React.ReactNode;
  /** Show theme switcher in header (default: true) */
  showThemeSwitcher?: boolean;
  /** Additional className for customization */
  className?: string;
}

const AppShellTemplate: React.FC<AppShellTemplateProps> = ({
  title,
  subtitle,
  actions,
  children,
  bottomNav,
  showThemeSwitcher = true,
  className = '',
}) => {
  const hasHeader = title || subtitle || actions || showThemeSwitcher;

  return (
    <div style={styles.shell} className={className}>
      {/* Header */}
      {hasHeader && (
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.headerTitles}>
              {title && <h1 style={styles.title}>{title}</h1>}
              {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
            </div>
            {(actions || showThemeSwitcher) && (
              <div style={styles.headerActions}>
                {actions}
                {showThemeSwitcher && <ThemeSwitcher />}
              </div>
            )}
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main
        style={{
          ...styles.main,
          ...(bottomNav && styles.mainWithNav),
        }}
      >
        {children}
      </main>

      {/* Bottom Navigation (fixed at bottom on mobile) */}
      {bottomNav && (
        <nav style={styles.mobileNav}>
          {bottomNav}
        </nav>
      )}

      {/* DEV-only analytics debug overlay */}
      {IS_DEV && AnalyticsDebug && (
        <Suspense fallback={null}>
          <AnalyticsDebug />
        </Suspense>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  shell: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'var(--background-default)',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    backgroundColor: 'var(--background-white)',
    borderBottom: '1px solid var(--border-subtle)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-4)',
    maxWidth: '1536px',
    margin: '0 auto',
    width: '100%',
  },
  headerTitles: {
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
    fontSize: 'var(--font-size-body)',
    color: 'var(--text-secondary)',
    margin: 0,
    marginTop: 'var(--spacing-1)',
    lineHeight: 1.4,
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    flexShrink: 0,
    marginLeft: 'var(--spacing-4)',
  },
  main: {
    flex: 1,
    width: '100%',
    maxWidth: '1536px',
    margin: '0 auto',
    padding: 'var(--spacing-4)',
  },
  mainWithNav: {
    paddingBottom: 'calc(56px + var(--safe-area-inset-bottom) + var(--spacing-4))',
  },
  mobileNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'var(--background-white)',
    borderTop: '1px solid var(--border-subtle)',
    paddingBottom: 'var(--safe-area-inset-bottom)',
    zIndex: 100,
  },
};

export default AppShellTemplate;
