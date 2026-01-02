import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Target,
  Trophy,
  TrendingUp,
  ClipboardList,
  Activity
} from 'lucide-react';
import AppShellTemplate from '../../ui/templates/AppShellTemplate';
import StateCard from '../../ui/composites/StateCard';
import { useScreenView } from '../../analytics/useScreenView';
import ExportButton from '../../components/ui/ExportButton';

// Lazy load the content components for better performance
const PlayerStatsContent = lazy(() => import('./PlayerStatsContent'));
const StrokesGainedContent = lazy(() => import('./StrokesGainedContent'));
const TestResultsContent = lazy(() => import('./TestResultsContent'));
const BenchmarkContent = lazy(() => import('./BenchmarkContent'));
const StatusProgressContent = lazy(() => import('./StatusProgressContent'));
const TrendsContent = lazy(() => import('./TrendsContent'));

/**
 * StatistikkHub - Unified statistics page with tab navigation
 *
 * Tabs:
 * 1. Oversikt - Main dashboard with SG summary
 * 2. Strokes Gained - Detailed SG analysis
 * 3. Benchmark - Compare with PGA & WAGR
 * 4. Testresultater - All test results
 * 5. Status & Mål - Progress tracking
 */

type TabId = 'oversikt' | 'strokes-gained' | 'benchmark' | 'trends' | 'testresultater' | 'status';

interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ElementType;
  description: string;
}

const TABS: TabConfig[] = [
  {
    id: 'oversikt',
    label: 'Oversikt',
    icon: BarChart3,
    description: 'Statistikk-sammendrag',
  },
  {
    id: 'strokes-gained',
    label: 'Strokes Gained',
    icon: Activity,
    description: 'Detaljert SG-analyse',
  },
  {
    id: 'benchmark',
    label: 'Benchmark',
    icon: Trophy,
    description: 'Sammenlign med elite',
  },
  {
    id: 'trends',
    label: 'Trender',
    icon: TrendingUp,
    description: 'Historisk utvikling',
  },
  {
    id: 'testresultater',
    label: 'Testresultater',
    icon: ClipboardList,
    description: 'Alle tester',
  },
  {
    id: 'status',
    label: 'Status & Mål',
    icon: Target,
    description: 'Din progresjon',
  },
];

const StatistikkHub: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get tab from URL or default to 'oversikt'
  const tabFromUrl = searchParams.get('tab') as TabId | null;
  const [activeTab, setActiveTab] = useState<TabId>(
    tabFromUrl && TABS.some(t => t.id === tabFromUrl) ? tabFromUrl : 'oversikt'
  );

  // Track screen view
  useScreenView(`Statistikk - ${TABS.find(t => t.id === activeTab)?.label || 'Oversikt'}`);

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
      case 'oversikt':
        return (
          <Suspense fallback={fallback}>
            <PlayerStatsContent />
          </Suspense>
        );
      case 'strokes-gained':
        return (
          <Suspense fallback={fallback}>
            <StrokesGainedContent />
          </Suspense>
        );
      case 'benchmark':
        return (
          <Suspense fallback={fallback}>
            <BenchmarkContent />
          </Suspense>
        );
      case 'trends':
        return (
          <Suspense fallback={fallback}>
            <TrendsContent />
          </Suspense>
        );
      case 'testresultater':
        return (
          <Suspense fallback={fallback}>
            <TestResultsContent />
          </Suspense>
        );
      case 'status':
        return (
          <Suspense fallback={fallback}>
            <StatusProgressContent />
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <AppShellTemplate
      title="Statistikk"
      subtitle={activeTabConfig?.description || 'Din spillstatistikk'}
      actions={
        // @ts-expect-error - ExportButton is JSX with default props
        <ExportButton
          targetId="statistikk-export"
          filename={`statistikk-${activeTab}-${new Date().toISOString().split('T')[0]}`}
          title={`Statistikk - ${activeTabConfig?.label || 'Oversikt'}`}
          variant="icon"
          size="sm"
        />
      }
    >
      <div id="statistikk-export">
        {/* Tab Navigation */}
        <div style={styles.tabContainer}>
          <div style={styles.tabList} role="tablist" aria-label="Statistikk-kategorier">
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
    // Hide label on mobile, show on tablet+
    display: 'none',
    '@media (min-width: 640px)': {
      display: 'inline',
    },
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
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  [role="tablist"]::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 640px) {
    [role="tablist"] button span {
      display: inline !important;
    }
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('statistikk-hub-styles')) {
  styleSheet.id = 'statistikk-hub-styles';
  document.head.appendChild(styleSheet);
}

export default StatistikkHub;
