/**
 * AK Golf Academy - Admin System Overview
 * Design System v3.0 - Blue Palette 01
 *
 * Purpose:
 * - Provide system-level visibility ONLY
 * - Zero access to athlete or performance data
 *
 * Contract references:
 * - COACH_ADMIN_IMPLEMENTATION_CONTRACT.md
 * - COACH_ADMIN_SCREEN_CONTRACT.md
 *
 * NON-NEGOTIABLE:
 * - No athlete data, coach performance, or metrics below system health
 */

import React from "react";
import { Server, Shield, Activity, CheckCircle, XCircle, Clock } from "lucide-react";
import { tokens } from "../../design-tokens";

// Typography styles from design tokens
const typography = tokens.typography;

//////////////////////////////
// 1. TYPES
//////////////////////////////

type SystemStatus = {
  environment: "production" | "staging" | "development";
  version: string;
  uptimeHours: number;
};

type FeatureFlag = {
  key: string;
  enabled: boolean;
};

//////////////////////////////
// 2. MOCK DATA (TEMP)
//////////////////////////////

const SYSTEM_STATUS: SystemStatus = {
  environment: "production",
  version: "1.0.0",
  uptimeHours: 342,
};

const FEATURE_FLAGS: FeatureFlag[] = [
  { key: "proof_enabled", enabled: true },
  { key: "coach_notes", enabled: true },
  { key: "trajectory_view", enabled: true },
  { key: "advanced_analytics", enabled: false },
];

//////////////////////////////
// 3. COMPONENT
//////////////////////////////

interface AdminSystemOverviewProps {
  systemStatus?: SystemStatus;
  featureFlags?: FeatureFlag[];
}

export default function AdminSystemOverview({
  systemStatus: apiSystemStatus,
  featureFlags: apiFeatureFlags
}: AdminSystemOverviewProps = {}) {
  const systemStatus = apiSystemStatus || SYSTEM_STATUS;
  const featureFlags = apiFeatureFlags || FEATURE_FLAGS;
  const formatUptime = (hours: number) => {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}t`;
  };

  const getEnvBadgeStyle = (env: string) => {
    switch (env) {
      case 'production':
        return { bg: `${tokens.colors.success}15`, text: tokens.colors.success };
      case 'staging':
        return { bg: `${tokens.colors.primaryLight}15`, text: tokens.colors.primaryLight };
      default:
        return { bg: `${tokens.colors.steel}15`, text: tokens.colors.steel };
    }
  };

  const envStyle = getEnvBadgeStyle(systemStatus.environment);

  return (
    <section
      aria-label="System overview"
      style={{
        minHeight: '100vh',
        backgroundColor: tokens.colors.snow,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Server size={28} color={tokens.colors.primary} />
          <h1 style={{ ...typography.title1 as React.CSSProperties, color: tokens.colors.charcoal, margin: 0 }}>
            Systemoversikt
          </h1>
        </div>
        <p style={{ ...typography.body as React.CSSProperties, color: tokens.colors.steel, margin: 0 }}>
          Systemhelse og konfigurasjon
        </p>
      </div>

      {/* System Status Cards */}
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {/* Environment */}
          <div
            style={{
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.borderRadius.lg,
              padding: '20px',
              boxShadow: tokens.shadows.card,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Shield size={18} color={tokens.colors.steel} />
              <span style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel }}>
                Miljo
              </span>
            </div>
            <span
              style={{
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: tokens.borderRadius.sm,
                backgroundColor: envStyle.bg,
                color: envStyle.text,
                ...typography.body as React.CSSProperties,
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {systemStatus.environment}
            </span>
          </div>

          {/* Version */}
          <div
            style={{
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.borderRadius.lg,
              padding: '20px',
              boxShadow: tokens.shadows.card,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Activity size={18} color={tokens.colors.steel} />
              <span style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel }}>
                Versjon
              </span>
            </div>
            <span style={{ ...typography.title3 as React.CSSProperties, color: tokens.colors.charcoal }}>
              v{systemStatus.version}
            </span>
          </div>

          {/* Uptime */}
          <div
            style={{
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.borderRadius.lg,
              padding: '20px',
              boxShadow: tokens.shadows.card,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Clock size={18} color={tokens.colors.steel} />
              <span style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel }}>
                Oppetid
              </span>
            </div>
            <span style={{ ...typography.title3 as React.CSSProperties, color: tokens.colors.charcoal }}>
              {formatUptime(systemStatus.uptimeHours)}
            </span>
          </div>
        </div>

        {/* Feature Flags */}
        <div
          style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.borderRadius.lg,
            boxShadow: tokens.shadows.card,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '20px', borderBottom: `1px solid ${tokens.colors.mist}` }}>
            <h2 style={{ ...typography.title3 as React.CSSProperties, color: tokens.colors.charcoal, margin: 0 }}>
              Feature Flags
            </h2>
            <p style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel, margin: 0, marginTop: '4px' }}>
              Aktive systemfunksjoner
            </p>
          </div>

          <div>
            {featureFlags.map((flag, index) => (
              <div
                key={flag.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderBottom: index < featureFlags.length - 1 ? `1px solid ${tokens.colors.mist}` : 'none',
                }}
              >
                <span style={{ ...typography.body as React.CSSProperties, color: tokens.colors.charcoal }}>
                  {flag.key}
                </span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 10px',
                    borderRadius: tokens.borderRadius.sm,
                    backgroundColor: flag.enabled ? `${tokens.colors.success}15` : `${tokens.colors.error}15`,
                  }}
                >
                  {flag.enabled ? (
                    <CheckCircle size={16} color={tokens.colors.success} />
                  ) : (
                    <XCircle size={16} color={tokens.colors.error} />
                  )}
                  <span
                    style={{
                      ...typography.caption as React.CSSProperties,
                      fontWeight: 500,
                      color: flag.enabled ? tokens.colors.success : tokens.colors.error,
                    }}
                  >
                    {flag.enabled ? 'Aktivert' : 'Deaktivert'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

//////////////////////////////
// 4. NOTES
//////////////////////////////

/*
- Do NOT show counts of users, athletes, or coaches.
- Do NOT link to athlete or coach views.
- Do NOT introduce dashboards or charts.
- This screen is for system integrity, not insight.
*/
