import React, { useState } from 'react';
import {
  BookOpen, Calendar, Clock, CheckCircle, Circle,
  AlertCircle, FileText
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import Button from '../../ui/primitives/Button';

// ============================================================================
// MOCK DATA
// ============================================================================

const ASSIGNMENTS = [
  {
    id: 'a1',
    title: 'Matematikk - Kapittel 5',
    subject: 'Matematikk',
    type: 'innlevering',
    dueDate: '2025-01-22',
    status: 'pending',
    priority: 'high',
    description: 'Oppgaver fra side 120-125. Husk a vise utregning.',
    attachments: 1,
  },
  {
    id: 'a2',
    title: 'Norsk - Bokrapport',
    subject: 'Norsk',
    type: 'innlevering',
    dueDate: '2025-01-25',
    status: 'in_progress',
    priority: 'medium',
    description: 'Skriv en analyse av boken "Doppler". 1000-1500 ord.',
    attachments: 0,
  },
  {
    id: 'a3',
    title: 'Engelsk - Vocabulary test',
    subject: 'Engelsk',
    type: 'prove',
    dueDate: '2025-01-23',
    status: 'pending',
    priority: 'medium',
    description: 'Prove pa ordforrad fra kapittel 4.',
    attachments: 0,
  },
  {
    id: 'a4',
    title: 'Naturfag - Lab-rapport',
    subject: 'Naturfag',
    type: 'innlevering',
    dueDate: '2025-01-20',
    status: 'pending',
    priority: 'high',
    description: 'Skriv rapport fra forsoket om fotosyntese.',
    attachments: 2,
  },
  {
    id: 'a5',
    title: 'Samfunnsfag - Presentasjon',
    subject: 'Samfunnsfag',
    type: 'presentasjon',
    dueDate: '2025-01-28',
    status: 'pending',
    priority: 'low',
    description: 'Forbered en 10-minutters presentasjon om klimaendringer.',
    attachments: 0,
  },
  {
    id: 'a6',
    title: 'Matematikk - Kapittel 4',
    subject: 'Matematikk',
    type: 'innlevering',
    dueDate: '2025-01-15',
    status: 'completed',
    priority: 'medium',
    description: 'Oppgaver fra side 100-110.',
    attachments: 1,
    grade: '5+',
  },
];

const SUBJECTS = ['Alle', 'Matematikk', 'Norsk', 'Engelsk', 'Naturfag', 'Samfunnsfag'];

// ============================================================================
// HELPERS
// ============================================================================

const getSubjectColor = (subject) => {
  switch (subject) {
    case 'Matematikk': return 'var(--accent)';
    case 'Norsk': return 'var(--error)';
    case 'Engelsk': return 'var(--success)';
    case 'Naturfag': return 'var(--warning)';
    case 'Samfunnsfag': return 'var(--achievement)';
    default: return 'var(--text-secondary)';
  }
};

const getStatusConfig = (status) => {
  switch (status) {
    case 'completed':
      return { label: 'Fullfort', color: 'var(--success)', icon: CheckCircle };
    case 'in_progress':
      return { label: 'Pagar', color: 'var(--warning)', icon: Clock };
    case 'pending':
      return { label: 'Ikke startet', color: 'var(--text-secondary)', icon: Circle };
    default:
      return { label: status, color: 'var(--text-secondary)', icon: Circle };
  }
};

const getDaysUntil = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  return diff;
};

const formatDueDate = (dateStr) => {
  const days = getDaysUntil(dateStr);
  if (days < 0) return 'Forfalt';
  if (days === 0) return 'I dag';
  if (days === 1) return 'I morgen';
  if (days <= 7) return `${days} dager`;
  return new Date(dateStr).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
};

// ============================================================================
// ASSIGNMENT CARD
// ============================================================================

