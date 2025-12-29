/**
 * AchievementsDashboard - Achievements and XP overview
 *
 * Shows player achievements with:
 * - Total XP and unlocked badges
 * - Category filters
 * - Progress to next levels
 *
 * Uses design system colors (Blue Palette 01) for consistent styling.
 */
import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';

export default function AchievementsDashboard({ planId }) {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (planId) loadAchievements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  const loadAchievements = async () => {
    setLoading(true);
    try {
      const { data: response } = await apiClient.get(
        `/training-plan/${planId}/achievements`
      );
      setData(response.data);
    } catch (err) {
      console.error('Failed to load achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading achievements...</div>;
  if (!data) return null;

  const { achievements, totalXP, unlockedAchievements, availableAchievements } = data;

  const filteredAchievements = filter === 'all'
    ? achievements
    : achievements.filter(a => a.category === filter);

  const categories = ['all', 'consistency', 'volume', 'improvement', 'milestone', 'special'];

  return (
    <div className="space-y-6">
      {/* XP Header - using AK Golf Academy brand colors */}
      <div className="bg-gradient-to-r from-ak-primary to-ak-primary-light rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Achievements</h1>
            <p className="text-white/80 mt-1">
              {unlockedAchievements} / {availableAchievements} badges unlocked
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{totalXP}</div>
            <div className="text-white/80">Total XP</div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap ${
              filter === cat
                ? 'bg-ak-primary text-white'
                : 'bg-ak-surface text-ak-ink hover:bg-ak-surface/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map(achievement => (
          <AchievementCard key={achievement.achievementId} achievement={achievement} />
        ))}
      </div>
    </div>
  );
}

function AchievementCard({ achievement }) {
  const { icon, name, description, currentLevel, currentLevelData, nextLevel, progress, totalXP } = achievement;
  const isUnlocked = currentLevel > 0;

  return (
    <div
      className={`rounded-lg shadow p-6 ${
        isUnlocked ? 'bg-white border-2 border-ak-primary/20' : 'bg-ak-snow opacity-75'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`text-5xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-ak-ink">{name}</h3>
              <p className="text-sm text-ak-steel">{description}</p>
            </div>
            {totalXP > 0 && (
              <span className="text-ak-gold font-bold text-lg">{totalXP} XP</span>
            )}
          </div>

          {/* Current Level */}
          {currentLevelData && (
            <div
              className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-3"
              style={{
                backgroundColor: currentLevelData.color + '20',
                color: currentLevelData.color,
              }}
            >
              {currentLevelData.title}
            </div>
          )}

          {/* Progress Bar */}
          {nextLevel && (
            <div className="mt-3">
              <div className="flex justify-between text-sm text-ak-steel mb-1">
                <span>Progress to next level</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="bg-ak-mist rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-ak-primary to-ak-primary-light h-full transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="text-xs text-ak-steel mt-1">
                Next: {nextLevel.title} ({nextLevel.requirement} required)
              </div>
            </div>
          )}

          {/* All Levels */}
          {isUnlocked && (
            <div className="mt-3 flex gap-1">
              {achievement.currentLevelData &&
                Array.from({ length: 5 }, (_, i) => i + 1).map(level => {
                  const isEarned = level <= currentLevel;
                  return (
                    <div
                      key={level}
                      className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
                        isEarned ? 'bg-ak-primary text-white' : 'bg-ak-mist text-ak-steel'
                      }`}
                    >
                      {level}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
