import React from 'react';

/**
 * Tabs Composite
 * Tabbed interface with keyboard navigation
 */

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: number | string;
}

interface TabsProps {
  /** Array of tabs */
  tabs: Tab[];
  /** Currently active tab ID */
  activeTab?: string;
  /** Default active tab ID (uncontrolled) */
  defaultActiveTab?: string;
  /** Change handler */
  onChange?: (tabId: string) => void;
  /** Variant style */
  variant?: 'default' | 'pills' | 'underline';
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Full width tabs */
  fullWidth?: boolean;
  /** Additional className */
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  defaultActiveTab,
  onChange,
  variant = 'default',
  orientation = 'horizontal',
  fullWidth = false,
  className = '',
}) => {
  const [internalActiveTab, setInternalActiveTab] = React.useState(
    defaultActiveTab || tabs[0]?.id || ''
  );

  const isControlled = activeTab !== undefined;
  const currentActiveTab = isControlled ? activeTab : internalActiveTab;

  const handleTabClick = (tabId: string, disabled?: boolean) => {
    if (disabled) return;

    if (!isControlled) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const enabledTabs = tabs.filter((tab) => !tab.disabled);
    const currentIndex = enabledTabs.findIndex((tab) => tab.id === currentActiveTab);

    let nextIndex = currentIndex;

    if (orientation === 'horizontal') {
      if (e.key === 'ArrowLeft') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : enabledTabs.length - 1;
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        nextIndex = currentIndex < enabledTabs.length - 1 ? currentIndex + 1 : 0;
        e.preventDefault();
      }
    } else {
      if (e.key === 'ArrowUp') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : enabledTabs.length - 1;
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        nextIndex = currentIndex < enabledTabs.length - 1 ? currentIndex + 1 : 0;
        e.preventDefault();
      }
    }

    if (nextIndex !== currentIndex) {
      handleTabClick(enabledTabs[nextIndex].id);
    }
  };

  const activeTabContent = tabs.find((tab) => tab.id === currentActiveTab)?.content;

  const containerStyle: React.CSSProperties = {
    ...styles.container,
    ...(orientation === 'vertical' && styles.containerVertical),
  };

  const tabListStyle: React.CSSProperties = {
    ...styles.tabList,
    ...styles.variants[variant],
    ...(orientation === 'vertical' && styles.tabListVertical),
    ...(fullWidth && styles.tabListFullWidth),
  };

  return (
    <div style={containerStyle} className={className}>
      {/* Tab List */}
      <div
        role="tablist"
        aria-orientation={orientation}
        style={tabListStyle}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === currentActiveTab;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              aria-disabled={tab.disabled}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleTabClick(tab.id, tab.disabled)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{
                ...styles.tab,
                ...styles.tabVariants[variant],
                ...(isActive && styles.tabActive),
                ...(isActive && styles.tabActiveVariants[variant]),
                ...(tab.disabled && styles.tabDisabled),
                ...(fullWidth && styles.tabFullWidth),
              }}
            >
              {tab.icon && <span style={styles.tabIcon}>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={styles.tabBadge}>{tab.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`tabpanel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== currentActiveTab}
          style={styles.tabPanel}
        >
          {tab.id === currentActiveTab && tab.content}
        </div>
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties | Record<string, React.CSSProperties>> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  } as React.CSSProperties,
  containerVertical: {
    flexDirection: 'row',
  } as React.CSSProperties,
  tabList: {
    display: 'flex',
    gap: 'var(--spacing-1)',
    borderBottom: '1px solid var(--border-subtle)',
  } as React.CSSProperties,
  tabListVertical: {
    flexDirection: 'column',
    borderBottom: 'none',
    borderRight: '1px solid var(--border-subtle)',
    minWidth: '200px',
  } as React.CSSProperties,
  tabListFullWidth: {
    width: '100%',
  } as React.CSSProperties,
  variants: {
    default: {},
    pills: {
      backgroundColor: 'var(--gray-100)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--spacing-1)',
      border: 'none',
    },
    underline: {
      gap: 'var(--spacing-4)',
    },
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-3) var(--spacing-4)',
    fontSize: 'var(--font-size-body)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    position: 'relative',
  } as React.CSSProperties,
  tabVariants: {
    default: {
      borderBottom: '2px solid transparent',
    },
    pills: {
      borderRadius: 'var(--radius-sm)',
    },
    underline: {
      borderBottom: '2px solid transparent',
    },
  },
  tabActive: {
    color: 'var(--ak-primary)',
    fontWeight: 600,
  } as React.CSSProperties,
  tabActiveVariants: {
    default: {
      borderBottomColor: 'var(--ak-primary)',
    },
    pills: {
      backgroundColor: 'var(--background-white)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    underline: {
      borderBottomColor: 'var(--ak-primary)',
    },
  },
  tabDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  } as React.CSSProperties,
  tabFullWidth: {
    flex: 1,
    justifyContent: 'center',
  } as React.CSSProperties,
  tabIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
  tabBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '20px',
    height: '20px',
    padding: '0 var(--spacing-1)',
    fontSize: 'var(--font-size-caption2)',
    fontWeight: 600,
    backgroundColor: 'var(--ak-primary)',
    color: 'var(--text-inverse)',
    borderRadius: 'var(--radius-full)',
  } as React.CSSProperties,
  tabPanel: {
    padding: 'var(--spacing-4) 0',
  } as React.CSSProperties,
};

export default Tabs;
