import React, { useState } from 'react';
import { Target, Clock, MapPin, CheckCircle, AlertCircle, Play, ChevronRight, Info } from 'lucide-react';
import { tokens } from '../../design-tokens';
import { SectionTitle, SubSectionTitle } from '../../components/typography';
import Button from '../../ui/primitives/Button';
import PEIBaneTestForm from './PEIBaneTestForm';

// ============================================================================
// TEST INFO
// ============================================================================

const TEST_INFO = {
  name: 'PEI Test - Bane',
  description: 'Test din evne til å komme nær flagget fra ulike posisjoner på banen. PEI (Precision Error Index) måler hvor presist du treffer i forhold til slaglengden.',
  purpose: 'Formålet med denne testen er å inkludere en test der spillerne kan teste sin evne til å komme nær flagget. Testen kan gjøres på treningsfeltet, på rangen eller på banen.',
  methodology: [
    'Spilleren eller treneren setter et antall slag som skal slås (18 slag anbefalt)',
    'Angi avstand til mål og plassering (Fairway, Rough, Tee, Bunker)',
    'Slå slaget og mål avstanden fra ballen til hullet',
    'PEI beregnes automatisk for hvert slag og totalt',
  ],
  equipment: ['Alle køller', 'Laseravstandsmåler', 'Scoreark eller app'],
  duration: '30-45 minutter',
  scoring: {
    excellent: { max: 5, label: 'Utmerket', color: tokens.colors.success },
    good: { max: 10, label: 'Bra', color: tokens.colors.gold },
    average: { max: 15, label: 'Gjennomsnitt', color: tokens.colors.warning },
    needsWork: { max: 100, label: 'Trenger arbeid', color: tokens.colors.error },
  },
  tips: [
    'Velg varierte avstander og underlag for et realistisk bilde',
    'Noter værforhold for å sammenligne resultater',
    'Gjør testen jevnlig (hver 4-6 uke) for å spore fremgang',
  ],
};

// ============================================================================
// INFO CARD COMPONENT
// ============================================================================

const InfoCard = ({ icon: Icon, title, children, color = tokens.colors.primary }) => (
  <div style={{
    backgroundColor: tokens.colors.white,
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        backgroundColor: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={18} color={color} />
      </div>
      <SubSectionTitle style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>
        {title}
      </SubSectionTitle>
    </div>
    {children}
  </div>
);

// ============================================================================
// SCORING LEGEND
// ============================================================================

const ScoringLegend = ({ scoring }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
    {Object.entries(scoring).map(([key, { max, label, color }]) => (
      <div
        key={key}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: `${color}10`,
          borderRadius: '8px',
          border: `1px solid ${color}30`,
        }}
      >
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: color,
        }} />
        <span style={{ fontSize: '13px', color: tokens.colors.charcoal, fontWeight: 500 }}>
          {label}
        </span>
        <span style={{ fontSize: '12px', color: tokens.colors.steel }}>
          ≤ {max}%
        </span>
      </div>
    ))}
  </div>
);

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

