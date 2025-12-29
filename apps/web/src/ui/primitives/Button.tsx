import React from 'react';

/**
 * Button Primitive
 * Primary button with variants and sizes
 *
 * UI Canon v1.2 (Apple/Stripe):
 * - Primary: solid color background for main actions
 * - Secondary: subtle background with border for secondary actions
 * - Ghost: transparent for tertiary actions
 * - Destructive: red background for dangerous actions
 * - Sizes: sm (36px), md (44px)
 * - Consistent radius: --radius-md
 * - Micro-interactions: hover brightness, active press, smooth transitions
 */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md';

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
  /** Full width button */
  fullWidth?: boolean;
  /** Button content */
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
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
    ...(fullWidth && styles.fullWidth),
    ...style,
  };

  // Build class list for micro-interactions
  const variantClass = variant === 'secondary' ? 'btn-secondary' :
                       variant === 'ghost' ? 'btn-ghost' :
                       variant === 'destructive' ? 'btn-destructive' :
                       variant === 'danger' ? 'btn-destructive' :
                       variant === 'outline' ? 'btn-secondary' : '';
  const buttonClasses = [
    'btn-interactive',
    variantClass,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      style={buttonStyle}
      disabled={isDisabled}
      className={buttonClasses}
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
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    // Transitions handled by .btn-interactive class
  },
  fullWidth: {
    width: '100%',
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
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--color-text)',
  },
  destructive: {
    backgroundColor: 'var(--color-danger)',
    color: 'var(--color-primary-foreground)',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  danger: {
    backgroundColor: 'var(--color-danger)',
    color: 'var(--color-primary-foreground)',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
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
};

export default Button;
