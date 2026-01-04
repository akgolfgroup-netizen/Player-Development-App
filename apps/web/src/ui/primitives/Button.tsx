/**
 * AK Golf Academy - Button Component
 * Premium Light System: Stone × Midnight Blue × Emerald × Soft Gold
 *
 * Rules:
 * - Primary action = ak.action (blue)
 * - Progress (emerald) is NOT allowed for buttons
 * - Prestige (gold) only for premium/earned contexts
 */

import React from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "destructive" // alias for danger
  | "success"
  | "premium"
  | "outline"; // backwards compat alias for secondary

export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  /** @deprecated Use icon with iconPosition="left" instead */
  leftIcon?: React.ReactNode;
  /** @deprecated Use icon with iconPosition="right" instead */
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[13px] leading-[18px] rounded-lg",
  md: "px-6 py-3 text-[15px] leading-[20px] rounded-xl",
  lg: "px-8 py-4 text-[17px] leading-[22px] rounded-xl",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-ak-action-primary hover:bg-ak-action-hover active:bg-ak-action-active text-white",
  secondary:
    "bg-transparent border-2 border-ak-action-active text-ak-action-active hover:bg-ak-action-active/10",
  outline:
    "bg-transparent border-2 border-ak-action-active text-ak-action-active hover:bg-ak-action-active/10", // alias for secondary
  ghost:
    "bg-transparent text-ak-text-body hover:bg-ak-surface-card active:bg-ak-surface-border",
  danger:
    "bg-ak-status-error hover:opacity-90 active:opacity-95 text-white",
  destructive:
    "bg-ak-status-error hover:opacity-90 active:opacity-95 text-white", // alias for danger
  // Keep success for confirmations, NOT as a primary CTA color.
  success:
    "bg-ak-status-success hover:opacity-90 active:opacity-95 text-white",
  premium:
    "bg-ak-prestige hover:opacity-90 active:opacity-95 text-ak-text-primary",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = "left",
  leftIcon,
  rightIcon,
  children,
  disabled,
  className,
  ...props
}) => {
  const isDisabled = Boolean(disabled || loading);
  // Backwards compat: leftIcon/rightIcon take precedence
  const resolvedLeftIcon = leftIcon ?? (iconPosition === "left" ? icon : undefined);
  const resolvedRightIcon = rightIcon ?? (iconPosition === "right" ? icon : undefined);

  const classes = [
    "inline-flex items-center justify-center gap-2 font-semibold select-none",
    "transition-all duration-200",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ak-action-active/30 focus-visible:ring-offset-2 focus-visible:ring-offset-ak-surface-base",
    sizeClasses[size],
    variantClasses[variant],
    fullWidth ? "w-full" : "",
    isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={isDisabled} {...props}>
      {loading ? (
        <span className="opacity-80">Laster...</span>
      ) : (
        <>
          {resolvedLeftIcon}
          {children}
          {resolvedRightIcon}
        </>
      )}
    </button>
  );
};

export default Button;
