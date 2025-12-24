/**
 * AK Golf Academy - Badge/Tag Component
 * Design System v3.0 - Blue Palette 01
 */

import React from 'react';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'gold'
  | 'neutral';

export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

const baseStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  fontWeight: 600,
  borderRadius: '8px',
  whiteSpace: 'nowrap',
};

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: '#10456A',
    color: '#FFFFFF',
  },
  secondary: {
    backgroundColor: '#E8F1F5',
    color: '#10456A',
  },
  success: {
    backgroundColor: 'rgba(74, 124, 89, 0.15)',
    color: '#4A7C59',
  },
  warning: {
    backgroundColor: 'rgba(212, 168, 75, 0.15)',
    color: '#8B6914',
  },
  error: {
    backgroundColor: 'rgba(196, 91, 78, 0.15)',
    color: '#C45B4E',
  },
  gold: {
    backgroundColor: 'rgba(201, 162, 39, 0.15)',
    color: '#8B6914',
  },
  neutral: {
    backgroundColor: '#F2F2F7',
    color: '#8E8E93',
  },
};

const sizeStyles: Record<BadgeSize, React.CSSProperties> = {
  sm: {
    padding: '2px 6px',
    fontSize: '11px',
    lineHeight: '13px',
  },
  md: {
    padding: '4px 10px',
    fontSize: '13px',
    lineHeight: '18px',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  style,
}) => {
  const combinedStyles: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  return (
    <span style={combinedStyles}>
      {icon && icon}
      {children}
    </span>
  );
};

// Level Badge - for competency levels
interface LevelBadgeProps {
  level: 1 | 2 | 3 | 4 | 5;
  size?: BadgeSize;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ level, size = 'md' }) => {
  const levelConfig = {
    1: { bg: '#F2F2F7', color: '#8E8E93', label: 'L1' },
    2: { bg: '#E5E5EA', color: '#8E8E93', label: 'L2' },
    3: { bg: '#D4E1EB', color: '#10456A', label: 'L3' },
    4: { bg: '#2C5F7F', color: '#FFFFFF', label: 'L4' },
    5: { bg: '#10456A', color: '#FFFFFF', label: 'L5' },
  };

  const config = levelConfig[level];

  return (
    <Badge
      variant="neutral"
      size={size}
      style={{
        backgroundColor: config.bg,
        color: config.color,
      }}
    >
      {config.label}
    </Badge>
  );
};

// Category Badge - for session categories
interface CategoryBadgeProps {
  category: 'teknikk' | 'fysisk' | 'mental' | 'spill' | 'test';
  size?: BadgeSize;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'md' }) => {
  const categoryConfig = {
    teknikk: { icon: '🏌️', label: 'Teknikk', color: '#10456A' },
    fysisk: { icon: '💪', label: 'Fysisk', color: '#D97644' },
    mental: { icon: '🧠', label: 'Mental', color: '#8B6E9D' },
    spill: { icon: '⛳', label: 'Spill', color: '#4A7C59' },
    test: { icon: '📊', label: 'Test', color: '#C9A227' },
  };

  const config = categoryConfig[category];

  return (
    <Badge
      variant="secondary"
      size={size}
      icon={<span>{config.icon}</span>}
      style={{
        backgroundColor: `${config.color}15`,
        color: config.color,
      }}
    >
      {config.label}
    </Badge>
  );
};

export default Badge;
