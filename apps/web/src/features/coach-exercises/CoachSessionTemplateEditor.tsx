/**
 * AK Golf Academy - Coach Session Template Editor
 * Design System v3.0 - Blue Palette 01
 *
 * Drag-and-drop editor for creating and editing training session templates.
 */

import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  GripVertical,
  Trash2,
  Clock,
  Edit3,
  Copy,
  Search,
  X,
  Check,
  Dumbbell,
} from 'lucide-react';
import { tokens } from '../../design-tokens';

// Types
interface Exercise {
  id: string;
  name: string;
  category: 'teknikk' | 'putting' | 'kort_spill' | 'langt_spill' | 'bane' | 'mental' | 'fysisk';
  duration: number;
  description?: string;
  order: number;
}

interface SessionTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetGroup?: string;
  exercises: Exercise[];
}

// Exercise library for selection
const exerciseLibrary: Omit<Exercise, 'order'>[] = [
  { id: 'lib1', name: 'Oppvarming', category: 'fysisk', duration: 10, description: 'Dynamisk oppvarming med fokus på rotasjon' },
  { id: 'lib2', name: 'Grip og stance', category: 'teknikk', duration: 15, description: 'Grunnleggende posisjonering' },
  { id: 'lib3', name: 'Jern 7 drill', category: 'teknikk', duration: 20, description: 'Repetert drill med jern 7' },
  { id: 'lib4', name: 'Gate drill', category: 'putting', duration: 15, description: 'Putting gjennom porter' },
  { id: 'lib5', name: 'Avstandskontroll', category: 'putting', duration: 20, description: 'Fokus på lengde og tempo' },
  { id: 'lib6', name: 'Konkurranseputting', category: 'putting', duration: 15, description: 'Simulert konkurransesituasjon' },
  { id: 'lib7', name: 'Chipping teknikk', category: 'kort_spill', duration: 20, description: 'Grunnleggende chipping' },
  { id: 'lib8', name: 'Pitching variasjon', category: 'kort_spill', duration: 20, description: 'Varierende avstander og høyder' },
  { id: 'lib9', name: 'Bunker exit', category: 'kort_spill', duration: 15, description: 'Grunnleggende bunkerteknikk' },
  { id: 'lib10', name: '9 hull simulering', category: 'bane', duration: 90, description: 'Simulert runde med fokusområder' },
  { id: 'lib11', name: 'Kursanalyse', category: 'mental', duration: 30, description: 'Strategisk planlegging' },
  { id: 'lib12', name: 'Driver teknikk', category: 'langt_spill', duration: 25, description: 'Fokus på driveoff' },
  { id: 'lib13', name: 'Fairway wood', category: 'langt_spill', duration: 20, description: 'Teknikk for 3-wood og 5-wood' },
  { id: 'lib14', name: 'Core stabilitet', category: 'fysisk', duration: 15, description: 'Kjernestyrke for golf' },
  { id: 'lib15', name: 'Visualisering', category: 'mental', duration: 15, description: 'Mental forberedelse' },
];

// Category config
const categoryConfig: Record<string, { bg: string; text: string; label: string }> = {
  teknikk: { bg: `${tokens.colors.primary}15`, text: tokens.colors.primary, label: 'Teknikk' },
  putting: { bg: `${tokens.colors.success}15`, text: tokens.colors.success, label: 'Putting' },
  kort_spill: { bg: `${tokens.colors.gold}15`, text: tokens.colors.gold, label: 'Kort spill' },
  langt_spill: { bg: `${tokens.colors.primaryLight}15`, text: tokens.colors.primaryLight, label: 'Langt spill' },
  bane: { bg: `${tokens.colors.warning}15`, text: tokens.colors.warning, label: 'Bane' },
  mental: { bg: '#8B5CF615', text: '#8B5CF6', label: 'Mental' },
  fysisk: { bg: `${tokens.colors.error}15`, text: tokens.colors.error, label: 'Fysisk' },
};

