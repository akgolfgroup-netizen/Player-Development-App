import React from 'react';

/**
 * Input Primitive
 * Base text input component with variants and states
 */

type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'default' | 'filled' | 'flushed';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input size */
  size?: InputSize;
  /** Visual variant */
  variant?: InputVariant;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Helper text */
  helperText?: string;
  /** Input label */
  label?: string;
  /** Left addon (icon or text) */
  leftAddon?: React.ReactNode;
  /** Right addon (icon or text) */
  rightAddon?: React.ReactNode;
  /** Full width */
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  size = 'md',
  variant = 'default',
  error = false,
  errorMessage,
  helperText,
  label,
  leftAddon,
  rightAddon,
  fullWidth = false,
  className = '',
  style = {},
  disabled,
  ...props
}, ref) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const wrapperStyle: React.CSSProperties = {
    ...styles.wrapper,
    ...(fullWidth && styles.fullWidth),
  };

  const inputStyle: React.CSSProperties = {
    ...styles.input,
    ...styles.variants[variant],
    ...styles.sizes[size],
    ...(error && styles.error),
    ...(disabled && styles.disabled),
    ...(leftAddon && styles.inputWithLeftAddon),
    ...(rightAddon && styles.inputWithRightAddon),
    ...style,
  };

  return (
    <div style={wrapperStyle}>
      {label && (
        <label htmlFor={inputId} style={styles.label}>
          {label}
        </label>
      )}

      <div style={styles.inputContainer}>
        {leftAddon && (
          <div style={styles.leftAddon}>
            {leftAddon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          style={inputStyle}
          disabled={disabled}
          aria-invalid={error}
          aria-describedby={
            error && errorMessage ? `${inputId}-error` :
            helperText ? `${inputId}-helper` : undefined
          }
          className={className}
          {...props}
        />

        {rightAddon && (
          <div style={styles.rightAddon}>
            {rightAddon}
          </div>
        )}
      </div>

      {error && errorMessage && (
        <div id={`${inputId}-error`} style={styles.errorMessage}>
          {errorMessage}
        </div>
      )}

      {!error && helperText && (
        <div id={`${inputId}-helper`} style={styles.helperText}>
          {helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

const styles: Record<string, React.CSSProperties | Record<string, React.CSSProperties>> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1)',
  } as React.CSSProperties,
  fullWidth: {
    width: '100%',
  } as React.CSSProperties,
  label: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '2px',
  } as React.CSSProperties,
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  input: {
    fontFamily: 'var(--font-family)',
    width: '100%',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--background-white)',
    color: 'var(--text-primary)',
    transition: 'all 0.15s ease',
    outline: 'none',
  } as React.CSSProperties,
  variants: {
    default: {
      // Base styles already applied
    },
    filled: {
      backgroundColor: 'var(--bg-neutral-subtle)',
      border: '1px solid transparent',
    },
    flushed: {
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderBottom: '2px solid var(--border-default)',
      paddingLeft: 0,
      paddingRight: 0,
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
      padding: 'var(--spacing-4) var(--spacing-5)',
      fontSize: 'var(--font-size-headline)',
      minHeight: '52px',
    },
  },
  inputWithLeftAddon: {
    paddingLeft: 'var(--spacing-10)',
  } as React.CSSProperties,
  inputWithRightAddon: {
    paddingRight: 'var(--spacing-10)',
  } as React.CSSProperties,
  leftAddon: {
    position: 'absolute',
    left: 'var(--spacing-3)',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-secondary)',
    pointerEvents: 'none',
  } as React.CSSProperties,
  rightAddon: {
    position: 'absolute',
    right: 'var(--spacing-3)',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-secondary)',
  } as React.CSSProperties,
  error: {
    borderColor: 'var(--error)',
  } as React.CSSProperties,
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    backgroundColor: 'var(--bg-neutral-subtle)',
  } as React.CSSProperties,
  errorMessage: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--error)',
    marginTop: '2px',
  } as React.CSSProperties,
  helperText: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  } as React.CSSProperties,
};

export default Input;
