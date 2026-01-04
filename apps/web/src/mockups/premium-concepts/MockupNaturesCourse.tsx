/**
 * =====================================================
 * MOCKUP 2: "NATURE'S COURSE" - Immersive Visual Experience
 * =====================================================
 *
 * Konsept: Foto-sentrisk, naturnært premium-design med:
 * - Store hero-bilder av golfbaner og natur
 * - Organiske former og myke kurver
 * - Jordfarger møter moderne typografi
 * - Card-basert layout med "stacked paper" effekt
 * - Rolig, meditativ estetikk som reflekterer golfens natur
 *
 * Målgruppe: Tradisjonelle golfere som setter pris på sportens eleganse
 * Inspirasjon: National Geographic, Airbnb Luxe, Patagonia, Apple nature wallpapers
 */

import React from 'react';

// ============================================
// NATURE'S COURSE DESIGN TOKENS
// ============================================
const natureTokens = {
  colors: {
    // Naturfarger
    forestDeep: '#1a3a2f',
    forestMedium: '#2d5a47',
    forestLight: '#4a7c62',
    sage: '#8fbc8b',
    meadow: '#b8d4a8',

    // Himmel & vann
    skyLight: '#e8f4f8',
    skyMedium: '#c5dfe8',
    oceanDeep: '#1e4d5c',

    // Jord
    earthBrown: '#6b4423',
    sandLight: '#f5f1e8',
    sandMedium: '#e8dcc8',
    warmWhite: '#fdfbf7',

    // Accenter
    sunsetOrange: '#e8734a',
    goldenHour: '#d4a84b',
    morningMist: 'rgba(255, 255, 255, 0.85)',

    // Tekst
    textDark: '#1a1a18',
    textMedium: '#4a4a45',
    textLight: '#7a7a72',
  },

  fonts: {
    heading: '"Playfair Display", Georgia, serif',
    body: '"Source Sans Pro", -apple-system, sans-serif',
    accent: '"Cormorant Garamond", Georgia, serif',
  },

  shadows: {
    soft: '0 4px 20px rgba(26, 58, 47, 0.08)',
    medium: '0 8px 40px rgba(26, 58, 47, 0.12)',
    layered: `
      0 1px 2px rgba(0,0,0,0.02),
      0 2px 4px rgba(0,0,0,0.02),
      0 4px 8px rgba(0,0,0,0.02),
      0 8px 16px rgba(0,0,0,0.02),
      0 16px 32px rgba(0,0,0,0.02)
    `,
  },

  gradients: {
    forestFade: 'linear-gradient(180deg, #1a3a2f 0%, #2d5a47 100%)',
    sunrise: 'linear-gradient(180deg, #fdfbf7 0%, #f5f1e8 50%, #e8dcc8 100%)',
    skyToForest: 'linear-gradient(180deg, #e8f4f8 0%, #c5dfe8 30%, #8fbc8b 70%, #4a7c62 100%)',
    imageOverlay: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(26,58,47,0.7) 100%)',
  },
};

// ============================================
// KOMPONENTER
// ============================================

const OrganicCard: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'inset';
  style?: React.CSSProperties;
}> = ({ children, variant = 'default', style }) => {
  const variantStyles = {
    default: {
      background: natureTokens.colors.warmWhite,
      boxShadow: natureTokens.shadows.soft,
    },
    elevated: {
      background: natureTokens.colors.warmWhite,
      boxShadow: natureTokens.shadows.layered,
    },
    inset: {
      background: natureTokens.colors.sandLight,
      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.04)',
    },
  };

  return (
    <div style={{
      borderRadius: '24px',
      overflow: 'hidden',
      ...variantStyles[variant],
      ...style,
    }}>
      {children}
    </div>
  );
};

