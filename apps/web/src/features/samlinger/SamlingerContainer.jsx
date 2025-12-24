import React, { useState } from 'react';
import {
  Users, Calendar, MapPin, Clock, ChevronRight,
  CheckCircle, AlertCircle, Tent, Target, Dumbbell,
  BookOpen, Utensils, Car
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';

// ============================================================================
// MOCK DATA - Will be replaced with API data
// ============================================================================

const MOCK_CAMPS = [
  {
    id: 'c1',
    name: 'Vintersamling 2025',
    type: 'training',
    startDate: '2025-02-15',
    endDate: '2025-02-18',
    location: 'PGA Catalunya',
    country: 'Spania',
    registrationDeadline: '2025-01-31',
    maxParticipants: 16,
    currentParticipants: 12,
    status: 'registration_open',
    isRegistered: true,
    description: 'Intensiv treningssamling med fokus pa langt spill og banestrategi. Inkluderer 3 runder og daglige treningsokter.',
    program: ['Teknikk-trening', 'Banespill', 'Mental trening', 'Fysisk trening'],
    includes: ['Overnatting', 'Frokost', 'Lunsj', 'Transport til bane'],
    price: 12500,
    coach: 'Anders Kristiansen',
  },
  {
    id: 'c2',
    name: 'Paskesamling Junior',
    type: 'intensive',
    startDate: '2025-04-12',
    endDate: '2025-04-16',
    location: 'Miklagard Golf',
    country: 'Norge',
    registrationDeadline: '2025-03-28',
    maxParticipants: 20,
    currentParticipants: 8,
    status: 'registration_open',
    isRegistered: false,
    description: 'Paskesamling for juniorer med fokus pa kortspill og putting. Perfekt for a forberede seg til sesongstart.',
    program: ['Short game', 'Putting', 'Bunker-spill', 'Regelkurs'],
    includes: ['Lunsj', 'Treningsballer', 'Greenfee'],
    price: 4500,
    coach: 'Maria Hansen',
  },
  {
    id: 'c3',
    name: 'Sommercamp Elite',
    type: 'elite',
    startDate: '2025-07-07',
    endDate: '2025-07-11',
    location: 'St Andrews Links',
    country: 'Skottland',
    registrationDeadline: '2025-05-15',
    maxParticipants: 12,
    currentParticipants: 0,
    status: 'upcoming',
    isRegistered: false,
    description: 'Eksklusiv treningssamling pa golfens hjemsted. Spill pa Old Course og intensiv trening med internasjonale trenere.',
    program: ['Links-golf', 'Vindspill', 'Avansert strategi', 'Video-analyse'],
    includes: ['Fly', 'Hotell', 'Alle maltider', 'Greenfee', 'Caddie'],
    price: 35000,
    coach: 'David Smith',
  },
  {
    id: 'c4',
    name: 'Hostsamling U18',
    type: 'training',
    startDate: '2025-10-18',
    endDate: '2025-10-20',
    location: 'Borre Golfklubb',
    country: 'Norge',
    registrationDeadline: '2025-10-05',
    maxParticipants: 24,
    currentParticipants: 0,
    status: 'upcoming',
    isRegistered: false,
    description: 'Avsluttende samling for sesongen med fokus pa evaluering og planlegging av neste sesong.',
    program: ['Sesongevaluering', 'Testprotokoll', 'Malsetninger 2026', 'Trenersamtaler'],
    includes: ['Lunsj', 'Testrapport'],
    price: 2500,
    coach: 'Anders Kristiansen',
  },
];

const PAST_CAMPS = [
  {
    id: 'p1',
    name: 'Hostsamling 2024',
    date: '2024-10-20',
    location: 'Losby Golfklubb',
    participated: true,
    highlights: 'Personlig rekord pa 68 i treningsrunde',
  },
  {
    id: 'p2',
    name: 'Sommercamp Junior 2024',
    date: '2024-07-15',
    location: 'Holtsmark GK',
    participated: true,
    highlights: 'Beste putting-score pa treningsleir',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
};

const formatDateRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startStr = startDate.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  const endStr = endDate.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  return `${startStr} - ${endStr}`;
};

const getDaysUntil = (dateStr) => {
  const today = new Date();
  const target = new Date(dateStr);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff;
};

const getDuration = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  return days === 1 ? '1 dag' : `${days} dager`;
};

