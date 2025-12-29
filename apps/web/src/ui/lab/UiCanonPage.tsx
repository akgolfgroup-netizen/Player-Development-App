import React from 'react';
import Card from '../primitives/Card';
import Button from '../primitives/Button';
import Badge from '../primitives/Badge.primitive';
import Input from '../primitives/Input';
import Tabs from '../composites/Tabs.composite';
import StateCard from '../composites/StateCard';

/**
 * UI Canon Page — Single Source of Truth
 * =======================================
 *
 * This is the authoritative visual reference for all UI components.
 * All feature code MUST align with these patterns.
 *
 * Design Philosophy: Apple/Stripe premium feel
 * - Generous whitespace
 * - Soft shadows (multi-layer)
 * - 20px radius on cards
 * - Subtle micro-interactions
 * - Consistent 12/16/24/32px spacing rhythm
 */

const UiCanonPage: React.FC = () => {
  return (
    <div style={styles.container}>
      {/* Page Header */}
      <header style={styles.pageHeader}>
        <div style={styles.headerContent}>
          <h1 style={styles.pageTitle}>UI Canon</h1>
          <p style={styles.pageSubtitle}>Single source of truth for AK Golf visual style</p>
        </div>
        <Badge variant="accent" pill>v1.3</Badge>
      </header>

      {/* Quick Nav */}
      <Card variant="flat" padding="compact" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div style={styles.quickNav}>
          {['Typography', 'Colors', 'Buttons', 'Inputs', 'Badges', 'Cards', 'States', 'Navigation'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} style={styles.quickNavLink}>{item}</a>
          ))}
        </div>
      </Card>

      {/* ========== TYPOGRAPHY ========== */}
      <Section id="typography" title="Typography" description="Consistent type scale creates visual hierarchy">
        <Card padding="spacious">
          <div style={styles.typeStack}>
            <TypeRow label="H1 / Large Title" token="--font-size-large-title">
              <h1 style={{ ...styles.h1, margin: 0 }}>Velkommen til AK Golf</h1>
            </TypeRow>
            <TypeRow label="H2 / Title 1" token="--font-size-title1">
              <h2 style={{ ...styles.h2, margin: 0 }}>Dagens treningsplan</h2>
            </TypeRow>
            <TypeRow label="H3 / Title 2" token="--font-size-title2">
              <h3 style={{ ...styles.h3, margin: 0 }}>Øvelser denne uken</h3>
            </TypeRow>
            <TypeRow label="Headline" token="--font-size-headline">
              <span style={styles.headline}>Teknikk-fokus</span>
            </TypeRow>
            <TypeRow label="Body" token="--font-size-body">
              <p style={{ ...styles.body, margin: 0 }}>Dette er brødtekst som brukes til lengre beskrivelser og innhold.</p>
            </TypeRow>
            <TypeRow label="Footnote" token="--font-size-footnote">
              <span style={styles.footnote}>Hjelpetekst eller sekundær info</span>
            </TypeRow>
            <TypeRow label="Caption" token="--font-size-caption1">
              <span style={styles.caption}>Sist oppdatert: 26. desember 2025</span>
            </TypeRow>
            <TypeRow label="Label (uppercase)" token="font-weight: 600">
              <span style={styles.label}>KATEGORI</span>
            </TypeRow>
          </div>
        </Card>

        {/* Page Header Pattern */}
        <SubSection title="Page Header Pattern">
          <Card>
            <div style={styles.pageHeaderDemo}>
              <div>
                <h2 style={{ ...styles.h2, margin: 0 }}>Treningsplan</h2>
                <p style={{ ...styles.footnote, margin: '4px 0 0 0' }}>Uke 52 · 23-29 desember 2025</p>
              </div>
              <div style={styles.row}>
                <Button variant="ghost" size="sm">Forrige uke</Button>
                <Button variant="primary" size="sm">+ Ny økt</Button>
              </div>
            </div>
          </Card>
        </SubSection>
      </Section>

      {/* ========== COLORS & SURFACES ========== */}
      <Section id="colors" title="Colors & Surfaces" description="Semantic tokens — never use hardcoded hex values">
        <Card padding="spacious">
          <SubSection title="Backgrounds">
            <div style={styles.swatchGrid}>
              <ColorSwatch name="Background Default" token="--background-default" color="var(--background-default)" />
              <ColorSwatch name="Card / Surface" token="--card" color="var(--card)" />
              <ColorSwatch name="Surface Subtle" token="--background-surface" color="var(--background-surface)" />
              <ColorSwatch name="Inverse" token="--background-inverse" color="var(--background-inverse)" textLight />
            </div>
          </SubSection>

          <SubSection title="Text">
            <div style={styles.swatchGrid}>
              <ColorSwatch name="Primary" token="--text-primary" color="var(--text-primary)" textLight />
              <ColorSwatch name="Secondary" token="--text-secondary" color="var(--text-secondary)" textLight />
              <ColorSwatch name="Tertiary" token="--text-tertiary" color="var(--text-tertiary)" />
              <ColorSwatch name="Brand" token="--text-brand" color="var(--text-brand)" textLight />
            </div>
          </SubSection>

          <SubSection title="Accent & Status">
            <div style={styles.swatchGrid}>
              <ColorSwatch name="Accent" token="--accent" color="var(--accent)" textLight />
              <ColorSwatch name="Success" token="--success" color="var(--success)" textLight />
              <ColorSwatch name="Warning" token="--warning" color="var(--warning)" />
              <ColorSwatch name="Error" token="--error" color="var(--error)" textLight />
              <ColorSwatch name="Achievement" token="--achievement" color="var(--achievement)" />
            </div>
          </SubSection>

          <SubSection title="Border">
            <div style={styles.swatchGrid}>
              <ColorSwatch name="Default" token="--border-default" color="var(--border-default)" showBorder />
              <ColorSwatch name="Subtle" token="--border-subtle" color="var(--border-subtle)" showBorder />
              <ColorSwatch name="Accent" token="--border-accent" color="var(--border-accent)" showBorder />
            </div>
          </SubSection>
        </Card>

        <DosDonts
          dos={[
            'Use semantic tokens: var(--accent), var(--text-primary)',
            'Use color-mix() for subtle backgrounds',
            'Match icon color with surrounding text'
          ]}
          donts={[
            'Hardcode hex values like #10456A',
            'Use raw tokens like var(--accent)',
            'Create new color variables in feature files'
          ]}
        />
      </Section>

      {/* ========== BUTTONS ========== */}
      <Section id="buttons" title="Buttons" description="Interactive elements with clear visual feedback">
        <Card padding="spacious">
          <SubSection title="Variants">
            <div style={styles.row}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </SubSection>

          <SubSection title="Sizes (sm: 36px, md: 44px)">
            <div style={styles.row}>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </SubSection>

          <SubSection title="States (Tab for focus ring)">
            <div style={styles.row}>
              <Button disabled>Disabled</Button>
              <Button loading>Loading</Button>
              <Button fullWidth>Full Width</Button>
            </div>
          </SubSection>

          <SubSection title="With Icons">
            <div style={styles.row}>
              <Button leftIcon={<span>+</span>}>Add Item</Button>
              <Button rightIcon={<span>→</span>}>Continue</Button>
            </div>
          </SubSection>
        </Card>

        <DosDonts
          dos={[
            'Primary for main CTA (one per view)',
            'Ghost for secondary actions in toolbars',
            'Danger only for destructive actions'
          ]}
          donts={[
            'Multiple primary buttons in same view',
            'Using buttons for navigation (use links)',
            'Custom button styles in features'
          ]}
        />
      </Section>

      {/* ========== INPUTS ========== */}
      <Section id="inputs" title="Inputs" description="Form controls with clear states">
        <Card padding="spacious">
          <SubSection title="Default">
            <div style={styles.inputGrid}>
              <Input label="Standard" placeholder="Skriv her..." />
              <Input label="Med hint" placeholder="Skriv her..." hint="Hjelpetekst under feltet" />
            </div>
          </SubSection>

          <SubSection title="Sizes">
            <div style={styles.inputGrid}>
              <Input label="Small (sm)" placeholder="36px height" size="sm" />
              <Input label="Medium (md)" placeholder="44px height" size="md" />
            </div>
          </SubSection>

          <SubSection title="States">
            <div style={styles.inputGrid}>
              <Input label="Error" placeholder="Feil tilstand" error="Dette feltet er påkrevd" />
              <Input label="Disabled" placeholder="Deaktivert" disabled />
            </div>
          </SubSection>
        </Card>
      </Section>

      {/* ========== BADGES ========== */}
      <Section id="badges" title="Badges" description="Status indicators and labels">
        <Card padding="spacious">
          <SubSection title="All Variants">
            <div style={styles.row}>
              <Badge variant="neutral">Neutral</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="achievement">Achievement</Badge>
            </div>
          </SubSection>

          <SubSection title="With Dot Indicator">
            <div style={styles.row}>
              <Badge variant="success" dot>Aktiv</Badge>
              <Badge variant="warning" dot>Venter</Badge>
              <Badge variant="error" dot>Feil</Badge>
              <Badge variant="accent" dot>Ny</Badge>
            </div>
          </SubSection>

          <SubSection title="Pill Style">
            <div style={styles.row}>
              <Badge variant="neutral" pill>Draft</Badge>
              <Badge variant="success" pill>Fullført</Badge>
              <Badge variant="achievement" pill>Premium</Badge>
            </div>
          </SubSection>

          <SubSection title="In List Context">
            <Card variant="outlined" padding="compact">
              <ListRow
                title="Putting-drill"
                subtitle="Teknikk · 15 min"
                badge={<Badge variant="success" size="sm">Fullført</Badge>}
              />
              <ListRow
                title="Mental prep"
                subtitle="Mental · 10 min"
                badge={<Badge variant="warning" size="sm">Pågår</Badge>}
              />
              <ListRow
                title="Swing analyse"
                subtitle="Analyse · 20 min"
                badge={<Badge variant="neutral" size="sm">Planlagt</Badge>}
              />
            </Card>
          </SubSection>
        </Card>

        <DosDonts
          dos={[
            'neutral: default/inactive states',
            'accent: info, links, call-outs',
            'achievement: gold/premium/tier badges only'
          ]}
          donts={[
            'Creating local Badge components in features',
            'Using old variants (primary, gold, default)',
            'More than 2 badges per list item'
          ]}
        />
      </Section>

      {/* ========== CARDS ========== */}
      <Section id="cards" title="Cards" description="Container with 20px radius, soft shadow">
        <Card padding="spacious">
          <SubSection title="Variants">
            <div style={styles.cardGrid}>
              <Card variant="default">
                <p style={styles.cardLabel}>Default</p>
                <p style={styles.cardDesc}>Soft shadow + subtle border</p>
              </Card>
              <Card variant="outlined">
                <p style={styles.cardLabel}>Outlined</p>
                <p style={styles.cardDesc}>Border, no shadow</p>
              </Card>
              <Card variant="flat">
                <p style={styles.cardLabel}>Flat</p>
                <p style={styles.cardDesc}>No shadow, muted bg</p>
              </Card>
              <Card variant="elevated">
                <p style={styles.cardLabel}>Elevated</p>
                <p style={styles.cardDesc}>Stronger shadow</p>
              </Card>
            </div>
          </SubSection>

          <SubSection title="Interactive (hover to see effect)">
            <div style={styles.cardGrid}>
              <Card onClick={() => {}}>
                <p style={styles.cardLabel}>Clickable</p>
                <p style={styles.cardDesc}>Shadow elevates on hover</p>
              </Card>
              <Card variant="outlined" onClick={() => {}}>
                <p style={styles.cardLabel}>Clickable Outlined</p>
                <p style={styles.cardDesc}>Border highlights on hover</p>
              </Card>
            </div>
          </SubSection>

          <SubSection title="Padding">
            <div style={styles.cardGrid}>
              <Card padding="compact">
                <p style={styles.cardLabel}>Compact (12px)</p>
              </Card>
              <Card padding="default">
                <p style={styles.cardLabel}>Default (20px)</p>
              </Card>
              <Card padding="spacious">
                <p style={styles.cardLabel}>Spacious (24px)</p>
              </Card>
            </div>
          </SubSection>
        </Card>
      </Section>

      {/* ========== STATE CARDS ========== */}
      <Section id="states" title="State Cards" description="Loading, error, and empty states">
        <div style={styles.stateCardGrid}>
          <StateCard
            variant="loading"
            title="Laster..."
            description="Henter data fra server"
          />
          <StateCard
            variant="empty"
            title="Ingen data"
            description="Det finnes ingen elementer ennå"
            action={<Button size="sm">Legg til første</Button>}
          />
          <StateCard
            variant="error"
            title="Noe gikk galt"
            description="Kunne ikke laste inn data"
            action={<Button size="sm" variant="danger">Prøv igjen</Button>}
          />
          <StateCard
            variant="info"
            title="Tips"
            description="Klikk på et element for å se detaljer"
          />
        </div>
      </Section>

      {/* ========== NAVIGATION ========== */}
      <Section id="navigation" title="Navigation Items" description="Sidebar and nav patterns">
        <Card padding="spacious">
          <SubSection title="Sidebar Demo">
            <div style={styles.sidebarDemo}>
              <SidebarItem icon="📊" label="Dashboard" active />
              <SidebarItem icon="📅" label="Kalender" />
              <SidebarItem icon="🎯" label="Mål" badge={<Badge variant="accent" size="sm">3</Badge>} />
              <SidebarItem icon="📈" label="Statistikk" />
              <SidebarItem icon="⚙️" label="Innstillinger" disabled />
            </div>
          </SubSection>

          <SubSection title="Icon Buttons">
            <div style={styles.row}>
              <IconButton icon="+" />
              <IconButton icon="✏️" />
              <IconButton icon="🗑️" variant="danger" />
              <IconButton icon="⋮" variant="ghost" />
            </div>
          </SubSection>
        </Card>
      </Section>

      {/* ========== TABS ========== */}
      <Section id="tabs" title="Tabs" description="Navigation tabs with underline/pills variants">
        <Card padding="spacious">
          <SubSection title="Underline (default)">
            <Tabs
              tabs={[
                { id: '1', label: 'Oversikt', content: <p style={styles.tabContent}>Oversikt innhold</p> },
                { id: '2', label: 'Statistikk', content: <p style={styles.tabContent}>Statistikk innhold</p> },
                { id: '3', label: 'Innstillinger', content: <p style={styles.tabContent}>Innstillinger innhold</p> },
              ]}
            />
          </SubSection>

          <SubSection title="Pills">
            <Tabs
              variant="pills"
              tabs={[
                { id: '1', label: 'Dag', content: <p style={styles.tabContent}>Dag visning</p> },
                { id: '2', label: 'Uke', content: <p style={styles.tabContent}>Uke visning</p> },
                { id: '3', label: 'Måned', content: <p style={styles.tabContent}>Måned visning</p> },
              ]}
            />
          </SubSection>
        </Card>
      </Section>

      {/* ========== SPACING ========== */}
      <Section id="spacing" title="Spacing Scale" description="Consistent rhythm throughout the app">
        <Card padding="spacious">
          <div style={styles.spacingGrid}>
            {[
              { token: '--spacing-2', value: '8px', use: 'Tight spacing (inside cards)' },
              { token: '--spacing-3', value: '12px', use: 'Compact gap' },
              { token: '--spacing-4', value: '16px', use: 'Default gap' },
              { token: '--spacing-6', value: '24px', use: 'Section gap (between cards)' },
              { token: '--spacing-8', value: '32px', use: 'Large gap (page sections)' },
            ].map((s) => (
              <div key={s.token} style={styles.spacingItem}>
                <div style={{ ...styles.spacingBox, width: s.value, height: '24px' }} />
                <code style={styles.spacingToken}>{s.token}</code>
                <span style={styles.spacingValue}>{s.value}</span>
                <span style={styles.spacingUse}>{s.use}</span>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      {/* ========== CANON SUMMARY ========== */}
      <Section id="summary" title="Canon Summary" description="Quick reference table">
        <Card padding="spacious">
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Element</th>
                <th style={styles.th}>Property</th>
                <th style={styles.th}>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={styles.td}>Card</td><td style={styles.td}>Radius</td><td style={styles.td}>20px (--radius-xl)</td></tr>
              <tr><td style={styles.td}>Card</td><td style={styles.td}>Shadow</td><td style={styles.td}>--shadow-card (multi-layer)</td></tr>
              <tr><td style={styles.td}>Card</td><td style={styles.td}>Padding</td><td style={styles.td}>20px default, 12px compact, 24px spacious</td></tr>
              <tr><td style={styles.td}>Button</td><td style={styles.td}>Height</td><td style={styles.td}>36px (sm), 44px (md), 52px (lg)</td></tr>
              <tr><td style={styles.td}>Input</td><td style={styles.td}>Height</td><td style={styles.td}>36px (sm), 44px (md)</td></tr>
              <tr><td style={styles.td}>Focus</td><td style={styles.td}>Ring</td><td style={styles.td}>accent @ 15% opacity, 3px offset</td></tr>
              <tr><td style={styles.td}>Transition</td><td style={styles.td}>Duration</td><td style={styles.td}>150-200ms ease-out</td></tr>
              <tr><td style={styles.td}>Gap (sections)</td><td style={styles.td}>Spacing</td><td style={styles.td}>24-32px</td></tr>
              <tr><td style={styles.td}>Gap (in cards)</td><td style={styles.td}>Spacing</td><td style={styles.td}>12-16px</td></tr>
            </tbody>
          </table>
        </Card>
      </Section>
    </div>
  );
};

// ============ HELPER COMPONENTS ============

const Section: React.FC<{ id: string; title: string; description: string; children: React.ReactNode }> = ({ id, title, description, children }) => (
  <section id={id} style={styles.section}>
    <h2 style={styles.sectionTitle}>{title}</h2>
    <p style={styles.sectionDescription}>{description}</p>
    {children}
  </section>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={styles.subSection}>
    <h3 style={styles.subSectionTitle}>{title}</h3>
    {children}
  </div>
);

const TypeRow: React.FC<{ label: string; token: string; children: React.ReactNode }> = ({ label, token, children }) => (
  <div style={styles.typeRow}>
    <div style={styles.typeInfo}>
      <span style={styles.typeLabel}>{label}</span>
      <code style={styles.typeToken}>{token}</code>
    </div>
    <div style={styles.typeExample}>{children}</div>
  </div>
);

const ColorSwatch: React.FC<{ name: string; token: string; color: string; textLight?: boolean; showBorder?: boolean }> = ({ name, token, color, textLight, showBorder }) => (
  <div style={styles.swatch}>
    <div style={{
      ...styles.swatchColor,
      backgroundColor: color,
      border: showBorder ? `2px solid ${color}` : undefined,
      color: textLight ? '#FFFFFF' : 'var(--text-primary)',
    }}>
      {name}
    </div>
    <code style={styles.swatchToken}>{token}</code>
  </div>
);

const DosDonts: React.FC<{ dos: string[]; donts: string[] }> = ({ dos, donts }) => (
  <div style={styles.dosDontsGrid}>
    <Card variant="flat" padding="compact">
      <div style={styles.dosHeader}>
        <span style={styles.dosIcon}>✓</span>
        <span style={styles.dosTitle}>Do</span>
      </div>
      <ul style={styles.dosList}>
        {dos.map((item, i) => <li key={i} style={styles.dosItem}>{item}</li>)}
      </ul>
    </Card>
    <Card variant="flat" padding="compact" style={{ backgroundColor: 'var(--bg-error-subtle)' }}>
      <div style={styles.dontsHeader}>
        <span style={styles.dontsIcon}>✗</span>
        <span style={styles.dontsTitle}>Don't</span>
      </div>
      <ul style={styles.dosList}>
        {donts.map((item, i) => <li key={i} style={styles.dontsItem}>{item}</li>)}
      </ul>
    </Card>
  </div>
);

const ListRow: React.FC<{ title: string; subtitle: string; badge: React.ReactNode }> = ({ title, subtitle, badge }) => (
  <div style={styles.listRow}>
    <div>
      <p style={styles.listRowTitle}>{title}</p>
      <p style={styles.listRowSubtitle}>{subtitle}</p>
    </div>
    {badge}
  </div>
);

const SidebarItem: React.FC<{ icon: string; label: string; active?: boolean; disabled?: boolean; badge?: React.ReactNode }> = ({ icon, label, active, disabled, badge }) => (
  <div style={{
    ...styles.sidebarItem,
    ...(active && styles.sidebarItemActive),
    ...(disabled && styles.sidebarItemDisabled),
  }}>
    <span style={styles.sidebarIcon}>{icon}</span>
    <span style={styles.sidebarLabel}>{label}</span>
    {badge}
  </div>
);

const IconButton: React.FC<{ icon: string; variant?: 'default' | 'danger' | 'ghost' }> = ({ icon, variant = 'default' }) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    default: { backgroundColor: 'var(--background-surface)', color: 'var(--text-primary)' },
    danger: { backgroundColor: 'var(--bg-error-subtle)', color: 'var(--error)' },
    ghost: { backgroundColor: 'transparent', color: 'var(--text-secondary)' },
  };
  return (
    <button style={{ ...styles.iconButton, ...variantStyles[variant] }}>
      {icon}
    </button>
  );
};

