/**
 * TIER Golf Academy - Admin Feature Flags Editor
 *
 * Archetype: A - List/Index Page
 * Purpose: Enable/disable system features
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 * Uses useAdmin hook for API integration
 */

import React, { useEffect } from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { Page } from '../../ui/components/Page';
import { Text } from '../../ui/primitives';
import { useAdmin } from '../../hooks/useAdmin';

// ============================================================================
// COMPONENT
// ============================================================================

export default function AdminFeatureFlagsEditor() {
  const {
    featureFlags,
    loadingFlags: loading,
    fetchFeatureFlags,
    toggleFeatureFlag,
  } = useAdmin();

  useEffect(() => {
    fetchFeatureFlags();
  }, [fetchFeatureFlags]);

  const handleToggle = async (id: string) => {
    await toggleFeatureFlag(id);
  };

  const enabledCount = featureFlags.filter((f) => f.enabled).length;

  // Determine page state
  const pageState = loading ? 'loading' : featureFlags.length === 0 ? 'empty' : 'idle';

  return (
    <Page state={pageState} maxWidth="xl">
      <Page.Header
        title="Funksjonsflagg"
        subtitle={featureFlags.length > 0 ? `${enabledCount} av ${featureFlags.length} funksjoner aktivert` : undefined}
      />

      <Page.Content>
        <Page.Section title="Funksjoner" description="Aktiver eller deaktiver systemfunksjoner">
          <div className="divide-y divide-tier-border-default">
            {featureFlags.map((flag) => (
              <div
                key={flag.id}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <code className="px-2 py-1 bg-tier-surface-base rounded text-sm font-mono text-tier-navy">
                    {flag.key}
                  </code>
                  <Text variant="caption1" color="secondary" className="mt-2 block">
                    {flag.name || flag.description || flag.key}
                  </Text>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(flag.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-lg
                    transition-colors cursor-pointer
                    ${
                      flag.enabled
                        ? 'bg-tier-success-light text-tier-success'
                        : 'bg-tier-surface-base text-tier-text-secondary'
                    }
                  `}
                >
                  {flag.enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  <Text variant="body" className="font-medium">
                    {flag.enabled ? 'Aktivert' : 'Deaktivert'}
                  </Text>
                </button>
              </div>
            ))}
          </div>
        </Page.Section>
      </Page.Content>
    </Page>
  );
}
