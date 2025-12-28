import React from 'react';

/**
 * Input
 * Text input primitive with label, hint, and error states
 *
 * UI Canon v1.2 (Apple/Stripe):
 * - Heights: sm (36px), md (44px) - matches Button
 * - Focus ring: token-based, subtle
 * - Hover: border highlight
 * - Placeholder: muted text
 */

type InputSize = 'sm' | 'md';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input label */
  label?: string;
  /** Hint text below input */
  hint?: string;
  /** Error message (also sets error styling) */
  error?: string;
  /** Icon on the left side */
  leadingIcon?: React.ReactNode;
  /** Icon on the right side */
  trailingIcon?: React.ReactNode;
  /** Size variant */
  size?: InputSize;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  hint,
  error,
  leadingIcon,
  trailingIcon,
  size = 'md',
  className = '',
  style = {},
  disabled,
  id,
  ...props
}, ref) => {
  const generatedId = React.useId();
  const inputId = id || `input-${generatedId}`;
  const hasError = Boolean(error);

  const inputStyle: React.CSSProperties = {
    ...styles.input,
    ...sizeStyles[size],
    ...(hasError && styles.inputError),
    ...(disabled && styles.inputDisabled),
    ...(leadingIcon && styles.inputWithLeadingIcon),
    ...(trailingIcon && styles.inputWithTrailingIcon),
    ...style,
  };

  // Add interactive class for hover effects
  const inputClasses = 'input-interactive';

  return (
    <div style={styles.wrapper} className={className}>
      {label && (
        <label htmlFor={inputId} style={styles.label}>
          {label}
        </label>
      )}

      <div style={styles.inputContainer}>
        {leadingIcon && (
          <span style={styles.leadingIcon}>{leadingIcon}</span>
        )}

        <input
          ref={ref}
          id={inputId}
          style={inputStyle}
          className={inputClasses}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${inputId}-error` :
            hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />

        {trailingIcon && (
          <span style={styles.trailingIcon}>{trailingIcon}</span>
        )}
      </div>

      {hasError && (
        <span id={`${inputId}-error`} style={styles.error}>
          {error}
        </span>
      )}

      {!hasError && hint && (
        <span id={`${inputId}-hint`} style={styles.hint}>
          {hint}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1)',
    width: '100%',
  },
  label: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--color-text)',
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    fontFamily: 'inherit',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    // Transitions handled by .input-interactive class
  },
};

const sizeStyles: Record<InputSize, React.CSSProperties> = {
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
};

// Additional styles merged with main styles
Object.assign(styles, {
  inputError: {
    borderColor: 'var(--color-danger)',
  },
  inputDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    backgroundColor: 'var(--color-surface-2)',
  },
  inputWithLeadingIcon: {
    paddingLeft: 'var(--spacing-10)',
  },
  inputWithTrailingIcon: {
    paddingRight: 'var(--spacing-10)',
  },
  leadingIcon: {
    position: 'absolute',
    left: 'var(--spacing-3)',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--color-text-muted)',
    pointerEvents: 'none',
  },
  trailingIcon: {
    position: 'absolute',
    right: 'var(--spacing-3)',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--color-text-muted)',
  },
  hint: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--color-text-muted)',
  },
  error: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--color-danger)',
  },
});

export default Input;
