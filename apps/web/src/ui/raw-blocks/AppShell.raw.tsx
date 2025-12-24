import React from 'react';

/**
 * AppShell Raw Block
 * Main application layout container following AK Golf design system
 * Provides mobile-first responsive layout with header, navigation, and content areas
 */

interface AppShellProps {
  /** Header content (logo, title, actions) */
  header?: React.ReactNode;
  /** Mobile navigation bar (bottom nav on mobile) */
  navigation?: React.ReactNode;
  /** Main content area */
  children: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Show mobile navigation */
  showMobileNav?: boolean;
  /** Additional className for customization */
  className?: string;
}

const AppShell: React.FC<AppShellProps> = ({
  header,
  navigation,
  children,
  footer,
  showMobileNav = true,
  className = '',
}) => {
  return (
    <div style={styles.shell} className={className}>
      {/* Header */}
      {header && (
        <header style={styles.header} className="sticky-header">
          {header}
        </header>
      )}

      {/* Main Content Area */}
      <main style={{
        ...styles.main,
        ...(showMobileNav && styles.mainWithNav),
      }}>
        {children}
      </main>

      {/* Mobile Navigation (bottom on mobile, side on desktop) */}
      {navigation && showMobileNav && (
        <nav style={styles.mobileNav} className="mobile-nav">
          {navigation}
        </nav>
      )}

      {/* Footer */}
      {footer && (
        <footer style={styles.footer}>
          {footer}
        </footer>
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
  main: {
    flex: 1,
    width: '100%',
    maxWidth: '1280px',
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
  footer: {
    backgroundColor: 'var(--background-surface)',
    padding: 'var(--spacing-6) var(--spacing-4)',
    marginTop: 'auto',
    borderTop: '1px solid var(--border-subtle)',
  },
};

export default AppShell;
