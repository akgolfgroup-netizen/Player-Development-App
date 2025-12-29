/**
 * AK Golf Academy - Coach Athlete Detail
 * Design System v3.0 - Semantic CSS Variables
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
import { FileText, TrendingUp, ClipboardList, StickyNote, ChevronRight } from "lucide-react";
import Button from '../../ui/primitives/Button';
import Card from '../../ui/primitives/Card';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';

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
        backgroundColor: 'var(--accent)',
        color: 'white',
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
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header - using PageHeader from design system with Avatar */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '0 24px' }}>
        <Avatar name={athleteName} size={64} />
        <div style={{ flex: 1 }}>
          <PageHeader
            title={athleteName}
            subtitle="Velg handling nedenfor"
            onBack={onBack}
            divider={false}
          />
        </div>
      </div>
      <div style={{ borderBottom: '1px solid var(--border-default)', marginBottom: '24px' }} />

      {/* Navigation Actions */}
      <div style={{ padding: '24px' }}>
        <nav aria-label="Athlete views">
          <Card variant="default" padding="none">
            <div style={{ overflow: 'hidden' }}>
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
                    borderBottom: index < navigationItems.length - 1 ? '1px solid var(--border-default)' : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <item.icon size={24} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{
                      display: 'block',
                      fontSize: '15px',
                      lineHeight: '20px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}>
                      {item.label}
                    </span>
                    <span style={{
                      display: 'block',
                      fontSize: '13px',
                      lineHeight: '18px',
                      color: 'var(--text-secondary)',
                      marginTop: '2px',
                    }}>
                      {item.description}
                    </span>
                  </div>
                  <ChevronRight size={20} style={{ color: 'var(--text-secondary)' }} />
                </button>
              ))}
            </div>
          </Card>
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
