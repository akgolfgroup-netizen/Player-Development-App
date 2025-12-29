import React, { useState, useMemo } from 'react';
import {
  Dumbbell,
  Search,
  Clock,
  Target,
  Star,
  Plus,
  BookOpen,
  Video,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';

interface Exercise {
  id: string;
  name: string;
  description: string;
  category: 'putting' | 'driving' | 'iron' | 'wedge' | 'bunker' | 'mental' | 'fitness';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  equipment: string[];
  hasVideo: boolean;
  hasGuide: boolean;
  isFavorite: boolean;
  usageCount: number;
  rating: number;
  createdBy: 'system' | 'coach';
}

const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Gate Putting Drill',
    description: 'Tren presisjon med porter satt opp rundt koppen. Fokuser på linjekontroll.',
    category: 'putting',
    difficulty: 'beginner',
    duration: 15,
    equipment: ['Putter', 'Tees', 'Baller'],
    hasVideo: true,
    hasGuide: true,
    isFavorite: true,
    usageCount: 45,
    rating: 4.8,
    createdBy: 'system'
  },
  {
    id: '2',
    name: 'Ladder Drill',
    description: 'Sett opp markører i økende avstand. Tren avstandskontroll på green.',
    category: 'putting',
    difficulty: 'intermediate',
    duration: 20,
    equipment: ['Putter', 'Markører', 'Baller'],
    hasVideo: true,
    hasGuide: true,
    isFavorite: false,
    usageCount: 32,
    rating: 4.5,
    createdBy: 'system'
  },
  {
    id: '3',
    name: 'Alignment Stick Driver Drill',
    description: 'Bruk alignment sticks for å forbedre svingbane og klubbhode-posisjon.',
    category: 'driving',
    difficulty: 'intermediate',
    duration: 25,
    equipment: ['Driver', 'Alignment sticks', 'Baller'],
    hasVideo: true,
    hasGuide: true,
    isFavorite: true,
    usageCount: 28,
    rating: 4.7,
    createdBy: 'system'
  },
  {
    id: '4',
    name: 'Stock Shot Practice',
    description: 'Fokuser på å treffe samme avstand konsekvent med ulike jern.',
    category: 'iron',
    difficulty: 'intermediate',
    duration: 30,
    equipment: ['Jern 7-9', 'Baller', 'Avstandsmåler'],
    hasVideo: false,
    hasGuide: true,
    isFavorite: false,
    usageCount: 22,
    rating: 4.3,
    createdBy: 'system'
  },
  {
    id: '5',
    name: 'Wedge Clock System',
    description: 'Lær å kontrollere avstand med ulike backswing-posisjoner.',
    category: 'wedge',
    difficulty: 'advanced',
    duration: 35,
    equipment: ['Wedges', 'Baller', 'Markører'],
    hasVideo: true,
    hasGuide: true,
    isFavorite: true,
    usageCount: 38,
    rating: 4.9,
    createdBy: 'system'
  },
  {
    id: '6',
    name: 'Bunker Splash Drill',
    description: 'Øv på grunnleggende bunkerslag med fokus på sandkontakt.',
    category: 'bunker',
    difficulty: 'beginner',
    duration: 20,
    equipment: ['Sand wedge', 'Baller'],
    hasVideo: true,
    hasGuide: true,
    isFavorite: false,
    usageCount: 18,
    rating: 4.4,
    createdBy: 'system'
  },
  {
    id: '7',
    name: 'Pre-Shot Routine',
    description: 'Bygg en konsistent pre-shot rutine for bedre fokus og konsistens.',
    category: 'mental',
    difficulty: 'beginner',
    duration: 15,
    equipment: ['Hvilken som helst kølle', 'Baller'],
    hasVideo: true,
    hasGuide: true,
    isFavorite: false,
    usageCount: 25,
    rating: 4.6,
    createdBy: 'coach'
  },
  {
    id: '8',
    name: 'Core Stability for Golf',
    description: 'Styrkeøvelser for bedre rotasjon og stabilitet i svingen.',
    category: 'fitness',
    difficulty: 'intermediate',
    duration: 30,
    equipment: ['Matte', 'Kettlebell'],
    hasVideo: true,
    hasGuide: true,
    isFavorite: false,
    usageCount: 15,
    rating: 4.2,
    createdBy: 'coach'
  }
];

