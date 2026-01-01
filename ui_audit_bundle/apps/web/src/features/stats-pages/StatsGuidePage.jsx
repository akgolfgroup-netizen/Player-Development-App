import React, { useState } from 'react';
import {
  Target, TrendingUp, Trophy, Dumbbell, Zap, Ruler, Circle,
  ChevronRight, ChevronDown, Info, CheckCircle, ArrowRight,
  BookOpen, HelpCircle, Award, BarChart2, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SectionTitle, SubSectionTitle, CardTitle } from '../../components/typography/Headings';

// ============================================================================
// DATA - De 20 Offisielle Testene
// ============================================================================

const TEST_CATEGORIES = [
  {
    id: 'distance',
    name: 'Distanse',
    icon: Ruler,
    color: 'var(--accent)',
    description: 'Måler lengden på slagene dine',
    tests: [
      { id: 1, name: 'Driver distanse', description: 'Gjennomsnitt av 3 beste av 6 slag', unit: 'meter' },
      { id: 2, name: '3-tre distanse', description: 'Gjennomsnitt av 3 beste av 6 slag', unit: 'meter' },
      { id: 3, name: '5-jern distanse', description: 'Gjennomsnitt av 3 beste av 6 slag', unit: 'meter' },
      { id: 4, name: 'PW distanse', description: 'Gjennomsnitt av 3 beste av 6 slag', unit: 'meter' },
    ],
  },
  {
    id: 'speed',
    name: 'Hastighet',
    icon: Zap,
    color: 'var(--warning)',
    description: 'Måler svinghastighet og ballhastighet',
    tests: [
      { id: 5, name: 'Klubbhastighet', description: 'Maksimal svinghastighet med driver', unit: 'km/t' },
      { id: 6, name: 'Ballhastighet', description: 'Maksimal ballhastighet etter treff', unit: 'km/t' },
      { id: 7, name: 'Smash Factor', description: 'Forholdet mellom ball- og klubbhastighet', unit: 'ratio' },
    ],
  },
  {
    id: 'approach',
    name: 'Approach',
    icon: Target,
    color: 'var(--success)',
    description: 'Presisjon på innspill',
    tests: [
      { id: 8, name: '25m presisjon', description: 'Avstand fra hull på 10 slag', unit: 'cm' },
      { id: 9, name: '50m presisjon', description: 'Avstand fra hull på 10 slag', unit: 'cm' },
      { id: 10, name: '75m presisjon', description: 'Avstand fra hull på 10 slag', unit: 'meter' },
      { id: 11, name: '100m presisjon', description: 'Avstand fra hull på 10 slag', unit: 'meter' },
    ],
  },
  {
    id: 'physical',
    name: 'Fysisk',
    icon: Dumbbell,
    color: 'var(--error)',
    description: 'Fysisk kapasitet og styrke',
    tests: [
      { id: 12, name: 'Benkpress', description: 'Maksimal styrke i overkropp', unit: 'kg' },
      { id: 13, name: 'Markløft', description: 'Maksimal styrke i bein og rygg', unit: 'kg' },
      { id: 14, name: '3km løp', description: 'Kondisjon og utholdenhet', unit: 'min' },
    ],
  },
  {
    id: 'shortgame',
    name: 'Kortspill',
    icon: Circle,
    color: 'var(--achievement)',
    description: 'Putting, chipping og bunker',
    tests: [
      { id: 15, name: 'Putting 3m', description: '10 putter fra 3 meter', unit: 'treff' },
      { id: 16, name: 'Putting 6m', description: '10 putter fra 6 meter', unit: 'treff' },
      { id: 17, name: 'Chipping', description: 'Presisjon fra 15m utenfor green', unit: 'poeng' },
      { id: 18, name: 'Bunker', description: 'Presisjon fra greenside bunker', unit: 'poeng' },
    ],
  },
  {
    id: 'oncourse',
    name: 'On-Course',
    icon: Trophy,
    color: 'var(--accent)',
    description: 'Prestasjon på banen',
    tests: [
      { id: 19, name: '9-hulls simulering', description: 'Score på standardisert 9-hulls test', unit: 'slag' },
      { id: 20, name: 'On-Course vurdering', description: 'Helhetlig spillprestasjon', unit: 'poeng' },
    ],
  },
];

// ============================================================================
// DATA - Spillerkategorier (A-K)
// ============================================================================

