/**
 * ============================================================
 * PageShell - Standardisert sidelayout
 * AK Golf Academy Design System v3.0
 * ============================================================
 *
 * Felles layout-komponent som alle sider i spillerportalen bruker.
 * Sikrer konsistent spacing, header og tilstandshåndtering.
 *
 * SPACING-REGLER (hard-kodet):
 * - Seksjoner: 48px (--space-section)
 * - Overskrift → innhold: 24px (--space-heading)
 * - Kort → kort: 16px (--space-card)
 * - Input → input: 16px (--space-input)
 *
 * TILSTANDER:
 * - Tom tilstand (empty)
 * - Lasting (skeleton)
 * - Feiltilstand (error)
 * - Fullført med neste steg CTA
 *
 * ============================================================
 */

import React from 'react';
import { tokens } from '../design-tokens';
import ProfileDropdown from '../components/layout/ProfileDropdown';
import { useAuth } from '../contexts/AuthContext';

// ────────────────────────────────────────────────────────────
// Spacing constants (CSS custom properties referanse)
// ────────────────────────────────────────────────────────────
export const PAGE_SPACING = {
  section: 48,    // Mellom seksjoner
  heading: 24,    // Overskrift til innhold
  card: 16,       // Mellom kort
  input: 16,      // Mellom input-felt
  page: {
    desktop: { top: 32, right: 40, bottom: 48, left: 40 },
    mobile: { top: 20, right: 16, bottom: 32, left: 16 },
  },
} as const;

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────
export type PageState = 'loading' | 'empty' | 'error' | 'success' | 'idle';

export interface PageShellProps {
  /** Sidetittel (vises i header) */
  title: string;
  /** Valgfri undertittel */
  subtitle?: string;
  /** Valgfri kontekst (f.eks. uke/periode) */
  context?: string;
  /** Hovedinnhold */
  children: React.ReactNode;
  /** Sidetilstand */
  state?: PageState;
  /** Feilmelding (når state='error') */
  errorMessage?: string;
  /** Prøv igjen-handler (når state='error') */
  onRetry?: () => void;
  /** Tom-tilstand tekst */
  emptyTitle?: string;
  emptyDescription?: string;
  emptyCTA?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  /** Neste steg CTA (vises nederst når relevant) */
  nextStep?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  /** Ekstra actions i header */
  headerActions?: React.ReactNode;
  /** Max-bredde på innhold (default: 1200px) */
  maxWidth?: number | string;
  /** Skjul profil-dropdown i header */
  hideProfile?: boolean;
}

// ────────────────────────────────────────────────────────────
// Skeleton Loader (for loading state)
// ────────────────────────────────────────────────────────────
const SkeletonBlock = ({ width = '100%', height = 20 }: { width?: string | number; height?: number }) => (
  <div
    style={{
      width,
      height,
      backgroundColor: tokens.colors.gray200,
      borderRadius: 8,
      animation: 'pulse 1.5s ease-in-out infinite',
    }}
  />
);

const LoadingSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: PAGE_SPACING.card }}>
    <SkeletonBlock height={32} width="40%" />
    <SkeletonBlock height={16} width="60%" />
    <div style={{ marginTop: PAGE_SPACING.heading }}>
      <SkeletonBlock height={180} />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: PAGE_SPACING.card }}>
      <SkeletonBlock height={120} />
      <SkeletonBlock height={120} />
      <SkeletonBlock height={120} />
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────
// Empty State
// ────────────────────────────────────────────────────────────
interface EmptyStateProps {
  title: string;
  description?: string;
  cta?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

const EmptyState = ({ title, description, cta }: EmptyStateProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: tokens.colors.gray200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
      }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.text.tertiary} strokeWidth="1.5">
        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 style={{ fontSize: 18, fontWeight: 600, color: tokens.colors.text.primary, margin: 0 }}>
      {title}
    </h3>
    {description && (
      <p style={{ fontSize: 14, color: tokens.colors.text.secondary, marginTop: 8, maxWidth: 400 }}>
        {description}
      </p>
    )}
    {cta && (
      <button
        onClick={cta.onClick}
        style={{
          marginTop: 24,
          padding: '12px 24px',
          borderRadius: 12,
          border: 'none',
          backgroundColor: tokens.colors.primary,
          color: tokens.colors.white,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}
      >
        {cta.label}
      </button>
    )}
  </div>
);

