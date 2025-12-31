/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AK Golf Academy - Coach Training Plan Editor
 * Design System v3.0 - Blue Palette 01
 *
 * Purpose:
 * - Enable coach to create, modify, and remove FUTURE training blocks
 * - Enforce strict immutability of past/completed records
 *
 * Contract references:
 * - COACH_ADMIN_IMPLEMENTATION_CONTRACT.md
 * - COACH_ADMIN_SCREEN_CONTRACT.md
 *
 * NON-NEGOTIABLE:
 * - Past blocks are READ-ONLY (no edit controls rendered)
 * - Completed blocks are READ-ONLY
 * - No backdating allowed
 * - No performance data shown
 * - No "effective" or "recommended" indicators
 * - All changes logged via audit trail
 */

import React, { useState } from "react";
import { ArrowLeft, ClipboardList, Plus, Trash2, Calendar, Clock, CheckCircle, Lock } from "lucide-react";
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';

//////////////////////////////
// 1. TYPES
//////////////////////////////

type TrainingBlock = {
  id: string;
  name: string;
  description?: string;
  date: string; // ISO date YYYY-MM-DD
  durationMinutes?: number;
  completed: boolean;
};

type Props = {
  athleteId: string;
  athleteName?: string;
  blocks?: TrainingBlock[];
  onAddBlock: (athleteId: string, block: Omit<TrainingBlock, "id" | "completed">) => void;
  onUpdateBlock: (athleteId: string, blockId: string, updates: Partial<TrainingBlock>) => void;
  onRemoveBlock: (athleteId: string, blockId: string) => void;
  onBack: () => void;
};

//////////////////////////////
// 2. MOCK DATA
//////////////////////////////