const PLAYER_CATEGORIES = [
  { category: 'A', scoreRange: '< 70', level: 'Elite / Tour', emoji: '🏆', color: 'var(--success)' },
  { category: 'B', scoreRange: '70-72', level: 'Scratch', emoji: '⭐', color: 'var(--success)' },
  { category: 'C', scoreRange: '73-75', level: 'Lavt handicap', emoji: '🎯', color: 'var(--success)' },
  { category: 'D', scoreRange: '76-78', level: 'Singel handicap', emoji: '📊', color: 'var(--warning)' },
  { category: 'E', scoreRange: '79-81', level: 'Middels', emoji: '📈', color: 'var(--warning)' },
  { category: 'F', scoreRange: '82-84', level: 'Hobby+', emoji: '🏌️', color: 'var(--text-secondary)' },
  { category: 'G', scoreRange: '85-87', level: 'Hobby', emoji: '🏌️', color: 'var(--text-secondary)' },
  { category: 'H', scoreRange: '88-90', level: 'Nybegynner+', emoji: '🌱', color: 'var(--text-secondary)' },
  { category: 'I', scoreRange: '91-93', level: 'Nybegynner', emoji: '🌱', color: 'var(--text-secondary)' },
  { category: 'J', scoreRange: '94-96', level: 'Starter+', emoji: '🆕', color: 'var(--text-secondary)' },
  { category: 'K', scoreRange: '97+', level: 'Starter', emoji: '🆕', color: 'var(--text-secondary)' },
];

// ============================================================================
// DATA - Strokes Gained Komponenter
// ============================================================================

const SG_COMPONENTS = [
  {
    id: 'ott',
    name: 'Off The Tee (OTT)',
    description: 'Driver og utslag',
    detail: 'Måler hvor mye verdi du skaper med driveren og utslag på par 4 og 5. Inkluderer både distanse og presisjon.',
    icon: Ruler,
    color: 'var(--accent)',
  },
  {
    id: 'app',
    name: 'Approach (APP)',
    description: 'Innspill til green',
    detail: 'Måler presisjonen på slag fra fairway og rough inn mot green. Hvor nær hullet treffer du?',
    icon: Target,
    color: 'var(--success)',
  },
  {
    id: 'arg',
    name: 'Around Green (ARG)',
    description: 'Kortspill rundt green',
    detail: 'Chipping, pitching og bunker slag. Hvor effektiv er du når du bommer på green?',
    icon: Circle,
    color: 'var(--warning)',
  },
  {
    id: 'putt',
    name: 'Putting (PUTT)',
    description: 'Putter på green',
    detail: 'Effektiviteten din på green. Antall putter per runde sammenlignet med forventet basert på avstand.',
    icon: Trophy,
    color: 'var(--error)',
  },
];

// ============================================================================
// TABS FOR NAVIGATION
// ============================================================================

const TABS = [
  { id: 'intro', label: 'Hva er dette?', icon: BookOpen },
  { id: 'tests', label: 'Testene', icon: Target },
  { id: 'categories', label: 'Kategorier', icon: Trophy },
  { id: 'strokes-gained', label: 'Strokes Gained', icon: TrendingUp },
  { id: 'how-it-works', label: 'Slik fungerer det', icon: ArrowRight },
];

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

const Card = ({ children, style = {}, onClick }) => (
  <div
    onClick={onClick}
    style={{
      backgroundColor: 'var(--bg-primary)',
      borderRadius: '14px',
      padding: '20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s',
      ...style,
    }}
  >
    {children}
  </div>
);

