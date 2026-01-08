/**
 * TIER Golf Academy - Tournament Planner Page (PLANLEGGER)
 *
 * Subsection "MIN TURNERINGSPLAN" for planning tournament participation.
 * Allows players to plan their tournament season with coach guidance.
 *
 * Design System: TIER Golf Premium Light
 * - Semantic tokens only (no raw hex)
 * - Gold reserved for earned achievements only
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Calendar,
  MapPin,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Download,
} from 'lucide-react';
import Button from '../../ui/primitives/Button';
import Badge from '../../ui/primitives/Badge.primitive';
import StateCard from '../../ui/composites/StateCard';
import { SectionTitle, SubSectionTitle } from '../../components/typography/Headings';
import {
  Tournament,
  TournamentPurpose,
  CATEGORY_LABELS,
  PURPOSE_LABELS,
  PURPOSE_DESCRIPTIONS,
} from './types';

// ============================================================================
// TYPES
// ============================================================================

interface PlannedTournament {
  tournament: Tournament;
  purpose: TournamentPurpose;
  notes?: string;
  addedAt: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const LOCAL_STORAGE_KEY = 'tier_golf_tournament_plan';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
}

function formatDateRange(start: string, end: string): string {
  if (start === end) return formatDate(start);
  return `${formatDate(start)} - ${formatDate(end)}`;
}

function getMonthName(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nb-NO', { month: 'long', year: 'numeric' });
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Purpose selector for a planned tournament
 */
function PurposeSelector({
  value,
  onChange,
}: {
  value: TournamentPurpose;
  onChange: (purpose: TournamentPurpose) => void;
}) {
  const purposes: TournamentPurpose[] = ['RESULTAT', 'UTVIKLING', 'TRENING'];

  return (
    <div style={styles.purposeSelector}>
      {purposes.map(purpose => (
        <button
          key={purpose}
          onClick={() => onChange(purpose)}
          style={{
            ...styles.purposeButton,
            ...(value === purpose ? styles.purposeButtonActive : {}),
          }}
          title={PURPOSE_DESCRIPTIONS[purpose]}
        >
          {PURPOSE_LABELS[purpose]}
        </button>
      ))}
    </div>
  );
}

/**
 * Planned tournament card
 */
