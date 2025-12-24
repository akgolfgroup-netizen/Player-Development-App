import React, { useState } from 'react';
import {
  Target, Video, CheckCircle, Clock, ChevronRight, ChevronDown,
  Play, Camera, MessageCircle, Award,
  Repeat, Eye, BookOpen, TrendingUp
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';

// ============================================================================
// MOCK DATA - Will be replaced with API data
// ============================================================================

const TECHNICAL_PLAN = {
  currentFocus: 'Rotasjon og sekvensiering',
  startDate: '2025-01-01',
  targetDate: '2025-03-15',
  progress: 45,
  coach: 'Anders Kristiansen',
  areas: [
    {
      id: 'a1',
      name: 'Backsving',
      status: 'completed',
      focus: 'Skulder-rotasjon og arm-posisjon',
      checkpoints: [
        { id: 'c1', text: 'Full skulder-rotasjon (90+)', completed: true },
        { id: 'c2', text: 'Venstre arm straight ved toppen', completed: true },
        { id: 'c3', text: 'Klubb parallell med mal-linje', completed: true },
      ],
      drills: [
        { name: 'Alignment stick drill', duration: '10 min', videoUrl: '#' },
        { name: 'Speil-trening', duration: '5 min', videoUrl: '#' },
      ],
      notes: 'God progresjon. Konsistent posisjon ved toppen na.',
    },
    {
      id: 'a2',
      name: 'Nedsvings-sekvensiering',
      status: 'in_progress',
      focus: 'Starte nedsvingen fra bakken opp',
      checkpoints: [
        { id: 'c4', text: 'Hofte-initiering for armer', completed: true },
        { id: 'c5', text: 'Lagre vinkelen lengre', completed: false },
        { id: 'c6', text: 'Shaft lean ved impact', completed: false },
      ],
      drills: [
        { name: 'Step-through drill', duration: '15 min', videoUrl: '#' },
        { name: 'Pump drill', duration: '10 min', videoUrl: '#' },
        { name: 'Impact bag', duration: '10 min', videoUrl: '#' },
      ],
      notes: 'Hovedfokus na. Jobber med a holde vinkelen lengre i nedsvingen.',
      coachFeedback: 'Bra fremgang siste 2 uker! Fokuser pa a fole "drag" fra hoftene.',
    },
    {
      id: 'a3',
      name: 'Impact & Follow-through',
      status: 'pending',
      focus: 'Ren kontakt og balansert finish',
      checkpoints: [
        { id: 'c7', text: 'Hender foran hodet ved impact', completed: false },
        { id: 'c8', text: 'Full ekstensjon etter impact', completed: false },
        { id: 'c9', text: 'Balansert finish-posisjon', completed: false },
      ],
      drills: [
        { name: 'Slow motion swings', duration: '10 min', videoUrl: '#' },
        { name: 'Finish & hold', duration: '5 min', videoUrl: '#' },
      ],
      notes: 'Starter nar sekvensiering er pa plass.',
    },
  ],
  recentVideos: [
    { id: 'v1', date: '2025-01-14', title: 'Driver FO-view', thumbnail: null, duration: '0:45' },
    { id: 'v2', date: '2025-01-12', title: '7-jern DTL', thumbnail: null, duration: '0:32' },
    { id: 'v3', date: '2025-01-10', title: 'Sammenligning for/etter', thumbnail: null, duration: '1:20' },
  ],
  keyMetrics: [
    { name: 'Klubbhastighet', current: '108 mph', target: '112 mph', progress: 75 },
    { name: 'Attack angle (driver)', current: '+2.5', target: '+4', progress: 60 },
    { name: 'Smash factor', current: '1.46', target: '1.48', progress: 85 },
    { name: 'Dispersion 150y', current: '12y', target: '8y', progress: 40 },
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getStatusConfig = (status) => {
  switch (status) {
    case 'completed':
      return { color: tokens.colors.success, icon: CheckCircle, label: 'Fullfort' };
    case 'in_progress':
      return { color: tokens.colors.primary, icon: Play, label: 'Pagar' };
    case 'pending':
      return { color: tokens.colors.steel, icon: Clock, label: 'Venter' };
    default:
      return { color: tokens.colors.steel, icon: Clock, label: status };
  }
};

// ============================================================================
// AREA CARD COMPONENT
// ============================================================================

const AreaCard = ({ area }) => {
  const [isExpanded, setIsExpanded] = useState(area.status === 'in_progress');
  const statusConfig = getStatusConfig(area.status);
  const StatusIcon = statusConfig.icon;

  const completedCheckpoints = area.checkpoints.filter(c => c.completed).length;
  const totalCheckpoints = area.checkpoints.length;
  const progressPercent = (completedCheckpoints / totalCheckpoints) * 100;

  return (
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      border: area.status === 'in_progress' ? `2px solid ${tokens.colors.primary}` : '2px solid transparent',
    }}>
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: `${statusConfig.color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <StatusIcon size={24} color={statusConfig.color} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: tokens.colors.charcoal,
              margin: 0,
            }}>
              {area.name}
            </h3>
            <span style={{
              fontSize: '11px',
              fontWeight: 500,
              color: statusConfig.color,
              backgroundColor: `${statusConfig.color}15`,
              padding: '2px 8px',
              borderRadius: '4px',
            }}>
              {statusConfig.label}
            </span>
          </div>
          <div style={{ fontSize: '13px', color: tokens.colors.steel, marginTop: '4px' }}>
            {area.focus}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: tokens.colors.charcoal }}>
              {completedCheckpoints}/{totalCheckpoints}
            </div>
            <div style={{ fontSize: '11px', color: tokens.colors.steel }}>checkpoints</div>
          </div>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: tokens.colors.snow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}>
            <ChevronDown size={16} color={tokens.colors.steel} />
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '0 20px 12px' }}>
        <div style={{
          height: '4px',
          backgroundColor: tokens.colors.snow,
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: statusConfig.color,
            borderRadius: '2px',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{
          padding: '0 20px 20px',
          borderTop: `1px solid ${tokens.colors.mist}`,
        }}>
          {/* Checkpoints */}
          <div style={{ marginTop: '16px' }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 600,
              color: tokens.colors.charcoal,
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <Target size={14} />
              Checkpoints
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {area.checkpoints.map((checkpoint) => (
                <div
                  key={checkpoint.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    backgroundColor: checkpoint.completed ? `${tokens.colors.success}08` : tokens.colors.snow,
                    borderRadius: '8px',
                  }}
                >
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: checkpoint.completed ? tokens.colors.success : tokens.colors.white,
                    border: checkpoint.completed ? 'none' : `2px solid ${tokens.colors.mist}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {checkpoint.completed && <CheckCircle size={14} color={tokens.colors.white} />}
                  </div>
                  <span style={{
                    fontSize: '13px',
                    color: checkpoint.completed ? tokens.colors.steel : tokens.colors.charcoal,
                    textDecoration: checkpoint.completed ? 'line-through' : 'none',
                  }}>
                    {checkpoint.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Drills */}
          <div style={{ marginTop: '16px' }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 600,
              color: tokens.colors.charcoal,
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <Repeat size={14} />
              Drills
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {area.drills.map((drill, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    backgroundColor: tokens.colors.snow,
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <Video size={14} color={tokens.colors.primary} />
                  <span style={{ fontSize: '12px', color: tokens.colors.charcoal }}>
                    {drill.name}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: tokens.colors.steel,
                    backgroundColor: tokens.colors.white,
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}>
                    {drill.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Coach Feedback */}
          {area.coachFeedback && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: `${tokens.colors.primary}08`,
              borderRadius: '10px',
              borderLeft: `3px solid ${tokens.colors.primary}`,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '6px',
              }}>
                <MessageCircle size={14} color={tokens.colors.primary} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: tokens.colors.primary }}>
                  Trener-feedback
                </span>
              </div>
              <p style={{
                fontSize: '13px',
                color: tokens.colors.charcoal,
                margin: 0,
                lineHeight: 1.5,
              }}>
                {area.coachFeedback}
              </p>
            </div>
          )}

          {/* Notes */}
          {area.notes && !area.coachFeedback && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: tokens.colors.snow,
              borderRadius: '10px',
            }}>
              <div style={{ fontSize: '11px', color: tokens.colors.steel, marginBottom: '4px' }}>
                Notater
              </div>
              <p style={{
                fontSize: '13px',
                color: tokens.colors.charcoal,
                margin: 0,
                lineHeight: 1.5,
              }}>
                {area.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// METRICS CARD COMPONENT
// ============================================================================

const MetricsCard = ({ metrics }) => {
  return (
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
      }}>
        <TrendingUp size={16} color={tokens.colors.gold} />
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: tokens.colors.charcoal,
          margin: 0,
        }}>
          Nokkeltall
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {metrics.map((metric, idx) => (
          <div key={idx}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}>
              <span style={{ fontSize: '13px', color: tokens.colors.charcoal }}>
                {metric.name}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: tokens.colors.charcoal }}>
                  {metric.current}
                </span>
                <span style={{ fontSize: '11px', color: tokens.colors.steel }}>
                  / {metric.target}
                </span>
              </div>
            </div>
            <div style={{
              height: '6px',
              backgroundColor: tokens.colors.snow,
              borderRadius: '3px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${metric.progress}%`,
                backgroundColor: metric.progress >= 80 ? tokens.colors.success :
                  metric.progress >= 50 ? tokens.colors.primary : tokens.colors.warning,
                borderRadius: '3px',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// VIDEO CARD COMPONENT
// ============================================================================

const RecentVideosCard = ({ videos }) => {
  return (
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Camera size={16} color={tokens.colors.primary} />
          <h3 style={{
            fontSize: '14px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
            margin: 0,
          }}>
            Siste videoer
          </h3>
        </div>
        <button style={{
          fontSize: '12px',
          color: tokens.colors.primary,
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 500,
        }}>
          Se alle
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {videos.map((video) => (
          <div
            key={video.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px',
              backgroundColor: tokens.colors.snow,
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: '48px',
              height: '36px',
              borderRadius: '6px',
              backgroundColor: tokens.colors.charcoal,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Play size={16} color={tokens.colors.white} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: tokens.colors.charcoal }}>
                {video.title}
              </div>
              <div style={{ fontSize: '11px', color: tokens.colors.steel }}>
                {video.date} - {video.duration}
              </div>
            </div>
            <ChevronRight size={16} color={tokens.colors.steel} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TekniskPlanContainer = () => {
  const plan = TECHNICAL_PLAN;
  const completedAreas = plan.areas.filter(a => a.status === 'completed').length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Teknisk plan"
        subtitle={`Fokus: ${plan.currentFocus}`}
      />

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Progress Overview */}
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: tokens.colors.charcoal,
                margin: 0,
              }}>
                Teknisk utviklingsplan
              </h2>
              <div style={{ fontSize: '13px', color: tokens.colors.steel, marginTop: '4px' }}>
                Trener: {plan.coach} - Maldat: {new Date(plan.targetDate).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long' })}
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.primary }}>
                  {plan.progress}%
                </div>
                <div style={{ fontSize: '11px', color: tokens.colors.steel }}>total fremgang</div>
              </div>
            </div>
          </div>

          <div style={{
            height: '8px',
            backgroundColor: tokens.colors.snow,
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${plan.progress}%`,
              backgroundColor: tokens.colors.primary,
              borderRadius: '4px',
            }} />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px',
            fontSize: '12px',
            color: tokens.colors.steel,
          }}>
            <span>{completedAreas}/{plan.areas.length} omrader fullfort</span>
            <span>Startet {new Date(plan.startDate).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}</span>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '24px',
        }}>
          {/* Areas */}
          <div>
            <h2 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: tokens.colors.charcoal,
              margin: '0 0 16px 0',
            }}>
              Utviklingsomrader
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {plan.areas.map((area) => (
                <AreaCard key={area.id} area={area} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <MetricsCard metrics={plan.keyMetrics} />
            <RecentVideosCard videos={plan.recentVideos} />

            {/* Resources */}
            <div style={{
              backgroundColor: tokens.colors.white,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}>
                <BookOpen size={16} color={tokens.colors.success} />
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: tokens.colors.charcoal,
                  margin: 0,
                }}>
                  Ressurser
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  backgroundColor: tokens.colors.snow,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                }}>
                  <Eye size={14} color={tokens.colors.primary} />
                  <span style={{ fontSize: '13px', color: tokens.colors.charcoal }}>
                    Se treningsvideoer
                  </span>
                </button>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  backgroundColor: tokens.colors.snow,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                }}>
                  <Award size={14} color={tokens.colors.gold} />
                  <span style={{ fontSize: '13px', color: tokens.colors.charcoal }}>
                    Tidligere planer
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TekniskPlanContainer;
