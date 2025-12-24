/**
 * AK Golf Academy - Coach Notes
 * Design System v3.0 - Blue Palette 01
 *
 * Purpose:
 * - Enable coach to create and view observations
 * - Enforce strict separation from system data
 *
 * Contract references:
 * - COACH_ADMIN_IMPLEMENTATION_CONTRACT.md
 * - COACH_ADMIN_SCREEN_CONTRACT.md
 *
 * NON-NEGOTIABLE:
 * - Notes are SEPARATE from PROOF/TRAJECTORY
 * - Notes are clearly labeled as "Coach Note"
 * - No performance data inline
 * - No read tracking
 * - No engagement metrics
 * - Delivered notes are immutable
 */

import React, { useState } from "react";
import { ArrowLeft, StickyNote, Send, CheckCircle } from "lucide-react";
import { tokens } from "../../design-tokens";

// Typography from design tokens
const typography = tokens.typography;

//////////////////////////////
// 1. TYPES
//////////////////////////////

type CoachNote = {
  id: string;
  content: string;
  createdAt: string; // ISO datetime
  delivered: boolean;
};

type Props = {
  athleteId: string;
  athleteName?: string;
  notes?: CoachNote[];
  onAddNote: (athleteId: string, content: string) => void;
  onBack: () => void;
};

//////////////////////////////
// 2. MOCK DATA
//////////////////////////////

const MOCK_NOTES: CoachNote[] = [
  {
    id: "n1",
    content: "Fokuser på å holde albuen nærmere kroppen i nedsvinget. Dette vil gi bedre kontroll.",
    createdAt: "2025-12-18T14:30:00Z",
    delivered: true,
  },
  {
    id: "n2",
    content: "Gode fremskritt på putting denne uken. Fortsett med øvelsen vi snakket om.",
    createdAt: "2025-12-15T10:00:00Z",
    delivered: true,
  },
];

//////////////////////////////
// 3. HELPERS
//////////////////////////////

const sortByDateDesc = (notes: CoachNote[]): CoachNote[] =>
  [...notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString("nb-NO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

//////////////////////////////
// 4. COMPONENT
//////////////////////////////

export default function CoachNotes({
  athleteId,
  athleteName = "Spiller",
  notes: apiNotes,
  onAddNote,
  onBack,
}: Props) {
  const [newNote, setNewNote] = useState("");

  const notes = apiNotes || MOCK_NOTES;
  const sortedNotes = sortByDateDesc(notes);

  const handleSubmit = () => {
    if (!newNote.trim()) return;
    onAddNote(athleteId, newNote.trim());
    setNewNote("");
  };

  return (
    <section
      aria-label="Coach notes"
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
            <StickyNote size={24} color={tokens.colors.primary} />
          </div>
          <div>
            <h1 style={{ ...typography.title1 as React.CSSProperties, color: tokens.colors.charcoal, margin: 0 }}>
              Notater
            </h1>
            <p style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel, margin: 0, marginTop: '4px' }}>
              {athleteName} • {sortedNotes.length} notater
            </p>
          </div>
        </div>
      </div>

      {/* New Note Input */}
      <div style={{ padding: '24px' }}>
        <div
          style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.borderRadius.lg,
            boxShadow: tokens.shadows.card,
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ ...typography.title3 as React.CSSProperties, color: tokens.colors.charcoal, margin: 0, marginBottom: '16px' }}>
            Nytt notat
          </h2>

          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Skriv din observasjon eller tilbakemelding..."
            rows={4}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: tokens.borderRadius.md,
              border: `1px solid ${tokens.colors.mist}`,
              backgroundColor: tokens.colors.snow,
              ...typography.body as React.CSSProperties,
              color: tokens.colors.charcoal,
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <p style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel, margin: 0 }}>
              Notatet vises i spillerens "Fra din trener"-seksjon
            </p>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!newNote.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: tokens.borderRadius.md,
                border: 'none',
                backgroundColor: newNote.trim() ? tokens.colors.primary : tokens.colors.mist,
                color: newNote.trim() ? tokens.colors.white : tokens.colors.steel,
                cursor: newNote.trim() ? 'pointer' : 'not-allowed',
                ...typography.body as React.CSSProperties,
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >
              <Send size={18} />
              Legg til notat
            </button>
          </div>
        </div>

        {/* Note History */}
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
              Tidligere notater
            </h2>
          </div>

          {sortedNotes.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <StickyNote size={40} color={tokens.colors.mist} style={{ marginBottom: '12px' }} />
              <p style={{ ...typography.body as React.CSSProperties, color: tokens.colors.steel }}>
                Ingen notater ennå
              </p>
            </div>
          ) : (
            <div>
              {sortedNotes.map((note, index) => (
                <article
                  key={note.id}
                  aria-label="Coach note"
                  style={{
                    padding: '20px',
                    borderBottom: index < sortedNotes.length - 1 ? `1px solid ${tokens.colors.mist}` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: tokens.borderRadius.sm,
                        backgroundColor: `${tokens.colors.primary}10`,
                      }}
                    >
                      <StickyNote size={14} color={tokens.colors.primary} />
                      <span style={{ ...typography.caption as React.CSSProperties, fontWeight: 600, color: tokens.colors.primary }}>
                        Trenernotat
                      </span>
                    </div>

                    <time
                      dateTime={note.createdAt}
                      style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel }}
                    >
                      {formatDate(note.createdAt)}
                    </time>
                  </div>

                  <p style={{ ...typography.body as React.CSSProperties, color: tokens.colors.charcoal, margin: 0, lineHeight: '1.6' }}>
                    {note.content}
                  </p>

                  {note.delivered && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                      <CheckCircle size={14} color={tokens.colors.success} />
                      <span style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.success }}>
                        Levert til spiller
                      </span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

//////////////////////////////
// 5. STRICT NOTES
//////////////////////////////

/*
- Do NOT show performance data inline with notes.
- Do NOT show PROOF or TRAJECTORY data here.
- Do NOT allow editing delivered notes.
- Do NOT allow deleting notes from athlete view.
- Do NOT track whether athlete read the note.
- Do NOT show engagement metrics.
- Do NOT attach notes to specific PROOF records.
- Do NOT style notes as system content.
- Notes ALWAYS show "Coach Note" label.
- Notes appear in athlete's "From Your Coach" section ONLY.
*/
