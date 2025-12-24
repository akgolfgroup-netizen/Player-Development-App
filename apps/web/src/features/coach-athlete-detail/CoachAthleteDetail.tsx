/**
 * AK Golf Academy - Coach Athlete Detail
 * Design System v3.0 - Blue Palette 01
 *
 * Purpose:
 * - Provide neutral navigation hub for a single athlete
 * - Bind together approved coach views WITHOUT interpretation
 *
 * Contract references:
 * - COACH_ADMIN_IMPLEMENTATION_CONTRACT.md
 * - COACH_ADMIN_SCREEN_CONTRACT.md
 *
 * NON-NEGOTIABLE:
 * - No summaries or performance indicators
 * - No prioritization or default focus
 * - Order of items remains static and neutral
 */

//////////////////////////////
// 1. IMPORTS
//////////////////////////////

import React from "react";
import { ArrowLeft, FileText, TrendingUp, ClipboardList, StickyNote, ChevronRight } from "lucide-react";

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
// 2. TYPES
//////////////////////////////

type Props = {
  athleteId: string;
  athleteName?: string;
  onBack?: () => void;
  onViewProof: (athleteId: string) => void;
  onViewTrajectory: (athleteId: string) => void;
  onEditTrainingPlan: (athleteId: string) => void;
  onViewNotes: (athleteId: string) => void;
};

//////////////////////////////
// 3. NAVIGATION ITEMS
//////////////////////////////

// Static order - no reordering based on importance
const navigationItems = [
  { id: 'proof', label: 'Se dokumentasjon', description: 'Video og bilder fra okter', icon: FileText },
  { id: 'trajectory', label: 'Se utvikling', description: 'Oversikt over fremgang', icon: TrendingUp },
  { id: 'plan', label: 'Treningsplan', description: 'Rediger og planlegg okter', icon: ClipboardList },
  { id: 'notes', label: 'Notater', description: 'Dine notater om spilleren', icon: StickyNote },
];

//////////////////////////////
// 4. AVATAR COMPONENT
//////////////////////////////

const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 64 }) => {
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
// 5. MAIN COMPONENT
//////////////////////////////

export default function CoachAthleteDetail({
  athleteId,
  athleteName = "Spiller",
  onBack,
  onViewProof,
  onViewTrajectory,
  onEditTrainingPlan,
  onViewNotes,
}: Props) {
  const handleAction = (actionId: string) => {
    switch (actionId) {
      case 'proof':
        onViewProof(athleteId);
        break;
      case 'trajectory':
        onViewTrajectory(athleteId);
        break;
      case 'plan':
        onEditTrainingPlan(athleteId);
        break;
      case 'notes':
        onViewNotes(athleteId);
        break;
    }
  };

  return (
    <section
      aria-label="Athlete detail"
      style={{
        minHeight: '100vh',
        backgroundColor: tokens.colors.snow,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header with back button */}
      <div
        style={{
          backgroundColor: tokens.colors.white,
          borderBottom: `1px solid ${tokens.colors.mist}`,
          padding: '16px 24px',
        }}
      >
        {onBack && (
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: tokens.colors.primary,
              cursor: 'pointer',
              padding: 0,
              marginBottom: '16px',
              ...typography.body as React.CSSProperties,
            }}
          >
            <ArrowLeft size={20} />
            <span>Tilbake til spillere</span>
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Avatar name={athleteName} size={64} />
          <div>
            <h1 style={{ ...typography.title1 as React.CSSProperties, color: tokens.colors.charcoal, margin: 0 }}>
              {athleteName}
            </h1>
            <p style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel, margin: 0, marginTop: '4px' }}>
              Velg handling nedenfor
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div style={{ padding: '24px' }}>
        <nav aria-label="Athlete views">
          <div
            style={{
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.borderRadius.lg,
              boxShadow: tokens.shadows.card,
              overflow: 'hidden',
            }}
          >
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleAction(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '18px 20px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: index < navigationItems.length - 1 ? `1px solid ${tokens.colors.mist}` : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = tokens.colors.snow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: tokens.borderRadius.md,
                    backgroundColor: `${tokens.colors.primary}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <item.icon size={24} color={tokens.colors.primary} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ display: 'block', ...typography.body as React.CSSProperties, fontWeight: 600, color: tokens.colors.charcoal }}>
                    {item.label}
                  </span>
                  <span style={{ display: 'block', ...typography.caption as React.CSSProperties, color: tokens.colors.steel, marginTop: '2px' }}>
                    {item.description}
                  </span>
                </div>
                <ChevronRight size={20} color={tokens.colors.steel} />
              </button>
            ))}
          </div>
        </nav>
      </div>
    </section>
  );
}

//////////////////////////////
// 6. NOTES
//////////////////////////////

/*
- Do NOT show athlete stats, tests, sessions, or summaries.
- Do NOT show last activity, trends, or deltas.
- Do NOT preselect or highlight any action.
- Do NOT add counts or ordering based on importance.
- Order of items remains static and neutral.
- This screen is navigation only - neutral gateway to coach tools.
*/
