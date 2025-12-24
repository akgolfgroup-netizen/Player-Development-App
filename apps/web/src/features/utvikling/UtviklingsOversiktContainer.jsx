import React from 'react';
import {
  TrendingUp, Target, Award, ChevronRight, Star,
  Zap, ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';

// ============================================================================
// MOCK DATA
// ============================================================================

const CURRENT_CATEGORY = {
  level: 'C',
  points: 847,
  nextLevel: 'B',
  pointsNeeded: 153,
  percentToNext: 85,
};

const DEVELOPMENT_AREAS = [
  {
    id: 'driving',
    name: 'Driving',
    score: 78,
    trend: 'up',
    change: '+5',
    lastUpdated: '2025-01-18',
    status: 'improving',
  },
  {
    id: 'iron_play',
    name: 'Jernspill',
    score: 72,
    trend: 'up',
    change: '+3',
    lastUpdated: '2025-01-18',
    status: 'improving',
  },
  {
    id: 'short_game',
    name: 'Kortspill',
    score: 81,
    trend: 'stable',
    change: '0',
    lastUpdated: '2025-01-15',
    status: 'stable',
  },
  {
    id: 'putting',
    name: 'Putting',
    score: 68,
    trend: 'down',
    change: '-2',
    lastUpdated: '2025-01-18',
    status: 'needs_attention',
  },
  {
    id: 'mental',
    name: 'Mental',
    score: 75,
    trend: 'up',
    change: '+4',
    lastUpdated: '2025-01-12',
    status: 'improving',
  },
  {
    id: 'physical',
    name: 'Fysisk',
    score: 82,
    trend: 'stable',
    change: '+1',
    lastUpdated: '2025-01-10',
    status: 'stable',
  },
];

const RECENT_ACHIEVEMENTS = [
  { id: 1, title: 'Driver over 250m', date: '2025-01-15', type: 'milestone' },
  { id: 2, title: '10 treninger denne mnd', date: '2025-01-12', type: 'streak' },
  { id: 3, title: 'Ny personlig rekord i squat', date: '2025-01-10', type: 'pr' },
];

const BREAKING_POINTS = [
  { id: 1, area: 'Driving', description: 'Sving tempo', status: 'working', priority: 'high' },
  { id: 2, area: 'Putting', description: 'Lesing av greener', status: 'identified', priority: 'medium' },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const TrendIcon = ({ trend }) => {
  if (trend === 'up') return <ArrowUp size={14} color={tokens.colors.success} />;
  if (trend === 'down') return <ArrowDown size={14} color={tokens.colors.error} />;
  return <Minus size={14} color={tokens.colors.steel} />;
};

const getStatusColor = (status) => {
  switch (status) {
    case 'improving': return tokens.colors.success;
    case 'stable': return tokens.colors.primary;
    case 'needs_attention': return tokens.colors.error;
    default: return tokens.colors.steel;
  }
};

// ============================================================================
// CATEGORY PROGRESS CARD
// ============================================================================

const CategoryProgressCard = ({ category }) => (
  <div style={{
    backgroundColor: tokens.colors.white,
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: `${tokens.colors.primary}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Award size={24} color={tokens.colors.primary} />
        </div>
        <div>
          <div style={{ fontSize: '13px', color: tokens.colors.steel }}>Navaerende kategori</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: tokens.colors.charcoal }}>
            Kategori {category.level}
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.primary }}>
          {category.points}
        </div>
        <div style={{ fontSize: '12px', color: tokens.colors.steel }}>poeng</div>
      </div>
    </div>

    <div style={{ marginBottom: '8px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: tokens.colors.steel,
        marginBottom: '6px',
      }}>
        <span>Fremgang mot Kategori {category.nextLevel}</span>
        <span>{category.pointsNeeded} poeng igjen</span>
      </div>
      <div style={{
        height: '8px',
        backgroundColor: tokens.colors.mist,
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${category.percentToNext}%`,
          backgroundColor: tokens.colors.primary,
          borderRadius: '4px',
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  </div>
);

// ============================================================================
// DEVELOPMENT AREA CARD
// ============================================================================

const DevelopmentAreaCard = ({ area, onClick }) => (
  <div
    onClick={onClick}
    style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      padding: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
    }}
  >
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          backgroundColor: `${getStatusColor(area.status)}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Target size={20} color={getStatusColor(area.status)} />
        </div>
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
          }}>
            {area.name}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '2px',
          }}>
            <TrendIcon trend={area.trend} />
            <span style={{
              fontSize: '12px',
              color: area.trend === 'up' ? tokens.colors.success :
                     area.trend === 'down' ? tokens.colors.error : tokens.colors.steel,
            }}>
              {area.change}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          fontSize: '24px',
          fontWeight: 700,
          color: getStatusColor(area.status),
        }}>
          {area.score}
        </div>
        <ChevronRight size={18} color={tokens.colors.steel} />
      </div>
    </div>
  </div>
);

// ============================================================================
// QUICK LINKS SECTION
// ============================================================================

const QuickLinkCard = ({ icon: Icon, title, description, href, color }) => (
  <a
    href={href}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      padding: '16px',
      textDecoration: 'none',
      transition: 'all 0.2s',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
    }}
  >
    <div style={{
      width: '44px',
      height: '44px',
      borderRadius: '10px',
      backgroundColor: `${color}15`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon size={22} color={color} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{
        fontSize: '14px',
        fontWeight: 600,
        color: tokens.colors.charcoal,
      }}>
        {title}
      </div>
      <div style={{
        fontSize: '12px',
        color: tokens.colors.steel,
        marginTop: '2px',
      }}>
        {description}
      </div>
    </div>
    <ChevronRight size={18} color={tokens.colors.steel} />
  </a>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const UtviklingsOversiktContainer = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Min utvikling"
        subtitle="Oversikt over din spillerutvikling"
      />

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Category Progress */}
        <CategoryProgressCard category={CURRENT_CATEGORY} />

        {/* Quick Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px',
          margin: '24px 0',
        }}>
          <QuickLinkCard
            icon={Zap}
            title="Breaking Points"
            description={`${BREAKING_POINTS.length} aktive fokusomrader`}
            href="/utvikling/breaking-points"
            color={tokens.colors.error}
          />
          <QuickLinkCard
            icon={TrendingUp}
            title="Kategori-fremgang"
            description="Se detaljert fremgang per kategori"
            href="/utvikling/kategori"
            color={tokens.colors.success}
          />
          <QuickLinkCard
            icon={Target}
            title="Benchmark-historie"
            description="Sammenlign med tidligere resultater"
            href="/utvikling/benchmark"
            color={tokens.colors.primary}
          />
        </div>

        {/* Development Areas */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
            marginBottom: '12px',
          }}>
            Utviklingsomrader
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '10px',
          }}>
            {DEVELOPMENT_AREAS.map((area) => (
              <DevelopmentAreaCard
                key={area.id}
                area={area}
                onClick={() => { /* TODO: Navigate to area detail */ }}
              />
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: '14px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}>
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: tokens.colors.charcoal,
              margin: 0,
            }}>
              Siste prestasjoner
            </h3>
            <a href="/achievements" style={{
              fontSize: '13px',
              color: tokens.colors.primary,
              textDecoration: 'none',
            }}>
              Se alle
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {RECENT_ACHIEVEMENTS.map((achievement) => (
              <div
                key={achievement.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px',
                  backgroundColor: tokens.colors.snow,
                  borderRadius: '8px',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: `${tokens.colors.gold}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Star size={16} color={tokens.colors.gold} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: tokens.colors.charcoal }}>
                    {achievement.title}
                  </div>
                  <div style={{ fontSize: '11px', color: tokens.colors.steel }}>
                    {new Date(achievement.date).toLocaleDateString('nb-NO')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtviklingsOversiktContainer;
