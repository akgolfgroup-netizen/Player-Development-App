import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Clock,
  Target,
  Users,
  Dumbbell,
  ChevronRight,
  Copy,
  Edit2,
  Trash2,
  MoreVertical,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tokens as designTokens } from '../../design-tokens';

interface TrainingTemplate {
  id: string;
  name: string;
  description: string;
  category: 'putting' | 'fullspill' | 'kortspill' | 'fysisk' | 'mental' | 'blandet';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  exerciseCount: number;
  targetGroup?: string;
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
  isOwn: boolean;
  exercises: {
    name: string;
    duration: number;
  }[];
}

const mockTemplates: TrainingTemplate[] = [
  {
    id: '1',
    name: 'Putting Mastery - Nybegynner',
    description: 'Komplett treningsøkt for å bygge grunnleggende putting-ferdigheter.',
    category: 'putting',
    difficulty: 'beginner',
    duration: 45,
    exerciseCount: 4,
    targetGroup: 'Kategori C',
    createdAt: '2024-11-01',
    lastUsed: '2025-01-18',
    usageCount: 28,
    isOwn: true,
    exercises: [
      { name: 'Gate Putting Drill', duration: 10 },
      { name: 'Ladder Drill', duration: 15 },
      { name: 'Circle Challenge', duration: 10 },
      { name: 'Pressure Putts', duration: 10 }
    ]
  },
  {
    id: '2',
    name: 'WANG Treningsøkt',
    description: 'Standard treningsøkt for WANG Toppidrett-gruppa med fokus på alle aspekter.',
    category: 'blandet',
    difficulty: 'intermediate',
    duration: 90,
    exerciseCount: 6,
    targetGroup: 'WANG Toppidrett',
    createdAt: '2024-10-15',
    lastUsed: '2025-01-19',
    usageCount: 45,
    isOwn: true,
    exercises: [
      { name: 'Warm-up Routine', duration: 10 },
      { name: 'Iron Precision', duration: 20 },
      { name: 'Wedge Clock System', duration: 20 },
      { name: 'Putting Challenge', duration: 20 },
      { name: 'Bunker Basics', duration: 10 },
      { name: 'Cool-down', duration: 10 }
    ]
  },
  {
    id: '3',
    name: 'Kortspill Intensive',
    description: 'Fokusert økt på wedges, chipping og pitching for bedre scoring.',
    category: 'kortspill',
    difficulty: 'intermediate',
    duration: 60,
    exerciseCount: 5,
    createdAt: '2024-09-20',
    lastUsed: '2025-01-16',
    usageCount: 32,
    isOwn: true,
    exercises: [
      { name: 'Wedge Distance Control', duration: 15 },
      { name: 'Chip and Run', duration: 10 },
      { name: 'Flop Shot Practice', duration: 10 },
      { name: 'Up and Down Challenge', duration: 15 },
      { name: 'Scoring Zone Test', duration: 10 }
    ]
  },
  {
    id: '4',
    name: 'Turneringsforbreding',
    description: 'Mental og fysisk forberedelse før viktige turneringer.',
    category: 'mental',
    difficulty: 'advanced',
    duration: 75,
    exerciseCount: 5,
    targetGroup: 'Turneringsspillere',
    createdAt: '2024-08-10',
    lastUsed: '2025-01-12',
    usageCount: 18,
    isOwn: true,
    exercises: [
      { name: 'Pre-Shot Routine', duration: 15 },
      { name: 'Pressure Simulation', duration: 20 },
      { name: 'Course Visualization', duration: 15 },
      { name: 'Focus Training', duration: 15 },
      { name: 'Recovery Breathing', duration: 10 }
    ]
  },
  {
    id: '5',
    name: 'Styrketrening for Golf',
    description: 'Fysisk treningsprogram for bedre kraft og stabilitet i svingen.',
    category: 'fysisk',
    difficulty: 'intermediate',
    duration: 45,
    exerciseCount: 6,
    createdAt: '2024-12-01',
    lastUsed: '2025-01-17',
    usageCount: 22,
    isOwn: false,
    exercises: [
      { name: 'Dynamic Warm-up', duration: 5 },
      { name: 'Core Stability', duration: 10 },
      { name: 'Rotational Power', duration: 10 },
      { name: 'Lower Body Strength', duration: 10 },
      { name: 'Flexibility Work', duration: 5 },
      { name: 'Cool-down Stretches', duration: 5 }
    ]
  }
];

