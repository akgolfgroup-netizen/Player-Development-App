/**
 * AK GOLF ACADEMY — DESIGN SYSTEM v3.0
 * Badge Primitive Component
 *
 * Uses design tokens via CSS variables. Do not hardcode colors or spacing.
 */

import React from 'react';

const variants = {
  neutral: {
    backgroundColor: 'var(--bg-neutral-subtle)',
    color: 'var(--text-secondary)',
  },
  accent: {
    backgroundColor: 'var(--bg-accent-subtle)',
    color: 'var(--accent)',
  },
  success: {
    backgroundColor: 'var(--bg-success-subtle)',
    color: 'var(--success)',
  },
  warning: {
    backgroundColor: 'var(--bg-warning-subtle)',
    color: 'var(--warning)',
  },
  error: {
    backgroundColor: 'var(--bg-error-subtle)',
    color: 'var(--error)',
  },
  achievement: {
    backgroundColor: 'var(--bg-achievement-subtle)',
    color: 'var(--achievement)',
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--accent)',
    border: '1px solid var(--border-accent)',
  },
};

const sizes = {
  sm: {
    padding: 'var(--spacing-1) var(--spacing-2)',
    fontSize: 'var(--font-size-caption1)',
    lineHeight: 'var(--line-height-caption1)',
  },
  md: {
    padding: 'var(--spacing-1) var(--spacing-3)',
    fontSize: 'var(--font-size-footnote)',
    lineHeight: 'var(--line-height-footnote)',
  },
};

/**
 * Badge component with design system tokens
 *
 * @param {Object} props
 * @param {'neutral'|'accent'|'success'|'warning'|'error'|'achievement'|'outline'} props.variant - Badge style variant
 * @param {'sm'|'md'} props.size - Badge size
 * @param {React.ReactNode} props.children - Badge content
 */
export function Badge({
  variant = 'neutral',
  size = 'md',
  children,
  style,
  ...props
}) {
  const variantStyles = variants[variant] || variants.default;
  const sizeStyles = sizes[size] || sizes.md;

  const badgeStyles = {
    fontFamily: 'var(--font-family)',
    fontWeight: 500,
    borderRadius: 'var(--radius-full)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    border: 'none',
    ...variantStyles,
    ...sizeStyles,
    ...style,
  };

  return (
    <span style={badgeStyles} {...props}>
      {children}
    </span>
  );
}

export default Badge;
