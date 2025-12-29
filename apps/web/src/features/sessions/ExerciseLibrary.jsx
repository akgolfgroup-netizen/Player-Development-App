/**
 * ExerciseLibrary - Øvelser og Driller
 *
 * Øvelsesbibliotek med strukturerte treningsprotokoller.
 * Basert på: APP_FUNCTIONALITY.md Section 10
 * Design: /packages/design-system/figma/ak_golf_complete_figma_kit.svg
 */
import React, { useState } from 'react';
import { Heart, Plus, Clock, ChevronDown, ChevronUp } from 'lucide-react';
// UiCanon: Using CSS variables instead of tokens
import { PageHeader } from '../../components/layout/PageHeader';
import StateCard from '../../ui/composites/StateCard';
import Button from '../../ui/primitives/Button';

// ============================================================
// AK GOLF KATEGORI HIERARKI v2.0 - Komplett filter-system
// ============================================================

// 1. PYRAMIDEN - 5 nivåer
const pyramideLevels = [
  { id: 'all', label: 'Alle' },
  { id: 'FYS', label: 'Fysisk' },
  { id: 'TEK', label: 'Teknikk' },
  { id: 'SLAG', label: 'Golfslag' },
  { id: 'SPILL', label: 'Spill' },
  { id: 'TURN', label: 'Turnering' },
];

// 2. TRENINGSOMRÅDER - 16 områder
const golfAreas = [
  { id: 'all', label: 'Alle' },
  // Full Swing (5)
  { id: 'TEE', label: 'Tee Total' },
  { id: 'INN200', label: 'Innspill 200+ m' },
  { id: 'INN150', label: 'Innspill 150-200 m' },
  { id: 'INN100', label: 'Innspill 100-150 m' },
  { id: 'INN50', label: 'Innspill 50-100 m' },
  // Nærspill (4)
  { id: 'PITCH', label: 'Pitch' },
  { id: 'BUNKER', label: 'Bunker' },
  { id: 'LOB', label: 'Lob' },
  { id: 'CHIP', label: 'Chip' },
  // Putting (7)
  { id: 'PUTT0-3', label: 'Putting 0-3 ft' },
  { id: 'PUTT3-5', label: 'Putting 3-5 ft' },
  { id: 'PUTT5-10', label: 'Putting 5-10 ft' },
  { id: 'PUTT10-15', label: 'Putting 10-15 ft' },
  { id: 'PUTT15-25', label: 'Putting 15-25 ft' },
  { id: 'PUTT25-40', label: 'Putting 25-40 ft' },
  { id: 'PUTT40+', label: 'Putting 40+ ft' },
];

// Grouped areas for compact filter display
const areaGroups = [
  { id: 'all', label: 'Alle' },
  { id: 'TEE', label: 'Tee' },
  { id: 'INN', label: 'Innspill' },
  { id: 'CHIP', label: 'Chip' },
  { id: 'PITCH', label: 'Pitch' },
  { id: 'LOB', label: 'Lob' },
  { id: 'BUNKER', label: 'Bunker' },
  { id: 'PUTT', label: 'Putting' },
];

// 3. L-FASER (Clubspeed) - 5 nivåer
const lFaser = [
  { id: 'all', label: 'Alle' },
  { id: 'CS20', label: 'CS 20%' },
  { id: 'CS40', label: 'CS 40%' },
  { id: 'CS60', label: 'CS 60%' },
  { id: 'CS80', label: 'CS 80%' },
  { id: 'CS100', label: 'CS 100%' },
];

// 4. MILJØ - 6 nivåer
const miljoLevels = [
  { id: 'all', label: 'Alle' },
  { id: 'M0', label: 'M0 Off course' },
  { id: 'M1', label: 'M1 Innendørs' },
  { id: 'M2', label: 'M2 Range' },
  { id: 'M3', label: 'M3 Treningsområde' },
  { id: 'M4', label: 'M4 Bane trening' },
  { id: 'M5', label: 'M5 Turnering' },
];

// 5. BELASTNING/PRESS - 5 nivåer
const pressLevels = [
  { id: 'all', label: 'Alle' },
  { id: 'PR1', label: 'PR1 Ingen' },
  { id: 'PR2', label: 'PR2 Selvmonitorering' },
  { id: 'PR3', label: 'PR3 Sosialt' },
  { id: 'PR4', label: 'PR4 Konkurranse' },
  { id: 'PR5', label: 'PR5 Turnering' },
];

