import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Calendar, Activity } from 'lucide-react';
import { tokens, typographyStyle } from '../design-tokens';
import { SkeletonCard, SkeletonLine } from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';

const MobileCoachDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get('/coach/dashboard/stats');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));

      const mockData = {
        totalAthletes: 24,
        activeToday: 12,
        upcomingSessions: 5,
        recentTests: 3,
        activeAthletes: [
          { id: 1, name: 'Emma Hansen', activity: 'Putting Practice', time: '10 min siden' },
          { id: 2, name: 'Lars Olsen', activity: 'Range Session', time: '25 min siden' },
          { id: 3, name: 'Maria Berg', activity: 'Course Play', time: '1 time siden' },
        ],
        upcomingSchedule: [
          { id: 1, athlete: 'Emma Hansen', time: '14:00', type: 'Technique' },
          { id: 2, athlete: 'Lars Olsen', time: '15:30', type: 'Strategy' },
          { id: 3, athlete: 'Maria Berg', time: '16:00', type: 'Mental' },
        ],
      };

      setStats(mockData);
    } catch (err) {
      setError(err.message || 'Kunne ikke laste dashboard-data');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  if (loading) {
    return (
      <div style={{
        padding: tokens.spacing.md,
        fontFamily: tokens.typography.fontFamily,
        backgroundColor: tokens.colors.snow,
        minHeight: '100vh',
      }}>
        <SkeletonLine width="200px" height="32px" style={{ marginBottom: tokens.spacing.lg }} />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: tokens.spacing.md,
          marginBottom: tokens.spacing.lg,
        }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard style={{ height: '300px' }} />
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
        padding: tokens.spacing.lg,
        backgroundColor: tokens.colors.primary,
        color: tokens.colors.white,
      }}>
        <h1 style={{
          ...typographyStyle('title2'),
          margin: 0,
          marginBottom: tokens.spacing.sm,
        }}>
          Trener Dashboard
        </h1>
        <p style={{
          ...typographyStyle('subheadline'),
          margin: 0,
          opacity: 0.9,
        }}>
          Oversikt over dine utøvere
        </p>
      </div>

      <div style={{ padding: tokens.spacing.md }}>
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: tokens.spacing.md,
          marginBottom: tokens.spacing.lg,
        }}>
          <StatCard
            icon={<Users size={24} />}
            label="Totale utøvere"
            value={stats.totalAthletes}
            color={tokens.colors.primary}
          />
          <StatCard
            icon={<Activity size={24} />}
            label="Aktive i dag"
            value={stats.activeToday}
            color={tokens.colors.success}
          />
          <StatCard
            icon={<Calendar size={24} />}
            label="Kommende økter"
            value={stats.upcomingSessions}
            color={tokens.colors.gold}
          />
          <StatCard
            icon={<TrendingUp size={24} />}
            label="Nye tester"
            value={stats.recentTests}
            color={tokens.colors.warning}
          />
        </div>

        {/* Active Athletes */}
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: tokens.radius.md,
          padding: tokens.spacing.lg,
          marginBottom: tokens.spacing.lg,
          boxShadow: tokens.shadows.card,
        }}>
          <h2 style={{
            ...typographyStyle('headline'),
            color: tokens.colors.charcoal,
            margin: 0,
            marginBottom: tokens.spacing.md,
          }}>
            Nylig aktivitet
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
            {stats.activeAthletes.map((athlete) => (
              <div
                key={athlete.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: tokens.spacing.md,
                  backgroundColor: tokens.colors.snow,
                  borderRadius: tokens.radius.sm,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    ...typographyStyle('subheadline'),
                    fontWeight: 600,
                    color: tokens.colors.charcoal,
                    marginBottom: '4px',
                  }}>
                    {athlete.name}
                  </div>
                  <div style={{
                    ...typographyStyle('footnote'),
                    color: tokens.colors.steel,
                  }}>
                    {athlete.activity}
                  </div>
                </div>
                <div style={{
                  ...typographyStyle('caption1'),
                  color: tokens.colors.steel,
                  textAlign: 'right',
                }}>
                  {athlete.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: tokens.radius.md,
          padding: tokens.spacing.lg,
          boxShadow: tokens.shadows.card,
        }}>
          <h2 style={{
            ...typographyStyle('headline'),
            color: tokens.colors.charcoal,
            margin: 0,
            marginBottom: tokens.spacing.md,
          }}>
            Dagens øktplan
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
            {stats.upcomingSchedule.map((session) => (
              <div
                key={session.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: tokens.spacing.md,
                  padding: tokens.spacing.md,
                  border: `1px solid ${tokens.colors.mist}`,
                  borderRadius: tokens.radius.sm,
                }}
              >
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: `${tokens.colors.primary}15`,
                  borderRadius: tokens.radius.sm,
                  ...typographyStyle('caption1'),
                  fontWeight: 600,
                  color: tokens.colors.primary,
                  minWidth: '60px',
                  textAlign: 'center',
                }}>
                  {session.time}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    ...typographyStyle('subheadline'),
                    fontWeight: 600,
                    color: tokens.colors.charcoal,
                  }}>
                    {session.athlete}
                  </div>
                  <div style={{
                    ...typographyStyle('caption1'),
                    color: tokens.colors.steel,
                  }}>
                    {session.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div style={{
    backgroundColor: tokens.colors.white,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.lg,
    boxShadow: tokens.shadows.card,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.sm,
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      borderRadius: tokens.radius.sm,
      backgroundColor: `${color}15`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: color,
    }}>
      {icon}
    </div>
    <div style={{
      ...typographyStyle('largeTitle'),
      color: tokens.colors.charcoal,
      margin: 0,
    }}>
      {value}
    </div>
    <div style={{
      ...typographyStyle('caption1'),
      color: tokens.colors.steel,
      margin: 0,
    }}>
      {label}
    </div>
  </div>
);

export default MobileCoachDashboard;
