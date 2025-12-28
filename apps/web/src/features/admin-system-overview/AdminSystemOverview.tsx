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
        return { bg: 'rgba(var(--success-rgb), 0.15)', text: 'var(--success)' };
      case 'staging':
        return { bg: 'rgba(var(--accent-rgb), 0.15)', text: 'var(--accent)' };
      default:
        return { bg: 'rgba(var(--text-secondary-rgb), 0.15)', text: 'var(--text-secondary)' };
    }
  };

  const envStyle = getEnvBadgeStyle(systemStatus.environment);

  return (
    <section
      aria-label="System overview"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Server size={28} color={'var(--accent)'} />
          <h1 style={{ fontSize: '28px', lineHeight: '34px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Systemoversikt
          </h1>
        </div>
        <p style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)', margin: 0 }}>
          Systemhelse og konfigurasjon
        </p>
      </div>

      {/* System Status Cards */}
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {/* Environment */}
          <div
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Shield size={18} color={'var(--text-secondary)'} />
              <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
                Miljo
              </span>
            </div>
            <span
              style={{
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: envStyle.bg,
                color: envStyle.text,
                fontSize: '15px', lineHeight: '20px',
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
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Activity size={18} color={'var(--text-secondary)'} />
              <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
                Versjon
              </span>
            </div>
            <span style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)' }}>
              v{systemStatus.version}
            </span>
          </div>

          {/* Uptime */}
          <div
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Clock size={18} color={'var(--text-secondary)'} />
              <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
                Oppetid
              </span>
            </div>
            <span style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {formatUptime(systemStatus.uptimeHours)}
            </span>
          </div>
        </div>

        {/* Feature Flags */}
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '20px', borderBottom: `1px solid ${'var(--border-default)'}` }}>
            <h2 style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Feature Flags
            </h2>
            <p style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', margin: 0, marginTop: '4px' }}>
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
                  borderBottom: index < featureFlags.length - 1 ? `1px solid ${'var(--border-default)'}` : 'none',
                }}
              >
                <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)' }}>
                  {flag.key}
                </span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: flag.enabled ? 'rgba(var(--success-rgb), 0.15)' : 'rgba(var(--error-rgb), 0.15)',
                  }}
                >
                  {flag.enabled ? (
                    <CheckCircle size={16} color={'var(--success)'} />
                  ) : (
                    <XCircle size={16} color={'var(--error)'} />
                  )}
                  <span
                    style={{
                      fontSize: '12px', lineHeight: '16px',
                      fontWeight: 500,
                      color: flag.enabled ? 'var(--success)' : 'var(--error)',
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
