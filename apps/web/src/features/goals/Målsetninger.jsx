import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import StateCard from '../../ui/composites/StateCard';

// =====================================================
// AK GOLF - MÅLSETNINGER SKJERM
// IUP App - Individuell Utviklingsplan
// Versjon: 3.0
// Design System: Blue Palette 01 v3.0 - UiCanon CSS Variables
// =====================================================

// UiCanon: Semantic CSS variables
const colors = {
  // Primary colors
  primary: 'var(--accent)',
  primaryLight: 'rgba(var(--accent-rgb), 0.1)',
  forest: 'var(--accent)',
  forestLight: 'rgba(var(--accent-rgb), 0.1)',
  foam: 'var(--bg-tertiary)',
  ivory: 'var(--bg-secondary)',
  snow: 'var(--bg-secondary)',
  gold: 'var(--achievement)',
  white: 'var(--bg-primary)',

  // Status colors
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',

  // Neutrals
  charcoal: 'var(--text-primary)',
  steel: 'var(--text-secondary)',
  mist: 'var(--border-default)',
  cloud: 'var(--bg-secondary)',
};

// =====================================================
// UI KOMPONENTER
// =====================================================

const Card = ({ children, className = '', onClick, style: customStyle = {} }) => (
  <div
    className={`${className} ${onClick ? 'hover:-translate-y-px transition-transform' : ''}`}
    onClick={onClick}
    style={{
      backgroundColor: colors.white,
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)',
      border: `1px solid ${colors.mist}`,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      ...customStyle
    }}
  >
    {children}
  </div>
);

const Badge = ({ children, variant = 'neutral' }) => {
  const variants = {
    neutral: { bg: colors.mist, color: colors.charcoal },
    accent: { bg: 'rgba(var(--accent-rgb), 0.15)', color: colors.forest },
    success: { bg: 'rgba(var(--success-rgb), 0.15)', color: colors.success },
    warning: { bg: 'rgba(var(--warning-rgb), 0.15)', color: colors.warning },
    error: { bg: 'rgba(var(--error-rgb), 0.15)', color: colors.error },
    achievement: { bg: 'rgba(var(--achievement-rgb), 0.15)', color: colors.gold }
  };

  const style = variants[variant] || variants.neutral;

  return (
    <span
      style={{
        padding: `${'4px'} ${'8px'}`,
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: style.bg,
        color: style.color
      }}
    >
      {children}
    </span>
  );
};

const Button = ({ children, variant = 'primary', size = 'md', onClick, icon, disabled }) => {
  const variants = {
    primary: { bg: colors.primary, color: 'white', border: 'none' },
    secondary: { bg: colors.foam, color: colors.primary, border: 'none' },
    outline: { bg: 'transparent', color: colors.primary, border: `1px solid ${colors.primary}` },
    ghost: { bg: 'transparent', color: colors.steel, border: 'none' },
    success: { bg: colors.success, color: 'white', border: 'none' }
  };

  const sizes = {
    sm: { padding: `${'8px'} ${'12px'}`, fontSize: '12px' },
    md: { padding: `${'12px'} ${'16px'}`, fontSize: '14px' },
    lg: { padding: `${'16px'} ${'24px'}`, fontSize: '16px' }
  };

  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={disabled ? '' : 'hover:opacity-90'}
      style={{
        ...sizeStyle,
        backgroundColor: variantStyle.bg,
        color: variantStyle.color,
        border: variantStyle.border,
        borderRadius: 'var(--radius-lg)',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s ease'
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

const ProgressBar = ({ value, max = 100, showLabel = false, height = 8, color }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const barColor = color || (percentage >= 100 ? colors.success : percentage >= 70 ? colors.primary : colors.warning);

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          borderRadius: '9999px',
          overflow: 'hidden',
          backgroundColor: colors.mist,
          height: `${height}px`
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: '9999px',
            transition: 'width 0.3s ease',
            width: `${percentage}%`,
            backgroundColor: barColor
          }}
        />
      </div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: '12px', color: colors.steel }}>{value}</span>
          <span style={{ fontSize: '12px', color: colors.steel }}>{max}</span>
        </div>
      )}
    </div>
  );
};

