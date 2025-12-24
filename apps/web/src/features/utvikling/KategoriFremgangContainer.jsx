import React from 'react';
import {
  TrendingUp, Target,
  ArrowUp, ArrowDown, Minus, CheckCircle
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';

// ============================================================================
// MOCK DATA
// ============================================================================

const CATEGORIES = [
  { level: 'K', minPoints: 0, maxPoints: 100 },
  { level: 'J', minPoints: 100, maxPoints: 200 },
  { level: 'I', minPoints: 200, maxPoints: 300 },
  { level: 'H', minPoints: 300, maxPoints: 400 },
  { level: 'G', minPoints: 400, maxPoints: 500 },
  { level: 'F', minPoints: 500, maxPoints: 600 },
  { level: 'E', minPoints: 600, maxPoints: 700 },
  { level: 'D', minPoints: 700, maxPoints: 800 },
  { level: 'C', minPoints: 800, maxPoints: 900 },
  { level: 'B', minPoints: 900, maxPoints: 1000 },
  { level: 'A', minPoints: 1000, maxPoints: 1200 },
];

const CURRENT_STATUS = {
  currentCategory: 'C',
  currentPoints: 847,
  startOfSeasonCategory: 'D',
  startOfSeasonPoints: 720,
  highestCategory: 'C',
  highestPoints: 865,
};

const CATEGORY_REQUIREMENTS = [
  {
    id: 'driving',
    name: 'Driving',
    currentScore: 78,
    requiredScore: 75,
    met: true,
    trend: 'up',
  },
  {
    id: 'iron_play',
    name: 'Jernspill',
    currentScore: 72,
    requiredScore: 70,
    met: true,
    trend: 'up',
  },
  {
    id: 'short_game',
    name: 'Kortspill',
    currentScore: 81,
    requiredScore: 80,
    met: true,
    trend: 'stable',
  },
  {
    id: 'putting',
    name: 'Putting',
    currentScore: 68,
    requiredScore: 75,
    met: false,
    trend: 'down',
  },
  {
    id: 'mental',
    name: 'Mental',
    currentScore: 75,
    requiredScore: 70,
    met: true,
    trend: 'up',
  },
  {
    id: 'physical',
    name: 'Fysisk',
    currentScore: 82,
    requiredScore: 75,
    met: true,
    trend: 'stable',
  },
];

const HISTORY = [
  { date: '2025-01-15', points: 847, category: 'C', change: '+12' },
  { date: '2025-01-01', points: 835, category: 'C', change: '+20' },
  { date: '2024-12-15', points: 815, category: 'C', change: '+15' },
  { date: '2024-12-01', points: 800, category: 'C', change: '+8' },
  { date: '2024-11-15', points: 792, category: 'D', change: '+22' },
  { date: '2024-11-01', points: 770, category: 'D', change: '+15' },
  { date: '2024-10-15', points: 755, category: 'D', change: '+10' },
  { date: '2024-10-01', points: 745, category: 'D', change: '+25' },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const TrendIcon = ({ trend }) => {
  if (trend === 'up') return <ArrowUp size={12} color={tokens.colors.success} />;
  if (trend === 'down') return <ArrowDown size={12} color={tokens.colors.error} />;
  return <Minus size={12} color={tokens.colors.steel} />;
};

// ============================================================================
// CATEGORY LADDER
// ============================================================================

const CategoryLadder = ({ currentCategory, currentPoints }) => {
  const reversedCategories = [...CATEGORIES].reverse();

  return (
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '14px',
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <h3 style={{
        fontSize: '14px',
        fontWeight: 600,
        color: tokens.colors.charcoal,
        marginBottom: '12px',
      }}>
        Kategoristige
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {reversedCategories.map((cat) => {
          const isCurrent = cat.level === currentCategory;
          const isPast = CATEGORIES.findIndex((c) => c.level === cat.level) <
                        CATEGORIES.findIndex((c) => c.level === currentCategory);

          return (
            <div
              key={cat.level}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '8px',
                backgroundColor: isCurrent ? `${tokens.colors.primary}15` :
                               isPast ? `${tokens.colors.success}10` : 'transparent',
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: isCurrent ? tokens.colors.primary :
                               isPast ? tokens.colors.success : tokens.colors.mist,
                color: (isCurrent || isPast) ? tokens.colors.white : tokens.colors.steel,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600,
              }}>
                {cat.level}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: isCurrent ? 600 : 400,
                  color: isCurrent ? tokens.colors.charcoal : tokens.colors.steel,
                }}>
                  Kategori {cat.level}
                </div>
                <div style={{ fontSize: '10px', color: tokens.colors.steel }}>
                  {cat.minPoints} - {cat.maxPoints} poeng
                </div>
              </div>
              {isCurrent && (
                <div style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: tokens.colors.primary,
                }}>
                  {currentPoints} p
                </div>
              )}
              {isPast && (
                <CheckCircle size={14} color={tokens.colors.success} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// REQUIREMENTS CHECKLIST
// ============================================================================

const RequirementsChecklist = ({ requirements, targetCategory }) => (
  <div style={{
    backgroundColor: tokens.colors.white,
    borderRadius: '14px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  }}>
    <h3 style={{
      fontSize: '14px',
      fontWeight: 600,
      color: tokens.colors.charcoal,
      marginBottom: '4px',
    }}>
      Krav for Kategori {targetCategory}
    </h3>
    <p style={{
      fontSize: '12px',
      color: tokens.colors.steel,
      margin: '0 0 12px 0',
    }}>
      {requirements.filter((r) => r.met).length} av {requirements.length} oppfylt
    </p>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {requirements.map((req) => (
        <div
          key={req.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '8px',
            backgroundColor: req.met ? `${tokens.colors.success}10` : `${tokens.colors.error}10`,
          }}
        >
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            backgroundColor: req.met ? tokens.colors.success : tokens.colors.error,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {req.met ? (
              <CheckCircle size={14} color={tokens.colors.white} />
            ) : (
              <Target size={14} color={tokens.colors.white} />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 500,
              color: tokens.colors.charcoal,
            }}>
              {req.name}
            </div>
            <div style={{
              fontSize: '11px',
              color: tokens.colors.steel,
            }}>
              Krav: {req.requiredScore} | Din: {req.currentScore}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendIcon trend={req.trend} />
            <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: req.met ? tokens.colors.success : tokens.colors.error,
            }}>
              {req.currentScore}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================================
// HISTORY TABLE
// ============================================================================

const ProgressHistory = ({ history }) => (
  <div style={{
    backgroundColor: tokens.colors.white,
    borderRadius: '14px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  }}>
    <h3 style={{
      fontSize: '14px',
      fontWeight: 600,
      color: tokens.colors.charcoal,
      marginBottom: '12px',
    }}>
      Poenghistorikk
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {history.map((entry, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: '8px',
            backgroundColor: idx === 0 ? `${tokens.colors.primary}10` : tokens.colors.snow,
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: idx === 0 ? tokens.colors.primary : tokens.colors.mist,
            color: idx === 0 ? tokens.colors.white : tokens.colors.steel,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 600,
          }}>
            {entry.category}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 500,
              color: tokens.colors.charcoal,
            }}>
              {entry.points} poeng
            </div>
            <div style={{ fontSize: '11px', color: tokens.colors.steel }}>
              {new Date(entry.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
          <div style={{
            fontSize: '12px',
            fontWeight: 500,
            color: entry.change.startsWith('+') ? tokens.colors.success : tokens.colors.error,
          }}>
            {entry.change}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const KategoriFremgangContainer = () => {
  const pointsGained = CURRENT_STATUS.currentPoints - CURRENT_STATUS.startOfSeasonPoints;
  const categoriesAdvanced = CATEGORIES.findIndex((c) => c.level === CURRENT_STATUS.currentCategory) -
                            CATEGORIES.findIndex((c) => c.level === CURRENT_STATUS.startOfSeasonCategory);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Kategori-fremgang"
        subtitle="Din reise gjennom kategoriene"
      />

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Season Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '10px',
          marginBottom: '24px',
        }}>
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: 700,
              color: tokens.colors.primary,
            }}>
              {CURRENT_STATUS.currentCategory}
            </div>
            <div style={{ fontSize: '12px', color: tokens.colors.steel }}>
              Navaerende
            </div>
          </div>
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 700,
              color: tokens.colors.charcoal,
            }}>
              {CURRENT_STATUS.currentPoints}
            </div>
            <div style={{ fontSize: '12px', color: tokens.colors.steel }}>
              Poeng
            </div>
          </div>
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 700,
              color: tokens.colors.success,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}>
              <TrendingUp size={20} />
              +{pointsGained}
            </div>
            <div style={{ fontSize: '12px', color: tokens.colors.steel }}>
              Denne sesongen
            </div>
          </div>
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 700,
              color: tokens.colors.gold,
            }}>
              {categoriesAdvanced > 0 ? `+${categoriesAdvanced}` : categoriesAdvanced}
            </div>
            <div style={{ fontSize: '12px', color: tokens.colors.steel }}>
              Kategorier opp
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(200px, 280px) 1fr',
          gap: '20px',
        }}>
          {/* Left: Category Ladder */}
          <CategoryLadder
            currentCategory={CURRENT_STATUS.currentCategory}
            currentPoints={CURRENT_STATUS.currentPoints}
          />

          {/* Right: Requirements and History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <RequirementsChecklist
              requirements={CATEGORY_REQUIREMENTS}
              targetCategory="B"
            />
            <ProgressHistory history={HISTORY} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KategoriFremgangContainer;