export default function CoachSessionTemplateEditor() {
  const navigate = useNavigate();
  const { templateId } = useParams<{ templateId: string }>();
  const isEditing = !!templateId;

  // Template state
  const [template, setTemplate] = useState<SessionTemplate>({
    id: templateId || `template-${Date.now()}`,
    name: '',
    description: '',
    category: 'blandet',
    difficulty: 'intermediate',
    targetGroup: '',
    exercises: [],
  });

  // UI state
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [editingExercise, setEditingExercise] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Drag & Drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    // Make the drag image transparent
    const elem = e.currentTarget as HTMLElement;
    elem.style.opacity = '0.5';
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const elem = e.currentTarget as HTMLElement;
    elem.style.opacity = '1';
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  }, [draggedIndex]);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newExercises = [...template.exercises];
    const [draggedExercise] = newExercises.splice(draggedIndex, 1);
    newExercises.splice(dropIndex, 0, draggedExercise);

    // Update order property
    const reorderedExercises = newExercises.map((ex, idx) => ({
      ...ex,
      order: idx + 1,
    }));

    setTemplate({ ...template, exercises: reorderedExercises });
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [draggedIndex, template]);

  // Exercise management
  const addExercise = useCallback((libraryExercise: Omit<Exercise, 'order'>) => {
    const newExercise: Exercise = {
      ...libraryExercise,
      id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: template.exercises.length + 1,
    };
    setTemplate({
      ...template,
      exercises: [...template.exercises, newExercise],
    });
  }, [template]);

  const removeExercise = useCallback((exerciseId: string) => {
    const newExercises = template.exercises
      .filter((ex) => ex.id !== exerciseId)
      .map((ex, idx) => ({ ...ex, order: idx + 1 }));
    setTemplate({ ...template, exercises: newExercises });
  }, [template]);

  const duplicateExercise = useCallback((exercise: Exercise) => {
    const duplicate: Exercise = {
      ...exercise,
      id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: template.exercises.length + 1,
    };
    setTemplate({
      ...template,
      exercises: [...template.exercises, duplicate],
    });
  }, [template]);

  const updateExercise = useCallback((exerciseId: string, updates: Partial<Exercise>) => {
    setTemplate({
      ...template,
      exercises: template.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, ...updates } : ex
      ),
    });
  }, [template]);

  // Calculate total duration
  const totalDuration = template.exercises.reduce((sum, ex) => sum + ex.duration, 0);

  // Filter exercise library
  const filteredLibrary = exerciseLibrary.filter((ex) => {
    if (!exerciseSearch) return true;
    const query = exerciseSearch.toLowerCase();
    return (
      ex.name.toLowerCase().includes(query) ||
      ex.category.toLowerCase().includes(query) ||
      categoryConfig[ex.category]?.label.toLowerCase().includes(query)
    );
  });

  // Save template
  const handleSave = async () => {
    if (!template.name.trim()) {
      alert('Vennligst gi malen et navn');
      return;
    }
    if (template.exercises.length === 0) {
      alert('Legg til minst en ovelse');
      return;
    }

    setIsSaving(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate('/coach/exercises/templates');
    } catch (error) {
      console.error('Failed to save template:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: tokens.colors.snow,
        fontFamily: tokens.typography.fontFamily,
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: tokens.colors.white,
          borderBottom: `1px solid ${tokens.colors.gray300}`,
          padding: '16px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/coach/exercises/templates')}
              style={{
                width: 40,
                height: 40,
                borderRadius: tokens.radius.md,
                backgroundColor: tokens.colors.gray100,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={20} color={tokens.colors.charcoal} />
            </button>
            <div>
              <h1 style={{ ...tokens.typography.title2, color: tokens.colors.charcoal, margin: 0 }}>
                {isEditing ? 'Rediger mal' : 'Ny treningsmal'}
              </h1>
              <p style={{ ...tokens.typography.caption1, color: tokens.colors.steel, margin: '2px 0 0' }}>
                Dra og slipp for a omorganisere ovelser
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/coach/exercises/templates')}
              style={{
                padding: '10px 18px',
                backgroundColor: tokens.colors.gray100,
                color: tokens.colors.charcoal,
                border: 'none',
                borderRadius: tokens.radius.md,
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Avbryt
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.white,
                border: 'none',
                borderRadius: tokens.radius.md,
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              <Save size={18} />
              {isSaving ? 'Lagrer...' : 'Lagre mal'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', padding: '24px' }}>
        {/* Main content - Exercise list */}
        <div style={{ flex: 1 }}>
          {/* Template info card */}
          <div
            style={{
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.radius.lg,
              padding: '20px',
              marginBottom: '20px',
              boxShadow: tokens.shadows.card,
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: tokens.colors.charcoal,
                    marginBottom: '6px',
                  }}
                >
                  Malnavn *
                </label>
                <input
                  type="text"
                  value={template.name}
                  onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                  placeholder="F.eks. Putting Mastery"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: tokens.radius.md,
                    border: `1px solid ${tokens.colors.gray300}`,
                    fontSize: '14px',
                    color: tokens.colors.charcoal,
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: tokens.colors.charcoal,
                    marginBottom: '6px',
                  }}
                >
                  Malgruppe
                </label>
                <input
                  type="text"
                  value={template.targetGroup}
                  onChange={(e) => setTemplate({ ...template, targetGroup: e.target.value })}
                  placeholder="F.eks. WANG Toppidrett, Kategori A"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: tokens.radius.md,
                    border: `1px solid ${tokens.colors.gray300}`,
                    fontSize: '14px',
                    color: tokens.colors.charcoal,
                    outline: 'none',
                  }}
                />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: tokens.colors.charcoal,
                  marginBottom: '6px',
                }}
              >
                Beskrivelse
              </label>
              <textarea
                value={template.description}
                onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                placeholder="Kort beskrivelse av malen..."
                rows={2}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: tokens.radius.md,
                  border: `1px solid ${tokens.colors.gray300}`,
                  fontSize: '14px',
                  color: tokens.colors.charcoal,
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: tokens.colors.charcoal,
                    marginBottom: '6px',
                  }}
                >
                  Vanskelighetsgrad
                </label>
                <select
                  value={template.difficulty}
                  onChange={(e) =>
                    setTemplate({ ...template, difficulty: e.target.value as any })
                  }
                  style={{
                    padding: '10px 14px',
                    borderRadius: tokens.radius.md,
                    border: `1px solid ${tokens.colors.gray300}`,
                    fontSize: '14px',
                    color: tokens.colors.charcoal,
                    backgroundColor: tokens.colors.white,
                  }}
                >
                  <option value="beginner">Nybegynner</option>
                  <option value="intermediate">Middels</option>
                  <option value="advanced">Avansert</option>
                </select>
              </div>
            </div>
          </div>

          {/* Exercise list header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ ...tokens.typography.headline, color: tokens.colors.charcoal, margin: 0 }}>
                Ovelser ({template.exercises.length})
              </h2>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  backgroundColor: `${tokens.colors.primary}10`,
                  borderRadius: tokens.radius.full,
                }}
              >
                <Clock size={14} color={tokens.colors.primary} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: tokens.colors.primary }}>
                  {totalDuration} min
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowExerciseLibrary(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.white,
                border: 'none',
                borderRadius: tokens.radius.md,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              Legg til ovelse
            </button>
          </div>

          {/* Drag and drop exercise list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {template.exercises.length === 0 ? (
              <div
                style={{
                  backgroundColor: tokens.colors.white,
                  borderRadius: tokens.radius.lg,
                  padding: '48px 24px',
                  textAlign: 'center',
                  border: `2px dashed ${tokens.colors.gray300}`,
                }}
              >
                <Dumbbell size={48} color={tokens.colors.gray300} style={{ marginBottom: '16px' }} />
                <h3 style={{ ...tokens.typography.headline, color: tokens.colors.charcoal, margin: 0 }}>
                  Ingen ovelser lagt til
                </h3>
                <p
                  style={{
                    ...tokens.typography.subheadline,
                    color: tokens.colors.steel,
                    margin: '8px 0 20px',
                  }}
                >
                  Klikk "Legg til ovelse" for a begynne
                </p>
                <button
                  onClick={() => setShowExerciseLibrary(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: tokens.colors.primary,
                    color: tokens.colors.white,
                    border: 'none',
                    borderRadius: tokens.radius.md,
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={18} />
                  Legg til forste ovelse
                </button>
              </div>
            ) : (
              template.exercises.map((exercise, index) => {
                const catConfig = categoryConfig[exercise.category] || {
                  bg: tokens.colors.gray100,
                  text: tokens.colors.steel,
                  label: exercise.category,
                };
                const isEditing = editingExercise === exercise.id;
                const isDragging = draggedIndex === index;
                const isDragOver = dragOverIndex === index;

                return (
                  <div
                    key={exercise.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    style={{
                      backgroundColor: tokens.colors.white,
                      borderRadius: tokens.radius.md,
                      boxShadow: isDragging ? tokens.shadows.elevated : tokens.shadows.card,
                      overflow: 'hidden',
                      opacity: isDragging ? 0.5 : 1,
                      transform: isDragOver ? 'scale(1.02)' : 'none',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      borderTop: isDragOver ? `3px solid ${tokens.colors.primary}` : 'none',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 16px',
                      }}
                    >
                      {/* Drag handle */}
                      <div
                        style={{
                          cursor: 'grab',
                          padding: '4px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <GripVertical size={20} color={tokens.colors.gray300} />
                      </div>

                      {/* Order number */}
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          backgroundColor: tokens.colors.primary,
                          color: tokens.colors.white,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1 }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={exercise.name}
                              onChange={(e) =>
                                updateExercise(exercise.id, { name: e.target.value })
                              }
                              style={{
                                flex: 1,
                                padding: '6px 10px',
                                borderRadius: tokens.radius.sm,
                                border: `1px solid ${tokens.colors.gray300}`,
                                fontSize: '14px',
                              }}
                            />
                            <input
                              type="number"
                              value={exercise.duration}
                              onChange={(e) =>
                                updateExercise(exercise.id, {
                                  duration: parseInt(e.target.value) || 0,
                                })
                              }
                              style={{
                                width: 60,
                                padding: '6px 10px',
                                borderRadius: tokens.radius.sm,
                                border: `1px solid ${tokens.colors.gray300}`,
                                fontSize: '14px',
                              }}
                            />
                            <span style={{ fontSize: '12px', color: tokens.colors.steel }}>min</span>
                            <button
                              onClick={() => setEditingExercise(null)}
                              style={{
                                padding: '6px',
                                backgroundColor: tokens.colors.success,
                                color: tokens.colors.white,
                                border: 'none',
                                borderRadius: tokens.radius.sm,
                                cursor: 'pointer',
                              }}
                            >
                              <Check size={16} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  ...tokens.typography.subheadline,
                                  fontWeight: 500,
                                  color: tokens.colors.charcoal,
                                }}
                              >
                                {exercise.name}
                              </span>
                              <span
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 600,
                                  padding: '2px 6px',
                                  backgroundColor: catConfig.bg,
                                  color: catConfig.text,
                                  borderRadius: '4px',
                                }}
                              >
                                {catConfig.label}
                              </span>
                            </div>
                            {exercise.description && (
                              <p
                                style={{
                                  ...tokens.typography.caption1,
                                  color: tokens.colors.steel,
                                  margin: '2px 0 0',
                                }}
                              >
                                {exercise.description}
                              </p>
                            )}
                          </>
                        )}
                      </div>

                      {/* Duration */}
                      {!isEditing && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            backgroundColor: tokens.colors.gray50,
                            borderRadius: tokens.radius.sm,
                          }}
                        >
                          <Clock size={14} color={tokens.colors.steel} />
                          <span style={{ fontSize: '12px', fontWeight: 500, color: tokens.colors.charcoal }}>
                            {exercise.duration} min
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      {!isEditing && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => setEditingExercise(exercise.id)}
                            title="Rediger"
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: tokens.radius.sm,
                              backgroundColor: tokens.colors.gray100,
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Edit3 size={14} color={tokens.colors.charcoal} />
                          </button>
                          <button
                            onClick={() => duplicateExercise(exercise)}
                            title="Dupliser"
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: tokens.radius.sm,
                              backgroundColor: tokens.colors.gray100,
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Copy size={14} color={tokens.colors.charcoal} />
                          </button>
                          <button
                            onClick={() => removeExercise(exercise.id)}
                            title="Slett"
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: tokens.radius.sm,
                              backgroundColor: `${tokens.colors.error}10`,
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={14} color={tokens.colors.error} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar - Preview */}
        <div style={{ width: 300, flexShrink: 0 }}>
          <div
            style={{
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.radius.lg,
              padding: '20px',
              boxShadow: tokens.shadows.card,
              position: 'sticky',
              top: 100,
            }}
          >
            <h3
              style={{
                ...tokens.typography.headline,
                color: tokens.colors.charcoal,
                margin: '0 0 16px',
              }}
            >
              Forhandsvisning
            </h3>

            <div
              style={{
                padding: '16px',
                backgroundColor: tokens.colors.gray50,
                borderRadius: tokens.radius.md,
              }}
            >
              <h4
                style={{
                  ...tokens.typography.subheadline,
                  fontWeight: 600,
                  color: tokens.colors.charcoal,
                  margin: 0,
                }}
              >
                {template.name || 'Uten navn'}
              </h4>
              {template.description && (
                <p
                  style={{
                    ...tokens.typography.caption1,
                    color: tokens.colors.steel,
                    margin: '4px 0 0',
                  }}
                >
                  {template.description}
                </p>
              )}

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: `1px solid ${tokens.colors.gray200}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} color={tokens.colors.steel} />
                  <span style={{ fontSize: '12px', color: tokens.colors.steel }}>
                    {totalDuration} min
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Dumbbell size={14} color={tokens.colors.steel} />
                  <span style={{ fontSize: '12px', color: tokens.colors.steel }}>
                    {template.exercises.length} ovelser
                  </span>
                </div>
              </div>
            </div>

            {template.exercises.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <h4
                  style={{
                    ...tokens.typography.footnote,
                    color: tokens.colors.steel,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    margin: '0 0 8px',
                  }}
                >
                  Ovelsesrekkef olge
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {template.exercises.map((ex, idx) => (
                    <div
                      key={ex.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 8px',
                        backgroundColor: tokens.colors.gray50,
                        borderRadius: tokens.radius.sm,
                      }}
                    >
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          backgroundColor: tokens.colors.primary,
                          color: tokens.colors.white,
                          fontSize: '10px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: tokens.colors.charcoal,
                          flex: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {ex.name}
                      </span>
                      <span style={{ fontSize: '11px', color: tokens.colors.steel }}>
                        {ex.duration}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exercise library modal */}
      {showExerciseLibrary && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 100,
            }}
            onClick={() => setShowExerciseLibrary(false)}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.radius.lg,
              width: 600,
              maxWidth: '90vw',
              maxHeight: '80vh',
              overflow: 'hidden',
              zIndex: 101,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal header */}
            <div
              style={{
                padding: '20px',
                borderBottom: `1px solid ${tokens.colors.gray200}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h2 style={{ ...tokens.typography.title3, color: tokens.colors.charcoal, margin: 0 }}>
                Velg ovelse
              </h2>
              <button
                onClick={() => setShowExerciseLibrary(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: tokens.colors.gray100,
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} color={tokens.colors.charcoal} />
              </button>
            </div>

            {/* Search */}
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${tokens.colors.gray200}` }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  backgroundColor: tokens.colors.gray100,
                  borderRadius: tokens.radius.md,
                }}
              >
                <Search size={18} color={tokens.colors.steel} />
                <input
                  type="text"
                  placeholder="Sok etter ovelse..."
                  value={exerciseSearch}
                  onChange={(e) => setExerciseSearch(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    color: tokens.colors.charcoal,
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Exercise list */}
            <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredLibrary.map((exercise) => {
                  const catConfig = categoryConfig[exercise.category] || {
                    bg: tokens.colors.gray100,
                    text: tokens.colors.steel,
                    label: exercise.category,
                  };

                  return (
                    <div
                      key={exercise.id}
                      onClick={() => {
                        addExercise(exercise);
                        setShowExerciseLibrary(false);
                        setExerciseSearch('');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        backgroundColor: tokens.colors.gray50,
                        borderRadius: tokens.radius.md,
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = tokens.colors.gray100;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = tokens.colors.gray50;
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: tokens.radius.sm,
                          backgroundColor: catConfig.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Dumbbell size={20} color={catConfig.text} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              ...tokens.typography.subheadline,
                              fontWeight: 500,
                              color: tokens.colors.charcoal,
                            }}
                          >
                            {exercise.name}
                          </span>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 600,
                              padding: '2px 6px',
                              backgroundColor: catConfig.bg,
                              color: catConfig.text,
                              borderRadius: '4px',
                            }}
                          >
                            {catConfig.label}
                          </span>
                        </div>
                        {exercise.description && (
                          <p
                            style={{
                              ...tokens.typography.caption1,
                              color: tokens.colors.steel,
                              margin: '2px 0 0',
                            }}
                          >
                            {exercise.description}
                          </p>
                        )}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          backgroundColor: tokens.colors.white,
                          borderRadius: tokens.radius.sm,
                        }}
                      >
                        <Clock size={12} color={tokens.colors.steel} />
                        <span style={{ fontSize: '11px', color: tokens.colors.charcoal }}>
                          {exercise.duration} min
                        </span>
                      </div>
                      <Plus size={18} color={tokens.colors.primary} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
