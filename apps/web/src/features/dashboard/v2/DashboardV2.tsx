import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardV2Layout from './DashboardV2Layout';
import {
  HeroCard,
  StatsCard,
  StatsGrid,
  CountdownCard,
  NextUpSection,
  ScheduleCard,
  StrokesGainedCard,
  ActivityFeed,
  AsyncBoundary,
  useAsyncState,
} from './components';

/**
 * DashboardV2
 *
 * Premium elite golf talent development dashboard.
 * Follows AK Golf Design System v3.0 (Premium Light).
 *
 * COMPONENT TREE:
 *
 * DashboardV2
 * └── DashboardV2Layout
 *     ├── header: DashboardHeader
 *     │   └── Player greeting, date, avatar
 *     ├── hero: AsyncBoundary
 *     │   └── HeroCard
 *     │       ├── Date label
 *     │       ├── Personalized greeting
 *     │       ├── Today's focus section
 *     │       │   ├── Focus title
 *     │       │   ├── Description
 *     │       │   └── Progress (optional)
 *     │       └── Primary CTA
 *     ├── statsGrid: AsyncBoundary
 *     │   └── StatsGrid (2x2)
 *     │       ├── StatsCard (Sessions this week)
 *     │       ├── StatsCard (Training hours)
 *     │       ├── StatsCard (Current streak)
 *     │       └── StatsCard (Handicap)
 *     ├── nextUp: AsyncBoundary
 *     │   └── NextUpSection
 *     │       ├── CountdownCard (Tournament)
 *     │       └── CountdownCard (Test)
 *     ├── dailyPlan: AsyncBoundary
 *     │   └── ScheduleCard
 *     │       └── Session items (time, type, title)
 *     ├── strokesGained: AsyncBoundary
 *     │   └── StrokesGainedCard
 *     │       ├── Centerline bar chart
 *     │       └── Total SG value
 *     └── activityFeed: AsyncBoundary
 *         └── ActivityFeed
 *             └── Activity items (type, title, timestamp)
 */

// Example props interface for data fetching integration
interface DashboardV2Props {
  // Player data
  playerName: string;
  playerId: string;
  // Data hooks would be passed here in real implementation
}

const DashboardV2: React.FC<DashboardV2Props> = ({
  playerName,
  playerId,
}) => {
  const navigate = useNavigate();

  // In real implementation, these would come from React Query hooks
  // Example: const { data: stats, isLoading, error } = usePlayerStats(playerId);

  // Mock data for demonstration
  const today = new Date();
  const dateLabel = today.toLocaleDateString('nb-NO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Determine async states (would use real hook data)
  const heroState = useAsyncState(false, null, { exists: true }, () => false);
  const statsState = useAsyncState(false, null, { exists: true }, () => false);

  return (
    <DashboardV2Layout
      header={
        <DashboardHeader
          playerName={playerName}
          dateLabel={dateLabel}
        />
      }
      hero={
        <AsyncBoundary
          state={heroState}
          skeleton={<HeroSkeleton />}
        >
          <HeroCard
            dateLabel={dateLabel.split(',')[0]} // Just day name
            playerName={playerName}
            todaysFocus={{
              title: 'Teknikk: Putt under 2m',
              description: 'Fokuser på pendelfrekvens og anslagsvinkel',
              category: 'Putting',
              progress: 65,
            }}
            primaryAction={{
              label: 'Start økt',
              onClick: () => navigate('/logg-trening'),
            }}
            secondaryAction={{
              label: 'Se plan',
              onClick: () => navigate('/treningsdagbok'),
            }}
          />
        </AsyncBoundary>
      }
      statsGrid={
        <AsyncBoundary
          state={statsState}
          skeleton={<StatsGridSkeleton />}
        >
          <StatsGrid>
            <StatsCard
              label="Økter denne uka"
              value="4"
              unit="/ 6"
              change={{ value: '1', direction: 'up', label: 'vs. forrige' }}
            />
            <StatsCard
              label="Treningstid"
              value="8.5"
              unit="timer"
              change={{ value: '2.5', direction: 'up' }}
            />
            <StatsCard
              label="Streak"
              value="12"
              unit="dager"
            />
            <StatsCard
              label="Handicap"
              value="5.4"
              change={{ value: '0.3', direction: 'down' }}
            />
          </StatsGrid>
        </AsyncBoundary>
      }
      nextUp={
        <NextUpSection
          tournament={{
            title: 'NM Juniorer',
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
            location: 'Oslo Golfklubb',
          }}
          test={{
            title: 'Kategori B Test',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            subtitle: 'Driving, Approach, Putting',
          }}
        />
      }
      dailyPlan={
        <ScheduleCard
          dateLabel={dateLabel.split(',')[1]?.trim() || dateLabel}
          sessions={[
            {
              id: '1',
              title: 'Putting teknikk',
              type: 'teknikk',
              startTime: '09:00',
              endTime: '10:30',
              status: 'completed',
            },
            {
              id: '2',
              title: 'Approach shots',
              type: 'golfslag',
              startTime: '11:00',
              endTime: '12:30',
              status: 'in_progress',
              location: 'Range',
            },
            {
              id: '3',
              title: '9-hull spill',
              type: 'spill',
              startTime: '14:00',
              endTime: '16:00',
              status: 'upcoming',
              location: 'Banen',
            },
          ]}
          onViewAll={() => navigate('/treningsdagbok')}
        />
      }
      strokesGained={
        <StrokesGainedCard
          title="Strokes Gained"
          subtitle="Siste 10 runder"
          metrics={[
            { id: 'driving', label: 'Driving', value: 0.42 },
            { id: 'approach', label: 'Approach', value: -0.18 },
            { id: 'around', label: 'Around', value: 0.25 },
            { id: 'putting', label: 'Putting', value: -0.34 },
          ]}
          total={0.15}
          onViewDetails={() => navigate('/statistikk/strokes-gained')}
        />
      }
      activityFeed={
        <ActivityFeed
          activities={[
            {
              id: '1',
              type: 'session_completed',
              title: 'Putting økt fullført',
              description: '45 min, 87% fokus',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
              isUnread: true,
            },
            {
              id: '2',
              type: 'coach_message',
              title: 'Ny melding fra coach',
              description: 'Bra jobbet med...',
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
              isUnread: true,
            },
            {
              id: '3',
              type: 'badge_earned',
              title: 'Ny badge opptjent',
              description: 'Putting Master - Bronse',
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
              isGoldAchievement: false,
            },
          ]}
          onViewAll={() => navigate('/aktivitet')}
        />
      }
    />
  );
};

/**
 * Dashboard Header Component
 */
interface DashboardHeaderProps {
  playerName: string;
  dateLabel: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  playerName,
  dateLabel,
}) => {
  return (
    <div style={headerStyles.container}>
      <div style={headerStyles.greeting}>
        <span style={headerStyles.date}>{dateLabel}</span>
        <h1 style={headerStyles.name}>Hei, {playerName}</h1>
      </div>
    </div>
  );
};

