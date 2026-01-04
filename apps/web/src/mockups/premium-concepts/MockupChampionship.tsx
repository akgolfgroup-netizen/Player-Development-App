/**
 * =====================================================
 * MOCKUP 3: "CHAMPIONSHIP" - Luxury Sports Brand Experience
 * =====================================================
 *
 * Konsept: High-end luksus sportsmerke-estetikk med:
 * - Svart/hvitt base med gull-accenter
 * - Sterk typografi inspirert av sportssendinger
 * - Magazine-style layout med asymmetri
 * - Premium materiale-følelse (leather, metal, velvet)
 * - Dynamiske grafer og real-time data visualiseringer
 *
 * Målgruppe: Ambisiøse spillere som vil ha en "professional athlete" opplevelse
 * Inspirasjon: Rolex, Nike Elite, Formula 1, ESPN+, The Athletic
 */

import React from 'react';

// ============================================
// CHAMPIONSHIP DESIGN TOKENS
// ============================================
const champTokens = {
  colors: {
    // Primære
    black: '#0a0a0a',
    charcoal: '#1a1a1a',
    graphite: '#2d2d2d',
    steel: '#4a4a4a',

    // Gull-spekter
    goldDark: '#8b6914',
    gold: '#c9a227',
    goldLight: '#e8d48a',
    goldShine: '#ffd700',

    // Hvit-spekter
    white: '#ffffff',
    offWhite: '#f8f8f8',
    cream: '#f0ede6',
    silver: '#c0c0c0',

    // Accenter
    championRed: '#c41e3a',
    victoryGreen: '#228b22',
    royalBlue: '#1a237e',

    // Tekst
    textWhite: '#ffffff',
    textGold: '#c9a227',
    textMuted: 'rgba(255, 255, 255, 0.5)',
  },

  fonts: {
    display: '"Bebas Neue", "Impact", sans-serif',
    heading: '"Montserrat", "Helvetica Neue", sans-serif',
    body: '"Inter", -apple-system, sans-serif',
    mono: '"JetBrains Mono", "SF Mono", monospace',
  },

  gradients: {
    goldShimmer: 'linear-gradient(135deg, #8b6914 0%, #c9a227 25%, #ffd700 50%, #c9a227 75%, #8b6914 100%)',
    blackFade: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
    spotlight: 'radial-gradient(ellipse at top, rgba(201, 162, 39, 0.15) 0%, transparent 60%)',
    cardGlow: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
  },

  shadows: {
    gold: '0 4px 30px rgba(201, 162, 39, 0.3)',
    deep: '0 20px 60px rgba(0, 0, 0, 0.8)',
    inset: 'inset 0 1px 0 rgba(255,255,255,0.05)',
  },
};

// ============================================
// KOMPONENTER
// ============================================

const GoldBorder: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div style={{
    background: champTokens.gradients.goldShimmer,
    padding: '2px',
    borderRadius: '16px',
    boxShadow: champTokens.shadows.gold,
    ...style,
  }}>
    <div style={{
      background: champTokens.colors.charcoal,
      borderRadius: '14px',
      height: '100%',
    }}>
      {children}
    </div>
  </div>
);

const ChampionCard: React.FC<{
  children: React.ReactNode;
  accent?: 'gold' | 'none';
  style?: React.CSSProperties;
}> = ({ children, accent = 'none', style }) => (
  <div style={{
    background: champTokens.colors.charcoal,
    borderRadius: '16px',
    border: accent === 'gold'
      ? `1px solid ${champTokens.colors.gold}`
      : '1px solid rgba(255,255,255,0.08)',
    boxShadow: accent === 'gold' ? champTokens.shadows.gold : 'none',
    position: 'relative',
    overflow: 'hidden',
    ...style,
  }}>
    {/* Top highlight */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: accent === 'gold'
        ? champTokens.gradients.goldShimmer
        : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    }} />
    {children}
  </div>
);

