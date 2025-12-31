import React, { useState } from 'react';
import {
  Save, CheckCircle,
  Plus, Trash2
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { SubSectionTitle } from '../../components/typography';
import Button from '../../ui/primitives/Button';
import apiClient from '../../services/apiClient';
import { getTestCategoryIcon } from '../../constants/icons';

// ============================================================================
// MOCK DATA
// ============================================================================

const TEST_CATEGORIES = [
  {
    id: 'driving',
    name: 'Driving',
    color: tokens.colors.primary,
    tests: [
      { id: 'driver_distance', name: 'Driver avstand', unit: 'm', type: 'number' },
      { id: 'driver_accuracy', name: 'Fairway treff', unit: '%', type: 'percentage' },
      { id: 'club_speed', name: 'Klubbfart', unit: 'mph', type: 'number' },
      { id: 'ball_speed', name: 'Ballfart', unit: 'mph', type: 'number' },
      { id: 'smash_factor', name: 'Smash factor', unit: '', type: 'decimal' },
    ],
  },
  {
    id: 'iron_play',
    name: 'Jernspill',
    color: tokens.colors.success,
    tests: [
      { id: 'gir', name: 'GIR', unit: '%', type: 'percentage' },
      { id: 'proximity_100', name: 'Naerhet fra 100m', unit: 'm', type: 'decimal' },
      { id: 'proximity_150', name: 'Naerhet fra 150m', unit: 'm', type: 'decimal' },
      { id: 'dispersion', name: 'Spredning', unit: 'm', type: 'decimal' },
    ],
  },
  {
    id: 'short_game',
    name: 'Kortspill',
    color: tokens.colors.warning,
    tests: [
      { id: 'scrambling', name: 'Scrambling', unit: '%', type: 'percentage' },
      { id: 'sand_saves', name: 'Sand saves', unit: '%', type: 'percentage' },
      { id: 'up_and_down', name: 'Up and down', unit: '%', type: 'percentage' },
      { id: 'chip_proximity', name: 'Chip naerhet', unit: 'm', type: 'decimal' },
    ],
  },
  {
    id: 'putting',
    name: 'Putting',
    color: tokens.colors.error,
    tests: [
      { id: 'putts_per_round', name: 'Putts per runde', unit: '', type: 'decimal' },
      { id: 'one_putt_pct', name: 'En-putt prosent', unit: '%', type: 'percentage' },
      { id: 'three_putt_pct', name: 'Tre-putt prosent', unit: '%', type: 'percentage' },
      { id: 'putt_distance_1m', name: 'Putt fra 1m', unit: '%', type: 'percentage' },
      { id: 'putt_distance_3m', name: 'Putt fra 3m', unit: '%', type: 'percentage' },
    ],
  },
  {
    id: 'physical',
    name: 'Fysisk',
    color: tokens.colors.gold,
    tests: [
      { id: 'core_hold', name: 'Plankehold', unit: 'sek', type: 'number' },
      { id: 'squat', name: 'Squat maks', unit: 'kg', type: 'number' },
      { id: 'rotation_speed', name: 'Rotasjonshastighet', unit: 'deg/s', type: 'number' },
      { id: 'flexibility', name: 'Fleksibilitet', unit: 'cm', type: 'number' },
    ],
  },
];

const RECENT_TESTS = [
  { id: 1, name: 'Driver avstand', value: 255, unit: 'm', date: '2025-01-18' },
  { id: 2, name: 'GIR', value: 55, unit: '%', date: '2025-01-15' },
  { id: 3, name: 'Plankehold', value: 90, unit: 'sek', date: '2025-01-12' },
];

// ============================================================================
// TEST CATEGORY CARD
// ============================================================================

const TestCategoryCard = ({ category, selected, onSelect }) => {
  const CategoryIcon = getTestCategoryIcon(category.id);

  return (
    <button
      onClick={() => onSelect(category)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacing-2)',
        padding: 'var(--spacing-4) var(--spacing-3)',
        borderRadius: '12px',
        border: selected?.id === category.id
          ? `2px solid ${category.color}`
          : '2px solid transparent',
        backgroundColor: selected?.id === category.id
          ? `${category.color}15`
          : tokens.colors.white,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        backgroundColor: selected?.id === category.id
          ? category.color
          : `${category.color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <CategoryIcon
          size={20}
          color={selected?.id === category.id ? tokens.colors.white : category.color}
        />
      </div>
      <span style={{
        fontSize: '12px',
        fontWeight: 500,
        color: selected?.id === category.id ? category.color : tokens.colors.charcoal,
      }}>
        {category.name}
      </span>
    </button>
  );
};

// ============================================================================
// TEST INPUT
// ============================================================================

const TestInput = ({ test, value, onChange, onRemove }) => {
  const handleChange = (e) => {
    let val = e.target.value;
    if (test.type === 'percentage') {
      val = Math.min(100, Math.max(0, parseFloat(val) || 0));
    } else if (test.type === 'number') {
      val = Math.max(0, parseInt(val) || 0);
    } else if (test.type === 'decimal') {
      val = Math.max(0, parseFloat(val) || 0);
    }
    onChange(val);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-3)',
      padding: 'var(--spacing-3) var(--spacing-3)',
      backgroundColor: tokens.colors.white,
      borderRadius: '10px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{ flex: 1 }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 500,
          color: tokens.colors.charcoal,
          marginBottom: 'var(--spacing-1)',
        }}>
          {test.name}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <input
            type="number"
            value={value || ''}
            onChange={handleChange}
            placeholder="0"
            step={test.type === 'decimal' ? '0.1' : '1'}
            style={{
              flex: 1,
              padding: 'var(--spacing-2) var(--spacing-3)',
              borderRadius: '8px',
              border: `1px solid ${tokens.colors.mist}`,
              fontSize: '16px',
              fontWeight: 500,
              outline: 'none',
            }}
          />
          {test.unit && (
            <span style={{
              fontSize: '14px',
              color: tokens.colors.steel,
              minWidth: '40px',
            }}>
              {test.unit}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={onRemove}
        style={{
          padding: 'var(--spacing-2)',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: `${tokens.colors.error}10`,
          cursor: 'pointer',
        }}
      >
        <Trash2 size={16} color={tokens.colors.error} />
      </button>
    </div>
  );
};

// ============================================================================
// TEST SELECTOR
// ============================================================================

const TestSelector = ({ category, selectedTests, onToggle }) => {
  if (!category) return null;

  return (
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '14px',
      padding: 'var(--spacing-4)',
      marginBottom: 'var(--spacing-5)',
    }}>
      <SubSectionTitle style={{
        fontSize: '14px',
        fontWeight: 600,
        color: tokens.colors.charcoal,
        marginBottom: 'var(--spacing-3)',
      }}>
        Velg tester - {category.name}
      </SubSectionTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
        {category.tests.map((test) => {
          const isSelected = selectedTests.some((t) => t.id === test.id);

          return (
            <button
              key={test.id}
              onClick={() => onToggle(test)}
              style={{
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: '8px',
                border: isSelected
                  ? `2px solid ${category.color}`
                  : `1px solid ${tokens.colors.mist}`,
                backgroundColor: isSelected ? `${category.color}10` : tokens.colors.snow,
                color: isSelected ? category.color : tokens.colors.charcoal,
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-1)',
              }}
            >
              {isSelected ? <CheckCircle size={14} /> : <Plus size={14} />}
              {test.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// RECENT TESTS
// ============================================================================

const RecentTests = ({ tests }) => (
  <div style={{
    backgroundColor: tokens.colors.white,
    borderRadius: '14px',
    padding: 'var(--spacing-4)',
  }}>
    <SubSectionTitle style={{
      fontSize: '14px',
      fontWeight: 600,
      color: tokens.colors.charcoal,
      marginBottom: 'var(--spacing-3)',
    }}>
      Siste registreringer
    </SubSectionTitle>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
      {tests.map((test) => (
        <div
          key={test.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--spacing-2) var(--spacing-3)',
            backgroundColor: tokens.colors.snow,
            borderRadius: '8px',
          }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: tokens.colors.charcoal }}>
              {test.name}
            </div>
            <div style={{ fontSize: '11px', color: tokens.colors.steel }}>
              {new Date(test.date).toLocaleDateString('nb-NO')}
            </div>
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: 600,
            color: tokens.colors.primary,
          }}>
            {test.value}{test.unit}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const RegistrerTestContainer = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [testValues, setTestValues] = useState({});
  const [notes, setNotes] = useState('');

  const handleToggleTest = (test) => {
    if (selectedTests.some((t) => t.id === test.id)) {
      setSelectedTests(selectedTests.filter((t) => t.id !== test.id));
      const newValues = { ...testValues };
      delete newValues[test.id];
      setTestValues(newValues);
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const handleRemoveTest = (testId) => {
    setSelectedTests(selectedTests.filter((t) => t.id !== testId));
    const newValues = { ...testValues };
    delete newValues[testId];
    setTestValues(newValues);
  };

  const handleValueChange = (testId, value) => {
    setTestValues({ ...testValues, [testId]: value });
  };

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [submitSuccess, setSubmitSuccess] = useState(false);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async () => {
    const data = {
      tests: selectedTests.map((test) => ({
        id: test.id,
        name: test.name,
        value: testValues[test.id],
        unit: test.unit,
      })),
      notes,
      date: new Date().toISOString(),
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await apiClient.post('/tests/results', data);
      setSubmitSuccess(true);
      // Reset form after successful submission
      setSelectedTests([]);
      setTestValues({});
      setNotes('');
    } catch (err) {
      console.error('Failed to submit test results:', err);
      setSubmitError(err.message || 'Kunne ikke lagre testresultatene');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = selectedTests.length > 0 &&
    selectedTests.every((test) => testValues[test.id] !== undefined && testValues[test.id] !== '');

  return (
    <div style={{ maxWidth: '1536px', margin: '0 auto' }}>
        {/* Category Selection */}
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: '14px',
          padding: 'var(--spacing-4)',
          marginBottom: 'var(--spacing-5)',
        }}>
          <SubSectionTitle style={{
            fontSize: '14px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
            marginBottom: 'var(--spacing-3)',
          }}>
            Velg testkategori
          </SubSectionTitle>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: 'var(--spacing-2)',
          }}>
            {TEST_CATEGORIES.map((category) => (
              <TestCategoryCard
                key={category.id}
                category={category}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            ))}
          </div>
        </div>

        {/* Test Selection */}
        <TestSelector
          category={selectedCategory}
          selectedTests={selectedTests}
          onToggle={handleToggleTest}
        />

        {/* Selected Tests with Inputs */}
        {selectedTests.length > 0 && (
          <div style={{ marginBottom: 'var(--spacing-5)' }}>
            <SubSectionTitle style={{
              fontSize: '14px',
              fontWeight: 600,
              color: tokens.colors.charcoal,
              marginBottom: 'var(--spacing-3)',
            }}>
              Registrer verdier
            </SubSectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              {selectedTests.map((test) => (
                <TestInput
                  key={test.id}
                  test={test}
                  value={testValues[test.id]}
                  onChange={(value) => handleValueChange(test.id, value)}
                  onRemove={() => handleRemoveTest(test.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {selectedTests.length > 0 && (
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '14px',
            padding: 'var(--spacing-4)',
            marginBottom: 'var(--spacing-5)',
          }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: tokens.colors.charcoal,
              marginBottom: 'var(--spacing-2)',
            }}>
              Notater (valgfritt)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Legg til eventuelle notater om testen..."
              rows={3}
              style={{
                width: '100%',
                padding: 'var(--spacing-3) var(--spacing-3)',
                borderRadius: '8px',
                border: `1px solid ${tokens.colors.mist}`,
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>
        )}

        {/* Submit Button */}
        {selectedTests.length > 0 && (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
            leftIcon={<Save size={18} />}
            fullWidth
            style={{ marginBottom: 'var(--spacing-6)' }}
          >
            Lagre testresultater
          </Button>
        )}

        {/* Recent Tests */}
        <RecentTests tests={RECENT_TESTS} />
    </div>
  );
};

export default RegistrerTestContainer;
