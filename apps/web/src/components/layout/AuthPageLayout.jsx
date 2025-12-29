/**
 * AK Golf Academy - Authentication Page Layout
 *
 * Centered layout for login, register, and password reset pages.
 * Features AK Golf branding and styling.
 */

import React from 'react';

export default function AuthPageLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#EDF0F2] dark:bg-[#1C1C1E]">
      {/* Header */}
      <header className="flex justify-center py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10456A]">
            <span className="font-logo text-xl font-bold text-white">AK</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-[#02060D] dark:text-white">
              AK Golf Academy
            </p>
            <p className="text-sm text-[#8E8E93]">
              Individuell Utviklingsplan
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl bg-white p-8 shadow-[0_2px_8px_rgba(2,6,13,0.08)] dark:bg-[#2C2C2E]">
            {/* Title */}
            {title && (
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-[#02060D] dark:text-white">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-2 text-sm text-[#8E8E93]">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Form content */}
            {children}
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-[#8E8E93]">
            © {new Date().getFullYear()} AK Golf Academy. Alle rettigheter reservert.
          </p>
        </div>
      </main>
    </div>
  );
}
