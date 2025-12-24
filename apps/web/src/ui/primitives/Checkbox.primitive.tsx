import React from 'react';

/**
 * Checkbox Primitive
 * Checkbox input with custom styling
 */

type CheckboxSize = 'sm' | 'md' | 'lg';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Checkbox label */
  label?: string;
  /** Size variant */
  size?: CheckboxSize;
  /** Indeterminate state */
  indeterminate?: boolean;
  /** Error state */
  error?: boolean;
  /** Helper text */
  helperText?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  size = 'md',
  indeterminate = false,
  error = false,
  helperText,
  className = '',
  disabled,
  ...props
}, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  // Combine refs
  React.useImperativeHandle(ref, () => inputRef.current!);

  const checkboxId = props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  const sizeConfig = sizeConfigs[size];

  const checkboxStyle: React.CSSProperties = {
    ...styles.checkbox,
    width: sizeConfig.size,
    height: sizeConfig.size,
    ...(error && styles.error),
    ...(disabled && styles.disabled),
  };

  const iconSize = parseInt(sizeConfig.size) - 8;

  return (
    <div style={styles.container}>
      <div style={styles.checkboxWrapper}>
        <input
          ref={inputRef}
          id={checkboxId}
          type="checkbox"
          style={styles.input}
          disabled={disabled}
          className={className}
          {...props}
        />
        <label htmlFor={checkboxId} style={styles.customCheckbox}>
          <span style={checkboxStyle}>
            {(props.checked || indeterminate) && (
              <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {indeterminate ? (
                  <line x1="3" y1="8" x2="13" y2="8" />
                ) : (
                  <polyline points="3 8 7 12 13 4" />
                )}
              </svg>
            )}
          </span>
          {label && (
            <span
              style={{
                ...styles.label,
                fontSize: size === 'sm' ? 'var(--font-size-footnote)' : 'var(--font-size-body)',
              }}
            >
              {label}
            </span>
          )}
        </label>
      </div>

      {helperText && (
        <div
          style={{
            ...styles.helperText,
            ...(error && styles.errorText),
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

const sizeConfigs = {
  sm: { size: '16px' },
  md: { size: '20px' },
  lg: { size: '24px' },
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1)',
  },
  checkboxWrapper: {
    display: 'inline-flex',
  },
  input: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
  },
  customCheckbox: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    cursor: 'pointer',
    userSelect: 'none',
  },
  checkbox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    border: '2px solid var(--border-default)',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--background-white)',
    color: 'var(--text-inverse)',
    transition: 'all 0.15s ease',
  },
  label: {
    fontFamily: 'var(--font-family)',
    color: 'var(--text-primary)',
  },
  error: {
    borderColor: 'var(--ak-error)',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  helperText: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
    marginLeft: 'var(--spacing-6)',
  },
  errorText: {
    color: 'var(--ak-error)',
  },
};

// Add checked state styles via CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  input[type="checkbox"]:checked + label span:first-child {
    background-color: var(--ak-primary);
    border-color: var(--ak-primary);
  }
  input[type="checkbox"]:indeterminate + label span:first-child {
    background-color: var(--ak-primary);
    border-color: var(--ak-primary);
  }
  input[type="checkbox"]:focus-visible + label span:first-child {
    outline: 2px solid var(--ak-primary);
    outline-offset: 2px;
  }
`;
if (typeof document !== 'undefined' && !document.querySelector('#checkbox-styles')) {
  styleSheet.id = 'checkbox-styles';
  document.head.appendChild(styleSheet);
}

export default Checkbox;
