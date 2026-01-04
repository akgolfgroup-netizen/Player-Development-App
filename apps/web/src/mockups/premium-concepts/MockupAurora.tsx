/**
 * =====================================================
 * MOCKUP 1: "AURORA" - Dark Mode Glassmorphism Experience
 * =====================================================
 *
 * Konsept: Moderne, futuristisk premium-opplevelse med:
 * - Mørk bakgrunn med aurora borealis-inspirerte gradienter
 * - Glassmorfisme (frosted glass) effekter
 * - Neon-aktige accent farger
 * - Smooth animasjoner og micro-interactions
 * - 3D-lignende dybde med layered cards
 *
 * Målgruppe: Gen-Z og unge golfer som vil ha en "gaming"-inspirert UI
 * Inspirasjon: Spotify, Discord, Apple Music, moderne dashboard apps
 */

import React from 'react';

// ============================================
// AURORA DESIGN TOKENS
// ============================================
const auroraTokens = {
  colors: {
    // Bakgrunner
    bgDeep: '#0a0a0f',
    bgSurface: '#12121a',
    bgCard: 'rgba(255, 255, 255, 0.03)',
    bgGlass: 'rgba(255, 255, 255, 0.05)',

    // Aurora gradienter
    auroraGreen: '#00ff87',
    auroraTeal: '#00f5d4',
    auroraPurple: '#9b5de5',
    auroraBlue: '#00bbf9',
    auroraPink: '#f15bb5',

    // Tekst
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textMuted: 'rgba(255, 255, 255, 0.4)',

    // Accenter
    success: '#00ff87',
    warning: '#ffd60a',
    error: '#ff006e',
    gold: '#ffd700',
  },

  gradients: {
    aurora: 'linear-gradient(135deg, #00ff87 0%, #00f5d4 25%, #9b5de5 50%, #00bbf9 75%, #f15bb5 100%)',
    auroraSubtle: 'linear-gradient(135deg, rgba(0,255,135,0.1) 0%, rgba(155,93,229,0.1) 50%, rgba(0,187,249,0.1) 100%)',
    cardGlow: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)',
    goldPremium: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 50%, #ff8c00 100%)',
  },

  shadows: {
    glow: '0 0 40px rgba(0, 255, 135, 0.15)',
    glowPurple: '0 0 40px rgba(155, 93, 229, 0.2)',
    card: '0 8px 32px rgba(0, 0, 0, 0.4)',
    elevated: '0 20px 60px rgba(0, 0, 0, 0.5)',
  },

  blur: {
    glass: 'blur(20px)',
    subtle: 'blur(10px)',
  },
};

// ============================================
// KOMPONENTER
// ============================================

const AuroraBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    minHeight: '100vh',
    background: auroraTokens.colors.bgDeep,
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Aurora gradient overlay */}
    <div style={{
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: `
        radial-gradient(ellipse at 20% 20%, rgba(0, 255, 135, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 30%, rgba(155, 93, 229, 0.12) 0%, transparent 50%),
        radial-gradient(ellipse at 60% 80%, rgba(0, 187, 249, 0.1) 0%, transparent 50%)
      `,
      animation: 'aurora-float 20s ease-in-out infinite',
    }} />
    <div style={{ position: 'relative', zIndex: 1 }}>
      {children}
    </div>
  </div>
);

const GlassCard: React.FC<{
  children: React.ReactNode;
  glow?: 'green' | 'purple' | 'gold';
  style?: React.CSSProperties;
}> = ({ children, glow, style }) => (
  <div style={{
    background: auroraTokens.colors.bgGlass,
    backdropFilter: auroraTokens.blur.glass,
    WebkitBackdropFilter: auroraTokens.blur.glass,
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: glow === 'green' ? auroraTokens.shadows.glow
             : glow === 'purple' ? auroraTokens.shadows.glowPurple
             : glow === 'gold' ? '0 0 40px rgba(255, 215, 0, 0.2)'
             : auroraTokens.shadows.card,
    ...style,
  }}>
    {children}
  </div>
);

