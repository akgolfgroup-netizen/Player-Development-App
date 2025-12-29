import React, { useState, useMemo, useEffect } from 'react';
import {
  Star,
  Search,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Target,
  Users,
  Copy,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import { exercisesAPI } from '../../services/api';

interface MyExercise {
  id: string;
  name: string;
  description: string;
  category: 'putting' | 'driving' | 'iron' | 'wedge' | 'bunker' | 'mental' | 'fitness';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  equipment: string[];
  createdAt: string;
  lastUsed: string;
  usageCount: number;
  assignedTo: number;
  isCustom: boolean;
}

const mockMyExercises: MyExercise[] = [
  {
    id: '1',
    name: 'Pre-Shot Routine',
    description: 'Bygg en konsistent pre-shot rutine for bedre fokus og konsistens.',
    category: 'mental',
    difficulty: 'beginner',
    duration: 15,
    equipment: ['Hvilken som helst kølle', 'Baller'],
    createdAt: '2024-11-15',
    lastUsed: '2025-01-18',
    usageCount: 25,
    assignedTo: 8,
    isCustom: true
  },
  {
    id: '2',
    name: 'Core Stability for Golf',
    description: 'Styrkeøvelser for bedre rotasjon og stabilitet i svingen.',
    category: 'fitness',
    difficulty: 'intermediate',
    duration: 30,
    equipment: ['Matte', 'Kettlebell'],
    createdAt: '2024-10-20',
    lastUsed: '2025-01-17',
    usageCount: 15,
    assignedTo: 5,
    isCustom: true
  },
  {
    id: '3',
    name: 'WANG Putting Challenge',
    description: 'Konkurransebasert putting-øvelse med poengssystem.',
    category: 'putting',
    difficulty: 'intermediate',
    duration: 20,
    equipment: ['Putter', 'Baller', 'Markører'],
    createdAt: '2024-12-01',
    lastUsed: '2025-01-19',
    usageCount: 32,
    assignedTo: 12,
    isCustom: true
  },
  {
    id: '4',
    name: 'Gate Putting Drill',
    description: 'Tren presisjon med porter satt opp rundt koppen. Fokuser på linjekontroll.',
    category: 'putting',
    difficulty: 'beginner',
    duration: 15,
    equipment: ['Putter', 'Tees', 'Baller'],
    createdAt: '2024-09-01',
    lastUsed: '2025-01-16',
    usageCount: 45,
    assignedTo: 15,
    isCustom: false
  },
  {
    id: '5',
    name: 'Wedge Clock System',
    description: 'Lær å kontrollere avstand med ulike backswing-posisjoner.',
    category: 'wedge',
    difficulty: 'advanced',
    duration: 35,
    equipment: ['Wedges', 'Baller', 'Markører'],
    createdAt: '2024-08-15',
    lastUsed: '2025-01-15',
    usageCount: 38,
    assignedTo: 10,
    isCustom: false
  }
];

export const CoachMyExercises: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'custom' | 'saved'>('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [exercises, setExercises] = useState<MyExercise[]>(mockMyExercises);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch exercises from API
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await exercisesAPI.getAll();
        const data = response.data?.data || response.data || mockMyExercises;
        setExercises(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Kunne ikke laste øvelser');
        setExercises(mockMyExercises);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const filteredExercises = useMemo(() => {
    let exerciseList = [...exercises];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      exerciseList = exerciseList.filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
      );
    }

    if (filterType === 'custom') {
      exerciseList = exerciseList.filter(e => e.isCustom);
    } else if (filterType === 'saved') {
      exerciseList = exerciseList.filter(e => !e.isCustom);
    }

    return exerciseList;
  }, [searchQuery, filterType, exercises]);

  const stats = useMemo(() => ({
    total: exercises.length,
    custom: exercises.filter(e => e.isCustom).length,
    saved: exercises.filter(e => !e.isCustom).length
  }), [exercises]);

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
      putting: { bg: 'rgba(34, 197, 94, 0.1)', text: 'var(--ak-status-success)' },
      driving: { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb' },
      iron: { bg: 'rgba(99, 102, 241, 0.1)', text: '#4f46e5' },
      wedge: { bg: 'rgba(168, 85, 247, 0.1)', text: '#7c3aed' },
      bunker: { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--ak-status-warning)' },
      mental: { bg: 'rgba(236, 72, 153, 0.1)', text: '#db2777' },
      fitness: { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--ak-status-error)' }
    };
    return colors[cat] || { bg: 'var(--ak-surface-elevated)', text: 'var(--ak-text-tertiary)' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleEdit = (exerciseId: string) => {
    navigate(`/coach/exercises/edit/${exerciseId}`);
  };

  const handleDuplicate = async (exerciseId: string) => {
    try {
      setActionLoading(exerciseId);
      const response = await exercisesAPI.duplicate(exerciseId);
      const newExercise = response.data?.data || response.data;
      if (newExercise) {
        setExercises(prev => [newExercise, ...prev]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kunne ikke duplisere øvelsen');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (exerciseId: string) => {
    if (!window.confirm('Er du sikker på at du vil slette denne øvelsen?')) return;

    try {
      setActionLoading(exerciseId);
      await exercisesAPI.delete(exerciseId);
      setExercises(prev => prev.filter(e => e.id !== exerciseId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kunne ikke slette øvelsen');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--ak-status-warning-light), var(--ak-status-warning))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Star size={24} color="white" />
            </div>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Mine øvelser
              </h1>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                margin: 0
              }}>
                {stats.custom} egne øvelser • {stats.saved} lagret fra biblioteket
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/coach/exercises/create')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: 'var(--accent)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} />
          Ny øvelse
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        padding: '4px',
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: '12px',
        width: 'fit-content'
      }}>
        {[
          { key: 'all', label: 'Alle', count: stats.total },
          { key: 'custom', label: 'Egne', count: stats.custom },
          { key: 'saved', label: 'Lagret', count: stats.saved }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key as typeof filterType)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: filterType === tab.key
                ? 'var(--bg-primary)'
                : 'transparent',
              color: filterType === tab.key
                ? 'var(--text-primary)'
                : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: filterType === tab.key
                ? '0 1px 3px rgba(0,0,0,0.1)'
                : 'none'
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '400px' }}>
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
          placeholder="Søk i mine øvelser..."
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

      {/* Exercise List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredExercises.map((exercise) => {
          const catColor = getCategoryColor(exercise.category);
          return (
            <div
              key={exercise.id}
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderRadius: '12px',
                padding: '16px 20px',
                border: `1px solid ${'var(--border-default)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              {/* Category Icon */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                backgroundColor: catColor.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Star
                  size={20}
                  color={catColor.text}
                  fill={exercise.isCustom ? catColor.text : 'none'}
                />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    margin: 0
                  }}>
                    {exercise.name}
                  </h3>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: catColor.bg,
                    color: catColor.text
                  }}>
                    {getCategoryLabel(exercise.category)}
                  </span>
                  {exercise.isCustom && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '500',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: 'var(--ak-success)'
                    }}>
                      Egen
                    </span>
                  )}
                </div>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  margin: '0 0 8px 0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {exercise.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} color={'var(--text-tertiary)'} />
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      {exercise.duration} min
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Target size={14} color={'var(--text-tertiary)'} />
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      {exercise.usageCount}x brukt
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={14} color={'var(--text-tertiary)'} />
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      {exercise.assignedTo} spillere
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    Sist brukt: {formatDate(exercise.lastUsed)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>
                <button
                  onClick={() => handleEdit(exercise.id)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: `1px solid ${'var(--border-default)'}`,
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Rediger"
                >
                  <Edit2 size={16} color={'var(--text-secondary)'} />
                </button>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setActiveMenu(activeMenu === exercise.id ? null : exercise.id)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: `1px solid ${'var(--border-default)'}`,
                      backgroundColor: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <MoreVertical size={16} color={'var(--text-secondary)'} />
                  </button>
                  {activeMenu === exercise.id && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '4px',
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: '10px',
                      border: `1px solid ${'var(--border-default)'}`,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      zIndex: 100,
                      minWidth: '160px',
                      overflow: 'hidden'
                    }}>
                      <button
                        onClick={() => {
                          handleDuplicate(exercise.id);
                          setActiveMenu(null);
                        }}
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
                          color: 'var(--text-primary)'
                        }}
                      >
                        <Copy size={14} />
                        Dupliser
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(exercise.id);
                          setActiveMenu(null);
                        }}
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
                          color: 'var(--ak-status-error)'
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
          <Star size={48} color={'var(--text-tertiary)'} style={{ marginBottom: '16px' }} />
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            margin: '0 0 16px 0'
          }}>
            {searchQuery ? 'Ingen øvelser funnet' : 'Du har ingen egne øvelser ennå'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => navigate('/coach/exercises/create')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'var(--accent)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} />
              Opprett første øvelse
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

export default CoachMyExercises;
