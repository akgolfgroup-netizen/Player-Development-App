/**
 * ApplicationLayoutTopNav
 *
 * App layout with top navigation bar.
 * Alternative to the side rail layout (ApplicationLayoutV2).
 *
 * Uses semantic color tokens from design-system.
 */

import React from 'react';
import DashboardHeader from './DashboardHeader';
import BackToTop from '../ui/BackToTop';

export default function ApplicationLayoutTopNav({ children, title, subtitle, actions }) {
  return (
    <div className="min-h-full flex flex-col bg-[var(--background-default)]">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-[var(--accent)] focus:text-[var(--text-inverse)] focus:px-4 focus:py-2 focus:rounded-md focus:m-2"
      >
        Hopp til hovedinnhold
      </a>

      {/* Top Navigation - Premium header with flyout menus */}
      <DashboardHeader />

      {/* Page Header */}
      {(title || subtitle || actions) && (
        <header className="bg-[var(--background-white)] shadow-sm border-b border-[var(--border-subtle)]">
          <div className="px-4 py-6 sm:px-6 lg:px-12 xl:px-16">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                {title && (
                  <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex items-center gap-3">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main id="main-content" className="flex-1" tabIndex="-1">
        <div className="px-4 py-6 sm:px-6 lg:px-12 xl:px-16">
          {children}
        </div>
      </main>

      {/* Footer (optional - can be extended) */}
      <footer className="bg-[var(--background-white)] border-t border-[var(--border-subtle)]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-[var(--text-tertiary)]">
            AK Golf IUP
          </p>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}
