import React, { useState, useEffect, useCallback } from 'react';
import { TierCard, AchievementBadge, TierBadge } from '../../components/tier';
import { useAuth } from '../../contexts/AuthContext';
import { badgesAPI } from '../../services/api';
import { Trophy, Award, TrendingUp } from 'lucide-react';

/**
 * TIER Golf Badges Gallery
 *
 * Modern badge display using TIER design system with AchievementBadge components.
 * Replaces the old BadgeGrid with cleaner TIER design.
 *
 * Features:
 * - Category filtering
 * - Tier filtering
 * - Progress tracking
 * - Unlock animations
 * - Stats summary
 */

/**
 * Demo badge definitions matching backend structure
 * Used when API is not available
 */
const DEMO_BADGES = [
  // Volume badges
  { id: 'hours_10', name: 'Dedikert Start', description: 'Logg 10 timer trening totalt', category: 'volume', symbol: 'clock', tier: 'standard', xp: 50, requirements: [{ description: '10 timer trening' }] },
  { id: 'hours_50', name: 'Fokusert Innsats', description: 'Logg 50 timer trening totalt', category: 'volume', symbol: 'clock', tier: 'bronze', xp: 100, requirements: [{ description: '50 timer trening' }] },
  { id: 'hours_100', name: 'Century Club', description: 'Logg 100 timer trening totalt', category: 'volume', symbol: 'clock', tier: 'silver', xp: 200, requirements: [{ description: '100 timer trening' }] },
  { id: 'hours_250', name: 'Seriøs Spiller', description: 'Logg 250 timer trening totalt', category: 'volume', symbol: 'clock', tier: 'silver', xp: 350, requirements: [{ description: '250 timer trening' }] },
  { id: 'hours_500', name: 'Halvveis til 1000', description: 'Logg 500 timer trening totalt', category: 'volume', symbol: 'clock', tier: 'gold', xp: 500, requirements: [{ description: '500 timer trening' }] },
  { id: 'sessions_25', name: 'Rutinebygger', description: 'Fullfør 25 treningsøkter', category: 'volume', symbol: 'check', tier: 'standard', xp: 50, requirements: [{ description: '25 økter' }] },
  { id: 'sessions_100', name: 'Økt-Entusiast', description: 'Fullfør 100 treningsøkter', category: 'volume', symbol: 'check', tier: 'bronze', xp: 150, requirements: [{ description: '100 økter' }] },

  // Streak badges
  { id: 'streak_3', name: 'På Gang', description: 'Tren 3 dager på rad', category: 'streak', symbol: 'flame', tier: 'standard', xp: 25, requirements: [{ description: '3 dagers streak' }] },
  { id: 'streak_7', name: 'Uke Warrior', description: 'Tren 7 dager på rad', category: 'streak', symbol: 'flame', tier: 'bronze', xp: 75, requirements: [{ description: '7 dagers streak' }] },
  { id: 'streak_14', name: 'To Uker Sterk', description: 'Tren 14 dager på rad', category: 'streak', symbol: 'flame', tier: 'silver', xp: 150, requirements: [{ description: '14 dagers streak' }] },
  { id: 'streak_30', name: 'Månedens Utholdenhet', description: 'Tren 30 dager på rad', category: 'streak', symbol: 'flame', tier: 'gold', xp: 300, requirements: [{ description: '30 dagers streak' }] },
  { id: 'early_bird_10', name: 'Morgenfugl', description: 'Tren før kl. 09:00 ti ganger', category: 'streak', symbol: 'sunrise', tier: 'bronze', xp: 100, requirements: [{ description: '10 morgenøkter' }] },

  // Strength badges
  { id: 'tonnage_1000', name: 'Første Tonn', description: 'Løft 1000 kg total tonnasje', category: 'strength', symbol: 'dumbbell', tier: 'standard', xp: 50, requirements: [{ description: '1000 kg tonnasje' }] },
  { id: 'tonnage_10000', name: '10 Tonn Klubben', description: 'Løft 10,000 kg total tonnasje', category: 'strength', symbol: 'dumbbell', tier: 'bronze', xp: 100, requirements: [{ description: '10,000 kg tonnasje' }] },
  { id: 'pr_first', name: 'Første PR', description: 'Sett din første personlige rekord', category: 'strength', symbol: 'trophy', tier: 'standard', xp: 50, requirements: [{ description: '1 PR' }] },
  { id: 'pr_10', name: 'PR Jeger', description: 'Sett 10 personlige rekorder', category: 'strength', symbol: 'trophy', tier: 'bronze', xp: 150, requirements: [{ description: '10 PRs' }] },

  // Speed badges
  { id: 'speed_100', name: '100+ Club', description: 'Oppnå 100+ mph driver speed', category: 'speed', symbol: 'lightning', tier: 'bronze', xp: 150, requirements: [{ description: '100+ mph driver' }] },
  { id: 'speed_105', name: '105+ Club', description: 'Oppnå 105+ mph driver speed', category: 'speed', symbol: 'lightning', tier: 'silver', xp: 250, requirements: [{ description: '105+ mph driver' }] },
  { id: 'speed_110', name: '110+ Club', description: 'Oppnå 110+ mph driver speed', category: 'speed', symbol: 'lightning', tier: 'gold', xp: 400, requirements: [{ description: '110+ mph driver' }] },
  { id: 'speed_gain_3', name: 'Hastighetsøkning', description: 'Øk driver speed med 3+ mph fra baseline', category: 'speed', symbol: 'lightning', tier: 'bronze', xp: 150, requirements: [{ description: '+3 mph forbedring' }] },

  // Milestone badges
  { id: 'score_under_90', name: 'Breaking 90', description: 'Spill en runde under 90 slag', category: 'milestone', symbol: 'trophy', tier: 'bronze', xp: 150, requirements: [{ description: 'Under 90' }] },
  { id: 'score_under_80', name: 'Breaking 80', description: 'Spill en runde under 80 slag', category: 'milestone', symbol: 'trophy', tier: 'gold', xp: 400, requirements: [{ description: 'Under 80' }] },
  { id: 'hcp_single_digit', name: 'Single-Digit', description: 'Oppnå enkeltsifret handicap', category: 'milestone', symbol: 'medal', tier: 'silver', xp: 300, requirements: [{ description: 'HCP < 10' }] },
  { id: 'rounds_25', name: 'Bane Entusiast', description: 'Spill 25 runder', category: 'milestone', symbol: 'flag', tier: 'bronze', xp: 100, requirements: [{ description: '25 runder' }] },

  // Seasonal badges
  { id: 'winter_warrior', name: 'Vinterkrigere', description: 'Tren ute i desember, januar eller februar', category: 'seasonal', symbol: 'snowflake', tier: 'bronze', xp: 100, isLimited: true, requirements: [{ description: 'Vintertrening' }] },
  { id: 'summer_grinder', name: 'Sommergrinder', description: 'Tren 50+ timer i juni, juli eller august', category: 'seasonal', symbol: 'sun', tier: 'gold', xp: 300, isLimited: true, requirements: [{ description: '50+ timer sommer' }] },
];

