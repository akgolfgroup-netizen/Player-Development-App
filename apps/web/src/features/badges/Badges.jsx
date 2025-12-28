import React, { useState, useEffect, useCallback } from 'react';
import { BadgeGrid } from '../../components/badges';
import { useAuth } from '../../contexts/AuthContext';
import './Badges.css';

/**
 * Demo badge definitions matching backend structure
 * Used when API is not available
 */
const DEMO_BADGES = [
  // Volume badges
  { id: 'hours_10', name: 'Dedikert Start', description: 'Logg 10 timer trening totalt', category: 'volume', symbol: 'clock', tier: 'standard', xp: 50, requirements: [{ description: '10 timer trening' }] },
  { id: 'hours_50', name: 'Fokusert Innsats', description: 'Logg 50 timer trening totalt', category: 'volume', symbol: 'clock', tier: 'bronze', xp: 100, requirements: [{ description: '50 timer trening' }] },
  { id: 'hours_100', name: 'Century Club', description: 'Logg 100 timer trening totalt', category: 'volume', symbol: 'clock', tier: 'silver', xp: 200, requirements: [{ description: '100 timer trening' }] },
  { id: 'hours_250', name: 'Seriøs Utøver', description: 'Logg 250 timer trening totalt', category: 'volume', symbol: 'clock', tier: 'silver', xp: 350, requirements: [{ description: '250 timer trening' }] },
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

  // Accuracy badges
  { id: 'fw_50', name: 'Fairway Finder', description: 'Oppnå 50%+ fairway hit', category: 'accuracy', symbol: 'target', tier: 'standard', xp: 75, requirements: [{ description: '50%+ fairways' }] },
  { id: 'fw_60', name: 'Fairway Konsistent', description: 'Oppnå 60%+ fairway hit', category: 'accuracy', symbol: 'target', tier: 'bronze', xp: 150, requirements: [{ description: '60%+ fairways' }] },
  { id: 'gir_40', name: 'Green Seeker', description: 'Oppnå 40%+ GIR', category: 'accuracy', symbol: 'flag', tier: 'standard', xp: 75, requirements: [{ description: '40%+ GIR' }] },
  { id: 'gir_50', name: 'Approach Konsistent', description: 'Oppnå 50%+ GIR', category: 'accuracy', symbol: 'flag', tier: 'bronze', xp: 150, requirements: [{ description: '50%+ GIR' }] },

  // Putting badges
  { id: 'putts_34', name: 'Solid Putter', description: 'Gjennomsnitt under 34 putts per runde', category: 'putting', symbol: 'flag', tier: 'bronze', xp: 100, requirements: [{ description: 'Under 34 putts/runde' }] },
  { id: 'putts_32', name: 'Putter Pro', description: 'Gjennomsnitt under 32 putts per runde', category: 'putting', symbol: 'flag', tier: 'silver', xp: 200, requirements: [{ description: 'Under 32 putts/runde' }] },
  { id: 'oneputt_30', name: 'One-Putt Artist', description: '30%+ one-putt rate', category: 'putting', symbol: 'star', tier: 'bronze', xp: 100, requirements: [{ description: '30%+ one-putts' }] },

  // Short game badges
  { id: 'up_down_40', name: 'Scrambler', description: '40%+ up-and-down rate', category: 'short_game', symbol: 'flag', tier: 'bronze', xp: 100, requirements: [{ description: '40%+ up-and-down' }] },
  { id: 'sand_save_40', name: 'Bunker Fighter', description: '40%+ sand save rate', category: 'short_game', symbol: 'flag', tier: 'bronze', xp: 100, requirements: [{ description: '40%+ sand saves' }] },

  // Mental badges
  { id: 'mental_10', name: 'Mental Start', description: 'Fullfør 10 mental treningsøkter', category: 'mental', symbol: 'brain', tier: 'bronze', xp: 100, requirements: [{ description: '5+ timer mental' }] },
  { id: 'mental_50', name: 'Mental Warrior', description: 'Fullfør 25 timer mental trening', category: 'mental', symbol: 'brain', tier: 'silver', xp: 250, requirements: [{ description: '25+ timer mental' }] },

  // Phase badges
  { id: 'phase_grunnlag', name: 'Grunnlag Fullført', description: 'Fullfør en grunnlagsperiode', category: 'phase', symbol: 'check', tier: 'bronze', xp: 150, requirements: [{ description: '1 fase fullført' }] },
  { id: 'compliance_80', name: 'Plan Følger', description: 'Oppnå 80%+ compliance i en fase', category: 'phase', symbol: 'check', tier: 'bronze', xp: 100, requirements: [{ description: '80%+ compliance' }] },

  // Milestone badges
  { id: 'score_under_90', name: 'Breaking 90', description: 'Spill en runde under 90 slag', category: 'milestone', symbol: 'trophy', tier: 'bronze', xp: 150, requirements: [{ description: 'Under 90' }] },
  { id: 'score_under_80', name: 'Breaking 80', description: 'Spill en runde under 80 slag', category: 'milestone', symbol: 'trophy', tier: 'gold', xp: 400, requirements: [{ description: 'Under 80' }] },
  { id: 'hcp_single_digit', name: 'Single-Digit', description: 'Oppnå enkeltsifret handicap', category: 'milestone', symbol: 'medal', tier: 'silver', xp: 300, requirements: [{ description: 'HCP < 10' }] },
  { id: 'rounds_25', name: 'Bane Entusiast', description: 'Spill 25 runder', category: 'milestone', symbol: 'flag', tier: 'bronze', xp: 100, requirements: [{ description: '25 runder' }] },

  // Seasonal badges
  { id: 'winter_warrior', name: 'Vinterkrigere', description: 'Tren ute i desember, januar eller februar', category: 'seasonal', symbol: 'snowflake', tier: 'bronze', xp: 100, isLimited: true, requirements: [{ description: 'Vintertrening' }] },
  { id: 'summer_grinder', name: 'Sommergrinder', description: 'Tren 50+ timer i juni, juli eller august', category: 'seasonal', symbol: 'sun', tier: 'gold', xp: 300, isLimited: true, requirements: [{ description: '50+ timer sommer' }] },
];