// Demo exercises - Using full AK Golf Kategori Hierarki v2.0
const exercises = [
  // FYSISK (FYS)
  {
    id: 'hip-rotation',
    name: 'Hofterotasjon',
    pyramide: 'FYS',
    golfArea: 'TEE',
    lFase: 'CS20',
    miljo: 'M0',
    press: 'PR1',
    duration: { min: 15, max: 20 },
    difficulty: 2,
    description: 'Mobilitet og styrke i hofterotasjon.',
  },
  {
    id: 'core-stability',
    name: 'Core Stabilitet',
    pyramide: 'FYS',
    golfArea: 'TEE',
    lFase: 'CS20',
    miljo: 'M0',
    press: 'PR1',
    duration: { min: 20, max: 30 },
    difficulty: 3,
    description: 'Styrk kjernemuskulatur for bedre rotasjon.',
  },
  // TEKNIKK (TEK)
  {
    id: 'driver-target',
    name: 'Driver Target',
    pyramide: 'TEK',
    golfArea: 'TEE',
    lFase: 'CS60',
    miljo: 'M2',
    press: 'PR2',
    duration: { min: 20, max: 30 },
    difficulty: 2,
    description: 'Driver-slag mot definert målområde.',
  },
  {
    id: 'pyramiden',
    name: 'Pyramiden',
    pyramide: 'TEK',
    golfArea: 'PUTT5-10',
    lFase: 'CS40',
    miljo: 'M3',
    press: 'PR1',
    duration: { min: 20, max: 30 },
    difficulty: 2,
    description: 'Bygg opp og ned i antall slag til samme mål.',
  },
  {
    id: 'gate-drill',
    name: 'Gate Drill',
    pyramide: 'TEK',
    golfArea: 'PUTT3-5',
    lFase: 'CS40',
    miljo: 'M3',
    press: 'PR1',
    duration: { min: 10, max: 20 },
    difficulty: 2,
    description: 'Porter med tees som ballen må gå gjennom.',
  },
  {
    id: 'bunker-basics',
    name: 'Bunker Basics',
    pyramide: 'TEK',
    golfArea: 'BUNKER',
    lFase: 'CS60',
    miljo: 'M3',
    press: 'PR2',
    duration: { min: 15, max: 25 },
    difficulty: 3,
    description: 'Grunnleggende bunkerslag fra greenside.',
  },
  // GOLFSLAG (SLAG)
  {
    id: 'scattered',
    name: 'Scattered',
    pyramide: 'SLAG',
    golfArea: 'CHIP',
    lFase: 'CS80',
    miljo: 'M3',
    press: 'PR2',
    duration: { min: 15, max: 30 },
    difficulty: 3,
    description: 'Bytt mål og/eller klubb for HVERT slag.',
  },
  {
    id: 'clock-drill',
    name: 'Clock Drill',
    pyramide: 'SLAG',
    golfArea: 'PUTT3-5',
    lFase: 'CS60',
    miljo: 'M3',
    press: 'PR3',
    duration: { min: 15, max: 30 },
    difficulty: 4,
    description: '12 baller rundt hullet som en klokke.',
  },
  {
    id: 'wedge-ladder',
    name: 'Wedge Ladder',
    pyramide: 'SLAG',
    golfArea: 'INN50',
    lFase: 'CS80',
    miljo: 'M2',
    press: 'PR2',
    duration: { min: 20, max: 30 },
    difficulty: 3,
    description: 'Øv avstander med wedge: 50m, 75m, 100m.',
  },
  {
    id: 'pitch-distance',
    name: 'Pitch Avstandskontroll',
    pyramide: 'SLAG',
    golfArea: 'PITCH',
    lFase: 'CS60',
    miljo: 'M3',
    press: 'PR2',
    duration: { min: 20, max: 30 },
    difficulty: 3,
    description: 'Kontroller avstander med pitch-slag.',
  },
  {
    id: 'iron-precision',
    name: 'Jern Presisjon',
    pyramide: 'SLAG',
    golfArea: 'INN100',
    lFase: 'CS80',
    miljo: 'M2',
    press: 'PR2',
    duration: { min: 25, max: 35 },
    difficulty: 3,
    description: 'Presisjonstrening med 7-9 jern.',
  },
  // SPILL
  {
    id: '9-holes-putting',
    name: '9-holes Putting',
    pyramide: 'SPILL',
    golfArea: 'PUTT5-10',
    lFase: 'CS60',
    miljo: 'M3',
    press: 'PR3',
    duration: { min: 15, max: 25 },
    difficulty: 3,
    description: 'Simuler 9 hull på puttinggreenen.',
  },
  {
    id: 'up-and-down',
    name: 'Up & Down Challenge',
    pyramide: 'SPILL',
    golfArea: 'CHIP',
    lFase: 'CS80',
    miljo: 'M3',
    press: 'PR4',
    duration: { min: 20, max: 30 },
    difficulty: 4,
    description: 'Chip + putt fra ulike posisjoner rundt green.',
  },
  // TURNERING (TURN)
  {
    id: 'pressure-putting',
    name: 'Pressure Putting',
    pyramide: 'TURN',
    golfArea: 'PUTT3-5',
    lFase: 'CS100',
    miljo: 'M5',
    press: 'PR5',
    duration: { min: 15, max: 25 },
    difficulty: 5,
    description: 'Putting under simulert turneringspress.',
  },
];

