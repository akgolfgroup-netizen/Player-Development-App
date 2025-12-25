import React from 'react';

/**
 * Button
 * Primary button primitive with variants and sizes
 * Uses design system tokens for colors and typography
 */

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size variant */
  size?: ButtonSize;
  /** Loading state - shows spinner */
  isLoading?: boolean;
  /** Icon on the left side */
  leftIcon?: React.ReactNode;
  /** Icon on the right side */
  rightIcon?: React.ReactNode;
  /** Button content */
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  style = {},
  ...props
}, ref) => {
  const isDisabled = disabled || isLoading;

  const buttonStyle: React.CSSProperties = {
    ...styles.base,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(isDisabled && styles.disabled),
    ...style,
  };

  return (
    <button
      ref={ref}
      style={buttonStyle}
      disabled={isDisabled}
      className={className}
      {...props}
    >
      {isLoading ? (
        <span style={styles.spinner}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={styles.spinnerSvg}
          >
            <circle
              cx="8"
              cy="8"
              r="6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="9.42 31.42"
            />
          </svg>
        </span>
      ) : (
        <>
          {leftIcon && <span style={styles.icon}>{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span style={styles.icon}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

const styles: Record<string, React.CSSProperties> = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
    fontFamily: 'inherit',
    fontWeight: 600,
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  spinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerSvg: {
    animation: 'spin 0.8s linear infinite',
  },
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-primary-foreground)',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  secondary: {
    backgroundColor: 'var(--color-surface-2)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--color-text)',
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    padding: 'var(--spacing-2) var(--spacing-3)',
    fontSize: 'var(--font-size-footnote)',
    minHeight: '36px',
  },
  md: {
    padding: 'var(--spacing-2) var(--spacing-4)',
    fontSize: 'var(--font-size-body)',
    minHeight: '44px',
  },
  lg: {
    padding: 'var(--spacing-3) var(--spacing-6)',
    fontSize: 'var(--font-size-headline)',
    minHeight: '52px',
  },
};

export default Button;