export const CoachExerciseLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredExercises = useMemo(() => {
    let exercises = [...mockExercises];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      exercises = exercises.filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== 'all') {
      exercises = exercises.filter(e => e.category === categoryFilter);
    }

    if (difficultyFilter !== 'all') {
      exercises = exercises.filter(e => e.difficulty === difficultyFilter);
    }

    return exercises;
  }, [searchQuery, categoryFilter, difficultyFilter]);

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      putting: 'Putting',
      driving: 'Driver',
      iron: 'Jernspill',
      wedge: 'Wedge',
      bunker: 'Bunker',
      mental: 'Mentalt',
      fitness: 'Fysisk'
    };
    return labels[cat] || cat;
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      putting: { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a' },
      driving: { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb' },
      iron: { bg: 'rgba(99, 102, 241, 0.1)', text: '#4f46e5' },
      wedge: { bg: 'rgba(168, 85, 247, 0.1)', text: '#7c3aed' },
      bunker: { bg: 'rgba(245, 158, 11, 0.1)', text: '#d97706' },
      mental: { bg: 'rgba(236, 72, 153, 0.1)', text: '#db2777' },
      fitness: { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626' }
    };
    return colors[cat] || { bg: '#f3f4f6', text: '#6b7280' };
  };

  const getDifficultyLabel = (diff: string) => {
    const labels: Record<string, string> = {
      beginner: 'Nybegynner',
      intermediate: 'Middels',
      advanced: 'Avansert'
    };
    return labels[diff] || diff;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner': return '#16a34a';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      {/* Header - using PageHeader from design system */}
      <PageHeader
        title="Øvelsesbank"
        subtitle={`${mockExercises.length} øvelser tilgjengelig`}
        actions={
          <Button variant="primary" onClick={() => navigate('/coach/exercises/create')} leftIcon={<Plus size={18} />}>
            Ny øvelse
          </Button>
        }
      />

      {/* Quick Links */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => navigate('/coach/exercises/mine')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '10px',
            border: `1px solid ${'var(--border-default)'}`,
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          <Star size={16} />
          Mine øvelser
        </button>
        <button
          onClick={() => navigate('/coach/exercises/templates')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '10px',
            border: `1px solid ${'var(--border-default)'}`,
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          <BookOpen size={16} />
          Treningsplaner
        </button>
      </div>

      {/* Search and Filters */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)'
            }}
          />
          <input
            type="text"
            placeholder="Søk etter øvelser..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              borderRadius: '10px',
              border: `1px solid ${'var(--border-default)'}`,
              backgroundColor: 'var(--bg-primary)',
              fontSize: '14px',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            border: `1px solid ${'var(--border-default)'}`,
            backgroundColor: 'var(--bg-primary)',
            fontSize: '14px',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
        >
          <option value="all">Alle kategorier</option>
          <option value="putting">Putting</option>
          <option value="driving">Driver</option>
          <option value="iron">Jernspill</option>
          <option value="wedge">Wedge</option>
          <option value="bunker">Bunker</option>
          <option value="mental">Mentalt</option>
          <option value="fitness">Fysisk</option>
        </select>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            border: `1px solid ${'var(--border-default)'}`,
            backgroundColor: 'var(--bg-primary)',
            fontSize: '14px',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
        >
          <option value="all">Alle nivåer</option>
          <option value="beginner">Nybegynner</option>
          <option value="intermediate">Middels</option>
          <option value="advanced">Avansert</option>
        </select>
      </div>

      {/* Exercise Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '16px'
      }}>
        {filteredExercises.map((exercise) => {
          const catColor = getCategoryColor(exercise.category);
          return (
            <div
              key={exercise.id}
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderRadius: '16px',
                padding: '20px',
                border: `1px solid ${'var(--border-default)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: catColor.bg,
                    color: catColor.text
                  }}>
                    {getCategoryLabel(exercise.category)}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '500',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-tertiary)',
                    color: getDifficultyColor(exercise.difficulty)
                  }}>
                    {getDifficultyLabel(exercise.difficulty)}
                  </span>
                </div>
                {exercise.isFavorite && (
                  <Star size={18} color="#f59e0b" fill="#f59e0b" />
                )}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: '0 0 8px 0'
              }}>
                {exercise.name}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                margin: '0 0 16px 0',
                lineHeight: '1.5',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {exercise.description}
              </p>

              {/* Meta */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} color={'var(--text-tertiary)'} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {exercise.duration} min
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Target size={14} color={'var(--text-tertiary)'} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {exercise.usageCount}x brukt
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={14} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {exercise.rating}
                  </span>
                </div>
              </div>

              {/* Resources */}
              <div style={{
                display: 'flex',
                gap: '8px',
                paddingTop: '12px',
                borderTop: `1px solid ${'var(--border-default)'}`
              }}>
                {exercise.hasVideo && (
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#dc2626',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    <Video size={14} />
                    Video
                  </button>
                )}
                {exercise.hasGuide && (
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: '#2563eb',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    <FileText size={14} />
                    Guide
                  </button>
                )}
                <button style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  <Plus size={14} />
                  Legg til
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExercises.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '16px',
          border: `1px solid ${'var(--border-default)'}`
        }}>
          <Dumbbell size={48} color={'var(--text-tertiary)'} style={{ marginBottom: '16px' }} />
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            Ingen øvelser funnet med valgte filtre
          </p>
        </div>
      )}
    </div>
  );
};

export default CoachExerciseLibrary;
