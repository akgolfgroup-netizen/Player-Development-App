import React from 'react';
import { PageTitle, SectionTitle, SubSectionTitle, CardTitle } from '../../components/typography';

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

interface Feature {
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Icon (SVG element or React node) */
  icon?: React.ReactNode;
}

interface FooterLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  /** Footer link sections */
  sections?: FooterSection[];
  /** Contact information */
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  /** Social media links */
  social?: Array<{
    platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube';
    href: string;
  }>;
  /** Copyright text */
  copyright?: string;
}

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
  /** Features section */
  features?: {
    title?: string;
    subtitle?: string;
    items: Feature[];
  };
  /** Footer section */
  footer?: FooterProps;
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
  features,
  footer,
}) => {
  // Social media icons
  const getSocialIcon = (platform: string) => {
    const icons: Record<string, React.ReactNode> = {
      facebook: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      instagram: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ),
      twitter: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      linkedin: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      youtube: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    };
    return icons[platform] || null;
  };
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
          <PageTitle style={styles.headline}>
            {headlineHighlight ? (
              <>
                {headline.split(headlineHighlight)[0]}
                <span style={styles.headlineHighlight}>{headlineHighlight}</span>
                {headline.split(headlineHighlight)[1]}
              </>
            ) : (
              headline
            )}
          </PageTitle>

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

      {/* Features Section */}
      {features && features.items.length > 0 && (
        <section style={styles.featuresSection}>
          <div style={styles.featuresContainer}>
            {/* Section header */}
            {(features.title || features.subtitle) && (
              <div style={styles.featuresSectionHeader}>
                {features.title && (
                  <SectionTitle style={styles.featuresTitle}>{features.title}</SectionTitle>
                )}
                {features.subtitle && (
                  <p style={styles.featuresSubtitle}>{features.subtitle}</p>
                )}
              </div>
            )}

            {/* Features grid */}
            <div style={styles.featuresGrid}>
              {features.items.map((feature, index) => (
                <div key={index} style={styles.featureCard}>
                  {/* Icon */}
                  {feature.icon && (
                    <div style={styles.featureIconWrapper}>
                      {feature.icon}
                    </div>
                  )}
                  {/* Content */}
                  <SubSectionTitle style={styles.featureCardTitle}>{feature.title}</SubSectionTitle>
                  <p style={styles.featureCardDescription}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      {footer && (
        <footer style={styles.footer}>
          <div style={styles.footerContainer}>
            {/* Main footer content */}
            <div style={styles.footerMain}>
              {/* Brand column */}
              <div style={styles.footerBrand}>
                <span style={styles.footerLogo}>AK Golf</span>
                <p style={styles.footerBrandText}>
                  Systematisk talentutvikling for ambisiøse golfspillere.
                </p>
                {/* Social links */}
                {footer.social && footer.social.length > 0 && (
                  <div style={styles.socialLinks}>
                    {footer.social.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.socialLink}
                        aria-label={item.platform}
                      >
                        {getSocialIcon(item.platform)}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Link sections */}
              {footer.sections && footer.sections.length > 0 && (
                <div style={styles.footerSections}>
                  {footer.sections.map((section, index) => (
                    <div key={index} style={styles.footerSection}>
                      <CardTitle style={styles.footerSectionTitle}>{section.title}</CardTitle>
                      <ul style={styles.footerLinks}>
                        {section.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            {link.href ? (
                              <a href={link.href} style={styles.footerLink}>
                                {link.label}
                              </a>
                            ) : (
                              <button
                                onClick={link.onClick}
                                style={styles.footerLinkButton}
                              >
                                {link.label}
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Contact column */}
              {footer.contact && (
                <div style={styles.footerContact}>
                  <CardTitle style={styles.footerSectionTitle}>Kontakt</CardTitle>
                  <div style={styles.contactInfo}>
                    {footer.contact.email && (
                      <a href={`mailto:${footer.contact.email}`} style={styles.contactItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        {footer.contact.email}
                      </a>
                    )}
                    {footer.contact.phone && (
                      <a href={`tel:${footer.contact.phone}`} style={styles.contactItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        {footer.contact.phone}
                      </a>
                    )}
                    {footer.contact.address && (
                      <span style={styles.contactItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        {footer.contact.address}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer bottom */}
            <div style={styles.footerBottom}>
              <p style={styles.copyright}>
                {footer.copyright || `© ${new Date().getFullYear()} AK Golf. Alle rettigheter reservert.`}
              </p>
            </div>
          </div>
        </footer>
      )}
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
    maxWidth: '1536px',
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
    maxWidth: '1536px',
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
  // Features Section Styles
  featuresSection: {
    backgroundColor: 'var(--background-surface)',
    borderTop: '1px solid var(--border-subtle)',
    padding: 'var(--spacing-10) var(--spacing-6)',
  },
  featuresContainer: {
    maxWidth: '1536px',
    margin: '0 auto',
  },
  featuresSectionHeader: {
    textAlign: 'center',
    marginBottom: 'var(--spacing-8)',
  },
  featuresTitle: {
    fontSize: 'var(--font-size-title2)',
    lineHeight: 'var(--line-height-title2)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: '0 0 var(--spacing-3) 0',
    letterSpacing: '-0.01em',
  },
  featuresSubtitle: {
    fontSize: 'var(--font-size-body)',
    lineHeight: 'var(--line-height-body)',
    color: 'var(--text-secondary)',
    margin: 0,
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'var(--spacing-6)',
  },
  featureCard: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-6)',
    boxShadow: 'var(--shadow-card)',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  },
  featureIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    backgroundColor: 'var(--accent-muted)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-brand)',
    marginBottom: 'var(--spacing-4)',
  },
  featureCardTitle: {
    fontSize: 'var(--font-size-headline)',
    lineHeight: 'var(--line-height-headline)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: '0 0 var(--spacing-2) 0',
  },
  featureCardDescription: {
    fontSize: 'var(--font-size-subheadline)',
    lineHeight: 'var(--line-height-subheadline)',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  // Footer Styles
  footer: {
    backgroundColor: 'var(--ak-primary)',
    color: 'var(--text-inverse)',
    padding: 'var(--spacing-10) var(--spacing-6) var(--spacing-6)',
  },
  footerContainer: {
    maxWidth: '1536px',
    margin: '0 auto',
  },
  footerMain: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 'var(--spacing-8)',
    marginBottom: 'var(--spacing-8)',
  },
  footerBrand: {
    maxWidth: '280px',
  },
  footerLogo: {
    display: 'block',
    fontSize: 'var(--font-size-title3)',
    fontWeight: 700,
    color: 'var(--text-inverse)',
    letterSpacing: '-0.01em',
    marginBottom: 'var(--spacing-3)',
  },
  footerBrandText: {
    fontSize: 'var(--font-size-footnote)',
    lineHeight: 'var(--line-height-footnote)',
    color: 'var(--text-inverse)',
    opacity: 0.8,
    margin: '0 0 var(--spacing-4) 0',
  },
  socialLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    backgroundColor: 'var(--background-white)',
    color: 'var(--ak-primary)',
    borderRadius: 'var(--radius-full)',
    transition: 'transform 0.15s ease, opacity 0.15s ease',
  },
  footerSections: {
    display: 'flex',
    gap: 'var(--spacing-8)',
    flexWrap: 'wrap',
  },
  footerSection: {
    minWidth: '140px',
  },
  footerSectionTitle: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--text-inverse)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 var(--spacing-4) 0',
  },
  footerLinks: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },
  footerLink: {
    display: 'inline-block',
    fontSize: 'var(--font-size-subheadline)',
    lineHeight: 'var(--line-height-subheadline)',
    color: 'var(--text-inverse)',
    opacity: 0.8,
    textDecoration: 'none',
    transition: 'opacity 0.15s ease',
    padding: '4px 0',
  },
  footerLinkButton: {
    display: 'inline-block',
    fontSize: 'var(--font-size-subheadline)',
    lineHeight: 'var(--line-height-subheadline)',
    color: 'var(--text-inverse)',
    opacity: 0.8,
    backgroundColor: 'transparent',
    border: 'none',
    padding: '4px 0',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'opacity 0.15s ease',
  },
  footerContact: {
    minWidth: '200px',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    fontSize: 'var(--font-size-footnote)',
    lineHeight: 'var(--line-height-footnote)',
    color: 'var(--text-inverse)',
    opacity: 0.8,
    textDecoration: 'none',
  },
  footerBottom: {
    borderTop: '1px solid',
    borderColor: 'var(--text-inverse)',
    opacity: 0.2,
    paddingTop: 'var(--spacing-6)',
  },
  copyright: {
    fontSize: 'var(--font-size-caption1)',
    lineHeight: 'var(--line-height-caption1)',
    color: 'var(--text-inverse)',
    opacity: 0.6,
    margin: 0,
    textAlign: 'center',
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
