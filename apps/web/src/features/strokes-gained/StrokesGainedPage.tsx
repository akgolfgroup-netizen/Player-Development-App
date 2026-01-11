/**
 * Strokes Gained Page
 * Main page with full dashboard, history, and comparison views
 */

import React, { useState } from 'react';
import { TrendingUp, History, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import StrokesGainedDashboardPro from './StrokesGainedDashboardPro';
import StrokesGainedHistory from './StrokesGainedHistory';
import StrokesGainedComparison from './StrokesGainedComparison';
import { PageTitle, SubSectionTitle, CardTitle } from '../../components/typography';

type TabType = 'overview' | 'history' | 'comparison';

const TABS = [
  { id: 'overview' as TabType, label: 'Oversikt', icon: TrendingUp },
  { id: 'history' as TabType, label: 'Historikk', icon: History },
  { id: 'comparison' as TabType, label: 'Sammenligning', icon: BarChart3 },
];

const StrokesGainedPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { user } = useAuth();

  const playerId = user?.playerId || user?.id;

  if (!playerId) {
    return (
      <div className="min-h-screen bg-tier-surface-base p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl p-8 text-center">
          <p className="text-tier-error">Ingen bruker funnet. Vennligst logg inn.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tier-surface-base p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <PageTitle style={{ marginBottom: 0 }}>Strokes Gained Analytics</PageTitle>
          <p className="text-tier-text-secondary">
            Avansert statistikkanalyse av din spillprestasjon
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-tier-border-default mb-6 p-2 flex gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-tier-navy text-white'
                    : 'text-tier-navy hover:bg-tier-surface-base'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <StrokesGainedDashboardPro playerId={playerId} />
          )}
          {activeTab === 'history' && (
            <StrokesGainedHistory playerId={playerId} />
          )}
          {activeTab === 'comparison' && (
            <StrokesGainedComparison playerId={playerId} />
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-8 p-6 bg-white rounded-xl border border-tier-border-default">
          <SubSectionTitle style={{ marginBottom: '0.75rem' }}>💡 Om Strokes Gained</SubSectionTitle>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-tier-text-secondary">
            <div>
              <CardTitle style={{ marginBottom: '0.5rem' }}>Hva er Strokes Gained?</CardTitle>
              <p>
                Strokes Gained er en avansert statistikk som måler hvor mange slag du vinner eller taper
                i forhold til et benchmark (f.eks. tour-gjennomsnitt eller dine konkurrenter).
              </p>
            </div>
            <div>
              <CardTitle style={{ marginBottom: '0.5rem' }}>Hvordan tolke tallene?</CardTitle>
              <p>
                Positive tall (+0.5) betyr du er bedre enn benchmark.
                Negative tall (-0.3) indikerer forbedringsområder.
                Jo høyere positivt tall, jo bedre prestasjon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrokesGainedPage;
