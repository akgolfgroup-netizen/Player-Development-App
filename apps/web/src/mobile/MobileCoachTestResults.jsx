import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3, Users } from 'lucide-react';
import { tokens, typographyStyle } from '../design-tokens';
import { SkeletonCard } from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';

const MobileCoachTestResults = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'technique' | 'physical' | 'mental'

  useEffect(() => {
    fetchTestResults();
  }, []);

  const fetchTestResults = async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get('/coach/test-results/recent');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 900));

      const mockResults = [
        {
          id: 1,
          athlete: 'Emma Hansen',
          testName: 'Driver Accuracy',
          category: 'technique',
          date: '2024-12-22',
          score: 85,
          previousScore: 78,
          trend: 'up',
          improvement: 9,
          notes: 'Excellent progress on ball flight control',
        },
        {
          id: 2,
          athlete: 'Lars Olsen',
          testName: 'Putting Consistency',
          category: 'technique',
          date: '2024-12-21',
          score: 72,
          previousScore: 75,
          trend: 'down',
          improvement: -4,
          notes: 'Need to work on distance control',
        },
        {
          id: 3,
          athlete: 'Maria Berg',
          testName: 'Mental Toughness',
          category: 'mental',
          date: '2024-12-20',
          score: 88,
          previousScore: 85,
          trend: 'up',
          improvement: 3.5,
          notes: 'Showing great resilience under pressure',
        },
        {
          id: 4,
          athlete: 'Johan Vik',
          testName: 'Core Stability',
          category: 'physical',
          date: '2024-12-20',
          score: 91,
          previousScore: 91,
          trend: 'stable',
          improvement: 0,
          notes: 'Maintaining excellent form',
        },
        {
          id: 5,
          athlete: 'Emma Hansen',
          testName: 'Short Game Precision',
          category: 'technique',
          date: '2024-12-19',
          score: 79,
          previousScore: 72,
          trend: 'up',
          improvement: 9.7,
          notes: 'Chipping technique significantly improved',
        },
        {
          id: 6,
          athlete: 'Sara Nilsen',
          testName: 'Flexibility Assessment',
          category: 'physical',
          date: '2024-12-18',
          score: 83,
          previousScore: 80,
          trend: 'up',
          improvement: 3.8,
          notes: 'ROM improvements in shoulder rotation',
        },
      ];

      setTestResults(mockResults);
    } catch (err) {
      setError(err.message || 'Kunne ikke laste testresultater');
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = selectedCategory === 'all'
    ? testResults
    : testResults.filter(result => result.category === selectedCategory);

  const categoryStats = {
    all: testResults.length,
    technique: testResults.filter(r => r.category === 'technique').length,
    physical: testResults.filter(r => r.category === 'physical').length,
    mental: testResults.filter(r => r.category === 'mental').length,
  };

  if (error) {
    return <ErrorState message={error} onRetry={fetchTestResults} />;
  }

  return (
    <div style={{
      fontFamily: tokens.typography.fontFamily,
      backgroundColor: tokens.colors.snow,
      minHeight: '100vh',
      paddingBottom: tokens.spacing.xl,
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: tokens.colors.primary,
        color: tokens.colors.white,
        padding: tokens.spacing.lg,
      }}>
        <h1 style={{
          ...typographyStyle('title2'),
          margin: 0,
          marginBottom: tokens.spacing.sm,
        }}>
          Testresultater
        </h1>
        <p style={{
          ...typographyStyle('subheadline'),
          margin: 0,
          opacity: 0.9,
        }}>
          Siste prestasjonstester
        </p>
      </div>

      <div style={{ padding: tokens.spacing.md }}>
        {/* Category Filters */}
        <div style={{
          display: 'flex',
          gap: tokens.spacing.sm,
          marginBottom: tokens.spacing.lg,
          overflowX: 'auto',
          paddingBottom: tokens.spacing.sm,
        }}>
          <CategoryChip
            label="Alle"
            count={categoryStats.all}
            active={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
          />
          <CategoryChip
            label="Teknikk"
            count={categoryStats.technique}
            active={selectedCategory === 'technique'}
            onClick={() => setSelectedCategory('technique')}
          />
          <CategoryChip
            label="Fysisk"
            count={categoryStats.physical}
            active={selectedCategory === 'physical'}
            onClick={() => setSelectedCategory('physical')}
          />
          <CategoryChip
            label="Mentalt"
            count={categoryStats.mental}
            active={selectedCategory === 'mental'}
            onClick={() => setSelectedCategory('mental')}
          />
        </div>

        {/* Summary Stats */}
        {!loading && (
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.radius.md,
            padding: tokens.spacing.lg,
            marginBottom: tokens.spacing.lg,
            boxShadow: tokens.shadows.card,
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: tokens.spacing.md,
            }}>
              <SummaryStat
                icon={<TrendingUp size={20} />}
                label="Forbedret"
                value={testResults.filter(r => r.trend === 'up').length}
                color={tokens.colors.success}
              />
              <SummaryStat
                icon={<TrendingDown size={20} />}
                label="Svakere"
                value={testResults.filter(r => r.trend === 'down').length}
                color={tokens.colors.error}
              />
              <SummaryStat
                icon={<Minus size={20} />}
                label="Stabil"
                value={testResults.filter(r => r.trend === 'stable').length}
                color={tokens.colors.steel}
              />
            </div>
          </div>
        )}

        {/* Test Results List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredResults.length === 0 ? (
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.radius.md,
            padding: `${tokens.spacing.xl} ${tokens.spacing.lg}`,
            textAlign: 'center',
            boxShadow: tokens.shadows.card,
          }}>
            <BarChart3 size={48} color={tokens.colors.steel} style={{ margin: '0 auto 16px' }} />
            <div style={{
              ...typographyStyle('headline'),
              color: tokens.colors.charcoal,
              marginBottom: '8px',
            }}>
              Ingen testresultater
            </div>
            <div style={{
              ...typographyStyle('subheadline'),
              color: tokens.colors.steel,
            }}>
              Ingen tester funnet i denne kategorien
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
            {filteredResults.map((result) => (
              <TestResultCard key={result.id} result={result} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryChip = ({ label, count, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.sm,
      padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
      backgroundColor: active ? tokens.colors.primary : tokens.colors.white,
      color: active ? tokens.colors.white : tokens.colors.charcoal,
      border: active ? 'none' : `1px solid ${tokens.colors.mist}`,
      borderRadius: tokens.radius.md,
      cursor: 'pointer',
      ...typographyStyle('subheadline'),
      fontWeight: active ? 600 : 400,
      whiteSpace: 'nowrap',
      transition: 'all 0.2s',
    }}
  >
    {label}
    {count > 0 && (
      <span style={{
        padding: '2px 8px',
        backgroundColor: active ? 'rgba(255,255,255,0.2)' : tokens.colors.snow,
        borderRadius: tokens.radius.sm,
        ...typographyStyle('caption1'),
        fontWeight: 600,
      }}>
        {count}
      </span>
    )}
  </button>
);

const SummaryStat = ({ icon, label, value, color }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: `${color}15`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: color,
    }}>
      {icon}
    </div>
    <div style={{
      ...typographyStyle('title3'),
      color: tokens.colors.charcoal,
    }}>
      {value}
    </div>
    <div style={{
      ...typographyStyle('caption1'),
      color: tokens.colors.steel,
    }}>
      {label}
    </div>
  </div>
);

const TestResultCard = ({ result }) => {
  const getTrendIcon = () => {
    switch (result.trend) {
      case 'up':
        return <TrendingUp size={24} color={tokens.colors.success} />;
      case 'down':
        return <TrendingDown size={24} color={tokens.colors.error} />;
      default:
        return <Minus size={24} color={tokens.colors.steel} />;
    }
  };

  const getTrendColor = () => {
    switch (result.trend) {
      case 'up':
        return tokens.colors.success;
      case 'down':
        return tokens.colors.error;
      default:
        return tokens.colors.steel;
    }
  };

  const categoryLabels = {
    technique: 'Teknikk',
    physical: 'Fysisk',
    mental: 'Mentalt',
  };

  const categoryColors = {
    technique: tokens.colors.primary,
    physical: tokens.colors.gold,
    mental: tokens.colors.success,
  };

  return (
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: tokens.radius.md,
      padding: tokens.spacing.lg,
      boxShadow: tokens.shadows.card,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: tokens.spacing.md,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing.sm,
            marginBottom: '4px',
          }}>
            <Users size={16} color={tokens.colors.steel} />
            <span style={{
              ...typographyStyle('subheadline'),
              color: tokens.colors.steel,
            }}>
              {result.athlete}
            </span>
          </div>
          <h3 style={{
            ...typographyStyle('headline'),
            color: tokens.colors.charcoal,
            margin: 0,
            marginBottom: tokens.spacing.sm,
          }}>
            {result.testName}
          </h3>
          <div style={{
            display: 'inline-block',
            padding: '4px 12px',
            backgroundColor: `${categoryColors[result.category]}15`,
            borderRadius: tokens.radius.sm,
            ...typographyStyle('caption1'),
            fontWeight: 600,
            color: categoryColors[result.category],
          }}>
            {categoryLabels[result.category]}
          </div>
        </div>
      </div>

      {/* Score Display */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: tokens.spacing.md,
        backgroundColor: tokens.colors.snow,
        borderRadius: tokens.radius.sm,
        marginBottom: tokens.spacing.md,
      }}>
        <div>
          <div style={{
            ...typographyStyle('caption1'),
            color: tokens.colors.steel,
            marginBottom: '4px',
          }}>
            Resultat
          </div>
          <div style={{
            ...typographyStyle('largeTitle'),
            color: tokens.colors.charcoal,
          }}>
            {result.score}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing.sm,
        }}>
          {getTrendIcon()}
          <div style={{ textAlign: 'right' }}>
            <div style={{
              ...typographyStyle('caption1'),
              color: tokens.colors.steel,
              marginBottom: '4px',
            }}>
              Endring
            </div>
            <div style={{
              ...typographyStyle('headline'),
              color: getTrendColor(),
              fontWeight: 600,
            }}>
              {result.improvement > 0 ? '+' : ''}{result.improvement}%
            </div>
          </div>
        </div>
      </div>

      {/* Previous Score */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing.sm,
        marginBottom: tokens.spacing.md,
        ...typographyStyle('footnote'),
        color: tokens.colors.steel,
      }}>
        <span>Forrige: {result.previousScore}</span>
        <span>•</span>
        <span>{new Date(result.date).toLocaleDateString('nb-NO', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })}</span>
      </div>

      {/* Notes */}
      {result.notes && (
        <div style={{
          padding: tokens.spacing.md,
          backgroundColor: `${getTrendColor()}10`,
          borderLeft: `3px solid ${getTrendColor()}`,
          borderRadius: tokens.radius.sm,
          ...typographyStyle('footnote'),
          color: tokens.colors.charcoal,
        }}>
          {result.notes}
        </div>
      )}
    </div>
  );
};

export default MobileCoachTestResults;
