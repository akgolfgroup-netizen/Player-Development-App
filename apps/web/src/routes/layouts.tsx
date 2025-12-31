import React, { ReactNode } from 'react';
import ApplicationLayoutTopNav from '../components/layout/ApplicationLayoutTopNav';
import CoachAppShell from '../components/layout/CoachAppShell';
import AdminAppShell from '../components/layout/AdminAppShell';
import { tokens } from '../design-tokens';

// =============================================================================
// Layout Types
// =============================================================================

interface LayoutProps {
  children: ReactNode;
}

interface AuthenticatedLayoutProps extends LayoutProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

// =============================================================================
// Layout Components
// =============================================================================

/**
 * Layout component for authenticated pages using Top Navigation (Player)
 */
export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  title,
  subtitle,
  actions
}) => (
  <ApplicationLayoutTopNav title={title} subtitle={subtitle} actions={actions}>
    {children}
  </ApplicationLayoutTopNav>
);

/**
 * Dashboard layout - uses Top Navigation
 */
export const DashboardLayout: React.FC<LayoutProps> = ({ children }) => (
  <ApplicationLayoutTopNav>{children}</ApplicationLayoutTopNav>
);

/**
 * Layout component for coach pages using CoachAppShell
 */
export const CoachLayout: React.FC<LayoutProps> = ({ children }) => (
  <CoachAppShell>{children}</CoachAppShell>
);

/**
 * Layout component for admin pages using AdminAppShell
 */
export const AdminLayout: React.FC<LayoutProps> = ({ children }) => (
  <AdminAppShell>{children}</AdminAppShell>
);

/**
 * Offline Banner Component
 */
export const OfflineBanner: React.FC = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: tokens.colors.error,
    color: 'white',
    padding: '12px 16px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: 9999,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  }}>
    ⚠️ Ingen internettforbindelse. Noen funksjoner kan være utilgjengelige.
  </div>
);
