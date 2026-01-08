/**
 * LoggTreningContainer.jsx
 * Design System v3.0 - Premium Light
 *
 * Basert på AK-formel hierarki v2.0
 * Pyramide: FYS → TEK → SLAG → SPILL → TURN
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Clock, Target, Dumbbell, Brain, Trophy,
  Star, Save, CheckCircle, AlertCircle, X
} from 'lucide-react';
import Button from '../../ui/primitives/Button';
import { sessionsAPI } from '../../services/api';
import { SubSectionTitle } from '../../components/typography';
import { TrainingCategoryBadge } from '../../components/shadcn/golf';

// ============================================================================
// AK-FORMEL CLASS MAPPINGS
// ============================================================================

// Treningspyramiden: FYS → TEK → SLAG → SPILL → TURN
const SESSION_TYPE_CLASSES = {
  FYS: {
    text: 'text-[#D97644]',
    bg: 'bg-[#D97644]/15',
    activeBg: 'bg-[#D97644]',
    border: 'border-[#D97644]',
    icon: Dumbbell,
    label: 'Fysisk',
    description: 'Styrke, power, mobilitet',
  },
  TEK: {
    text: 'text-[#8B6E9D]',
    bg: 'bg-[#8B6E9D]/15',
    activeBg: 'bg-[#8B6E9D]',
    border: 'border-[#8B6E9D]',
    icon: Target,
    label: 'Teknikk',
    description: 'Bevegelsesmønster, posisjoner',
  },
  SLAG: {
    text: 'text-[#4A8C7C]',
    bg: 'bg-[#4A8C7C]/15',
    activeBg: 'bg-[#4A8C7C]',
    border: 'border-[#4A8C7C]',
    icon: Target,
    label: 'Golfslag',
    description: 'Slagkvalitet, nøyaktighet',
  },
  SPILL: {
    text: 'text-[#4A7C59]',
    bg: 'bg-[#4A7C59]/15',
    activeBg: 'bg-[#4A7C59]',
    border: 'border-[#4A7C59]',
    icon: Target,
    label: 'Spill',
    description: 'Strategi, banehåndtering',
  },
  TURN: {
    text: 'text-[#C9A227]',
    bg: 'bg-[#C9A227]/15',
    activeBg: 'bg-[#C9A227]',
    border: 'border-[#C9A227]',
    icon: Trophy,
    label: 'Turnering',
    description: 'Mental prestasjon, press',
  },
};

// ============================================================================
// MOCK DATA
// ============================================================================

// Map pyramid codes to TrainingCategoryBadge format
const PYRAMID_TO_CATEGORY = {
  FYS: 'fysisk',
  TEK: 'teknikk',
  SLAG: 'slag',
  SPILL: 'spill',
  TURN: 'turnering',
};

const SESSION_TYPES = Object.entries(SESSION_TYPE_CLASSES).map(([id, config]) => ({
  id,
  label: config.label,
  icon: config.icon,
}));

const QUICK_EXERCISES = [
  // FYS - Fysisk
  { id: 'gym', name: 'Styrketrening', type: 'FYS', duration: 60 },
  { id: 'flexibility', name: 'Mobilitet', type: 'FYS', duration: 30 },
  { id: 'power', name: 'Power', type: 'FYS', duration: 45 },
  // TEK - Teknikk
  { id: 'swing', name: 'Svingteknikk', type: 'TEK', duration: 45 },
  { id: 'positions', name: 'P-Posisjoner', type: 'TEK', duration: 30 },
  // SLAG - Golfslag
  { id: 'tee', name: 'Tee (Driver)', type: 'SLAG', duration: 45 },
  { id: 'inn100', name: 'Innspill 100-150m', type: 'SLAG', duration: 45 },
  { id: 'chip', name: 'Chip/Pitch', type: 'SLAG', duration: 30 },
  { id: 'putting', name: 'Putting', type: 'SLAG', duration: 30 },
  { id: 'bunker', name: 'Bunker', type: 'SLAG', duration: 30 },
  // SPILL - Spill
  { id: 'course', name: 'Banetrening', type: 'SPILL', duration: 120 },
  { id: 'strategy', name: 'Strategi', type: 'SPILL', duration: 60 },
  // TURN - Turnering
  { id: 'competition', name: 'Konkurransetrening', type: 'TURN', duration: 90 },
  { id: 'pressure', name: 'Presstrening', type: 'TURN', duration: 60 },
];

const RECENT_LOGS = [
  {
    id: 'r1',
    date: '2025-01-18',
    type: 'SLAG',
    name: 'TEE og INN150 trening',
    duration: 90,
    rating: 4,
  },
  {
    id: 'r2',
    date: '2025-01-17',
    type: 'SLAG',
    name: 'Chip og putting',
    duration: 75,
    rating: 5,
  },
  {
    id: 'r3',
    date: '2025-01-15',
    type: 'FYS',
    name: 'Styrke og power',
    duration: 60,
    rating: 4,
  },
];

// Training Categories (from category system)
const TRAINING_CATEGORIES = {
  fullSwing: {
    label: 'Full Swing',
    categories: [
      { code: 'TEE', label: 'Tee Total', description: 'Driver, 3-wood' },
      { code: 'INN200', label: 'Innspill 200+', description: '3-wood, hybrid, long iron' },
      { code: 'INN150', label: 'Innspill 150-200', description: '5-7 iron' },
      { code: 'INN100', label: 'Innspill 100-150', description: '8-PW' },
      { code: 'INN50', label: 'Innspill 50-100', description: 'Wedges (full swing)' },
    ],
  },
  shortGame: {
    label: 'Naerspill',
    categories: [
      { code: 'CHIP', label: 'Chip', description: 'Lav bue, mye rulle' },
      { code: 'PITCH', label: 'Pitch', description: 'Middels bue, middels rulle' },
      { code: 'LOB', label: 'Lob', description: 'Hoy bue, lite rulle' },
      { code: 'BUNKER', label: 'Bunker', description: 'Sand, greenside' },
    ],
  },
  putting: {
    label: 'Putting',
    categories: [
      { code: 'PUTT0-3', label: '0-3 ft', description: 'Makk-putts' },
      { code: 'PUTT3-5', label: '3-5 ft', description: 'Korte' },
      { code: 'PUTT5-10', label: '5-10 ft', description: 'Mellom' },
      { code: 'PUTT10-15', label: '10-15 ft', description: 'Mellom-lange' },
      { code: 'PUTT15-25', label: '15-25 ft', description: 'Lange' },
      { code: 'PUTT25-40', label: '25-40 ft', description: 'Lag putts' },
      { code: 'PUTT40+', label: '40+ ft', description: 'Ekstra lange' },
    ],
  },
};

// L-Faser (Motorisk laering)
const L_PHASES = [
  { code: 'L-KROPP', label: 'Kropp', description: 'Kun kroppsbevegelse, ingen utstyr', csRange: 'CS0' },
  { code: 'L-ARM', label: 'Arm', description: 'Kropp + armer, ingen kolle/ball', csRange: 'CS0' },
  { code: 'L-KOLLE', label: 'Kolle', description: 'Kropp + armer + kolle, ingen ball', csRange: 'CS20-40' },
  { code: 'L-BALL', label: 'Ball', description: 'Alt inkludert, lav hastighet', csRange: 'CS40-60' },
  { code: 'L-AUTO', label: 'Auto', description: 'Full hastighet, automatisert', csRange: 'CS70-100' },
];

// CS-Nivåer (Clubspeed)
const CS_LEVELS = [
  { code: 'CS0', value: 0, label: '0%', description: 'Fysisk trening (off-course)' },
  { code: 'CS20', value: 20, label: '20%', description: 'Ekstrem sakte, kun posisjon' },
  { code: 'CS30', value: 30, label: '30%', description: 'Veldig sakte' },
  { code: 'CS40', value: 40, label: '40%', description: 'Sakte' },
  { code: 'CS50', value: 50, label: '50%', description: 'Halvfart' },
  { code: 'CS60', value: 60, label: '60%', description: 'Lett over halvfart' },
  { code: 'CS70', value: 70, label: '70%', description: 'Medium' },
  { code: 'CS80', value: 80, label: '80%', description: 'Nesten full' },
  { code: 'CS90', value: 90, label: '90%', description: 'Nesten maks' },
  { code: 'CS100', value: 100, label: '100%', description: 'Full hastighet' },
];

// M-Miljo (Fysisk kontekst)
const M_ENVIRONMENTS = [
  { code: 'M0', label: 'Off-course', description: 'Gym, hjemme, ikke golf-spesifikt' },
  { code: 'M1', label: 'Innendors', description: 'Nett, simulator, Trackman' },
  { code: 'M2', label: 'Range', description: 'Utendors, matte eller gress' },
  { code: 'M3', label: 'Ovingsfelt', description: 'Kortbane, chipping green, putting green' },
  { code: 'M4', label: 'Bane trening', description: 'Treningsrunde pa bane' },
  { code: 'M5', label: 'Bane turnering', description: 'Turneringsrunde' },
];

// PR-Press (Fysisk & Mental belastning)
const PR_LEVELS = [
  { code: 'PR1', label: 'Ingen', description: 'Utforskende, ingen konsekvens' },
  { code: 'PR2', label: 'Selvmonitorering', description: 'Maltall, tracking, men ingen sosial' },
  { code: 'PR3', label: 'Sosial', description: 'Med andre, observert' },
  { code: 'PR4', label: 'Konkurranse', description: 'Innsats, spill mot andre' },
  { code: 'PR5', label: 'Turnering', description: 'Resultat teller, ranking' },
];

// ============================================================================
// SESSION TYPE SELECTOR
// ============================================================================

const SessionTypeSelector = ({ selected, onSelect }) => (
  <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 mb-6">
    {SESSION_TYPES.map((type) => {
      const classes = SESSION_TYPE_CLASSES[type.id];
      const Icon = type.icon;
      const isSelected = selected === type.id;

      return (
        <button
          key={type.id}
          onClick={() => onSelect(type.id)}
          className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
            isSelected
              ? `${classes.border} ${classes.bg}`
              : 'border-transparent bg-ak-surface-base'
          }`}
        >
          <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${
            isSelected ? classes.activeBg : classes.bg
          }`}>
            <Icon size={20} className={isSelected ? 'text-white' : classes.text} />
          </div>
          <span className={`text-xs font-medium ${
            isSelected ? classes.text : 'text-ak-text-primary'
          }`}>
            {type.label}
          </span>
        </button>
      );
    })}
  </div>
);

// ============================================================================
// STANDARD SESSION SUGGESTIONS
// ============================================================================

const STANDARD_SESSIONS = [
  { id: 'driving-range', name: 'Driving Range', duration: 90, description: 'Full swing-trening med driver og jern' },
  { id: 'short-game', name: 'Short Game', duration: 60, description: 'Chip, pitch og bunker' },
  { id: 'putting-practice', name: 'Putting', duration: 45, description: 'Green-trening og lag putts' },
  { id: 'full-round', name: 'Full Runde', duration: 240, description: '18 hull med fokus' },
  { id: 'physical', name: 'Fysisk trening', duration: 60, description: 'Styrke, mobilitet, power' },
];

const StandardSessionSuggestions = ({ onSelect }) => {
  return (
    <div className="bg-ak-surface-base rounded-[14px] p-4 mb-5">
      <SubSectionTitle className="text-sm m-0 mb-3">
        Velg standard okt
      </SubSectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {STANDARD_SESSIONS.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelect(session)}
            className="py-3 px-4 rounded-lg border border-ak-border-default bg-ak-surface-subtle text-left cursor-pointer transition-all duration-200 hover:bg-ak-border-default hover:border-ak-primary"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-ak-text-primary">
                {session.name}
              </span>
              <span className="text-[11px] text-ak-text-secondary">
                {session.duration} min
              </span>
            </div>
            <p className="text-[11px] text-ak-text-tertiary mt-1">
              {session.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// CATEGORY SELECTOR
// ============================================================================

const CategorySelector = ({ selectedCategories, onToggle }) => {
  // Flatten all categories for display
  const allCategories = [
    ...TRAINING_CATEGORIES.fullSwing.categories,
    ...TRAINING_CATEGORIES.shortGame.categories,
    ...TRAINING_CATEGORIES.putting.categories,
  ];

  return (
    <div className="bg-ak-surface-base rounded-[14px] p-4 mb-5">
      <SubSectionTitle className="text-sm m-0 mb-3">
        Kategorier
      </SubSectionTitle>

      {/* Full Swing */}
      <div className="mb-4">
        <div className="text-xs font-medium text-ak-text-secondary mb-2">
          {TRAINING_CATEGORIES.fullSwing.label}
        </div>
        <div className="flex gap-2 flex-wrap">
          {TRAINING_CATEGORIES.fullSwing.categories.map((cat) => (
            <button
              key={cat.code}
              onClick={() => onToggle(cat.code)}
              className={`py-2 px-3 rounded-lg text-[13px] font-medium cursor-pointer flex items-center gap-1 transition-all duration-200 ${
                selectedCategories.includes(cat.code)
                  ? 'border-2 border-ak-primary bg-ak-primary/15 text-ak-primary'
                  : 'border border-ak-border-default bg-ak-surface-subtle text-ak-text-primary hover:bg-ak-border-default'
              }`}
            >
              <span>{cat.label}</span>
              {selectedCategories.includes(cat.code) && (
                <X size={14} className="ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Short Game */}
      <div className="mb-4">
        <div className="text-xs font-medium text-ak-text-secondary mb-2">
          {TRAINING_CATEGORIES.shortGame.label}
        </div>
        <div className="flex gap-2 flex-wrap">
          {TRAINING_CATEGORIES.shortGame.categories.map((cat) => (
            <button
              key={cat.code}
              onClick={() => onToggle(cat.code)}
              className={`py-2 px-3 rounded-lg text-[13px] font-medium cursor-pointer flex items-center gap-1 transition-all duration-200 ${
                selectedCategories.includes(cat.code)
                  ? 'border-2 border-ak-primary bg-ak-primary/15 text-ak-primary'
                  : 'border border-ak-border-default bg-ak-surface-subtle text-ak-text-primary hover:bg-ak-border-default'
              }`}
            >
              <span>{cat.label}</span>
              {selectedCategories.includes(cat.code) && (
                <X size={14} className="ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Putting */}
      <div>
        <div className="text-xs font-medium text-ak-text-secondary mb-2">
          {TRAINING_CATEGORIES.putting.label}
        </div>
        <div className="flex gap-2 flex-wrap">
          {TRAINING_CATEGORIES.putting.categories.map((cat) => (
            <button
              key={cat.code}
              onClick={() => onToggle(cat.code)}
              className={`py-2 px-3 rounded-lg text-[13px] font-medium cursor-pointer flex items-center gap-1 transition-all duration-200 ${
                selectedCategories.includes(cat.code)
                  ? 'border-2 border-ak-primary bg-ak-primary/15 text-ak-primary'
                  : 'border border-ak-border-default bg-ak-surface-subtle text-ak-text-primary hover:bg-ak-border-default'
              }`}
            >
              <span>{cat.label}</span>
              {selectedCategories.includes(cat.code) && (
                <X size={14} className="ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// L-PHASE SELECTOR
// ============================================================================

const LPhaseSelector = ({ selectedPhase, onSelect }) => {
  return (
    <div className="bg-ak-surface-base rounded-[14px] p-4 mb-5">
      <SubSectionTitle className="text-sm m-0 mb-3">
        L-Fase (Motorisk laering)
      </SubSectionTitle>
      <div className="flex gap-2 flex-wrap">
        {L_PHASES.map((phase) => (
          <button
            key={phase.code}
            onClick={() => onSelect(phase.code)}
            className={`py-2 px-3 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200 ${
              selectedPhase === phase.code
                ? 'border-2 border-ak-primary bg-ak-primary/15 text-ak-primary'
                : 'border border-ak-border-default bg-ak-surface-subtle text-ak-text-primary hover:bg-ak-border-default'
            }`}
          >
            {phase.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// M-ENVIRONMENT SELECTOR
// ============================================================================

const MEnvironmentSelector = ({ selectedEnvironment, onSelect }) => {
  return (
    <div className="bg-ak-surface-base rounded-[14px] p-4 mb-5">
      <SubSectionTitle className="text-sm m-0 mb-3">
        M-Miljo (Treningssted)
      </SubSectionTitle>
      <div className="flex gap-2 flex-wrap">
        {M_ENVIRONMENTS.map((env) => (
          <button
            key={env.code}
            onClick={() => onSelect(env.code)}
            className={`py-2 px-3 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200 ${
              selectedEnvironment === env.code
                ? 'border-2 border-ak-primary bg-ak-primary/15 text-ak-primary'
                : 'border border-ak-border-default bg-ak-surface-subtle text-ak-text-primary hover:bg-ak-border-default'
            }`}
          >
            {env.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// CS-LEVEL SELECTOR
// ============================================================================

const CSLevelSelector = ({ selectedLevel, onSelect }) => {
  return (
    <div className="bg-ak-surface-base rounded-[14px] p-4 mb-5">
      <SubSectionTitle className="text-sm m-0 mb-3">
        CS-Nivå (Clubspeed)
      </SubSectionTitle>
      <div className="flex gap-2 flex-wrap">
        {CS_LEVELS.map((level) => (
          <button
            key={level.code}
            onClick={() => onSelect(level.code)}
            className={`py-2 px-3 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200 ${
              selectedLevel === level.code
                ? 'border-2 border-ak-primary bg-ak-primary/15 text-ak-primary'
                : 'border border-ak-border-default bg-ak-surface-subtle text-ak-text-primary hover:bg-ak-border-default'
            }`}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// PR-PRESS SELECTOR
// ============================================================================

const PRPressSelector = ({ selectedPress, onSelect }) => {
  return (
    <div className="bg-ak-surface-base rounded-[14px] p-4 mb-5">
      <SubSectionTitle className="text-sm m-0 mb-3">
        PR-Press (Mental belastning)
      </SubSectionTitle>
      <div className="flex gap-2 flex-wrap">
        {PR_LEVELS.map((press) => (
          <button
            key={press.code}
            onClick={() => onSelect(press.code)}
            className={`py-2 px-3 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200 ${
              selectedPress === press.code
                ? 'border-2 border-ak-primary bg-ak-primary/15 text-ak-primary'
                : 'border border-ak-border-default bg-ak-surface-subtle text-ak-text-primary hover:bg-ak-border-default'
            }`}
          >
            {press.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// LOG FORM
// ============================================================================

const LogForm = ({ sessionType, selectedCategories, onSubmit, saving = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    duration: 60,
    rating: 4,
    energyLevel: 4,
    notes: '',
    achievements: '',
    improvements: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      type: sessionType,
      categories: selectedCategories,
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-ak-surface-base rounded-[14px] p-5 mb-5">
      <SubSectionTitle className="text-[15px] m-0 mb-4">
        Logg økt
      </SubSectionTitle>

      {/* Session Name */}
      <div className="mb-4">
        <label className="block text-[13px] font-medium text-ak-text-primary mb-1">
          Navn på økten
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="F.eks. Driver-trening pa range"
          className="w-full py-3 px-3 rounded-lg border border-ak-border-default text-sm outline-none focus:border-ak-primary"
        />
      </div>

      {/* Duration and Rating Row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[13px] font-medium text-ak-text-primary mb-1">
            Varighet (minutter)
          </label>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-ak-text-secondary" />
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              min="5"
              max="300"
              className="flex-1 py-3 px-3 rounded-lg border border-ak-border-default text-sm outline-none focus:border-ak-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-ak-text-primary mb-1">
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className="p-2 rounded-md border-none bg-transparent cursor-pointer"
              >
                <Star
                  size={24}
                  fill={star <= formData.rating ? 'var(--gold-500)' : 'none'}
                  className={star <= formData.rating ? 'text-gold-500' : 'text-ak-border-default'}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Energy Level */}
      <div className="mb-4">
        <label className="block text-[13px] font-medium text-ak-text-primary mb-1">
          Energiniva
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFormData({ ...formData, energyLevel: level })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                formData.energyLevel === level
                  ? 'border-2 border-ak-primary bg-ak-primary/15 text-ak-primary'
                  : 'border border-ak-border-default bg-ak-surface-base text-ak-text-primary'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-ak-text-secondary mt-1">
          <span>Lav</span>
          <span>Hoy</span>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label className="block text-[13px] font-medium text-ak-text-primary mb-1">
          Notater
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Hva jobbet du med? Hvordan gikk det?"
          rows={3}
          className="w-full py-3 px-3 rounded-lg border border-ak-border-default text-sm outline-none resize-y font-inherit focus:border-ak-primary"
        />
      </div>

      {/* Achievements */}
      <div className="mb-4">
        <label className="block text-[13px] font-medium text-ak-text-primary mb-1">
          Prestasjoner (valgfritt)
        </label>
        <input
          type="text"
          value={formData.achievements}
          onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
          placeholder="F.eks. Ny toppfart, PR i ovelse"
          className="w-full py-3 px-3 rounded-lg border border-ak-border-default text-sm outline-none focus:border-ak-primary"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        leftIcon={<Save size={18} />}
        disabled={saving}
        loading={saving}
        className="w-full justify-center"
      >
        {saving ? 'Lagrer...' : 'Lagre økt'}
      </Button>
    </form>
  );
};

// ============================================================================
// RECENT LOGS
// ============================================================================

const RecentLogs = ({ logs }) => (
  <div className="bg-ak-surface-base rounded-[14px] p-4">
    <SubSectionTitle className="text-sm m-0 mb-3">
      Siste loggføringer
    </SubSectionTitle>
    <div className="flex flex-col gap-2">
      {logs.map((log) => {
        const typeConfig = SESSION_TYPE_CLASSES[log.type] || SESSION_TYPE_CLASSES.TEK;
        const Icon = typeConfig.icon;
        const category = PYRAMID_TO_CATEGORY[log.type];

        return (
          <div
            key={log.id}
            className="flex items-center gap-3 p-2 rounded-lg bg-ak-surface-subtle"
          >
            <div className={`w-9 h-9 rounded-lg ${typeConfig.bg} flex items-center justify-center`}>
              <Icon size={18} className={typeConfig.text} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[13px] font-medium text-ak-text-primary">
                  {log.name}
                </span>
                {category && (
                  <TrainingCategoryBadge category={category} size="sm" />
                )}
              </div>
              <div className="text-[11px] text-ak-text-secondary flex items-center gap-2">
                <span>{new Date(log.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}</span>
                <span>•</span>
                <span>{log.duration} min</span>
              </div>
            </div>
            <div className="flex gap-0">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  fill={star <= log.rating ? 'var(--gold-500)' : 'none'}
                  className={star <= log.rating ? 'text-gold-500' : 'text-ak-border-default'}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const LoggTreningContainer = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [selectedCSLevel, setSelectedCSLevel] = useState(null);
  const [selectedPress, setSelectedPress] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');

  const handleStandardSession = (session) => {
    // Pre-fill form with standard session data
    setSelectedType('SLAG'); // Default to SLAG for golf-specific sessions
  };

  const handleToggleCategory = (categoryCode) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryCode)
        ? prev.filter((c) => c !== categoryCode)
        : [...prev, categoryCode]
    );
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    setSaveStatus(null);
    setErrorMessage('');

    try {
      // Map form data to session API format (AK Golf Kategori Hierarki v2.0)
      const sessionData = {
        sessionType: formData.type, // FYS, TEK, SLAG, SPILL, TURN
        sessionDate: new Date(formData.date).toISOString(),
        duration: formData.duration,
        notes: formData.notes,
        // Generer enkel AK-formel basert på type
        akFormula: formData.type,
        // Legg til kategorier
        categories: formData.categories || [],
        // L-Fase, M-Miljø, CS-Nivå, PR-Press
        lPhase: selectedPhase,
        mEnvironment: selectedEnvironment,
        csLevel: selectedCSLevel,
        prPress: selectedPress,
        // Evaluering lagres i separate felter
        evaluationEnergy: formData.energyLevel,
        evaluationFocus: formData.rating,
      };

      await sessionsAPI.create(sessionData);
      setSaveStatus('success');

      // Navigate to sessions list after short delay
      setTimeout(() => {
        navigate('/trening/dagbok');
      }, 1500);
    } catch (err) {
      setSaveStatus('error');
      setErrorMessage(err.response?.data?.message || err.message || 'Kunne ikke lagre økten');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-ak-surface-subtle">
      {/* Session Type Selector */}
      <div className="bg-ak-surface-base rounded-[14px] p-4 mb-5">
        <SubSectionTitle className="text-sm m-0 mb-3">
          Velg type økt
        </SubSectionTitle>
        <SessionTypeSelector selected={selectedType} onSelect={setSelectedType} />
      </div>

      {/* Category Selector */}
      <CategorySelector
        selectedCategories={selectedCategories}
        onToggle={handleToggleCategory}
      />

      {/* L-Phase Selector */}
      <LPhaseSelector
        selectedPhase={selectedPhase}
        onSelect={setSelectedPhase}
      />

      {/* M-Environment Selector */}
      <MEnvironmentSelector
        selectedEnvironment={selectedEnvironment}
        onSelect={setSelectedEnvironment}
      />

      {/* CS-Level Selector */}
      <CSLevelSelector
        selectedLevel={selectedCSLevel}
        onSelect={setSelectedCSLevel}
      />

      {/* PR-Press Selector */}
      <PRPressSelector
        selectedPress={selectedPress}
        onSelect={setSelectedPress}
      />

      {/* Standard Session Suggestions */}
      <StandardSessionSuggestions onSelect={handleStandardSession} />

      {/* Save Status */}
      {saveStatus === 'success' && (
        <div className="flex items-center gap-2 py-3 px-4 rounded-[10px] bg-ak-status-success/15 mb-5">
          <CheckCircle size={20} className="text-ak-status-success" />
          <span className="text-sm text-ak-status-success font-medium">
            Økten ble lagret! Videresender...
          </span>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="flex items-center gap-2 py-3 px-4 rounded-[10px] bg-ak-status-error/15 mb-5">
          <AlertCircle size={20} className="text-ak-status-error" />
          <span className="text-sm text-ak-status-error font-medium">
            {errorMessage}
          </span>
        </div>
      )}

      {/* Log Form */}
      <LogForm
        sessionType={selectedType}
        selectedCategories={selectedCategories}
        onSubmit={handleSubmit}
        saving={saving}
      />

      {/* Recent Logs */}
      <RecentLogs logs={RECENT_LOGS} />
    </div>
  );
};

export default LoggTreningContainer;
