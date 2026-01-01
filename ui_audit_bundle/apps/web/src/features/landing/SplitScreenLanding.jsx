/**
 * SplitScreenLanding Component
 *
 * Premium split-screen landing page with hero section on left,
 * feature list on right. Based on the "Split with screenshot" pattern.
 *
 * Design principles:
 * - Clean, premium aesthetic
 * - Clear CTA: "Kom i gang" → navigates to login
 * - Forest green (--accent) as brand color
 * - Mobile responsive (stacks vertically)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AKLogo } from '../../components/branding/AKLogo';
import { PageTitle, SectionTitle } from '../../components/typography';
import { triggerHaptic } from '../../hooks/useHaptic';

// Feature list icons
const icons = {
  calendar: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  trending: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  target: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  award: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  video: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
};

// Features data
const features = [
  {
    name: 'Treningsplanlegging',
    description: 'Personlige treningsplaner tilpasset ditt nivå og mål.',
    icon: icons.calendar,
  },
  {
    name: 'Fremgangsanalyse',
    description: 'Se din utvikling med tydelige statistikker og grafer.',
    icon: icons.trending,
  },
  {
    name: 'Måloppfølging',
    description: 'Sett mål og følg progresjonen mot neste kategori.',
    icon: icons.target,
  },
  {
    name: 'Trener-kommunikasjon',
    description: 'Direkte kontakt med din trener for veiledning.',
    icon: icons.users,
  },
  {
    name: 'Kategorisystem',
    description: 'Tydelig nivåinndeling fra D til A med klare krav.',
    icon: icons.award,
  },
  {
    name: 'Videoanalyse',
    description: 'Last opp og analyser dine svinger over tid.',
    icon: icons.video,
  },
];

export function SplitScreenLanding() {
  const navigate = useNavigate();

  return (
    <div style={styles.container} className="split-screen-landing">
      {/* Left panel - Hero */}
      <div style={styles.leftPanel} className="split-screen-left">
        <div style={styles.leftContent}>
          {/* Logo */}
          <div style={styles.logoContainer}>
            <AKLogo size={48} color="var(--accent)" />
            <span style={styles.logoText}>AK Golf</span>
          </div>

          {/* Tagline */}
          <div style={styles.tagline}>
            <span style={styles.taglineDot} />
            <span>Individuell Utviklingsplan</span>
          </div>

          {/* Headline */}
          <PageTitle style={styles.headline} className="split-headline">
            Utvikle ditt <span style={styles.headlineAccent}>golfspill</span> systematisk
          </PageTitle>

          {/* Description */}
          <p style={styles.description} className="split-description">
            AK Golf IUP gir deg verktøyene for å spore fremgang, følge treningsplaner og nå dine golfmål.
            Fra kategori D til A – vi er med deg hele veien.
          </p>

          {/* CTAs */}
          <div style={styles.ctas} className="split-ctas">
            <button
              style={styles.primaryButton}
              onClick={() => {
                triggerHaptic.tap();
                navigate('/login?signup=true');
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-dark)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              GET STARTED
            </button>
            <button
              style={styles.secondaryButton}
              onClick={() => {
                triggerHaptic.select();
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Les mer <span aria-hidden="true">→</span>
            </button>
          </div>

          {/* Trust indicators */}
          <div style={styles.trustSection}>
            <p style={styles.trustText}>Brukt av utøvere i AK Golf Academy</p>
          </div>
        </div>
      </div>

      {/* Right panel - Features */}
      <div style={styles.rightPanel} id="features" className="split-screen-right">
        <div style={styles.rightContent}>
          <div style={styles.rightHeader}>
            <SectionTitle style={styles.rightTitle}>Alt du trenger</SectionTitle>
            <p style={styles.rightSubtitle}>
              Verktøy og funksjoner for systematisk golfutvikling
            </p>
          </div>

          <dl style={styles.featureList}>
            {features.map((feature) => (
              <div key={feature.name} style={styles.featureItem}>
                <dt style={styles.featureHeader}>
                  <div style={styles.featureIcon}>
                    {feature.icon}
                  </div>
                  <span style={styles.featureName}>{feature.name}</span>
                </dt>
                <dd style={styles.featureDescription}>
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>

          {/* Secondary CTA in features section */}
          <div style={styles.featuresCta}>
            <button
              style={styles.featureButton}
              onClick={() => {
                triggerHaptic.tap();
                navigate('/login?signup=true');
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
                e.currentTarget.style.color = 'var(--text-inverse)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--accent)';
              }}
            >
              Sign up today →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
  },

  // Left panel
  leftPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    backgroundColor: 'var(--background-white)',
  },
  leftContent: {
    maxWidth: '480px',
    width: '100%',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
  },
  tagline: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--accent)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  taglineDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
  },
  headline: {
    margin: '0 0 20px 0',
    fontSize: '48px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  headlineAccent: {
    color: 'var(--accent)',
  },
  description: {
    margin: '0 0 32px 0',
    fontSize: '18px',
    lineHeight: 1.6,
    color: 'var(--text-secondary)',
  },
  ctas: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '40px',
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 28px',
    backgroundColor: 'var(--accent)',
    color: 'var(--text-inverse)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 20px',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'color 0.15s ease',
  },
  trustSection: {
    paddingTop: '24px',
    borderTop: '1px solid var(--border-subtle)',
  },
  trustText: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--text-tertiary)',
  },

  // Right panel
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    backgroundColor: 'var(--background-surface)',
    borderLeft: '1px solid var(--border-subtle)',
  },
  rightContent: {
    maxWidth: '480px',
    width: '100%',
  },
  rightHeader: {
    marginBottom: '40px',
  },
  rightTitle: {
    margin: '0 0 8px 0',
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
  },
  rightSubtitle: {
    margin: 0,
    fontSize: '16px',
    color: 'var(--text-secondary)',
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    margin: 0,
    padding: 0,
  },
  featureItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  featureHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: 0,
  },
  featureIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    backgroundColor: 'var(--accent-muted)',
    color: 'var(--accent)',
    borderRadius: '10px',
    flexShrink: 0,
  },
  featureName: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  featureDescription: {
    margin: '0 0 0 52px',
    fontSize: '14px',
    lineHeight: 1.5,
    color: 'var(--text-secondary)',
  },
  featuresCta: {
    marginTop: '40px',
    paddingTop: '24px',
    borderTop: '1px solid var(--border-default)',
  },
  featureButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: 'var(--accent)',
    border: '2px solid var(--accent)',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};

// Add responsive styles via CSS-in-JS media query helper
// Note: For production, consider using CSS modules or a media query hook

export default SplitScreenLanding;