// ============ STYLES ============

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: 'var(--spacing-6)',
    backgroundColor: 'var(--background-default)',
    minHeight: '100vh',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'var(--spacing-6)',
    paddingBottom: 'var(--spacing-4)',
    borderBottom: '1px solid var(--border-default)',
  },
  headerContent: {},
  pageTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
    marginBottom: '4px',
  },
  pageSubtitle: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  quickNav: {
    display: 'flex',
    gap: 'var(--spacing-4)',
    flexWrap: 'wrap',
  },
  quickNavLink: {
    fontSize: '13px',
    color: 'var(--accent)',
    textDecoration: 'none',
    fontWeight: 500,
  },
  section: {
    marginBottom: 'var(--spacing-8)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
    marginBottom: '4px',
  },
  sectionDescription: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: 0,
    marginBottom: 'var(--spacing-4)',
  },
  subSection: {
    marginBottom: 'var(--spacing-5)',
  },
  subSectionTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-tertiary)',
    margin: 0,
    marginBottom: 'var(--spacing-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-3)',
    alignItems: 'center',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 'var(--spacing-4)',
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--spacing-4)',
  },
  stateCardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--spacing-4)',
  },
  // Typography
  typeStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  typeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-4)',
    padding: 'var(--spacing-3) 0',
    borderBottom: '1px solid var(--border-subtle)',
  },
  typeInfo: {
    width: '180px',
    flexShrink: 0,
  },
  typeLabel: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  typeToken: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    fontFamily: 'monospace',
  },
  typeExample: {
    flex: 1,
  },
  h1: { fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 },
  h2: { fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 },
  h3: { fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 },
  headline: { fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)' },
  body: { fontSize: '15px', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.5 },
  footnote: { fontSize: '13px', fontWeight: 400, color: 'var(--text-secondary)' },
  caption: { fontSize: '12px', fontWeight: 400, color: 'var(--text-tertiary)' },
  label: { fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' },
  pageHeaderDemo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Colors
  swatchGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 'var(--spacing-3)',
  },
  swatch: {
    display: 'flex',
    flexDirection: 'column',
  },
  swatchColor: {
    height: '60px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    padding: 'var(--spacing-2)',
    fontSize: '11px',
    fontWeight: 500,
  },
  swatchToken: {
    fontSize: '10px',
    color: 'var(--text-tertiary)',
    marginTop: '4px',
    fontFamily: 'monospace',
  },
  // Cards
  cardLabel: {
    margin: 0,
    fontWeight: 600,
    fontSize: '14px',
    color: 'var(--text-primary)',
  },
  cardDesc: {
    margin: 0,
    marginTop: '4px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  // Do's and Don'ts
  dosDontsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--spacing-4)',
    marginTop: 'var(--spacing-4)',
  },
  dosHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
  dosIcon: { color: 'var(--success)', fontSize: '16px', fontWeight: 700 },
  dosTitle: { fontSize: '14px', fontWeight: 600, color: 'var(--success)' },
  dontsHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
  dontsIcon: { color: 'var(--error)', fontSize: '16px', fontWeight: 700 },
  dontsTitle: { fontSize: '14px', fontWeight: 600, color: 'var(--error)' },
  dosList: { margin: 0, paddingLeft: '16px', fontSize: '13px', lineHeight: 1.6 },
  dosItem: { color: 'var(--text-primary)' },
  dontsItem: { color: 'var(--text-primary)' },
  // List rows
  listRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--spacing-3)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  listRowTitle: { margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' },
  listRowSubtitle: { margin: 0, fontSize: '12px', color: 'var(--text-secondary)' },
  // Sidebar
  sidebarDemo: {
    width: '220px',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-2)',
  },
  sidebarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-3)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  sidebarItemActive: {
    backgroundColor: 'var(--bg-accent-subtle)',
    color: 'var(--accent)',
  },
  sidebarItemDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  sidebarIcon: { fontSize: '16px' },
  sidebarLabel: { flex: 1, fontSize: '14px', fontWeight: 500 },
  // Icon button
  iconButton: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    transition: 'background-color 0.15s ease',
  },
  // Tabs content
  tabContent: {
    padding: 'var(--spacing-4) 0',
    color: 'var(--text-secondary)',
    fontSize: '14px',
  },
  // Spacing
  spacingGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  spacingItem: {
    display: 'grid',
    gridTemplateColumns: 'auto 140px 60px 1fr',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  spacingBox: {
    backgroundColor: 'var(--accent)',
    borderRadius: '4px',
  },
  spacingToken: {
    fontSize: '12px',
    fontFamily: 'monospace',
    color: 'var(--text-primary)',
  },
  spacingValue: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  spacingUse: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
  },
  // Table
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: 'var(--spacing-2) var(--spacing-3)',
    borderBottom: '2px solid var(--border-default)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  td: {
    padding: 'var(--spacing-2) var(--spacing-3)',
    borderBottom: '1px solid var(--border-subtle)',
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
};

export default UiCanonPage;
