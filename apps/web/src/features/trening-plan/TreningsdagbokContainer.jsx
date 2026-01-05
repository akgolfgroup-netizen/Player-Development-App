/**
 * TreningsdagbokContainer.jsx
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */
import React, { useState, useEffect } from 'react';
import {
  BookOpen, ChevronRight, Plus, Star, Clock,
  Target, Dumbbell, Brain, Search, AlertCircle
} from 'lucide-react';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import Badge from '../../ui/primitives/Badge.primitive';
import StateCard from '../../ui/composites/StateCard';
import apiClient from '../../services/apiClient';
import { SubSectionTitle } from '../../components/typography';

// ============================================================================
// CLASS MAPPINGS
// ============================================================================

const TYPE_CLASSES = {
  technical: {
    text: 'text-ak-primary',
    bg: 'bg-ak-primary/15',
    icon: Target,
    label: 'Teknikk',
    variant: 'accent',
  },
  short_game: {
    text: 'text-ak-status-success',
    bg: 'bg-ak-status-success/15',
    icon: Target,
    label: 'Kortspill',
    variant: 'success',
  },
  physical: {
    text: 'text-ak-status-error',
    bg: 'bg-ak-status-error/15',
    icon: Dumbbell,
    label: 'Fysisk',
    variant: 'error',
  },
  mental: {
    text: 'text-ak-status-warning',
    bg: 'bg-ak-status-warning/15',
    icon: Brain,
    label: 'Mental',
    variant: 'warning',
  },
  competition: {
    text: 'text-ak-text-primary',
    bg: 'bg-ak-surface-subtle',
    icon: Target,
    label: 'Runde',
    variant: 'neutral',
  },
};

// ============================================================================
// MOCK DATA
// ============================================================================

const DIARY_ENTRIES = [
  {
    id: 'e1',
    date: '2025-01-18',
    title: 'Driver-trening pa range',
    type: 'technical',
    duration: 90,
    rating: 4,
    energyLevel: 4,
    focus: 'Tempo og sekvens',
    reflection: 'God okt i dag. Tempoet begynner a sitte. Fokuserte pa 1-2-3 rytmen og merket stor forbedring i konsistens. Clubhead speed opp til 108 mph.',
    achievements: ['Ny toppfart 108 mph', '15 av 20 pa fairway-target'],
    improvements: ['Fortsatt litt rask overgang', 'Ma jobbe mer med hofterotasjon'],
    mood: 'positive',
    weather: 'sol',
    coachFeedback: 'Bra jobba! Fortsett med tempo-drillene.',
  },
  {
    id: 'e2',
    date: '2025-01-17',
    title: 'Kortspill og putting',
    type: 'short_game',
    duration: 75,
    rating: 5,
    energyLevel: 5,
    focus: 'Bunker og chip',
    reflection: 'Fantastisk okt! Alt klaffet med bunkerslag. Fikk 8 av 10 sand saves og folte meg veldig trygg. Chipping var ogsa bra med god avstandskontroll.',
    achievements: ['8/10 sand saves', 'Ny rekord i up-and-down challenge'],
    improvements: [],
    mood: 'excited',
    weather: 'overskyet',
    coachFeedback: null,
  },
  {
    id: 'e3',
    date: '2025-01-15',
    title: 'Styrketrening',
    type: 'physical',
    duration: 60,
    rating: 4,
    energyLevel: 3,
    focus: 'Core og rotasjon',
    reflection: 'Litt sliten for okten, men fikk gjennomfort alt. Ny PR i squat pa 100 kg! Core-ovelsene gar bedre og bedre. Merker at rotasjonskraften oker.',
    achievements: ['Ny squat PR: 100 kg', '90 sek planke'],
    improvements: ['Bedre oppvarming neste gang', 'Prioriter sovn'],
    mood: 'satisfied',
    weather: null,
    coachFeedback: null,
  },
  {
    id: 'e4',
    date: '2025-01-13',
    title: 'Mental trening',
    type: 'mental',
    duration: 45,
    rating: 3,
    energyLevel: 4,
    focus: 'Visualisering',
    reflection: 'Visualiseringsokten var utfordrende. Vanskelig a holde fokus i mer enn 10-15 min. Ma bygge opp gradvis. Pusteovelsene gikk bra.',
    achievements: ['Fullforte hele okten'],
    improvements: ['Kortere okter forst', 'Roligere omgivelser'],
    mood: 'neutral',
    weather: null,
    coachFeedback: 'Start med 10 min og bygg opp. Bruk appen for guidet visualisering.',
  },
  {
    id: 'e5',
    date: '2025-01-11',
    title: 'Full runde Asker GK',
    type: 'competition',
    duration: 240,
    rating: 3,
    energyLevel: 4,
    focus: 'Spillestrategi',
    reflection: 'Mikset runde. Startet sterkt med birdie pa 1 og 3, men mistet fokus etter en dobbel pa 7. Kortspillet reddet dagen. Ma jobbe med mental styrke etter feilslag.',
    achievements: ['3 birdies', 'Solid scrambling'],
    improvements: ['Mental reset etter darlige hull', 'Bedre klubbevalg pa par 3'],
    mood: 'neutral',
    weather: 'regn',
    coachFeedback: null,
  },
];

