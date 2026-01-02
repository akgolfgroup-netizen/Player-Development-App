/**
 * AK Golf Academy - Admin Feature Flags Editor
 *
 * Archetype: A - List/Index Page
 * Purpose: Enable/disable system features
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */

import React, { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { Page } from '../../ui/components/Page';
import { Text } from '../../ui/primitives';

// ============================================================================
// TYPES
// ============================================================================

type FeatureFlag = {
  key: string;
  description: string;
  enabled: boolean;
};

// ============================================================================
// DEFAULTS
// ============================================================================

const DEFAULT_FLAGS: FeatureFlag[] = [
  {
    key: 'proof_enabled',
    description: 'Aktiver PROOF-visning for spillere',
    enabled: true,
  },
  {
    key: 'coach_notes',
    description: 'Aktiver trenernotater i spillervisning',
    enabled: true,
  },
  {
    key: 'trajectory_view',
    description: 'Aktiver utviklingsvisning for trenere',
    enabled: true,
  },
  {
    key: 'advanced_analytics',
    description: 'Aktiver avansert statistikk',
    enabled: false,
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

interface AdminFeatureFlagsEditorProps {
  flags?: FeatureFlag[];
}

export default function AdminFeatureFlagsEditor({
  flags: apiFlags,
}: AdminFeatureFlagsEditorProps = {}) {
  const [flags, setFlags] = useState<FeatureFlag[]>(apiFlags || DEFAULT_FLAGS);
  const [loading, setLoading] = useState(!apiFlags);

  useEffect(() => {
    if (apiFlags) return;

    const fetchFlags = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/admin/feature-flags', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.data?.flags) {
            setFlags(data.data.flags);
          }
        }
      } catch {
        // Keep default flags on error
      } finally {
        setLoading(false);
      }
    };

    fetchFlags();
  }, [apiFlags]);

  const toggleFlag = (key: string) => {
    setFlags((prev) =>
      prev.map((flag) => (flag.key === key ? { ...flag, enabled: !flag.enabled } : flag))
    );
  };

  const enabledCount = flags.filter((f) => f.enabled).length;

  // Determine page state
  const pageState = loading ? 'loading' : flags.length === 0 ? 'empty' : 'idle';

  return (
    <Page state={pageState} maxWidth="xl">
      <Page.Header
        title="Feature Flags"
        subtitle={flags.length > 0 ? `${enabledCount} av ${flags.length} funksjoner aktivert` : undefined}
      />

      <Page.Content>
        <Page.Section title="Funksjoner" description="Aktiver eller deaktiver systemfunksjoner">
          <div className="divide-y divide-ak-border-default">
            {flags.map((flag) => (
              <div
                key={flag.key}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <code className="px-2 py-1 bg-ak-surface-subtle rounded text-sm font-mono text-ak-text-primary">
                    {flag.key}
                  </code>
                  <Text variant="caption1" color="secondary" className="mt-2 block">
                    {flag.description}
                  </Text>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFlag(flag.key)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-lg
                    transition-colors cursor-pointer
                    ${
                      flag.enabled
                        ? 'bg-ak-status-success-light text-ak-status-success'
                        : 'bg-ak-surface-subtle text-ak-text-secondary'
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