const categoryLabels = {
  all: 'Alle kategorier',
  volume: 'Treningsvolum',
  streak: 'Streaks',
  strength: 'Styrke',
  speed: 'Hastighet',
  accuracy: 'Nøyaktighet',
  putting: 'Putting',
  short_game: 'Kort spill',
  mental: 'Mental',
  phase: 'Faser',
  milestone: 'Milepæler',
  seasonal: 'Sesongbasert',
};

const tierLabels = {
  all: 'Alle nivåer',
  standard: 'Standard',
  bronze: 'Bronse',
  silver: 'Sølv',
  gold: 'Gull',
  platinum: 'Platina',
};

export function TierBadges() {
  const { user } = useAuth();
  const [badges, setBadges] = useState([]);
  const [userStats, setUserStats] = useState({
    unlockedBadges: [],
    badgeProgress: {},
    stats: { total: 0, unlocked: 0, percentComplete: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  const loadDemoData = useCallback(() => {
    setBadges(DEMO_BADGES);
    setUserStats({
      unlockedBadges: [
        'hours_10',
        'hours_50',
        'sessions_25',
        'streak_3',
        'streak_7',
        'pr_first',
      ],
      badgeProgress: {
        hours_100: { current: 75, target: 100 },
        sessions_100: { current: 68, target: 100 },
        streak_14: { current: 10, target: 14 },
        speed_100: { current: 97, target: 100 },
      },
      stats: { total: DEMO_BADGES.length, unlocked: 6, percentComplete: Math.round((6 / DEMO_BADGES.length) * 100) },
    });
    setLoading(false);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [definitionsRes, progressRes] = await Promise.all([
        badgesAPI.getDefinitions(true),
        badgesAPI.getProgress(),
      ]);

      const definitionsData = definitionsRes.data;
      const progressData = progressRes.data;

      setBadges(definitionsData.badges || []);
      setUserStats(progressData);
      setLoading(false);
    } catch (error) {
      console.warn('Badge API not available, using demo data:', error);
      loadDemoData();
    }
  }, [loadDemoData]);

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      loadDemoData();
    }
  }, [user, fetchData, loadDemoData]);

  const filteredBadges = badges.filter((badge) => {
    const categoryMatch = categoryFilter === 'all' || badge.category === categoryFilter;
    const tierMatch = tierFilter === 'all' || badge.tier === tierFilter;
    return categoryMatch && tierMatch;
  });

  const handleBadgeClick = (badge) => {
    console.debug('Badge clicked:', badge.name);
    // Future: Open modal with badge details
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-tier-navy/20 border-t-tier-navy rounded-full animate-spin mb-4" />
            <p className="text-text-muted">Laster badges...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalBadges = badges.length || userStats.stats?.total || 0;
  const unlockedCount = userStats.stats?.unlocked ?? userStats.unlockedBadges.length;
  const percentComplete = userStats.stats?.percentComplete ?? Math.round((unlockedCount / totalBadges) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-tier-navy mb-2">
            Dine Badges
          </h1>
          <p className="text-text-muted">
            Samle prestasjoner og lås opp belønninger
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <TierCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-tier-navy/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-tier-navy" />
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-tier-navy">
                  {unlockedCount}
                </div>
                <div className="text-sm text-text-muted">Badges låst opp</div>
              </div>
            </div>
          </TierCard>

          <TierCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-tier-gold/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-tier-gold" />
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-tier-navy">
                  {totalBadges}
                </div>
                <div className="text-sm text-text-muted">Totale badges</div>
              </div>
            </div>
          </TierCard>

          <TierCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-status-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-status-success" />
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-tier-navy">
                  {percentComplete}%
                </div>
                <div className="text-sm text-text-muted">Fullført</div>
              </div>
            </div>
          </TierCard>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-tier-navy mb-2">
              Kategori
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-tier-navy focus:outline-none focus:ring-2 focus:ring-tier-navy/20"
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Tier Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-tier-navy mb-2">
              Nivå
            </label>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-tier-navy focus:outline-none focus:ring-2 focus:ring-tier-navy/20"
            >
              {Object.entries(tierLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Result Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-text-muted">
            Viser {filteredBadges.length} av {totalBadges} badges
          </p>
          {(categoryFilter !== 'all' || tierFilter !== 'all') && (
            <button
              onClick={() => {
                setCategoryFilter('all');
                setTierFilter('all');
              }}
              className="text-sm text-tier-navy hover:underline"
            >
              Tilbakestill filtre
            </button>
          )}
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredBadges.map((badge) => {
            const isUnlocked = userStats.unlockedBadges.includes(badge.id);
            const progress = userStats.badgeProgress[badge.id];

            return (
              <AchievementBadge
                key={badge.id}
                {...badge}
                unlocked={isUnlocked}
                progress={progress}
                onClick={() => handleBadgeClick(badge)}
              />
            );
          })}
        </div>

        {/* Empty State */}
        {filteredBadges.length === 0 && (
          <TierCard className="p-12">
            <div className="text-center">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-tier-navy mb-2">
                Ingen badges funnet
              </h3>
              <p className="text-text-muted mb-4">
                Prøv å endre filterne dine
              </p>
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setTierFilter('all');
                }}
                className="text-tier-navy hover:underline"
              >
                Tilbakestill filtre
              </button>
            </div>
          </TierCard>
        )}
      </div>
    </div>
  );
}

export default TierBadges;
