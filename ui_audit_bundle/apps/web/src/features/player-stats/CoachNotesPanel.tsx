/**
 * CoachNotesPanel - Coach notes integration for test results
 *
 * Features:
 * - View all coach notes across tests
 * - Add new notes (coach view)
 * - Filter by note type
 * - Timeline view
 */

import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Lightbulb,
  Award,
  Target,
  Eye,
  Send,
  Filter,
  Calendar,
  User,
  ChevronRight,
  Plus,
  X,
  Search,
} from 'lucide-react';
import Card from '../../ui/primitives/Card';
import Badge from '../../ui/primitives/Badge.primitive';
import Button from '../../ui/primitives/Button';
import { SectionTitle, SubSectionTitle } from '../../components/typography';
import useTestResults, { CoachNote, TestResult } from '../../hooks/useTestResults';

// ============================================================================
// TYPES
// ============================================================================

type NoteType = CoachNote['type'] | 'all';

interface NoteWithTest extends CoachNote {
  test: TestResult;
}

const NOTE_TYPE_CONFIG: Record<CoachNote['type'], {
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}> = {
  observation: {
    label: 'Observasjon',
    icon: <Eye size={14} />,
    color: 'var(--text-secondary)',
    bgColor: 'var(--background-surface)',
  },
  recommendation: {
    label: 'Anbefaling',
    icon: <Lightbulb size={14} />,
    color: 'var(--warning)',
    bgColor: 'var(--bg-warning-subtle)',
  },
  praise: {
    label: 'Ros',
    icon: <Award size={14} />,
    color: 'var(--success)',
    bgColor: 'var(--bg-success-subtle)',
  },
  focus: {
    label: 'Fokusområde',
    icon: <Target size={14} />,
    color: 'var(--accent)',
    bgColor: 'var(--bg-accent-subtle)',
  },
};

// ============================================================================
// COMPONENTS
// ============================================================================

interface NoteTypeFilterProps {
  selected: NoteType;
  onChange: (type: NoteType) => void;
  counts: Record<NoteType, number>;
}

const NoteTypeFilter: React.FC<NoteTypeFilterProps> = ({ selected, onChange, counts }) => {
  return (
    <div style={styles.filterContainer}>
      <button
        onClick={() => onChange('all')}
        style={{
          ...styles.filterButton,
          backgroundColor: selected === 'all' ? 'var(--accent)' : 'transparent',
          color: selected === 'all' ? 'white' : 'var(--text-secondary)',
        }}
      >
        Alle ({counts.all})
      </button>
      {(Object.keys(NOTE_TYPE_CONFIG) as CoachNote['type'][]).map(type => {
        const config = NOTE_TYPE_CONFIG[type];
        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            style={{
              ...styles.filterButton,
              backgroundColor: selected === type ? config.color : 'transparent',
              color: selected === type ? 'white' : 'var(--text-secondary)',
            }}
          >
            {config.icon}
            {config.label} ({counts[type] || 0})
          </button>
        );
      })}
    </div>
  );
};

interface NoteCardProps {
  note: NoteWithTest;
  onViewTest?: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onViewTest }) => {
  const config = NOTE_TYPE_CONFIG[note.type];

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'I dag';
    if (diffDays === 1) return 'I går';
    if (diffDays < 7) return `${diffDays} dager siden`;

    return date.toLocaleDateString('no-NO', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <Card padding="md" style={{ ...styles.noteCard, backgroundColor: config.bgColor }}>
      {/* Header */}
      <div style={styles.noteHeader}>
        <div style={styles.noteType}>
          <span style={{ color: config.color }}>{config.icon}</span>
          <Badge variant="accent" size="sm" style={{ backgroundColor: `${config.color}20`, color: config.color }}>
            {config.label}
          </Badge>
        </div>
        <span style={styles.noteDate}>{formatDate(note.createdAt)}</span>
      </div>

      {/* Content */}
      <p style={styles.noteContent}>{note.content}</p>

      {/* Footer */}
      <div style={styles.noteFooter}>
        <div style={styles.noteAuthor}>
          <div style={styles.avatar}>
            <User size={12} />
          </div>
          <span>{note.coachName}</span>
        </div>

        <button onClick={onViewTest} style={styles.testLink}>
          <span>{note.test.icon}</span>
          <span>{note.test.name}</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </Card>
  );
};

interface AddNoteFormProps {
  tests: TestResult[];
  onSubmit: (testId: string, note: { content: string; type: CoachNote['type'] }) => void;
  onCancel: () => void;
}