const AssignmentCard = ({ assignment, onClick }) => {
  const subjectColor = getSubjectColor(assignment.subject);
  const statusConfig = getStatusConfig(assignment.status);
  const StatusIcon = statusConfig.icon;
  const daysUntil = getDaysUntil(assignment.dueDate);
  const isOverdue = daysUntil < 0 && assignment.status !== 'completed';
  const isUrgent = daysUntil <= 2 && daysUntil >= 0 && assignment.status !== 'completed';

  return (
    <div
      onClick={() => onClick(assignment)}
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '12px',
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        borderLeft: `4px solid ${subjectColor}`,
        opacity: assignment.status === 'completed' ? 0.7 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '8px',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px',
          }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 500,
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: `${subjectColor}15`,
              color: subjectColor,
            }}>
              {assignment.subject}
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: 500,
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
            }}>
              {assignment.type}
            </span>
          </div>
          <h4 style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0,
            textDecoration: assignment.status === 'completed' ? 'line-through' : 'none',
          }}>
            {assignment.title}
          </h4>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '4px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: isOverdue ? 'var(--error)' :
                   isUrgent ? 'var(--warning)' : 'var(--text-secondary)',
            fontWeight: isOverdue || isUrgent ? 500 : 400,
          }}>
            {isOverdue && <AlertCircle size={12} />}
            <Calendar size={12} />
            {formatDueDate(assignment.dueDate)}
          </div>
          {assignment.grade && (
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--success)',
            }}>
              {assignment.grade}
            </span>
          )}
        </div>
      </div>

      <p style={{
        fontSize: '12px',
        color: 'var(--text-secondary)',
        margin: '0 0 8px 0',
        lineHeight: 1.4,
      }}>
        {assignment.description}
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11px',
          color: statusConfig.color,
        }}>
          <StatusIcon size={12} />
          {statusConfig.label}
        </div>
        {assignment.attachments > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
          }}>
            <FileText size={12} />
            {assignment.attachments} vedlegg
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const SkoleoppgaverContainer = () => {
  const [subjectFilter, setSubjectFilter] = useState('Alle');
  const [statusFilter, setStatusFilter] = useState('active');
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(selectedAssignment?.id === assignment.id ? null : assignment);
  };

  const statusFilters = [
    { key: 'active', label: 'Aktive' },
    { key: 'completed', label: 'Fullforte' },
    { key: 'all', label: 'Alle' },
  ];

  const filteredAssignments = ASSIGNMENTS.filter((a) => {
    const matchesSubject = subjectFilter === 'Alle' || a.subject === subjectFilter;
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && a.status !== 'completed') ||
      (statusFilter === 'completed' && a.status === 'completed');
    return matchesSubject && matchesStatus;
  }).sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const stats = {
    total: ASSIGNMENTS.filter((a) => a.status !== 'completed').length,
    urgent: ASSIGNMENTS.filter((a) => {
      const days = getDaysUntil(a.dueDate);
      return days <= 2 && days >= 0 && a.status !== 'completed';
    }).length,
    completed: ASSIGNMENTS.filter((a) => a.status === 'completed').length,
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <PageHeader
        title="Skoleoppgaver"
        subtitle="Hold oversikt over lekser og innleveringer"
      />

      <div style={{ padding: '16px 24px 24px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          marginBottom: '24px',
        }}>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Aktive</div>
          </div>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--error)' }}>
              {stats.urgent}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Haster</div>
          </div>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)' }}>
              {stats.completed}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Fullfort</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {statusFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: statusFilter === f.key ? 'var(--accent)' : 'var(--bg-primary)',
                    color: statusFilter === f.key ? 'var(--bg-primary)' : 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                onClick={() => setSubjectFilter(subject)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: subjectFilter === subject
                    ? `2px solid ${getSubjectColor(subject)}`
                    : `1px solid ${'var(--border-default)'}`,
                  backgroundColor: subjectFilter === subject
                    ? `${getSubjectColor(subject)}10`
                    : 'var(--bg-primary)',
                  color: subjectFilter === subject
                    ? getSubjectColor(subject)
                    : 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Assignments List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredAssignments.map((assignment) => (
            <React.Fragment key={assignment.id}>
              <AssignmentCard
                assignment={assignment}
                onClick={() => handleAssignmentClick(assignment)}
                isSelected={selectedAssignment?.id === assignment.id}
              />
              {selectedAssignment?.id === assignment.id && (
                <div style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: '14px',
                  padding: '20px',
                  marginTop: '-5px',
                  borderTop: `3px solid ${getSubjectColor(assignment.subject)}`,
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>
                    {assignment.title}
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    {assignment.description}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="primary">
                      {assignment.status === 'completed' ? 'Se detaljer' : 'Start oppgave'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedAssignment(null)}
                    >
                      Lukk
                    </Button>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

          {filteredAssignments.length === 0 && (
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '14px',
              padding: '40px',
              textAlign: 'center',
            }}>
              <BookOpen size={40} color={'var(--text-secondary)'} style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                Ingen oppgaver funnet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkoleoppgaverContainer;
