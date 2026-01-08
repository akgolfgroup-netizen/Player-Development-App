import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Activity,
  Trophy
} from 'lucide-react';
import AppShellTemplate from '../../ui/templates/AppShellTemplate';
import StateCard from '../../ui/composites/StateCard';

// Lazy load the content components for better performance
// Note: coach-athlete-list uses Container pattern (handles its own data)
const CoachAthleteListContent = lazy(() => import('../coach-athlete-list/CoachAthleteListContainer'));
const CoachAthleteStatusContent = lazy(() => import('../coach-athlete-status/CoachAthleteStatus'));
const CoachAthleteTournamentsContent = lazy(() => import('../coach-athlete-tournaments/CoachAthleteTournaments'));

/**
 * CoachAthleteHub - Unified coach athlete management with tab navigation
 *
 * Tabs:
 * 1. Utøvere - List of all athletes
 * 2. Status - Health and training status dashboard
 * 3. Turneringer - Tournament participation overview
 */

type TabId = 'utovere' | 'status' | 'turneringer';

interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ElementType;
  description: string;
}

const TABS: TabConfig[] = [
  {
    id: 'utovere',
    label: 'Utøvere',
    icon: Users,
    description: 'Alle dine utøvere',
  },
  {
    id: 'status',
    label: 'Status',
    icon: Activity,
    description: 'Helse og trening',
  },
  {
    id: 'turneringer',
    label: 'Turneringer',
    icon: Trophy,
    description: 'Turneringsoversikt',
  },
];

const CoachAthleteHub: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get tab from URL or default to 'utovere'
  const tabFromUrl = searchParams.get('tab') as TabId | null;
  const [activeTab, setActiveTab] = useState<TabId>(
    tabFromUrl && TABS.some(t => t.id === tabFromUrl) ? tabFromUrl : 'utovere'
  );

  // Sync URL with active tab
  useEffect(() => {
    if (tabFromUrl !== activeTab) {
      setSearchParams({ tab: activeTab }, { replace: true });
    }
  }, [activeTab, tabFromUrl, setSearchParams]);

  // Handle URL changes (back/forward navigation)
  useEffect(() => {
    if (tabFromUrl && TABS.some(t => t.id === tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
  };

  const activeTabConfig = TABS.find(t => t.id === activeTab);

  const renderTabContent = () => {
    const fallback = (
      <StateCard
        variant="loading"
        title="Laster innhold..."
        description="Vennligst vent"
      />
    );

    switch (activeTab) {
      case 'utovere':
        return (
          <Suspense fallback={fallback}>
            <CoachAthleteListContent />
          </Suspense>
        );
      case 'status':
        return (
          <Suspense fallback={fallback}>
            <CoachAthleteStatusContent />
          </Suspense>
        );
      case 'turneringer':
        return (
          <Suspense fallback={fallback}>
            <CoachAthleteTournamentsContent />
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <AppShellTemplate
      title="Utøvere"
      subtitle={activeTabConfig?.description || 'Administrer dine utøvere'}
    >
      <div id="coach-athletes-export">
        {/* Tab Navigation */}
        <div style={styles.tabContainer}>
          <div style={styles.tabList} role="tablist" aria-label="Utøver-kategorier">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;

              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => handleTabChange(tab.id)}
                  style={{
                    ...styles.tab,
                    ...(isActive ? styles.tabActive : {}),
                  }}
                >
                  <Icon
                    size={18}
                    style={{
                      color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
                      transition: 'color 0.15s ease',
                    }}
                  />
                  <span style={styles.tabLabel}>{tab.label}</span>
                  {isActive && <div style={styles.tabIndicator} />}
                </button>
              );
            })}
          </div>

          {/* Mobile scroll hint */}
          <div style={styles.scrollHint} />
        </div>

        {/* Tab Content */}
        <div
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          style={styles.tabPanel}
        >
          {renderTabContent()}
        </div>
      </div>
    </AppShellTemplate>
  );
};

const styles: Record<string, React.CSSProperties> = {
  tabContainer: {
    position: 'relative',
    marginBottom: 'var(--spacing-4)',
  },
  tabList: {
    display: 'flex',
    gap: 'var(--spacing-1)',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    paddingBottom: 'var(--spacing-2)',
    borderBottom: '1px solid var(--border-subtle)',
    WebkitOverflowScrolling: 'touch',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-3) var(--spacing-4)',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    position: 'relative',
    whiteSpace: 'nowrap',
    color: 'var(--text-tertiary)',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
  },
  tabActive: {
    color: 'var(--text-primary)',
    fontWeight: 600,
    backgroundColor: 'var(--background-surface)',
  },
  tabLabel: {
    display: 'none',
  } as React.CSSProperties,
  tabIndicator: {
    position: 'absolute',
    bottom: '-1px',
    left: 'var(--spacing-4)',
    right: 'var(--spacing-4)',
    height: '2px',
    backgroundColor: 'var(--accent)',
    borderRadius: '1px 1px 0 0',
  },
  scrollHint: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 'var(--spacing-2)',
    width: '40px',
    background: 'linear-gradient(to right, transparent, var(--background-default))',
    pointerEvents: 'none',
  },
  tabPanel: {
    minHeight: '400px',
  },
};

// Add CSS for hiding scrollbar and responsive labels
if (typeof document !== 'undefined' && !document.getElementById('coach-athlete-hub-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'coach-athlete-hub-styles';
  styleSheet.textContent = `
    #coach-athletes-export [role="tablist"]::-webkit-scrollbar {
      display: none;
    }

    @media (min-width: 640px) {
      #coach-athletes-export [role="tablist"] button span {
        display: inline !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default CoachAthleteHub;