const getStatusConfig = (status, isRegistered) => {
  if (isRegistered) {
    return {
      label: 'Pameldt',
      color: tokens.colors.success,
      bg: `${tokens.colors.success}15`,
      icon: CheckCircle,
    };
  }

  switch (status) {
    case 'registration_open':
      return {
        label: 'Apen for pamelding',
        color: tokens.colors.primary,
        bg: `${tokens.colors.primary}15`,
        icon: Calendar,
      };
    case 'registration_closed':
      return {
        label: 'Fullt',
        color: tokens.colors.error,
        bg: `${tokens.colors.error}15`,
        icon: AlertCircle,
      };
    case 'upcoming':
      return {
        label: 'Kommer snart',
        color: tokens.colors.steel,
        bg: `${tokens.colors.steel}15`,
        icon: Clock,
      };
    default:
      return {
        label: status,
        color: tokens.colors.steel,
        bg: `${tokens.colors.steel}15`,
        icon: Tent,
      };
  }
};

const getTypeConfig = (type) => {
  switch (type) {
    case 'elite':
      return { label: 'Elite', color: tokens.colors.gold, icon: Target };
    case 'intensive':
      return { label: 'Intensiv', color: tokens.colors.primary, icon: Dumbbell };
    case 'training':
    default:
      return { label: 'Trening', color: tokens.colors.success, icon: Tent };
  }
};

// ============================================================================
// CAMP CARD COMPONENT
// ============================================================================

const CampCard = ({ camp, onSelect }) => {
  const statusConfig = getStatusConfig(camp.status, camp.isRegistered);
  const typeConfig = getTypeConfig(camp.type);
  const StatusIcon = statusConfig.icon;
  const TypeIcon = typeConfig.icon;
  const daysUntil = getDaysUntil(camp.startDate);

  return (
    <div
      onClick={() => onSelect(camp)}
      style={{
        backgroundColor: tokens.colors.white,
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: camp.isRegistered ? `2px solid ${tokens.colors.success}` : '2px solid transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: `${typeConfig.color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TypeIcon size={22} color={typeConfig.color} />
          </div>
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: tokens.colors.charcoal,
              margin: 0,
            }}>
              {camp.name}
            </h3>
            <span style={{
              fontSize: '12px',
              fontWeight: 500,
              color: typeConfig.color,
              backgroundColor: `${typeConfig.color}15`,
              padding: '2px 8px',
              borderRadius: '4px',
              marginTop: '4px',
              display: 'inline-block',
            }}>
              {typeConfig.label}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 10px',
          borderRadius: '8px',
          backgroundColor: statusConfig.bg,
        }}>
          <StatusIcon size={14} color={statusConfig.color} />
          <span style={{ fontSize: '12px', fontWeight: 500, color: statusConfig.color }}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={14} color={tokens.colors.steel} />
          <span style={{ fontSize: '14px', color: tokens.colors.charcoal }}>
            {formatDateRange(camp.startDate, camp.endDate)}
          </span>
          <span style={{
            fontSize: '11px',
            color: tokens.colors.steel,
            backgroundColor: tokens.colors.snow,
            padding: '2px 6px',
            borderRadius: '4px',
          }}>
            {getDuration(camp.startDate, camp.endDate)}
          </span>
          {daysUntil > 0 && daysUntil <= 60 && (
            <span style={{
              fontSize: '11px',
              color: tokens.colors.primary,
              backgroundColor: `${tokens.colors.primary}10`,
              padding: '2px 6px',
              borderRadius: '4px',
            }}>
              om {daysUntil} dager
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={14} color={tokens.colors.steel} />
          <span style={{ fontSize: '14px', color: tokens.colors.charcoal }}>
            {camp.location}, {camp.country}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={14} color={tokens.colors.steel} />
          <span style={{ fontSize: '14px', color: tokens.colors.charcoal }}>
            {camp.currentParticipants}/{camp.maxParticipants} pameldte
          </span>
          {camp.currentParticipants >= camp.maxParticipants && (
            <span style={{ fontSize: '11px', color: tokens.colors.error, fontWeight: 500 }}>
              (Fullt)
            </span>
          )}
        </div>
      </div>

      {/* Program preview */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: tokens.colors.steel, marginBottom: '6px' }}>Program:</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {camp.program.slice(0, 3).map((item, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '11px',
                color: tokens.colors.charcoal,
                backgroundColor: tokens.colors.snow,
                padding: '4px 8px',
                borderRadius: '6px',
              }}
            >
              {item}
            </span>
          ))}
          {camp.program.length > 3 && (
            <span style={{
              fontSize: '11px',
              color: tokens.colors.steel,
              padding: '4px 8px',
            }}>
              +{camp.program.length - 3} mer
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '12px',
        borderTop: `1px solid ${tokens.colors.mist}`,
      }}>
        <div>
          <span style={{ fontSize: '12px', color: tokens.colors.steel }}>Pris</span>
          <div style={{ fontSize: '16px', fontWeight: 600, color: tokens.colors.charcoal }}>
            {camp.price.toLocaleString('nb-NO')} kr
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: tokens.colors.primary,
          fontSize: '14px',
          fontWeight: 500,
        }}>
          Se detaljer
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PAST CAMP CARD COMPONENT
// ============================================================================