function PlannedTournamentCard({
  planned,
  onRemove,
  onUpdatePurpose,
  onUpdateNotes,
}: {
  planned: PlannedTournament;
  onRemove: () => void;
  onUpdatePurpose: (purpose: TournamentPurpose) => void;
  onUpdateNotes: (notes: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(planned.notes || '');
  const { tournament } = planned;

  const handleSaveNotes = () => {
    onUpdateNotes(notes);
    setIsEditing(false);
  };

  return (
    <div style={styles.plannedCard}>
      <div style={styles.plannedCardHeader}>
        <div style={styles.plannedCardInfo}>
          <SubSectionTitle>{tournament.name}</SubSectionTitle>
          <div style={styles.plannedCardMeta}>
            <span style={styles.metaItem}>
              <Calendar size={14} />
              {formatDateRange(tournament.startDate, tournament.endDate)}
            </span>
            <span style={styles.metaItem}>
              <MapPin size={14} />
              {tournament.venue}, {tournament.city}
            </span>
          </div>
        </div>
        <button
          onClick={onRemove}
          style={styles.removeButton}
          title="Fjern fra plan"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div style={styles.plannedCardBody}>
        <div style={styles.purposeSection}>
          <label style={styles.purposeLabel}>Turneringsformål:</label>
          <PurposeSelector
            value={planned.purpose}
            onChange={onUpdatePurpose}
          />
        </div>

        <div style={styles.notesSection}>
          <div style={styles.notesHeader}>
            <label style={styles.notesLabel}>Notater:</label>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={styles.editButton}
              >
                <Edit3 size={14} />
              </button>
            )}
          </div>
          {isEditing ? (
            <div style={styles.notesEditor}>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Legg til notater om mål, forberedelser..."
                style={styles.notesTextarea}
                rows={3}
              />
              <div style={styles.notesActions}>
                <button
                  onClick={() => {
                    setNotes(planned.notes || '');
                    setIsEditing(false);
                  }}
                  style={styles.cancelButton}
                >
                  <X size={14} />
                  Avbryt
                </button>
                <button onClick={handleSaveNotes} style={styles.saveButton}>
                  <Check size={14} />
                  Lagre
                </button>
              </div>
            </div>
          ) : (
            <p style={styles.notesText}>
              {planned.notes || 'Ingen notater lagt til'}
            </p>
          )}
        </div>
      </div>

      <div style={styles.plannedCardFooter}>
        <Badge variant="neutral" size="sm">
          {CATEGORY_LABELS[tournament.recommendedCategory]}
        </Badge>
        <span style={styles.footerText}>
          Lagt til {new Date(planned.addedAt).toLocaleDateString('nb-NO')}
        </span>
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
function EmptyPlan({ onBrowse }: { onBrowse: () => void }) {
  return (
    <StateCard
      variant="empty"
      icon={Calendar}
      title="Ingen turneringer planlagt"
      description="Start med å legge til turneringer fra turneringskalenderen"
      action={
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={onBrowse}>
          Utforsk turneringer
        </Button>
      }
    />
  );
}

/**
 * Plan summary stats
 */
function PlanSummary({ planned }: { planned: PlannedTournament[] }) {
  const stats = useMemo(() => {
    const resultat = planned.filter(p => p.purpose === 'RESULTAT').length;
    const utvikling = planned.filter(p => p.purpose === 'UTVIKLING').length;
    const trening = planned.filter(p => p.purpose === 'TRENING').length;

    return { total: planned.length, resultat, utvikling, trening };
  }, [planned]);

  return (
    <div style={styles.summaryGrid}>
      <div style={styles.summaryCard}>
        <div style={styles.summaryValue}>{stats.total}</div>
        <div style={styles.summaryLabel}>Totalt</div>
      </div>
      <div style={styles.summaryCard}>
        <div style={{ ...styles.summaryValue, color: 'var(--accent)' }}>
          {stats.resultat}
        </div>
        <div style={styles.summaryLabel}>Resultat</div>
      </div>
      <div style={styles.summaryCard}>
        <div style={{ ...styles.summaryValue, color: 'var(--status-success)' }}>
          {stats.utvikling}
        </div>
        <div style={styles.summaryLabel}>Utvikling</div>
      </div>
      <div style={styles.summaryCard}>
        <div style={{ ...styles.summaryValue, color: 'var(--text-secondary)' }}>
          {stats.trening}
        </div>
        <div style={styles.summaryLabel}>Trening</div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TournamentPlannerPage() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useAuth();
  const [plannedTournaments, setPlannedTournaments] = useState<PlannedTournament[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPlannedTournaments(parsed);
      } catch (e) {
        console.error('Failed to parse saved tournament plan:', e);
      }
    }
  }, []);

  // Save to localStorage when plan changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plannedTournaments));
  }, [plannedTournaments]);

  // Group tournaments by month
  const groupedByMonth = useMemo(() => {
    const groups: Record<string, PlannedTournament[]> = {};
    plannedTournaments
      .sort((a, b) => new Date(a.tournament.startDate).getTime() - new Date(b.tournament.startDate).getTime())
      .forEach(planned => {
        const monthKey = getMonthName(planned.tournament.startDate);
        if (!groups[monthKey]) {
          groups[monthKey] = [];
        }
        groups[monthKey].push(planned);
      });
    return groups;
  }, [plannedTournaments]);

  // Handlers
  const handleRemove = (tournamentId: string) => {
    setPlannedTournaments(prev =>
      prev.filter(p => p.tournament.id !== tournamentId)
    );
  };

  const handleUpdatePurpose = (tournamentId: string, purpose: TournamentPurpose) => {
    setPlannedTournaments(prev =>
      prev.map(p =>
        p.tournament.id === tournamentId ? { ...p, purpose } : p
      )
    );
  };

  const handleUpdateNotes = (tournamentId: string, notes: string) => {
    setPlannedTournaments(prev =>
      prev.map(p =>
        p.tournament.id === tournamentId ? { ...p, notes } : p
      )
    );
  };

  const handleBrowse = () => {
    navigate('/turneringskalender');
  };

  const handleExport = () => {
    // Create a simple text export
    const lines = [
      'MIN TURNERINGSPLAN',
      '==================',
      '',
      ...plannedTournaments.map(p => {
        const t = p.tournament;
        return [
          `${t.name}`,
          `  Dato: ${formatDateRange(t.startDate, t.endDate)}`,
          `  Sted: ${t.venue}, ${t.city}`,
          `  Formål: ${PURPOSE_LABELS[p.purpose]}`,
          p.notes ? `  Notater: ${p.notes}` : '',
          '',
        ].filter(Boolean).join('\n');
      }),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'min-turneringsplan.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (plannedTournaments.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <SectionTitle>Min turneringsplan</SectionTitle>
            <p style={styles.subtitle}>
              Planlegg din turnerings-sesong med formål for hver turnering
            </p>
          </div>
        </div>
        <EmptyPlan onBrowse={handleBrowse} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <SectionTitle>Min turneringsplan</SectionTitle>
          <p style={styles.subtitle}>
            Planlegg din turnerings-sesong med formål for hver turnering
          </p>
        </div>
        <div style={styles.headerActions}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Download size={16} />}
            onClick={handleExport}
          >
            Eksporter
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={handleBrowse}
          >
            Legg til turnering
          </Button>
        </div>
      </div>

      <PlanSummary planned={plannedTournaments} />

      {Object.entries(groupedByMonth).map(([month, tournaments]) => (
        <section key={month} style={styles.monthSection}>
          <SectionTitle style={styles.monthTitle}>{month}</SectionTitle>
          <div style={styles.tournamentList}>
            {tournaments.map(planned => (
              <PlannedTournamentCard
                key={planned.tournament.id}
                planned={planned}
                onRemove={() => handleRemove(planned.tournament.id)}
                onUpdatePurpose={purpose =>
                  handleUpdatePurpose(planned.tournament.id, purpose)
                }
                onUpdateNotes={notes =>
                  handleUpdateNotes(planned.tournament.id, notes)
                }
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-6)',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 'var(--spacing-4)',
    flexWrap: 'wrap',
  },

  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },

  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: '4px 0 0 0',
  },

  headerActions: {
    display: 'flex',
    gap: 'var(--spacing-2)',
  },

  // Summary
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: 'var(--spacing-3)',
  },

  summaryCard: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-4)',
    textAlign: 'center',
    border: '1px solid var(--border-subtle)',
  },

  summaryValue: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1.2,
  },

  summaryLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: 'var(--spacing-1)',
  },

  // Month sections
  monthSection: {
    marginTop: 'var(--spacing-4)',
  },

  monthTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: '0 0 var(--spacing-3) 0',
    textTransform: 'capitalize',
  },

  tournamentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)',
  },

  // Planned card
  plannedCard: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-default)',
    overflow: 'hidden',
  },

  plannedCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 'var(--spacing-4)',
    borderBottom: '1px solid var(--border-subtle)',
  },

  plannedCardInfo: {
    flex: 1,
  },

  plannedCardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },

  plannedCardMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-4)',
    marginTop: 'var(--spacing-2)',
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },

  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  removeButton: {
    padding: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
    transition: 'color 0.2s',
  },

  plannedCardBody: {
    padding: 'var(--spacing-4)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)',
  },

  // Purpose selector
  purposeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },

  purposeLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },

  purposeSelector: {
    display: 'flex',
    gap: 'var(--spacing-2)',
  },

  purposeButton: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-default)',
    backgroundColor: 'var(--background-surface)',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  purposeButtonActive: {
    backgroundColor: 'var(--accent)',
    borderColor: 'var(--accent)',
    color: 'var(--text-inverse)',
  },

  // Notes
  notesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },

  notesHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  notesLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },

  editButton: {
    padding: '4px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
  },

  notesText: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: 0,
    fontStyle: 'italic',
  },

  notesEditor: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },

  notesTextarea: {
    padding: 'var(--spacing-3)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-default)',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '60px',
    outline: 'none',
  },

  notesActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 'var(--spacing-2)',
  },

  cancelButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-default)',
    backgroundColor: 'transparent',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },

  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    backgroundColor: 'var(--accent)',
    fontSize: '12px',
    color: 'var(--text-inverse)',
    cursor: 'pointer',
  },

  plannedCardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-3) var(--spacing-4)',
    borderTop: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--background-surface)',
  },

  footerText: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
  },
};
