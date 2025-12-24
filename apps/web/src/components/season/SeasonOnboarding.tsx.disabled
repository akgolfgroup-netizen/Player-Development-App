import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface BaselineRecommendation {
  recommended: 'season_average' | 'last_8_rounds';
  confidence: number;
  reasoning: string[];
  metrics: {
    last8StdDev: number;
    seasonStdDev: number;
    trendDirection: 'improving' | 'declining' | 'stable';
    trendStrength: number;
    consistencyScore: number;
  };
}

interface SeasonData {
  seasonAverage: number;
  last8Average: number;
  roundsCount: number;
  last8RoundsCount: number;
}

interface SeasonOnboardingProps {
  season: number;
  onComplete: () => void;
  onSkip?: () => void;
}

export const SeasonOnboarding: React.FC<SeasonOnboardingProps> = ({
  season,
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState<'welcome' | 'selection' | 'confirmation'>('welcome');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<BaselineRecommendation | null>(null);
  const [seasonData, setSeasonData] = useState<SeasonData | null>(null);
  const [selectedBaseline, setSelectedBaseline] = useState<'season_average' | 'last_8_rounds' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (step === 'selection') {
      fetchRecommendationAndData();
    }
  }, [step]);

  const fetchRecommendationAndData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch AI recommendation
      const recResponse = await api.get<BaselineRecommendation>(
        `/season/recommendation?season=${season}`
      );
      setRecommendation(recResponse);

      // TODO: Fetch actual season data from rounds endpoint
      // For now, using mock data
      const mockSeasonData: SeasonData = {
        seasonAverage: 85.2,
        last8Average: 82.5,
        roundsCount: 25,
        last8RoundsCount: 8,
      };
      setSeasonData(mockSeasonData);

      // Auto-select recommended baseline
      setSelectedBaseline(recResponse.recommended);
    } catch (err) {
      console.error('Failed to fetch recommendation:', err);
      setError('Kunne ikke hente anbefaling. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedBaseline || !seasonData) return;

    setLoading(true);
    setError(null);

    try {
      const baselineScore =
        selectedBaseline === 'season_average'
          ? seasonData.seasonAverage
          : seasonData.last8Average;

      await api.post('/season/baseline', {
        season,
        baselineType: selectedBaseline,
        baselineScore,
        metadata: {
          roundsCount: seasonData.roundsCount,
          last8Avg: seasonData.last8Average,
          seasonAvg: seasonData.seasonAverage,
          recommendedType: recommendation?.recommended,
          confidence: recommendation?.confidence,
        },
      });

      onComplete();
    } catch (err) {
      console.error('Failed to save baseline:', err);
      setError('Kunne ikke lagre baseline. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  // Welcome Screen
  if (step === 'welcome') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-lg w-full p-8 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-3xl font-bold mb-4">
            Velkommen til sesong {season}!
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            La oss sette dine mål for den nye sesongen basert på resultatene fra forrige år.
          </p>
          <p className="text-gray-600 mb-8">
            Vi trenger å velge en baseline-score som grunnlag for dine treningsmål og målsetninger.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => setStep('selection')} variant="primary" size="lg">
              Kom i gang
            </Button>
            {onSkip && (
              <Button onClick={onSkip} variant="ghost" size="lg">
                Hopp over
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // Baseline Selection Screen
  if (step === 'selection') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <Card className="max-w-4xl w-full p-8 my-8">
          <h2 className="text-2xl font-bold mb-2">Velg din baseline-score</h2>
          <p className="text-gray-600 mb-6">
            Dette påvirker intensiteten i treningsplanen og målsetningene dine.
          </p>

          {loading && !recommendation ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
              <Button
                onClick={fetchRecommendationAndData}
                variant="ghost"
                size="sm"
                className="mt-2"
              >
                Prøv igjen
              </Button>
            </div>
          ) : (
            <>
              {/* AI Recommendation Banner */}
              {recommendation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🤖</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        AI-anbefaling ({recommendation.confidence}% sikkerhet)
                      </h3>
                      <div className="space-y-1 text-sm text-gray-700">
                        {recommendation.reasoning.map((reason, idx) => (
                          <p key={idx}>{reason}</p>
                        ))}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Konsistens (siste 8):</span>{' '}
                          ±{recommendation.metrics.last8StdDev.toFixed(1)} slag
                        </div>
                        <div>
                          <span className="font-medium">Trend:</span>{' '}
                          {recommendation.metrics.trendDirection === 'improving'
                            ? '📈 Forbedring'
                            : recommendation.metrics.trendDirection === 'declining'
                            ? '📉 Nedgang'
                            : '➡️ Stabil'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Baseline Options */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Season Average Option */}
                <button
                  onClick={() => setSelectedBaseline('season_average')}
                  className={`text-left p-6 rounded-lg border-2 transition-all ${
                    selectedBaseline === 'season_average'
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${
                    recommendation?.recommended === 'season_average'
                      ? 'ring-2 ring-blue-300'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-xl">Sesongsnitt</h3>
                    {recommendation?.recommended === 'season_average' && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        ANBEFALT
                      </span>
                    )}
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-3">
                    {seasonData?.seasonAverage.toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Basert på {seasonData?.roundsCount} runder i {season - 1}
                  </p>
                  <div className="text-sm space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Konservativ og realistisk</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Inkluderer hele sesongvariasjonen</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Passer for varierende resultater</span>
                    </div>
                  </div>
                </button>

                {/* Last 8 Rounds Option */}
                <button
                  onClick={() => setSelectedBaseline('last_8_rounds')}
                  className={`text-left p-6 rounded-lg border-2 transition-all ${
                    selectedBaseline === 'last_8_rounds'
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${
                    recommendation?.recommended === 'last_8_rounds'
                      ? 'ring-2 ring-purple-300'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-xl">Siste 8 runder</h3>
                    {recommendation?.recommended === 'last_8_rounds' && (
                      <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                        ANBEFALT
                      </span>
                    )}
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-3">
                    {seasonData?.last8Average.toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Basert på de siste 8 rundene i {season - 1}
                  </p>
                  <div className="text-sm space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Ambisiøs og motiverende</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Reflekterer nyeste form</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Passer for stigende trend</span>
                    </div>
                  </div>
                </button>
              </div>

              {/* Comparison */}
              {seasonData && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-700 text-center">
                    <span className="font-medium">Forskjell:</span>{' '}
                    {Math.abs(seasonData.seasonAverage - seasonData.last8Average).toFixed(1)} slag
                    {seasonData.last8Average < seasonData.seasonAverage
                      ? ' (Siste 8 er bedre)'
                      : ' (Sesongsnittet er bedre)'}
                  </div>
                </div>
              )}

              {/* Error display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                {onSkip && (
                  <Button onClick={onSkip} variant="ghost">
                    Hopp over
                  </Button>
                )}
                <Button
                  onClick={() => setStep('confirmation')}
                  variant="primary"
                  disabled={!selectedBaseline}
                >
                  Neste
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    );
  }

  // Confirmation Screen
  if (step === 'confirmation') {
    const isSeasonAverage = selectedBaseline === 'season_average';
    const baselineScore = isSeasonAverage
      ? seasonData?.seasonAverage
      : seasonData?.last8Average;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-lg w-full p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">
              {isSeasonAverage ? '🎯' : '🚀'}
            </div>
            <h2 className="text-2xl font-bold mb-2">Bekreft ditt valg</h2>
            <p className="text-gray-600">
              Du har valgt å bruke{' '}
              <span className="font-semibold">
                {isSeasonAverage ? 'sesongsnitt' : 'siste 8 runder'}
              </span>{' '}
              som baseline.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-600 mb-1">Din baseline-score</div>
              <div className="text-5xl font-bold text-gray-900">
                {baselineScore?.toFixed(1)}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Dette betyr:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {isSeasonAverage ? (
                  <>
                    <li>• Mål vil være basert på sesongsnitt {season - 1}</li>
                    <li>• Treningsplan får moderat intensitet</li>
                    <li>• Fokus på å opprettholde og forbedre nivået</li>
                    <li>• Realistiske mål som tar hensyn til variasjon</li>
                  </>
                ) : (
                  <>
                    <li>• Mål vil være basert på dine siste 8 runder</li>
                    <li>• Treningsplan får høyere intensitet</li>
                    <li>• Fokus på å bygge videre på nylig fremgang</li>
                    <li>• Ambisiøse mål som reflekterer din nåværende form</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => setStep('selection')}
              variant="ghost"
              className="flex-1"
              disabled={loading}
            >
              Tilbake
            </Button>
            <Button
              onClick={handleConfirm}
              variant="primary"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Lagrer...' : 'Bekreft'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};
