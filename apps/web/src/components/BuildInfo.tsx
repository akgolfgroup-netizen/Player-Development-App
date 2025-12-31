/**
 * BuildInfo - Production build verification component
 *
 * Displays current build SHA in console and optionally in UI.
 * Used to verify which commit is actually running in production.
 *
 * Environment variables (set at build time):
 * - REACT_APP_BUILD_SHA: Git commit SHA from Railway
 * - REACT_APP_BUILD_BRANCH: Git branch name
 * - REACT_APP_BUILD_DATE: Build timestamp
 */

import { useEffect } from 'react';

interface BuildInfoProps {
  /** Show visual indicator in corner (default: only in development) */
  showBadge?: boolean;
}

// Build info from environment (baked in at build time)
export const BUILD_INFO = {
  sha: process.env.REACT_APP_BUILD_SHA || 'local',
  branch: process.env.REACT_APP_BUILD_BRANCH || 'local',
  date: process.env.REACT_APP_BUILD_DATE || new Date().toISOString(),
  shortSha: (process.env.REACT_APP_BUILD_SHA || 'local').slice(0, 7),
};

/**
 * Logs build info to console on mount.
 * Optionally renders a small badge in the corner.
 */
export function BuildInfo({ showBadge = false }: BuildInfoProps) {
  useEffect(() => {
    // Always log to console for debugging
    console.log(
      '%c🏌️ AK Golf Academy Build Info',
      'color: #1B4D3E; font-weight: bold; font-size: 14px;'
    );
    console.log(
      `%c  Commit: %c${BUILD_INFO.sha}`,
      'color: #6B7280;',
      'color: #059669; font-family: monospace;'
    );
    console.log(
      `%c  Branch: %c${BUILD_INFO.branch}`,
      'color: #6B7280;',
      'color: #2563EB; font-family: monospace;'
    );
    console.log(
      `%c  Built:  %c${BUILD_INFO.date}`,
      'color: #6B7280;',
      'color: #D97706; font-family: monospace;'
    );

    // Also set on window for easy access in DevTools
    (window as any).__BUILD_INFO__ = BUILD_INFO;
  }, []);

  // Don't render anything if badge is disabled
  if (!showBadge) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '8px',
        right: '8px',
        padding: '4px 8px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#10B981',
        fontFamily: 'monospace',
        fontSize: '10px',
        borderRadius: '4px',
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0.8,
      }}
      title={`Branch: ${BUILD_INFO.branch}\nBuilt: ${BUILD_INFO.date}`}
    >
      {BUILD_INFO.shortSha}
    </div>
  );
}

export default BuildInfo;
