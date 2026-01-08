/**
 * AuthPage Component System
 *
 * Standalone authentication page layout for login, password reset, etc.
 * Uses the same compound component pattern as Page but optimized
 * for full-screen centered auth flows.
 *
 * Structure:
 * - AuthPage (root: full viewport centered layout)
 * - AuthPage.Logo (branding section)
 * - AuthPage.Card (main content card)
 * - AuthPage.Footer (help text, links)
 *
 * States:
 * - idle: Normal form state
 * - loading: Form submission
 * - success: Success feedback
 * - error: Error feedback
 */

import React, { createContext, useContext } from 'react';

// ============================================================================
// TYPES
// ============================================================================

type AuthPageState = 'idle' | 'loading' | 'success' | 'error';

interface AuthPageContextValue {
  state: AuthPageState;
}

interface AuthPageProps {
  children: React.ReactNode;
  /** Current page state */
  state?: AuthPageState;
  /** Maximum card width */
  maxWidth?: 'sm' | 'md' | 'lg';
}

interface AuthPageLogoProps {
  children: React.ReactNode;
  /** Title text */
  title?: string;
  /** Subtitle text */
  subtitle?: string;
}

interface AuthPageCardProps {
  children: React.ReactNode;
  /** Card title */
  title?: string;
}

interface AuthPageFooterProps {
  children: React.ReactNode;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AuthPageContext = createContext<AuthPageContextValue>({ state: 'idle' });

export const useAuthPage = () => {
  const context = useContext(AuthPageContext);
  if (!context) {
    throw new Error('AuthPage components must be used within an AuthPage');
  }
  return context;
};

// ============================================================================
// AUTH PAGE ROOT
// ============================================================================

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

function AuthPageRoot({ children, state = 'idle', maxWidth = 'md' }: AuthPageProps) {
  return (
    <AuthPageContext.Provider value={{ state }}>
      <div className="min-h-screen flex items-center justify-center bg-tier-surface-base p-6">
        <div className={`w-full ${maxWidthClasses[maxWidth]}`}>
          {children}
        </div>
      </div>
    </AuthPageContext.Provider>
  );
}

// ============================================================================
// AUTH PAGE.LOGO
// ============================================================================

function AuthPageLogo({ children, title, subtitle }: AuthPageLogoProps) {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">{children}</div>
      {title && (
        <h1 className="text-xl font-bold text-tier-text-primary mb-1">
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="text-sm text-tier-text-secondary">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// AUTH PAGE.CARD
// ============================================================================

function AuthPageCard({ children, title }: AuthPageCardProps) {
  return (
    <div className="bg-tier-surface-card rounded-2xl p-8 shadow-tier-elevated">
      {title && (
        <h2 className="text-xl font-bold text-tier-text-primary text-center mb-6">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

// ============================================================================
// AUTH PAGE.FOOTER
// ============================================================================

function AuthPageFooter({ children }: AuthPageFooterProps) {
  return (
    <div className="mt-6 p-4 bg-tier-surface-card rounded-lg text-center">
      <p className="text-xs text-tier-text-secondary">
        {children}
      </p>
    </div>
  );
}

// ============================================================================
// COMPOUND COMPONENT EXPORT
// ============================================================================

export const AuthPage = Object.assign(AuthPageRoot, {
  Logo: AuthPageLogo,
  Card: AuthPageCard,
  Footer: AuthPageFooter,
});

export type {
  AuthPageProps,
  AuthPageLogoProps,
  AuthPageCardProps,
  AuthPageFooterProps,
  AuthPageState,
};
