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
import React, { useState, useMemo } from 'react';
import { BadgeGrid } from '../../components/badges';
import { SectionTitle, SubSectionTitle } from '../../components/typography';

/**
 * Category labels for display
 */
const CATEGORY_LABELS = {
  all: 'Alle',
  consistency: 'Konsistens',
  volume: 'Volum',
  improvement: 'Forbedring',
  milestone: 'Milepæler',
  special: 'Spesial',
  streak: 'Serie',
  strength: 'Styrke',
  speed: 'Hastighet',
  accuracy: 'Presisjon',
  putting: 'Putting',
  short_game: 'Kortspill',
  mental: 'Mental',
  phase: 'Periodisering',
  seasonal: 'Sesong',
};

export default function AchievementsDashboard({
  achievements = [],
  stats = null,
  badges = [],
  badgeProgress = { unlockedBadges: [], badgeProgress: {}, stats: {} },
}) {
  const [filter, setFilter] = useState('all');

  // Get unique categories from badges
  const categories = useMemo(() => {
    const cats = new Set(['all']);
    badges.forEach((badge) => {
      if (badge.category) cats.add(badge.category);
    });
    achievements.forEach((ach) => {
      if (ach.category) cats.add(ach.category);
    });
    return Array.from(cats);
  }, [badges, achievements]);

  return (
    <div className="space-y-6">
      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition-colors ${
              filter === cat
                ? 'bg-ak-primary text-white'
                : 'bg-ak-surface text-ak-ink hover:bg-ak-surface/80'
            }`}
          >
            {CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {/* Badge Grid */}
      {badges.length > 0 && (
        <BadgeGrid
          badges={filter === 'all' ? badges : badges.filter((b) => b.category === filter)}
          userStats={badgeProgress}
          groupBy="category"
          showFilters={false}
          hideUnavailable={false}
        />
      )}

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <div className="mt-8">
          <SectionTitle className="text-xl font-bold text-ak-ink mb-4">Nylige Prestasjoner</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.slice(0, 6).map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Achievement Card component
 */
function AchievementCard({ achievement }) {
  const { icon, name, description, unlockedAt, xp, category } = achievement;
  const isUnlocked = !!unlockedAt;

  return (
    <div
      className={`rounded-lg shadow p-5 transition-all ${
        isUnlocked
          ? 'bg-white border-2 border-ak-primary/20'
          : 'bg-ak-snow opacity-75'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`text-4xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
          {icon || '🏆'}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <SubSectionTitle className="text-lg font-bold text-ak-ink">{name}</SubSectionTitle>
              <p className="text-sm text-ak-steel">{description}</p>
            </div>
            {xp > 0 && (
              <span className="text-ak-gold font-bold">+{xp} XP</span>
            )}
          </div>

          {category && (
            <div className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-ak-mist text-ak-steel capitalize">
              {CATEGORY_LABELS[category] || category}
            </div>
          )}

          {isUnlocked && unlockedAt && (
            <div className="text-xs text-ak-steel mt-2">
              Opptjent {new Date(unlockedAt).toLocaleDateString('nb-NO')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