const headerStyles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--spacing-4)',
  },
  greeting: {},
  date: {
    display: 'block',
    fontSize: 'var(--font-size-caption1)',
    lineHeight: 'var(--line-height-caption1)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 500,
  },
  name: {
    fontSize: 'var(--font-size-title2)',
    lineHeight: 'var(--line-height-title2)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: '2px 0 0 0',
  },
};

/**
 * Skeleton Components
 */
const HeroSkeleton: React.FC = () => (
  <div style={skeletonStyles.card}>
    <div style={{ ...skeletonStyles.pulse, height: '12px', width: '80px', marginBottom: '8px' }} />
    <div style={{ ...skeletonStyles.pulse, height: '28px', width: '200px', marginBottom: '20px' }} />
    <div style={skeletonStyles.focusBox}>
      <div style={{ ...skeletonStyles.pulse, height: '12px', width: '80px', marginBottom: '8px' }} />
      <div style={{ ...skeletonStyles.pulse, height: '20px', width: '60%', marginBottom: '6px' }} />
      <div style={{ ...skeletonStyles.pulse, height: '14px', width: '80%' }} />
    </div>
    <div style={{ ...skeletonStyles.pulse, height: '44px', width: '120px', marginTop: '16px' }} />
  </div>
);

const StatsGridSkeleton: React.FC = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-3)' }}>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} style={skeletonStyles.statsCard}>
        <div style={{ ...skeletonStyles.pulse, height: '12px', width: '60px', marginBottom: '8px' }} />
        <div style={{ ...skeletonStyles.pulse, height: '28px', width: '50px', marginBottom: '8px' }} />
        <div style={{ ...skeletonStyles.pulse, height: '12px', width: '40px' }} />
      </div>
    ))}
  </div>
);

const skeletonStyles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-xl)',
    padding: 'var(--spacing-6)',
    boxShadow: 'var(--shadow-elevated)',
  },
  statsCard: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-xl)',
    padding: 'var(--spacing-4)',
    boxShadow: 'var(--shadow-card)',
  },
  focusBox: {
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-4)',
  },
  pulse: {
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-sm)',
    animation: 'skeletonPulse 1.5s ease-in-out infinite',
  },
};

export default DashboardV2;
