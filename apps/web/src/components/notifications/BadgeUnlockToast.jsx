import React, { useState, useEffect } from 'react';
import { Trophy, X, Star, Flame, Clock, Dumbbell, Zap, Target, Flag, Brain, Snowflake, Sun } from 'lucide-react';

/**
 * Symbol to icon mapping
 */
const SYMBOL_TO_ICON = {
  flame: Flame,
  trophy: Trophy,
  star: Star,
  target: Target,
  clock: Clock,
  lightning: Zap,
  zap: Zap,
  flag: Flag,
  dumbbell: Dumbbell,
  brain: Brain,
  snowflake: Snowflake,
  sun: Sun,
};

/**
 * Tier colors
 */
const TIER_COLORS = {
  standard: { bg: '#64748b', glow: 'rgba(100, 116, 139, 0.4)' },
  bronze: { bg: '#CD7F32', glow: 'rgba(205, 127, 50, 0.4)' },
  silver: { bg: '#9CA3AF', glow: 'rgba(156, 163, 175, 0.4)' },
  gold: { bg: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)' },
  platinum: { bg: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.4)' },
};

/**
 * Individual badge unlock toast
 */
const BadgeToast = ({ badge, onClose, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const Icon = SYMBOL_TO_ICON[badge.symbol] || Trophy;
  const tierColor = TIER_COLORS[badge.tier] || TIER_COLORS.standard;

  useEffect(() => {
    // Stagger animation
    const showTimer = setTimeout(() => setIsVisible(true), index * 200);

    // Auto-hide after 5 seconds
    const hideTimer = setTimeout(() => {
      handleClose();
    }, 5000 + index * 200);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(badge.id), 300);
  };

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 40px ${tierColor.glow}`,
        border: `2px solid ${tierColor.bg}`,
        transform: isVisible && !isExiting ? 'translateX(0)' : 'translateX(120%)',
        opacity: isVisible && !isExiting ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        maxWidth: 360,
        cursor: 'pointer',
      }}
      onClick={handleClose}
    >
      {/* Badge icon */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: tierColor.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          animation: 'pulse 2s infinite',
        }}
      >
        <Icon size={28} color="#ffffff" />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: tierColor.bg,
            marginBottom: 4,
          }}
        >
          Badge Opptjent!
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {badge.name}
        </div>
        <div
          style={{
            fontSize: 13,
            color: '#94a3b8',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          +{badge.xp} XP
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: 'none',
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: '#94a3b8',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};

/**
 * Level up toast
 */
const LevelUpToast = ({ newLevel, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
    const hideTimer = setTimeout(() => handleClose(), 6000);
    return () => clearTimeout(hideTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 24,
        marginBottom: 12,
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 60px rgba(245, 158, 11, 0.5)',
        border: '2px solid #F59E0B',
        transform: isVisible && !isExiting ? 'translateX(0) scale(1)' : 'translateX(120%) scale(0.8)',
        opacity: isVisible && !isExiting ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        maxWidth: 360,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: '#F59E0B',
          marginBottom: 8,
        }}
      >
        Nivå Opp!
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {newLevel}
      </div>
      <div
        style={{
          fontSize: 14,
          color: '#94a3b8',
        }}
      >
        Fortsett den gode innsatsen!
      </div>
    </div>
  );
};

/**
 * Badge unlock toast container
 * Shows badge unlock notifications in the bottom-right corner
 */
export const BadgeUnlockToast = ({ badges = [], levelUp = null, onDismiss }) => {
  const [visibleBadges, setVisibleBadges] = useState(badges);
  const [showLevelUp, setShowLevelUp] = useState(!!levelUp);

  useEffect(() => {
    setVisibleBadges(badges);
  }, [badges]);

  useEffect(() => {
    setShowLevelUp(!!levelUp);
  }, [levelUp]);

  const handleBadgeClose = (badgeId) => {
    setVisibleBadges((prev) => prev.filter((b) => b.id !== badgeId));
    onDismiss?.('badge', badgeId);
  };

  const handleLevelUpClose = () => {
    setShowLevelUp(false);
    onDismiss?.('levelUp', levelUp);
  };

  if (visibleBadges.length === 0 && !showLevelUp) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      {/* CSS for pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>

      {/* Level up toast (shows first) */}
      {showLevelUp && (
        <LevelUpToast newLevel={levelUp} onClose={handleLevelUpClose} />
      )}

      {/* Badge toasts */}
      {visibleBadges.map((badge, index) => (
        <BadgeToast
          key={badge.id}
          badge={badge}
          index={index}
          onClose={handleBadgeClose}
        />
      ))}
    </div>
  );
};

export default BadgeUnlockToast;
