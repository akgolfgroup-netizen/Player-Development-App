import React, { useState } from 'react';
import {
  Award, CheckCircle, Circle,
  Info
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';

// ============================================================================
// MOCK DATA
// ============================================================================

const CURRENT_CATEGORY = 'C';
const TARGET_CATEGORY = 'B';

const CATEGORIES = [
  { level: 'K', minPoints: 0 },
  { level: 'J', minPoints: 100 },
  { level: 'I', minPoints: 200 },
  { level: 'H', minPoints: 300 },
  { level: 'G', minPoints: 400 },
  { level: 'F', minPoints: 500 },
  { level: 'E', minPoints: 600 },
  { level: 'D', minPoints: 700 },
  { level: 'C', minPoints: 800 },
  { level: 'B', minPoints: 900 },
  { level: 'A', minPoints: 1000 },
];

const CATEGORY_REQUIREMENTS = {
  'B': {
    tests: [
      {
        id: 'driving_distance',
        name: 'Driver avstand',
        category: 'Driving',
        requirement: 250,
        unit: 'm',
        current: 255,
        met: true,
        description: 'Gjennomsnittlig driveavstand over 5 slag',
      },
      {
        id: 'driving_accuracy',
        name: 'Fairway treff',
        category: 'Driving',
        requirement: 70,
        unit: '%',
        current: 68,
        met: false,
        description: 'Prosent av fairways truffet over 18 hull',
      },
      {
        id: 'gir',
        name: 'GIR (Greens in Regulation)',
        category: 'Jernspill',
        requirement: 60,
        unit: '%',
        current: 55,
        met: false,
        description: 'Prosent av greener natt i regulation',
      },
      {
        id: 'proximity',
        name: 'Naerhet til hull fra 100m',
        category: 'Jernspill',
        requirement: 8,
        unit: 'm',
        current: 9.5,
        met: false,
        lowerIsBetter: true,
        description: 'Gjennomsnittlig avstand til hull fra 100m',
      },
      {
        id: 'scrambling',
        name: 'Scrambling',
        category: 'Kortspill',
        requirement: 60,
        unit: '%',
        current: 58,
        met: false,
        description: 'Prosent up-and-down fra utenfor greenen',
      },
      {
        id: 'sand_saves',
        name: 'Sand saves',
        category: 'Kortspill',
        requirement: 50,
        unit: '%',
        current: 55,
        met: true,
        description: 'Prosent up-and-down fra bunker',
      },
      {
        id: 'putts_per_round',
        name: 'Putts per runde',
        category: 'Putting',
        requirement: 30,
        unit: '',
        current: 31.5,
        met: false,
        lowerIsBetter: true,
        description: 'Gjennomsnittlig antall putts per 18 hull',
      },
      {
        id: 'one_putt_pct',
        name: 'En-putt prosent',
        category: 'Putting',
        requirement: 40,
        unit: '%',
        current: 38,
        met: false,
        description: 'Prosent av greener med kun en putt',
      },
      {
        id: 'club_speed',
        name: 'Klubbfart driver',
        category: 'Fysisk',
        requirement: 105,
        unit: 'mph',
        current: 108,
        met: true,
        description: 'Gjennomsnittlig klubbhodefart med driver',
      },
      {
        id: 'core_strength',
        name: 'Core-test',
        category: 'Fysisk',
        requirement: 80,
        unit: 'sek',
        current: 90,
        met: true,
        description: 'Plankehold i sekunder',
      },
    ],
    rounds: {
      required: 10,
      completed: 8,
      handicapRequired: 8.0,
      currentHandicap: 9.2,
    },
  },
};

// ============================================================================
// REQUIREMENT CARD
// ============================================================================

const RequirementCard = ({ test }) => {
  const progressPercent = test.lowerIsBetter
    ? Math.min(100, (test.requirement / test.current) * 100)
    : Math.min(100, (test.current / test.requirement) * 100);

  const difference = test.lowerIsBetter
    ? test.requirement - test.current
    : test.current - test.requirement;

  return (
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      padding: '14px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '10px',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px',
          }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 500,
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: `${tokens.colors.primary}15`,
              color: tokens.colors.primary,
            }}>
              {test.category}
            </span>
            {test.met ? (
              <CheckCircle size={14} color={tokens.colors.success} />
            ) : (
              <Circle size={14} color={tokens.colors.steel} />
            )}
          </div>
          <h4 style={{
            fontSize: '14px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
            margin: 0,
          }}>
            {test.name}
          </h4>
          <p style={{
            fontSize: '11px',
            color: tokens.colors.steel,
            margin: '4px 0 0 0',
          }}>
            {test.description}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{
          height: '6px',
          backgroundColor: tokens.colors.mist,
          borderRadius: '3px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: test.met ? tokens.colors.success :
                           progressPercent >= 80 ? tokens.colors.warning : tokens.colors.error,
            borderRadius: '3px',
          }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Krav</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: tokens.colors.charcoal }}>
            {test.lowerIsBetter ? '≤' : '≥'} {test.requirement}{test.unit}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Din</div>
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            color: test.met ? tokens.colors.success : tokens.colors.error,
          }}>
            {test.current}{test.unit}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Differanse</div>
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            color: difference >= 0 ? tokens.colors.success : tokens.colors.error,
          }}>
            {difference >= 0 ? '+' : ''}{difference.toFixed(1)}{test.unit}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CATEGORY SELECTOR
