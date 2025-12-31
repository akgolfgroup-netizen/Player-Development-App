import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Target, Award, ChevronRight, Star,
  Zap, ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import { SectionTitle, SubSectionTitle } from '../../components/typography';
import Card from '../../ui/primitives/Card';
import Badge from '../../ui/primitives/Badge.primitive';

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
  if (trend === 'up') return <ArrowUp size={14} style={{ color: 'var(--success)' }} />;
  if (trend === 'down') return <ArrowDown size={14} style={{ color: 'var(--error)' }} />;
  return <Minus size={14} style={{ color: 'var(--text-tertiary)' }} />;
};

const getStatusColor = (status) => {
  switch (status) {
    case 'improving': return 'var(--success)';
    case 'stable': return 'var(--accent)';
    case 'needs_attention': return 'var(--error)';
    default: return 'var(--text-secondary)';
  }
};

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'improving': return 'success';
    case 'stable': return 'accent';
    case 'needs_attention': return 'error';
    default: return 'neutral';
  }
};

// ============================================================================
// CATEGORY PROGRESS CARD
// ============================================================================

const CategoryProgressCard = ({ category }) => (
  <Card variant="default" padding="lg">
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
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-accent-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Award size={24} style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Nåværende kategori</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Kategori {category.level}
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)' }}>
          {category.points}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>poeng</div>
      </div>
    </div>

    <div style={{ marginBottom: '8px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: 'var(--text-secondary)',
        marginBottom: '6px',
      }}>
        <span>Fremgang mot Kategori {category.nextLevel}</span>
        <span>{category.pointsNeeded} poeng igjen</span>
      </div>
      <div style={{
        height: '8px',
        backgroundColor: 'var(--bg-neutral-subtle)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${category.percentToNext}%`,
          backgroundColor: 'var(--accent)',
          borderRadius: '4px',
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  </Card>
);

// ============================================================================
// DEVELOPMENT AREA CARD
// ============================================================================

const DevelopmentAreaCard = ({ area, onClick }) => (
  <Card
    variant="default"
    padding="md"
    onClick={onClick}
    style={{ cursor: 'pointer' }}
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
          borderRadius: 'var(--radius-sm)',
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
            color: 'var(--text-primary)',
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
              color: area.trend === 'up' ? 'var(--success)' :
                     area.trend === 'down' ? 'var(--error)' : 'var(--text-tertiary)',
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
        <ChevronRight size={18} color="var(--text-tertiary)" />
      </div>
    </div>
  </Card>
);

// ============================================================================
// QUICK LINKS SECTION
// ============================================================================

const QuickLinkCard = ({ icon: Icon, title, description, href, color }) => (
  <a href={href} style={{ textDecoration: 'none' }}>
    <Card variant="default" padding="md" style={{ cursor: 'pointer' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-sm)',
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
            color: 'var(--text-primary)',
          }}>
            {title}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginTop: '2px',
          }}>
            {description}
          </div>
        </div>
        <ChevronRight size={18} color="var(--text-tertiary)" />
      </div>
    </Card>
  </a>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const UtviklingsOversiktContainer = () => {
  const navigate = useNavigate();

  const handleAreaClick = (areaId) => {
    // Navigate to benchmark page with area filter
    navigate(`/utvikling/benchmark?area=${areaId}`);
  };

  return (
    <div style={{ maxWidth: '1536px', margin: '0 auto' }}>
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
            description={`${BREAKING_POINTS.length} aktive fokusområder`}
            href="/utvikling/breaking-points"
            color="var(--error)"
          />
          <QuickLinkCard
            icon={TrendingUp}
            title="Kategori-fremgang"
            description="Se detaljert fremgang per kategori"
            href="/utvikling/kategori"
            color="var(--success)"
          />
          <QuickLinkCard
            icon={Target}
            title="Benchmark-historie"
            description="Sammenlign med tidligere resultater"
            href="/utvikling/benchmark"
            color="var(--accent)"
          />
        </div>

        {/* Development Areas */}
        <div style={{ marginBottom: '24px' }}>
          <SectionTitle style={{ marginBottom: '12px' }}>
            Utviklingsområder
          </SectionTitle>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '10px',
          }}>
            {DEVELOPMENT_AREAS.map((area) => (
              <DevelopmentAreaCard
                key={area.id}
                area={area}
                onClick={() => handleAreaClick(area.id)}
              />
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <Card variant="default" padding="md">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}>
            <SubSectionTitle>
              Siste prestasjoner
            </SubSectionTitle>
            <a href="/achievements" style={{
              fontSize: '13px',
              color: 'var(--accent)',
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
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'color-mix(in srgb, var(--warning) 15%, transparent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Star size={16} color="var(--warning)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {achievement.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {new Date(achievement.date).toLocaleDateString('nb-NO')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
    </div>
  );
};

export default UtviklingsOversiktContainer;
