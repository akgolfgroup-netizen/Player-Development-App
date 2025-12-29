/**
 * AK Golf Academy - Authentication Page Layout
 *
 * Centered layout for login, register, and password reset pages.
 * Features AK Golf branding and styling using semantic tokens.
 */

import React from 'react';

export default function AuthPageLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen flex-col bg-ak-surface-base dark:bg-ak-surface-dark-base">
      {/* Header */}
      <header className="flex justify-center py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ak-brand-primary">
            <span className="font-logo text-xl font-bold text-ak-text-inverse">AK</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-ak-text-primary dark:text-ak-text-inverse">
              AK Golf Academy
            </p>
            <p className="text-sm text-ak-text-muted">
              Individuell Utviklingsplan
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl bg-ak-surface-card p-8 shadow-ak-md dark:bg-ak-surface-dark-card">
            {/* Title */}
            {title && (
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-ak-text-primary dark:text-ak-text-inverse">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-2 text-sm text-ak-text-muted">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Form content */}
            {children}
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-ak-text-muted">
            © {new Date().getFullYear()} AK Golf Academy. Alle rettigheter reservert.
          </p>
        </div>
      </main>
    </div>
  );
}
