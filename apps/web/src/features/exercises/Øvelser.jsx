import React, { useState } from 'react';
import Button from '../../ui/primitives/Button';
import {
  GolfslagIcon, GolfTarget, GolfFlag, GolfPutter, FysiskIcon, MentalIcon,
  GolfBunker
} from '../../components/icons';

// ===== ICONS =====
const Icons = {
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Filter: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
    </svg>
  ),
  Play: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21"/>
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12,6 12,12 16,14"/>
    </svg>
  ),
  Star: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  ),
  StarOutline: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  ),
  Heart: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84,4.61 C20.33,4.1 19.72,3.7 19.05,3.43 C18.38,3.15 17.66,3.01 16.93,3.01 C16.2,3.01 15.48,3.15 14.81,3.43 C14.14,3.7 13.53,4.1 13.02,4.61 L12,5.64 L10.98,4.61 C9.95,3.58 8.55,3.01 7.07,3.01 C5.59,3.01 4.19,3.58 3.16,4.61 C2.13,5.64 1.56,7.04 1.56,8.52 C1.56,10 2.13,11.4 3.16,12.43 L4.18,13.45 L12,21.27 L19.82,13.45 L20.84,12.43 C21.35,11.92 21.75,11.31 22.03,10.64 C22.3,9.97 22.45,9.25 22.45,8.52 C22.45,7.79 22.3,7.07 22.03,6.4 C21.75,5.73 21.35,5.12 20.84,4.61 Z"/>
    </svg>
  ),
  HeartFilled: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={'var(--error)'} stroke={'var(--error)'} strokeWidth="2">
      <path d="M20.84,4.61 C20.33,4.1 19.72,3.7 19.05,3.43 C18.38,3.15 17.66,3.01 16.93,3.01 C16.2,3.01 15.48,3.15 14.81,3.43 C14.14,3.7 13.53,4.1 13.02,4.61 L12,5.64 L10.98,4.61 C9.95,3.58 8.55,3.01 7.07,3.01 C5.59,3.01 4.19,3.58 3.16,4.61 C2.13,5.64 1.56,7.04 1.56,8.52 C1.56,10 2.13,11.4 3.16,12.43 L4.18,13.45 L12,21.27 L19.82,13.45 L20.84,12.43 C21.35,11.92 21.75,11.31 22.03,10.64 C22.3,9.97 22.45,9.25 22.45,8.52 C22.45,7.79 22.3,7.07 22.03,6.4 C21.75,5.73 21.35,5.12 20.84,4.61 Z"/>
    </svg>
  ),
  Grid: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  List: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9,6 15,12 9,18"/>
    </svg>
  ),
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
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
    error: 'bg-red-50 text-red-700',
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


// ===== L-PHASE TAG =====
const LevelTag = ({ level }) => {
  const config = {
    L1: { bg: 'var(--bg-tertiary)', text: 'var(--text-secondary)', label: 'L1' },
    L2: { bg: 'var(--border-default)', text: 'var(--text-primary)', label: 'L2' },
    L3: { bg: 'rgba(var(--success-rgb), 0.12)', text: 'var(--accent-light)', label: 'L3' },
    L4: { bg: 'var(--success)', text: 'var(--bg-primary)', label: 'L4' },
    L5: { bg: 'var(--accent)', text: 'var(--bg-primary)', label: 'L5' },
  };

  const { bg, text, label } = config[level] || config.L3;

  return (
    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: bg, color: text }}>
      {label}
    </span>
  );
};