const HeroSection: React.FC<{
  imageUrl: string;
  title: string;
  subtitle: string;
}> = ({ imageUrl, title, subtitle }) => (
  <div style={{
    position: 'relative',
    height: '400px',
    borderRadius: '32px',
    overflow: 'hidden',
    marginBottom: '40px',
  }}>
    {/* Background Image Placeholder */}
    <div style={{
      position: 'absolute',
      inset: 0,
      background: natureTokens.gradients.skyToForest,
      // I produksjon: background: `url(${imageUrl}) center/cover`,
    }}>
      {/* Simulert golfbane-element */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '10%',
        width: '80%',
        height: '40%',
        background: 'linear-gradient(180deg, #8fbc8b 0%, #4a7c62 100%)',
        borderRadius: '50% 50% 0 0 / 20% 20% 0 0',
        opacity: 0.6,
      }} />
      {/* Flagg-ikon */}
      <div style={{
        position: 'absolute',
        top: '35%',
        right: '30%',
        fontSize: '32px',
        textShadow: '0 4px 12px rgba(0,0,0,0.2)',
      }}>
        ⛳
      </div>
    </div>

    {/* Gradient overlay */}
    <div style={{
      position: 'absolute',
      inset: 0,
      background: natureTokens.gradients.imageOverlay,
    }} />

    {/* Content */}
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '48px',
    }}>
      <h1 style={{
        fontFamily: natureTokens.fonts.heading,
        fontSize: '48px',
        fontWeight: 400,
        color: '#fff',
        margin: '0 0 12px 0',
        textShadow: '0 2px 20px rgba(0,0,0,0.3)',
      }}>
        {title}
      </h1>
      <p style={{
        fontFamily: natureTokens.fonts.body,
        fontSize: '18px',
        color: 'rgba(255,255,255,0.85)',
        margin: 0,
        maxWidth: '500px',
      }}>
        {subtitle}
      </p>
    </div>

    {/* Time & Weather Widget */}
    <div style={{
      position: 'absolute',
      top: '32px',
      right: '32px',
      background: natureTokens.colors.morningMist,
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}>
      <div style={{ fontSize: '28px' }}>☀️</div>
      <div>
        <div style={{
          fontSize: '13px',
          color: natureTokens.colors.textLight,
          marginBottom: '2px',
        }}>
          Perfekt golfvær
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: 600,
          color: natureTokens.colors.textDark,
        }}>
          18°C • Lett bris
        </div>
      </div>
    </div>
  </div>
);

const CategoryPill: React.FC<{
  icon: string;
  label: string;
  active?: boolean;
}> = ({ icon, label, active = false }) => (
  <button style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 24px',
    borderRadius: '999px',
    border: active ? 'none' : `1px solid ${natureTokens.colors.sandMedium}`,
    background: active ? natureTokens.colors.forestDeep : 'transparent',
    color: active ? '#fff' : natureTokens.colors.textMedium,
    fontFamily: natureTokens.fonts.body,
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  }}>
    <span style={{ fontSize: '18px' }}>{icon}</span>
    {label}
  </button>
);

const StatisticCard: React.FC<{
  value: string;
  label: string;
  icon: string;
  trend?: string;
}> = ({ value, label, icon, trend }) => (
  <OrganicCard variant="elevated" style={{ padding: '32px', flex: 1 }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '20px',
    }}>
      <span style={{ fontSize: '32px' }}>{icon}</span>
      {trend && (
        <span style={{
          fontFamily: natureTokens.fonts.body,
          fontSize: '13px',
          fontWeight: 600,
          color: natureTokens.colors.forestMedium,
          background: `${natureTokens.colors.meadow}40`,
          padding: '6px 12px',
          borderRadius: '8px',
        }}>
          {trend}
        </span>
      )}
    </div>
    <div style={{
      fontFamily: natureTokens.fonts.heading,
      fontSize: '42px',
      fontWeight: 400,
      color: natureTokens.colors.textDark,
      marginBottom: '8px',
      letterSpacing: '-1px',
    }}>
      {value}
    </div>
    <div style={{
      fontFamily: natureTokens.fonts.body,
      fontSize: '14px',
      color: natureTokens.colors.textLight,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    }}>
      {label}
    </div>
  </OrganicCard>
);

