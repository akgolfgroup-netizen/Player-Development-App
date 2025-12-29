import React from 'react';

/**
 * LandingHero
 *
 * Full-viewport hero section for landing/welcome pages.
 * Follows AK Golf Design System v3.0 (Premium Light - Forest Green).
 *
 * Design principles:
 * - Semantic tokens only (no raw hex/rgb values)
 * - Clear visual hierarchy: Tagline > Headline > Description > CTAs
 * - Touch-friendly targets (44px minimum)
 * - Responsive: stacked on mobile, side-by-side on desktop
 * - No decorative gradients (per UI Canon v1.2)
 */

interface LandingHeroProps {
  /** Small tagline/label above headline */
  tagline?: string;
  /** Main headline */
  headline: string;
  /** Highlighted part of headline (rendered in brand color) */
  headlineHighlight?: string;
  /** Supporting description text */
  description?: string;
  /** Primary CTA button */
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Secondary CTA button */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Optional hero image/illustration */
  heroImage?: React.ReactNode;
  /** Navigation items (optional) */
  navigation?: Array<{
    label: string;
    onClick: () => void;
    isActive?: boolean;
  }>;
  /** User menu (for logged-in state) */
  userMenu?: React.ReactNode;
}

const LandingHero: React.FC<LandingHeroProps> = ({
  tagline,
  headline,
  headlineHighlight,
  description,
  primaryAction,
  secondaryAction,
  heroImage,
  navigation,
  userMenu,
}) => {
  return (
    <div style={styles.container}>
      {/* Header with navigation */}
      {(navigation || userMenu) && (
        <header style={styles.header}>
          <nav style={styles.nav}>
            {/* Logo area */}
            <div style={styles.logoArea}>
              <span style={styles.logo}>AK Golf</span>
            </div>

            {/* Navigation links */}
            {navigation && (
              <div style={styles.navLinks}>
                {navigation.map((item, index) => (
                  <button
                    key={index}
                    style={{
                      ...styles.navLink,
                      ...(item.isActive ? styles.navLinkActive : {}),
                    }}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* User menu */}
            {userMenu && <div style={styles.userMenu}>{userMenu}</div>}
          </nav>
        </header>
      )}

      {/* Main hero content */}
      <div style={styles.heroContent}>
        {/* Text content */}
        <div style={styles.textContent}>
          {/* Tagline */}
          {tagline && (
            <p style={styles.tagline}>{tagline}</p>
          )}

          {/* Headline */}
          <h1 style={styles.headline}>
            {headlineHighlight ? (
              <>
                {headline.split(headlineHighlight)[0]}
                <span style={styles.headlineHighlight}>{headlineHighlight}</span>
                {headline.split(headlineHighlight)[1]}
              </>
            ) : (
              headline
            )}
          </h1>

          {/* Description */}
          {description && (
            <p style={styles.description}>{description}</p>
          )}

          {/* CTAs */}
          {(primaryAction || secondaryAction) && (
            <div style={styles.actions}>
              {primaryAction && (
                <button
                  style={styles.primaryButton}
                  onClick={primaryAction.onClick}
                  className="btn-interactive"
                >
                  {primaryAction.label}
                </button>
              )}
              {secondaryAction && (
                <button
                  style={styles.secondaryButton}
                  onClick={secondaryAction.onClick}
                  className="btn-interactive"
                >
                  {secondaryAction.label}
                  <span style={styles.arrowIcon} aria-hidden="true">→</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Hero image/illustration */}
        {heroImage && (
          <div style={styles.imageArea}>
            {heroImage}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--background-white)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: 'var(--spacing-4) var(--spacing-6)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1280px',
    margin: '0 auto',
    width: '100%',
  },
  logoArea: {
    flexShrink: 0,
  },
  logo: {
    fontSize: 'var(--font-size-title3)',
    fontWeight: 700,
    color: 'var(--text-brand)',
    letterSpacing: '-0.01em',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
  },
  navLink: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '44px',
    padding: '0 var(--spacing-4)',
    fontSize: 'var(--font-size-subheadline)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'color 0.15s ease, background-color 0.15s ease',
  },
  navLinkActive: {
    color: 'var(--text-brand)',
    backgroundColor: 'var(--accent-muted)',
  },
  userMenu: {
    flexShrink: 0,
  },
  heroContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-8) var(--spacing-6)',
    maxWidth: '1280px',
    margin: '0 auto',
    width: '100%',
    gap: 'var(--spacing-8)',
  },
  textContent: {
    flex: 1,
    maxWidth: '640px',
  },
  tagline: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--text-brand)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 var(--spacing-3) 0',
  },
  headline: {
    fontSize: 'var(--font-size-largeTitle)',
    lineHeight: 'var(--line-height-largeTitle)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: '0 0 var(--spacing-4) 0',
    letterSpacing: '-0.02em',
  },
  headlineHighlight: {
    color: 'var(--text-brand)',
  },
  description: {
    fontSize: 'var(--font-size-body)',
    lineHeight: 'var(--line-height-body)',
    color: 'var(--text-secondary)',
    margin: '0 0 var(--spacing-6) 0',
    maxWidth: '520px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-4)',
    flexWrap: 'wrap',
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '48px',
    padding: '0 var(--spacing-6)',
    backgroundColor: 'var(--ak-primary)',
    color: 'var(--text-inverse)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--font-size-subheadline)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: 'var(--shadow-sm)',
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '48px',
    padding: '0 var(--spacing-4)',
    backgroundColor: 'transparent',
    color: 'var(--text-brand)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--font-size-subheadline)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'color 0.15s ease',
    gap: 'var(--spacing-2)',
  },
  arrowIcon: {
    fontSize: 'var(--font-size-subheadline)',
    transition: 'transform 0.15s ease',
  },
  imageArea: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '560px',
  },
};

export default LandingHero;

/**
 * Responsive CSS to add to index.css:
 *
 * @media (max-width: 767px) {
 *   .landing-hero-content {
 *     flex-direction: column;
 *     text-align: center;
 *   }
 *   .landing-hero-text {
 *     max-width: 100%;
 *   }
 *   .landing-hero-actions {
 *     justify-content: center;
 *   }
 *   .landing-nav-links {
 *     display: none;
 *   }
 * }
 */
