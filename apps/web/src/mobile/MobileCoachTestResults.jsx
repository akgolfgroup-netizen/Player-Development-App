import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3, Users } from 'lucide-react';
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
      fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
      backgroundColor: 'var(--bg-secondary)',
      minHeight: '100vh',
      paddingBottom: '32px',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'var(--accent)',
        color: 'var(--bg-primary)',
        padding: '24px',
      }}>
        <h1 style={{
          fontSize: '22px', lineHeight: '28px', fontWeight: 700,
          margin: 0,
          marginBottom: '8px',
        }}>
          Testresultater
        </h1>
        <p style={{
          fontSize: '15px', lineHeight: '20px', fontWeight: 600,
          margin: 0,
          opacity: 0.9,
        }}>
          Siste prestasjonstester
        </p>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Category Filters */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '8px',
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
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}>
              <SummaryStat
                icon={<TrendingUp size={20} />}
                label="Forbedret"
                value={testResults.filter(r => r.trend === 'up').length}
                color={'var(--success)'}
              />
              <SummaryStat
                icon={<TrendingDown size={20} />}
                label="Svakere"
                value={testResults.filter(r => r.trend === 'down').length}
                color={'var(--error)'}
              />
              <SummaryStat
                icon={<Minus size={20} />}
                label="Stabil"
                value={testResults.filter(r => r.trend === 'stable').length}
                color={'var(--text-secondary)'}
              />
            </div>
          </div>
        )}

        {/* Test Results List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredResults.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            padding: `${'32px'} ${'24px'}`,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <BarChart3 size={48} color={'var(--text-secondary)'} style={{ margin: '0 auto 16px' }} />
            <div style={{
              fontSize: '17px', lineHeight: '22px', fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}>
              Ingen testresultater
            </div>
            <div style={{
              fontSize: '15px', lineHeight: '20px', fontWeight: 600,
              color: 'var(--text-secondary)',
            }}>
              Ingen tester funnet i denne kategorien
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
      gap: '8px',
      padding: `${'8px'} ${'16px'}`,
      backgroundColor: active ? 'var(--accent)' : 'var(--bg-primary)',
      color: active ? 'var(--bg-primary)' : 'var(--text-primary)',
      border: active ? 'none' : '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      fontSize: '15px', lineHeight: '20px', fontWeight: 600,
      fontWeight: active ? 600 : 400,
      whiteSpace: 'nowrap',
      transition: 'all 0.2s',
    }}
  >
    {label}
    {count > 0 && (
      <span style={{
        padding: '2px 8px',
        backgroundColor: active ? 'rgba(255,255,255,0.2)' : 'var(--bg-secondary)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '11px', lineHeight: '13px',
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
    gap: '8px',
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
      fontSize: '20px', lineHeight: '25px', fontWeight: 600,
      color: 'var(--text-primary)',
    }}>
      {value}
    </div>
    <div style={{
      fontSize: '11px', lineHeight: '13px',
      color: 'var(--text-secondary)',
    }}>
      {label}
    </div>
  </div>
);

const TestResultCard = ({ result }) => {
  const getTrendIcon = () => {
    switch (result.trend) {
      case 'up':
        return <TrendingUp size={24} color={'var(--success)'} />;
      case 'down':
        return <TrendingDown size={24} color={'var(--error)'} />;
      default:
        return <Minus size={24} color={'var(--text-secondary)'} />;
    }
  };

  const getTrendColor = () => {
    switch (result.trend) {
      case 'up':
        return 'var(--success)';
      case 'down':
        return 'var(--error)';
      default:
        return 'var(--text-secondary)';
    }
  };

  const categoryLabels = {
    technique: 'Teknikk',
    physical: 'Fysisk',
    mental: 'Mentalt',
  };

  const categoryColors = {
    technique: 'var(--accent)',
    physical: 'var(--achievement)',
    mental: 'var(--success)',
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-primary)',
      borderRadius: 'var(--radius-md)',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px',
          }}>
            <Users size={16} color={'var(--text-secondary)'} />
            <span style={{
              fontSize: '15px', lineHeight: '20px', fontWeight: 600,
              color: 'var(--text-secondary)',
            }}>
              {result.athlete}
            </span>
          </div>
          <h3 style={{
            fontSize: '17px', lineHeight: '22px', fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0,
            marginBottom: '8px',
          }}>
            {result.testName}
          </h3>
          <div style={{
            display: 'inline-block',
            padding: '4px 12px',
            backgroundColor: `${categoryColors[result.category]}15`,
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px', lineHeight: '13px',
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
        padding: '16px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '16px',
      }}>
        <div>
          <div style={{
            fontSize: '11px', lineHeight: '13px',
            color: 'var(--text-secondary)',
            marginBottom: '4px',
          }}>
            Resultat
          </div>
          <div style={{
            fontSize: '34px', lineHeight: '41px', fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            {result.score}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          {getTrendIcon()}
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '11px', lineHeight: '13px',
              color: 'var(--text-secondary)',
              marginBottom: '4px',
            }}>
              Endring
            </div>
            <div style={{
              fontSize: '17px', lineHeight: '22px', fontWeight: 600,
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
        gap: '8px',
        marginBottom: '16px',
        fontSize: '13px', lineHeight: '18px',
        color: 'var(--text-secondary)',
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
          padding: '16px',
          backgroundColor: `${getTrendColor()}10`,
          borderLeft: `3px solid ${getTrendColor()}`,
          borderRadius: 'var(--radius-sm)',
          fontSize: '13px', lineHeight: '18px',
          color: 'var(--text-primary)',
        }}>
          {result.notes}
        </div>
      )}
    </div>
  );
};

export default MobileCoachTestResults;
