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
import Button from '../../ui/primitives/Button';
import Card from '../../ui/primitives/Card';
import StateCard from '../../ui/composites/StateCard';
import { PageTitle, SectionTitle } from '../../components/typography';

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
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-default)',
          padding: '16px 24px',
        }}
      >
        {onBack && (
          <div style={{ marginBottom: '16px' }}>
            <Button variant="ghost" size="sm" onClick={onBack} leftIcon={<ArrowLeft size={18} />}>
              Tilbake
            </Button>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-accent-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ClipboardList size={24} color="var(--accent)" />
            </div>
            <div>
              <PageTitle style={{ margin: 0 }}>
                Treningsplan
              </PageTitle>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, marginTop: '4px' }}>
                {athleteName}
              </p>
            </div>
          </div>

          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit} leftIcon={<Edit size={18} />}>
              Rediger plan
            </Button>
          )}
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Next Session Highlight */}
        {nextSession && (
          <Card variant="accent" padding="lg" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Calendar size={18} color="var(--accent)" />
              <span style={{ fontSize: '13px', color: 'var(--accent)', opacity: 0.9 }}>
                Neste økt
              </span>
            </div>
            <SectionTitle style={{ margin: '0 0 8px' }}>
              {nextSession.name}
            </SectionTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
                {formatDate(nextSession.date)}
              </span>
              {nextSession.durationMinutes && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                  <Clock size={14} />
                  <span>{nextSession.durationMinutes} min</span>
                </div>
              )}
            </div>
            {nextSession.description && (
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: 0, marginTop: '12px' }}>
                {nextSession.description}
              </p>
            )}
          </Card>
        )}

        {/* Upcoming Sessions */}
        <Card variant="default" padding="none" style={{ marginBottom: '24px', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-default)' }}>
            <SectionTitle style={{ margin: 0 }}>
              Kommende økter
            </SectionTitle>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, marginTop: '4px' }}>
              {upcomingBlocks.length} planlagte
            </p>
          </div>

          {upcomingBlocks.length === 0 ? (
            <StateCard variant="empty" icon={Calendar} title="Ingen planlagte økter" />
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
                    borderBottom: index < upcomingBlocks.length - 1 ? '1px solid var(--border-default)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      padding: '8px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-accent-subtle)',
                      color: 'var(--accent)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>
                      {new Date(block.date).toLocaleDateString("nb-NO", { weekday: 'short' }).toUpperCase()}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 700 }}>
                      {new Date(block.date).getDate()}
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {block.name}
                    </div>
                    {block.description && (
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, marginTop: '4px' }}>
                        {block.description}
                      </p>
                    )}
                  </div>

                  {block.durationMinutes && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} color="var(--text-tertiary)" />
                      <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                        {block.durationMinutes} min
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Completed Sessions */}
        {completedBlocks.length > 0 && (
          <Card variant="default" padding="none" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-default)' }}>
              <SectionTitle style={{ margin: 0 }}>
                Fullførte økter
              </SectionTitle>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, marginTop: '4px' }}>
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
                    borderBottom: index < Math.min(completedBlocks.length, 5) - 1 ? '1px solid var(--border-default)' : 'none',
                    backgroundColor: 'var(--bg-secondary)',
                  }}
                >
                  <CheckCircle size={20} color="var(--success)" />

                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                      {block.name}
                    </span>
                  </div>

                  <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                    {formatShortDate(block.date)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
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
