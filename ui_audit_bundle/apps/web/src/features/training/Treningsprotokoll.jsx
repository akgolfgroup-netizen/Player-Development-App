import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import Button from '../../ui/primitives/Button';
import {
  TeknikIcon, GolfslagIcon, SpillIcon, KonkurranseIcon,
  FysiskIcon, MentalIcon, GolfScorecard
} from '../../components/icons';
import { tokens } from '../../design-tokens';
import StateCard from '../../ui/composites/StateCard';
import { SectionTitle, SubSectionTitle, CardTitle } from '../../components/typography';

// Session type colors (Blue Palette 01) - use CSS custom properties
const sessionColors = {
  teknikk: 'var(--ak-session-teknikk)',
  golfslag: 'var(--ak-session-golfslag)',
  spill: 'var(--ak-session-spill)',
  konkurranse: 'var(--achievement)',
  fysisk: 'var(--achievement)',
  mental: 'var(--text-muted)',
};

// ===== ICONS =====
const Icons = {
  Play: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21"/>
    </svg>
  ),
  Pause: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16"/>
      <rect x="14" y="4" width="4" height="16"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12,6 12,12 16,14"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6,9 12,15 18,9"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9,18 15,12 9,6"/>
    </svg>
  ),
  Target: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  Repeat: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="17,1 21,5 17,9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7,23 3,19 7,15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ),
  Video: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="23,7 16,12 23,17"/>
      <rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
  SkipForward: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="5,4 15,12 5,20"/>
      <line x1="19" y1="5" x2="19" y2="19"/>
    </svg>
  ),
};

