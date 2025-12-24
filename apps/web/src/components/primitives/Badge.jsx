/**
 * AK GOLF ACADEMY — DESIGN SYSTEM v3.0
 * Badge Primitive Component
 *
 * Uses design tokens via CSS variables. Do not hardcode colors or spacing.
 */

import React from 'react';

const variants = {
  default: {
    backgroundColor: 'var(--gray-100)',
    color: 'var(--text-primary)',
  },
  primary: {
    backgroundColor: 'var(--ak-primary)',
    color: 'var(--ak-white)',
  },
  success: {
    backgroundColor: 'var(--ak-success)',
    color: 'var(--ak-white)',
  },
  warning: {
    backgroundColor: 'var(--ak-warning)',
    color: 'var(--ak-ink)',
  },
  error: {
    backgroundColor: 'var(--ak-error)',
    color: 'var(--ak-white)',
  },
  gold: {
    backgroundColor: 'var(--ak-gold)',
    color: 'var(--ak-ink)',
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--ak-primary)',
    border: '1px solid var(--ak-primary)',
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
 * @param {'default'|'primary'|'success'|'warning'|'error'|'gold'|'outline'} props.variant - Badge style variant
 * @param {'sm'|'md'} props.size - Badge size
 * @param {React.ReactNode} props.children - Badge content
 */
export function Badge({
  variant = 'default',
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
