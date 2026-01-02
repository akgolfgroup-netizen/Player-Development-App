/**
 * DashboardV2
 *
 * Premium elite golf talent development dashboard.
 * Follows AK Golf Design System v3.0 (Premium Light).
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 *
 * COMPONENT TREE:
 *
 * DashboardV2
 * └── DashboardV2Layout
 *     ├── header: DashboardHeader
 *     │   └── Player greeting, date, avatar
 *     ├── hero: AsyncBoundary
 *     │   └── HeroCard
 *     ├── statsGrid: AsyncBoundary
 *     │   └── StatsGrid (2x2)
 *     ├── nextUp: NextUpSection
 *     ├── dailyPlan: ScheduleCard
 *     ├── strokesGained: StrokesGainedCard
 *     └── activityFeed: ActivityFeed
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardV2Layout from './DashboardV2Layout';
import {
  HeroCard,
  StatsCard,
  StatsGrid,
  NextUpSection,
  ScheduleCard,
  StrokesGainedCard,
  ActivityFeed,
  AsyncBoundary,
  useAsyncState,
} from './components';
import { PageTitle } from '../../../components/typography';

// ============================================================================
// TYPES
// ============================================================================

interface DashboardV2Props {
  playerName: string;
  playerId: string;
}

// ============================================================================
// DASHBOARD HEADER
// ============================================================================

interface DashboardHeaderProps {
  playerName: string;
  dateLabel: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ playerName, dateLabel }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <span className="block text-xs uppercase tracking-wider text-ak-text-secondary font-medium">
          {dateLabel}
        </span>
        <PageTitle className="text-xl font-bold text-ak-text-primary mt-0.5 mb-0">
          Hei, {playerName}
        </PageTitle>
      </div>
    </div>
  );
};

// ============================================================================
// SKELETON COMPONENTS
// ============================================================================

const HeroSkeleton: React.FC = () => (
  <div className="bg-ak-surface-base rounded-xl p-6 shadow-lg">
    <div className="h-3 w-20 bg-ak-surface-subtle rounded mb-2 animate-pulse" />
    <div className="h-7 w-48 bg-ak-surface-subtle rounded mb-5 animate-pulse" />
    <div className="bg-ak-surface-subtle rounded-lg p-4">
      <div className="h-3 w-20 bg-ak-border-default rounded mb-2 animate-pulse" />
      <div className="h-5 w-3/5 bg-ak-border-default rounded mb-1.5 animate-pulse" />
      <div className="h-3.5 w-4/5 bg-ak-border-default rounded animate-pulse" />
    </div>
    <div className="h-11 w-28 bg-ak-surface-subtle rounded mt-4 animate-pulse" />
  </div>
);

const StatsGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 gap-3">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-ak-surface-base rounded-xl p-4 shadow-sm">
        <div className="h-3 w-14 bg-ak-surface-subtle rounded mb-2 animate-pulse" />
        <div className="h-7 w-12 bg-ak-surface-subtle rounded mb-2 animate-pulse" />
        <div className="h-3 w-10 bg-ak-surface-subtle rounded animate-pulse" />
      </div>
    ))}
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DashboardV2: React.FC<DashboardV2Props> = ({ playerName, playerId }) => {
  const navigate = useNavigate();

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
      header={<DashboardHeader playerName={playerName} dateLabel={dateLabel} />}
      hero={
        <AsyncBoundary state={heroState} skeleton={<HeroSkeleton />}>
          <HeroCard
            dateLabel={dateLabel.split(',')[0]}
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
        <AsyncBoundary state={statsState} skeleton={<StatsGridSkeleton />}>
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
            <StatsCard label="Streak" value="12" unit="dager" />
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
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            location: 'Oslo Golfklubb',
          }}
          test={{
            title: 'Kategori B Test',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
            { id: 'approach', label: 'Innspill', value: -0.18 },
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

export default DashboardV2;