// Exercise card component - Minimalist design
function ExerciseCard({ exercise, onSelect, onToggleFavorite, onAddToPlan, isFavorite }) {
  const difficultyDots = Array(5).fill(0).map((_, i) => i < exercise.difficulty);

  // Get labels
  const pyramideLabel = pyramideLevels.find(p => p.id === exercise.pyramide)?.label || exercise.pyramide;
  const areaLabel = golfAreas.find(a => a.id === exercise.golfArea)?.label || exercise.golfArea;

  // Pyramide colors
  const pyramideColors = {
    FYS: '#e74c3c',    // Red
    TEK: '#3498db',    // Blue
    SLAG: '#27ae60',   // Green
    SPILL: '#9b59b6',  // Purple
    TURN: '#f39c12',   // Orange
  };

  // Background colors with opacity (for tags)
  const pyramideBgColors = {
    FYS: '#e74c3c15',
    TEK: '#3498db15',
    SLAG: '#27ae6015',
    SPILL: '#9b59b615',
    TURN: '#f39c1215',
  };

  return (
    <div
      onClick={() => onSelect(exercise)}
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
      }}
    >
      {/* Top color bar based on pyramide level */}
      <div style={{
        height: '4px',
        backgroundColor: pyramideColors[exercise.pyramide] || 'var(--accent)',
      }} />

      <div style={{ padding: '16px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h3 style={{
            margin: 0,
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
          }}>
            {exercise.name}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(exercise.id); }}
            style={{ color: isFavorite ? 'var(--error)' : 'var(--border-default)', padding: '4px' }}
          >
            <Heart size={18} fill={isFavorite ? 'var(--error)' : 'none'} />
          </Button>
        </div>

        {/* Tags row */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '11px',
            padding: '3px 8px',
            backgroundColor: pyramideBgColors[exercise.pyramide] || 'rgba(var(--accent-rgb), 0.15)',
            borderRadius: '4px',
            color: pyramideColors[exercise.pyramide] || 'var(--accent)',
            fontWeight: 500,
          }}>
            {pyramideLabel}
          </span>
          <span style={{
            fontSize: '11px',
            padding: '3px 8px',
            backgroundColor: 'var(--border-default)',
            borderRadius: '4px',
            color: 'var(--text-primary)',
            fontWeight: 500,
          }}>
            {areaLabel}
          </span>
        </div>

        {/* Description */}
        <p style={{
          margin: '0 0 12px 0',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.4,
        }}>
          {exercise.description}
        </p>

        {/* Footer row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-default)',
        }}>
          {/* Duration and difficulty */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <Clock size={14} />
              {exercise.duration.min}-{exercise.duration.max} min
            </span>
            <div style={{ display: 'flex', gap: '2px' }}>
              {difficultyDots.map((filled, i) => (
                <div
                  key={i}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: filled ? 'var(--achievement)' : 'var(--border-default)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Add to plan button */}
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={(e) => { e.stopPropagation(); onAddToPlan(exercise); }}
          >
            Legg til
          </Button>
        </div>
      </div>
    </div>
  );
}

// Exercise detail modal
function ExerciseDetailModal({ exercise, onClose, onAddToSession }) {
  if (!exercise) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          padding: '24px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '22px', lineHeight: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
            📋 {exercise.name}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            style={{ fontSize: '24px', padding: '4px' }}
          >
            ✕
          </Button>
        </div>

        {/* Meta info */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              padding: `${'8px'} ${'16px'}`,
              borderRadius: 'var(--radius-md)',
            }}
          >
            <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>Kategori</span>
            <div style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500, color: 'var(--accent)' }}>{exercise.category}</div>
          </div>
          <div
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              padding: `${'8px'} ${'16px'}`,
              borderRadius: 'var(--radius-md)',
            }}
          >
            <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>Varighet</span>
            <div style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500, color: 'var(--accent)' }}>
              {exercise.duration.min}-{exercise.duration.max} min
            </div>
          </div>
          {exercise.reps && (
            <div
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                padding: `${'8px'} ${'16px'}`,
                borderRadius: 'var(--radius-md)',
              }}
            >
              <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>Repetisjoner</span>
              <div style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500, color: 'var(--accent)' }}>{exercise.reps}</div>
            </div>
          )}
        </div>

        {/* Description */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
            Beskrivelse
          </span>
          <p style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)' }}>
            {exercise.description}
          </p>
        </div>

        {/* Instructions */}
        {exercise.instructions && (
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
              Instruksjoner
            </span>
            <ul style={{ paddingLeft: '24px', margin: 0 }}>
              {exercise.instructions.map((instruction, i) => (
                <li key={i} style={{ fontSize: '14px', lineHeight: '19px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Variants */}
        {exercise.variants && (
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
              Varianter
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {exercise.variants.map((variant, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <span style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500, color: 'var(--accent)' }}>
                    {variant.name}
                  </span>
                  {variant.description && (
                    <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                      - {variant.description}
                    </span>
                  )}
                  {variant.reps && (
                    <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                      ({variant.reps} slag)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Equipment */}
        {exercise.equipment && (
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
              Utstyr
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {exercise.equipment.map((item, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '12px', lineHeight: '16px',
                    padding: '4px 10px',
                    backgroundColor: 'var(--border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Training areas */}
        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
            Bruksområde
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {exercise.trainingAreas.map((area, i) => (
              <span
                key={i}
                style={{
                  fontSize: '12px', lineHeight: '16px',
                  padding: '4px 10px',
                  backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--bg-primary)',
                  textTransform: 'capitalize',
                }}
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Add button */}
        <Button
          variant="primary"
          onClick={() => onAddToSession(exercise)}
          style={{ width: '100%', padding: '16px', fontSize: '20px', fontWeight: 600 }}
        >
          Legg til i økt
        </Button>
      </div>
    </div>
  );
}

// Main ExerciseLibrary component
export default function ExerciseLibrary({ onSelectExercise, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPyramide, setSelectedPyramide] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedLFase, setSelectedLFase] = useState('all');
  const [selectedMiljo, setSelectedMiljo] = useState('all');
  const [selectedPress, setSelectedPress] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('exerciseFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleToggleFavorite = (exerciseId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId];
      localStorage.setItem('exerciseFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const handleAddToPlan = (exercise) => {
    alert(`"${exercise.name}" lagt til i treningsplan!`);
    if (onSelectExercise) onSelectExercise(exercise);
  };

  const resetAllFilters = () => {
    setSelectedPyramide('all');
    setSelectedArea('all');
    setSelectedLFase('all');
    setSelectedMiljo('all');
    setSelectedPress('all');
    setShowOnlyFavorites(false);
  };

  const hasActiveAdvancedFilters = selectedLFase !== 'all' || selectedMiljo !== 'all' || selectedPress !== 'all';
  const hasActiveFilters = selectedPyramide !== 'all' || selectedArea !== 'all' ||
    hasActiveAdvancedFilters || showOnlyFavorites;

  // Filter exercises using all criteria
  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPyramide = selectedPyramide === 'all' || ex.pyramide === selectedPyramide;
    const matchesArea = selectedArea === 'all' ||
      ex.golfArea === selectedArea ||
      ex.golfArea.startsWith(selectedArea);
    const matchesLFase = selectedLFase === 'all' || ex.lFase === selectedLFase;
    const matchesMiljo = selectedMiljo === 'all' || ex.miljo === selectedMiljo;
    const matchesPress = selectedPress === 'all' || ex.press === selectedPress;
    const matchesFavorites = !showOnlyFavorites || favorites.includes(ex.id);
    return matchesSearch && matchesPyramide && matchesArea && matchesLFase && matchesMiljo && matchesPress && matchesFavorites;
  });

  const handleAddToSession = (exercise) => {
    if (onSelectExercise) onSelectExercise(exercise);
    setSelectedExercise(null);
    if (onClose) onClose();
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      {/* PageHeader */}
      <PageHeader
        title="Øvelsesbibliotek"
        subtitle={`${exercises.length} øvelser`}
        actions={
          <Button
            variant={showOnlyFavorites ? 'primary' : 'secondary'}
            size="sm"
            leftIcon={<Heart size={16} fill={showOnlyFavorites ? 'currentColor' : 'none'} />}
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            style={showOnlyFavorites ? { backgroundColor: 'var(--error)' } : undefined}
          >
            Favoritter
            {favorites.length > 0 && (
              <span style={{
                backgroundColor: showOnlyFavorites ? 'rgba(255,255,255,0.3)' : 'var(--text-secondary)',
                color: 'white',
                borderRadius: '10px',
                padding: '1px 6px',
                fontSize: '11px',
                marginLeft: '4px',
              }}>
                {favorites.length}
              </span>
            )}
          </Button>
        }
      />

      {/* Compact filters */}
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        padding: '12px 24px',
        borderBottom: '1px solid var(--border-default)',
      }}>
        {/* Search and filters in one row */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <input
            type="text"
            placeholder="Søk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '200px',
              padding: '8px 12px',
              backgroundColor: 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
            }}
          />

          {/* Pyramide level chips */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {pyramideLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedPyramide(level.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: selectedPyramide === level.id ? 'var(--accent)' : 'transparent',
                  color: selectedPyramide === level.id ? 'white' : 'var(--text-primary)',
                  border: selectedPyramide === level.id ? 'none' : '1px solid var(--border-default)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                {level.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-default)' }} />

          {/* Golf area chips (using grouped areas for compact display) */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {areaGroups.map((area) => (
              <button
                key={area.id}
                onClick={() => setSelectedArea(area.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: selectedArea === area.id ? 'var(--accent)' : 'transparent',
                  color: selectedArea === area.id ? 'white' : 'var(--text-secondary)',
                  border: selectedArea === area.id ? 'none' : '1px solid var(--border-default)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                {area.label}
              </button>
            ))}
          </div>

          {/* Advanced filters toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              backgroundColor: showAdvancedFilters || hasActiveAdvancedFilters ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
              border: `1px solid ${showAdvancedFilters || hasActiveAdvancedFilters ? 'var(--accent)' : 'var(--border-default)'}`,
              borderRadius: '16px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              color: showAdvancedFilters || hasActiveAdvancedFilters ? 'var(--accent)' : 'var(--text-secondary)',
            }}
          >
            Avansert
            {hasActiveAdvancedFilters && (
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
              }} />
            )}
            {showAdvancedFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Advanced filters section */}
        {showAdvancedFilters && (
          <div style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-default)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            {/* L-Faser (Clubspeed) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', minWidth: '80px', fontWeight: 500 }}>
                L-Fase (CS)
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {lFaser.map((fase) => (
                  <button
                    key={fase.id}
                    onClick={() => setSelectedLFase(fase.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: selectedLFase === fase.id ? '#8e44ad' : 'transparent',
                      color: selectedLFase === fase.id ? 'white' : 'var(--text-secondary)',
                      border: selectedLFase === fase.id ? 'none' : '1px solid var(--border-default)',
                      borderRadius: '14px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    {fase.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Miljø */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', minWidth: '80px', fontWeight: 500 }}>
                Miljø
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {miljoLevels.map((miljo) => (
                  <button
                    key={miljo.id}
                    onClick={() => setSelectedMiljo(miljo.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: selectedMiljo === miljo.id ? '#16a085' : 'transparent',
                      color: selectedMiljo === miljo.id ? 'white' : 'var(--text-secondary)',
                      border: selectedMiljo === miljo.id ? 'none' : '1px solid var(--border-default)',
                      borderRadius: '14px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    {miljo.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Belastning/Press */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', minWidth: '80px', fontWeight: 500 }}>
                Belastning
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {pressLevels.map((press) => (
                  <button
                    key={press.id}
                    onClick={() => setSelectedPress(press.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: selectedPress === press.id ? '#e67e22' : 'transparent',
                      color: selectedPress === press.id ? 'white' : 'var(--text-secondary)',
                      border: selectedPress === press.id ? 'none' : '1px solid var(--border-default)',
                      borderRadius: '14px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    {press.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Exercise list */}
      <div style={{ padding: '20px 24px' }}>
        {/* Results count */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {filteredExercises.length} øvelser
          </span>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetAllFilters}>
              Nullstill filter
            </Button>
          )}
        </div>

        {/* Exercise grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onSelect={setSelectedExercise}
              onToggleFavorite={handleToggleFavorite}
              onAddToPlan={handleAddToPlan}
              isFavorite={favorites.includes(exercise.id)}
            />
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <StateCard
            variant="empty"
            title={showOnlyFavorites ? 'Ingen favoritter' : 'Ingen øvelser funnet'}
            description={showOnlyFavorites ? 'Marker øvelser som favoritter for å se dem her.' : 'Prøv å justere filtrene for å se flere øvelser.'}
          />
        )}
      </div>

      {/* Detail modal */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onAddToSession={handleAddToSession}
        />
      )}
    </div>
  );
}