export const CoachExerciseTemplates: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    let templates = [...mockTemplates];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== 'all') {
      templates = templates.filter(t => t.category === categoryFilter);
    }

    return templates;
  }, [searchQuery, categoryFilter]);

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      putting: 'Putting',
      fullspill: 'Full spill',
      kortspill: 'Kort spill',
      fysisk: 'Fysisk',
      mental: 'Mental',
      blandet: 'Blandet'
    };
    return labels[cat] || cat;
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      putting: { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a' },
      fullspill: { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb' },
      kortspill: { bg: 'rgba(168, 85, 247, 0.1)', text: '#7c3aed' },
      fysisk: { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626' },
      mental: { bg: 'rgba(236, 72, 153, 0.1)', text: '#db2777' },
      blandet: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' }
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Aldri brukt';
    const date = new Date(dateString);
    return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  };

  return (
    <div style={{ padding: '24px', backgroundColor: designTokens.colors.background.primary, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOpen size={24} color="white" />
            </div>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: designTokens.colors.text.primary,
                margin: 0
              }}>
                Treningsplaner
              </h1>
              <p style={{
                fontSize: '14px',
                color: designTokens.colors.text.secondary,
                margin: 0
              }}>
                {mockTemplates.length} maler tilgjengelig
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/coach/exercises/templates/create')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: designTokens.colors.primary[500],
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} />
          Ny treningsplan
        </button>
      </div>

      {/* Search and Filter */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '400px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: designTokens.colors.text.tertiary
            }}
          />
          <input
            type="text"
            placeholder="Søk i treningsplaner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              borderRadius: '10px',
              border: `1px solid ${designTokens.colors.border.light}`,
              backgroundColor: designTokens.colors.background.card,
              fontSize: '14px',
              color: designTokens.colors.text.primary,
              outline: 'none'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { key: 'all', label: 'Alle' },
            { key: 'putting', label: 'Putting' },
            { key: 'kortspill', label: 'Kort spill' },
            { key: 'blandet', label: 'Blandet' },
            { key: 'fysisk', label: 'Fysisk' }
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: categoryFilter === cat.key
                  ? designTokens.colors.primary[500]
                  : designTokens.colors.background.card,
                color: categoryFilter === cat.key
                  ? 'white'
                  : designTokens.colors.text.secondary,
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredTemplates.map((template) => {
          const catColor = getCategoryColor(template.category);
          const isExpanded = expandedTemplate === template.id;

          return (
            <div
              key={template.id}
              style={{
                backgroundColor: designTokens.colors.background.card,
                borderRadius: '16px',
                border: `1px solid ${designTokens.colors.border.light}`,
                overflow: 'hidden'
              }}
            >
              {/* Main Content */}
              <div style={{
                padding: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px'
              }}>
                {/* Icon */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  backgroundColor: catColor.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <BookOpen size={24} color={catColor.text} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <h3 style={{
                      fontSize: '17px',
                      fontWeight: '600',
                      color: designTokens.colors.text.primary,
                      margin: 0
                    }}>
                      {template.name}
                    </h3>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '600',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: catColor.bg,
                      color: catColor.text
                    }}>
                      {getCategoryLabel(template.category)}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '500',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: designTokens.colors.background.secondary,
                      color: designTokens.colors.text.secondary
                    }}>
                      {getDifficultyLabel(template.difficulty)}
                    </span>
                    {template.isOwn && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '500',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        color: '#059669'
                      }}>
                        Egen
                      </span>
                    )}
                  </div>

                  <p style={{
                    fontSize: '13px',
                    color: designTokens.colors.text.secondary,
                    margin: '0 0 12px 0',
                    lineHeight: '1.5'
                  }}>
                    {template.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color={designTokens.colors.text.tertiary} />
                      <span style={{ fontSize: '12px', color: designTokens.colors.text.secondary }}>
                        {template.duration} min
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Dumbbell size={14} color={designTokens.colors.text.tertiary} />
                      <span style={{ fontSize: '12px', color: designTokens.colors.text.secondary }}>
                        {template.exerciseCount} øvelser
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Target size={14} color={designTokens.colors.text.tertiary} />
                      <span style={{ fontSize: '12px', color: designTokens.colors.text.secondary }}>
                        {template.usageCount}x brukt
                      </span>
                    </div>
                    {template.targetGroup && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={14} color={designTokens.colors.text.tertiary} />
                        <span style={{ fontSize: '12px', color: designTokens.colors.text.secondary }}>
                          {template.targetGroup}
                        </span>
                      </div>
                    )}
                    <span style={{ fontSize: '12px', color: designTokens.colors.text.tertiary }}>
                      Sist brukt: {formatDate(template.lastUsed)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={() => setExpandedTemplate(isExpanded ? null : template.id)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: `1px solid ${designTokens.colors.border.light}`,
                      backgroundColor: 'transparent',
                      color: designTokens.colors.text.secondary,
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {isExpanded ? 'Skjul' : 'Vis øvelser'}
                    <ChevronRight
                      size={14}
                      style={{
                        transform: isExpanded ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  </button>
                  <button
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: designTokens.colors.primary[500],
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Play size={14} />
                    Bruk
                  </button>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setActiveMenu(activeMenu === template.id ? null : template.id)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        border: `1px solid ${designTokens.colors.border.light}`,
                        backgroundColor: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <MoreVertical size={16} color={designTokens.colors.text.secondary} />
                    </button>
                    {activeMenu === template.id && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '4px',
                        backgroundColor: designTokens.colors.background.card,
                        borderRadius: '10px',
                        border: `1px solid ${designTokens.colors.border.light}`,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        zIndex: 100,
                        minWidth: '160px',
                        overflow: 'hidden'
                      }}>
                        <button
                          onClick={() => setActiveMenu(null)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            color: designTokens.colors.text.primary
                          }}
                        >
                          <Edit2 size={14} />
                          Rediger
                        </button>
                        <button
                          onClick={() => setActiveMenu(null)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            color: designTokens.colors.text.primary
                          }}
                        >
                          <Copy size={14} />
                          Dupliser
                        </button>
                        <button
                          onClick={() => setActiveMenu(null)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            color: '#dc2626'
                          }}
                        >
                          <Trash2 size={14} />
                          Slett
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Exercise List */}
              {isExpanded && (
                <div style={{
                  padding: '0 20px 20px',
                  borderTop: `1px solid ${designTokens.colors.border.light}`,
                  marginTop: '-4px',
                  paddingTop: '16px'
                }}>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: designTokens.colors.text.secondary,
                    margin: '0 0 12px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Øvelser i denne planen
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {template.exercises.map((exercise, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 14px',
                          backgroundColor: designTokens.colors.background.secondary,
                          borderRadius: '8px'
                        }}
                      >
                        <span style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: designTokens.colors.primary[100],
                          color: designTokens.colors.primary[600],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {idx + 1}
                        </span>
                        <span style={{
                          flex: 1,
                          fontSize: '14px',
                          color: designTokens.colors.text.primary
                        }}>
                          {exercise.name}
                        </span>
                        <span style={{
                          fontSize: '12px',
                          color: designTokens.colors.text.tertiary
                        }}>
                          {exercise.duration} min
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: designTokens.colors.background.card,
          borderRadius: '16px',
          border: `1px solid ${designTokens.colors.border.light}`
        }}>
          <BookOpen size={48} color={designTokens.colors.text.tertiary} style={{ marginBottom: '16px' }} />
          <p style={{
            fontSize: '16px',
            color: designTokens.colors.text.secondary,
            margin: '0 0 16px 0'
          }}>
            {searchQuery ? 'Ingen treningsplaner funnet' : 'Ingen treningsplaner opprettet ennå'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => navigate('/coach/exercises/templates/create')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: designTokens.colors.primary[500],
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} />
              Opprett første treningsplan
            </button>
          )}
        </div>
      )}

      {/* Click outside to close menu */}
      {activeMenu && (
        <div
          onClick={() => setActiveMenu(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50
          }}
        />
      )}
    </div>
  );
};

export default CoachExerciseTemplates;
