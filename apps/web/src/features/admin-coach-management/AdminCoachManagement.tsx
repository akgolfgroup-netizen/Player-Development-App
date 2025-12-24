/**
 * AK Golf Academy - Admin Coach Management
 * Design System v3.0 - Blue Palette 01
 *
 * Purpose:
 * - Manage coach accounts as system users
 * - No performance, no athlete linkage
 *
 * Contract references:
 * - COACH_ADMIN_IMPLEMENTATION_CONTRACT.md
 * - COACH_ADMIN_SCREEN_CONTRACT.md
 *
 * NON-NEGOTIABLE:
 * - Coaches are users, not evaluable entities
 */

import React, { useState } from "react";
import { Mail, CheckCircle, XCircle, UserCog } from "lucide-react";

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

type CoachAccount = {
  id: string;
  name: string;
  email: string;
  active: boolean;
};

//////////////////////////////
// 2. MOCK DATA (TEMP)
//////////////////////////////

const MOCK_COACHES: CoachAccount[] = [
  { id: "c1", name: "Thomas Berg", email: "thomas@akgolf.no", active: true },
  { id: "c2", name: "Maria Hansen", email: "maria@akgolf.no", active: true },
  { id: "c3", name: "Erik Larsen", email: "erik@akgolf.no", active: false },
];

//////////////////////////////
// 3. AVATAR COMPONENT
//////////////////////////////

const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 44 }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: tokens.colors.primary,
        color: tokens.colors.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
};

//////////////////////////////
// 4. COMPONENT
//////////////////////////////

interface AdminCoachManagementProps {
  coaches?: CoachAccount[];
}

export default function AdminCoachManagement({ coaches: apiCoaches }: AdminCoachManagementProps = {}) {
  const initialCoaches = apiCoaches || MOCK_COACHES;
  const [coaches, setCoaches] = useState<CoachAccount[]>(initialCoaches);

  const toggleActive = (id: string) => {
    setCoaches((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const activeCount = coaches.filter(c => c.active).length;

  return (
    <section
      aria-label="Coach management"
      style={{
        minHeight: '100vh',
        backgroundColor: tokens.colors.snow,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <UserCog size={28} color={tokens.colors.primary} />
          <h1 style={{ ...typography.title1 as React.CSSProperties, color: tokens.colors.charcoal, margin: 0 }}>
            Trenerkontoer
          </h1>
        </div>
        <p style={{ ...typography.body as React.CSSProperties, color: tokens.colors.steel, margin: 0 }}>
          {activeCount} aktive av {coaches.length} kontoer
        </p>
      </div>

      {/* Coach List */}
      <div style={{ padding: '0 24px 24px' }}>
        <div
          style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.borderRadius.lg,
            boxShadow: tokens.shadows.card,
            overflow: 'hidden',
          }}
        >
          {coaches.map((coach, index) => (
            <div
              key={coach.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 20px',
                borderBottom: index < coaches.length - 1 ? `1px solid ${tokens.colors.mist}` : 'none',
              }}
            >
              <Avatar name={coach.name} />

              <div style={{ flex: 1 }}>
                <div style={{ ...typography.body as React.CSSProperties, fontWeight: 500, color: tokens.colors.charcoal }}>
                  {coach.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <Mail size={14} color={tokens.colors.steel} />
                  <span style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel }}>
                    {coach.email}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: tokens.borderRadius.sm,
                  backgroundColor: coach.active ? `${tokens.colors.success}15` : `${tokens.colors.steel}15`,
                }}
              >
                {coach.active ? (
                  <CheckCircle size={14} color={tokens.colors.success} />
                ) : (
                  <XCircle size={14} color={tokens.colors.steel} />
                )}
                <span
                  style={{
                    ...typography.caption as React.CSSProperties,
                    fontWeight: 500,
                    color: coach.active ? tokens.colors.success : tokens.colors.steel,
                  }}
                >
                  {coach.active ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>

              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => toggleActive(coach.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: tokens.borderRadius.sm,
                  border: `1px solid ${coach.active ? tokens.colors.error : tokens.colors.success}`,
                  backgroundColor: 'transparent',
                  color: coach.active ? tokens.colors.error : tokens.colors.success,
                  ...typography.caption as React.CSSProperties,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {coach.active ? 'Deaktiver' : 'Aktiver'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

//////////////////////////////
// 5. STRICT NOTES
//////////////////////////////

/*
- Do NOT show number of athletes per coach.
- Do NOT show activity, sessions, or results.
- Do NOT show rankings or comparisons.
- This screen manages access only.
*/