const STATS = {
  totalEntries: 45,
  thisMonth: 12,
  avgRating: 4.1,
  avgDuration: 85,
  streak: 5,
};

// ============================================================================
// HELPERS
// ============================================================================

const getMoodEmoji = (mood) => {
  switch (mood) {
    case 'excited': return '🔥';
    case 'positive': return '😊';
    case 'satisfied': return '👍';
    case 'neutral': return '😐';
    case 'frustrated': return '😤';
    default: return '📝';
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'I dag';
  if (date.toDateString() === yesterday.toDateString()) return 'I gar';
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
};

// ============================================================================
// RATING STARS
// ============================================================================

const RatingStars = ({ rating, size = 14 }) => (
  <div className="flex gap-0">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={size}
        fill={star <= rating ? '#F59E0B' : 'none'}
        className={star <= rating ? 'text-amber-500' : 'text-ak-border-default'}
      />
    ))}
  </div>
);

// ============================================================================
// DIARY ENTRY CARD
// ============================================================================

const DiaryEntryCard = ({ entry, onClick }) => {
  const typeConfig = TYPE_CLASSES[entry.type] || TYPE_CLASSES.competition;
  const TypeIcon = typeConfig.icon;

  return (
    <Card
      variant="default"
      padding="md"
      onClick={() => onClick(entry)}
      className="cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-lg ${typeConfig.bg} flex items-center justify-center shrink-0`}>
          <TypeIcon size={22} className={typeConfig.text} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div>
              <SubSectionTitle className="text-[15px] m-0">
                {entry.title}
              </SubSectionTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={typeConfig.variant} size="sm">{typeConfig.label}</Badge>
                <span className="text-xs text-ak-text-secondary">
                  {formatDate(entry.date)}
                </span>
                <span className="text-xs text-ak-text-secondary flex items-center gap-1">
                  <Clock size={12} />
                  {entry.duration} min
                </span>
                <span className="text-sm">
                  {getMoodEmoji(entry.mood)}
                </span>
              </div>
            </div>
            <RatingStars rating={entry.rating} />
          </div>

          <p className="text-[13px] text-ak-text-primary my-2 leading-[1.4] line-clamp-2">
            {entry.reflection}
          </p>

          {entry.achievements.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {entry.achievements.slice(0, 2).map((achievement, idx) => (
                <Badge key={idx} variant="success" size="sm">✓ {achievement}</Badge>
              ))}
            </div>
          )}
        </div>

        <ChevronRight size={18} className="text-ak-text-secondary shrink-0" />
      </div>
    </Card>
  );
};

// ============================================================================
// STATS OVERVIEW
// ============================================================================