const IconBadge = ({ icon: Icon, color, size = 40 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 4,
      backgroundColor: `${color}15`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <Icon size={size * 0.5} color={color} />
  </div>
);

const GuideSectionTitle = ({ children, subtitle }) => (
  <div style={{ marginBottom: '24px' }}>
    <SectionTitle>
      {children}
    </SectionTitle>
    {subtitle && (
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
        {subtitle}
      </p>
    )}
  </div>
);

// ============================================================================
// SECTION 1: INTRO
// ============================================================================

const IntroSection = () => {
  const navigate = useNavigate();

  return (
    <div>
      <GuideSectionTitle subtitle="Forstå hvordan vi måler og utvikler ditt golfspill">
        Din golfutvikling - målt og analysert
      </GuideSectionTitle>

      <Card style={{ marginBottom: '24px', backgroundColor: 'var(--accent-soft)', border: '1px solid var(--accent)20' }}>
        <p style={{ fontSize: '15px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.6 }}>
          AK Golf Academy bruker <strong>Team Norway Golf Testing Protocol</strong> for å måle alle aspekter
          av golfspillet ditt. Basert på dine testresultater tilpasser vi treningsplanen automatisk til
          dine styrker og forbedringsområder.
        </p>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <IconBadge icon={Target} color="var(--accent)" />
            <div>
              <SubSectionTitle style={{ margin: '0 0 6px 0' }}>
                20 Standardiserte Tester
              </SubSectionTitle>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Dekker alt fra driving til putting - alle aspekter av spillet ditt måles objektivt.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <IconBadge icon={Award} color="var(--success)" />
            <div>
              <SubSectionTitle style={{ margin: '0 0 6px 0' }}>
                Personlig Kategori (A-K)
              </SubSectionTitle>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Din spillernivå basert på 18-hulls gjennomsnitt, fra Elite (A) til Starter (K).
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <IconBadge icon={TrendingUp} color="var(--warning)" />
            <div>
              <SubSectionTitle style={{ margin: '0 0 6px 0' }}>
                Automatisk Tilpasning
              </SubSectionTitle>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Treningsplanen justeres etter testresultatene - fokus på det som gir størst forbedring.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/testresultater')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Se mine tester
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => navigate('/statistikk')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Gå til statistikk
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// SECTION 2: TESTS OVERVIEW
// ============================================================================

const TestCategoryCard = ({ category, isExpanded, onToggle }) => {
  const Icon = category.icon;

  return (
    <Card
      onClick={onToggle}
      style={{
        cursor: 'pointer',
        border: isExpanded ? `2px solid ${category.color}` : '2px solid transparent',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <IconBadge icon={Icon} color={category.color} size={44} />
          <div>
            <SubSectionTitle style={{ margin: 0 }}>
              {category.name}
            </SubSectionTitle>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              {category.tests.length} tester
            </p>
          </div>
        </div>
        {isExpanded ? <ChevronDown size={20} color="var(--text-secondary)" /> : <ChevronRight size={20} color="var(--text-secondary)" />}
      </div>

      {isExpanded && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
            {category.description}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {category.tests.map((test) => (
              <div
                key={test.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '8px',
                }}
              >
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  backgroundColor: `${category.color}20`,
                  color: category.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 600,
                }}>
                  {test.id}
                </span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {test.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {test.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

const TestsSection = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  return (
    <div>
      <GuideSectionTitle subtitle="Vi måler 20 ulike ferdigheter - fra driver-distanse til putting-presisjon">
        De 20 Offisielle Testene
      </GuideSectionTitle>

      <Card style={{ marginBottom: '24px', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <Info size={20} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
            Hver test har klare krav for hver spillerkategori, så du alltid vet hva du jobber mot.
            Klikk på en kategori for å se alle testene.
          </p>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
        {TEST_CATEGORIES.map((category) => (
          <TestCategoryCard
            key={category.id}
            category={category}
            isExpanded={expandedCategory === category.id}
            onToggle={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// SECTION 3: CATEGORIES (A-K)
// ============================================================================

const CategoriesSection = () => {
  const navigate = useNavigate();

  return (
    <div>
      <GuideSectionTitle subtitle="Basert på ditt 18-hulls gjennomsnitt plasseres du i en kategori fra A (Elite) til K (Starter)">
        Din Spillerkategori
      </GuideSectionTitle>

      <Card style={{ marginBottom: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>
                  Kategori
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>
                  Score (18 hull)
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>
                  Nivå
                </th>
              </tr>
            </thead>
            <tbody>
              {PLAYER_CATEGORIES.map((cat, index) => (
                <tr key={cat.category} style={{ backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--bg-secondary)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: `${cat.color}20`,
                        color: cat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 700,
                      }}>
                        {cat.category}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {cat.scoreRange}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {cat.emoji} {cat.level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <HelpCircle size={20} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
              <strong>Hvordan fungerer det?</strong><br />
              Hver test har egne krav for hver kategori. For eksempel krever kategori A lengre driver-distanse
              enn kategori E. Se dine personlige krav under "Mine tester".
            </p>
            <button
              onClick={() => navigate('/testresultater')}
              style={{
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Se mine kategorikrav
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ============================================================================
// SECTION 4: STROKES GAINED
// ============================================================================

const StrokesGainedSection = () => {
  return (
    <div>
      <GuideSectionTitle subtitle="En moderne måte å analysere golfspillet på">
        Strokes Gained Forklaring
      </GuideSectionTitle>

      <Card style={{ marginBottom: '24px', backgroundColor: 'var(--accent-soft)', border: '1px solid var(--accent)20' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <BarChart2 size={24} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <SubSectionTitle style={{ margin: '0 0 8px 0' }}>
              Enkelt forklart
            </SubSectionTitle>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.6 }}>
              Strokes Gained viser hvor mange slag du <strong>sparer</strong> (eller taper) sammenlignet med
              tour-gjennomsnittet. <strong>+1.0</strong> betyr du er 1 slag bedre per runde i den kategorien.
            </p>
          </div>
        </div>
      </Card>

      <SubSectionTitle style={{ margin: '0 0 16px 0' }}>
        De 4 komponentene
      </SubSectionTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {SG_COMPONENTS.map((comp) => {
          const Icon = comp.icon;
          return (
            <Card key={comp.id}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <IconBadge icon={Icon} color={comp.color} />
                <div>
                  <CardTitle style={{ margin: '0 0 4px 0' }}>
                    {comp.name}
                  </CardTitle>
                  <p style={{ fontSize: '12px', color: comp.color, margin: '0 0 8px 0', fontWeight: 500 }}>
                    {comp.description}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {comp.detail}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <SubSectionTitle style={{ margin: '0 0 16px 0' }}>
        Hvordan tolke tallene
      </SubSectionTitle>

      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', backgroundColor: 'var(--success)10', borderRadius: '8px' }}>
            <TrendingUp size={20} color="var(--success)" />
            <div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--success)' }}>+2.0 eller høyere</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '12px' }}>Tour-nivå styrke</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', backgroundColor: 'var(--success)08', borderRadius: '8px' }}>
            <TrendingUp size={20} color="var(--success)" style={{ opacity: 0.7 }} />
            <div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>+0.5 til +2.0</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '12px' }}>Over gjennomsnittet</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <div style={{ width: '20px', height: '2px', backgroundColor: 'var(--text-secondary)' }} />
            <div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>-0.5 til +0.5</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '12px' }}>Gjennomsnittlig</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', backgroundColor: 'var(--error)08', borderRadius: '8px' }}>
            <TrendingUp size={20} color="var(--error)" style={{ transform: 'rotate(180deg)' }} />
            <div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--error)' }}>-0.5 eller lavere</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '12px' }}>Forbedringsområde</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ============================================================================
// SECTION 5: HOW IT WORKS
// ============================================================================

const HowItWorksSection = () => {
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      title: 'Du tar test',
      description: 'Gjennomfør en eller flere av de 20 standardiserte testene.',
      icon: Target,
      color: 'var(--accent)',
    },
    {
      id: 2,
      title: 'Resultat lagres',
      description: 'Resultatet sammenlignes med kravene for din kategori.',
      icon: BarChart2,
      color: 'var(--warning)',
    },
    {
      id: 3,
      title: 'Analyse',
      description: 'Vi identifiserer styrker og forbedringsområder (Breaking Points).',
      icon: TrendingUp,
      color: 'var(--success)',
    },
    {
      id: 4,
      title: 'Plan tilpasses',
      description: 'Treningsplanen oppdateres automatisk basert på dine resultater.',
      icon: Calendar,
      color: 'var(--accent)',
    },
  ];

  return (
    <div>
      <GuideSectionTitle subtitle="Slik bruker vi testene til å forbedre spillet ditt">
        Slik Fungerer Det
      </GuideSectionTitle>

      {/* Flow diagram */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '32px' }}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.id}>
              <Card style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: `${step.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={24} color={step.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: step.color,
                        backgroundColor: `${step.color}15`,
                        padding: '2px 8px',
                        borderRadius: '10px',
                      }}>
                        Steg {step.id}
                      </span>
                    </div>
                    <CardTitle style={{ fontSize: '16px', margin: '0 0 4px 0' }}>
                      {step.title}
                    </CardTitle>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </Card>
              {index < steps.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
                  <ArrowRight size={24} color="var(--border)" style={{ transform: 'rotate(90deg)' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Key points */}
      <SubSectionTitle style={{ margin: '0 0 16px 0' }}>
        Nøkkelpunkter
      </SubSectionTitle>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {[
          'Tester avdekker dine styrker og svakheter objektivt',
          'Svake områder blir "Breaking Points" som får ekstra fokus',
          'Treningsplanen oppdateres automatisk når du forbedrer deg',
          'Test regelmessig for å spore fremgang',
        ].map((point, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <CheckCircle size={18} color="var(--success)" />
            <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{point}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/testresultater')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Se mine tester
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => navigate('/utvikling/breaking-points')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Se Breaking Points
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const StatsGuidePage = () => {
  const [activeTab, setActiveTab] = useState('intro');

  const renderSection = () => {
    switch (activeTab) {
      case 'intro':
        return <IntroSection />;
      case 'tests':
        return <TestsSection />;
      case 'categories':
        return <CategoriesSection />;
      case 'strokes-gained':
        return <StrokesGainedSection />;
      case 'how-it-works':
        return <HowItWorksSection />;
      default:
        return <IntroSection />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  backgroundColor: isActive ? 'var(--accent)' : 'var(--bg-primary)',
                  color: isActive ? 'white' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 2px 8px var(--accent)30' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Section Content */}
        {renderSection()}
      </div>
    </div>
  );
};

export default StatsGuidePage;
