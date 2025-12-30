import React, { useState } from 'react';
import {
  Target, ChevronRight, Plus, CheckCircle, Clock,
  AlertTriangle, Calendar, Video
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import Button from '../../ui/primitives/Button';
import Card from '../../ui/primitives/Card';

// ============================================================================
// MOCK DATA
// ============================================================================

const BREAKING_POINTS = [
  {
    id: 'bp1',
    area: 'Driving',
    title: 'Sving tempo',
    description: 'For rask overgang fra toppen. Mister kraft og presisjon.',
    status: 'working',
    priority: 'high',
    identifiedDate: '2025-01-05',
    targetDate: '2025-02-15',
    progress: 65,
    drills: ['Tempo drill 1-2-3', 'Pause pa toppen', 'Sakte nedsving'],
    coachNotes: 'Fokuser pa a fole tyngden i klubben pa toppen for du starter nedsvingen.',
    videos: 2,
    sessions: 8,
  },
  {
    id: 'bp2',
    area: 'Putting',
    title: 'Lesing av greener',
    description: 'Feilvurderer ofte break, spesielt pa nedoverbakker.',
    status: 'identified',
    priority: 'medium',
    identifiedDate: '2025-01-12',
    targetDate: '2025-03-01',
    progress: 20,
    drills: ['Lesesirkelen', 'Opp-og-ned drill', 'Forkant fokus'],
    coachNotes: 'Vi ma jobbe med a lese greenen fra alle vinkler for du putter.',
    videos: 1,
    sessions: 3,
  },
  {
    id: 'bp3',
    area: 'Jernspill',
    title: 'Konsistent treff',
    description: 'Varierende treffpunkt gir inkonsistent avstand og retning.',
    status: 'working',
    priority: 'high',
    identifiedDate: '2024-12-20',
    targetDate: '2025-02-01',
    progress: 80,
    drills: ['Gate drill', 'Tee foran ball', 'Halve sving'],
    coachNotes: 'Naesten i mal! Hold fokus pa a holde hodet stille gjennom impact.',
    videos: 4,
    sessions: 12,
  },
  {
    id: 'bp4',
    area: 'Mental',
    title: 'Fokus etter feilslag',
    description: 'Mister fokus og gjor flere feil etter et darlig slag.',
    status: 'identified',
    priority: 'low',
    identifiedDate: '2025-01-15',
    targetDate: '2025-04-01',
    progress: 10,
    drills: ['Pusteovelse', 'Reset-rutine', '10-sekunders regel'],
    coachNotes: null,
    videos: 0,
    sessions: 1,
  },
];

const RESOLVED_POINTS = [
  {
    id: 'r1',
    area: 'Kortspill',
    title: 'Bunker konsistens',
    resolvedDate: '2024-12-15',
    duration: '6 uker',
  },
  {
    id: 'r2',
    area: 'Driving',
    title: 'Slice tendens',
    resolvedDate: '2024-11-20',
    duration: '8 uker',
  },
];

// ============================================================================
// HELPERS
// ============================================================================

const getStatusConfig = (status) => {
  switch (status) {
    case 'working':
      return { label: 'Jobber med', color: 'var(--accent)', icon: Clock };
    case 'identified':
      return { label: 'Identifisert', color: 'var(--warning)', icon: AlertTriangle };
    case 'resolved':
      return { label: 'Lost', color: 'var(--success)', icon: CheckCircle };
    default:
      return { label: status, color: 'var(--text-secondary)', icon: Target };
  }
};

const getPriorityConfig = (priority) => {
  switch (priority) {
    case 'high':
      return { label: 'Hoy', color: 'var(--error)' };
    case 'medium':
      return { label: 'Medium', color: 'var(--warning)' };
    case 'low':
      return { label: 'Lav', color: 'var(--text-secondary)' };
    default:
      return { label: priority, color: 'var(--text-secondary)' };
  }
};

// ============================================================================
// BREAKING POINT CARD
// ============================================================================

const BreakingPointCard = ({ point, onClick }) => {
  const statusConfig = getStatusConfig(point.status);
  const priorityConfig = getPriorityConfig(point.priority);
  const StatusIcon = statusConfig.icon;

  return (
    <Card variant="default" padding="none">
      <div
        onClick={() => onClick(point)}
        style={{
          padding: '16px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          borderLeft: `4px solid ${priorityConfig.color}`,
          borderRadius: 'var(--radius-lg)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
            }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 500,
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
                color: 'var(--accent)',
              }}>
                {point.area}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 500,
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: statusConfig.color === 'var(--accent)' ? 'rgba(var(--accent-rgb), 0.1)' :
                               statusConfig.color === 'var(--warning)' ? 'rgba(var(--warning-rgb), 0.1)' :
                               statusConfig.color === 'var(--success)' ? 'rgba(var(--success-rgb), 0.1)' :
                               'var(--bg-tertiary)',
                color: statusConfig.color,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <StatusIcon size={10} />
                {statusConfig.label}
              </span>
            </div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
            }}>
              {point.title}
            </h3>
          </div>
          <ChevronRight size={18} style={{ color: 'var(--text-secondary)' }} />
        </div>

        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          margin: '0 0 12px 0',
          lineHeight: 1.4,
        }}>
          {point.description}
        </p>

        {/* Progress Bar */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            marginBottom: '4px',
          }}>
            <span>Fremgang</span>
            <span>{point.progress}%</span>
          </div>
          <div style={{
            height: '6px',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${point.progress}%`,
              backgroundColor: point.progress >= 80 ? 'var(--success)' :
                             point.progress >= 50 ? 'var(--accent)' : 'var(--warning)',
              borderRadius: '3px',
            }} />
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '16px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-default)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}>
            <Calendar size={12} />
            {point.sessions} okter
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}>
            <Video size={12} />
            {point.videos} videoer
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}>
            <Target size={12} />
            {point.drills.length} ovelser
          </div>
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// RESOLVED CARD
// ============================================================================

const ResolvedCard = ({ point }) => (
  <Card variant="default" padding="none">
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 14px',
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(var(--success-rgb), 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <CheckCircle size={16} style={{ color: 'var(--success)' }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
          {point.title}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          {point.area} - Lost pa {point.duration}
        </div>
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
        {new Date(point.resolvedDate).toLocaleDateString('nb-NO')}
      </div>
    </div>
  </Card>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const BreakingPointsContainer = () => {
  const [filter, setFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'Alle' },
    { key: 'working', label: 'Jobber med' },
    { key: 'identified', label: 'Identifisert' },
  ];

  const filteredPoints = BREAKING_POINTS.filter(
    (p) => filter === 'all' || p.status === filter
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <PageHeader
        title="Breaking Points"
        subtitle="Fokusomrader for forbedring"
      />

      <div style={{ padding: '24px', maxWidth: '1536px', margin: '0 auto' }}>
        {/* Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '10px',
          marginBottom: '24px',
        }}>
          <Card variant="default" padding="none">
            <div style={{ padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)' }}>
                {BREAKING_POINTS.length}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Aktive</div>
            </div>
          </Card>
          <Card variant="default" padding="none">
            <div style={{ padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--error)' }}>
                {BREAKING_POINTS.filter((p) => p.priority === 'high').length}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Hoy prioritet</div>
            </div>
          </Card>
          <Card variant="default" padding="none">
            <div style={{ padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)' }}>
                {RESOLVED_POINTS.length}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Lost</div>
            </div>
          </Card>
        </div>

        {/* Filters and Add Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {filters.map((f) => (
              <Button
                key={f.key}
                variant={filter === f.key ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </Button>
            ))}
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={16} />}
          >
            Legg til
          </Button>
        </div>

        {/* Breaking Points List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {filteredPoints.map((point) => (
            <BreakingPointCard
              key={point.id}
              point={point}
              onClick={() => {/* View point details */}}
            />
          ))}
        </div>

        {/* Resolved Section */}
        <div>
          <h3 style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '12px',
          }}>
            Loste Breaking Points
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {RESOLVED_POINTS.map((point) => (
              <ResolvedCard key={point.id} point={point} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingPointsContainer;
