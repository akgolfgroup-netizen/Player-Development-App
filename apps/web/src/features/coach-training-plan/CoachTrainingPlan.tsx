/**
 * AK Golf Academy - Coach Training Plan (View Only)
 * Design System v3.0 - Blue Palette 01
 *
 * Purpose:
 * - Display training plan overview for a specific athlete
 * - Read-only view - use CoachTrainingPlanEditor for modifications
 *
 * Contract references:
 * - COACH_ADMIN_IMPLEMENTATION_CONTRACT.md
 * - COACH_ADMIN_SCREEN_CONTRACT.md
 *
 * NON-NEGOTIABLE:
 * - Past blocks are READ-ONLY
 * - No backdating
 * - No performance outcomes shown
 * - No "effective block" indicators
 */

import React from "react";
import { ArrowLeft, ClipboardList, Calendar, Clock, CheckCircle, Edit } from "lucide-react";
import { tokens } from "../../design-tokens";

// Typography from design tokens
const typography = tokens.typography;

//////////////////////////////
// 1. TYPES
//////////////////////////////

type TrainingBlock = {
  id: string;
  name: string;
  description?: string;
  date: string; // ISO date
  durationMinutes?: number;
  completed: boolean;
};

type Props = {
  athleteId: string;
  athleteName?: string;
  blocks?: TrainingBlock[];
  onEdit?: () => void;
  onBack?: () => void;
};

//////////////////////////////
// 2. MOCK DATA
//////////////////////////////

const MOCK_BLOCKS: TrainingBlock[] = [
  { id: "b1", name: "Putting fokus", description: "Lag putts fra 1-3 meter", date: "2025-12-28", durationMinutes: 60, completed: false },
  { id: "b2", name: "Driver trening", date: "2025-12-30", durationMinutes: 90, completed: false },
  { id: "b3", name: "Kort spill", date: "2025-12-22", durationMinutes: 45, completed: false },
  { id: "b4", name: "Banespill", date: "2025-12-15", durationMinutes: 180, completed: true },
  { id: "b5", name: "Teknikktrening", date: "2025-12-10", durationMinutes: 60, completed: true },
];

//////////////////////////////
// 3. HELPERS
//////////////////////////////

const getTodayISO = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const isInPast = (dateString: string): boolean => {
  return dateString < getTodayISO();
};

const sortByDate = (blocks: TrainingBlock[]): TrainingBlock[] =>
  [...blocks].sort((a, b) => a.date.localeCompare(b.date));

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("nb-NO", {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
};

const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("nb-NO", {
    day: 'numeric',
    month: 'short',
  });
};

//////////////////////////////
// 4. COMPONENT
//////////////////////////////

