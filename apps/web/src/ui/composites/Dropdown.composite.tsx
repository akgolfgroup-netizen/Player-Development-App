import React from 'react';

/**
 * Dropdown Composite
 * Dropdown menu with keyboard navigation and positioning
 */

interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  /** Trigger element */
  trigger: React.ReactNode;
  /** Menu items */
  items: DropdownItem[];
  /** Placement */
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  /** Close on item click */
  closeOnClick?: boolean;
  /** Additional className */
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  placement = 'bottom-right',
  closeOnClick = true,
  className = '',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on escape
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        setIsOpen(true);
        setFocusedIndex(0);
        e.preventDefault();
      }
      return;
    }

    const enabledItems = items.filter((item) => !item.disabled && !item.divider);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % enabledItems.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + enabledItems.length) % enabledItems.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        const focusedItem = enabledItems[focusedIndex];
        if (focusedItem && !focusedItem.disabled) {
          handleItemClick(focusedItem);
        }
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(enabledItems.length - 1);
        break;
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;

    item.onClick?.();

    if (closeOnClick) {
      setIsOpen(false);
    }
  };

  const menuStyle: React.CSSProperties = {
    ...styles.menu,
    ...styles.placements[placement],
    ...(isOpen && styles.menuOpen),
  };

  return (
    <div
      ref={dropdownRef}
      style={styles.container}
      className={className}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        tabIndex={0}
        style={styles.trigger}
      >
        {trigger}
      </div>

      {/* Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          style={menuStyle}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <div key={item.id} style={styles.divider} role="separator" />;
            }

            const isFocused = items.filter((i) => !i.disabled && !i.divider).indexOf(item) === focusedIndex;

            return (
              <button
                key={item.id}
                role="menuitem"
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                style={{
                  ...styles.item,
                  ...(isFocused && styles.itemFocused),
                  ...(item.disabled && styles.itemDisabled),
                  ...(item.danger && styles.itemDanger),
                }}
                onMouseEnter={() => setFocusedIndex(items.filter((i) => !i.disabled && !i.divider).indexOf(item))}
              >
                {item.icon && <span style={styles.itemIcon}>{item.icon}</span>}
                <span style={styles.itemLabel}>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties | Record<string, React.CSSProperties>> = {
  container: {
    position: 'relative',
    display: 'inline-block',
  } as React.CSSProperties,
  trigger: {
    cursor: 'pointer',
  } as React.CSSProperties,
  menu: {
    position: 'absolute',
    zIndex: 1000,
    minWidth: '200px',
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-md)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: 'var(--spacing-2)',
    marginTop: 'var(--spacing-2)',
    opacity: 0,
    transform: 'scale(0.95)',
    transition: 'opacity 0.15s ease, transform 0.15s ease',
    pointerEvents: 'none',
  } as React.CSSProperties,
  menuOpen: {
    opacity: 1,
    transform: 'scale(1)',
    pointerEvents: 'auto',
  } as React.CSSProperties,
  placements: {
    'bottom-left': { top: '100%', left: 0 },
    'bottom-right': { top: '100%', right: 0 },
    'top-left': { bottom: '100%', left: 0, marginTop: 0, marginBottom: 'var(--spacing-2)' },
    'top-right': { bottom: '100%', right: 0, marginTop: 0, marginBottom: 'var(--spacing-2)' },
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    width: '100%',
    padding: 'var(--spacing-2) var(--spacing-3)',
    fontSize: 'var(--font-size-body)',
    color: 'var(--text-primary)',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    textAlign: 'left',
  } as React.CSSProperties,
  itemFocused: {
    backgroundColor: 'var(--gray-100)',
  } as React.CSSProperties,
  itemDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  } as React.CSSProperties,
  itemDanger: {
    color: 'var(--ak-error)',
  } as React.CSSProperties,
  itemIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as React.CSSProperties,
  itemLabel: {
    flex: 1,
  } as React.CSSProperties,
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-subtle)',
    margin: 'var(--spacing-2) 0',
  } as React.CSSProperties,
};

export default Dropdown;