const BigNumber: React.FC<{
  value: string;
  unit?: string;
  label: string;
  trend?: { value: string; positive: boolean };
}> = ({ value, unit, label, trend }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'center',
      gap: '4px',
    }}>
      <span style={{
        fontFamily: champTokens.fonts.display,
        fontSize: '72px',
        fontWeight: 400,
        color: champTokens.colors.textWhite,
        letterSpacing: '-2px',
        lineHeight: 1,
      }}>
        {value}
      </span>
      {unit && (
        <span style={{
          fontFamily: champTokens.fonts.heading,
          fontSize: '24px',
          fontWeight: 300,
          color: champTokens.colors.gold,
        }}>
          {unit}
        </span>
      )}
    </div>
    <div style={{
      fontFamily: champTokens.fonts.heading,
      fontSize: '12px',
      fontWeight: 600,
      color: champTokens.colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: '3px',
      marginTop: '8px',
    }}>
      {label}
    </div>
    {trend && (
      <div style={{
        marginTop: '12px',
        fontFamily: champTokens.fonts.mono,
        fontSize: '13px',
        fontWeight: 500,
        color: trend.positive ? champTokens.colors.victoryGreen : champTokens.colors.championRed,
      }}>
        {trend.positive ? '▲' : '▼'} {trend.value}
      </div>
    )}
  </div>
);

const LiveIndicator: React.FC = () => (
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(196, 30, 58, 0.2)',
    border: `1px solid ${champTokens.colors.championRed}`,
    borderRadius: '999px',
  }}>
    <div style={{
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: champTokens.colors.championRed,
      animation: 'pulse 1.5s ease-in-out infinite',
    }} />
    <span style={{
      fontFamily: champTokens.fonts.heading,
      fontSize: '11px',
      fontWeight: 700,
      color: champTokens.colors.championRed,
      textTransform: 'uppercase',
      letterSpacing: '2px',
    }}>
      Live Tracking
    </span>
  </div>
);

const RankBadge: React.FC<{
  rank: number;
  total: number;
  category: string;
}> = ({ rank, total, category }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
  }}>
    <div style={{
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      background: rank <= 3 ? champTokens.gradients.goldShimmer : champTokens.colors.graphite,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: champTokens.fonts.display,
      fontSize: '24px',
      color: rank <= 3 ? champTokens.colors.black : champTokens.colors.textWhite,
    }}>
      #{rank}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{
        fontFamily: champTokens.fonts.heading,
        fontSize: '14px',
        fontWeight: 600,
        color: champTokens.colors.textWhite,
        marginBottom: '4px',
      }}>
        {category}
      </div>
      <div style={{
        fontFamily: champTokens.fonts.body,
        fontSize: '13px',
        color: champTokens.colors.textMuted,
      }}>
        av {total} spillere i din region
      </div>
    </div>
    {rank <= 3 && (
      <div style={{ fontSize: '24px' }}>
        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
      </div>
    )}
  </div>
);

const PerformanceBar: React.FC<{
  label: string;
  value: number;
  maxValue: number;
  unit: string;
}> = ({ label, value, maxValue, unit }) => {
  const percentage = (value / maxValue) * 100;

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '8px',
      }}>
        <span style={{
          fontFamily: champTokens.fonts.heading,
          fontSize: '13px',
          fontWeight: 500,
          color: champTokens.colors.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: champTokens.fonts.mono,
          fontSize: '16px',
          fontWeight: 600,
          color: champTokens.colors.textWhite,
        }}>
          {value} <span style={{ color: champTokens.colors.gold }}>{unit}</span>
        </span>
      </div>
      <div style={{
        height: '4px',
        background: champTokens.colors.graphite,
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          background: champTokens.gradients.goldShimmer,
          borderRadius: '2px',
          transition: 'width 1s ease-out',
        }} />
      </div>
    </div>
  );
};

const ScheduleItem: React.FC<{
  time: string;
  event: string;
  location: string;
  type: 'training' | 'tournament' | 'analysis';
}> = ({ time, event, location, type }) => {
  const typeColors = {
    training: champTokens.colors.gold,
    tournament: champTokens.colors.championRed,
    analysis: champTokens.colors.royalBlue,
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'stretch',
      gap: '16px',
      padding: '16px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{
        width: '4px',
        background: typeColors[type],
        borderRadius: '2px',
      }} />
      <div style={{
        fontFamily: champTokens.fonts.mono,
        fontSize: '14px',
        fontWeight: 600,
        color: champTokens.colors.textMuted,
        minWidth: '60px',
      }}>
        {time}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: champTokens.fonts.heading,
          fontSize: '15px',
          fontWeight: 600,
          color: champTokens.colors.textWhite,
          marginBottom: '4px',
        }}>
          {event}
        </div>
        <div style={{
          fontFamily: champTokens.fonts.body,
          fontSize: '13px',
          color: champTokens.colors.textMuted,
        }}>
          📍 {location}
        </div>
      </div>
    </div>
  );
};

