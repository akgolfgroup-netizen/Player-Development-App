import React from 'react';

/**
 * Button Primitive
 * Base button component with multiple variants and sizes
 */

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size variant */
  size?: ButtonSize;
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Icon on the left */
  leftIcon?: React.ReactNode;
  /** Icon on the right */
  rightIcon?: React.ReactNode;
  /** Button content */
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  style = {},
  ...props
}) => {
  const buttonStyle: React.CSSProperties = {
    ...styles.base,
    ...styles.variants[variant],
    ...styles.sizes[size],
    ...(fullWidth && styles.fullWidth),
    ...(disabled && styles.disabled),
    ...(loading && styles.loading),
    ...style,
  };

  return (
    <button
      style={buttonStyle}
      disabled={disabled || loading}
      className={`button-${variant} button-${size} ${className}`}
      {...props}
    >
      {loading && (
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
      )}
      {!loading && leftIcon && <span style={styles.icon}>{leftIcon}</span>}
      <span style={styles.content}>{children}</span>
      {!loading && rightIcon && <span style={styles.icon}>{rightIcon}</span>}
    </button>
  );
};

const styles: Record<string, React.CSSProperties | Record<string, React.CSSProperties>> = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
    fontFamily: 'var(--font-family)',
    fontWeight: 600,
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textDecoration: 'none',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    position: 'relative',
  } as React.CSSProperties,
  variants: {
    primary: {
      backgroundColor: 'var(--accent)',
      color: 'var(--text-on-accent)',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--accent)',
      border: '1px solid var(--border-accent)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--accent)',
      border: '1px solid var(--border-accent)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-primary)',
    },
    danger: {
      backgroundColor: 'var(--error)',
      color: 'var(--text-inverse)',
    },
  },
  sizes: {
    sm: {
      padding: 'var(--spacing-2) var(--spacing-3)',
      fontSize: 'var(--font-size-footnote)',
      minHeight: '36px',
    },
    md: {
      padding: 'var(--spacing-3) var(--spacing-4)',
      fontSize: 'var(--font-size-body)',
      minHeight: '44px',
    },
    lg: {
      padding: 'var(--spacing-4) var(--spacing-6)',
      fontSize: 'var(--font-size-headline)',
      minHeight: '52px',
    },
  },
  fullWidth: {
    width: '100%',
  } as React.CSSProperties,
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  } as React.CSSProperties,
  loading: {
    pointerEvents: 'none',
  } as React.CSSProperties,
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as React.CSSProperties,
  content: {
    flex: 1,
  } as React.CSSProperties,
  spinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
  spinnerSvg: {
    animation: 'spin 0.8s linear infinite',
  } as React.CSSProperties,
};

export default Button;
