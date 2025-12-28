/**
 * AK Golf Academy - Admin Feature Flags Editor
 * Design System v3.0 - Blue Palette 01
 *
 * Purpose:
 * - Allow admin to enable/disable system features
 * - No access to users, athletes, or performance
 *
 * Contract references:
 * - COACH_ADMIN_IMPLEMENTATION_CONTRACT.md
 * - COACH_ADMIN_SCREEN_CONTRACT.md
 *
 * NON-NEGOTIABLE:
 * - Flags affect behavior, not interpretation
 * - No visibility into who is affected
 */

import React, { useState, useEffect } from "react";
import { ToggleLeft, ToggleRight, Settings } from "lucide-react";


//////////////////////////////
// 1. TYPES
//////////////////////////////

type FeatureFlag = {
  key: string;
  description: string;
  enabled: boolean;
};

//////////////////////////////
// 2. DEFAULT FLAGS (used when no API)
//////////////////////////////

const DEFAULT_FLAGS: FeatureFlag[] = [
  {
    key: "proof_enabled",
    description: "Aktiver PROOF-visning for spillere",
    enabled: true,
  },
  {
    key: "coach_notes",
    description: "Aktiver trenernotater i spillervisning",
    enabled: true,
  },
  {
    key: "trajectory_view",
    description: "Aktiver utviklingsvisning for trenere",
    enabled: true,
  },
  {
    key: "advanced_analytics",
    description: "Aktiver avansert statistikk",
    enabled: false,
  },
];

//////////////////////////////
// 3. COMPONENT
//////////////////////////////

interface AdminFeatureFlagsEditorProps {
  flags?: FeatureFlag[];
}

export default function AdminFeatureFlagsEditor({ flags: apiFlags }: AdminFeatureFlagsEditorProps = {}) {
  const [flags, setFlags] = useState<FeatureFlag[]>(apiFlags || DEFAULT_FLAGS);
  const [loading, setLoading] = useState(!apiFlags);

  // Fetch feature flags from API
  useEffect(() => {
    if (apiFlags) return;

    const fetchFlags = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/admin/feature-flags', {
          headers: { 'Authorization': `Bearer ${token}` },
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
      prev.map((flag) =>
        flag.key === key ? { ...flag, enabled: !flag.enabled } : flag
      )
    );
  };

  const enabledCount = flags.filter(f => f.enabled).length;

  return (
    <section
      aria-label="Feature flags"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Settings size={28} color={'var(--accent)'} />
          <h1 style={{ fontSize: '28px', lineHeight: '34px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Feature Flags
          </h1>
        </div>
        <p style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)', margin: 0 }}>
          {enabledCount} av {flags.length} funksjoner aktivert
        </p>
      </div>

      {/* Flags List */}
      <div style={{ padding: '0 24px 24px' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
          }}
        >
          {flags.map((flag, index) => (
            <div
              key={flag.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 20px',
                borderBottom: index < flags.length - 1 ? `1px solid ${'var(--border-default)'}` : 'none',
              }}
            >
              {/* Flag Info */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '15px', lineHeight: '20px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    fontFamily: 'monospace',
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'inline-block',
                  }}
                >
                  {flag.key}
                </div>
                <div style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  {flag.description}
                </div>
              </div>

              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => toggleFlag(flag.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: flag.enabled ? 'rgba(var(--success-rgb), 0.15)' : 'rgba(var(--text-secondary-rgb), 0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {flag.enabled ? (
                  <ToggleRight size={24} color={'var(--success)'} />
                ) : (
                  <ToggleLeft size={24} color={'var(--text-secondary)'} />
                )}
                <span
                  style={{
                    fontSize: '15px', lineHeight: '20px',
                    fontWeight: 500,
                    color: flag.enabled ? 'var(--success)' : 'var(--text-secondary)',
                  }}
                >
                  {flag.enabled ? 'Aktivert' : 'Deaktivert'}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

//////////////////////////////
// 4. STRICT NOTES
//////////////////////////////

/*
- Do NOT show impact metrics.
- Do NOT show affected users or athletes.
- Do NOT allow bulk enable/disable.
- Do NOT log or display usage statistics.
- This screen controls switches, nothing more.
*/