const PEIBaneTestPage = () => {
  const [showTestForm, setShowTestForm] = useState(false);

  if (showTestForm) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <PEIBaneTestForm
          onClose={() => setShowTestForm(false)}
          onSubmit={async (data) => {
            console.log('Test submitted:', data);
            setShowTestForm(false);
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div style={{
        backgroundColor: tokens.colors.white,
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        background: `linear-gradient(135deg, ${tokens.colors.white} 0%, ${tokens.colors.primary}08 100%)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: `${tokens.colors.primary}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Target size={32} color={tokens.colors.primary} />
          </div>
          <div style={{ flex: 1 }}>
            <SectionTitle style={{ margin: 0, fontSize: '24px', marginBottom: '8px' }}>
              {TEST_INFO.name}
            </SectionTitle>
            <p style={{
              margin: 0,
              fontSize: '15px',
              color: tokens.colors.steel,
              lineHeight: 1.6,
              maxWidth: '600px',
            }}>
              {TEST_INFO.description}
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          padding: '16px 20px',
          backgroundColor: tokens.colors.snow,
          borderRadius: '12px',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color={tokens.colors.steel} />
            <span style={{ fontSize: '14px', color: tokens.colors.charcoal }}>
              <strong>{TEST_INFO.duration}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color={tokens.colors.steel} />
            <span style={{ fontSize: '14px', color: tokens.colors.charcoal }}>
              <strong>18 slag</strong> fra ulike posisjoner
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} color={tokens.colors.steel} />
            <span style={{ fontSize: '14px', color: tokens.colors.charcoal }}>
              <strong>PEI</strong> = Avstand til hull / Slaglengde
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => setShowTestForm(true)}
          leftIcon={<Play size={20} />}
          rightIcon={<ChevronRight size={20} />}
          style={{
            width: '100%',
            maxWidth: '300px',
            height: '56px',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          Ta test
        </Button>
      </div>

      {/* Info Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {/* Purpose */}
        <InfoCard icon={Info} title="Formål" color={tokens.colors.primary}>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: tokens.colors.charcoal,
            lineHeight: 1.6
          }}>
            {TEST_INFO.purpose}
          </p>
        </InfoCard>

        {/* Equipment */}
        <InfoCard icon={CheckCircle} title="Utstyr" color={tokens.colors.success}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {TEST_INFO.equipment.map((item, i) => (
              <span
                key={i}
                style={{
                  padding: '6px 12px',
                  backgroundColor: tokens.colors.snow,
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: tokens.colors.charcoal,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </InfoCard>
      </div>

      {/* Methodology */}
      <InfoCard icon={MapPin} title="Gjennomføring" color={tokens.colors.gold}>
        <ol style={{
          margin: 0,
          paddingLeft: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          {TEST_INFO.methodology.map((step, i) => (
            <li key={i} style={{
              fontSize: '14px',
              color: tokens.colors.charcoal,
              lineHeight: 1.5,
            }}>
              {step}
            </li>
          ))}
        </ol>
      </InfoCard>

      {/* Scoring */}
      <div style={{ marginTop: '16px' }}>
        <InfoCard icon={Target} title="Scoring (PEI)" color={tokens.colors.primary}>
          <p style={{
            margin: '0 0 16px 0',
            fontSize: '14px',
            color: tokens.colors.steel,
            lineHeight: 1.5,
          }}>
            PEI beregnes som forholdet mellom avstand til hull og slaglengde.
            Lavere PEI = bedre presisjon. En PEI på 5% betyr at ballen landet 5 meter
            fra hullet på et slag på 100 meter.
          </p>
          <ScoringLegend scoring={TEST_INFO.scoring} />
        </InfoCard>
      </div>

      {/* Tips */}
      <div style={{ marginTop: '16px' }}>
        <InfoCard icon={AlertCircle} title="Tips" color={tokens.colors.warning}>
          <ul style={{
            margin: 0,
            paddingLeft: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {TEST_INFO.tips.map((tip, i) => (
              <li key={i} style={{
                fontSize: '14px',
                color: tokens.colors.charcoal,
                lineHeight: 1.5,
              }}>
                {tip}
              </li>
            ))}
          </ul>
        </InfoCard>
      </div>

      {/* Bottom CTA */}
      <div style={{
        marginTop: '32px',
        padding: '24px',
        backgroundColor: tokens.colors.white,
        borderRadius: '12px',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}>
        <p style={{
          margin: '0 0 16px 0',
          fontSize: '15px',
          color: tokens.colors.charcoal,
        }}>
          Klar til å teste din presisjon?
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setShowTestForm(true)}
          leftIcon={<Play size={20} />}
          style={{ minWidth: '200px' }}
        >
          Start PEI Test
        </Button>
      </div>
    </div>
  );
};

export default PEIBaneTestPage;