const JourneyCard: React.FC<{
  month: string;
  title: string;
  description: string;
  progress: number;
  color: string;
}> = ({ month, title, description, progress, color }) => (
  <OrganicCard variant="elevated" style={{
    display: 'flex',
    overflow: 'visible',
  }}>
    {/* Left color bar */}
    <div style={{
      width: '6px',
      background: color,
      borderRadius: '4px 0 0 4px',
    }} />

    <div style={{ flex: 1, padding: '24px' }}>
      <div style={{
        fontFamily: natureTokens.fonts.accent,
        fontSize: '13px',
        fontStyle: 'italic',
        color: natureTokens.colors.textLight,
        marginBottom: '8px',
      }}>
        {month}
      </div>
      <h3 style={{
        fontFamily: natureTokens.fonts.heading,
        fontSize: '20px',
        fontWeight: 500,
        color: natureTokens.colors.textDark,
        margin: '0 0 8px 0',
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: natureTokens.fonts.body,
        fontSize: '14px',
        color: natureTokens.colors.textMedium,
        margin: '0 0 16px 0',
        lineHeight: 1.6,
      }}>
        {description}
      </p>

      {/* Progress bar */}
      <div style={{
        height: '6px',
        background: natureTokens.colors.sandMedium,
        borderRadius: '3px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: color,
          borderRadius: '3px',
          transition: 'width 0.8s ease-out',
        }} />
      </div>
      <div style={{
        fontFamily: natureTokens.fonts.body,
        fontSize: '12px',
        color: natureTokens.colors.textLight,
        marginTop: '8px',
        textAlign: 'right',
      }}>
        {progress}% fullført
      </div>
    </div>
  </OrganicCard>
);

const QuoteBlock: React.FC<{
  quote: string;
  author: string;
}> = ({ quote, author }) => (
  <div style={{
    background: natureTokens.gradients.forestFade,
    borderRadius: '24px',
    padding: '48px',
    textAlign: 'center',
  }}>
    <div style={{
      fontFamily: natureTokens.fonts.heading,
      fontSize: '28px',
      fontWeight: 400,
      fontStyle: 'italic',
      color: '#fff',
      lineHeight: 1.5,
      marginBottom: '20px',
      maxWidth: '600px',
      margin: '0 auto 20px auto',
    }}>
      "{quote}"
    </div>
    <div style={{
      fontFamily: natureTokens.fonts.body,
      fontSize: '14px',
      color: natureTokens.colors.sage,
      textTransform: 'uppercase',
      letterSpacing: '2px',
    }}>
      — {author}
    </div>
  </div>
);

