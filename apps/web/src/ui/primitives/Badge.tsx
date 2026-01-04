/**
 * AK Golf Academy - Badge/Tag Component
 * Premium Light System: Stone × Midnight Blue × Emerald × Soft Gold
 *
 * Rules:
 * - Default badges are neutral (stone)
 * - Prestige = gold only for achievement contexts
 * - Blue is allowed for "accent" labels (selection/category labeling), not for prestige
 */

import React from "react";

export type BadgeVariant =
  | "neutral"
  | "default" // alias for neutral
  | "accent"
  | "primary" // alias for accent
  | "success"
  | "warning"
  | "error"
  | "achievement";

export type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Makes the badge pill-shaped (more rounded) */
  pill?: boolean;
  /** Shows a small dot indicator */
  dot?: boolean;
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-1.5 py-[2px] text-[11px] leading-[13px] rounded-lg",
  md: "px-2.5 py-1 text-[13px] leading-[18px] rounded-lg",
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-ak-surface-border text-ak-text-body",
  default: "bg-ak-surface-border text-ak-text-body", // alias for neutral
  accent: "bg-ak-action-active/10 text-ak-action-active",
  primary: "bg-ak-action-active/10 text-ak-action-active", // alias for accent
  success: "bg-ak-status-success/10 text-ak-status-success",
  warning: "bg-ak-status-warning/10 text-ak-status-warning",
  error: "bg-ak-status-error/10 text-ak-status-error",
  achievement: "bg-ak-prestige/10 text-ak-prestige",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  size = "md",
  children,
  icon,
  className,
  style,
  pill = false,
  dot = false,
}) => {
  const classes = [
    "inline-flex items-center gap-1 whitespace-nowrap font-semibold",
    sizeClasses[size],
    variantClasses[variant],
    pill ? "rounded-full" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} style={style}>
      {dot ? <span className="w-1.5 h-1.5 rounded-full bg-current" /> : null}
      {icon ? <span className="inline-flex">{icon}</span> : null}
      {children}
    </span>
  );
};

// Level Badge - for competency levels
interface LevelBadgeProps {
  level: 1 | 2 | 3 | 4 | 5;
  size?: BadgeSize;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ level, size = "md" }) => {
  // Discipline: levels are mostly neutral; only the highest tiers become blue/gold.
  const config: Record<
    LevelBadgeProps["level"],
    { label: string; className: string }
  > = {
    1: { label: "L1", className: "bg-ak-surface-border text-ak-text-muted" },
    2: { label: "L2", className: "bg-ak-surface-border text-ak-text-body" },
    3: { label: "L3", className: "bg-ak-action-active/10 text-ak-action-active" },
    4: { label: "L4", className: "bg-ak-action-primary text-white" },
    5: { label: "L5", className: "bg-ak-prestige text-ak-text-primary" },
  };

  const c = config[level];

  return (
    <span
      className={[
        "inline-flex items-center font-semibold",
        sizeClasses[size],
        c.className,
      ].join(" ")}
    >
      {c.label}
    </span>
  );
};

// Category Badge - for session categories
interface CategoryBadgeProps {
  category: "teknikk" | "fysisk" | "mental" | "spill" | "test";
  size?: BadgeSize;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = "md",
}) => {
  // If you expose ak.category.* tokens, these will map cleanly.
  // If not, keep these as neutral until category tokens are added.
  const categoryConfig: Record<
    CategoryBadgeProps["category"],
    { icon: string; label: string; bg: string; text: string }
  > = {
    teknikk: {
      icon: "🏌️",
      label: "Teknikk",
      bg: "bg-ak-category-teknikk-muted",
      text: "text-ak-category-teknikk",
    },
    fysisk: {
      icon: "💪",
      label: "Fysisk",
      bg: "bg-ak-category-fysisk-muted",
      text: "text-ak-category-fysisk",
    },
    mental: {
      icon: "🧠",
      label: "Mental",
      bg: "bg-ak-category-mental-muted",
      text: "text-ak-category-mental",
    },
    spill: {
      icon: "⛳",
      label: "Spill",
      bg: "bg-ak-category-spill-muted",
      text: "text-ak-category-spill",
    },
    test: {
      icon: "📊",
      label: "Test",
      bg: "bg-ak-category-test-muted",
      text: "text-ak-category-test",
    },
  };

  const c = categoryConfig[category];

  return (
    <span
      className={[
        "inline-flex items-center gap-1 whitespace-nowrap font-semibold",
        sizeClasses[size],
        c.bg,
        c.text,
      ].join(" ")}
    >
      <span className="inline-flex">{c.icon}</span>
      {c.label}
    </span>
  );
};

export default Badge;