const StatsOverview = ({ stats }) => (
  <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 mb-6">
    <Card variant="default" padding="sm" className="text-center">
      <div className="text-[22px] font-bold text-ak-primary">
        {stats.totalEntries}
      </div>
      <div className="text-[11px] text-ak-text-secondary">Totalt</div>
    </Card>
    <Card variant="default" padding="sm" className="text-center">
      <div className="text-[22px] font-bold text-ak-status-success">
        {stats.thisMonth}
      </div>
      <div className="text-[11px] text-ak-text-secondary">Denne mnd</div>
    </Card>
    <Card variant="default" padding="sm" className="text-center">
      <div className="flex items-center justify-center gap-0">
        <span className="text-[22px] font-bold text-amber-500">
          {stats.avgRating}
        </span>
        <Star size={14} fill="#F59E0B" className="text-amber-500" />
      </div>
      <div className="text-[11px] text-ak-text-secondary">Snittrating</div>
    </Card>
    <Card variant="default" padding="sm" className="text-center">
      <div className="text-[22px] font-bold text-ak-text-primary">
        {stats.avgDuration}
      </div>
      <div className="text-[11px] text-ak-text-secondary">Min/økt</div>
    </Card>
    <Card variant="default" padding="sm" className="text-center">
      <div className="text-[22px] font-bold text-ak-status-error flex items-center justify-center gap-1">
        🔥 {stats.streak}
      </div>
      <div className="text-[11px] text-ak-text-secondary">Streak</div>
    </Card>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TreningsdagbokContainer = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch diary entries from API
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/training-diary');
        setEntries(response.data?.data || response.data || DIARY_ENTRIES);
      } catch (err) {
        setError(err.message);
        setEntries(DIARY_ENTRIES);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const filters = [
    { key: 'all', label: 'Alle' },
    { key: 'technical', label: 'Teknikk' },
    { key: 'short_game', label: 'Kortspill' },
    { key: 'physical', label: 'Fysisk' },
    { key: 'mental', label: 'Mental' },
    { key: 'competition', label: 'Runder' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ak-surface-base">
        <StateCard variant="loading" title="Laster treningsdagbok..." />
      </div>
    );
  }

  const filteredEntries = entries.filter((e) => {
    const matchesFilter = filter === 'all' || e.type === filter;
    const matchesSearch = searchQuery === '' ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.reflection.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-ak-surface-base">
      <div className="p-0">
        {/* Error message */}
        {error && (
          <div className="p-3 bg-ak-status-error/15 rounded-lg mb-4 flex items-center gap-2">
            <AlertCircle size={16} className="text-ak-status-error" />
            <span className="text-[13px] text-ak-status-error">{error} (viser demo-data)</span>
          </div>
        )}

        {/* Stats */}
        <StatsOverview stats={{ ...STATS, totalEntries: entries.length }} />

        {/* Search and Filters */}
        <div className="mb-5">
          <Card variant="default" padding="sm" className="mb-3">
            <div className="flex items-center gap-2">
              <Search size={18} className="text-ak-text-secondary" />
              <input
                type="text"
                placeholder="Søk i dagboken..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-none outline-none text-sm text-ak-text-primary bg-transparent"
              />
            </div>
          </Card>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-1 overflow-x-auto">
              {filters.map((f) => (
                <Button
                  key={f.key}
                  variant={filter === f.key ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </Button>
              ))}
            </div>

            <Button variant="primary" size="sm" leftIcon={<Plus size={16} />}>
              Nytt innlegg
            </Button>
          </div>
        </div>

        {/* Entries List */}
        <div className="flex flex-col gap-2">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <DiaryEntryCard
                key={entry.id}
                entry={entry}
                onClick={() => {/* View entry details */}}
              />
            ))
          ) : (
            <StateCard
              variant="empty"
              icon={BookOpen}
              title="Ingen innlegg funnet"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TreningsdagbokContainer;