const PastCampCard = ({ camp }) => {
  return (
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        backgroundColor: camp.participated ? `${tokens.colors.success}15` : tokens.colors.snow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {camp.participated ? (
          <CheckCircle size={20} color={tokens.colors.success} />
        ) : (
          <Tent size={20} color={tokens.colors.steel} />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal }}>
          {camp.name}
        </div>
        <div style={{ fontSize: '12px', color: tokens.colors.steel, marginTop: '2px' }}>
          {formatDate(camp.date)} - {camp.location}
        </div>
      </div>

      {camp.highlights && (
        <div style={{
          backgroundColor: `${tokens.colors.gold}15`,
          padding: '6px 10px',
          borderRadius: '8px',
          maxWidth: '200px',
        }}>
          <div style={{ fontSize: '11px', color: tokens.colors.gold, fontWeight: 500 }}>
            {camp.highlights}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// FILTER COMPONENT
// ============================================================================

const FilterBar = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { key: 'all', label: 'Alle' },
    { key: 'registered', label: 'Mine samlinger' },
    { key: 'training', label: 'Trening' },
    { key: 'intensive', label: 'Intensiv' },
    { key: 'elite', label: 'Elite' },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      paddingBottom: '4px',
    }}>
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: activeFilter === filter.key ? tokens.colors.primary : tokens.colors.white,
            color: activeFilter === filter.key ? tokens.colors.white : tokens.colors.charcoal,
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            boxShadow: activeFilter === filter.key ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

// ============================================================================
// CAMP DETAIL MODAL
// ============================================================================

const CampDetailModal = ({ camp, onClose, onRegister }) => {
  if (!camp) return null;

  const typeConfig = getTypeConfig(camp.type);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }} onClick={onClose}>
      <div style={{
        backgroundColor: tokens.colors.white,
        borderRadius: '20px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '85vh',
        overflow: 'auto',
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: `1px solid ${tokens.colors.mist}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: tokens.colors.charcoal,
                margin: '0 0 8px 0',
              }}>
                {camp.name}
              </h2>
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: typeConfig.color,
                backgroundColor: `${typeConfig.color}15`,
                padding: '4px 10px',
                borderRadius: '6px',
              }}>
                {typeConfig.label}
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: tokens.colors.snow,
                cursor: 'pointer',
                fontSize: '18px',
                color: tokens.colors.steel,
              }}
            >
              x
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <p style={{
            fontSize: '14px',
            color: tokens.colors.charcoal,
            lineHeight: 1.6,
            margin: '0 0 20px 0',
          }}>
            {camp.description}
          </p>

          {/* Info grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Calendar size={18} color={tokens.colors.primary} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal }}>
                  {formatDateRange(camp.startDate, camp.endDate)} ({getDuration(camp.startDate, camp.endDate)})
                </div>
                <div style={{ fontSize: '12px', color: tokens.colors.steel }}>
                  Pameldingsfrist: {formatDate(camp.registrationDeadline)}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MapPin size={18} color={tokens.colors.primary} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal }}>
                  {camp.location}
                </div>
                <div style={{ fontSize: '12px', color: tokens.colors.steel }}>
                  {camp.country}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Users size={18} color={tokens.colors.primary} />
              <div style={{ fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal }}>
                {camp.currentParticipants}/{camp.maxParticipants} pameldte - Trener: {camp.coach}
              </div>
            </div>
          </div>

          {/* Program */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <BookOpen size={16} color={tokens.colors.primary} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: tokens.colors.charcoal }}>Program</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {camp.program.map((item, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '12px',
                    color: tokens.colors.charcoal,
                    backgroundColor: tokens.colors.snow,
                    padding: '6px 10px',
                    borderRadius: '8px',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Includes */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CheckCircle size={16} color={tokens.colors.success} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: tokens.colors.charcoal }}>Inkludert</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {camp.includes.map((item, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '12px',
                    color: tokens.colors.success,
                    backgroundColor: `${tokens.colors.success}10`,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {item.includes('Overnatting') && <Tent size={12} />}
                  {item.includes('rokost') && <Utensils size={12} />}
                  {item.includes('Transport') && <Car size={12} />}
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Price */}
          <div style={{
            backgroundColor: tokens.colors.snow,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
          }}>
            <div style={{ fontSize: '12px', color: tokens.colors.steel, marginBottom: '4px' }}>
              Pris
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.charcoal }}>
              {camp.price.toLocaleString('nb-NO')} kr
            </div>
          </div>

          {/* Action button */}
          {camp.status === 'registration_open' && !camp.isRegistered && (
            <button
              onClick={() => onRegister(camp.id)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.white,
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
            >
              Meld deg pa
            </button>
          )}
          {camp.isRegistered && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              borderRadius: '12px',
              backgroundColor: `${tokens.colors.success}15`,
              color: tokens.colors.success,
              fontSize: '15px',
              fontWeight: 600,
            }}>
              <CheckCircle size={18} />
              Du er pameldt
            </div>
          )}
          {camp.status === 'upcoming' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              borderRadius: '12px',
              backgroundColor: tokens.colors.snow,
              color: tokens.colors.steel,
              fontSize: '15px',
              fontWeight: 500,
            }}>
              <Clock size={18} />
              Pamelding apner snart
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const SamlingerContainer = () => {
  const [filter, setFilter] = useState('all');
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [camps, setCamps] = useState(MOCK_CAMPS);

  const filteredCamps = camps.filter((c) => {
    if (filter === 'all') return true;
    if (filter === 'registered') return c.isRegistered;
    return c.type === filter;
  });

  const handleRegister = (campId) => {
    setCamps((prev) =>
      prev.map((c) =>
        c.id === campId ? { ...c, isRegistered: true, currentParticipants: c.currentParticipants + 1 } : c
      )
    );
    setSelectedCamp(null);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Samlinger"
        subtitle="Treningssamlinger og leirer"
      />

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '16px',
        }}>
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.primary }}>
              {camps.length}
            </div>
            <div style={{ fontSize: '12px', color: tokens.colors.steel }}>Kommende</div>
          </div>
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.success }}>
              {camps.filter(c => c.isRegistered).length}
            </div>
            <div style={{ fontSize: '12px', color: tokens.colors.steel }}>Pameldt</div>
          </div>
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.gold }}>
              {PAST_CAMPS.length}
            </div>
            <div style={{ fontSize: '12px', color: tokens.colors.steel }}>Deltatt i ar</div>
          </div>
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.charcoal }}>
              {camps.filter(c => c.status === 'registration_open' && !c.isRegistered).length}
            </div>
            <div style={{ fontSize: '12px', color: tokens.colors.steel }}>Apen pamelding</div>
          </div>
        </div>

        {/* Filter */}
        <div style={{ marginBottom: '20px' }}>
          <FilterBar activeFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* Upcoming Camps */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
            margin: '0 0 16px 0',
          }}>
            Kommende samlinger
          </h2>

          {filteredCamps.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '16px',
            }}>
              {filteredCamps.map((camp) => (
                <CampCard
                  key={camp.id}
                  camp={camp}
                  onSelect={setSelectedCamp}
                />
              ))}
            </div>
          ) : (
            <div style={{
              backgroundColor: tokens.colors.white,
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
            }}>
              <Tent size={40} color={tokens.colors.steel} style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '14px', color: tokens.colors.steel, margin: 0 }}>
                Ingen samlinger funnet med valgt filter
              </p>
            </div>
          )}
        </div>

        {/* Past Camps */}
        <div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
            margin: '0 0 16px 0',
          }}>
            Tidligere samlinger
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PAST_CAMPS.map((camp) => (
              <PastCampCard key={camp.id} camp={camp} />
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <CampDetailModal
        camp={selectedCamp}
        onClose={() => setSelectedCamp(null)}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default SamlingerContainer;
