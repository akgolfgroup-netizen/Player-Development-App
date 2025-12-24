import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, TrendingUp, Calendar, Award, MessageCircle } from 'lucide-react';
import { tokens, typographyStyle } from '../design-tokens';
import { SkeletonCard, SkeletonLine, SkeletonCircle } from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';

const MobileCoachAthleteDetail = ({ athleteId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [athlete, setAthlete] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'sessions' | 'tests'

  useEffect(() => {
    fetchAthleteData();
  }, [athleteId]);

  const fetchAthleteData = async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get(`/coach/athletes/${athleteId}`);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockData = {
        id: athleteId,
        name: 'Emma Hansen',
        email: 'emma.hansen@example.com',
        avatar: null,
        handicap: 12.4,
        level: 'B-nivå',
        joinDate: '2024-01-15',
        stats: {
          sessionsThisWeek: 4,
          totalSessions: 127,
          avgScore: 78.5,
          improvement: '+2.3',
        },
        recentSessions: [
          { id: 1, date: '2024-12-22', type: 'Putting', duration: 45, quality: 'high' },
          { id: 2, date: '2024-12-20', type: 'Driver', duration: 60, quality: 'medium' },
          { id: 3, date: '2024-12-19', type: 'Short Game', duration: 50, quality: 'high' },
        ],
        latestTests: [
          { id: 1, name: 'Driver Accuracy', date: '2024-12-18', score: 85, trend: 'up' },
          { id: 2, name: 'Putting Consistency', date: '2024-12-15', score: 78, trend: 'up' },
          { id: 3, name: 'Approach Shots', date: '2024-12-10', score: 72, trend: 'stable' },
        ],
        upcomingSessions: [
          { id: 1, date: '2024-12-24', time: '14:00', type: 'Technique Review' },
          { id: 2, date: '2024-12-26', time: '10:00', type: 'Mental Training' },
        ],
      };

      setAthlete(mockData);
    } catch (err) {
      setError(err.message || 'Kunne ikke laste utøverdata');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <ErrorState message={error} onRetry={fetchAthleteData} />;
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: tokens.colors.snow, minHeight: '100vh' }}>
        <div style={{ padding: tokens.spacing.lg }}>
          <SkeletonLine width="100px" height="40px" style={{ marginBottom: tokens.spacing.lg }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md, marginBottom: tokens.spacing.xl }}>
            <SkeletonCircle size="80px" />
            <div style={{ flex: 1 }}>
              <SkeletonLine width="150px" height="24px" style={{ marginBottom: '8px' }} />
              <SkeletonLine width="100px" height="16px" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: tokens.spacing.md }}>
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
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
        <button
          onClick={onBack}
          aria-label="Gå tilbake"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing.sm,
            background: 'none',
            border: 'none',
            color: tokens.colors.white,
            cursor: 'pointer',
            padding: 0,
            marginBottom: tokens.spacing.md,
            ...typographyStyle('subheadline'),
          }}
        >
          <ArrowLeft size={20} />
          Tilbake
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: tokens.colors.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: tokens.colors.primary,
          }}>
            <User size={40} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{
              ...typographyStyle('title2'),
              margin: 0,
              marginBottom: '4px',
            }}>
              {athlete.name}
            </h1>
            <div style={{
              ...typographyStyle('subheadline'),
              opacity: 0.9,
            }}>
              HCP {athlete.handicap} • {athlete.level}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'flex',
        gap: tokens.spacing.sm,
        padding: tokens.spacing.md,
        overflowX: 'auto',
      }}>
        <ActionButton icon={<MessageCircle size={18} />} label="Melding" />
        <ActionButton icon={<Calendar size={18} />} label="Book økt" />
        <ActionButton icon={<Award size={18} />} label="Ny test" />
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: tokens.spacing.md,
        padding: `0 ${tokens.spacing.md} ${tokens.spacing.lg}`,
      }}>
        <QuickStat label="Økter denne uka" value={athlete.stats.sessionsThisWeek} />
        <QuickStat label="Total økter" value={athlete.stats.totalSessions} />
        <QuickStat label="Gj.snitt score" value={athlete.stats.avgScore} />
        <QuickStat label="Forbedring" value={athlete.stats.improvement} trend="up" />
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: tokens.spacing.sm,
        padding: `0 ${tokens.spacing.md}`,
        marginBottom: tokens.spacing.md,
        borderBottom: `1px solid ${tokens.colors.mist}`,
      }}>
        <Tab label="Oversikt" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <Tab label="Økter" active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')} />
        <Tab label="Tester" active={activeTab === 'tests'} onClick={() => setActiveTab('tests')} />
      </div>

      {/* Tab Content */}
      <div style={{ padding: `0 ${tokens.spacing.md}` }}>
        {activeTab === 'overview' && (
          <div>
            {/* Recent Sessions */}
            <div style={{
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.radius.md,
              padding: tokens.spacing.lg,
              marginBottom: tokens.spacing.md,
              boxShadow: tokens.shadows.card,
            }}>
              <h3 style={{
                ...typographyStyle('headline'),
                color: tokens.colors.charcoal,
                margin: 0,
                marginBottom: tokens.spacing.md,
              }}>
                Siste økter
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
                {athlete.recentSessions.slice(0, 3).map((session) => (
                  <SessionItem key={session.id} session={session} />
                ))}
              </div>
            </div>

            {/* Upcoming */}
            <div style={{
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.radius.md,
              padding: tokens.spacing.lg,
              boxShadow: tokens.shadows.card,
            }}>
              <h3 style={{
                ...typographyStyle('headline'),
                color: tokens.colors.charcoal,
                margin: 0,
                marginBottom: tokens.spacing.md,
              }}>
                Kommende økter
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
                {athlete.upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    style={{
                      padding: tokens.spacing.md,
                      border: `1px solid ${tokens.colors.mist}`,
                      borderRadius: tokens.radius.sm,
                    }}
                  >
                    <div style={{
                      ...typographyStyle('subheadline'),
                      fontWeight: 600,
                      color: tokens.colors.charcoal,
                      marginBottom: '4px',
                    }}>
                      {session.type}
                    </div>
                    <div style={{
                      ...typographyStyle('caption1'),
                      color: tokens.colors.steel,
                    }}>
                      {session.date} kl. {session.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.radius.md,
            padding: tokens.spacing.lg,
            boxShadow: tokens.shadows.card,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
              {athlete.recentSessions.map((session) => (
                <SessionItem key={session.id} session={session} detailed />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.radius.md,
            padding: tokens.spacing.lg,
            boxShadow: tokens.shadows.card,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
              {athlete.latestTests.map((test) => (
                <div
                  key={test.id}
                  style={{
                    padding: tokens.spacing.md,
                    backgroundColor: tokens.colors.snow,
                    borderRadius: tokens.radius.sm,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        ...typographyStyle('subheadline'),
                        fontWeight: 600,
                        color: tokens.colors.charcoal,
                        marginBottom: '4px',
                      }}>
                        {test.name}
                      </div>
                      <div style={{
                        ...typographyStyle('caption1'),
                        color: tokens.colors.steel,
                      }}>
                        {test.date}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: tokens.spacing.sm,
                    }}>
                      <div style={{
                        ...typographyStyle('title3'),
                        color: tokens.colors.charcoal,
                      }}>
                        {test.score}
                      </div>
                      <TrendingUp
                        size={20}
                        color={test.trend === 'up' ? tokens.colors.success : tokens.colors.steel}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label }) => (
  <button style={{
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
    backgroundColor: tokens.colors.white,
    border: `1px solid ${tokens.colors.mist}`,
    borderRadius: tokens.radius.md,
    cursor: 'pointer',
    ...typographyStyle('subheadline'),
    color: tokens.colors.charcoal,
    whiteSpace: 'nowrap',
  }}>
    {icon}
    {label}
  </button>
);

const QuickStat = ({ label, value, trend }) => (
  <div style={{
    backgroundColor: tokens.colors.white,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.lg,
    boxShadow: tokens.shadows.card,
  }}>
    <div style={{
      ...typographyStyle('title2'),
      color: trend === 'up' ? tokens.colors.success : tokens.colors.charcoal,
      marginBottom: '4px',
    }}>
      {value}
    </div>
    <div style={{
      ...typographyStyle('caption1'),
      color: tokens.colors.steel,
    }}>
      {label}
    </div>
  </div>
);

const Tab = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
      background: 'none',
      border: 'none',
      borderBottom: active ? `2px solid ${tokens.colors.primary}` : '2px solid transparent',
      cursor: 'pointer',
      ...typographyStyle('subheadline'),
      fontWeight: active ? 600 : 400,
      color: active ? tokens.colors.primary : tokens.colors.steel,
    }}
  >
    {label}
  </button>
);

const SessionItem = ({ session, detailed = false }) => {
  const qualityColor = {
    high: tokens.colors.success,
    medium: tokens.colors.warning,
    low: tokens.colors.steel,
  }[session.quality];

  return (
    <div style={{
      padding: tokens.spacing.md,
      border: `1px solid ${tokens.colors.mist}`,
      borderRadius: tokens.radius.sm,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{
            ...typographyStyle('subheadline'),
            fontWeight: 600,
            color: tokens.colors.charcoal,
            marginBottom: '4px',
          }}>
            {session.type}
          </div>
          <div style={{
            ...typographyStyle('caption1'),
            color: tokens.colors.steel,
          }}>
            {session.date} • {session.duration} min
          </div>
        </div>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: qualityColor,
        }} />
      </div>
    </div>
  );
};

export default MobileCoachAthleteDetail;