// =====================================================
// SPESIALISERTE KOMPONENTER
// =====================================================

const GoalCard = ({ goal, onEdit, onToggleComplete, onUpdateProgress, onShareWithCoach }) => {
  const categoryIcons = {
    score: '🎯',
    teknikk: '⛳',
    fysisk: '💪',
    mental: '🧠',
    turnering: '🏆',
    prosess: '📈'
  };

  const categoryColors = {
    score: colors.primary,
    teknikk: colors.primaryLight,
    fysisk: colors.success,
    mental: colors.gold,
    turnering: colors.warning,
    prosess: colors.steel
  };

  const categoryBgColors = {
    score: 'rgba(var(--accent-rgb), 0.2)',
    teknikk: 'rgba(var(--accent-rgb), 0.1)',
    fysisk: 'rgba(var(--success-rgb), 0.2)',
    mental: 'rgba(var(--achievement-rgb), 0.2)',
    turnering: 'rgba(var(--warning-rgb), 0.2)',
    prosess: 'rgba(var(--text-secondary-rgb), 0.2)'
  };

  const timeframeLabels = {
    short: 'Kortsiktig',
    medium: 'Mellomlang',
    long: 'Langsiktig'
  };

  const progressPercentage = (goal.current / goal.target) * 100;
  const isCompleted = goal.status === 'completed';

  return (
    <Card style={{ padding: '16px', opacity: isCompleted ? 0.75 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              backgroundColor: categoryBgColors[goal.category]
            }}
          >
            {categoryIcons[goal.category]}
          </div>
          <div>
            <h3
              style={{
                fontWeight: 600,
                color: colors.charcoal,
                textDecoration: isCompleted ? 'line-through' : 'none',
                margin: 0
              }}
            >
              {goal.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
              <Badge variant={goal.timeframe === 'short' ? 'warning' : goal.timeframe === 'long' ? 'accent' : 'neutral'}>
                {timeframeLabels[goal.timeframe]}
              </Badge>
              {goal.sharedWithCoach && (
                <Badge variant="accent">
                  👥 Delt med trener
                </Badge>
              )}
              {goal.deadline && (
                <span style={{ fontSize: '12px', color: colors.steel }}>
                  Frist: {goal.deadline}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onShareWithCoach && onShareWithCoach(goal.id)}
            style={{
              padding: '4px',
              color: goal.sharedWithCoach ? colors.primary : colors.steel,
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              opacity: goal.sharedWithCoach ? 1 : 0.6
            }}
            title={goal.sharedWithCoach ? 'Delt med trener' : 'Del med trener'}
          >
            {goal.sharedWithCoach ? '👥' : '👤'}
          </button>
          <button
            onClick={() => onToggleComplete(goal.id)}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '9999px',
              border: `2px solid ${isCompleted ? colors.success : colors.mist}`,
              backgroundColor: isCompleted ? colors.success : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {isCompleted && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
          </button>
          <button
            onClick={() => onEdit(goal)}
            style={{ padding: '4px', color: colors.steel, cursor: 'pointer', background: 'none', border: 'none' }}
          >
            ✏️
          </button>
        </div>
      </div>

      {goal.description && (
        <p style={{ fontSize: '14px', color: colors.steel, margin: 0, marginBottom: '12px' }}>
          {goal.description}
        </p>
      )}

      {/* Progress */}
      {goal.measurable && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: colors.charcoal }}>
              {goal.current} / {goal.target} {goal.unit}
            </span>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: progressPercentage >= 100 ? colors.success : colors.primary
              }}
            >
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <ProgressBar value={goal.current} max={goal.target} />
          {!isCompleted && onUpdateProgress && (
            <button
              onClick={() => onUpdateProgress(goal)}
              className="hover:brightness-110"
              style={{
                marginTop: '8px',
                padding: `${'8px'} ${'12px'}`,
                backgroundColor: colors.primary,
                color: 'white',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              📊 Oppdater progresjon
            </button>
          )}
        </div>
      )}

      {/* Milestones */}
      {goal.milestones && goal.milestones.length > 0 && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: colors.mist }}>
          <div className="text-xs font-medium mb-2" style={{ color: colors.steel }}>
            Milepæler
          </div>
          <div className="space-y-2">
            {goal.milestones.map((milestone, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                  style={{
                    borderColor: milestone.completed ? colors.success : colors.mist,
                    backgroundColor: milestone.completed ? colors.success : 'transparent'
                  }}
                >
                  {milestone.completed && <span className="text-white text-[8px]">✓</span>}
                </div>
                <span
                  className={`text-xs flex-1 ${milestone.completed ? 'line-through' : ''}`}
                  style={{ color: milestone.completed ? colors.steel : colors.charcoal }}
                >
                  {milestone.title}
                </span>
                <span className="text-xs" style={{ color: colors.steel }}>
                  {milestone.target} {goal.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coach Comments */}
      {goal.coachComments && goal.coachComments.length > 0 && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: colors.mist }}>
          <div className="text-xs font-medium mb-2 flex items-center gap-2" style={{ color: colors.steel }}>
            <span>💬</span> Tilbakemelding fra trener
          </div>
          <div className="space-y-2">
            {goal.coachComments.map(comment => (
              <div
                key={comment.id}
                className="p-2 rounded-lg"
                style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.05)', borderLeft: `2px solid ${colors.primary}` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: colors.charcoal }}>
                    {comment.author}
                  </span>
                  <span className="text-[10px]" style={{ color: colors.steel }}>
                    {new Date(comment.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <p className="text-xs" style={{ color: colors.charcoal }}>
                  {comment.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

const GoalModal = ({ goal, onSave, onClose, onDelete }) => {
  const [formData, setFormData] = useState(goal || {
    title: '',
    description: '',
    category: 'score',
    timeframe: 'medium',
    measurable: true,
    current: 0,
    target: 100,
    unit: '',
    deadline: '',
    milestones: []
  });

  const categories = [
    { id: 'score', label: 'Score/Resultat', icon: '🎯' },
    { id: 'teknikk', label: 'Teknikk', icon: '⛳' },
    { id: 'fysisk', label: 'Fysisk', icon: '💪' },
    { id: 'mental', label: 'Mental', icon: '🧠' },
    { id: 'turnering', label: 'Turnering', icon: '🏆' },
    { id: 'prosess', label: 'Prosess', icon: '📈' }
  ];

  const timeframes = [
    { id: 'short', label: 'Kortsiktig (1-3 mnd)' },
    { id: 'medium', label: 'Mellomlang (3-12 mnd)' },
    { id: 'long', label: 'Langsiktig (1-3 år)' }
  ];

  const handleSubmit = () => {
    onSave({
      ...formData,
      id: goal?.id || Date.now(),
      status: goal?.status || 'active'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: colors.mist }}>
          <h2 className="font-bold text-lg" style={{ color: colors.charcoal }}>
            {goal ? 'Rediger mål' : 'Nytt mål'}
          </h2>
          <button onClick={onClose} className="text-2xl" style={{ color: colors.steel }}>×</button>
        </div>

        <div className="p-4 space-y-4">
          {/* Tittel */}
          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: colors.charcoal }}>
              Måltittel *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="F.eks. Nå handicap 5"
              className="w-full p-3 rounded-xl border text-sm"
              style={{ borderColor: colors.mist }}
            />
          </div>

          {/* Beskrivelse */}
          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: colors.charcoal }}>
              Beskrivelse
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Beskriv målet mer detaljert..."
              rows={3}
              className="w-full p-3 rounded-xl border text-sm resize-none"
              style={{ borderColor: colors.mist }}
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: colors.charcoal }}>
              Kategori
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className="p-3 rounded-xl border text-center transition-all"
                  style={{
                    borderColor: formData.category === cat.id ? colors.forest : colors.mist,
                    backgroundColor: formData.category === cat.id ? 'rgba(var(--accent-rgb), 0.1)' : 'white'
                  }}
                >
                  <div className="text-xl mb-1">{cat.icon}</div>
                  <div className="text-xs" style={{ color: colors.charcoal }}>{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tidsramme */}
          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: colors.charcoal }}>
              Tidsramme
            </label>
            <div className="space-y-2">
              {timeframes.map(tf => (
                <button
                  key={tf.id}
                  onClick={() => setFormData({ ...formData, timeframe: tf.id })}
                  className="w-full p-3 rounded-xl border text-left text-sm transition-all"
                  style={{
                    borderColor: formData.timeframe === tf.id ? colors.forest : colors.mist,
                    backgroundColor: formData.timeframe === tf.id ? 'rgba(var(--accent-rgb), 0.1)' : 'white'
                  }}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Målbart */}
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: colors.foam }}>
            <span className="text-sm font-medium" style={{ color: colors.charcoal }}>
              Målbart mål (med tall)
            </span>
            <button
              onClick={() => setFormData({ ...formData, measurable: !formData.measurable })}
              className="w-12 h-6 rounded-full transition-all"
              style={{
                backgroundColor: formData.measurable ? colors.forest : colors.mist
              }}
            >
              <div
                className="w-5 h-5 rounded-full bg-white shadow transition-all"
                style={{
                  marginLeft: formData.measurable ? '26px' : '2px'
                }}
              />
            </button>
          </div>

          {/* Målverdier */}
          {formData.measurable && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs block mb-1" style={{ color: colors.steel }}>Nåværende</label>
                <input
                  type="number"
                  value={formData.current}
                  onChange={e => setFormData({ ...formData, current: Number(e.target.value) })}
                  className="w-full p-2 rounded-xl border text-sm text-center"
                  style={{ borderColor: colors.mist }}
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: colors.steel }}>Mål</label>
                <input
                  type="number"
                  value={formData.target}
                  onChange={e => setFormData({ ...formData, target: Number(e.target.value) })}
                  className="w-full p-2 rounded-xl border text-sm text-center"
                  style={{ borderColor: colors.mist }}
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: colors.steel }}>Enhet</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={e => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="HCP"
                  className="w-full p-2 rounded-xl border text-sm text-center"
                  style={{ borderColor: colors.mist }}
                />
              </div>
            </div>
          )}

          {/* Frist */}
          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: colors.charcoal }}>
              Frist (valgfritt)
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={e => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full p-3 rounded-xl border text-sm"
              style={{ borderColor: colors.mist }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t flex gap-3" style={{ borderColor: colors.mist }}>
          {goal && (
            <Button variant="ghost" onClick={() => onDelete(goal.id)}>
              🗑️ Slett
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="secondary" onClick={onClose}>Avbryt</Button>
          <Button variant="primary" onClick={handleSubmit}>
            {goal ? 'Lagre' : 'Opprett'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

const CategoryFilter = ({ categories, selected, onSelect }) => (
  <div style={{
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '8px',
    marginBottom: '12px'
  }}>
    <button
      onClick={() => onSelect(null)}
      style={{
        padding: `${'8px'} ${'16px'}`,
        borderRadius: '9999px',
        fontSize: '14px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        transition: 'all 0.15s ease',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: selected === null ? colors.primary : colors.snow,
        color: selected === null ? colors.white : colors.charcoal
      }}
    >
      Alle
    </button>
    {categories.map(cat => (
      <button
        key={cat.id}
        onClick={() => onSelect(cat.id)}
        style={{
          padding: `${'8px'} ${'16px'}`,
          borderRadius: '9999px',
          fontSize: '14px',
          fontWeight: 500,
          whiteSpace: 'nowrap',
          transition: 'all 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: selected === cat.id ? colors.primary : colors.snow,
          color: selected === cat.id ? colors.white : colors.charcoal
        }}
      >
        <span>{cat.icon}</span>
        <span>{cat.label}</span>
      </button>
    ))}
  </div>
);

// =====================================================
// HOVEDKOMPONENT
// =====================================================

const Målsetninger = ({ goals: apiGoals = null }) => {
  // Default goals data (fallback if no API data)
  const defaultGoals = [
    {
      id: 1,
      title: 'Nå handicap 5.0',
      description: 'Redusere handicap fra 8.2 til 5.0 innen neste sesong',
      category: 'score',
      timeframe: 'long',
      measurable: true,
      current: 8.2,
      target: 5.0,
      unit: 'HCP',
      deadline: '2025-09-01',
      status: 'active',
      sharedWithCoach: true,
      coachComments: [
        { id: 1, author: 'Anders Kristiansen', date: '2025-12-10', comment: 'Flott fremgang! Du ligger godt an til å nå 7.0 før jul. Fortsett med det strukturerte treni opplegget.' },
        { id: 2, author: 'Anders Kristiansen', date: '2025-12-15', comment: 'Bra jobb med shortgame øvelsene. Legg ekstra fokus på wedge distansekontroll de neste ukene.' }
      ],
      milestones: [
        { title: 'Nå 7.0 HCP', target: 7.0, completed: true },
        { title: 'Nå 6.0 HCP', target: 6.0, completed: false },
        { title: 'Nå 5.0 HCP', target: 5.0, completed: false }
      ]
    },
    {
      id: 2,
      title: 'Øke clubspeed til 105 mph',
      description: 'Trene fysisk for økt rotasjonskraft og hastighet',
      category: 'fysisk',
      timeframe: 'medium',
      measurable: true,
      current: 98,
      target: 105,
      unit: 'mph',
      deadline: '2025-06-01',
      status: 'active',
      sharedWithCoach: false,
      coachComments: [],
      milestones: [
        { title: 'Nå 100 mph', target: 100, completed: false },
        { title: 'Nå 103 mph', target: 103, completed: false },
        { title: 'Nå 105 mph', target: 105, completed: false }
      ]
    },
    {
      id: 3,
      title: 'Forbedre putting under press',
      description: 'Mestre pre-shot rutine og fokusteknikker for kritiske putter',
      category: 'mental',
      timeframe: 'short',
      measurable: true,
      current: 65,
      target: 85,
      unit: '%',
      deadline: '2025-03-01',
      status: 'active',
      sharedWithCoach: false,
      coachComments: [],
      milestones: []
    },
    {
      id: 4,
      title: 'Kvalifisere til NM Junior',
      description: 'Oppnå kvalifiseringskrav gjennom regionale turneringer',
      category: 'turnering',
      timeframe: 'medium',
      measurable: false,
      current: 0,
      target: 100,
      unit: '',
      deadline: '2025-07-01',
      status: 'active',
      sharedWithCoach: false,
      coachComments: [],
      milestones: [
        { title: 'Delta i 3 regionale turneringer', target: 3, completed: true },
        { title: 'Top 10 plassering', target: 10, completed: false },
        { title: 'Oppnå kvalifiseringsscore', target: 1, completed: false }
      ]
    },
    {
      id: 5,
      title: 'Etablere fast treningsrutine',
      description: 'Minimum 4 økter per uke med strukturert innhold',
      category: 'prosess',
      timeframe: 'short',
      measurable: true,
      current: 3.2,
      target: 4,
      unit: 'økter/uke',
      deadline: '2025-02-01',
      status: 'active',
      sharedWithCoach: false,
      coachComments: [],
      milestones: []
    },
    {
      id: 6,
      title: 'Mestre draw-slag',
      description: 'Konsistent draw med driver og lange jern',
      category: 'teknikk',
      timeframe: 'medium',
      measurable: true,
      current: 40,
      target: 80,
      unit: '% konsistens',
      status: 'completed',
      sharedWithCoach: false,
      coachComments: [],
      milestones: []
    }
  ];

  // Use API data if available, otherwise use default
  const [goals, setGoals] = useState(apiGoals || defaultGoals);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [viewMode, setViewMode] = useState('active'); // active, completed, all

  // Update progress state
  const [showUpdateProgress, setShowUpdateProgress] = useState(false);
  const [updatingGoal, setUpdatingGoal] = useState(null);
  const [newProgressValue, setNewProgressValue] = useState('');

  const categories = [
    { id: 'score', label: 'Score', icon: '🎯' },
    { id: 'teknikk', label: 'Teknikk', icon: '⛳' },
    { id: 'fysisk', label: 'Fysisk', icon: '💪' },
    { id: 'mental', label: 'Mental', icon: '🧠' },
    { id: 'turnering', label: 'Turnering', icon: '🏆' },
    { id: 'prosess', label: 'Prosess', icon: '📈' }
  ];

  const filteredGoals = goals.filter(goal => {
    const categoryMatch = selectedCategory === null || goal.category === selectedCategory;
    const statusMatch = viewMode === 'all' ||
      (viewMode === 'active' && goal.status === 'active') ||
      (viewMode === 'completed' && goal.status === 'completed');
    return categoryMatch && statusMatch;
  });

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  const handleSaveGoal = (goalData) => {
    if (editingGoal) {
      setGoals(goals.map(g => g.id === goalData.id ? goalData : g));
    } else {
      setGoals([...goals, goalData]);
    }
    setShowModal(false);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
    setShowModal(false);
    setEditingGoal(null);
  };

  const handleToggleComplete = (id) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        return { ...g, status: g.status === 'completed' ? 'active' : 'completed' };
      }
      return g;
    }));
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowModal(true);
  };

  const openUpdateProgress = (goal) => {
    setUpdatingGoal(goal);
    setNewProgressValue(goal.current.toString());
    setShowUpdateProgress(true);
  };

  const handleUpdateProgress = () => {
    const progressValue = parseFloat(newProgressValue);

    if (isNaN(progressValue) || progressValue < 0) {
      alert('Vennligst skriv inn en gyldig verdi');
      return;
    }

    if (progressValue > updatingGoal.target) {
      alert(`Verdien kan ikke være høyere enn målet (${updatingGoal.target} ${updatingGoal.unit})`);
      return;
    }

    setGoals(goals.map(g =>
      g.id === updatingGoal.id
        ? { ...g, current: progressValue }
        : g
    ));

    setShowUpdateProgress(false);
    setUpdatingGoal(null);
    setNewProgressValue('');
  };

  const toggleShareWithCoach = (goalId) => {
    setGoals(goals.map(g =>
      g.id === goalId
        ? { ...g, sharedWithCoach: !g.sharedWithCoach }
        : g
    ));
  };

  // Beregn total progresjon
  const totalProgress = activeGoals.length > 0
    ? activeGoals
        .filter(g => g.measurable)
        .reduce((sum, g) => sum + (g.current / g.target) * 100, 0) /
      activeGoals.filter(g => g.measurable).length
    : 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.snow }}>
      <PageHeader
        title="Mine Målsetninger"
        subtitle={`${activeGoals.length} aktive mål`}
        action={
          <Button
            variant="secondary"
            size="sm"
            icon="➕"
            onClick={() => {
              setEditingGoal(null);
              setShowModal(true);
            }}
          >
            Nytt mål
          </Button>
        }
      />

      {/* Stats cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        padding: '0 24px 24px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <div style={{
          padding: '12px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: colors.white,
          boxShadow: 'var(--shadow-card)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: colors.primary }}>{activeGoals.length}</div>
          <div style={{ fontSize: '12px', color: colors.steel }}>Aktive</div>
        </div>
        <div style={{
          padding: '12px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: colors.white,
          boxShadow: 'var(--shadow-card)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: colors.success }}>{completedGoals.length}</div>
          <div style={{ fontSize: '12px', color: colors.steel }}>Fullført</div>
        </div>
        <div style={{
          padding: '12px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: colors.white,
          boxShadow: 'var(--shadow-card)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: colors.primary }}>{Math.round(totalProgress)}%</div>
          <div style={{ fontSize: '12px', color: colors.steel }}>Snitt progr.</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* View mode tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[
            { id: 'active', label: 'Aktive', count: activeGoals.length },
            { id: 'completed', label: 'Fullførte', count: completedGoals.length },
            { id: 'all', label: 'Alle', count: goals.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id)}
              style={{
                padding: `${'8px'} ${'16px'}`,
                borderRadius: 'var(--radius-lg)',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === tab.id ? colors.primary : colors.white,
                color: viewMode === tab.id ? colors.white : colors.charcoal
              }}
            >
              {tab.label}
              <span
                style={{
                  padding: `2px ${'8px'}`,
                  borderRadius: '9999px',
                  fontSize: '12px',
                  backgroundColor: viewMode === tab.id ? 'rgba(255,255,255,0.2)' : colors.snow,
                  color: viewMode === tab.id ? colors.white : colors.steel
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Category filter */}
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Goals list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredGoals.length > 0 ? (
            filteredGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEditGoal}
                onToggleComplete={handleToggleComplete}
                onUpdateProgress={openUpdateProgress}
                onShareWithCoach={toggleShareWithCoach}
              />
            ))
          ) : (
            <StateCard
              variant="empty"
              title={viewMode === 'completed' ? 'Ingen fullførte mål ennå' : 'Ingen mål i denne kategorien'}
              description={viewMode === 'completed' ? 'Fullfør noen mål for å se dem her.' : 'Prøv å justere filteret eller opprett et nytt mål.'}
              action={
                <Button
                  variant="primary"
                  onClick={() => {
                    setEditingGoal(null);
                    setShowModal(true);
                  }}
                >
                  Opprett ditt første mål
                </Button>
              }
            />
          )}
        </div>

        {/* Inspirasjon */}
        {viewMode === 'active' && (
          <Card style={{ padding: '16px', marginTop: '24px', backgroundColor: 'rgba(var(--achievement-rgb), 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>💡</span>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '14px', color: colors.charcoal, margin: 0 }}>
                  Tips for gode mål
                </h4>
                <p style={{ fontSize: '12px', color: colors.steel, margin: 0, marginTop: '4px' }}>
                  Bruk SMART-metoden: Spesifikke, Målbare, Oppnåelige, Relevante og Tidsbestemte mål
                  gir best resultater.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Goal Modal */}
      {showModal && (
        <GoalModal
          goal={editingGoal}
          onSave={handleSaveGoal}
          onClose={() => {
            setShowModal(false);
            setEditingGoal(null);
          }}
          onDelete={handleDeleteGoal}
        />
      )}

      {/* Update Progress Modal */}
      {showUpdateProgress && updatingGoal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--space-4)'
          }}
          onClick={() => {
            setShowUpdateProgress(false);
            setUpdatingGoal(null);
            setNewProgressValue('');
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '400px',
              width: '100%',
              padding: 'var(--space-6)',
              boxShadow: 'var(--shadow-elevated)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.charcoal, marginBottom: 'var(--space-4)' }}>
              Oppdater progresjon
            </h3>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <p style={{ fontSize: '14px', color: colors.steel, marginBottom: 'var(--space-3)' }}>
                <strong style={{ color: colors.charcoal }}>{updatingGoal.title}</strong>
              </p>
              <p style={{ fontSize: '13px', color: colors.steel, marginBottom: 'var(--space-3)' }}>
                Mål: {updatingGoal.target} {updatingGoal.unit}
              </p>
              <p style={{ fontSize: '13px', color: colors.steel, marginBottom: 'var(--space-4)' }}>
                Nåværende: {updatingGoal.current} {updatingGoal.unit}
              </p>

              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.charcoal, marginBottom: 'var(--space-2)' }}>
                Ny verdi ({updatingGoal.unit})
              </label>
              <input
                type="number"
                value={newProgressValue}
                onChange={(e) => setNewProgressValue(e.target.value)}
                placeholder={`0 - ${updatingGoal.target}`}
                min="0"
                max={updatingGoal.target}
                step="0.1"
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  backgroundColor: colors.snow,
                  border: `1px solid ${colors.mist}`,
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  color: colors.charcoal,
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = colors.primary}
                onBlur={(e) => e.target.style.borderColor = colors.mist}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button
                onClick={() => {
                  setShowUpdateProgress(false);
                  setUpdatingGoal(null);
                  setNewProgressValue('');
                }}
                style={{
                  flex: 1,
                  padding: 'var(--space-3)',
                  backgroundColor: colors.snow,
                  color: colors.charcoal,
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Avbryt
              </button>
              <button
                onClick={handleUpdateProgress}
                className="hover:brightness-110"
                style={{
                  flex: 1,
                  padding: 'var(--space-3)',
                  backgroundColor: colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Lagre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Målsetninger;
