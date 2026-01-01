import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import {
  ThemeMode,
  getInitialTheme,
  applyTheme,
  subscribeToSystemTheme,
} from '../../theme/theme';

/**
 * ThemeSwitcher
 * Compact theme toggle with Light / Dark / System modes
 * Uses lucide icons and design system tokens
 */

const ThemeSwitcher: React.FC = () => {
  const [mode, setMode] = useState<ThemeMode>(() => getInitialTheme());

  // Initialize theme on mount
  useEffect(() => {
    applyTheme(mode);
  }, []);

  // Subscribe to system preference changes
  useEffect(() => {
    const cleanup = subscribeToSystemTheme(() => {
      // Force re-render when system preference changes
      setMode(getInitialTheme());
    });
    return cleanup;
  }, []);

  const handleModeChange = (newMode: ThemeMode) => {
    setMode(newMode);
    applyTheme(newMode);
  };

  const modes: { value: ThemeMode; icon: React.ReactNode; label: string; ariaLabel: string }[] = [
    { value: 'light', icon: <Sun size={16} />, label: 'Lys', ariaLabel: 'Lys modus' },
    { value: 'dark', icon: <Moon size={16} />, label: 'Mørk', ariaLabel: 'Mørk modus' },
    { value: 'system', icon: <Monitor size={16} />, label: 'System', ariaLabel: 'Følg system' },
  ];

  return (
    <div style={styles.container} role="group" aria-label="Tema-velger">
      {modes.map(({ value, icon, label, ariaLabel }) => (
        <button
          key={value}
          onClick={() => handleModeChange(value)}
          style={{
            ...styles.button,
            ...(mode === value ? styles.buttonActive : {}),
          }}
          aria-label={ariaLabel}
          aria-pressed={mode === value}
          title={label}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    gap: '2px',
    padding: '2px',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    border: 'none',
    borderRadius: 'calc(var(--radius-md) - 2px)',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  buttonActive: {
    backgroundColor: 'var(--background-white)',
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-xs)',
  },
};

export default ThemeSwitcher;