const Badges = () => {
  const { token } = useAuth();
  const [badges, setBadges] = useState([]);
  const [userStats, setUserStats] = useState({
    unlockedBadges: [],
    badgeProgress: {},
    stats: { total: 0, unlocked: 0, percentComplete: 0 },
  });
  const [loading, setLoading] = useState(true);

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
        'hours_100': { current: 75, target: 100 },
        'sessions_100': { current: 68, target: 100 },
        'streak_14': { current: 10, target: 14 },
        'speed_100': { current: 97, target: 100 },
      },
      stats: { total: DEMO_BADGES.length, unlocked: 6, percentComplete: Math.round((6 / DEMO_BADGES.length) * 100) },
    });
    setLoading(false);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      // Fetch badge definitions and progress in parallel
      const [definitionsRes, progressRes] = await Promise.all([
        fetch('/api/v1/badges/definitions', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch('/api/v1/badges/progress', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
      ]);

      if (definitionsRes.ok && progressRes.ok) {
        const definitionsData = await definitionsRes.json();
        const progressData = await progressRes.json();

        setBadges(definitionsData.badges || []);
        setUserStats(progressData);
      } else {
        console.warn('Badge API returned non-ok status, using demo data');
        loadDemoData();
        return;
      }
    } catch (error) {
      console.warn('Badge API not available, using demo data:', error);
      loadDemoData();
      return;
    }
    setLoading(false);
  }, [token, loadDemoData]);

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      loadDemoData();
    }
  }, [token, fetchData, loadDemoData]);

  const handleBadgeClick = (badge) => {
    // Badge click handler - placeholder for future badge details modal
    console.debug('Badge clicked:', badge.name);
  };

  if (loading) {
    return (
      <div className="badges-page">
        <div className="badges-page__loading">
          <div className="badges-page__spinner" />
          <p>Laster badges...</p>
        </div>
      </div>
    );
  }

  const totalBadges = badges.length || userStats.stats?.total || 0;
  const unlockedCount = userStats.stats?.unlocked ?? userStats.unlockedBadges.length;
  const percentComplete = userStats.stats?.percentComplete ?? Math.round((unlockedCount / totalBadges) * 100);

  return (
    <div className="badges-page">
      <div className="badges-page__hero">
        <div className="badges-page__hero-content">
          <h1 className="badges-page__title">Dine Prestasjoner</h1>
          <p className="badges-page__description">
            Opptjen badges ved å fullføre utfordringer, nå milepæler, og demonstrere dedikasjon til din treningsreise.
          </p>
        </div>

        <div className="badges-page__stats">
          <div className="badges-page__stat">
            <div className="badges-page__stat-value">{unlockedCount}</div>
            <div className="badges-page__stat-label">Opptjent</div>
          </div>
          <div className="badges-page__stat">
            <div className="badges-page__stat-value">{totalBadges - unlockedCount}</div>
            <div className="badges-page__stat-label">Gjenstående</div>
          </div>
          <div className="badges-page__stat">
            <div className="badges-page__stat-value">{percentComplete}%</div>
            <div className="badges-page__stat-label">Fullført</div>
          </div>
        </div>
      </div>

      <BadgeGrid
        badges={badges}
        userStats={userStats}
        groupBy="category"
        showFilters={true}
        onBadgeClick={handleBadgeClick}
        hideUnavailable={false}
      />
    </div>
  );
};

export default Badges;
