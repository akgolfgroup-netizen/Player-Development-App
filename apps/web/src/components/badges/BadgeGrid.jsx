import React, { useState, useMemo } from 'react';
import {
  Award,
  Clock,
  Flame,
  Dumbbell,
  Zap,
  Target,
  Flag,
  Trophy,
  Star,
  Check,
  Sunrise,
  Moon,
  Snowflake,
  Sun,
  BookOpen,
  Medal,
  Brain,
} from 'lucide-react';

/**
 * Badge symbol to icon mapping
 * Matches BadgeSymbol enum from backend types.ts
 */
const SYMBOL_TO_ICON = {
  flame: Flame,
  trophy: Trophy,
  star: Star,
  target: Target,
  clock: Clock,
  check: Check,
  lightning: Zap,
  zap: Zap,
  flag: Flag,
  medal: Medal,
  dumbbell: Dumbbell,
  brain: Brain,
  sunrise: Sunrise,
  moon: Moon,
  snowflake: Snowflake,
  sun: Sun,
  book: BookOpen,
  award: Award,
};

/**
 * Default icon for each category (fallback when symbol not specified)
 */
const CATEGORY_DEFAULT_ICONS = {
  volume: Clock,
  streak: Flame,
  strength: Dumbbell,
  speed: Zap,
  accuracy: Target,
  putting: Flag,
  short_game: Flag,
  mental: Brain,
  phase: BookOpen,
  milestone: Trophy,
  seasonal: Sun,
};

/**
 * Tier colors - matches backend BadgeTier enum
 */
const TIER_COLORS = {
  standard: { bg: '#64748b', text: '#FFFFFF', border: '#475569' },
  bronze: { bg: '#CD7F32', text: '#FFFFFF', border: '#b86f2c' },
  silver: { bg: '#9CA3AF', text: '#FFFFFF', border: '#6B7280' },
  gold: { bg: '#F59E0B', text: '#FFFFFF', border: '#D97706' },
  platinum: { bg: '#8B5CF6', text: '#FFFFFF', border: '#7C3AED' },
};

/**
 * Category labels in Norwegian - matches BadgeCategory enum from backend
 */
const CATEGORY_LABELS = {
  volume: 'Volum',
  streak: 'Streak',
  strength: 'Styrke',
  speed: 'Hastighet',
  accuracy: 'Presisjon',
  putting: 'Putting',
  short_game: 'Kortspill',
  mental: 'Mental',
  phase: 'Periodisering',
  milestone: 'Milepæler',
  seasonal: 'Sesong',
};

/**
 * Category display order
 */
const CATEGORY_ORDER = [
  'volume',
  'streak',
  'strength',
  'speed',
  'accuracy',
  'putting',
  'short_game',
  'mental',
  'phase',
  'milestone',
  'seasonal',
];

/**
 * Get icon component for a badge
 */
const getIconForBadge = (badge) => {
  // First try to get icon from symbol
  if (badge.symbol && SYMBOL_TO_ICON[badge.symbol]) {
    return SYMBOL_TO_ICON[badge.symbol];
  }
  // Fall back to category default
  if (badge.category && CATEGORY_DEFAULT_ICONS[badge.category]) {
    return CATEGORY_DEFAULT_ICONS[badge.category];
  }
  // Ultimate fallback
  return Award;
};

/**
 * Individual badge card component
 */
const BadgeCard = ({ badge, isUnlocked, progress, onClick }) => {
  const Icon = getIconForBadge(badge);
  const tierColor = TIER_COLORS[badge.tier] || TIER_COLORS.standard;

  // Get first requirement description for display
  const requirement = badge.requirements?.[0]?.description || badge.description || '';

  return (
    <div
      onClick={() => onClick?.({ ...badge, isUnlocked, progress })}
      style={{
        backgroundColor: isUnlocked ? tierColor.bg : '#ffffff',
        cursor: 'pointer',
        borderRadius: 12,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: isUnlocked ? `1px solid ${tierColor.border}` : '1px solid #e2e8f0',
        boxShadow: isUnlocked ? '0 4px 12px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
        opacity: badge.isAvailable === false ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = isUnlocked
          ? '0 4px 12px rgba(0,0,0,0.1)'
          : '0 1px 3px rgba(0,0,0,0.05)';
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          backgroundColor: isUnlocked ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon
          size={26}
          style={{
            color: isUnlocked ? '#ffffff' : '#94a3b8',
            opacity: isUnlocked ? 1 : 0.5,
          }}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: isUnlocked ? '#ffffff' : '#1e293b',
            marginBottom: 4,
          }}
        >
          {badge.name}
        </div>
        <div
          style={{
            fontSize: 12,
            color: isUnlocked ? 'rgba(255,255,255,0.85)' : '#64748b',
            lineHeight: 1.4,
          }}
        >
          {requirement}
        </div>
      </div>

      {/* Progress bar for locked badges */}
      {!isUnlocked && progress && progress.current > 0 && (
        <div style={{ width: '100%', marginTop: 4 }}>
          <div
            style={{
              height: 4,
              backgroundColor: '#e2e8f0',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                backgroundColor: '#0ea5e9',
                width: `${Math.min(100, (progress.current / (progress.target || 1)) * 100)}%`,
                borderRadius: 2,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <div
            style={{
              fontSize: 10,
              color: '#64748b',
              textAlign: 'center',
              marginTop: 4,
            }}
          >
            {progress.current} / {progress.target}
          </div>
        </div>
      )}

      {/* Tier badge for unlocked */}
      {isUnlocked && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.9)',
            backgroundColor: 'rgba(0,0,0,0.15)',
            padding: '4px 12px',
            borderRadius: 12,
          }}
        >
          {badge.tier}
        </div>
      )}

      {/* XP indicator */}
      {badge.xp && (
        <div
          style={{
            fontSize: 10,
            color: isUnlocked ? 'rgba(255,255,255,0.7)' : '#94a3b8',
            fontWeight: 500,
          }}
        >
          +{badge.xp} XP
        </div>
      )}

      {/* Seasonal/Limited indicator */}
      {badge.isLimited && (
        <div
          style={{
            fontSize: 9,
            color: isUnlocked ? 'rgba(255,255,255,0.7)' : '#f59e0b',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Tidsbegrenset
        </div>
      )}
    </div>
  );
};

