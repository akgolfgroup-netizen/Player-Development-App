import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/v1';

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
      const token = localStorage.getItem('token');
      const { data: response } = await axios.get(
        `${API_BASE}/training-plan/${planId}/achievements`,
        { headers: { Authorization: `Bearer ${token}` } }
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
      {/* XP Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Achievements</h1>
            <p className="text-purple-100 mt-1">
              {unlockedAchievements} / {availableAchievements} badges unlocked
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{totalXP}</div>
            <div className="text-purple-100">Total XP</div>
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
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
        isUnlocked ? 'bg-white border-2 border-purple-200' : 'bg-gray-50 opacity-75'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`text-5xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            {totalXP > 0 && (
              <span className="text-purple-600 font-bold text-lg">{totalXP} XP</span>
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
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress to next level</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
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
                        isEarned ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-400'
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