// ===== UI COMPONENTS =====
const Card = ({ children, className = '', padding = true }) => (
  <div className={`bg-white border border-ak-mist rounded-xl ${padding ? 'p-4' : ''} ${className}`}
       style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'neutral', size = 'sm' }) => {
  const variants = {
    neutral: 'bg-gray-100 text-gray-600',
    accent: 'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-[13px]',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};


// ===== LEVEL TAG COMPONENT =====
const LevelTag = ({ level }) => {
  const config = {
    L1: { bg: tokens.colors.cloud, text: tokens.colors.steel, label: 'L1 · Eksponering' },
    L2: { bg: tokens.colors.mist, text: tokens.colors.charcoal, label: 'L2 · Fundamentals' },
    L3: { bg: `${tokens.colors.success}20`, text: tokens.colors.primaryLight, label: 'L3 · Variasjon' },
    L4: { bg: tokens.colors.success, text: tokens.colors.white, label: 'L4 · Timing' },
    L5: { bg: tokens.colors.primary, text: tokens.colors.white, label: 'L5 · Automatikk' },
  };

  const { bg, text, label } = config[level] || config.L3;

  return (
    <span className="px-2 py-1 rounded-md text-[11px] font-medium" style={{ backgroundColor: bg, color: text }}>
      {label}
    </span>
  );
};

const SpeedTag = ({ speed }) => {
  const config = {
    CS0: { bg: tokens.colors.cloud, text: tokens.colors.steel, label: 'CS0 · N/A' },
    CS20: { bg: tokens.colors.cloud, text: tokens.colors.steel, label: 'CS20 · 20%' },
    CS40: { bg: tokens.colors.mist, text: tokens.colors.charcoal, label: 'CS40 · 40%' },
    CS60: { bg: `${tokens.colors.success}20`, text: tokens.colors.primaryLight, label: 'CS60 · 60%' },
    CS70: { bg: tokens.colors.success, text: tokens.colors.white, label: 'CS70 · 70%' },
    CS80: { bg: tokens.colors.primaryLight, text: tokens.colors.white, label: 'CS80 · 80%' },
    CS100: { bg: tokens.colors.primary, text: tokens.colors.white, label: 'CS100 · Maks' },
  };

  const { bg, text, label } = config[speed] || config.CS60;

  return (
    <span className="px-2 py-1 rounded-md text-[11px] font-medium" style={{ backgroundColor: bg, color: text }}>
      {label}
    </span>
  );
};

const SettingTag = ({ setting }) => {
  const config = {
    S1: { label: 'S1 · Range perfekt' },
    S2: { label: 'S2 · Range target' },
    S3: { label: 'S3 · Kortbane' },
    S4: { label: 'S4 · 9-hull trening' },
    S5: { label: 'S5 · 18-hull trening' },
    S6: { label: 'S6 · Intern konkurranse' },
    S7: { label: 'S7 · Ekstern klubb' },
    S8: { label: 'S8 · Lav-innsats turn.' },
    S9: { label: 'S9 · Viktig turnering' },
    S10: { label: 'S10 · Høy-innsats' },
  };

  const { label } = config[setting] || { label: setting };

  return (
    <span className="px-2 py-1 rounded-md text-[11px] font-medium bg-ak-gold/10 text-ak-gold">
      {label}
    </span>
  );
};

// ===== MAIN TRAINING PROTOCOL COMPONENT =====
const AKGolfTreningsprotokoll = ({ sessions: apiSessions = [], player: apiPlayer = null }) => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [activeExercise, setActiveExercise] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Player profile - use API data if available
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const player = apiPlayer || {
    name: 'Ola Nordmann',
    category: 'B',
  };

  // Training sessions library (demo data)
  const trainingSessions = [
    {
      id: 1,
      name: 'Driver Teknikk - Grunnleggende',
      category: 'teknikk',
      level: 'L2',
      speed: 'CS40',
      setting: 'S1',
      duration: 60,
      focus: ['Grip', 'Stance', 'Backswing'],
      description: 'Fokus på grunnleggende driver-teknikk med sakte svinger for å bygge korrekt mønster.',
      exercises: [
        { id: 1, name: 'Oppvarming - Rotasjon', duration: 5, reps: null, description: 'Dynamisk strekk for skuldre og hofter' },
        { id: 2, name: 'Grip-sjekk', duration: 3, reps: 10, description: 'Korrekt grep med V mot høyre skulder' },
        { id: 3, name: 'Stance & Alignment', duration: 5, reps: null, description: 'Sjekk skulderbredde, ballposisjon og alignment' },
        { id: 4, name: 'L1 - Kun kropp', duration: 10, reps: 20, description: 'Sving uten kølle, fokus på rotasjon' },
        { id: 5, name: 'L2 - Kropp + armer', duration: 10, reps: 20, description: 'Halv sving med fokus på arm-sync' },
        { id: 6, name: 'Full sving CS40', duration: 15, reps: 30, description: 'Full sving på 40% hastighet' },
        { id: 7, name: 'Video-analyse', duration: 5, reps: 3, description: 'Film 3 svinger for analyse' },
        { id: 8, name: 'Nedkjøling', duration: 7, reps: null, description: 'Statisk strekk og refleksjon' },
      ],
      icon: TeknikIcon,
    },
    {
      id: 2,
      name: 'Putting Lab - Avstandskontroll',
      category: 'golfslag',
      level: 'L4',
      speed: 'CS100',
      setting: 'S3',
      duration: 45,
      focus: ['Lag-kontroll', 'Lengdekontroll', 'Tempo'],
      description: 'Utvikle konsistent avstandskontroll på putting med fokus på tempo og follow-through.',
      exercises: [
        { id: 1, name: 'Oppvarming', duration: 5, reps: 20, description: 'Rulleøvelse 1-2 meter' },
        { id: 2, name: '3m Lag-kontroll', duration: 8, reps: 15, description: 'Putt til 3m, fokus på gjenværende distanse' },
        { id: 3, name: '6m Lag-kontroll', duration: 8, reps: 15, description: 'Putt til 6m, mål: innenfor 60cm' },
        { id: 4, name: '9m Lag-kontroll', duration: 8, reps: 15, description: 'Putt til 9m, mål: innenfor 90cm' },
        { id: 5, name: 'Ladder Drill', duration: 10, reps: 10, description: 'Putt til 3, 6, 9, 12m i rekkefølge' },
        { id: 6, name: 'Pressure Putts', duration: 6, reps: 10, description: 'Eliminering: miss = start på nytt' },
      ],
      icon: GolfslagIcon,
    },
    {
      id: 3,
      name: 'Fysisk - Golf Styrke',
      category: 'fysisk',
      level: 'L3',
      speed: 'CS0',
      setting: 'S1',
      duration: 45,
      focus: ['Rotasjonskraft', 'Benstyrke', 'Core'],
      description: 'Golf-spesifikk styrketrening med fokus på rotasjonskraft og eksplosivitet.',
      exercises: [
        { id: 1, name: 'Oppvarming', duration: 8, reps: null, description: 'Lett kardio og dynamisk strekk' },
        { id: 2, name: 'Rotasjonskast', duration: 6, reps: 12, description: '4kg medisinball, begge sider' },
        { id: 3, name: 'Goblet Squat', duration: 5, reps: 12, description: '3 sett med moderat vekt' },
        { id: 4, name: 'Cable Rotation', duration: 6, reps: 15, description: 'Begge sider, kontrollert tempo' },
        { id: 5, name: 'Single-leg RDL', duration: 5, reps: 10, description: 'Med kettlebell, begge sider' },
        { id: 6, name: 'Pallof Press', duration: 5, reps: 12, description: 'Anti-rotasjon, begge sider' },
        { id: 7, name: 'Planke variasjon', duration: 5, reps: null, description: '45 sek front, 30 sek side' },
        { id: 8, name: 'Nedkjøling', duration: 5, reps: null, description: 'Statisk strekk' },
      ],
      icon: FysiskIcon,
    },
    {
      id: 4,
      name: 'Shortgame - Pitch & Chip',
      category: 'golfslag',
      level: 'L3',
      speed: 'CS60',
      setting: 'S3',
      duration: 60,
      focus: ['Pitch 30-60m', 'Chip rundt green', 'Lie-variasjon'],
      description: 'Variert shortgame-trening med forskjellige lies og distanser.',
      exercises: [
        { id: 1, name: 'Oppvarming', duration: 5, reps: null, description: 'Lett strekk og korte svinger' },
        { id: 2, name: 'Chip - Bump & Run', duration: 10, reps: 20, description: '7-jern, 5-15m til hull' },
        { id: 3, name: 'Pitch 30m', duration: 10, reps: 15, description: 'SW/LW, fokus på landing spot' },
        { id: 4, name: 'Pitch 50m', duration: 10, reps: 15, description: 'GW/PW, variér baksving' },
        { id: 5, name: 'Flop Shot', duration: 8, reps: 10, description: 'Åpen klubbface, høy bue' },
        { id: 6, name: 'Lie-variasjon', duration: 10, reps: 15, description: 'Tett lie, rough, uphill/downhill' },
        { id: 7, name: 'Par-sparing drill', duration: 7, reps: 9, description: '9 hull simulering' },
      ],
      icon: GolfslagIcon,
    },
    {
      id: 5,
      name: 'Mental - Fokus & Rutiner',
      category: 'mental',
      level: 'L2',
      speed: 'CS0',
      setting: 'S1',
      duration: 30,
      focus: ['Pre-shot rutine', 'Pust', 'Visualisering'],
      description: 'Mental trening med fokus på å bygge konsistente rutiner og fokus-teknikker.',
      exercises: [
        { id: 1, name: 'Pusteteknikk', duration: 5, reps: null, description: '4-7-8 teknikk for ro' },
        { id: 2, name: 'Pre-shot rutine design', duration: 8, reps: null, description: 'Definer 5-stegs rutine' },
        { id: 3, name: 'Visualisering', duration: 7, reps: 5, description: 'Se for deg perfekt slag' },
        { id: 4, name: 'Rutine-praksis', duration: 5, reps: 10, description: 'Gjenta rutine med timing' },
        { id: 5, name: 'Distraksjonstrening', duration: 5, reps: 5, description: 'Behold fokus ved forstyrrelser' },
      ],
      icon: MentalIcon,
    },
    {
      id: 6,
      name: 'Jern Teknikk - L3 Variasjon',
      category: 'teknikk',
      level: 'L3',
      speed: 'CS70',
      setting: 'S2',
      duration: 75,
      focus: ['Baller over/under', 'Draw/Fade', 'Lie-variasjon'],
      description: 'Avansert jerntrening med fokus på slagvariasjon og lie-tilpasning.',
      exercises: [
        { id: 1, name: 'Oppvarming', duration: 8, reps: null, description: 'Progressiv oppvarming' },
        { id: 2, name: 'Stock shot 7-jern', duration: 10, reps: 20, description: 'Standard slag til target' },
        { id: 3, name: 'Low punch', duration: 10, reps: 15, description: 'Ball bak, hands forward' },
        { id: 4, name: 'High fade', duration: 10, reps: 15, description: 'Open stance, høy finish' },
        { id: 5, name: 'Low draw', duration: 10, reps: 15, description: 'Lukket stance, lav finish' },
        { id: 6, name: 'Uphill/Downhill', duration: 12, reps: 20, description: 'Simuler skrå lies' },
        { id: 7, name: 'Random targets', duration: 10, reps: 15, description: 'Variér target hver gang' },
        { id: 8, name: 'Nedkjøling', duration: 5, reps: null, description: 'Strekk og refleksjon' },
      ],
      icon: TeknikIcon,
    },
  ];

  // Transform API sessions to internal format
  const transformApiSessions = (apiData) => {
    if (!apiData || apiData.length === 0) return demoTrainingSessions;

    return apiData.map((session, index) => {
      // Map API session type to category
      const categoryMap = {
        'technique': 'teknikk',
        'teknikk': 'teknikk',
        'golf_shots': 'golfslag',
        'golfslag': 'golfslag',
        'physical': 'fysisk',
        'fysisk': 'fysisk',
        'mental': 'mental',
        'play': 'spill',
        'spill': 'spill',
        'competition': 'konkurranse',
        'konkurranse': 'konkurranse',
      };

      const iconMap = {
        'teknikk': TeknikIcon,
        'golfslag': GolfslagIcon,
        'fysisk': FysiskIcon,
        'mental': MentalIcon,
        'spill': SpillIcon,
        'konkurranse': KonkurranseIcon,
      };

      const category = categoryMap[session.type?.toLowerCase()] || 'teknikk';

      return {
        id: session.id || index + 1,
        name: session.name || session.title || `Treningsøkt ${index + 1}`,
        category: category,
        level: session.level || 'L3',
        speed: session.speed || 'CS60',
        setting: session.setting || 'S1',
        duration: session.duration || 60,
        focus: session.focus || session.focusAreas || ['Generelt'],
        description: session.description || '',
        exercises: session.exercises || session.blocks?.flatMap(block =>
          block.exercises?.map((ex, i) => ({
            id: ex.id || i + 1,
            name: ex.name || ex.title,
            duration: ex.duration || 5,
            reps: ex.reps || null,
            description: ex.description || ex.notes || ''
          }))
        ) || [],
        icon: iconMap[category] || GolfScorecard,
      };
    });
  };

  // Use API sessions if available, otherwise use demo data
  const demoTrainingSessions = trainingSessions;
  const displaySessions = apiSessions && apiSessions.length > 0
    ? transformApiSessions(apiSessions)
    : demoTrainingSessions;

  // Update session categories based on actual data
  const computedCategories = [
    { id: 'all', label: 'Alle økter', count: displaySessions.length },
    ...['teknikk', 'golfslag', 'fysisk', 'mental', 'spill', 'konkurranse']
      .map(cat => ({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
        count: displaySessions.filter(s => s.category === cat).length
      }))
      .filter(cat => cat.count > 0)
  ];

  // Get session type color
  const getSessionColor = (category) => {
    return sessionColors[category] || tokens.colors.steel;
  };

  // Filter sessions based on selected category
  const filteredSessions = selectedCategory === 'all'
    ? displaySessions
    : displaySessions.filter(s => s.category === selectedCategory);

  // Handle exercise completion
  const toggleExerciseComplete = (exerciseId) => {
    if (completedExercises.includes(exerciseId)) {
      setCompletedExercises(completedExercises.filter(id => id !== exerciseId));
    } else {
      setCompletedExercises([...completedExercises, exerciseId]);
    }
  };

  // Calculate session progress
  const getSessionProgress = (session) => {
    if (!session) return 0;
    const completed = session.exercises.filter(e => completedExercises.includes(e.id)).length;
    return Math.round((completed / session.exercises.length) * 100);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow, fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
      {/* Header */}
      <PageHeader
        title="Treningsprotokoll"
        subtitle="Planlagte og gjennomførte økter"
      />

      <div style={{ padding: '24px', width: '100%' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Session Library */}
          <div className="lg:col-span-1">
            <SectionTitle className="mb-4">Øktbibliotek</SectionTitle>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {computedCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-ak-primary text-white'
                      : 'bg-white text-ak-charcoal border border-ak-mist hover:bg-ak-snow'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sessions List */}
            <div className="space-y-3">
              {filteredSessions.map(session => (
                <Card
                  key={session.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedSession?.id === session.id ? 'ring-2 ring-ak-primary' : ''
                  }`}
                  onClick={() => {
                    setSelectedSession(session);
                    setActiveExercise(0);
                    setCompletedExercises([]);
                    setIsPlaying(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                      style={{ backgroundColor: `${getSessionColor(session.category)}15` }}
                    >
                      {session.icon && <session.icon size={24} color={getSessionColor(session.category)} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <SubSectionTitle className="text-[14px] line-clamp-1">{session.name}</SubSectionTitle>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-ak-steel">
                        <Icons.Clock />
                        <span>{session.duration} min</span>
                        <span>·</span>
                        <span>{session.exercises.length} øvelser</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <LevelTag level={session.level} />
                        <SpeedTag speed={session.speed} />
                      </div>
                    </div>
                    <Icons.ChevronRight />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right: Session Detail */}
          <div className="lg:col-span-2">
            {selectedSession ? (
              <>
                {/* Session Header */}
                <Card className="mb-4 bg-gradient-to-r from-ak-primary to-ak-primary-light text-white border-0">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {selectedSession.icon && <selectedSession.icon size={28} color={getSessionColor(selectedSession.category)} />}
                        <SectionTitle className="text-[20px] text-white">{selectedSession.name}</SectionTitle>
                      </div>
                      <p className="text-white/70 text-[13px] mb-3">{selectedSession.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <LevelTag level={selectedSession.level} />
                        <SpeedTag speed={selectedSession.speed} />
                        <SettingTag setting={selectedSession.setting} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-[11px] uppercase">Varighet</p>
                      <p className="text-[24px] font-bold">{selectedSession.duration}m</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] text-white/70">Progresjon</span>
                      <span className="text-[12px] font-medium">{getSessionProgress(selectedSession)}%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${getSessionProgress(selectedSession)}%` }}
                      />
                    </div>
                  </div>

                  {/* Focus Areas */}
                  <div className="flex items-center gap-2">
                    <Icons.Target />
                    <span className="text-[12px] text-white/70">Fokus:</span>
                    {selectedSession.focus.map((f, i) => (
                      <Badge key={i} variant="neutral" size="sm">
                        <span className="text-ak-primary">{f}</span>
                      </Badge>
                    ))}
                  </div>
                </Card>

                {/* Playback Controls */}
                <Card className="mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                          isPlaying ? 'bg-ak-error text-white' : 'bg-ak-primary text-white'
                        }`}
                      >
                        {isPlaying ? <Icons.Pause /> : <Icons.Play />}
                      </button>
                      <div>
                        <p className="text-[14px] font-semibold text-ak-charcoal">
                          {selectedSession.exercises[activeExercise]?.name || 'Klar til start'}
                        </p>
                        <p className="text-[12px] text-ak-steel">
                          Øvelse {activeExercise + 1} av {selectedSession.exercises.length}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveExercise(Math.max(0, activeExercise - 1))}
                        disabled={activeExercise === 0}
                        className="p-2 rounded-lg border border-ak-mist disabled:opacity-50"
                      >
                        <Icons.ChevronRight style={{ transform: 'rotate(180deg)' }} />
                      </button>
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Icons.Check />}
                        onClick={() => {
                          toggleExerciseComplete(selectedSession.exercises[activeExercise].id);
                          if (activeExercise < selectedSession.exercises.length - 1) {
                            setActiveExercise(activeExercise + 1);
                          }
                        }}
                        style={{ backgroundColor: 'var(--success)' }}
                      >
                        Fullfør
                      </Button>
                      <button
                        onClick={() => setActiveExercise(Math.min(selectedSession.exercises.length - 1, activeExercise + 1))}
                        disabled={activeExercise === selectedSession.exercises.length - 1}
                        className="p-2 rounded-lg border border-ak-mist disabled:opacity-50"
                      >
                        <Icons.SkipForward />
                      </button>
                    </div>
                  </div>
                </Card>

                {/* Exercise List */}
                <SubSectionTitle className="text-[15px] mb-3">Øvelser</SubSectionTitle>
                <div className="space-y-2">
                  {selectedSession.exercises.map((exercise, idx) => {
                    const isActive = idx === activeExercise;
                    const isCompleted = completedExercises.includes(exercise.id);

                    return (
                      <Card
                        key={exercise.id}
                        className={`cursor-pointer transition-all ${
                          isActive ? 'ring-2 ring-ak-primary bg-ak-primary/5' : ''
                        } ${isCompleted ? 'opacity-60' : ''}`}
                        onClick={() => setActiveExercise(idx)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <div className="w-8 h-8 rounded-full bg-ak-success flex items-center justify-center text-white">
                                <Icons.Check />
                              </div>
                            ) : (
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[12px] font-bold ${
                                isActive ? 'border-ak-primary text-ak-primary' : 'border-ak-mist text-ak-steel'
                              }`}>
                                {idx + 1}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <CardTitle className={`text-[14px] ${isCompleted ? 'line-through text-ak-steel' : ''}`}>
                                {exercise.name}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-[11px] text-ak-steel">
                                <Icons.Clock />
                                {exercise.duration} min
                                {exercise.reps && (
                                  <>
                                    <span>·</span>
                                    <Icons.Repeat />
                                    {exercise.reps}x
                                  </>
                                )}
                              </div>
                            </div>
                            <p className="text-[12px] text-ak-steel">{exercise.description}</p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </>
            ) : (
              <StateCard
                variant="empty"
                title="Velg en treningsøkt"
                description="Klikk på en økt i listen for å se detaljer og starte treningen."
              />
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AKGolfTreningsprotokoll;
