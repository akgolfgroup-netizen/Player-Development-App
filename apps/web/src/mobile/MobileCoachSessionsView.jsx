import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Filter, Search } from 'lucide-react';
import { tokens, typographyStyle } from '../design-tokens';
import { SkeletonCard } from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';

const MobileCoachSessionsView = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'today' | 'upcoming' | 'past'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSessions();
  }, [filter]);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get(`/coach/sessions?filter=${filter}`);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockSessions = [
        {
          id: 1,
          athlete: 'Emma Hansen',
          date: '2024-12-23',
          time: '14:00',
          duration: 60,
          type: 'Technique',
          status: 'upcoming',
          notes: 'Focus on driver swing plane',
        },
        {
          id: 2,
          athlete: 'Lars Olsen',
          date: '2024-12-23',
          time: '15:30',
          duration: 45,
          type: 'Strategy',
          status: 'upcoming',
          notes: 'Course management discussion',
        },
        {
          id: 3,
          athlete: 'Maria Berg',
          date: '2024-12-22',
          time: '10:00',
          duration: 60,
          type: 'Mental',
          status: 'completed',
          notes: 'Pre-round routine practice',
        },
        {
          id: 4,
          athlete: 'Emma Hansen',
          date: '2024-12-21',
          time: '16:00',
          duration: 50,
          type: 'Short Game',
          status: 'completed',
          notes: 'Chipping from various lies',
        },
        {
          id: 5,
          athlete: 'Johan Vik',
          date: '2024-12-24',
          time: '11:00',
          duration: 60,
          type: 'Full Swing',
          status: 'upcoming',
          notes: 'Iron contact improvement',
        },
      ];

      setSessions(mockSessions);
    } catch (err) {
      setError(err.message || 'Kunne ikke laste økter');
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.athlete.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.type.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const today = new Date().toISOString().split('T')[0];

    switch (filter) {
      case 'today':
        return session.date === today;
      case 'upcoming':
        return session.status === 'upcoming';
      case 'past':
        return session.status === 'completed';
      default:
        return true;
    }
  });

  if (error) {
    return <ErrorState message={error} onRetry={fetchSessions} />;
  }

  return (
    <div style={{
      fontFamily: tokens.typography.fontFamily,
      backgroundColor: tokens.colors.snow,
      minHeight: '100vh',
      paddingBottom: tokens.spacing.xl,
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: tokens.colors.primary,
        color: tokens.colors.white,
        padding: tokens.spacing.lg,
      }}>
        <h1 style={{
          ...typographyStyle('title2'),
          margin: 0,
          marginBottom: tokens.spacing.sm,
        }}>
          Treningsøkter
        </h1>
        <p style={{
          ...typographyStyle('subheadline'),
          margin: 0,
          opacity: 0.9,
        }}>
          Administrer økter med utøvere
        </p>
      </div>

      <div style={{ padding: tokens.spacing.md }}>
        {/* Search Bar */}
        <div style={{
          position: 'relative',
          marginBottom: tokens.spacing.md,
        }}>
          <Search
            size={20}
            style={{
              position: 'absolute',
              left: tokens.spacing.md,
              top: '50%',
              transform: 'translateY(-50%)',
              color: tokens.colors.steel,
            }}
          />
          <input
            type="text"
            placeholder="Søk etter utøver eller økttype..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: `${tokens.spacing.md} ${tokens.spacing.md} ${tokens.spacing.md} 48px`,
              backgroundColor: tokens.colors.white,
              border: `1px solid ${tokens.colors.mist}`,
              borderRadius: tokens.radius.md,
              ...typographyStyle('subheadline'),
              outline: 'none',
            }}
          />
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: tokens.spacing.sm,
          marginBottom: tokens.spacing.lg,
          overflowX: 'auto',
          paddingBottom: tokens.spacing.sm,
        }}>
          <FilterTab label="Alle" active={filter === 'all'} onClick={() => setFilter('all')} />
          <FilterTab label="I dag" active={filter === 'today'} onClick={() => setFilter('today')} />
          <FilterTab label="Kommende" active={filter === 'upcoming'} onClick={() => setFilter('upcoming')} />
          <FilterTab label="Tidligere" active={filter === 'past'} onClick={() => setFilter('past')} />
        </div>

        {/* Sessions List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredSessions.length === 0 ? (
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.radius.md,
            padding: `${tokens.spacing.xl} ${tokens.spacing.lg}`,
            textAlign: 'center',
            boxShadow: tokens.shadows.card,
          }}>
            <Calendar size={48} color={tokens.colors.steel} style={{ margin: '0 auto 16px' }} />
            <div style={{
              ...typographyStyle('headline'),
              color: tokens.colors.charcoal,
              marginBottom: '8px',
            }}>
              Ingen økter funnet
            </div>
            <div style={{
              ...typographyStyle('subheadline'),
              color: tokens.colors.steel,
            }}>
              {searchQuery ? 'Prøv et annet søk' : 'Ingen økter matcher dette filteret'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
            {filteredSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FilterTab = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
      backgroundColor: active ? tokens.colors.primary : tokens.colors.white,
      color: active ? tokens.colors.white : tokens.colors.charcoal,
      border: active ? 'none' : `1px solid ${tokens.colors.mist}`,
      borderRadius: tokens.radius.md,
      cursor: 'pointer',
      ...typographyStyle('subheadline'),
      fontWeight: active ? 600 : 400,
      whiteSpace: 'nowrap',
      transition: 'all 0.2s',
    }}
  >
    {label}
  </button>
);

const SessionCard = ({ session }) => {
  const isUpcoming = session.status === 'upcoming';

  const sessionTypeColors = {
    'Technique': tokens.colors.primary,
    'Strategy': tokens.colors.gold,
    'Mental': tokens.colors.success,
    'Short Game': tokens.colors.warning,
    'Full Swing': tokens.colors.primary,
  };

  const typeColor = sessionTypeColors[session.type] || tokens.colors.steel;

  return (
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: tokens.radius.md,
      padding: tokens.spacing.lg,
      boxShadow: tokens.shadows.card,
      border: isUpcoming ? `2px solid ${tokens.colors.primary}15` : 'none',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: tokens.spacing.md,
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            ...typographyStyle('headline'),
            color: tokens.colors.charcoal,
            margin: 0,
            marginBottom: '4px',
          }}>
            {session.athlete}
          </h3>
          <div style={{
            display: 'inline-block',
            padding: '4px 12px',
            backgroundColor: `${typeColor}15`,
            borderRadius: tokens.radius.sm,
            ...typographyStyle('caption1'),
            fontWeight: 600,
            color: typeColor,
          }}>
            {session.type}
          </div>
        </div>
        <div style={{
          padding: '6px 12px',
          backgroundColor: isUpcoming ? `${tokens.colors.success}15` : tokens.colors.snow,
          borderRadius: tokens.radius.sm,
          ...typographyStyle('caption1'),
          fontWeight: 600,
          color: isUpcoming ? tokens.colors.success : tokens.colors.steel,
        }}>
          {isUpcoming ? 'Kommende' : 'Fullført'}
        </div>
      </div>

      {/* Date & Time */}
      <div style={{
        display: 'flex',
        gap: tokens.spacing.lg,
        marginBottom: tokens.spacing.md,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing.sm,
          ...typographyStyle('subheadline'),
          color: tokens.colors.steel,
        }}>
          <Calendar size={16} />
          {new Date(session.date).toLocaleDateString('nb-NO', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          })}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing.sm,
          ...typographyStyle('subheadline'),
          color: tokens.colors.steel,
        }}>
          <Clock size={16} />
          {session.time} ({session.duration} min)
        </div>
      </div>

      {/* Notes */}
      {session.notes && (
        <div style={{
          padding: tokens.spacing.md,
          backgroundColor: tokens.colors.snow,
          borderRadius: tokens.radius.sm,
          ...typographyStyle('footnote'),
          color: tokens.colors.charcoal,
        }}>
          {session.notes}
        </div>
      )}

      {/* Actions */}
      {isUpcoming && (
        <div style={{
          display: 'flex',
          gap: tokens.spacing.sm,
          marginTop: tokens.spacing.md,
        }}>
          <button style={{
            flex: 1,
            padding: tokens.spacing.sm,
            backgroundColor: tokens.colors.primary,
            color: tokens.colors.white,
            border: 'none',
            borderRadius: tokens.radius.sm,
            cursor: 'pointer',
            ...typographyStyle('subheadline'),
            fontWeight: 600,
          }}>
            Start økt
          </button>
          <button style={{
            flex: 1,
            padding: tokens.spacing.sm,
            backgroundColor: tokens.colors.snow,
            color: tokens.colors.charcoal,
            border: `1px solid ${tokens.colors.mist}`,
            borderRadius: tokens.radius.sm,
            cursor: 'pointer',
            ...typographyStyle('subheadline'),
          }}>
            Rediger
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileCoachSessionsView;