const AddNoteForm: React.FC<AddNoteFormProps> = ({ tests, onSubmit, onCancel }) => {
  const [selectedTestId, setSelectedTestId] = useState<string>('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<CoachNote['type']>('observation');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTests = useMemo(() => {
    if (!searchQuery) return tests;
    return tests.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tests, searchQuery]);

  const handleSubmit = () => {
    if (!selectedTestId || !content.trim()) return;
    onSubmit(selectedTestId, { content: content.trim(), type });
    setContent('');
    setSelectedTestId('');
  };

  const selectedTest = tests.find(t => t.id === selectedTestId);

  return (
    <Card padding="md" style={styles.addNoteForm}>
      <div style={styles.formHeader}>
        <SubSectionTitle style={styles.formTitle}>Ny trenernotat</SubSectionTitle>
        <button onClick={onCancel} style={styles.closeButton}>
          <X size={16} />
        </button>
      </div>

      {/* Test Selector */}
      <div style={styles.formField}>
        <label style={styles.formLabel}>Velg test</label>
        {selectedTest ? (
          <div style={styles.selectedTest}>
            <span>{selectedTest.icon}</span>
            <span>{selectedTest.name}</span>
            <button onClick={() => setSelectedTestId('')} style={styles.clearButton}>
              <X size={12} />
            </button>
          </div>
        ) : (
          <div style={styles.testSearch}>
            <Search size={14} color="var(--text-tertiary)" />
            <input
              type="text"
              placeholder="Søk etter test..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        )}

        {!selectedTestId && searchQuery && (
          <div style={styles.testDropdown}>
            {filteredTests.slice(0, 5).map(test => (
              <button
                key={test.id}
                onClick={() => {
                  setSelectedTestId(test.id);
                  setSearchQuery('');
                }}
                style={styles.testOption}
              >
                <span>{test.icon}</span>
                <span>{test.name}</span>
                <Badge variant="accent" size="sm">{test.category}</Badge>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Note Type */}
      <div style={styles.formField}>
        <label style={styles.formLabel}>Type</label>
        <div style={styles.typeButtons}>
          {(Object.keys(NOTE_TYPE_CONFIG) as CoachNote['type'][]).map(noteType => {
            const config = NOTE_TYPE_CONFIG[noteType];
            return (
              <button
                key={noteType}
                onClick={() => setType(noteType)}
                style={{
                  ...styles.typeButton,
                  backgroundColor: type === noteType ? config.bgColor : 'transparent',
                  borderColor: type === noteType ? config.color : 'var(--border-subtle)',
                  color: type === noteType ? config.color : 'var(--text-secondary)',
                }}
              >
                {config.icon}
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={styles.formField}>
        <label style={styles.formLabel}>Notat</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Skriv din kommentar til spilleren..."
          style={styles.textarea}
          rows={3}
        />
      </div>

      {/* Actions */}
      <div style={styles.formActions}>
        <Button variant="ghost" onClick={onCancel}>
          Avbryt
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!selectedTestId || !content.trim()}
        >
          <Send size={14} />
          Send notat
        </Button>
      </div>
    </Card>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface CoachNotesPanelProps {
  isCoachView?: boolean;
  onViewTestDetails?: (testId: string) => void;
}

const CoachNotesPanel: React.FC<CoachNotesPanelProps> = ({
  isCoachView = false,
  onViewTestDetails,
}) => {
  const { tests, loading, addCoachNote } = useTestResults();
  const [typeFilter, setTypeFilter] = useState<NoteType>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Collect all notes with their test info
  const allNotes: NoteWithTest[] = useMemo(() => {
    return tests
      .flatMap(test =>
        test.coachNotes.map(note => ({
          ...note,
          test,
        }))
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tests]);

  // Filter notes
  const filteredNotes = useMemo(() => {
    if (typeFilter === 'all') return allNotes;
    return allNotes.filter(n => n.type === typeFilter);
  }, [allNotes, typeFilter]);

  // Count by type
  const counts = useMemo(() => {
    const result: Record<NoteType, number> = {
      all: allNotes.length,
      observation: 0,
      recommendation: 0,
      praise: 0,
      focus: 0,
    };

    allNotes.forEach(note => {
      result[note.type]++;
    });

    return result;
  }, [allNotes]);

  const handleAddNote = async (testId: string, note: { content: string; type: CoachNote['type'] }) => {
    try {
      await addCoachNote(testId, {
        testResultId: testId,
        coachId: 'current-coach', // Would come from auth context
        coachName: 'Erik Hansen', // Would come from auth context
        content: note.content,
        type: note.type,
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  if (loading) {
    return (
      <Card padding="spacious">
        <div style={styles.loadingState}>Laster trenernotater...</div>
      </Card>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          <MessageSquare size={20} color="var(--accent)" />
          <SectionTitle style={styles.title}>Trenernotater</SectionTitle>
          <Badge variant="accent" size="sm">{allNotes.length}</Badge>
        </div>

        {isCoachView && !showAddForm && (
          <Button variant="primary" size="sm" onClick={() => setShowAddForm(true)}>
            <Plus size={14} />
            Ny notat
          </Button>
        )}
      </div>

      {/* Add Note Form */}
      {showAddForm && (
        <AddNoteForm
          tests={tests}
          onSubmit={handleAddNote}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Filters */}
      <NoteTypeFilter
        selected={typeFilter}
        onChange={setTypeFilter}
        counts={counts}
      />

      {/* Notes List */}
      {filteredNotes.length > 0 ? (
        <div style={styles.notesList}>
          {filteredNotes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onViewTest={() => onViewTestDetails?.(note.test.id)}
            />
          ))}
        </div>
      ) : (
        <Card padding="spacious">
          <div style={styles.emptyState}>
            <MessageSquare size={32} color="var(--text-tertiary)" />
            <p>Ingen notater{typeFilter !== 'all' ? ` av type "${NOTE_TYPE_CONFIG[typeFilter as CoachNote['type']].label}"` : ''}</p>
            {isCoachView && (
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(true)}>
                <Plus size={14} />
                Legg til første notat
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      {allNotes.length > 0 && (
        <Card padding="md" style={styles.statsCard}>
          <SubSectionTitle style={styles.statsTitle}>Oppsummering</SubSectionTitle>
          <div style={styles.statsGrid}>
            {(Object.keys(NOTE_TYPE_CONFIG) as CoachNote['type'][]).map(type => {
              const config = NOTE_TYPE_CONFIG[type];
              return (
                <div key={type} style={styles.statItem}>
                  <div style={{ ...styles.statIcon, backgroundColor: config.bgColor, color: config.color }}>
                    {config.icon}
                  </div>
                  <span style={styles.statCount}>{counts[type]}</span>
                  <span style={styles.statLabel}>{config.label}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  title: {
    margin: 0,
  },
  filterContainer: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    overflowX: 'auto',
    paddingBottom: 'var(--spacing-1)',
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    padding: 'var(--spacing-1) var(--spacing-2)',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    fontSize: 'var(--font-size-caption1)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  notesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  noteCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  noteHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteType: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  noteDate: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  noteContent: {
    fontSize: 'var(--font-size-body)',
    color: 'var(--text-primary)',
    lineHeight: 1.5,
    margin: 0,
  },
  noteFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    padding: 'var(--spacing-1) var(--spacing-2)',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    backgroundColor: 'var(--background-white)',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  addNoteForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)',
    border: '2px solid var(--accent)',
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formTitle: {
    margin: 0,
  },
  closeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'var(--background-surface)',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },
  formLabel: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },
  testSearch: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-2) var(--spacing-3)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: 'var(--font-size-body)',
    outline: 'none',
  },
  selectedTest: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-2) var(--spacing-3)',
    backgroundColor: 'var(--bg-accent-subtle)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-body)',
  },
  clearButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'var(--background-white)',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  testDropdown: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--background-white)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-md)',
    overflow: 'hidden',
  },
  testOption: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-2) var(--spacing-3)',
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left',
    fontSize: 'var(--font-size-footnote)',
    cursor: 'pointer',
  },
  typeButtons: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    flexWrap: 'wrap',
  },
  typeButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    padding: 'var(--spacing-1) var(--spacing-2)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid',
    fontSize: 'var(--font-size-caption1)',
    cursor: 'pointer',
    backgroundColor: 'transparent',
  },
  textarea: {
    padding: 'var(--spacing-3)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    fontSize: 'var(--font-size-body)',
    resize: 'vertical',
    fontFamily: 'inherit',
    minHeight: 80,
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 'var(--spacing-2)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-6)',
    color: 'var(--text-tertiary)',
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: 'var(--background-surface)',
  },
  statsTitle: {
    margin: 0,
    marginBottom: 'var(--spacing-3)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 'var(--spacing-3)',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCount: {
    fontSize: 'var(--font-size-title3)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  statLabel: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
    textAlign: 'center',
  },
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-8)',
    color: 'var(--text-tertiary)',
  },
};

export default CoachNotesPanel;
