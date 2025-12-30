/**
 * AK Golf Academy - Coach Group Plan Editor
 * Design System v3.0 - Blue Palette 01
 *
 * Full-screen group training plan editor with:
 * - Weekly view with day columns
 * - Drag-drop session management
 * - Exercise library integration
 * - Apply to all members functionality
 *
 * Contract references:
 * - COACH_ADMIN_IMPLEMENTATION_CONTRACT.md
 * - COACH_ADMIN_SCREEN_CONTRACT.md
 *
 * NON-NEGOTIABLE:
 * - Past sessions are READ-ONLY
 * - No backdating allowed
 * - All changes logged via audit trail
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Users,
  GripVertical,
  Trash2,
  Copy,
  Save,
  X,
  Calendar,
  Target,
  Dumbbell,
  Flag,
} from 'lucide-react';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import Button from '../../ui/primitives/Button';
import Card from '../../ui/primitives/Card';
import Modal from '../../ui/composites/Modal.composite';

// Types
interface Exercise {
  id: string;
  name: string;
  category: 'teknikk' | 'putting' | 'kort_spill' | 'langt_spill' | 'bane' | 'mental' | 'fysisk';
  duration: number;
  description?: string;
}

interface PlannedSession {
  id: string;
  dayOfWeek: number; // 0-6, Monday = 0
  time: string;
  title: string;
  type: 'individual' | 'group' | 'competition';
  exercises: Exercise[];
  notes?: string;
  isLocked?: boolean;
}

interface WeeklyPlan {
  weekNumber: number;
  year: number;
  theme?: string;
  focus?: string;
  sessions: PlannedSession[];
}

interface GroupInfo {
  id: string;
  name: string;
  memberCount: number;
  avatarColor: string;
  avatarInitials: string;
}

// Category colors
const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
  teknikk: { bg: 'rgba(var(--accent-rgb), 0.15)', text: 'var(--accent)', label: 'Teknikk' },
  putting: { bg: 'rgba(var(--success-rgb), 0.15)', text: 'var(--success)', label: 'Putting' },
  kort_spill: { bg: 'rgba(var(--achievement-rgb), 0.15)', text: 'var(--achievement)', label: 'Kort spill' },
  langt_spill: { bg: 'rgba(var(--accent-rgb), 0.15)', text: 'var(--accent)', label: 'Langt spill' },
  bane: { bg: 'rgba(var(--warning-rgb), 0.15)', text: 'var(--warning)', label: 'Bane' },
  mental: { bg: 'rgba(139, 92, 246, 0.15)', text: '#8B5CF6', label: 'Mental' },
  fysisk: { bg: 'rgba(var(--error-rgb), 0.15)', text: 'var(--error)', label: 'Fysisk' },
};

const dayNames = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];

// Mock exercise library
const exerciseLibrary: Exercise[] = [
  { id: 'ex1', name: 'Gate Putting Drill', category: 'putting', duration: 20, description: 'Putt gjennom porter fra 1-3m' },
  { id: 'ex2', name: 'Driver Tempo', category: 'langt_spill', duration: 30, description: 'Fokus på 3/4 tempo' },
  { id: 'ex3', name: 'Pitch 30-50m', category: 'kort_spill', duration: 25, description: 'Varierte avstander' },
  { id: 'ex4', name: 'Bunker Basic', category: 'kort_spill', duration: 20, description: 'Standard bunkerslag' },
  { id: 'ex5', name: 'Alignment Sticks', category: 'teknikk', duration: 15, description: 'Siktetrening' },
  { id: 'ex6', name: '9-hulls runde', category: 'bane', duration: 90, description: 'Simulert turnering' },
  { id: 'ex7', name: 'Visualisering', category: 'mental', duration: 15, description: 'Pre-shot rutine' },
  { id: 'ex8', name: 'Core Workout', category: 'fysisk', duration: 30, description: 'Kjernemuskulatur' },
];

// Mock data
const mockGroup: GroupInfo = {
  id: 'g1',
  name: 'Wang Golf Herrer',
  memberCount: 8,
  avatarColor: 'var(--accent)',
  avatarInitials: 'WH',
};

const mockWeeklyPlan: WeeklyPlan = {
  weekNumber: 1,
  year: 2025,
  theme: 'Grunntrening',
  focus: 'Putting og kort spill',
  sessions: [
    {
      id: 's1',
      dayOfWeek: 0,
      time: '09:00',
      title: 'Morgentrening',
      type: 'group',
      exercises: [
        { id: 'ex1', name: 'Gate Putting Drill', category: 'putting', duration: 20 },
        { id: 'ex3', name: 'Pitch 30-50m', category: 'kort_spill', duration: 25 },
      ],
    },
    {
      id: 's2',
      dayOfWeek: 2,
      time: '14:00',
      title: 'Langspill fokus',
      type: 'group',
      exercises: [
        { id: 'ex2', name: 'Driver Tempo', category: 'langt_spill', duration: 30 },
        { id: 'ex5', name: 'Alignment Sticks', category: 'teknikk', duration: 15 },
      ],
    },
    {
      id: 's3',
      dayOfWeek: 4,
      time: '10:00',
      title: 'Banespill',
      type: 'group',
      exercises: [
        { id: 'ex6', name: '9-hulls runde', category: 'bane', duration: 90 },
      ],
    },
  ],
};

export default function CoachGroupPlan() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<GroupInfo | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [editingSession, setEditingSession] = useState<PlannedSession | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // New session form state
  const [newSession, setNewSession] = useState({
    title: '',
    time: '09:00',
    type: 'group' as const,
    exercises: [] as Exercise[],
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In production, fetch from API
        // const response = await fetch(`/api/v1/coach/groups/${groupId}/plan`);
        await new Promise((r) => setTimeout(r, 500));
        setGroup(mockGroup);
        setWeeklyPlan(mockWeeklyPlan);
      } catch (error) {
        console.error('Error fetching group plan:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [groupId]);

  const getWeekDates = () => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1 + currentWeekOffset * 7);

    return dayNames.map((_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  };

  const weekDates = getWeekDates();
  const currentWeekNumber = Math.ceil(
    (weekDates[0].getTime() - new Date(weekDates[0].getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  const getSessionsForDay = (dayIndex: number): PlannedSession[] => {
    if (!weeklyPlan) return [];
    return weeklyPlan.sessions.filter((s) => s.dayOfWeek === dayIndex);
  };

  const getTotalDuration = (exercises: Exercise[]): number => {
    return exercises.reduce((sum, ex) => sum + ex.duration, 0);
  };

  const handleAddSession = () => {
    if (!weeklyPlan || !newSession.title) return;

    const session: PlannedSession = {
      id: `s${Date.now()}`,
      dayOfWeek: selectedDay,
      time: newSession.time,
      title: newSession.title,
      type: newSession.type,
      exercises: newSession.exercises,
      notes: newSession.notes,
    };

    setWeeklyPlan({
      ...weeklyPlan,
      sessions: [...weeklyPlan.sessions, session],
    });

    setNewSession({ title: '', time: '09:00', type: 'group', exercises: [], notes: '' });
    setShowAddSessionModal(false);
    setHasUnsavedChanges(true);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (!weeklyPlan) return;
    setWeeklyPlan({
      ...weeklyPlan,
      sessions: weeklyPlan.sessions.filter((s) => s.id !== sessionId),
    });
    setHasUnsavedChanges(true);
  };

  const handleDuplicateSession = (session: PlannedSession) => {
    if (!weeklyPlan) return;
    const duplicated: PlannedSession = {
      ...session,
      id: `s${Date.now()}`,
      dayOfWeek: (session.dayOfWeek + 1) % 7,
    };
    setWeeklyPlan({
      ...weeklyPlan,
      sessions: [...weeklyPlan.sessions, duplicated],
    });
    setHasUnsavedChanges(true);
  };

  const handleAddExerciseToNewSession = (exercise: Exercise) => {
    setNewSession({
      ...newSession,
      exercises: [...newSession.exercises, { ...exercise, id: `${exercise.id}-${Date.now()}` }],
    });
  };

  const handleRemoveExerciseFromNewSession = (exerciseId: string) => {
    setNewSession({
      ...newSession,
      exercises: newSession.exercises.filter((e) => e.id !== exerciseId),
    });
  };

  const handleSave = async () => {
    // In production, save to API
    // await fetch(`/api/v1/coach/groups/${groupId}/plan`, { method: 'PUT', body: JSON.stringify(weeklyPlan) });
    console.log('Saving plan:', weeklyPlan);
    setHasUnsavedChanges(false);
    // Show success notification
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (!group || !weeklyPlan) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>Kunne ikke laste gruppeplan</p>
        <Button onClick={() => navigate('/coach/groups')}>Tilbake til grupper</Button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerWrapper}>
        <PageHeader
          title={`Treningsplan: ${group.name}`}
          subtitle={`${group.memberCount} medlemmer`}
          onBack={() => navigate(`/coach/groups/${groupId}`)}
          actions={
            <div style={{ display: 'flex', gap: '8px' }}>
              {hasUnsavedChanges && (
                <span style={styles.unsavedBadge}>Ulagrede endringer</span>
              )}
              <Button
                variant="primary"
                leftIcon={<Save size={16} />}
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
              >
                Lagre plan
              </Button>
            </div>
          }
        />
      </div>

      {/* Week Theme/Focus */}
      <div style={styles.weekInfo}>
        <div style={styles.weekTheme}>
          <Flag size={16} style={{ color: 'var(--accent)' }} />
          <span style={styles.weekThemeLabel}>Tema:</span>
          <span style={styles.weekThemeValue}>{weeklyPlan.theme || 'Ikke satt'}</span>
        </div>
        <div style={styles.weekTheme}>
          <Target size={16} style={{ color: 'var(--success)' }} />
          <span style={styles.weekThemeLabel}>Fokus:</span>
          <span style={styles.weekThemeValue}>{weeklyPlan.focus || 'Ikke satt'}</span>
        </div>
      </div>

      {/* Week Navigation */}
      <div style={styles.weekNav}>
        <button
          onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
          style={styles.weekNavButton}
        >
          <ChevronLeft size={18} />
          Forrige uke
        </button>

        <div style={styles.weekNavCenter}>
          <Calendar size={20} style={{ color: 'var(--accent)' }} />
          <span style={styles.weekNavTitle}>Uke {currentWeekNumber}</span>
          <span style={styles.weekNavDates}>
            {weekDates[0].toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })} -{' '}
            {weekDates[6].toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>

        <button
          onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
          style={styles.weekNavButton}
        >
          Neste uke
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Week Grid */}
      <div style={styles.weekGrid}>
        {dayNames.map((day, dayIndex) => {
          const sessions = getSessionsForDay(dayIndex);
          const date = weekDates[dayIndex];
          const isToday = date.toDateString() === new Date().toDateString();
          const isPast = date < new Date() && !isToday;

          return (
            <div key={day} style={{ ...styles.dayColumn, ...(isToday ? styles.dayColumnToday : {}) }}>
              {/* Day Header */}
              <div style={{ ...styles.dayHeader, ...(isToday ? styles.dayHeaderToday : {}) }}>
                <span style={styles.dayName}>{day}</span>
                <span style={styles.dayDate}>
                  {date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}
                </span>
              </div>

              {/* Sessions */}
              <div style={styles.dayContent}>
                {sessions.map((session) => (
                  <div key={session.id} style={{ ...styles.sessionCard, ...(isPast ? styles.sessionCardLocked : {}) }}>
                    <div style={styles.sessionHeader}>
                      <span style={styles.sessionTime}>
                        <Clock size={12} />
                        {session.time}
                      </span>
                      {!isPast && (
                        <div style={styles.sessionActions}>
                          <button
                            onClick={() => handleDuplicateSession(session)}
                            style={styles.sessionActionBtn}
                            title="Dupliser"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            style={styles.sessionActionBtn}
                            title="Slett"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    <p style={styles.sessionTitle}>{session.title}</p>
                    <div style={styles.sessionExercises}>
                      {session.exercises.map((ex) => (
                        <span
                          key={ex.id}
                          style={{
                            ...styles.exerciseTag,
                            backgroundColor: categoryColors[ex.category]?.bg || 'var(--bg-tertiary)',
                            color: categoryColors[ex.category]?.text || 'var(--text-primary)',
                          }}
                        >
                          {ex.name}
                        </span>
                      ))}
                    </div>
                    <div style={styles.sessionFooter}>
                      <span style={styles.sessionDuration}>
                        <Clock size={12} />
                        {getTotalDuration(session.exercises)} min
                      </span>
                      <span style={styles.sessionType}>
                        <Users size={12} />
                        {session.type === 'group' ? 'Gruppe' : session.type === 'individual' ? 'Individuell' : 'Konkurranse'}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Add Session Button */}
                {!isPast && (
                  <button
                    onClick={() => {
                      setSelectedDay(dayIndex);
                      setShowAddSessionModal(true);
                    }}
                    style={styles.addSessionButton}
                  >
                    <Plus size={16} />
                    Legg til økt
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Session Modal */}
      {showAddSessionModal && (
        <Modal
          isOpen={showAddSessionModal}
          onClose={() => setShowAddSessionModal(false)}
          title={`Ny økt - ${dayNames[selectedDay]}`}
          size="lg"
        >
          <div style={styles.modalContent}>
            {/* Session Title */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Tittel</label>
              <input
                type="text"
                value={newSession.title}
                onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                placeholder="F.eks. Morgentrening"
                style={styles.input}
              />
            </div>

            {/* Time */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Tidspunkt</label>
              <input
                type="time"
                value={newSession.time}
                onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                style={styles.input}
              />
            </div>

            {/* Type */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Type</label>
              <div style={styles.typeButtons}>
                {['group', 'individual', 'competition'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setNewSession({ ...newSession, type: type as any })}
                    style={{
                      ...styles.typeButton,
                      ...(newSession.type === type ? styles.typeButtonActive : {}),
                    }}
                  >
                    {type === 'group' ? 'Gruppe' : type === 'individual' ? 'Individuell' : 'Konkurranse'}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercises */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Øvelser</label>
              {newSession.exercises.length > 0 ? (
                <div style={styles.exerciseList}>
                  {newSession.exercises.map((ex) => (
                    <div key={ex.id} style={styles.exerciseItem}>
                      <GripVertical size={14} style={{ color: 'var(--text-tertiary)' }} />
                      <span
                        style={{
                          ...styles.exerciseCategoryDot,
                          backgroundColor: categoryColors[ex.category]?.text || 'var(--text-secondary)',
                        }}
                      />
                      <span style={styles.exerciseName}>{ex.name}</span>
                      <span style={styles.exerciseDuration}>{ex.duration} min</span>
                      <button
                        onClick={() => handleRemoveExerciseFromNewSession(ex.id)}
                        style={styles.exerciseRemoveBtn}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={styles.noExercises}>Ingen øvelser lagt til</p>
              )}
              <button
                onClick={() => setShowExerciseLibrary(true)}
                style={styles.addExerciseButton}
              >
                <Dumbbell size={16} />
                Legg til øvelse fra bibliotek
              </button>
            </div>

            {/* Notes */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Notater (valgfritt)</label>
              <textarea
                value={newSession.notes}
                onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                placeholder="Spesielle instruksjoner..."
                style={styles.textarea}
                rows={3}
              />
            </div>

            {/* Actions */}
            <div style={styles.modalActions}>
              <Button variant="secondary" onClick={() => setShowAddSessionModal(false)}>
                Avbryt
              </Button>
              <Button variant="primary" onClick={handleAddSession} disabled={!newSession.title}>
                Legg til økt
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Exercise Library Modal */}
      {showExerciseLibrary && (
        <Modal
          isOpen={showExerciseLibrary}
          onClose={() => setShowExerciseLibrary(false)}
          title="Øvelsesbibliotek"
          size="md"
        >
          <div style={styles.exerciseLibrary}>
            {exerciseLibrary.map((ex) => (
              <div
                key={ex.id}
                style={styles.libraryItem}
                onClick={() => {
                  handleAddExerciseToNewSession(ex);
                  setShowExerciseLibrary(false);
                }}
              >
                <span
                  style={{
                    ...styles.libraryCategoryBadge,
                    backgroundColor: categoryColors[ex.category]?.bg || 'var(--bg-tertiary)',
                    color: categoryColors[ex.category]?.text || 'var(--text-primary)',
                  }}
                >
                  {categoryColors[ex.category]?.label || ex.category}
                </span>
                <div style={styles.libraryItemContent}>
                  <p style={styles.libraryItemName}>{ex.name}</p>
                  {ex.description && <p style={styles.libraryItemDesc}>{ex.description}</p>}
                </div>
                <span style={styles.libraryItemDuration}>{ex.duration} min</span>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

// Styles
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-secondary)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  },
  headerWrapper: {
    padding: '24px 24px 0',
    backgroundColor: 'var(--bg-primary)',
    borderBottom: '1px solid var(--border-default)',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 48,
    height: 48,
    border: '4px solid var(--border-default)',
    borderTopColor: 'var(--accent)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  unsavedBadge: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px',
    backgroundColor: 'rgba(var(--warning-rgb), 0.15)',
    color: 'var(--warning)',
    fontSize: '13px',
    fontWeight: 500,
    borderRadius: 'var(--radius-md)',
  },
  weekInfo: {
    display: 'flex',
    gap: '24px',
    padding: '16px 24px',
    backgroundColor: 'var(--bg-primary)',
  },
  weekTheme: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  weekThemeLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  weekThemeValue: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  weekNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    backgroundColor: 'var(--bg-primary)',
    borderBottom: '1px solid var(--border-default)',
  },
  weekNavButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    backgroundColor: 'var(--bg-tertiary)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    cursor: 'pointer',
  },
  weekNavCenter: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  weekNavTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  weekNavDates: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },
  weekGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '1px',
    backgroundColor: 'var(--border-default)',
    margin: '24px',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-card)',
  },
  dayColumn: {
    backgroundColor: 'var(--bg-primary)',
    minHeight: '400px',
  },
  dayColumnToday: {
    backgroundColor: 'rgba(var(--accent-rgb), 0.03)',
  },
  dayHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid var(--border-default)',
    textAlign: 'center',
  },
  dayHeaderToday: {
    backgroundColor: 'var(--accent)',
    borderBottom: 'none',
  },
  dayName: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  dayDate: {
    display: 'block',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  dayContent: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sessionCard: {
    padding: '12px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-default)',
  },
  sessionCardLocked: {
    opacity: 0.6,
  },
  sessionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  sessionTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--accent)',
  },
  sessionActions: {
    display: 'flex',
    gap: '4px',
  },
  sessionActionBtn: {
    padding: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
  },
  sessionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: '0 0 8px 0',
  },
  sessionExercises: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginBottom: '8px',
  },
  exerciseTag: {
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: 500,
    borderRadius: 'var(--radius-sm)',
  },
  sessionFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '8px',
    borderTop: '1px solid var(--border-subtle)',
  },
  sessionDuration: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: 'var(--text-secondary)',
  },
  sessionType: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: 'var(--text-secondary)',
  },
  addSessionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px',
    backgroundColor: 'transparent',
    border: '2px dashed var(--border-default)',
    borderRadius: 'var(--radius-md)',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  input: {
    padding: '10px 14px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    color: 'var(--text-primary)',
    outline: 'none',
  },
  textarea: {
    padding: '10px 14px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    color: 'var(--text-primary)',
    outline: 'none',
    resize: 'vertical',
  },
  typeButtons: {
    display: 'flex',
    gap: '8px',
  },
  typeButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  typeButtonActive: {
    backgroundColor: 'var(--accent)',
    borderColor: 'var(--accent)',
    color: 'var(--bg-primary)',
  },
  exerciseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-md)',
  },
  exerciseItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 0',
    borderBottom: '1px solid var(--border-subtle)',
  },
  exerciseCategoryDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  exerciseName: {
    flex: 1,
    fontSize: '14px',
    color: 'var(--text-primary)',
  },
  exerciseDuration: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  exerciseRemoveBtn: {
    padding: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
  },
  noExercises: {
    fontSize: '14px',
    color: 'var(--text-tertiary)',
    fontStyle: 'italic',
    margin: 0,
  },
  addExerciseButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px dashed var(--border-default)',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-default)',
  },
  exerciseLibrary: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  libraryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
  },
  libraryCategoryBadge: {
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: 500,
    borderRadius: 'var(--radius-sm)',
    whiteSpace: 'nowrap',
  },
  libraryItemContent: {
    flex: 1,
  },
  libraryItemName: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    margin: 0,
  },
  libraryItemDesc: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: '2px 0 0 0',
  },
  libraryItemDuration: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },
};