const MOCK_BLOCKS: TrainingBlock[] = [
  { id: "b1", name: "Putting fokus", description: "Lag putts fra 1-3 meter", date: "2025-12-28", durationMinutes: 60, completed: false },
  { id: "b2", name: "Driver trening", description: "Fokus på tempo og balanse", date: "2025-12-30", durationMinutes: 90, completed: false },
  { id: "b3", name: "Kort spill", date: "2025-12-15", durationMinutes: 45, completed: true },
  { id: "b4", name: "Banespill", date: "2025-12-10", durationMinutes: 180, completed: true },
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

const isLocked = (block: TrainingBlock): boolean => {
  return isInPast(block.date) || block.completed;
};

const sortByDateAsc = (blocks: TrainingBlock[]): TrainingBlock[] =>
  [...blocks].sort((a, b) => a.date.localeCompare(b.date));

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("nb-NO", {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

//////////////////////////////
// 4. COMPONENT
//////////////////////////////

export default function CoachTrainingPlanEditor({
  athleteId,
  athleteName = "Spiller",
  blocks: apiBlocks,
  onAddBlock,
  onUpdateBlock,
  onRemoveBlock,
  onBack,
}: Props) {
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const blocks = apiBlocks || MOCK_BLOCKS;
  const sortedBlocks = sortByDateAsc(blocks);
  const pastBlocks = sortedBlocks.filter((b) => isLocked(b));
  const futureBlocks = sortedBlocks.filter((b) => !isLocked(b));

  const handleAdd = () => {
    if (!newName.trim() || !newDate) return;
    if (isInPast(newDate)) return;

    onAddBlock(athleteId, {
      name: newName.trim(),
      description: newDescription.trim() || undefined,
      date: newDate,
      durationMinutes: newDuration ? parseInt(newDuration, 10) : undefined,
    });

    setNewName("");
    setNewDescription("");
    setNewDate("");
    setNewDuration("");
    setShowAddForm(false);
  };

  const handleRemove = (block: TrainingBlock) => {
    if (isLocked(block)) return;
    onRemoveBlock(athleteId, block.id);
  };

  return (
    <section
      aria-label="Training plan editor"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderBottom: `1px solid ${'var(--border-default)'}`,
          padding: '16px 24px',
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            cursor: 'pointer',
            padding: 0,
            marginBottom: '16px',
            fontSize: '15px', lineHeight: '20px',
          }}
        >
          <ArrowLeft size={20} />
          <span>Tilbake</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(var(--accent-rgb), 0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ClipboardList size={24} color={'var(--accent)'} />
            </div>
            <div>
              <h1 style={{ fontSize: '28px', lineHeight: '34px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Treningsplan
              </h1>
              <p style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', margin: 0, marginTop: '4px' }}>
                {athleteName} • {futureBlocks.length} kommende økter
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-primary)',
              cursor: 'pointer',
              fontSize: '15px', lineHeight: '20px',
              fontWeight: 600,
            }}
          >
            <Plus size={18} />
            Ny økt
          </button>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Add Block Form */}
        {showAddForm && (
          <div
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
              padding: '20px',
              marginBottom: '24px',
              border: `2px solid ${'var(--accent)'}`,
            }}
          >
            <h2 style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, marginBottom: '20px' }}>
              Legg til ny økt
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Navn på økt *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="F.eks. Putting fokus"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${'var(--border-default)'}`,
                    fontSize: '15px', lineHeight: '20px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Dato *
                </label>
                <input
                  type="date"
                  value={newDate}
                  min={getTodayISO()}
                  onChange={(e) => setNewDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${'var(--border-default)'}`,
                    fontSize: '15px', lineHeight: '20px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Beskrivelse
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Valgfri beskrivelse av økten..."
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${'var(--border-default)'}`,
                    fontSize: '15px', lineHeight: '20px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Varighet (minutter)
                </label>
                <input
                  type="number"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  placeholder="F.eks. 60"
                  min="1"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${'var(--border-default)'}`,
                    fontSize: '15px', lineHeight: '20px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                style={{
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${'var(--border-default)'}`,
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '15px', lineHeight: '20px',
                  fontWeight: 500,
                }}
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={handleAdd}
                disabled={!newName.trim() || !newDate}
                style={{
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: (newName.trim() && newDate) ? 'var(--accent)' : 'var(--border-default)',
                  color: (newName.trim() && newDate) ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  cursor: (newName.trim() && newDate) ? 'pointer' : 'not-allowed',
                  fontSize: '15px', lineHeight: '20px',
                  fontWeight: 600,
                }}
              >
                Legg til økt
              </button>
            </div>
          </div>
        )}

        {/* Future Blocks */}
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
            marginBottom: '24px',
          }}
        >
          <div style={{ padding: '20px', borderBottom: `1px solid ${'var(--border-default)'}` }}>
            <h2 style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Kommende økter
            </h2>
          </div>

          {futureBlocks.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <Calendar size={40} color={'var(--border-default)'} style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)' }}>
                Ingen planlagte økter
              </p>
            </div>
          ) : (
            <div>
              {futureBlocks.map((block, index) => (
                <div
                  key={block.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    borderBottom: index < futureBlocks.length - 1 ? `1px solid ${'var(--border-default)'}` : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      padding: '8px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--accent)',
                      color: 'var(--bg-primary)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600, textTransform: 'uppercase' }}>
                      {formatDate(block.date).split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 700 }}>
                      {new Date(block.date).getDate()}
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', lineHeight: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {block.name}
                    </div>
                    {block.description && (
                      <p style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', margin: 0, marginTop: '4px' }}>
                        {block.description}
                      </p>
                    )}
                    {block.durationMinutes && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <Clock size={12} color={'var(--text-secondary)'} />
                        <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
                          {block.durationMinutes} min
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(block)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${'var(--error)'}`,
                      backgroundColor: 'transparent',
                      color: 'var(--error)',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Blocks (Read-only) */}
        {pastBlocks.length > 0 && (
          <div
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
              overflow: 'hidden',
              opacity: 0.8,
            }}
          >
            <div style={{ padding: '20px', borderBottom: `1px solid ${'var(--border-default)'}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} color={'var(--text-secondary)'} />
              <h2 style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>
                Fullførte økter
              </h2>
            </div>

            <div>
              {pastBlocks.map((block, index) => (
                <div
                  key={block.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    borderBottom: index < pastBlocks.length - 1 ? `1px solid ${'var(--border-default)'}` : 'none',
                    backgroundColor: 'var(--bg-secondary)',
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      padding: '8px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--border-default)',
                      color: 'var(--text-secondary)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600, textTransform: 'uppercase' }}>
                      {formatDate(block.date).split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 700 }}>
                      {new Date(block.date).getDate()}
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', lineHeight: '20px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      {block.name}
                    </div>
                    {block.durationMinutes && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <Clock size={12} color={'var(--text-secondary)'} />
                        <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
                          {block.durationMinutes} min
                        </span>
                      </div>
                    )}
                  </div>

                  {block.completed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={16} color={'var(--success)'} />
                      <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--success)' }}>
                        Fullført
                      </span>
                    </div>
                  )}
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
- Do NOT render edit controls for past/completed blocks.
- Do NOT allow backdating (min={getTodayISO()} on date input).
- Do NOT show performance outcomes of any block.
- Do NOT show "effective" or "successful" indicators.
- Do NOT show AI-generated suggestions or recommendations.
- Do NOT allow importing plans from other athletes.
- Do NOT show comparison to other athletes' plans.
- All mutations are logged by the API layer (not this component's responsibility).
*/