// ============================================================================

const CategorySelector = ({ selected, onChange }) => (
  <div style={{
    backgroundColor: tokens.colors.white,
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '20px',
  }}>
    <h3 style={{
      fontSize: '14px',
      fontWeight: 600,
      color: tokens.colors.charcoal,
      marginBottom: '12px',
    }}>
      Velg kategori
    </h3>
    <div style={{
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      paddingBottom: '4px',
    }}>
      {CATEGORIES.slice().reverse().map((cat) => {
        const isCurrent = cat.level === CURRENT_CATEGORY;
        const isSelected = cat.level === selected;
        const isPast = CATEGORIES.findIndex((c) => c.level === cat.level) <
                      CATEGORIES.findIndex((c) => c.level === CURRENT_CATEGORY);

        return (
          <button
            key={cat.level}
            onClick={() => onChange(cat.level)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: isSelected ? `2px solid ${tokens.colors.primary}` : '2px solid transparent',
              backgroundColor: isCurrent ? `${tokens.colors.success}15` :
                             isSelected ? `${tokens.colors.primary}10` :
                             isPast ? tokens.colors.snow : tokens.colors.white,
              color: isCurrent ? tokens.colors.success :
                    isSelected ? tokens.colors.primary : tokens.colors.charcoal,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {cat.level}
            {isCurrent && ' ✓'}
          </button>
        );
      })}
    </div>
  </div>
);

// ============================================================================
// SUMMARY CARD
// ============================================================================

const SummaryCard = ({ requirements, targetCategory }) => {
  const tests = requirements?.tests || [];
  const metCount = tests.filter((t) => t.met).length;
  const totalCount = tests.length;
  const rounds = requirements?.rounds;

  return (
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '14px',
      padding: '16px',
      marginBottom: '20px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: `${tokens.colors.gold}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Award size={24} color={tokens.colors.gold} />
        </div>
        <div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: tokens.colors.charcoal,
            margin: 0,
          }}>
            Krav for Kategori {targetCategory}
          </h2>
          <p style={{
            fontSize: '13px',
            color: tokens.colors.steel,
            margin: '2px 0 0 0',
          }}>
            {metCount} av {totalCount} testkrav oppfylt
          </p>
        </div>
      </div>

      {/* Progress Ring */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
      }}>
        <div style={{
          padding: '12px',
          backgroundColor: tokens.colors.snow,
          borderRadius: '10px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 700,
            color: metCount === totalCount ? tokens.colors.success : tokens.colors.primary,
          }}>
            {metCount}/{totalCount}
          </div>
          <div style={{ fontSize: '11px', color: tokens.colors.steel }}>
            Tester oppfylt
          </div>
        </div>

        {rounds && (
          <>
            <div style={{
              padding: '12px',
              backgroundColor: tokens.colors.snow,
              borderRadius: '10px',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: rounds.completed >= rounds.required ? tokens.colors.success : tokens.colors.warning,
              }}>
                {rounds.completed}/{rounds.required}
              </div>
              <div style={{ fontSize: '11px', color: tokens.colors.steel }}>
                Runder spilt
              </div>
            </div>

            <div style={{
              padding: '12px',
              backgroundColor: tokens.colors.snow,
              borderRadius: '10px',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: rounds.currentHandicap <= rounds.handicapRequired ? tokens.colors.success : tokens.colors.error,
              }}>
                {rounds.currentHandicap}
              </div>
              <div style={{ fontSize: '11px', color: tokens.colors.steel }}>
                Hcp (krav: ≤{rounds.handicapRequired})
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const KategoriKravContainer = () => {
  const [selectedCategory, setSelectedCategory] = useState(TARGET_CATEGORY);
  const requirements = CATEGORY_REQUIREMENTS[selectedCategory];

  const groupedTests = requirements?.tests.reduce((acc, test) => {
    if (!acc[test.category]) acc[test.category] = [];
    acc[test.category].push(test);
    return acc;
  }, {}) || {};

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Kategori-krav"
        subtitle="Se kravene for hver kategori"
      />

      <div style={{ padding: '16px 24px 24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Category Selector */}
        <CategorySelector
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />

        {/* Summary */}
        {requirements && (
          <SummaryCard
            requirements={requirements}
            targetCategory={selectedCategory}
          />
        )}

        {/* Requirements by Category */}
        {Object.entries(groupedTests).map(([category, tests]) => (
          <div key={category} style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: tokens.colors.charcoal,
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              {category}
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: tokens.colors.steel,
              }}>
                ({tests.filter((t) => t.met).length}/{tests.length} oppfylt)
              </span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tests.map((test) => (
                <RequirementCard key={test.id} test={test} />
              ))}
            </div>
          </div>
        ))}

        {!requirements && (
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '14px',
            padding: '40px',
            textAlign: 'center',
          }}>
            <Info size={40} color={tokens.colors.steel} style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '14px', color: tokens.colors.steel, margin: 0 }}>
              Ingen krav definert for denne kategorien
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KategoriKravContainer;