// ============================================
// HOVEDKOMPONENT - CHAMPIONSHIP DASHBOARD
// ============================================
export const MockupChampionship: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: champTokens.colors.black,
      fontFamily: champTokens.fonts.body,
      position: 'relative',
    }}>
      {/* Spotlight effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '600px',
        background: champTokens.gradients.spotlight,
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        padding: '32px 48px',
        maxWidth: '1600px',
        margin: '0 auto',
      }}>

        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '48px',
          paddingBottom: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Logo */}
            <div style={{
              fontFamily: champTokens.fonts.display,
              fontSize: '28px',
              color: champTokens.colors.gold,
              letterSpacing: '4px',
            }}>
              AK GOLF
            </div>
            <div style={{
              width: '1px',
              height: '32px',
              background: 'rgba(255,255,255,0.2)',
            }} />
            <div style={{
              fontFamily: champTokens.fonts.heading,
              fontSize: '12px',
              fontWeight: 600,
              color: champTokens.colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '3px',
            }}>
              Elite Development Program
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <LiveIndicator />

            {/* Profile */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: champTokens.fonts.heading,
                  fontSize: '14px',
                  fontWeight: 600,
                  color: champTokens.colors.textWhite,
                }}>
                  Magnus Nordvik
                </div>
                <div style={{
                  fontFamily: champTokens.fonts.body,
                  fontSize: '12px',
                  color: champTokens.colors.gold,
                }}>
                  Elite Member
                </div>
              </div>
              <GoldBorder>
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: champTokens.colors.gold,
                }}>
                  MN
                </div>
              </GoldBorder>
            </div>
          </div>
        </header>

        {/* Hero Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '32px',
          marginBottom: '48px',
        }}>
          <ChampionCard accent="gold" style={{ padding: '40px' }}>
            <BigNumber
              value="68.4"
              label="Handicap Index"
              trend={{ value: '2.1 denne måneden', positive: true }}
            />
          </ChampionCard>
          <ChampionCard style={{ padding: '40px' }}>
            <BigNumber
              value="247"
              label="Treningsøkter"
              trend={{ value: '12%', positive: true }}
            />
          </ChampionCard>
          <ChampionCard style={{ padding: '40px' }}>
            <BigNumber
              value="14"
              label="Turneringer"
            />
          </ChampionCard>
          <ChampionCard style={{ padding: '40px' }}>
            <BigNumber
              value="3"
              unit="rd"
              label="Nasjonal rangering"
              trend={{ value: '2 plasser', positive: true }}
            />
          </ChampionCard>
        </div>

        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '32px',
        }}>

          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Performance Metrics */}
            <ChampionCard style={{ padding: '32px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
              }}>
                <h2 style={{
                  fontFamily: champTokens.fonts.display,
                  fontSize: '24px',
                  fontWeight: 400,
                  color: champTokens.colors.textWhite,
                  letterSpacing: '2px',
                  margin: 0,
                }}>
                  YTELSESDATA
                </h2>
                <select style={{
                  background: champTokens.colors.graphite,
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontFamily: champTokens.fonts.body,
                  fontSize: '13px',
                  color: champTokens.colors.textWhite,
                  cursor: 'pointer',
                }}>
                  <option>Siste 30 dager</option>
                  <option>Siste 90 dager</option>
                  <option>I år</option>
                </select>
              </div>

              <PerformanceBar label="Driver Carry" value={245} maxValue={300} unit="m" />
              <PerformanceBar label="Greens in Regulation" value={67} maxValue={100} unit="%" />
              <PerformanceBar label="Putts per Runde" value={31} maxValue={40} unit="avg" />
              <PerformanceBar label="Sand Saves" value={48} maxValue={100} unit="%" />
              <PerformanceBar label="Scrambling" value={52} maxValue={100} unit="%" />
            </ChampionCard>

            {/* Rankings */}
            <ChampionCard style={{ padding: '32px' }}>
              <h2 style={{
                fontFamily: champTokens.fonts.display,
                fontSize: '24px',
                fontWeight: 400,
                color: champTokens.colors.textWhite,
                letterSpacing: '2px',
                margin: '0 0 24px 0',
              }}>
                DINE RANGERINGER
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <RankBadge rank={3} total={156} category="Junior Tour Norge" />
                <RankBadge rank={1} total={24} category="AK Golf Academy" />
                <RankBadge rank={7} total={89} category="Vestland Region" />
              </div>
            </ChampionCard>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Schedule */}
            <ChampionCard style={{ padding: '32px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}>
                <h2 style={{
                  fontFamily: champTokens.fonts.display,
                  fontSize: '20px',
                  fontWeight: 400,
                  color: champTokens.colors.textWhite,
                  letterSpacing: '2px',
                  margin: 0,
                }}>
                  DENNE UKEN
                </h2>
                <span style={{
                  fontFamily: champTokens.fonts.mono,
                  fontSize: '12px',
                  color: champTokens.colors.gold,
                }}>
                  3 aktiviteter
                </span>
              </div>

              <ScheduleItem
                time="15:00"
                event="Putting Session"
                location="Indoor Green, AK Academy"
                type="training"
              />
              <ScheduleItem
                time="10:00"
                event="Video Analyse"
                location="Tech Lab"
                type="analysis"
              />
              <ScheduleItem
                time="08:00"
                event="Vestland Junior Cup"
                location="Meland Golfklubb"
                type="tournament"
              />
            </ChampionCard>

            {/* Coach Message */}
            <GoldBorder>
              <div style={{ padding: '28px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: champTokens.colors.graphite,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                  }}>
                    👨‍🏫
                  </div>
                  <div>
                    <div style={{
                      fontFamily: champTokens.fonts.heading,
                      fontSize: '14px',
                      fontWeight: 600,
                      color: champTokens.colors.textWhite,
                    }}>
                      Erik Hansen
                    </div>
                    <div style={{
                      fontFamily: champTokens.fonts.body,
                      fontSize: '12px',
                      color: champTokens.colors.gold,
                    }}>
                      Head Coach
                    </div>
                  </div>
                </div>
                <p style={{
                  fontFamily: champTokens.fonts.body,
                  fontSize: '14px',
                  color: champTokens.colors.textMuted,
                  lineHeight: 1.7,
                  margin: 0,
                  fontStyle: 'italic',
                }}>
                  "Magnus, fantastisk fremgang denne måneden! La oss fokusere på
                  approach-spillet før Vestland Cup. Jeg har lagt inn noen nye
                  øvelser i treningsplanen din."
                </p>
              </div>
            </GoldBorder>

            {/* Quick Actions */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}>
              {[
                { icon: '📊', label: 'Analyse' },
                { icon: '📹', label: 'Video' },
                { icon: '📅', label: 'Booking' },
                { icon: '💬', label: 'Chat' },
              ].map((action) => (
                <ChampionCard
                  key={action.label}
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>
                    {action.icon}
                  </div>
                  <div style={{
                    fontFamily: champTokens.fonts.heading,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: champTokens.colors.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                  }}>
                    {action.label}
                  </div>
                </ChampionCard>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div style={{
          marginTop: '64px',
          textAlign: 'center',
          padding: '48px 0',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{
            fontFamily: champTokens.fonts.display,
            fontSize: '32px',
            color: champTokens.colors.gold,
            letterSpacing: '8px',
            marginBottom: '16px',
          }}>
            EXCELLENCE IS NOT A DESTINATION
          </div>
          <div style={{
            fontFamily: champTokens.fonts.heading,
            fontSize: '14px',
            color: champTokens.colors.textMuted,
            letterSpacing: '4px',
            textTransform: 'uppercase',
          }}>
            It's a continuous journey
          </div>
        </div>

      </div>

      {/* Pulse animation for live indicator */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default MockupChampionship;
