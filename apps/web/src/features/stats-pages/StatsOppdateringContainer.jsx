import React, { useState } from 'react';
import {
  Target, Flag, ChevronRight, Save, X, BarChart2
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';
import apiClient from '../../services/apiClient';

// ============================================================================
// MOCK DATA
// ============================================================================

const STAT_CATEGORIES = [
  {
    id: 'driving',
    name: 'Driving',
    icon: Target,
    color: tokens.colors.primary,
    fields: [
      { id: 'fairways_hit', label: 'Fairways truffet', type: 'fraction', max: 14 },
      { id: 'avg_drive_distance', label: 'Gj.sn. drivelengde', type: 'number', unit: 'm' },
    ],
  },
  {
    id: 'approach',
    name: 'Approach',
    icon: Flag,
    color: tokens.colors.success,
    fields: [
      { id: 'gir', label: 'GIR (Green in Regulation)', type: 'fraction', max: 18 },
      { id: 'proximity', label: 'Gj.sn. avstand til hull', type: 'number', unit: 'm' },
    ],
  },
  {
    id: 'short_game',
    name: 'Kortspill',
    icon: Flag,
    color: tokens.colors.gold,
    fields: [
      { id: 'sand_saves', label: 'Sand saves', type: 'fraction', max: null },
      { id: 'up_and_downs', label: 'Up & Downs', type: 'fraction', max: null },
      { id: 'scrambling', label: 'Scrambling %', type: 'percentage' },
    ],
  },
  {
    id: 'putting',
    name: 'Putting',
    icon: Target,
    color: tokens.colors.error,
    fields: [
      { id: 'total_putts', label: 'Totalt antall putter', type: 'number' },
      { id: 'putts_per_gir', label: 'Putter per GIR', type: 'decimal' },
      { id: 'one_putts', label: 'En-putter', type: 'number' },
      { id: 'three_putts', label: 'Tre-putter', type: 'number' },
    ],
  },
];

const RECENT_ENTRIES = [
  { id: 'e1', date: '2025-01-14', type: 'Treningsrunde', course: 'Miklagard Golf', score: 74 },
  { id: 'e2', date: '2025-01-12', type: 'Simulator', course: 'Indoor', score: null },
  { id: 'e3', date: '2025-01-10', type: 'Turnering', course: 'Holtsmark GK', score: 71 },
];

// ============================================================================
// CATEGORY CARD COMPONENT
// ============================================================================

const CategoryCard = ({ category, values, onChange, isExpanded, onToggle }) => {
  const Icon = category.icon;

  return (
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <div
        onClick={onToggle}
        style={{
          padding: '16px 20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          backgroundColor: `${category.color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={20} color={category.color} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
            margin: 0,
          }}>
            {category.name}
          </h3>
          <div style={{ fontSize: '12px', color: tokens.colors.steel }}>
            {category.fields.length} felt
          </div>
        </div>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          backgroundColor: tokens.colors.snow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
        }}>
          <ChevronRight size={16} color={tokens.colors.steel} />
        </div>
      </div>

      {isExpanded && (
        <div style={{
          padding: '0 20px 20px',
          borderTop: `1px solid ${tokens.colors.mist}`,
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginTop: '16px',
          }}>
            {category.fields.map((field) => (
              <div key={field.id}>
                <label style={{
                  fontSize: '13px',
                  color: tokens.colors.charcoal,
                  marginBottom: '6px',
                  display: 'block',
                }}>
                  {field.label}
                </label>
                {field.type === 'fraction' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      min="0"
                      max={field.max || 99}
                      value={values[field.id]?.numerator || ''}
                      onChange={(e) => onChange(field.id, {
                        ...values[field.id],
                        numerator: e.target.value,
                      })}
                      placeholder="0"
                      style={{
                        width: '60px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${tokens.colors.mist}`,
                        fontSize: '14px',
                        textAlign: 'center',
                      }}
                    />
                    <span style={{ color: tokens.colors.steel }}>/</span>
                    <input
                      type="number"
                      min="1"
                      max={field.max || 99}
                      value={values[field.id]?.denominator || (field.max || '')}
                      onChange={(e) => onChange(field.id, {
                        ...values[field.id],
                        denominator: e.target.value,
                      })}
                      placeholder={field.max?.toString() || ''}
                      style={{
                        width: '60px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${tokens.colors.mist}`,
                        fontSize: '14px',
                        textAlign: 'center',
                      }}
                    />
                    {values[field.id]?.numerator && values[field.id]?.denominator && (
                      <span style={{
                        fontSize: '13px',
                        color: tokens.colors.primary,
                        marginLeft: '8px',
                      }}>
                        = {Math.round((values[field.id].numerator / values[field.id].denominator) * 100)}%
                      </span>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      step={field.type === 'decimal' ? '0.01' : '1'}
                      value={values[field.id] || ''}
                      onChange={(e) => onChange(field.id, e.target.value)}
                      placeholder="0"
                      style={{
                        width: '100px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${tokens.colors.mist}`,
                        fontSize: '14px',
                      }}
                    />
                    {field.unit && (
                      <span style={{ fontSize: '13px', color: tokens.colors.steel }}>
                        {field.unit}
                      </span>
                    )}
                    {field.type === 'percentage' && (
                      <span style={{ fontSize: '13px', color: tokens.colors.steel }}>%</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const StatsOppdateringContainer = () => {
  const [expandedCategory, setExpandedCategory] = useState('driving');
  const [sessionType, setSessionType] = useState('');
  const [course, setCourse] = useState('');
  const [score, setScore] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [values, setValues] = useState({});

  const handleValueChange = (fieldId, value) => {
    setValues(prev => ({ ...prev, [fieldId]: value }));
  };

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [isSaving, setIsSaving] = useState(false);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [saveSuccess, setSaveSuccess] = useState(false);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [saveError, setSaveError] = useState(null);

  const handleSave = async () => {
    const data = {
      sessionType,
      course,
      score: score ? parseInt(score) : null,
      date,
      stats: values,
    };

    setIsSaving(true);
    setSaveError(null);

    try {
      await apiClient.post('/stats', data);
      setSaveSuccess(true);
      // Reset form after successful save
      setValues({});
      setSessionType('');
      setCourse('');
      setScore('');
    } catch (err) {
      console.error('Failed to save stats:', err);
      setSaveError(err.message || 'Kunne ikke lagre statistikk');
    } finally {
      setIsSaving(false);
    }
  };

  const sessionTypes = [
    { value: 'round', label: 'Treningsrunde' },
    { value: 'tournament', label: 'Turnering' },
    { value: 'simulator', label: 'Simulator' },
    { value: 'practice', label: 'Treningsokt' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Ny statistikk"
        subtitle="Registrer nye prestasjonsdata"
      />

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Session Info */}
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
            margin: '0 0 16px 0',
          }}>
            Okt-informasjon
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            <div>
              <label style={{
                fontSize: '13px',
                color: tokens.colors.charcoal,
                marginBottom: '6px',
                display: 'block',
              }}>
                Type okt
              </label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${tokens.colors.mist}`,
                  fontSize: '14px',
                  backgroundColor: tokens.colors.white,
                }}
              >
                <option value="">Velg type...</option>
                {sessionTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                fontSize: '13px',
                color: tokens.colors.charcoal,
                marginBottom: '6px',
                display: 'block',
              }}>
                Bane / Sted
              </label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="F.eks. Miklagard Golf"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${tokens.colors.mist}`,
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{
                fontSize: '13px',
                color: tokens.colors.charcoal,
                marginBottom: '6px',
                display: 'block',
              }}>
                Dato
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${tokens.colors.mist}`,
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{
                fontSize: '13px',
                color: tokens.colors.charcoal,
                marginBottom: '6px',
                display: 'block',
              }}>
                Score (valgfritt)
              </label>
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="F.eks. 72"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${tokens.colors.mist}`,
                  fontSize: '14px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Stat Categories */}
        <h2 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: tokens.colors.charcoal,
          margin: '0 0 16px 0',
        }}>
          Statistikk
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {STAT_CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              values={values}
              onChange={handleValueChange}
              isExpanded={expandedCategory === category.id}
              onToggle={() => setExpandedCategory(
                expandedCategory === category.id ? null : category.id
              )}
            />
          ))}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
        }}>
          <button
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: `1px solid ${tokens.colors.mist}`,
              backgroundColor: tokens.colors.white,
              color: tokens.colors.charcoal,
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <X size={16} />
            Avbryt
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: tokens.colors.primary,
              color: tokens.colors.white,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Save size={16} />
            Lagre statistikk
          </button>
        </div>

        {/* Recent Entries */}
        <div style={{ marginTop: '32px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
            margin: '0 0 16px 0',
          }}>
            Siste registreringer
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {RECENT_ENTRIES.map((entry) => (
              <div
                key={entry.id}
                style={{
                  backgroundColor: tokens.colors.white,
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: tokens.colors.snow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <BarChart2 size={18} color={tokens.colors.primary} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal }}>
                    {entry.type} - {entry.course}
                  </div>
                  <div style={{ fontSize: '12px', color: tokens.colors.steel }}>
                    {entry.date}
                  </div>
                </div>
                {entry.score && (
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: tokens.colors.charcoal,
                  }}>
                    {entry.score}
                  </div>
                )}
                <ChevronRight size={16} color={tokens.colors.steel} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOppdateringContainer;
