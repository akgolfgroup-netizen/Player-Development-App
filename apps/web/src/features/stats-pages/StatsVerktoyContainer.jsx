import React, { useState } from 'react';
import {
  Calculator, Target, TrendingUp, BarChart2, PieChart, ChevronRight,
  Activity, Info
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';

// ============================================================================
// MOCK DATA
// ============================================================================

const TOOLS = [
  {
    id: 'handicap',
    name: 'Handicap-kalkulator',
    description: 'Beregn forventet handicap basert pa dine siste runder',
    icon: Calculator,
    color: tokens.colors.primary,
    category: 'calculators',
  },
  {
    id: 'strokes_gained',
    name: 'Strokes Gained analyse',
    description: 'Se hvor du vinner og taper slag mot feltet',
    icon: TrendingUp,
    color: tokens.colors.success,
    category: 'analysis',
  },
  {
    id: 'course_strategy',
    name: 'Banestrategi',
    description: 'Planlegg strategi for kommende baner',
    icon: Target,
    color: tokens.colors.gold,
    category: 'planning',
  },
  {
    id: 'performance_trends',
    name: 'Ytelsestrender',
    description: 'Se utvikling over tid i alle kategorier',
    icon: Activity,
    color: tokens.colors.error,
    category: 'analysis',
  },
  {
    id: 'club_distances',
    name: 'Kollelengder',
    description: 'Dine gjennomsnittlige avstander per kolle',
    icon: BarChart2,
    color: tokens.colors.primary,
    category: 'reference',
  },
  {
    id: 'score_distribution',
    name: 'Scorefordeling',
    description: 'Analyser dine scorer pa ulike hulltyper',
    icon: PieChart,
    color: tokens.colors.gold,
    category: 'analysis',
  },
];

const QUICK_STATS = {
  currentHandicap: 4.2,
  avgScore: 76.3,
  bestRound: 68,
  roundsThisYear: 24,
};

const CLUB_DISTANCES = [
  { club: 'Driver', avgCarry: 265, avgTotal: 285 },
  { club: '3-Wood', avgCarry: 235, avgTotal: 250 },
  { club: '5-Wood', avgCarry: 220, avgTotal: 232 },
  { club: '4-Hybrid', avgCarry: 205, avgTotal: 215 },
  { club: '5-Iron', avgCarry: 190, avgTotal: 198 },
  { club: '6-Iron', avgCarry: 178, avgTotal: 185 },
  { club: '7-Iron', avgCarry: 165, avgTotal: 172 },
  { club: '8-Iron', avgCarry: 152, avgTotal: 158 },
  { club: '9-Iron', avgCarry: 140, avgTotal: 145 },
  { club: 'PW', avgCarry: 128, avgTotal: 132 },
  { club: 'GW', avgCarry: 115, avgTotal: 118 },
  { club: 'SW', avgCarry: 100, avgTotal: 102 },
  { club: 'LW', avgCarry: 85, avgTotal: 87 },
];

const STROKES_GAINED = {
  total: +1.2,
  categories: [
    { name: 'Off the Tee', value: +0.5, trend: 'up' },
    { name: 'Approach', value: +0.8, trend: 'up' },
    { name: 'Around the Green', value: -0.3, trend: 'down' },
    { name: 'Putting', value: +0.2, trend: 'neutral' },
  ],
};

// ============================================================================
// TOOL CARD COMPONENT
// ============================================================================

const ToolCard = ({ tool, onClick }) => {
  const Icon = tool.icon;

  return (
    <div
      onClick={() => onClick(tool)}
      style={{
        backgroundColor: tokens.colors.white,
        borderRadius: '16px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: `${tool.color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={24} color={tool.color} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
            margin: '0 0 4px 0',
          }}>
            {tool.name}
          </h3>
          <p style={{
            fontSize: '13px',
            color: tokens.colors.steel,
            margin: 0,
            lineHeight: 1.4,
          }}>
            {tool.description}
          </p>
        </div>
        <ChevronRight size={20} color={tokens.colors.steel} />
      </div>
    </div>
  );
};

// ============================================================================
// CLUB DISTANCES WIDGET
// ============================================================================

const ClubDistancesWidget = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedClubs = showAll ? CLUB_DISTANCES : CLUB_DISTANCES.slice(0, 6);

  return (
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BarChart2 size={18} color={tokens.colors.primary} />
          <h3 style={{
            fontSize: '15px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
            margin: 0,
          }}>
            Mine kollelengder
          </h3>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            fontSize: '12px',
            color: tokens.colors.primary,
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          {showAll ? 'Vis mindre' : 'Vis alle'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '80px 1fr 1fr',
          gap: '8px',
          padding: '8px 0',
          borderBottom: `1px solid ${tokens.colors.mist}`,
        }}>
          <span style={{ fontSize: '11px', color: tokens.colors.steel, fontWeight: 500 }}>Kolle</span>
          <span style={{ fontSize: '11px', color: tokens.colors.steel, fontWeight: 500, textAlign: 'center' }}>Carry</span>
          <span style={{ fontSize: '11px', color: tokens.colors.steel, fontWeight: 500, textAlign: 'center' }}>Total</span>
        </div>

        {displayedClubs.map((club, idx) => (
          <div
            key={idx}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 1fr',
              gap: '8px',
              padding: '8px 0',
              borderBottom: idx < displayedClubs.length - 1 ? `1px solid ${tokens.colors.mist}` : 'none',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 500, color: tokens.colors.charcoal }}>
              {club.club}
            </span>
            <span style={{ fontSize: '13px', color: tokens.colors.charcoal, textAlign: 'center' }}>
              {club.avgCarry}m
            </span>
            <span style={{ fontSize: '13px', color: tokens.colors.charcoal, textAlign: 'center' }}>
              {club.avgTotal}m
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// STROKES GAINED WIDGET
// ============================================================================

const StrokesGainedWidget = () => {
  return (
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '16px',
      }}>
        <TrendingUp size={18} color={tokens.colors.success} />
        <h3 style={{
          fontSize: '15px',
          fontWeight: 600,
          color: tokens.colors.charcoal,
          margin: 0,
        }}>
          Strokes Gained
        </h3>
        <div style={{
          marginLeft: 'auto',
          padding: '4px 10px',
          borderRadius: '6px',
          backgroundColor: STROKES_GAINED.total >= 0 ? `${tokens.colors.success}15` : `${tokens.colors.error}15`,
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 600,
            color: STROKES_GAINED.total >= 0 ? tokens.colors.success : tokens.colors.error,
          }}>
            {STROKES_GAINED.total >= 0 ? '+' : ''}{STROKES_GAINED.total}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {STROKES_GAINED.categories.map((cat, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{
              fontSize: '13px',
              color: tokens.colors.charcoal,
              flex: 1,
            }}>
              {cat.name}
            </span>
            <div style={{
              width: '100px',
              height: '8px',
              backgroundColor: tokens.colors.snow,
              borderRadius: '4px',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                height: '100%',
                width: `${Math.abs(cat.value) * 25}%`,
                backgroundColor: cat.value >= 0 ? tokens.colors.success : tokens.colors.error,
                borderRadius: '4px',
                transform: cat.value >= 0 ? 'translateX(0)' : 'translateX(-100%)',
              }} />
            </div>
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: cat.value >= 0 ? tokens.colors.success : tokens.colors.error,
              width: '40px',
              textAlign: 'right',
            }}>
              {cat.value >= 0 ? '+' : ''}{cat.value}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '16px',
        padding: '10px',
        backgroundColor: `${tokens.colors.primary}08`,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <Info size={14} color={tokens.colors.primary} />
        <span style={{ fontSize: '12px', color: tokens.colors.charcoal }}>
          Basert pa dine siste 10 turneringsrunder
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// QUICK STATS WIDGET
// ============================================================================

const QuickStatsWidget = ({ stats }) => {
  return (
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <h3 style={{
        fontSize: '15px',
        fontWeight: 600,
        color: tokens.colors.charcoal,
        margin: '0 0 16px 0',
      }}>
        Hurtigstatistikk
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
      }}>
        <div style={{
          padding: '14px',
          backgroundColor: `${tokens.colors.primary}08`,
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '22px', fontWeight: 700, color: tokens.colors.primary }}>
            {stats.currentHandicap}
          </div>
          <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Handicap</div>
        </div>
        <div style={{
          padding: '14px',
          backgroundColor: `${tokens.colors.success}08`,
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '22px', fontWeight: 700, color: tokens.colors.success }}>
            {stats.avgScore}
          </div>
          <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Gj.sn. score</div>
        </div>
        <div style={{
          padding: '14px',
          backgroundColor: `${tokens.colors.gold}08`,
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '22px', fontWeight: 700, color: tokens.colors.gold }}>
            {stats.bestRound}
          </div>
          <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Beste runde</div>
        </div>
        <div style={{
          padding: '14px',
          backgroundColor: tokens.colors.snow,
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '22px', fontWeight: 700, color: tokens.colors.charcoal }}>
            {stats.roundsThisYear}
          </div>
          <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Runder i ar</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const StatsVerktoyContainer = () => {
  const handleToolClick = () => {
    // TODO: Navigate to tool or open modal
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Stats verktoy"
        subtitle="Analyser og forbedre spillet ditt"
      />

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '24px',
        }}>
          {/* Left: Tools */}
          <div>
            <h2 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: tokens.colors.charcoal,
              margin: '0 0 16px 0',
            }}>
              Verktoy
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '12px',
            }}>
              {TOOLS.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onClick={handleToolClick}
                />
              ))}
            </div>
          </div>

          {/* Right: Widgets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <QuickStatsWidget stats={QUICK_STATS} />
            <StrokesGainedWidget />
            <ClubDistancesWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsVerktoyContainer;