/**
 * BadgeGrid component
 *
 * @param {Object} props
 * @param {Array} props.badges - Badge definitions from API
 * @param {Object} props.userStats - User's badge progress { unlockedBadges: [], badgeProgress: {} }
 * @param {string} props.groupBy - Group badges by 'category' or 'tier'
 * @param {boolean} props.showFilters - Show category filter buttons
 * @param {Function} props.onBadgeClick - Callback when badge is clicked
 * @param {boolean} props.hideUnavailable - Hide badges that can't be achieved with current data
 */
export const BadgeGrid = ({
  badges = [],
  userStats = { unlockedBadges: [], badgeProgress: {} },
  groupBy = 'category',
  showFilters = true,
  onBadgeClick,
  hideUnavailable = false,
}) => {
  const [filter, setFilter] = useState('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  // Get unique categories from badges
  const categories = useMemo(() => {
    const cats = new Set();
    badges.forEach((badge) => cats.add(badge.category));
    // Sort by predefined order
    return CATEGORY_ORDER.filter((cat) => cats.has(cat));
  }, [badges]);

  // Filter badges
  const filteredBadges = useMemo(() => {
    return badges.filter((badge) => {
      // Filter by category
      if (filter !== 'all' && badge.category !== filter) return false;

      // Filter by unlocked status
      if (showUnlockedOnly && !userStats.unlockedBadges.includes(badge.id)) return false;

      // Filter unavailable badges
      if (hideUnavailable && badge.isAvailable === false) return false;

      return true;
    });
  }, [badges, filter, showUnlockedOnly, userStats.unlockedBadges, hideUnavailable]);

  // Group badges
  const groupedBadges = useMemo(() => {
    if (groupBy === 'category') {
      const groups = {};
      // Initialize groups in order
      CATEGORY_ORDER.forEach((cat) => {
        groups[cat] = [];
      });
      // Populate groups
      filteredBadges.forEach((badge) => {
        if (!groups[badge.category]) groups[badge.category] = [];
        groups[badge.category].push(badge);
      });
      // Remove empty groups
      Object.keys(groups).forEach((key) => {
        if (groups[key].length === 0) delete groups[key];
      });
      return groups;
    }
    if (groupBy === 'tier') {
      const tierOrder = ['standard', 'bronze', 'silver', 'gold', 'platinum'];
      const groups = {};
      tierOrder.forEach((tier) => {
        groups[tier] = [];
      });
      filteredBadges.forEach((badge) => {
        if (!groups[badge.tier]) groups[badge.tier] = [];
        groups[badge.tier].push(badge);
      });
      Object.keys(groups).forEach((key) => {
        if (groups[key].length === 0) delete groups[key];
      });
      return groups;
    }
    return { all: filteredBadges };
  }, [filteredBadges, groupBy]);

  // Tier labels for groupBy='tier'
  const tierLabels = {
    standard: 'Standard',
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum',
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Filters */}
      {showFilters && (
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 24,
            flexWrap: 'wrap',
            paddingBottom: 20,
            borderBottom: '1px solid #e2e8f0',
            alignItems: 'center',
          }}
        >
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: filter === 'all' ? 'none' : '1px solid #e2e8f0',
              backgroundColor: filter === 'all' ? '#0ea5e9' : '#ffffff',
              color: filter === 'all' ? 'white' : '#64748b',
              fontWeight: 500,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Alle ({badges.length})
          </button>
          {categories.map((cat) => {
            const count = badges.filter((b) => b.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: filter === cat ? 'none' : '1px solid #e2e8f0',
                  backgroundColor: filter === cat ? '#0ea5e9' : '#ffffff',
                  color: filter === cat ? 'white' : '#64748b',
                  fontWeight: 500,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {CATEGORY_LABELS[cat] || cat} ({count})
              </button>
            );
          })}

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginLeft: 'auto',
              cursor: 'pointer',
              fontSize: 13,
              color: '#64748b',
            }}
          >
            <input
              type="checkbox"
              checked={showUnlockedOnly}
              onChange={(e) => setShowUnlockedOnly(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            <span>Kun opptjent</span>
          </label>
        </div>
      )}

      {/* Badge groups */}
      {Object.entries(groupedBadges).map(([groupKey, groupBadges]) => (
        <div key={groupKey} style={{ marginBottom: 32 }}>
          {groupBy !== 'none' && (
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 16,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {groupBy === 'category' && CATEGORY_LABELS[groupKey]}
              {groupBy === 'tier' && tierLabels[groupKey]}
              {groupBy === 'none' && 'Alle badges'}
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: '#94a3b8',
                }}
              >
                ({groupBadges.length})
              </span>
            </h3>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 16,
            }}
          >
            {groupBadges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isUnlocked={userStats.unlockedBadges.includes(badge.id)}
                progress={userStats.badgeProgress[badge.id]}
                onClick={onBadgeClick}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {filteredBadges.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: 48,
            color: '#64748b',
          }}
        >
          Ingen badges funnet med valgte filter
        </div>
      )}
    </div>
  );
};

export default BadgeGrid;
