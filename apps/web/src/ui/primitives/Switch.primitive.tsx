import React from 'react';

/**
 * Switch Primitive
 * Toggle switch for binary choices
 */

type SwitchSize = 'sm' | 'md' | 'lg';

interface SwitchProps {
  /** Checked state */
  checked?: boolean;
  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: SwitchSize;
  /** Label text */
  label?: string;
  /** Label position */
  labelPosition?: 'left' | 'right';
  /** Name attribute */
  name?: string;
  /** Additional className */
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  labelPosition = 'right',
  name,
  className = '',
}) => {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onChange?.(newChecked);
  };

  const switchId = `switch-${Math.random().toString(36).substr(2, 9)}`;
  const sizeConfig = sizeConfigs[size];

  const trackStyle: React.CSSProperties = {
    ...styles.track,
    width: sizeConfig.trackWidth,
    height: sizeConfig.trackHeight,
    backgroundColor: isChecked ? 'var(--accent)' : 'var(--border)',
    ...(disabled && styles.disabled),
  };

  const thumbStyle: React.CSSProperties = {
    ...styles.thumb,
    width: sizeConfig.thumbSize,
    height: sizeConfig.thumbSize,
    transform: isChecked
      ? `translateX(${sizeConfig.thumbTranslate})`
      : 'translateX(2px)',
  };

  const labelStyle: React.CSSProperties = {
    ...styles.label,
    fontSize: size === 'sm' ? 'var(--font-size-footnote)' : 'var(--font-size-body)',
  };

  return (
    <div
      style={{
        ...styles.container,
        flexDirection: labelPosition === 'left' ? 'row-reverse' : 'row',
      }}
      className={className}
    >
      <label htmlFor={switchId} style={styles.switchLabel}>
        <input
          id={switchId}
          name={name}
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          style={styles.input}
        />
        <span style={trackStyle}>
          <span style={thumbStyle} />
        </span>
      </label>

      {label && (
        <label htmlFor={switchId} style={labelStyle}>
          {label}
        </label>
      )}
    </div>
  );
};

const sizeConfigs = {
  sm: { trackWidth: '36px', trackHeight: '20px', thumbSize: '16px', thumbTranslate: '18px' },
  md: { trackWidth: '44px', trackHeight: '24px', thumbSize: '20px', thumbTranslate: '22px' },
  lg: { trackWidth: '52px', trackHeight: '28px', thumbSize: '24px', thumbTranslate: '26px' },
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  switchLabel: {
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
  },
  input: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
  },
  track: {
    position: 'relative',
    display: 'block',
    borderRadius: 'var(--radius-full)',
    transition: 'background-color 0.2s ease',
  },
  thumb: {
    position: 'absolute',
    top: '2px',
    left: '2px',
    backgroundColor: 'var(--background-white)',
    borderRadius: '50%',
    transition: 'transform 0.2s ease',
    boxShadow: 'var(--shadow-sm)',
  },
  label: {
    fontFamily: 'var(--font-family)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    userSelect: 'none',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

export default Switch;
