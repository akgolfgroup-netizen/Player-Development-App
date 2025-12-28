import React, { useState, useEffect } from 'react';
import {
  BookOpen, ChevronRight, Plus, Star, Clock,
  Target, Dumbbell, Brain, Search, AlertCircle
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import Badge from '../../ui/primitives/Badge.primitive';
import StateCard from '../../ui/composites/StateCard';
import apiClient from '../../services/apiClient';

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

const getTypeConfig = (type) => {
  switch (type) {
    case 'technical':
      return { label: 'Teknikk', color: 'var(--accent)', icon: Target, variant: 'accent' };
    case 'short_game':
      return { label: 'Kortspill', color: 'var(--success)', icon: Target, variant: 'success' };
    case 'physical':
      return { label: 'Fysisk', color: 'var(--error)', icon: Dumbbell, variant: 'error' };
    case 'mental':
      return { label: 'Mental', color: 'var(--warning)', icon: Brain, variant: 'warning' };
    case 'competition':
      return { label: 'Runde', color: 'var(--text-primary)', icon: Target, variant: 'neutral' };
    default:
      return { label: type, color: 'var(--text-tertiary)', icon: BookOpen, variant: 'neutral' };
  }
};

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
  <div style={{ display: 'flex', gap: '2px' }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={size}
        fill={star <= rating ? 'var(--warning)' : 'none'}
        color={star <= rating ? 'var(--warning)' : 'var(--border-default)'}
      />
    ))}
  </div>
);

// ============================================================================
// DIARY ENTRY CARD
// ============================================================================

const DiaryEntryCard = ({ entry, onClick }) => {
  const typeConfig = getTypeConfig(entry.type);
  const TypeIcon = typeConfig.icon;

  return (
    <Card
      variant="default"
      padding="md"
      onClick={() => onClick(entry)}
      style={{ cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: `${typeConfig.color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <TypeIcon size={22} color={typeConfig.color} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
          }}>
            <div>
              <h3 style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0,
              }}>
                {entry.title}
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '4px',
              }}>
                <Badge variant={typeConfig.variant} size="sm">{typeConfig.label}</Badge>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {formatDate(entry.date)}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <Clock size={12} />
                  {entry.duration} min
                </span>
                <span style={{ fontSize: '14px' }}>
                  {getMoodEmoji(entry.mood)}
                </span>
              </div>
            </div>
            <RatingStars rating={entry.rating} />
          </div>

          <p style={{
            fontSize: '13px',
            color: 'var(--text-primary)',
            margin: '8px 0',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {entry.reflection}
          </p>

          {entry.achievements.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {entry.achievements.slice(0, 2).map((achievement, idx) => (
                <Badge key={idx} variant="success" size="sm">✓ {achievement}</Badge>
              ))}
            </div>
          )}
        </div>

        <ChevronRight size={18} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
      </div>
    </Card>
  );
};

// ============================================================================
// STATS OVERVIEW
// ============================================================================

const StatsOverview = ({ stats }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '10px',
    marginBottom: '24px',
  }}>
    <Card variant="default" padding="sm" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent)' }}>
        {stats.totalEntries}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Totalt</div>
    </Card>
    <Card variant="default" padding="sm" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--success)' }}>
        {stats.thisMonth}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Denne mnd</div>
    </Card>
    <Card variant="default" padding="sm" style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
        <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--warning)' }}>
          {stats.avgRating}
        </span>
        <Star size={14} fill="var(--warning)" color="var(--warning)" />
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Snittrating</div>
    </Card>
    <Card variant="default" padding="sm" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
        {stats.avgDuration}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Min/okt</div>
    </Card>
    <Card variant="default" padding="sm" style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: '22px',
        fontWeight: 700,
        color: 'var(--error)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
      }}>
        🔥 {stats.streak}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Streak</div>
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
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
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <PageHeader
        title="Treningsdagbok"
        subtitle="Logg og reflekter over dine okter"
      />

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Stats */}
        {error && (
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-error-subtle)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} color="var(--error)" />
            <span style={{ fontSize: '13px', color: 'var(--error)' }}>{error} (viser demo-data)</span>
          </div>
        )}
        <StatsOverview stats={{ ...STATS, totalEntries: entries.length }} />

        {/* Search and Filters */}
        <div style={{ marginBottom: '20px' }}>
          <Card variant="default" padding="sm" style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={18} color="var(--text-tertiary)" />
              <input
                type="text"
                placeholder="Sok i dagboken..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  backgroundColor: 'transparent',
                }}
              />
            </div>
          </Card>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
