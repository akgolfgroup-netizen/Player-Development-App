import React, { lazy, Suspense } from 'react';
import { HelpCircle } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import ThemeSwitcher from '../composites/ThemeSwitcher';
import { PageTitle } from '../../components/typography';

// DEV-only analytics debug overlay
const IS_DEV = process.env.NODE_ENV === 'development';
const AnalyticsDebug = IS_DEV
  ? lazy(() => import('../../analytics/AnalyticsDebug'))
  : null;

/**
 * AppShellTemplate
 * Main application layout container following TIER Golf design system
 * Provides mobile-first responsive layout with header, navigation, and content areas
 */

interface AppShellTemplateProps {
  /** Page title displayed in header */
  title?: string;
  /** Optional subtitle displayed below title */
  subtitle?: string;
  /** Optional help text displayed in tooltip */
  helpText?: string;
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
  helpText,
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
              {title && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <PageTitle style={styles.title}>{title}</PageTitle>
                  {helpText && (
                    <Tooltip.Provider delayDuration={200}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <button
                            type="button"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '20px',
                              height: '20px',
                              padding: 0,
                              border: 'none',
                              background: 'none',
                              cursor: 'help',
                              color: 'var(--text-tertiary)',
                              transition: 'color 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                          >
                            <HelpCircle size={16} />
                          </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            style={{
                              maxWidth: '320px',
                              padding: '12px 16px',
                              backgroundColor: 'var(--background-elevated)',
                              border: '1px solid var(--border-default)',
                              borderRadius: 'var(--radius-md)',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                              fontSize: '13px',
                              lineHeight: '1.5',
                              color: 'var(--text-primary)',
                              zIndex: 9999,
                            }}
                            sideOffset={5}
                          >
                            {helpText}
                            <Tooltip.Arrow
                              style={{
                                fill: 'var(--border-default)',
                              }}
                            />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  )}
                </div>
              )}
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
