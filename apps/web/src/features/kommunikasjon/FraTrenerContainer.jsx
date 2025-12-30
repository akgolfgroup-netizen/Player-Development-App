import React, { useState } from 'react';
import {
  User, ChevronRight, Calendar, Target, Video, FileText,
  MessageSquare, Star, Clock, CheckCircle
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';

// ============================================================================
// MOCK DATA
// ============================================================================

const COACH_MESSAGES = [
  {
    id: 'cm1',
    coach: {
      name: 'Anders Kristiansen',
      role: 'Hovedtrener',
    },
    type: 'feedback',
    title: 'Feedback pa treningsokt',
    content: 'Bra jobba pa okten i dag! Tempoet ditt er mye bedre enn for noen uker siden. Jeg la merke til at overgangen fra toppen er mye jevnere na. Fortsett a fokusere pa a fole tyngden i klubben pa toppen for du starter nedsvingen.',
    date: '2025-01-18',
    read: false,
    attachments: ['Video: Sving analyse'],
    relatedTo: 'Teknikk-trening',
  },
  {
    id: 'cm2',
    coach: {
      name: 'Maria Hansen',
      role: 'Kortspill-trener',
    },
    type: 'plan_update',
    title: 'Oppdatert treningsplan',
    content: 'Jeg har lagt til noen nye bunkerovelser i planen din for neste uke. Fokuser spesielt pa a apne bladet mer ved impact. Se vedlagt video for referanse.',
    date: '2025-01-17',
    read: true,
    attachments: ['Video: Bunker teknikk'],
    relatedTo: 'Ukeplan',
  },
  {
    id: 'cm3',
    coach: {
      name: 'Anders Kristiansen',
      role: 'Hovedtrener',
    },
    type: 'goal_review',
    title: 'Malevaluering - Januar',
    content: 'Flott fremgang denne maneden! Du har oppnadd 3 av 5 mal. Spesielt imponert over forbedringen i driving-avstand. La oss diskutere justeringer for februar pa neste mote.',
    date: '2025-01-15',
    read: true,
    attachments: [],
    relatedTo: 'Malevaluering',
  },
  {
    id: 'cm4',
    coach: {
      name: 'Erik Olsen',
      role: 'Fysisk trener',
    },
    type: 'achievement',
    title: 'Ny PR registrert!',
    content: 'Gratulerer med ny PR i squat - 100 kg! Dette kommer til a hjelpe rotasjonskraften din. Fortsett det gode arbeidet!',
    date: '2025-01-12',
    read: true,
    attachments: [],
    relatedTo: 'Styrketrening',
  },
  {
    id: 'cm5',
    coach: {
      name: 'Anders Kristiansen',
      role: 'Hovedtrener',
    },
    type: 'breaking_point',
    title: 'Breaking Point oppdatert',
    content: 'Jeg har oppdatert breaking point "Sving tempo" med nye ovelser. Vi er na pa 65% fremgang. Med litt mer fokus kan vi lose dette helt innen februar.',
    date: '2025-01-10',
    read: true,
    attachments: ['Ovelser: Tempo drills'],
    relatedTo: 'Breaking Points',
  },
];

// ============================================================================
// HELPERS
// ============================================================================

const getTypeConfig = (type) => {
  switch (type) {
    case 'feedback':
      return { label: 'Feedback', color: 'var(--accent)', icon: MessageSquare };
    case 'plan_update':
      return { label: 'Planoppdatering', color: 'var(--success)', icon: Calendar };
    case 'goal_review':
      return { label: 'Malevaluering', color: 'var(--achievement)', icon: Target };
    case 'achievement':
      return { label: 'Prestasjon', color: 'var(--success)', icon: Star };
    case 'breaking_point':
      return { label: 'Breaking Point', color: 'var(--error)', icon: Target };
    default:
      return { label: type, color: 'var(--text-secondary)', icon: FileText };
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'I dag';
  if (date.toDateString() === yesterday.toDateString()) return 'I gar';
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
};

// ============================================================================
// MESSAGE CARD
// ============================================================================

const CoachMessageCard = ({ message, onClick }) => {
  const typeConfig = getTypeConfig(message.type);
  const TypeIcon = typeConfig.icon;

  return (
    <div
      onClick={() => onClick(message)}
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '14px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        borderLeft: message.read ? 'none' : `3px solid ${'var(--accent)'}`,
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
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        {/* Coach Avatar */}
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--bg-primary)',
          fontSize: '14px',
          fontWeight: 600,
          flexShrink: 0,
        }}>
          {message.coach.name.split(' ').map((n) => n[0]).join('')}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '4px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}>
                {message.coach.name}
              </span>
              <span style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
              }}>
                {message.coach.role}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {formatDate(message.date)}
            </span>
          </div>

          {/* Type Badge and Title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 500,
              padding: '3px 8px',
              borderRadius: '4px',
              backgroundColor: `${typeConfig.color}15`,
              color: typeConfig.color,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <TypeIcon size={10} />
              {typeConfig.label}
            </span>
            <h3 style={{
              fontSize: '15px',
              fontWeight: message.read ? 500 : 600,
              color: 'var(--text-primary)',
              margin: 0,
            }}>
              {message.title}
            </h3>
          </div>

          {/* Content Preview */}
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            margin: '0 0 10px 0',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {message.content}
          </p>

          {/* Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              {message.attachments.length > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: 'var(--accent)',
                }}>
                  <Video size={12} />
                  {message.attachments.length} vedlegg
                </div>
              )}
              {message.relatedTo && (
                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                }}>
                  Relatert til: {message.relatedTo}
                </div>
              )}
            </div>
            {!message.read && (
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
              }} />
            )}
          </div>
        </div>

        <ChevronRight size={18} color={'var(--text-secondary)'} style={{ flexShrink: 0 }} />
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const FraTrenerContainer = () => {
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const filters = [
    { key: 'all', label: 'Alle' },
    { key: 'feedback', label: 'Feedback' },
    { key: 'plan_update', label: 'Planer' },
    { key: 'goal_review', label: 'Mal' },
  ];

  const filteredMessages = COACH_MESSAGES.filter(
    (m) => filter === 'all' || m.type === filter
  );

  const unreadCount = COACH_MESSAGES.filter((m) => !m.read).length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <PageHeader
        title="Fra trener"
        subtitle={`${unreadCount} uleste meldinger`}
      />

      <div style={{ padding: '16px 24px 24px', maxWidth: '1536px', margin: '0 auto' }}>
        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '10px',
          marginBottom: '24px',
        }}>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent)' }}>
              {COACH_MESSAGES.length}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Totalt</div>
          </div>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--error)' }}>
              {unreadCount}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Uleste</div>
          </div>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--success)' }}>
              {COACH_MESSAGES.filter((m) => m.type === 'feedback').length}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Feedbacks</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '20px',
          overflowX: 'auto',
        }}>
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: filter === f.key ? 'var(--accent)' : 'var(--bg-primary)',
                color: filter === f.key ? 'var(--bg-primary)' : 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredMessages.map((message) => (
            <CoachMessageCard
              key={message.id}
              message={message}
              onClick={setSelectedMessage}
            />
          ))}

          {filteredMessages.length === 0 && (
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '14px',
              padding: '40px',
              textAlign: 'center',
            }}>
              <User size={40} color={'var(--text-secondary)'} style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                Ingen meldinger funnet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FraTrenerContainer;
