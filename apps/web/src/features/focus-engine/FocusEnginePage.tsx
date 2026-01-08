/**
 * Focus Engine Page
 * AI-powered training focus recommendations
 */

import React, { useState } from 'react';
import { Brain, RefreshCw, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFocusRecommendations, useUpdateFocusPriorities } from '../../hooks/useFocusEngine';
import FocusRecommendationCard from './components/FocusRecommendationCard';
import FocusAreaSelector from './components/FocusAreaSelector';
import { PageHeader } from '../../components/layout/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../ui/primitives/Button';

const FocusEnginePage: React.FC = () => {
  const { user } = useAuth();
  const playerId = user?.playerId || user?.id;
  const [showSelector, setShowSelector] = useState(false);

  const { recommendations, summary, loading, error, refetch } = useFocusRecommendations((playerId || '') as string);
  const { updatePriorities, loading: updating } = useUpdateFocusPriorities();

  if (!playerId) {
    return (
      <div className="min-h-screen bg-tier-surface-base p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-tier-error">Ingen bruker funnet. Vennligst logg inn.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleStartTraining = (recommendation: any) => {
    // Navigate to training for this focus area
    console.log('Start training for:', recommendation);
    // TODO: Implement navigation to training page/exercises
  };

  const handlePrioritiesChange = async (areas: any[]) => {
    try {
      await updatePriorities(playerId, areas);
      // Refetch recommendations after update
      await refetch();
    } catch (err) {
      console.error('Failed to update priorities:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-tier-surface-base p-6 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <p className="mt-4 text-tier-text-secondary">Analyserer treningsfokus...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-tier-surface-base p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-tier-border-default p-8 text-center">
            <div className="text-tier-error text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-tier-navy mb-2">
              Kunne ikke laste anbefalinger
            </h3>
            <p className="text-tier-text-secondary mb-4">{error}</p>
            <Button variant="primary" onClick={refetch}>
              Prøv igjen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tier-surface-base p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <PageHeader title="Treningsfokus" subtitle="" helpText="" actions={null} />
          <p className="text-tier-text-secondary mt-2">
            AI-baserte anbefalinger for hva du bør fokusere på i treningen
          </p>
        </div>

        {/* AI Summary Card */}
        {summary && (
          <div className="bg-gradient-to-r from-tier-navy to-tier-info text-white rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Brain size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">AI-analyse</h3>
                <p className="text-white/90 mb-4">{summary.analysis}</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-white/70 text-sm mb-1">Prioriterte områder</div>
                    <div className="text-2xl font-bold">{summary.totalFocusAreas || 0}</div>
                  </div>
                  <div>
                    <div className="text-white/70 text-sm mb-1">Høy prioritet</div>
                    <div className="text-2xl font-bold">{summary.highPriority || 0}</div>
                  </div>
                  <div>
                    <div className="text-white/70 text-sm mb-1">Sist oppdatert</div>
                    <div className="text-sm font-semibold">
                      {summary.lastUpdated
                        ? new Date(summary.lastUpdated).toLocaleDateString('nb-NO')
                        : 'I dag'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-tier-navy">Anbefalte fokusområder</h3>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Settings size={16} />}
              onClick={() => setShowSelector(!showSelector)}
            >
              Juster prioriteringer
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RefreshCw size={16} />}
              onClick={refetch}
              loading={loading}
            >
              Oppdater
            </Button>
          </div>
        </div>

        {/* Priority Selector (collapsible) */}
        {showSelector && recommendations.length > 0 && (
          <div className="mb-6">
            <FocusAreaSelector
              focusAreas={recommendations.map((rec: any, index: number) => ({
                id: rec.id,
                name: rec.focusArea,
                category: rec.category,
                currentPriority: recommendations.length - index,
              }))}
              onPrioritiesChange={handlePrioritiesChange}
            />
          </div>
        )}

        {/* Recommendations Grid */}
        {recommendations.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {recommendations.map((rec: any) => (
              <FocusRecommendationCard
                key={rec.id}
                recommendation={rec}
                onStartTraining={handleStartTraining}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-tier-border-default p-12 text-center">
            <div className="text-tier-text-secondary text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-tier-navy mb-2">
              Ingen anbefalinger tilgjengelig
            </h3>
            <p className="text-tier-text-secondary mb-4">
              Gjennomfør flere tester for at AI-motoren skal kunne gi deg personlige anbefalinger.
            </p>
            <Button variant="primary" onClick={() => (window.location.href = '/trening/testing')}>
              Gjennomfør tester
            </Button>
          </div>
        )}

        {/* Info section */}
        <div className="mt-8 bg-white rounded-xl border border-tier-border-default p-6">
          <h3 className="text-lg font-semibold text-tier-navy mb-3">💡 Om treningsfokus</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-tier-text-secondary">
            <div>
              <h4 className="font-semibold text-tier-navy mb-2">Hvordan fungerer det?</h4>
              <p>
                AI-motoren analyserer dine testresultater, prestasjonshistorikk og
                utviklingsmønstre for å identifisere områder med størst forbedringspotensial.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-tier-navy mb-2">Hvordan bruke anbefalingene?</h4>
              <p>
                Start med de høyest prioriterte områdene. Hver anbefaling inkluderer forklaring,
                forventet effekt og estimert tid for å nå målnivået.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusEnginePage;
