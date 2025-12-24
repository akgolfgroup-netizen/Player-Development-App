import React, { useState } from 'react';
import {
  Target, ChevronRight, Plus, CheckCircle, Clock,
  AlertTriangle, Calendar, Video
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';

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
      return { label: 'Jobber med', color: tokens.colors.primary, icon: Clock };
    case 'identified':
      return { label: 'Identifisert', color: tokens.colors.warning, icon: AlertTriangle };
    case 'resolved':
      return { label: 'Lost', color: tokens.colors.success, icon: CheckCircle };
    default:
      return { label: status, color: tokens.colors.steel, icon: Target };
  }
};

const getPriorityConfig = (priority) => {
  switch (priority) {
    case 'high':
      return { label: 'Hoy', color: tokens.colors.error };
    case 'medium':
      return { label: 'Medium', color: tokens.colors.warning };
    case 'low':
      return { label: 'Lav', color: tokens.colors.steel };
    default:
      return { label: priority, color: tokens.colors.steel };
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
    <div
      onClick={() => onClick(point)}
      style={{
        backgroundColor: tokens.colors.white,
        borderRadius: '14px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        borderLeft: `4px solid ${priorityConfig.color}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
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
              borderRadius: '4px',
              backgroundColor: `${tokens.colors.primary}15`,
              color: tokens.colors.primary,
            }}>
              {point.area}
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: `${statusConfig.color}15`,
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
            color: tokens.colors.charcoal,
            margin: 0,
          }}>
            {point.title}
          </h3>
        </div>
        <ChevronRight size={18} color={tokens.colors.steel} />
      </div>

      <p style={{
        fontSize: '13px',
        color: tokens.colors.steel,
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
          color: tokens.colors.steel,
          marginBottom: '4px',
        }}>
          <span>Fremgang</span>
          <span>{point.progress}%</span>
        </div>
        <div style={{
          height: '6px',
          backgroundColor: tokens.colors.mist,
          borderRadius: '3px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${point.progress}%`,
            backgroundColor: point.progress >= 80 ? tokens.colors.success :
                           point.progress >= 50 ? tokens.colors.primary : tokens.colors.warning,
            borderRadius: '3px',
          }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex',
        gap: '16px',
        paddingTop: '12px',
        borderTop: `1px solid ${tokens.colors.mist}`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          color: tokens.colors.steel,
        }}>
          <Calendar size={12} />
          {point.sessions} okter
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          color: tokens.colors.steel,
        }}>
          <Video size={12} />
          {point.videos} videoer
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          color: tokens.colors.steel,
        }}>
          <Target size={12} />
          {point.drills.length} ovelser
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// RESOLVED CARD
// ============================================================================

const ResolvedCard = ({ point }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: tokens.colors.white,
    borderRadius: '10px',
    padding: '12px 14px',
  }}>
    <div style={{
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      backgroundColor: `${tokens.colors.success}15`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <CheckCircle size={16} color={tokens.colors.success} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '13px', fontWeight: 500, color: tokens.colors.charcoal }}>
        {point.title}
      </div>
      <div style={{ fontSize: '11px', color: tokens.colors.steel }}>
        {point.area} - Lost pa {point.duration}
      </div>
    </div>
    <div style={{ fontSize: '11px', color: tokens.colors.steel }}>
      {new Date(point.resolvedDate).toLocaleDateString('nb-NO')}
    </div>
  </div>
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
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Breaking Points"
        subtitle="Fokusomrader for forbedring"
      />

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '10px',
          marginBottom: '24px',
        }}>
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.primary }}>
              {BREAKING_POINTS.length}
            </div>
            <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Aktive</div>
          </div>
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.error }}>
              {BREAKING_POINTS.filter((p) => p.priority === 'high').length}
            </div>
            <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Hoy prioritet</div>
          </div>
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.success }}>
              {RESOLVED_POINTS.length}
            </div>
            <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Lost</div>
          </div>
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
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: filter === f.key ? tokens.colors.primary : tokens.colors.white,
                  color: filter === f.key ? tokens.colors.white : tokens.colors.charcoal,
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: tokens.colors.primary,
              color: tokens.colors.white,
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            Legg til
          </button>
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
            color: tokens.colors.charcoal,
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
