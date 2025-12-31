import React from 'react';
import {
  TrendingUp, Target,
  ArrowUp, ArrowDown, Minus, CheckCircle
} from 'lucide-react';
import { SubSectionTitle } from '../../components/typography';
import Card from '../../ui/primitives/Card';

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
  if (trend === 'up') return <ArrowUp size={12} style={{ color: 'var(--success)' }} />;
  if (trend === 'down') return <ArrowDown size={12} style={{ color: 'var(--error)' }} />;
  return <Minus size={12} style={{ color: 'var(--text-secondary)' }} />;
};

// ============================================================================
// CATEGORY LADDER
// ============================================================================

const CategoryLadder = ({ currentCategory, currentPoints }) => {
  const reversedCategories = [...CATEGORIES].reverse();

  return (
    <Card variant="default" padding="none">
      <div style={{ padding: '16px' }}>
        <SubSectionTitle style={{ fontSize: '14px', marginBottom: '12px' }}>
          Kategoristige
        </SubSectionTitle>
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
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isCurrent ? 'rgba(var(--accent-rgb), 0.1)' :
                                 isPast ? 'rgba(var(--success-rgb), 0.08)' : 'transparent',
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isCurrent ? 'var(--accent)' :
                                 isPast ? 'var(--success)' : 'var(--bg-tertiary)',
                  color: (isCurrent || isPast) ? 'white' : 'var(--text-secondary)',
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
                    color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}>
                    Kategori {cat.level}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                    {cat.minPoints} - {cat.maxPoints} poeng
                  </div>
                </div>
                {isCurrent && (
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--accent)',
                  }}>
                    {currentPoints} p
                  </div>
                )}
                {isPast && (
                  <CheckCircle size={14} style={{ color: 'var(--success)' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// REQUIREMENTS CHECKLIST
// ============================================================================

const RequirementsChecklist = ({ requirements, targetCategory }) => (
  <Card variant="default" padding="none">
    <div style={{ padding: '16px' }}>
      <SubSectionTitle style={{ fontSize: '14px', marginBottom: '4px' }}>
        Krav for Kategori {targetCategory}
      </SubSectionTitle>
      <p style={{
        fontSize: '12px',
        color: 'var(--text-secondary)',
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
              borderRadius: 'var(--radius-md)',
              backgroundColor: req.met ? 'rgba(var(--success-rgb), 0.08)' : 'rgba(var(--error-rgb), 0.08)',
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: req.met ? 'var(--success)' : 'var(--error)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {req.met ? (
                <CheckCircle size={14} color="white" />
              ) : (
                <Target size={14} color="white" />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}>
                {req.name}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
              }}>
                Krav: {req.requiredScore} | Din: {req.currentScore}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendIcon trend={req.trend} />
              <span style={{
                fontSize: '14px',
                fontWeight: 600,
                color: req.met ? 'var(--success)' : 'var(--error)',
              }}>
                {req.currentScore}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

// ============================================================================
// HISTORY TABLE
// ============================================================================

const ProgressHistory = ({ history }) => (
  <Card variant="default" padding="none">
    <div style={{ padding: '16px' }}>
      <SubSectionTitle style={{ fontSize: '14px', marginBottom: '12px' }}>
        Poenghistorikk
      </SubSectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {history.map((entry, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: idx === 0 ? 'rgba(var(--accent-rgb), 0.08)' : 'var(--bg-secondary)',
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: idx === 0 ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: idx === 0 ? 'white' : 'var(--text-secondary)',
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
                color: 'var(--text-primary)',
              }}>
                {entry.points} poeng
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {new Date(entry.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: 500,
              color: entry.change.startsWith('+') ? 'var(--success)' : 'var(--error)',
            }}>
              {entry.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const KategoriFremgangContainer = () => {
  const pointsGained = CURRENT_STATUS.currentPoints - CURRENT_STATUS.startOfSeasonPoints;
  const categoriesAdvanced = CATEGORIES.findIndex((c) => c.level === CURRENT_STATUS.currentCategory) -
                            CATEGORIES.findIndex((c) => c.level === CURRENT_STATUS.startOfSeasonCategory);

  return (
    <div style={{ maxWidth: '1536px', margin: '0 auto' }}>
        {/* Season Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '10px',
          marginBottom: '24px',
        }}>
          <Card variant="default" padding="none">
            <div style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--accent)',
              }}>
                {CURRENT_STATUS.currentCategory}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Navaerende
              </div>
            </div>
          </Card>
          <Card variant="default" padding="none">
            <div style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}>
                {CURRENT_STATUS.currentPoints}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Poeng
              </div>
            </div>
          </Card>
          <Card variant="default" padding="none">
            <div style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}>
                <TrendingUp size={20} />
                +{pointsGained}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Denne sesongen
              </div>
            </div>
          </Card>
          <Card variant="default" padding="none">
            <div style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--warning)',
              }}>
                {categoriesAdvanced > 0 ? `+${categoriesAdvanced}` : categoriesAdvanced}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Kategorier opp
              </div>
            </div>
          </Card>
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
  );
};

export default KategoriFremgangContainer;
