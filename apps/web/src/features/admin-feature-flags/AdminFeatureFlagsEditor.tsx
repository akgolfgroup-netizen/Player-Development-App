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

import React, { useState } from "react";
import { ToggleLeft, ToggleRight, Settings } from "lucide-react";

// Design tokens - Blue Palette 01
const tokens = {
  colors: {
    primary: '#10456A',
    primaryLight: '#2C5F7F',
    snow: '#EDF0F2',
    surface: '#EBE5DA',
    white: '#FFFFFF',
    charcoal: '#1C1C1E',
    steel: '#8E8E93',
    mist: '#E5E5EA',
    success: '#4A7C59',
    error: '#C45B4E',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
  },
  shadows: {
    card: '0 2px 4px rgba(0, 0, 0, 0.06)',
  },
};

const typography = {
  title1: { fontSize: '28px', lineHeight: '34px', fontWeight: 700 },
  title3: { fontSize: '17px', lineHeight: '22px', fontWeight: 600 },
  body: { fontSize: '15px', lineHeight: '20px', fontWeight: 400 },
  caption: { fontSize: '13px', lineHeight: '18px', fontWeight: 400 },
};

//////////////////////////////
// 1. TYPES
//////////////////////////////

type FeatureFlag = {
  key: string;
  description: string;
  enabled: boolean;
};

//////////////////////////////
// 2. MOCK DATA (TEMP)
//////////////////////////////

const MOCK_FLAGS: FeatureFlag[] = [
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
  const initialFlags = apiFlags || MOCK_FLAGS;
  const [flags, setFlags] = useState<FeatureFlag[]>(initialFlags);

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
        backgroundColor: tokens.colors.snow,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Settings size={28} color={tokens.colors.primary} />
          <h1 style={{ ...typography.title1 as React.CSSProperties, color: tokens.colors.charcoal, margin: 0 }}>
            Feature Flags
          </h1>
        </div>
        <p style={{ ...typography.body as React.CSSProperties, color: tokens.colors.steel, margin: 0 }}>
          {enabledCount} av {flags.length} funksjoner aktivert
        </p>
      </div>

      {/* Flags List */}
      <div style={{ padding: '0 24px 24px' }}>
        <div
          style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.borderRadius.lg,
            boxShadow: tokens.shadows.card,
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
                borderBottom: index < flags.length - 1 ? `1px solid ${tokens.colors.mist}` : 'none',
              }}
            >
              {/* Flag Info */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    ...typography.body as React.CSSProperties,
                    fontWeight: 500,
                    color: tokens.colors.charcoal,
                    fontFamily: 'monospace',
                    backgroundColor: tokens.colors.snow,
                    padding: '4px 8px',
                    borderRadius: tokens.borderRadius.sm,
                    display: 'inline-block',
                  }}
                >
                  {flag.key}
                </div>
                <div style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel, marginTop: '8px' }}>
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
                  borderRadius: tokens.borderRadius.md,
                  border: 'none',
                  backgroundColor: flag.enabled ? `${tokens.colors.success}15` : `${tokens.colors.steel}15`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {flag.enabled ? (
                  <ToggleRight size={24} color={tokens.colors.success} />
                ) : (
                  <ToggleLeft size={24} color={tokens.colors.steel} />
                )}
                <span
                  style={{
                    ...typography.body as React.CSSProperties,
                    fontWeight: 500,
                    color: flag.enabled ? tokens.colors.success : tokens.colors.steel,
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
