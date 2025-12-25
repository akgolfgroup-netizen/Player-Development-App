import React from 'react';

/**
 * Input
 * Text input primitive with label, hint, and error states
 * Uses design system tokens for colors and typography
 */

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
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  hint,
  error,
  leadingIcon,
  trailingIcon,
  className = '',
  style = {},
  disabled,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${React.useId()}`;
  const hasError = Boolean(error);

  const inputStyle: React.CSSProperties = {
    ...styles.input,
    ...(hasError && styles.inputError),
    ...(disabled && styles.inputDisabled),
    ...(leadingIcon && styles.inputWithLeadingIcon),
    ...(trailingIcon && styles.inputWithTrailingIcon),
    ...style,
  };

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
    padding: 'var(--spacing-3) var(--spacing-4)',
    fontSize: 'var(--font-size-body)',
    fontFamily: 'inherit',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    minHeight: '44px',
  },
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
};

export default Input;