// ============================================
// HOVEDKOMPONENT - NATURE'S COURSE DASHBOARD
// ============================================
export const MockupNaturesCourse: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: natureTokens.gradients.sunrise,
      fontFamily: natureTokens.fonts.body,
    }}>
      <div style={{ padding: '32px 48px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Minimalist Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}>
          <div style={{
            fontFamily: natureTokens.fonts.accent,
            fontSize: '24px',
            fontWeight: 500,
            color: natureTokens.colors.forestDeep,
            fontStyle: 'italic',
          }}>
            Din Golfjourney
          </div>

          <nav style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center',
          }}>
            {['Oversikt', 'Trening', 'Statistikk', 'Minner'].map((item, i) => (
              <a
                key={item}
                href="#"
                style={{
                  fontFamily: natureTokens.fonts.body,
                  fontSize: '15px',
                  color: i === 0 ? natureTokens.colors.forestDeep : natureTokens.colors.textMedium,
                  textDecoration: 'none',
                  fontWeight: i === 0 ? 600 : 400,
                }}
              >
                {item}
              </a>
            ))}

            {/* Avatar */}
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: natureTokens.colors.forestLight,
              border: `3px solid ${natureTokens.colors.sandLight}`,
              boxShadow: natureTokens.shadows.soft,
            }} />
          </nav>
        </header>

        {/* Hero Section */}
        <HeroSection
          imageUrl="/images/golf-course-morning.jpg"
          title="God morgen, Magnus"
          subtitle="Dagen byr på perfekte forhold for å jobbe med det korte spillet. Din coach har lagt opp et nytt program."
        />

        {/* Category Pills */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '40px',
          flexWrap: 'wrap',
        }}>
          <CategoryPill icon="🎯" label="Alle mål" active />
          <CategoryPill icon="🏌️" label="Teknikk" />
          <CategoryPill icon="🧠" label="Mental trening" />
          <CategoryPill icon="💪" label="Fysisk" />
          <CategoryPill icon="📊" label="Analyse" />
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '48px',
        }}>
          <StatisticCard
            icon="🏆"
            value="68.4"
            label="Handicap Index"
            trend="↓ 2.1 siste måned"
          />
          <StatisticCard
            icon="🎯"
            value="247"
            label="Treningsøkter"
            trend="↑ 12%"
          />
          <StatisticCard
            icon="⛳"
            value="14"
            label="Runder spilt"
          />
          <StatisticCard
            icon="📈"
            value="82%"
            label="Måloppnåelse"
            trend="På skjema"
          />
        </div>

        {/* Journey Section */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontFamily: natureTokens.fonts.heading,
            fontSize: '28px',
            fontWeight: 400,
            color: natureTokens.colors.textDark,
            marginBottom: '24px',
          }}>
            Din utviklingsreise 2025
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}>
            <JourneyCard
              month="Januar - Mars"
              title="Grunnlagsperiode"
              description="Bygg et solid fundament med teknikk-fokus og kondisjonstrening."
              progress={100}
              color={natureTokens.colors.forestMedium}
            />
            <JourneyCard
              month="April - Juni"
              title="Konkurranseforberedelse"
              description="Intensiver treningen og delta på regionale turneringer."
              progress={65}
              color={natureTokens.colors.goldenHour}
            />
            <JourneyCard
              month="Juli - September"
              title="Hovedsesong"
              description="Fokus på de viktigste turneringene og peak performance."
              progress={0}
              color={natureTokens.colors.sunsetOrange}
            />
          </div>
        </div>

        {/* Quote Section */}
        <QuoteBlock
          quote="Golf er et spill der du konkurrerer mot deg selv. Det handler om å bli litt bedre hver dag."
          author="Din Coach, Erik Hansen"
        />

        {/* Recent Activity */}
        <div style={{ marginTop: '48px' }}>
          <h2 style={{
            fontFamily: natureTokens.fonts.heading,
            fontSize: '24px',
            fontWeight: 400,
            color: natureTokens.colors.textDark,
            marginBottom: '24px',
          }}>
            Nylige høydepunkter
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
          }}>
            {[
              { emoji: '🎯', title: 'Personlig rekord', desc: 'Putting under 30 slag' },
              { emoji: '📹', title: 'Ny videoanalyse', desc: 'Swing forbedret 15%' },
              { emoji: '🏅', title: 'Turnering', desc: '3. plass junior cup' },
              { emoji: '💪', title: 'Fysisk test', desc: 'Nye mål oppnådd' },
            ].map((item, i) => (
              <OrganicCard key={i} variant="default" style={{ padding: '24px' }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>{item.emoji}</div>
                <div style={{
                  fontFamily: natureTokens.fonts.heading,
                  fontSize: '16px',
                  fontWeight: 500,
                  color: natureTokens.colors.textDark,
                  marginBottom: '6px',
                }}>
                  {item.title}
                </div>
                <div style={{
                  fontFamily: natureTokens.fonts.body,
                  fontSize: '14px',
                  color: natureTokens.colors.textLight,
                }}>
                  {item.desc}
                </div>
              </OrganicCard>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MockupNaturesCourse;