export default function CoachTrainingPlan({
  athleteId,
  athleteName = "Spiller",
  blocks: apiBlocks,
  onEdit,
  onBack,
}: Props) {
  const blocks = apiBlocks || MOCK_BLOCKS;
  const sortedBlocks = sortByDate(blocks);

  const upcomingBlocks = sortedBlocks.filter(b => !isInPast(b.date) && !b.completed);
  const completedBlocks = sortedBlocks.filter(b => isInPast(b.date) || b.completed);

  // Get next session
  const nextSession = upcomingBlocks[0];

  return (
    <section
      aria-label="Training plan"
      style={{
        minHeight: '100vh',
        backgroundColor: tokens.colors.snow,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
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
            <span>Tilbake</span>
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: tokens.borderRadius.md,
                backgroundColor: `${tokens.colors.primary}10`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ClipboardList size={24} color={tokens.colors.primary} />
            </div>
            <div>
              <h1 style={{ ...typography.title1 as React.CSSProperties, color: tokens.colors.charcoal, margin: 0 }}>
                Treningsplan
              </h1>
              <p style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel, margin: 0, marginTop: '4px' }}>
                {athleteName}
              </p>
            </div>
          </div>

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: tokens.borderRadius.md,
                border: `1px solid ${tokens.colors.primary}`,
                backgroundColor: 'transparent',
                color: tokens.colors.primary,
                cursor: 'pointer',
                ...typography.body as React.CSSProperties,
                fontWeight: 600,
              }}
            >
              <Edit size={18} />
              Rediger plan
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Next Session Highlight */}
        {nextSession && (
          <div
            style={{
              backgroundColor: tokens.colors.primary,
              borderRadius: tokens.borderRadius.lg,
              padding: '24px',
              marginBottom: '24px',
              color: tokens.colors.white,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Calendar size={18} />
              <span style={{ ...typography.caption as React.CSSProperties, opacity: 0.9 }}>
                Neste økt
              </span>
            </div>
            <h2 style={{ ...typography.title2 as React.CSSProperties, margin: 0, marginBottom: '8px' }}>
              {nextSession.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ ...typography.body as React.CSSProperties }}>
                {formatDate(nextSession.date)}
              </span>
              {nextSession.durationMinutes && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} />
                  <span>{nextSession.durationMinutes} min</span>
                </div>
              )}
            </div>
            {nextSession.description && (
              <p style={{ ...typography.body as React.CSSProperties, margin: 0, marginTop: '12px', opacity: 0.9 }}>
                {nextSession.description}
              </p>
            )}
          </div>
        )}

        {/* Upcoming Sessions */}
        <div
          style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.borderRadius.lg,
            boxShadow: tokens.shadows.card,
            overflow: 'hidden',
            marginBottom: '24px',
          }}
        >
          <div style={{ padding: '20px', borderBottom: `1px solid ${tokens.colors.mist}` }}>
            <h2 style={{ ...typography.title3 as React.CSSProperties, color: tokens.colors.charcoal, margin: 0 }}>
              Kommende økter
            </h2>
            <p style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel, margin: 0, marginTop: '4px' }}>
              {upcomingBlocks.length} planlagte
            </p>
          </div>

          {upcomingBlocks.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <Calendar size={40} color={tokens.colors.mist} style={{ marginBottom: '12px' }} />
              <p style={{ ...typography.body as React.CSSProperties, color: tokens.colors.steel }}>
                Ingen planlagte økter
              </p>
            </div>
          ) : (
            <div>
              {upcomingBlocks.map((block, index) => (
                <div
                  key={block.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    borderBottom: index < upcomingBlocks.length - 1 ? `1px solid ${tokens.colors.mist}` : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      padding: '8px',
                      borderRadius: tokens.borderRadius.md,
                      backgroundColor: `${tokens.colors.primary}10`,
                      color: tokens.colors.primary,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ ...typography.caption as React.CSSProperties, fontWeight: 600 }}>
                      {new Date(block.date).toLocaleDateString("nb-NO", { weekday: 'short' }).toUpperCase()}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 700 }}>
                      {new Date(block.date).getDate()}
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ ...typography.body as React.CSSProperties, fontWeight: 600, color: tokens.colors.charcoal }}>
                      {block.name}
                    </div>
                    {block.description && (
                      <p style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel, margin: 0, marginTop: '4px' }}>
                        {block.description}
                      </p>
                    )}
                  </div>

                  {block.durationMinutes && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} color={tokens.colors.steel} />
                      <span style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel }}>
                        {block.durationMinutes} min
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Sessions */}
        {completedBlocks.length > 0 && (
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
                Fullførte økter
              </h2>
              <p style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel, margin: 0, marginTop: '4px' }}>
                {completedBlocks.length} gjennomført
              </p>
            </div>

            <div>
              {completedBlocks.slice(0, 5).map((block, index) => (
                <div
                  key={block.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '14px 20px',
                    borderBottom: index < Math.min(completedBlocks.length, 5) - 1 ? `1px solid ${tokens.colors.mist}` : 'none',
                    backgroundColor: tokens.colors.snow,
                  }}
                >
                  <CheckCircle size={20} color={tokens.colors.success} />

                  <div style={{ flex: 1 }}>
                    <span style={{ ...typography.body as React.CSSProperties, color: tokens.colors.steel }}>
                      {block.name}
                    </span>
                  </div>

                  <span style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel }}>
                    {formatShortDate(block.date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

//////////////////////////////
// 5. STRICT NOTES
//////////////////////////////

/*
- This is a READ-ONLY view of the training plan.
- Do NOT allow editing from this component.
- Do NOT show performance outcomes of blocks.
- Do NOT show "effective" or "recommended" indicators.
- Do NOT show AI suggestions.
- Past blocks are displayed as completed history only.
*/