const NeonBadge: React.FC<{
  label: string;
  variant?: 'success' | 'gold' | 'purple'
}> = ({ label, variant = 'success' }) => {
  const colors = {
    success: { bg: 'rgba(0, 255, 135, 0.15)', text: '#00ff87', border: 'rgba(0, 255, 135, 0.3)' },
    gold: { bg: 'rgba(255, 215, 0, 0.15)', text: '#ffd700', border: 'rgba(255, 215, 0, 0.3)' },
    purple: { bg: 'rgba(155, 93, 229, 0.15)', text: '#9b5de5', border: 'rgba(155, 93, 229, 0.3)' },
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 14px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 600,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      background: colors[variant].bg,
      color: colors[variant].text,
      border: `1px solid ${colors[variant].border}`,
      boxShadow: `0 0 20px ${colors[variant].bg}`,
    }}>
      {label}
    </span>
  );
};

const ProgressRing: React.FC<{
  value: number;
  size?: number;
  label?: string;
}> = ({ value, size = 120, label }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle with gradient */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ff87" />
            <stop offset="50%" stopColor="#00f5d4" />
            <stop offset="100%" stopColor="#9b5de5" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(0, 255, 135, 0.5))',
            transition: 'stroke-dashoffset 1s ease-out',
          }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '28px',
          fontWeight: 700,
          color: auroraTokens.colors.textPrimary,
          letterSpacing: '-1px',
        }}>
          {value}%
        </div>
        {label && (
          <div style={{
            fontSize: '11px',
            color: auroraTokens.colors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: string;
  value: string;
  label: string;
  trend?: { value: string; positive: boolean };
}> = ({ icon, value, label, trend }) => (
  <GlassCard style={{ padding: '24px', flex: 1 }}>
    <div style={{
      fontSize: '24px',
      marginBottom: '16px',
      filter: 'grayscale(0)',
    }}>
      {icon}
    </div>
    <div style={{
      fontSize: '32px',
      fontWeight: 700,
      color: auroraTokens.colors.textPrimary,
      marginBottom: '4px',
    }}>
      {value}
    </div>
    <div style={{
      fontSize: '13px',
      color: auroraTokens.colors.textMuted,
      marginBottom: trend ? '12px' : 0,
    }}>
      {label}
    </div>
    {trend && (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 10px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: 600,
        background: trend.positive
          ? 'rgba(0, 255, 135, 0.15)'
          : 'rgba(255, 0, 110, 0.15)',
        color: trend.positive
          ? auroraTokens.colors.success
          : auroraTokens.colors.error,
      }}>
        {trend.positive ? '↑' : '↓'} {trend.value}
      </div>
    )}
  </GlassCard>
);

// ============================================
// HOVEDKOMPONENT - AURORA DASHBOARD
// ============================================
export const MockupAurora: React.FC = () => {
  return (
    <AuroraBackground>
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px'
            }}>
              <h1 style={{
                fontSize: '28px',
                fontWeight: 700,
                color: auroraTokens.colors.textPrimary,
                margin: 0,
              }}>
                God morgen, Magnus
              </h1>
              <NeonBadge label="Pro Member" variant="gold" />
            </div>
            <p style={{
              fontSize: '15px',
              color: auroraTokens.colors.textSecondary,
              margin: 0,
            }}>
              Din treningsstreak er på 🔥 14 dager
            </p>
          </div>

          {/* Avatar med glow */}
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: auroraTokens.gradients.aurora,
            padding: '3px',
            boxShadow: auroraTokens.shadows.glow,
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: auroraTokens.colors.bgSurface,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 600,
              color: auroraTokens.colors.textPrimary,
            }}>
              MN
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '32px',
        }}>
          <StatCard
            icon="🏌️"
            value="247"
            label="Treningsøkter i år"
            trend={{ value: '+12%', positive: true }}
          />
          <StatCard
            icon="🎯"
            value="68.2"
            label="Handicap Index"
            trend={{ value: '-2.3', positive: true }}
          />
          <StatCard
            icon="📊"
            value="82%"
            label="Måloppnåelse"
            trend={{ value: '+5%', positive: true }}
          />
          <StatCard
            icon="🏆"
            value="7"
            label="Turneringer"
            trend={{ value: '+3', positive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px'
        }}>

          {/* Progress Overview */}
          <GlassCard glow="green" style={{ padding: '32px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '32px',
            }}>
              <div>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: auroraTokens.colors.textPrimary,
                  margin: '0 0 8px 0',
                }}>
                  Utviklingsplan 2025
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: auroraTokens.colors.textMuted,
                  margin: 0,
                }}>
                  Team Norway IUP Framework
                </p>
              </div>
              <NeonBadge label="På skjema" variant="success" />
            </div>

            {/* Progress Rings */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
              <ProgressRing value={85} label="Teknikk" />
              <ProgressRing value={72} label="Mental" />
              <ProgressRing value={91} label="Fysisk" />
              <ProgressRing value={68} label="Taktikk" />
            </div>

            {/* Quick Actions */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '32px',
            }}>
              {['Logg trening', 'Se analyse', 'Book coach'].map((action) => (
                <button
                  key={action}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: auroraTokens.colors.textPrimary,
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {action}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Upcoming Sessions */}
          <GlassCard glow="purple" style={{ padding: '28px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: auroraTokens.colors.textPrimary,
              margin: '0 0 24px 0',
            }}>
              Kommende økter
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { time: 'I dag 15:00', title: 'Putting-drill', coach: 'Erik H.', type: 'technique' },
                { time: 'I morgen 10:00', title: 'Video-analyse', coach: 'Mari S.', type: 'analysis' },
                { time: 'Ons 14:00', title: 'Styrketrening', coach: 'Gym', type: 'physical' },
              ].map((session, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: session.type === 'technique'
                      ? 'linear-gradient(135deg, #00ff87, #00f5d4)'
                      : session.type === 'analysis'
                      ? 'linear-gradient(135deg, #9b5de5, #00bbf9)'
                      : 'linear-gradient(135deg, #ffd60a, #ff8c00)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}>
                    {session.type === 'technique' ? '🎯'
                    : session.type === 'analysis' ? '📹'
                    : '💪'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: auroraTokens.colors.textPrimary,
                      marginBottom: '4px',
                    }}>
                      {session.title}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: auroraTokens.colors.textMuted,
                    }}>
                      {session.time} • {session.coach}
                    </div>
                  </div>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: auroraTokens.colors.textMuted,
                    fontSize: '14px',
                  }}>
                    →
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Achievement Banner */}
        <GlassCard
          glow="gold"
          style={{
            marginTop: '24px',
            padding: '24px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 140, 0, 0.05) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              fontSize: '40px',
              filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))',
            }}>
              🏆
            </div>
            <div>
              <div style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#ffd700',
                marginBottom: '4px',
              }}>
                Ny prestasjon låst opp!
              </div>
              <div style={{
                fontSize: '14px',
                color: auroraTokens.colors.textSecondary,
              }}>
                "Putting Master" - 50 puttinger på rad under 2 meter
              </div>
            </div>
          </div>
          <button style={{
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            background: auroraTokens.gradients.goldPremium,
            color: '#000',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(255, 215, 0, 0.3)',
          }}>
            Se alle prestasjoner
          </button>
        </GlassCard>

      </div>

      {/* CSS Keyframes for animations */}
      <style>{`
        @keyframes aurora-float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(5%, 5%) rotate(5deg); }
          50% { transform: translate(-5%, 10%) rotate(-5deg); }
          75% { transform: translate(10%, -5%) rotate(3deg); }
        }
      `}</style>
    </AuroraBackground>
  );
};

export default MockupAurora;