// ────────────────────────────────────────────────────────────
// Error State
// ────────────────────────────────────────────────────────────
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({ message = 'Noe gikk galt', onRetry }: ErrorStateProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: 'rgba(220, 38, 38, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
      }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.error} strokeWidth="1.5">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h3 style={{ fontSize: 18, fontWeight: 600, color: tokens.colors.text.primary, margin: 0 }}>
      Feil oppstod
    </h3>
    <p style={{ fontSize: 14, color: tokens.colors.text.secondary, marginTop: 8, maxWidth: 400 }}>
      {message}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          marginTop: 24,
          padding: '12px 24px',
          borderRadius: 12,
          border: `1px solid ${tokens.colors.border.default}`,
          backgroundColor: 'transparent',
          color: tokens.colors.text.primary,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
      >
        Prøv igjen
      </button>
    )}
  </div>
);

// ────────────────────────────────────────────────────────────
// Next Step CTA
// ────────────────────────────────────────────────────────────
interface NextStepCTAProps {
  label: string;
  href?: string;
  onClick?: () => void;
}

const NextStepCTA = ({ label, href, onClick }: NextStepCTAProps) => {
  const content = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        borderRadius: 16,
        backgroundColor: tokens.colors.primary,
        color: tokens.colors.white,
        cursor: 'pointer',
        transition: 'opacity 0.2s',
      }}
    >
      <span style={{ fontSize: 16, fontWeight: 600 }}>{label}</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div>
  );

  if (href) {
    return <a href={href} style={{ textDecoration: 'none' }}>{content}</a>;
  }

  return <button onClick={onClick} style={{ all: 'unset', width: '100%' }}>{content}</button>;
};

// ────────────────────────────────────────────────────────────
// PageShell Component
// ────────────────────────────────────────────────────────────
export default function PageShell({
  title,
  subtitle,
  context,
  children,
  state = 'idle',
  errorMessage,
  onRetry,
  emptyTitle = 'Ingen data',
  emptyDescription,
  emptyCTA,
  nextStep,
  headerActions,
  maxWidth = 1200,
  hideProfile = false,
}: PageShellProps) {
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const padding = isMobile ? PAGE_SPACING.page.mobile : PAGE_SPACING.page.desktop;

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return <LoadingSkeleton />;
      case 'empty':
        return <EmptyState title={emptyTitle} description={emptyDescription} cta={emptyCTA} />;
      case 'error':
        return <ErrorState message={errorMessage} onRetry={onRetry} />;
      default:
        return children;
    }
  };

  return (
    <div
      style={{
        minHeight: '100%',
        paddingTop: padding.top,
        paddingRight: padding.right,
        paddingBottom: padding.bottom,
        paddingLeft: padding.left,
      }}
    >
      {/* CSS for skeleton animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>

      <div style={{ maxWidth, margin: '0 auto' }}>
        {/* Header */}
        <header
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: PAGE_SPACING.heading,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: isMobile ? 24 : 28,
                fontWeight: 700,
                color: tokens.colors.text.primary,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                style={{
                  fontSize: 14,
                  color: tokens.colors.text.secondary,
                  margin: '4px 0 0 0',
                }}
              >
                {subtitle}
              </p>
            )}
            {context && (
              <span
                style={{
                  display: 'inline-block',
                  marginTop: 8,
                  padding: '4px 12px',
                  borderRadius: 6,
                  backgroundColor: tokens.colors.gray200,
                  fontSize: 12,
                  fontWeight: 500,
                  color: tokens.colors.text.secondary,
                }}
              >
                {context}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {headerActions}
            {!hideProfile && !isMobile && (
              <ProfileDropdown
                user={user || undefined}
                onLogout={logout}
                variant="light"
              />
            )}
          </div>
        </header>

        {/* Main Content */}
        <main>
          {renderContent()}
        </main>

        {/* Next Step CTA */}
        {nextStep && state === 'success' && (
          <div style={{ marginTop: PAGE_SPACING.section }}>
            <NextStepCTA {...nextStep} />
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Named exports for convenience
// ────────────────────────────────────────────────────────────
export { EmptyState, ErrorState, LoadingSkeleton, NextStepCTA };
