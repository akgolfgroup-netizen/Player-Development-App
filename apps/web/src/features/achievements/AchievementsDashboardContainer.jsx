import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { achievementsAPI, badgesAPI } from '../../services/api';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import AchievementsDashboard from './AchievementsDashboard';
import { PageHeader } from '../../ui/raw-blocks';

/**
 * AchievementsDashboardContainer
 * Fetches achievements and badge progress from API
 * and passes data to AchievementsDashboard for display
 */
const AchievementsDashboardContainer = () => {
  const { user } = useAuth();
  const [state, setState] = useState('loading');
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    achievements: [],
    stats: null,
    badges: [],
    badgeProgress: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState('loading');
      setError(null);

      // Fetch achievements and badge progress in parallel
      const [achievementsRes, statsRes, badgesRes, progressRes] = await Promise.all([
        achievementsAPI.list().catch(() => ({ data: [] })),
        achievementsAPI.getStats().catch(() => ({ data: null })),
        badgesAPI.getDefinitions(true).catch(() => ({ data: { badges: [] } })),
        badgesAPI.getProgress().catch(() => ({ data: { unlockedBadges: [], badgeProgress: {}, stats: {} } })),
      ]);

      const achievements = Array.isArray(achievementsRes.data)
        ? achievementsRes.data
        : achievementsRes.data?.achievements || [];
      const stats = statsRes.data;
      const badges = badgesRes.data?.badges || [];
      const badgeProgress = progressRes.data;

      setData({
        achievements,
        stats,
        badges,
        badgeProgress,
      });

      const hasData = achievements.length > 0 || badges.length > 0 || badgeProgress.unlockedBadges?.length > 0;
      setState(hasData ? 'idle' : 'empty');
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setError(err);
      setState('error');
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  return (
    <>
      <PageHeader
        title="Prestasjoner"
        subtitle="Dine opptjente badges og prestasjonsmerker"
        helpText="Oversikt over alle prestasjoner og badges. Filtrer på kategori (konsistens, volum, forbedring, milepæler, spesial). Se total XP, opplåste badges, fremgang mot neste nivå og nylige prestasjoner. Spor prestasjonene dine over tid."
      />
      {state === 'loading' && <LoadingState message="Laster prestasjoner..." />}
      {state === 'error' && (
        <ErrorState
          errorType={error?.type}
          message={error?.message || 'Kunne ikke laste prestasjoner'}
          onRetry={fetchData}
        />
      )}
      {state === 'empty' && (
        <EmptyState
          title="Ingen prestasjoner"
          message="Du har ikke låst opp noen prestasjoner ennå. Fortsett å trene for å opptjene badges!"
        />
      )}
      {state === 'idle' && (
        <AchievementsDashboard
          achievements={data.achievements}
          stats={data.stats}
          badges={data.badges}
          badgeProgress={data.badgeProgress}
        />
      )}
    </>
  );
};

export default AchievementsDashboardContainer;