// ===== MAIN COMPONENT =====
const AKGolfOvelser = ({ player: apiPlayer = null, exercises: apiExercises = null }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [favorites, setFavorites] = useState([1, 5, 8]);

  // Default player (fallback if no API data)
  const defaultPlayer = {
    name: 'Ola Nordmann',
    category: 'B',
  };

  // Use API data if available, otherwise use default
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const player = apiPlayer || defaultPlayer;

  // Categories
  const categories = [
    { id: 'all', label: 'Alle', count: 24 },
    { id: 'langspill', label: 'Langspill', count: 6, Icon: GolfslagIcon },
    { id: 'innspill', label: 'Innspill', count: 5, Icon: GolfTarget },
    { id: 'shortgame', label: 'Shortgame', count: 4, Icon: GolfFlag },
    { id: 'putting', label: 'Putting', count: 4, Icon: GolfPutter },
    { id: 'fysisk', label: 'Fysisk', count: 3, Icon: FysiskIcon },
    { id: 'mental', label: 'Mental', count: 2, Icon: MentalIcon },
  ];

  // L-phases
  const lPhases = [
    { id: 'all', label: 'Alle L-faser' },
    { id: 'L1', label: 'L1 - Eksponering' },
    { id: 'L2', label: 'L2 - Fundamentals' },
    { id: 'L3', label: 'L3 - Variasjon' },
    { id: 'L4', label: 'L4 - Timing' },
    { id: 'L5', label: 'L5 - Automatikk' },
  ];

  // Default exercises database (fallback if no API data)
  const defaultExercises = [
    {
      id: 1,
      name: 'Driver Carry Drill',
      category: 'langspill',
      level: 'L4',
      duration: 15,
      difficulty: 3,
      description: 'Fokuser på maksimal carry-distanse med kontrollert sving.',
      instructions: [
        'Varm opp med 10 halve svinger',
        'Fokus på rotasjon og timing',
        'Mål: 5 slag over 250m carry',
        'Loggfør beste og snitt',
      ],
      equipment: ['Driver', 'Launch Monitor', 'Tees'],
      videoUrl: 'https://example.com/video1',
      ThumbnailIcon: GolfslagIcon,
    },
    {
      id: 2,
      name: 'Stock Shot 7-jern',
      category: 'innspill',
      level: 'L3',
      duration: 20,
      difficulty: 2,
      description: 'Bygg konsistent stock shot med 7-jern til ulike targets.',
      instructions: [
        'Velg 3 targets på 150m, 155m, 160m',
        'Slå 5 baller til hvert target',
        'Fokus på samme sving, juster klubbvalg',
        'Mål avstand fra target',
      ],
      equipment: ['7-jern', 'Range baller', 'Target flagg'],
      videoUrl: 'https://example.com/video2',
      ThumbnailIcon: GolfTarget,
    },
    {
      id: 3,
      name: 'Wedge Distance Control',
      category: 'innspill',
      level: 'L4',
      duration: 25,
      difficulty: 3,
      description: 'Presisjonstrening med wedger på 50-100m.',
      instructions: [
        'Sett opp targets på 50, 70, 90m',
        'Bruk 52°, 56°, 60° wedge',
        'Slå 3 baller til hvert target med hver wedge',
        'Beregn PEI for hver serie',
      ],
      equipment: ['Wedger (52°, 56°, 60°)', 'Launch Monitor'],
      videoUrl: 'https://example.com/video3',
      ThumbnailIcon: GolfTarget,
    },
    {
      id: 4,
      name: 'Bunker Escape Drill',
      category: 'shortgame',
      level: 'L3',
      duration: 15,
      difficulty: 2,
      description: 'Grunnleggende bunkerslag med fokus på å komme ut på første forsøk.',
      instructions: [
        'Plasser 10 baller i greenside bunker',
        'Mål: Alle på green',
        'Fokus på åpen stance og sving gjennom sanden',
        'Tell antall innenfor 3m fra hull',
      ],
      equipment: ['Sand wedge', 'Bunker rake'],
      videoUrl: 'https://example.com/video4',
      ThumbnailIcon: GolfBunker,
    },
    {
      id: 5,
      name: 'Lag Putting Gate Drill',
      category: 'putting',
      level: 'L5',
      duration: 20,
      difficulty: 4,
      description: 'Lag-kontroll fra 6-9 meter med gates.',
      instructions: [
        'Sett opp gates 30cm foran hullet',
        'Putt fra 6m, 7.5m og 9m',
        'Mål: Stopp ballen mellom hull og 60cm bak',
        'Tren til 8/10 suksess på hver avstand',
      ],
      equipment: ['Putter', 'Gate sticks', 'Målebånd'],
      videoUrl: 'https://example.com/video5',
      ThumbnailIcon: GolfFlag,
    },
    {
      id: 6,
      name: 'Pressure Putting Challenge',
      category: 'putting',
      level: 'L5',
      duration: 15,
      difficulty: 5,
      description: 'Mental press-trening med eliminerings-format.',
      instructions: [
        'Start med 10 baller på 2m',
        'Miss = start på nytt',
        'Mål: 10 på rad',
        'Loggfør beste streak',
      ],
      equipment: ['Putter', 'Timer'],
      videoUrl: 'https://example.com/video6',
      ThumbnailIcon: GolfTarget,
    },
    {
      id: 7,
      name: 'Rotary Power Drill',
      category: 'fysisk',
      level: 'L2',
      duration: 30,
      difficulty: 3,
      description: 'Bygg rotasjonskraft med medisinball-øvelser.',
      instructions: [
        '3 sett x 10 rotasjonskast (høyre)',
        '3 sett x 10 rotasjonskast (venstre)',
        '3 sett x 10 overhead slam',
        'Fokus på eksplosivitet fra bakken',
      ],
      equipment: ['Medisinball 4kg', 'Vegg/partner'],
      videoUrl: 'https://example.com/video7',
      ThumbnailIcon: FysiskIcon,
    },
    {
      id: 8,
      name: 'Pre-shot Rutine Drill',
      category: 'mental',
      level: 'L4',
      duration: 20,
      difficulty: 2,
      description: 'Bygg konsistent pre-shot rutine på 18-22 sekunder.',
      instructions: [
        'Definer din 5-stegs rutine',
        'Tren rutinen på 10 slag',
        'Bruk timer for å sikre konsistens',
        'Mål: Variasjon under 3 sekunder',
      ],
      equipment: ['Timer/Stopper', 'Video for analyse'],
      videoUrl: 'https://example.com/video8',
      ThumbnailIcon: MentalIcon,
    },
    {
      id: 9,
      name: 'Fade/Draw Control',
      category: 'langspill',
      level: 'L4',
      duration: 25,
      difficulty: 4,
      description: 'Kontrollert kurving av ballen begge veier.',
      instructions: [
        'Varm opp med 10 rette slag',
        'Slå 10 kontrollerte fades',
        'Slå 10 kontrollerte draws',
        'Kombiner: alternerende fade/draw',
      ],
      equipment: ['Driver eller 5-jern', 'Launch Monitor'],
      videoUrl: 'https://example.com/video9',
      ThumbnailIcon: GolfslagIcon,
    },
    {
      id: 10,
      name: 'Chip & Run Variasjon',
      category: 'shortgame',
      level: 'L3',
      duration: 20,
      difficulty: 2,
      description: 'Chip med ulike klubber for varierende trille.',
      instructions: [
        'Velg samme landingsspot',
        'Chip med 8-jern, PW, 56°',
        'Observer ulik trille',
        'Lær avstander for hver klubb',
      ],
      equipment: ['8-jern, PW, 56°', 'Chipping green'],
      videoUrl: 'https://example.com/video10',
      ThumbnailIcon: GolfFlag,
    },
  ];

  // Use API data if available, otherwise use default
  const exercises = apiExercises || defaultExercises;

  // Toggle favorite
  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Filter exercises
  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || ex.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Difficulty stars
  const DifficultyStars = ({ level }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= level ? 'text-ak-gold' : 'text-ak-mist'}>
          {i <= level ? <Icons.Star /> : <Icons.StarOutline />}
        </span>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
      <div style={{ padding: '0' }}>
        {/* Search & Filters */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ak-steel">
                <Icons.Search />
              </div>
              <input
                type="text"
                placeholder="Søk etter øvelser..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-ak-mist rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-ak-primary/20 focus:border-ak-primary"
              />
            </div>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2.5 bg-white border border-ak-mist rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-ak-primary/20"
            >
              {lPhases.map(phase => (
                <option key={phase.id} value={phase.id}>{phase.label}</option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-white border border-ak-mist rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-ak-primary text-white' : 'text-ak-steel'}`}
              >
                <Icons.Grid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-ak-primary text-white' : 'text-ak-steel'}`}
              >
                <Icons.List />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar - Categories */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <Card padding={false}>
              <div className="p-4 border-b border-ak-mist">
                <h3 className="text-[13px] font-semibold text-ak-charcoal">Kategorier</h3>
              </div>
              <div className="py-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-ak-primary/5 text-ak-primary border-l-2 border-ak-primary'
                        : 'text-ak-charcoal hover:bg-ak-snow'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {cat.Icon && <cat.Icon size={16} />}
                      <span className="text-[13px]">{cat.label}</span>
                    </span>
                    <span className="text-[11px] text-ak-steel">{cat.count}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Favorites Quick Access */}
            <Card className="mt-4">
              <h3 className="text-[13px] font-semibold text-ak-charcoal mb-3 flex items-center gap-2">
                <span className="text-ak-error"><Icons.HeartFilled /></span>
                Favoritter
              </h3>
              <div className="space-y-2">
                {exercises.filter(ex => favorites.includes(ex.id)).slice(0, 3).map(ex => (
                  <div
                    key={ex.id}
                    onClick={() => setSelectedExercise(ex)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-ak-snow cursor-pointer hover:bg-ak-mist transition-colors"
                  >
                    <span className="text-ak-primary">{ex.ThumbnailIcon && <ex.ThumbnailIcon size={16} />}</span>
                    <span className="text-[12px] text-ak-charcoal line-clamp-1">{ex.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] text-ak-steel">
                Viser {filteredExercises.length} øvelser
              </p>
            </div>

            {/* Exercises Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredExercises.map(exercise => (
                  <Card
                    key={exercise.id}
                    padding={false}
                    className="cursor-pointer hover:shadow-lg transition-all overflow-hidden group"
                    onClick={() => setSelectedExercise(exercise)}
                  >
                    {/* Thumbnail */}
                    <div className="h-32 bg-gradient-to-br from-ak-primary/10 to-ak-success/10 flex items-center justify-center relative">
                      <span className="text-ak-primary">{exercise.ThumbnailIcon && <exercise.ThumbnailIcon size={48} />}</span>
                      <div className="absolute inset-0 bg-ak-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                          <Icons.Play />
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(exercise.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                      >
                        {favorites.includes(exercise.id) ? <Icons.HeartFilled /> : <Icons.Heart />}
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-[14px] font-semibold text-ak-charcoal line-clamp-1">{exercise.name}</h3>
                        <LevelTag level={exercise.level} />
                      </div>
                      <p className="text-[12px] text-ak-steel line-clamp-2 mb-3">{exercise.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[11px] text-ak-steel">
                          <Icons.Clock />
                          <span>{exercise.duration} min</span>
                        </div>
                        <DifficultyStars level={exercise.difficulty} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredExercises.map(exercise => (
                  <Card
                    key={exercise.id}
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => setSelectedExercise(exercise)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-ak-primary/10 to-ak-success/10 flex items-center justify-center flex-shrink-0 text-ak-primary">
                        {exercise.ThumbnailIcon && <exercise.ThumbnailIcon size={28} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[14px] font-semibold text-ak-charcoal">{exercise.name}</h3>
                          <LevelTag level={exercise.level} />
                        </div>
                        <p className="text-[12px] text-ak-steel line-clamp-1">{exercise.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1 text-[11px] text-ak-steel">
                            <Icons.Clock />
                            {exercise.duration} min
                          </span>
                          <DifficultyStars level={exercise.difficulty} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(exercise.id);
                          }}
                          className="p-2 rounded-lg hover:bg-ak-snow transition-colors"
                        >
                          {favorites.includes(exercise.id) ? <Icons.HeartFilled /> : <Icons.Heart />}
                        </button>
                        <Icons.ChevronRight />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" padding={false}>
            {/* Modal Header */}
            <div className="h-48 bg-gradient-to-br from-ak-primary to-ak-primary-light flex items-center justify-center relative">
              <span className="text-white">{selectedExercise.ThumbnailIcon && <selectedExercise.ThumbnailIcon size={72} />}</span>
              <button
                onClick={() => setSelectedExercise(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              >
                <Icons.X />
              </button>
              <button
                onClick={() => toggleFavorite(selectedExercise.id)}
                className="absolute top-4 left-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              >
                {favorites.includes(selectedExercise.id) ? <Icons.HeartFilled /> : <Icons.Heart />}
              </button>
            </div>

            <div className="p-6">
              {/* Title & Badges */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-[20px] font-bold text-ak-charcoal mb-2">{selectedExercise.name}</h2>
                  <div className="flex items-center gap-2">
                    <LevelTag level={selectedExercise.level} />
                    <Badge variant="neutral">
                      {categories.find(c => c.id === selectedExercise.category)?.label}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-ak-steel mb-1">
                    <Icons.Clock />
                    <span className="text-[13px]">{selectedExercise.duration} min</span>
                  </div>
                  <DifficultyStars level={selectedExercise.difficulty} />
                </div>
              </div>

              {/* Description */}
              <p className="text-[14px] text-ak-charcoal mb-6">{selectedExercise.description}</p>

              {/* Instructions */}
              <div className="mb-6">
                <h3 className="text-[14px] font-semibold text-ak-charcoal mb-3">Instruksjoner</h3>
                <ol className="space-y-2">
                  {selectedExercise.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-ak-primary text-white text-[12px] flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-[13px] text-ak-charcoal">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Equipment */}
              <div className="mb-6">
                <h3 className="text-[14px] font-semibold text-ak-charcoal mb-3">Utstyr</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedExercise.equipment.map((item, idx) => (
                    <Badge key={idx} variant="neutral" size="md">{item}</Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  leftIcon={<Icons.Play />}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Start øvelse
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setSelectedExercise(null)}
                >
                  Lukk
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};

export default AKGolfOvelser;
